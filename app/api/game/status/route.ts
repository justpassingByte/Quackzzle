import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Player } from '@/types/api';
const prisma = new PrismaClient();

async function generateQuestionsForPlayer(questionSet: string, numQuestions: number = 10) {
  console.log('Fetching questions for set:', questionSet);

  try {
    const questions = await prisma.question.findMany({
      where: { 
        questionSet: questionSet || 'A'
      },
      take: numQuestions
    });
    
    if (!questions || questions.length === 0) {
      throw new Error(`No questions found for questionSet: ${questionSet}`);
    }

    return questions.sort(() => Math.random() - 0.5);
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { gameCode, status, questionSet = 'A' } = await request.json();
    console.log('Received request body:', { gameCode, status, questionSet });

    if (!gameCode) {
      return NextResponse.json({ success: false, error: 'Game code is required' }, { status: 400 });
    }

    const game = await prisma.game.findUnique({
      where: { gameCode },
      include: { players: true }
    });

    if (!game) {
      return NextResponse.json({ success: false, error: 'Game not found' }, { status: 404 });
    }

    if (status === 'PLAYING') {
      try {
        await prisma.playerQuestion.deleteMany({
          where: { gameId: game.id }
        });

        const nonHostPlayers = game.players.filter((player: Player) => player.id !== game.hostId);
        
        for (const player of nonHostPlayers) {
          const questions = await generateQuestionsForPlayer(questionSet);
          
          for (const question of questions) {
            await prisma.playerQuestion.create({
              data: {
                playerId: player.id,
                gameId: game.id,
                questionId: question.id
              }
            });
          }
        }

        const updatedGame = await prisma.game.update({
          where: { gameCode },
          data: {
            status: 'PLAYING',
            currentRound: 0,
            completedPlayers: []
          },
          include: {
            players: true,
            playerQuestions: {
              include: {
                question: true
              }
            }
          }
        });

        return NextResponse.json({
          success: true,
          data: { game: updatedGame }
        });
      } catch (error) {
        console.error('Error during game start:', error);
        throw error;
      }
    } else if (status === 'WAITING') {
      await prisma.playerQuestion.deleteMany({
        where: { gameId: game.id }
      });

      const updatedGame = await prisma.game.update({
        where: { gameCode },
        data: {
          status: 'WAITING',
          currentRound: 0,
          completedPlayers: [],
          players: {
            updateMany: {
              where: { gameId: game.id },
              data: { score: 0 }
            }
          }
        },
        include: {
          players: true
        }
      });

      return NextResponse.json({
        success: true,
        data: { game: updatedGame }
      });
    } else {
      const updatedGame = await prisma.game.update({
        where: { gameCode },
        data: { status },
        include: {
          players: true
        }
      });

      return NextResponse.json({
        success: true,
        data: { game: updatedGame }
      });
    }

  } catch (error) {
    console.error('Update game status error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update game status',
        details: JSON.stringify(error)
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
