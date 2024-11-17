'use client'

import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Player } from '@/types/game'

interface LeaderboardProps {
  players: Player[];
}

export function Leaderboard({ players }: LeaderboardProps) {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <h2 className="text-2xl font-bold text-center">Bảng xếp hạng</h2>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedPlayers.map((player, index) => (
            <div
              key={player.id}
              className="flex items-center justify-between p-3 bg-secondary rounded-lg"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold">{index + 1}</span>
                <span className="font-medium">{player.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <span>{player.score} điểm</span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(player.timeSpent / 1000)}s
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}