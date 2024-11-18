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
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-purple-100">
      <h3 className="text-xl font-bold mb-6 text-gray-800">Người chơi</h3>
      <div className="space-y-3">
        {sortedPlayers.map((player, index) => (
          <div
            key={player.id}
            className={`
              flex justify-between items-center p-4 rounded-lg transition-all duration-200
              ${player.id === currentUserId 
                ? 'bg-indigo-50/80 border border-indigo-200' 
                : 'bg-white/60 border border-purple-100'
              }
              hover:shadow-sm hover:bg-white/90
            `}
          >
            <div className="flex items-center gap-3">
              <span className="text-gray-500 font-medium">#{index + 1}</span>
              <span className="text-gray-800">
                {player.name} 
                {player.isHost && <span className="ml-2 text-yellow-500">👑</span>}
                {player.id === currentUserId && 
                  <span className="ml-2 text-sm text-blue-600">(Bạn)</span>
                }
              </span>
            </div>
            <span className="font-bold text-xl text-blue-600">
              {player.score || 0}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}