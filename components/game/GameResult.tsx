import { Button } from "../ui/Button"
import { LiberationBadge } from "../ui/LiberationBadge"

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
    console.log('GameResult - players:', players);
    
    // Lọc người chơi là host (tên "Host") ra khỏi danh sách
    const filteredPlayers = players.filter(player => player.name !== 'Host');
      
    const sortedPlayers = [...filteredPlayers].sort((a, b) => b.score - a.score)
    const currentPlayer = players.find(p => p.id === currentUserId)
    
    if (!isHost && currentPlayer) {
      return (
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 text-gray-800 border-2 border-red-500/70 relative overflow-hidden">
          <div className="absolute inset-0 liberation-gradient opacity-5"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-5 w-5 vietnam-flag"></div>
              <h2 className="text-2xl font-bold heading-gradient text-center">Điểm của bạn</h2>
              <div className="h-5 w-5 vietnam-flag"></div>
            </div>
            <div className="text-center mb-6">
              <div className="text-xl font-bold">{currentPlayer.name}</div>
              <div className="text-red-600 font-bold text-xl">
                {currentPlayer.score} điểm
              </div>
            </div>
          </div>
        </div>
      )
    }
    
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border-2 border-red-500/70 relative overflow-hidden">
        <div className="absolute inset-0 liberation-gradient opacity-5"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="h-5 w-5 vietnam-flag"></div>
            <LiberationBadge label="Bảng xếp hạng" />
            <div className="h-5 w-5 vietnam-flag"></div>
          </div>
  
          {/* Bảng xếp hạng */}
          <div className="space-y-3">
            {sortedPlayers.map((player, index) => (
              <div 
                key={player.id}
                className={`
                  p-4 rounded-lg transition-all duration-200
                  ${index === 0 
                    ? 'bg-yellow-50/80 border border-yellow-300' 
                    : player.id === currentUserId 
                      ? 'bg-red-50/80 border border-red-200'
                      : 'bg-white/60 border border-gray-200'
                  }
                  hover:bg-white/90
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {index === 0 && '🥇'}
                      {index === 1 && '🥈'}
                      {index === 2 && '🥉'}
                      {index > 2 && `#${index + 1}`}
                    </span>
                    <span className="font-bold text-gray-800">{player.name}</span>
                  </div>
                  <span className="font-bold text-xl text-red-600">
                    {player.score || 0}
                  </span>
                </div>
              </div>
            ))}
          </div>
  
          {/* Nút chơi lại */}
          {isHost && (
            <div className="text-center mt-8">
              <Button
                onClick={onRestart}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg
                  shadow-md hover:shadow-lg transition-all duration-200"
              >
                Chơi lại
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }
  
  // Helper function để format thời gian
  function formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }