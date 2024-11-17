interface GameResultProps {
    players: Array<{
      id: string
      name: string
      score: number
    }>
    isHost: boolean
    currentUserId: string | null
    onRestart: () => void
    completedPlayers: string[]
  }
  
  export function GameResult({ players, isHost, currentUserId, onRestart, completedPlayers }: GameResultProps) {
    const sortedPlayers = [...players].sort((a, b) => b.score - a.score)
    const currentPlayer = players.find(p => p.id === currentUserId)
    
    if (!isHost && currentPlayer) {
      return (
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
          <h2 className="text-2xl font-bold mb-6 text-center">🎮 Điểm của bạn 🏆</h2>
          <div className="text-center mb-6">
            <div className="text-xl font-bold">{currentPlayer.name}</div>
            <div className="text-yellow-400 font-bold text-xl">
              {currentPlayer.score} điểm
            </div>
          </div>
        </div>
      )
    }
    
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-6 text-center">🎮 Bảng xếp hạng 🏆</h2>
        
        {/* Người chiến thắng */}
        {sortedPlayers.length > 0 && (
          <div className="mb-8 text-center">
            <div className="text-yellow-400 text-lg mb-2">🏆 Người chiến thắng</div>
            <div className="text-2xl font-bold">{sortedPlayers[0].name}</div>
            <div className="text-yellow-400 font-bold text-xl">
              {sortedPlayers[0].score} điểm
            </div>
          </div>
        )}
  
        {/* Bảng xếp hạng */}
        <div className="space-y-3 mb-8">
          <div className="grid grid-cols-4 text-sm text-gray-400 pb-2 border-b border-white/10">
            <div>Hạng</div>
            <div className="col-span-2">Người chơi</div>
            <div className="text-right">Điểm</div>
          </div>
          {sortedPlayers.map((player, index) => (
            <div 
              key={player.id}
              className={`
                grid grid-cols-4 items-center p-3 rounded-lg
                ${index === 0 ? 'bg-yellow-500/20' : 'bg-white/5'}
              `}
            >
              {/* Hạng */}
              <div className="font-bold">
                {index === 0 && '🥇'}
                {index === 1 && '🥈'}
                {index === 2 && '🥉'}
                {index > 2 && `#${index + 1}`}
              </div>
              
              {/* Tên người chơi */}
              <div className="col-span-2">
                <div className="font-bold">{player.name}</div>
              </div>
              
              {/* Điểm */}
              <div className="text-right font-bold">
                {player.score}
              </div>
            </div>
          ))}
        </div>
  
        {/* Nút chơi lại */}
        {isHost && (
          <div className="text-center">
            <button
              onClick={onRestart}
              className="
                bg-blue-500 hover:bg-blue-600 active:bg-blue-700
                text-white font-bold py-2 px-6 rounded-lg
                transition duration-200
              "
            >
              Chơi lại
            </button>
          </div>
        )}
      </div>
    )
  }
  
  // Helper function để format thời gian
  function formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }