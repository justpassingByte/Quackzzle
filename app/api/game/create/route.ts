import { prisma } from '@/prisma/prisma'
import { NextResponse } from 'next/server'

function generateGameCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

export async function POST(request: Request) {
  try {
    // 1. Parse request body
    const body = await request.json()
    const hostId = body.hostId

    if (!hostId) {
      return NextResponse.json({
        error: 'Host ID is required'
      }, {
        status: 400
      })
    }

    // 2. Create game
    const game = await prisma.game.create({
      data: {
        gameCode: generateGameCode(),
        hostId,
        status: 'WAITING',
        currentRound: 0,
        questions: {
          create: []
        }
      }
    })

    // 3. Return response
    return NextResponse.json({
      success: true,
      game
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({
      error: 'Internal server error'
    }, {
      status: 500
    })
  }
}