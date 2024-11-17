'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { QuestionCard } from '../game/QuestionCard'
import { Leaderboard } from './Leaderboard'
import { Game, Question } from '@/types/game'

interface HostViewProps {
  game: Game;
  onStartGame: () => void;
  onNextQuestion: () => void;
  onEndGame: () => void;
}

export function HostView({ game, onStartGame, onNextQuestion, onEndGame }: HostViewProps) {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);

  useEffect(() => {
    if (game.status === 'PLAYING') {
      setCurrentQuestion(game.questions[game.currentRound]);
    }
  }, [game.status, game.currentRound, game.questions]);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Phòng: {game.gameCode}</h1>
            <div className="space-x-4">
              {game.status === 'WAITING' && (
                <Button onClick={onStartGame}>Bắt đầu</Button>
              )}
              {game.status === 'PLAYING' && (
                <Button onClick={onNextQuestion}>Câu tiếp theo</Button>
              )}
              <Button variant="destructive" onClick={onEndGame}>
                Kết thúc
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentQuestion && (
              <QuestionCard
                question={currentQuestion}
                onAnswer={() => {}}
                timeLimit={60}
              />
            )}
            <Leaderboard players={game.players} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}