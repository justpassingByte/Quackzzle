import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/prisma/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { gameId, playerId, answer, score, timeSpent, currentQuestion, isLastQuestion } = body

    // Cập nhật điểm số cho player
    await prisma.player.update({
      where: { id: playerId },
      data: {
        score: {
          increment: score
        }
      }
    })

    // Lấy game data mới nhất sau khi cập nhật điểm
    const updatedGame = await prisma.game.findUnique({
      where: { id: gameId },
      include: {
        players: {
          orderBy: {
            score: 'desc'
          }
        },
        playerQuestions: {
          include: {
            question: true
          }
        }
      }
    })

    // Nếu là câu hỏi cuối, thêm player vào danh sách đã hoàn thành
    if (isLastQuestion) {
      await prisma.game.update({
        where: { id: gameId },
        data: {
          completedPlayers: {
            push: playerId
          }
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        game: updatedGame,
        scoreEarned: score
      }
    })

  } catch (error) {
    console.error('Submit answer error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to submit answer' },
      { status: 500 }
    )
  }
}