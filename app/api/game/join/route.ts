import { prisma } from '@/prisma/prisma'
import { handleApiError } from '@/lib/utils/api-helpers'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { gameCode, playerName } = body
    
    console.log('Join game request:', { gameCode, playerName })

    if (!gameCode || !playerName) {
      console.log('Missing required fields:', { gameCode, playerName })
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 })
    }

    // Kiểm tra game tồn tại
    console.log('Looking for game with code:', gameCode)
    const game = await prisma.game.findUnique({
      where: { gameCode }
    })

    if (!game) {
      console.log('Game not found with code:', gameCode)
      return NextResponse.json({
        success: false,
        error: 'Game not found'
      }, { status: 404 })
    }
    
    console.log('Found game:', { id: game.id, gameCode: game.gameCode, status: game.status })

    // Tạo player mới
    console.log('Creating new player for game:', { gameCode, playerName })
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
    
    console.log('Created player:', { id: player.id, name: player.name })

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