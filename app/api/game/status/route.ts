import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Player } from '@/types/api';
const prisma = new PrismaClient();

// Tối ưu hóa: Cache lại các câu hỏi để tránh truy vấn lặp lại
const questionsCache = new Map();

async function generateQuestionsForPlayer(questionSet: string, numQuestions: number = 10) {
  // Sử dụng cache để tránh truy vấn lặp lại
  const cacheKey = `questions_${questionSet}`;
  
  if (questionsCache.has(cacheKey)) {
    console.log('Using cached questions for set:', questionSet);
    const cachedQuestions = questionsCache.get(cacheKey);
    // Trả về bản sao của các câu hỏi đã trộn
    return [...cachedQuestions].sort(() => Math.random() - 0.5).slice(0, numQuestions);
  }
  
  console.log('Fetching questions for set:', questionSet);

  try {
    // Lấy tất cả câu hỏi một lần, thay vì nhiều lần cho mỗi người chơi
    const questions = await prisma.question.findMany({
      where: { 
        questionSet: questionSet || 'A'
      },
      // Chỉ lấy các trường cần thiết để giảm kích thước dữ liệu
      select: {
        id: true,
        content: true,
        options: true,
        correctAnswer: true,
        image: true,
        videoUrl: true,
        answerImage: true,
        answerExplanation: true
      }
    });
    
    if (!questions || questions.length === 0) {
      throw new Error(`No questions found for questionSet: ${questionSet}`);
    }
    
    // Lưu vào cache
    questionsCache.set(cacheKey, questions);
    
    // Trả về phiên bản đã trộn và cắt ngắn
    return questions.sort(() => Math.random() - 0.5).slice(0, numQuestions);
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

    // Kiểm tra game tồn tại
    const game = await prisma.game.findUnique({
      where: { gameCode },
      include: { 
        players: {
          // Chỉ chọn các trường cần thiết
          select: {
            id: true,
            name: true,
            score: true
          }
        }
      }
    });

    if (!game) {
      return NextResponse.json({ success: false, error: 'Game not found' }, { status: 404 });
    }

    if (status === 'PLAYING') {
      try {
        // Xóa tất cả playerQuestions hiện có
        await prisma.playerQuestion.deleteMany({
          where: { gameId: game.id }
        });

        // Lọc ra người chơi không phải host
        const nonHostPlayers = game.players.filter((player: Player) => player.id !== game.hostId);
        
        if (nonHostPlayers.length === 0) {
          // Nếu không có người chơi nào, chỉ cập nhật trạng thái game
          const updatedGame = await prisma.game.update({
            where: { gameCode },
            data: {
              status: 'PLAYING',
              currentRound: 0,
              completedPlayers: []
            },
            include: {
              players: true
            }
          });

          return NextResponse.json({
            success: true,
            data: { game: updatedGame }
          });
        }
        
        // Lấy tất cả câu hỏi một lần
        const allQuestions = await generateQuestionsForPlayer(questionSet, 20);
        
        // Chuẩn bị dữ liệu cho createMany để tránh nhiều lệnh gọi insert
        const playerQuestionsData: { playerId: string; gameId: string; questionId: string }[] = [];
        
        // Tạo mảng dữ liệu cho tất cả câu hỏi của tất cả người chơi
        for (const player of nonHostPlayers) {
          // Trộn và chọn 10 câu hỏi cho mỗi người chơi
          const playerQuestions = [...allQuestions]
            .sort(() => Math.random() - 0.5)
            .slice(0, 10);
          
          // Thêm vào danh sách createMany
          playerQuestions.forEach(question => {
            playerQuestionsData.push({
              playerId: player.id,
              gameId: game.id,
              questionId: question.id
            });
          });
        }
        
        // Tạo tất cả câu hỏi cho người chơi trong một lệnh gọi
        if (playerQuestionsData.length > 0) {
          await prisma.playerQuestion.createMany({
            data: playerQuestionsData
          });
        }

        // Cập nhật trạng thái game
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
      // Xóa tất cả câu hỏi của người chơi hiện có
      await prisma.playerQuestion.deleteMany({
        where: { gameId: game.id }
      });

      // Cập nhật trạng thái game
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
      // Chỉ cập nhật trạng thái
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
