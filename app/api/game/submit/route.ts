import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/prisma/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { gameId, playerId, answer, timeSpent, currentQuestion } = body

    console.log('Received answer:', {
      answer,
      timeSpent,
      gameId,
      playerId,
      currentQuestion
    })

    const game = await prisma.game.findUnique({
      where: { id: gameId },
      include: {
        questions: true,
        players: true
      }
    })

    if (!game) {
      return NextResponse.json({ success: false, error: 'Game not found' })
    }

    const questionData = game.questions[currentQuestion]
    
    console.log('Question check:', {
      questionContent: questionData.content,
      playerAnswer: answer,
      correctAnswer: questionData.correctAnswer,
      questionIndex: currentQuestion
    })

    const isCorrect = answer.trim() === questionData.correctAnswer.trim()
    
    const scoreEarned = isCorrect ? Math.max(10, Math.floor((30 - timeSpent) * 0.5)) : 0

    await prisma.player.update({
      where: { id: playerId },
      data: {
        score: { increment: scoreEarned }
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        answer: {
          correctAnswer: questionData.correctAnswer,
          isCorrect,
          playerAnswer: answer
        },
        scoreEarned
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