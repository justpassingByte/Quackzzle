'use client'

import React, { useEffect } from 'react'

interface QuestionProps {
  content: string
  options: string[]
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

export function Question({
  content,
  options,
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
        ? 'bg-gray-700 cursor-not-allowed opacity-50'
        : 'bg-white/5 hover:bg-white/20 active:bg-white/30'
    }

    if (option === correctAnswer) {
      return 'bg-green-500/20 border-2 border-green-500'
    }

    if (option === selectedAnswer && option !== correctAnswer) {
      return 'bg-red-500/20 border-2 border-red-500'
    }

    return 'bg-white/5 opacity-50'
  }

  useEffect(() => {
    console.log({
      selectedAnswer,
      correctAnswer,
      isCorrect: selectedAnswer === correctAnswer
    })
  }, [selectedAnswer, correctAnswer])

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
      {/* Timer và Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span>Câu {currentQuestion + 1}/{totalQuestions}</span>
          <span className={`font-bold ${timeLeft <= 5 ? 'text-red-400' : ''}`}>
            {timeLeft}s
          </span>
        </div>
        <div className="w-full bg-gray-600 rounded-full h-2.5">
          <div 
            className={`h-2.5 rounded-full transition-all duration-1000 ${
              timeLeft <= 5 ? 'bg-red-500' : 'bg-blue-500'
            }`}
            style={{ width: `${(timeLeft / 30) * 100}%` }}
          />
        </div>
      </div>

      {/* Câu hỏi */}
      <h3 className="text-xl font-bold mb-6">{content}</h3>

      {/* Đáp án */}
      <div className="grid grid-cols-2 gap-4">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswer(option)}
            disabled={disabled}
            className={`
              p-4 rounded-lg text-left transition relative
              ${getOptionClass(option)}
            `}
          >
            <span className="text-sm text-gray-400 mb-1 block">
              {String.fromCharCode(65 + index)}
            </span>
            {option}
            {isAnswered && option === correctAnswer && (
              <span className="absolute top-2 right-2 text-green-400 text-xl">✓</span>
            )}
          </button>
        ))}
      </div>

      {/* Chỉ hiển thị kết quả khi có correctAnswer và scoreEarned */}
      {correctAnswer && (
        <div className={`
          mt-4 text-center font-bold text-xl
          ${scoreEarned ? 'text-green-400' : 'text-red-400'}
        `}>
          {scoreEarned ? (
            <>
              <span className="text-2xl">✓</span> Chính xác! +{scoreEarned} điểm
            </>
          ) : (
            <>
              <span className="text-2xl">✗</span> Sai rồi!
            </>
          )}
        </div>
      )}
    </div>
  )
}