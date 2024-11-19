'use client'

import React, { useEffect } from 'react'
import Image from 'next/image'

interface QuestionProps {
  content: string
  image?: string
  options: string[]
  answerImage?: string
  timeLeft: number
  onAnswer: (answer: string) => void
  disabled?: boolean
  currentQuestion: number
  totalQuestions: number
  selectedAnswer?: string
  correctAnswer?: string
  isAnswered: boolean
  scoreEarned?: number
}

export function QuestionCard({
  content,
  image,
  options,
  answerImage,
  timeLeft,
  onAnswer,
  disabled,
  currentQuestion,
  totalQuestions,
  selectedAnswer,
  correctAnswer,
  isAnswered,
  scoreEarned
}: QuestionProps) {
  useEffect(() => {
    console.log('Question changed:', {
      content,
      selectedAnswer,
      correctAnswer,
      isAnswered
    })
  }, [content])

  const getOptionClass = (option: string) => {
    if (!isAnswered) {
      return disabled 
        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
        : 'bg-white/60 hover:bg-white/90 active:bg-white text-gray-700 hover:shadow-md'
    }

    if (option === correctAnswer) {
      return 'bg-green-50 border-2 border-green-500 text-green-700'
    }

    if (option === selectedAnswer && option !== correctAnswer) {
      return 'bg-red-50 border-2 border-red-500 text-red-700'
    }

    return 'bg-gray-50 text-gray-400'
  }

  useEffect(() => {
    console.log({
      selectedAnswer,
      correctAnswer,
      isCorrect: selectedAnswer === correctAnswer
    })
  }, [selectedAnswer, correctAnswer])

  useEffect(() => {
    console.log('QuestionCard state:', {
      selectedAnswer,
      correctAnswer,
      isAnswered,
      scoreEarned,
      disabled
    });
  }, [selectedAnswer, correctAnswer, isAnswered, scoreEarned, disabled]);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 md:p-8 shadow-lg border border-purple-100">
      {/* Timer và Progress */}
      <div className="mb-6 md:mb-8">
        <div className="flex justify-between items-center mb-3">
          <span className="text-base md:text-lg font-medium text-gray-700">
            Câu {currentQuestion + 1}/{totalQuestions}
          </span>
          <span className={`font-bold text-lg md:text-xl ${
            timeLeft <= 5 ? 'text-red-600 animate-pulse' : 'text-gray-700'
          }`}>
            {timeLeft}s
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 md:h-3">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ${
              timeLeft <= 5 ? 'bg-red-500' : 'bg-blue-500'
            }`}
            style={{ width: `${(timeLeft / 60) * 100}%` }}
          />
        </div>
      </div>

      {/* Câu hỏi */}
      <h3 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 leading-relaxed text-gray-800">
        {content}
      </h3>

      {/* Ảnh - Chỉ hiển thị ảnh câu hỏi khi chưa trả lời hoặc ảnh giải thích khi đã trả lời */}
      <div className="mb-6 md:mb-8">
        {isAnswered && answerImage ? (
          <div className="transition-all duration-300 ease-in-out">
            <Image 
              src={answerImage}
              alt="Answer explanation"
              width={600}
              height={300}
              className="w-full h-auto rounded-xl mx-auto shadow-lg object-contain"
              style={{ maxHeight: '300px' }}
            />
            <p className="text-center text-sm text-gray-600 mt-2">Giải thích đáp án</p>
          </div>
        ) : image ? (
          <div className="transition-all duration-300 ease-in-out">
            <Image 
              src={image}
              alt="Question illustration"
              width={600}
              height={300}
              className="w-full h-auto rounded-xl mx-auto shadow-lg object-contain"
              style={{ maxHeight: '300px' }}
            />
          </div>
        ) : null}
      </div>

      {/* Đáp án */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswer(option)}
            disabled={disabled}
            className={`
              p-4 md:p-6 rounded-xl text-left transition-all duration-200 
              hover:scale-[1.01] focus:scale-[1.01]
              relative border border-purple-100
              ${getOptionClass(option)}
              disabled:cursor-not-allowed
              group
            `}
          >
            <div className="flex items-start gap-3">
              <span className="text-sm font-medium text-gray-400 mb-1">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="text-base md:text-lg font-medium">
                {option}
              </span>
            </div>
            {isAnswered && option === correctAnswer && (
              <span className="absolute top-3 right-3 text-green-500 text-xl md:text-2xl">
                ✓
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Kết quả */}
      {isAnswered && (
        <div className="mt-6">
          <div className={`
            text-center font-bold text-xl md:text-2xl animate-fade-in
            ${scoreEarned ? 'text-green-600' : 'text-red-600'}
          `}>
            {scoreEarned ? (
              <>
                <span className="text-2xl md:text-3xl">✓</span> 
                <div>Chính xác! +{scoreEarned} điểm</div>
              </>
            ) : (
              <>
                <span className="text-2xl md:text-3xl">✗</span> 
                <div>Sai rồi! Đáp án đúng là: {correctAnswer}</div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}