import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { gameCode, status, questions } = body

    console.log('Received request body:', { gameCode, status, questions });

    let updateData: any = {}

    if (status === 'WAITING') {
      updateData = {
        status,
        currentRound: 0,
        completedPlayers: [],
        questions: {
          set: []
        },
        players: {
          updateMany: {
            where: {},
            data: { score: 0 }
          }
        }
      }
    } else if (status === 'PLAYING' && Array.isArray(questions)) {
      // Lấy ID của game hiện tại
      const currentGame = await prisma.game.findUnique({
        where: { gameCode }
      });

      if (!currentGame) {
        throw new Error('Game not found');
      }

      // Tạo câu hỏi mới và liên kết với game
      const questionIds = questions.map(q => q.id);

      updateData = {
        status,
        questions: {
          connect: questionIds.map(id => ({ id }))
        }
      }
    } else {
      updateData = { status }
    }

    console.log('Update data for Prisma:', updateData);

    const game = await prisma.game.update({
      where: { gameCode },
      data: updateData,
      include: {
        players: true,
        questions: true
      }
    })

    console.log('Updated game:', game);

    return NextResponse.json({
      success: true,
      data: { game }
    })
  } catch (error) {
    console.error('Update game status error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update game status',
        details: error
      },
      { status: 500 }
    )
  }
}