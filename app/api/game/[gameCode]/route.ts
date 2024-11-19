import { prisma } from '@/prisma/prisma'
import { handleApiError, validateGameCode } from '@/lib/utils/api-helpers'
import { ApiResponse } from '@/types/api'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const gameCode = request.nextUrl.pathname.split('/').pop()

    if (!gameCode) {
      return NextResponse.json({
        success: false,
        error: 'Game code is required'
      }, { status: 400 })
    }

    if (!validateGameCode(gameCode)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid game code format'
      }, { status: 400 })
    }

    const game = await prisma.game.findUnique({
      where: { gameCode },
      include: {
        players: true,
        playerQuestions: {
          include: {
            question: true
          }
        }
      }
    })

    if (!game) {
      return NextResponse.json({
        success: false,
        error: 'Game not found'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: { game }
    })

  } catch (error) {
    console.error('Error fetching game:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch game' },
      { status: 500 }
    )
  }
}