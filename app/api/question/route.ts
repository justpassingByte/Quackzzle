import { prisma } from '@/prisma/prisma'
import { handleApiError } from '@/lib/utils/api-helpers'
import { CreateQuestionRequest, ApiResponse } from '@/types/api'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const questionSet = url.searchParams.get('questionSet')
    
    if (!questionSet) {
      return NextResponse.json({
        success: false,
        error: 'Question set is required'
      }, { status: 400 })
    }

    const totalQuestions = await prisma.question.count({
      where: {
        questionSet: questionSet
      }
    })
    
    const questions = await prisma.question.findMany({
      where: {
        questionSet: questionSet
      },
      take: 10,
      skip: Math.max(0, Math.floor(Math.random() * (totalQuestions - 10))),
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        content: true,
        image: true,
        options: true,
        correctAnswer: true,
        category: true,
        createdBy: true,
        createdAt: true
      }
    })

    const shuffledQuestions = questions.sort(() => Math.random() - 0.5)

    const response: ApiResponse = {
      success: true,
      data: { 
        questions: shuffledQuestions.slice(0, 10)
      }
    }

    return NextResponse.json(response, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
  } catch (error) {
    const errorResponse = await handleApiError(error)
    return NextResponse.json(errorResponse, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { content, options, correctAnswer, category, createdBy }: CreateQuestionRequest = await req.json()

    if (!content || !options || !correctAnswer || !category || !createdBy) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 })
    }

    if (!options.includes(correctAnswer)) {
      return NextResponse.json({
        success: false,
        error: 'Correct answer must be one of the options'
      }, { status: 400 })
    }

    const question = await prisma.question.create({
      data: {
        content,
        options,
        correctAnswer,
        category,
        createdBy
      }
    })

    const response: ApiResponse = {
      success: true,
      data: { question }
    }

    return NextResponse.json(response, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
  } catch (error) {
    const errorResponse = await handleApiError(error)
    return NextResponse.json(errorResponse, { status: 500 })
  }
}