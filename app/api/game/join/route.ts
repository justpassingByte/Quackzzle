import { prisma } from '@/prisma/prisma'
import { handleApiError } from '@/lib/utils/api-helpers'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { gameCode, playerName } = await req.json()

    if (!gameCode || !playerName) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 })
    }

    // Kiểm tra game tồn tại
    const game = await prisma.game.findUnique({
      where: { gameCode }
    })

    if (!game) {
      return NextResponse.json({
        success: false,
        error: 'Game not found'
      }, { status: 404 })
    }

    // Tạo player mới
    const player = await prisma.player.create({
      data: {
        name: playerName,
        score: 0,
        timeSpent: 0,
        game: {
          connect: { gameCode }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: { 
        player,
        gameCode 
      }
    })

  } catch (error) {
    console.error('Join game error:', error)
    const errorResponse = handleApiError(error)
    return NextResponse.json(errorResponse, { status: 500 })
  }
}