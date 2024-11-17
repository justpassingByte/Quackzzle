'use client'

import { useState } from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'

import { Leaderboard } from './Leaderboard'
import { Game, } from '@/types/api'
import { Question } from '../game/QuestionCard'

interface PlayerViewProps {
  game: Game;
  onAnswer: (answer: string) => void;
}

export function PlayerView({ game, onAnswer }: PlayerViewProps) {
  const currentQuestion = game.questions[game.currentRound];

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold text-center">
            {game.status === 'WAITING' 
              ? 'Đang chờ host bắt đầu...'
              : `Câu hỏi ${game.currentRound + 1}/10`
            }
          </h1>
        </CardHeader>
        <CardContent>
          {game.status === 'PLAYING' && currentQuestion && (
            <Question
              content={currentQuestion.content}
              options={currentQuestion.options}
              onAnswer={onAnswer}
              timeLeft={60}
              currentQuestion={0}
              totalQuestions={1}
              isAnswered={false}
            />
          )}
          {game.status === 'FINISHED' && (
            <Leaderboard players={game.players} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}