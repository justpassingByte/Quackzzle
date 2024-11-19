import { Button } from "../ui/Button"

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
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-gray-800">
          <h2 className="text-2xl font-bold mb-6 text-center">🎮 Điểm của bạn 🏆</h2>
          <div className="text-center mb-6">
            <div className="text-xl font-bold">{currentPlayer.name}</div>
            <div className="text-yellow-600 font-bold text-xl">
              {currentPlayer.score} điểm
            </div>
          </div>
        </div>
      )
    }
    
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-purple-100">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">🎮 Bảng xếp hạng 🏆</h2>
        
        {/* Người chiến thắng */}
        {/* {sortedPlayers.length > 0 && ( */}
           {/* <div className="mb-8 text-center p-6 bg-yellow-50/80 backdrop-blur-sm rounded-lg border border-yellow-200"> */}
            {/* <div className="text-yellow-700 text-lg mb-2">🏆 Người chiến thắng</div> */}
            {/* <div className="text-2xl font-bold text-gray-800">{sortedPlayers[0].name}</div> */}
            {/* <div className="text-yellow-600 font-bold text-xl">
              {sortedPlayers[0].score} điểm
            </div> */}
          {/* </div> */}
        {/* )} */}
  
        {/* Bảng xếp hạng */}
        <div className="space-y-3">
          {sortedPlayers.map((player, index) => (
            <div 
              key={player.id}
              className={`
                p-4 rounded-lg transition-all duration-200
                ${index === 0 
                  ? 'bg-yellow-50/80 border border-yellow-200' 
                  : player.id === currentUserId 
                    ? 'bg-indigo-50/80 border border-indigo-200'
                    : 'bg-white/60 border border-purple-100'
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
                <span className="font-bold text-xl text-blue-600">
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
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg
                shadow-md hover:shadow-lg transition-all duration-200"
            >
              Chơi lại
            </Button>
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