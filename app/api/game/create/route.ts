import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Tạo mã game ngẫu nhiên có độ dài 6, chỉ bao gồm chữ cái hoa và số
function generateGameCode(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  console.log('Generated game code:', result);
  return result;
}

// POST /api/game/create
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Create game request body:', body);
    
    const { hostId } = body;

    if (!hostId) {
      return NextResponse.json({
        success: false,
        error: 'Host ID is required'
      }, { status: 400 });
    }

    // Tạo mã game
    const gameCode = generateGameCode();
    console.log('Creating game with code:', gameCode);

    // Tạo game trong database
    const game = await prisma.game.create({
      data: {
        gameCode,
        hostId,
        status: 'WAITING',
        players: {
          create: {
            name: 'Host',
            score: 0,
            timeSpent: 0
          }
        }
      },
      include: {
        players: true
      }
    });

    console.log('Game created successfully:', {
      id: game.id,
      gameCode: game.gameCode,
      hostId: game.hostId
    });

    return NextResponse.json({
      success: true,
      data: { game }
    });

  } catch (error) {
    console.error('Create game error:', error);
    
    return NextResponse.json(
      { success: false, error: 'Failed to create game' },
      { status: 500 }
    );
  }
}