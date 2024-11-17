interface PlayerListProps {
  players: Array<{
    id: string
    name: string
    score: number
    isHost?: boolean
  }>
  currentUserId: string | null
}

export function PlayerList({ players, currentUserId }: PlayerListProps) {
  // Sắp xếp players theo điểm từ cao xuống thấp
  const sortedPlayers = [...players].sort((a, b) => (b.score || 0) - (a.score || 0))

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4 text-white">Người chơi</h3>
      <div className="space-y-2">
        {sortedPlayers.map((player) => (
          <div
            key={player.id}
            className={`flex justify-between items-center p-2 rounded ${
              player.id === currentUserId ? 'bg-white/20' : 'bg-white/5'
            }`}
          >
            <div className="flex items-center">
              <span className="text-white">
                {player.name} {player.isHost ? '👑' : ''} 
                {player.id === currentUserId ? ' (Bạn)' : ''}
              </span>
            </div>
            <span className="font-bold text-blue-400">{player.score || 0}</span>
          </div>
        ))}
      </div>
    </div>
  )
}