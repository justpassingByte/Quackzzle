'use client'

import { useEffect, useState, useCallback } from 'react'
import { PlayerList } from '@/components/game/PlayerList'
import { QuestionCard } from './QuestionCard'
import { Button } from '@/components/ui/Button'
import { GameResult } from './GameResult'
import { LiberationBanner } from '@/components/ui/LiberationBanner'
import { LiberationBadge } from '@/components/ui/LiberationBadge'

interface GameData {
  id: string
  gameCode: string
  hostId: string
  status: 'WAITING' | 'PLAYING' | 'FINISHED'
  currentRound: number
  players: any[]
  playerQuestions: {
    playerId: string
    gameId: string
    questionId: string
    question: {
      id: string
      content: string
      options: string[]
      correctAnswer: string
      image?: string
      answerImage?: string
      videoUrl?: string
      answerExplanation?: string
    }
  }[]
  completedPlayers: string[]
}

interface GameClientProps {
  gameCode: string
}

export default function GameClient({ gameCode }: GameClientProps) {
  const [game, setGame] = useState<GameData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [hasAnswered, setHasAnswered] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string>('')
  const [correctAnswer, setCorrectAnswer] = useState<string>('')
  const [scoreEarned, setScoreEarned] = useState<number>(0)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [selectedQuestionSet, setSelectedQuestionSet] = useState('A')
  const [completedPlayers, setCompletedPlayers] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    console.log('Setting currentUserId:', userId);
    setCurrentUserId(userId);
  }, []);

  useEffect(() => {
    if (game && currentUserId) {
      console.log('Checking host status:', {
        gameHostId: game.hostId,
        currentUserId,
        isMatching: game.hostId === currentUserId
      });
    }
  }, [game, currentUserId]);

  const getCurrentPlayerQuestions = useCallback(() => {
    if (!game?.playerQuestions || !currentUserId) return [];
    
    // Lọc câu hỏi cho player hiện tại
    return game.playerQuestions.filter(pq => pq.playerId === currentUserId);
  }, [game?.playerQuestions, currentUserId]);

  const handleNextQuestion = useCallback(() => {
    setHasAnswered(false);
    setSelectedAnswer('');
    setCorrectAnswer('');
    setScoreEarned(0);
    setTimeLeft(60);
    setCurrentQuestion(prev => prev + 1);
  }, []);

  // Effect xử lý timer
  useEffect(() => {
    if (game?.status !== 'PLAYING' || hasAnswered) {
      return;
    }

    setTimeLeft(60);
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          setHasAnswered(true);
          setScoreEarned(0);
          
          const playerQuestions = getCurrentPlayerQuestions();
          const currentQuestionData = playerQuestions[currentQuestion].question;
          setCorrectAnswer(currentQuestionData.correctAnswer);
          const isLastQuestion = currentQuestion === playerQuestions.length - 1;
          
          setTimeout(() => {
            if (isLastQuestion) {
              setCurrentQuestion(prev => prev + 1);
              setHasAnswered(false);
              setSelectedAnswer('');
              setCorrectAnswer('');
              setScoreEarned(0);
              setTimeLeft(60);
            }
          }, 10000);
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [game?.status, hasAnswered, currentQuestion, getCurrentPlayerQuestions]);

  // Fetch game data
  const fetchGame = useCallback(async () => {
    try {
      console.log('Fetching game data for code:', gameCode);
      
      const res = await fetch(`/api/game/${gameCode}`, {
        cache: 'no-store'
      });
      
      console.log('API response status:', res.status);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Error response text:', errorText);
      }
      
      const data = await res.json();
      
      console.log('Fetched game data:', {
        success: data.success,
        error: data.error,
        gameData: data.data?.game,
        gameCode: gameCode,
        gameHostId: data.data?.game?.hostId,
        currentUserId,
        status: data.data?.game?.status
      });
      
      if (data.success) {
        setGame(data.data.game);
      } else {
        setError(data.error);
      }
    } catch (error) {
      console.error('Fetch game error details:', error);
      setError('Không thể tải thông tin game');
    } finally {
      setLoading(false);
    }
  }, [gameCode, currentUserId]);

  // Initial fetch và debug
  useEffect(() => {
    if (gameCode) {
      fetchGame()
    }
    
    // Debug hiển thị userId từ localStorage
    console.log('Current userId from localStorage:', localStorage.getItem('userId'));
  }, [gameCode, fetchGame])

  // Một interval duy nhất để cập nhật game state
  useEffect(() => {
    if (!gameCode) return;

    const interval = setInterval(() => {
      fetchGame();
    }, 2000);

    return () => clearInterval(interval);
  }, [gameCode, fetchGame]);

  const handleStartGame = async () => {
    if (!game || !currentUserId) return;
    
    console.log('Starting game...', {
      currentUserId,
      gameCode: game.gameCode,
      questionSet: selectedQuestionSet
    });
    
    setIsLoading(true);
    setError('');
    
    try {
      // Thêm timeout cho fetch để tránh chờ quá lâu
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 giây timeout
      
      const response = await fetch(`/api/game/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameCode: game.gameCode,
          status: 'PLAYING',
          questionSet: selectedQuestionSet,
          hostId: currentUserId,
          gameId: game.id
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error response:', errorText);
        
        if (response.status === 504) {
          throw new Error('Máy chủ mất quá nhiều thời gian để phản hồi. Vui lòng thử lại sau.');
        }
        
        throw new Error(`Lỗi từ máy chủ: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.data?.game) {
        setGame(data.data.game);
        setCurrentQuestion(0);
        setTimeLeft(60);
        setHasAnswered(false);
        setSelectedAnswer('');
        setCorrectAnswer('');
      } else {
        throw new Error(data.error || 'Không thể bắt đầu game');
      }
    } catch (error) {
      console.error('Start game error:', error);
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          setError('Yêu cầu bị hủy do mất quá nhiều thời gian. Vui lòng thử lại.');
        } else {
          setError(error.message || 'Có lỗi xảy ra khi bắt đầu game');
        }
      } else {
        setError('Có lỗi xảy ra khi bắt đầu game');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = async (answer: string) => {
    if (hasAnswered || !game) return;
    
    setHasAnswered(true);
    setSelectedAnswer(answer);

    try {
      const playerQuestions = getCurrentPlayerQuestions();
      const currentQuestionData = playerQuestions[currentQuestion].question;
      const isCorrect = answer === currentQuestionData.correctAnswer;
      const isLastQuestion = currentQuestion === playerQuestions.length - 1;
      
      setCorrectAnswer(currentQuestionData.correctAnswer);
      const earnedScore = isCorrect ? Math.max(10, Math.floor((timeLeft / 60) * 100)) : 0;
      setScoreEarned(earnedScore);

      const response = await fetch('/api/game/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId: game.id,
          playerId: currentUserId,
          questionId: currentQuestionData.id,
          answer,
          score: earnedScore,
          timeSpent: 60 - timeLeft,
          isCorrect,
          currentQuestion,
          isLastQuestion
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setGame(data.data.game);
        
        setTimeout(() => {
          if (!isLastQuestion) {
            handleNextQuestion();
          }
        }, 3000);
      }
    } catch (error) {
      console.error('Error submitting answer');
    }
  };

  // Reset state khi game thay đổi
  useEffect(() => {
    setHasAnswered(false);
  }, [game?.id]);

  // Component hiển thị điểm ca người chơi hiện tại
  const CurrentPlayerScore = () => {
    const currentPlayer = game?.players.find(p => p.id === currentUserId)
    if (!currentPlayer) return null

    return (
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4 border border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-gray-700">Điểm của bạn:</span>
          <span className="font-bold text-xl text-blue-600">
            {currentPlayer.score || 0}
          </span>
        </div>
        {scoreEarned > 0 && (
          <div className="text-green-400 text-sm mt-1 text-right">
            +{scoreEarned} điểm
          </div>
        )}
      </div>
    )
  }

  const handleRestart = async () => {
    if (!game || !currentUserId) return;
    
    try {
      // Reset game về trạng thái WAITING
      const resetRes = await fetch('/api/game/status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          gameCode: game.gameCode,
          status: 'WAITING'
        })
      });

      if (!resetRes.ok) {
        throw new Error(`HTTP error! status: ${resetRes.status}`);
      }

      const resetData = await resetRes.json();
      if (resetData.success) {
        // Reset tất cả state về giá trị ban đầu
        setGame(resetData.data.game);
        setCurrentQuestion(0);
        setTimeLeft(60);
        setHasAnswered(false);
        setSelectedAnswer('');
        setCorrectAnswer('');
        setScoreEarned(0);
      }
    } catch (error) {
      console.error('Failed to restart game:', error);
    }
  };

  // Kiểm tra xem có câu hỏi hiện tại không
  const currentQuestionData = game?.playerQuestions?.[currentQuestion]

  // Thêm effect để kiểm tra khi nào tất cả người chơi hoàn thành
  useEffect(() => {
    if (!game || !currentUserId) return;

    // Chỉ kiểm tra khi game đang PLAYING
    if (game.status !== 'PLAYING') return;

    // Lấy danh sách người chơi (không bao gồm host)
    const activePlayers = game.players.filter(player => player.name !== 'Host');
    
    // Kiểm tra số người đã hoàn thành từ server
    const allPlayersCompleted = game.completedPlayers.length === activePlayers.length;

    if (allPlayersCompleted) {
      // Gửi request để kết thúc game
      fetch('/api/game/status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          gameCode: game.gameCode,
          status: 'FINISHED'
        })
      });
    }
  }, [game, currentUserId]);

  // Thêm effect để reset state khi game chuyển trạng thái sang WAITING
  useEffect(() => {
    if (game?.status === 'WAITING') {
      // Reset tất cả state khi game chuyển sang WAITING
      setCurrentQuestion(0);
      setTimeLeft(60);
      setHasAnswered(false);
      setSelectedAnswer('');
      setCorrectAnswer('');
      setScoreEarned(0);
    }
  }, [game?.status]);

  const renderMainContent = () => {
    // Kiểm tra null trước
    if (!game) {
      return null;
    }

    if (game.status === 'WAITING') {
      return (
        <div className="flex flex-col items-center justify-center space-y-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 text-center shadow-lg border-2 border-red-500/70 relative overflow-hidden">
            <div className="absolute inset-0 liberation-gradient opacity-5"></div>
            
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="h-6 w-6 vietnam-flag"></div>
                <h2 className="text-2xl font-bold text-gray-800 heading-gradient">
                {game.hostId === currentUserId ? 'Đang chờ người chơi...' : 'Đang chờ host bắt đầu...'}
              </h2>
                <div className="h-6 w-6 vietnam-flag"></div>
              </div>
              
              {game.hostId === currentUserId && (
                <div className="mb-4 bg-white/50 p-4 rounded-lg border border-red-200">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <LiberationBadge label="Chọn chủ đề" />
                  </div>
                  <label className="block text-gray-600 text-sm font-medium mb-2">
                    Chọn bộ câu hỏi cho trò chơi
                  </label>
                  <select 
                    value={selectedQuestionSet}
                    onChange={(e) => setSelectedQuestionSet(e.target.value)}
                    className="w-full max-w-xs p-2 border rounded-lg bg-white/80 text-gray-700 border-red-200 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300"
                  >
                    <option value="A">Set A - Lịch sử Việt Nam (1945 - nay</option>
                    <option value="B">Set B - Địa lý</option>
                    <option value="C">Set C - Văn hóa</option>
                    <option value="D">Set D - Khoa học và Công nghệ</option>
                    <option value="E">Set E - Nghệ thuật và Giải trí</option>
                    <option value="F">Set F - Thể thao</option>
                    <option value="G">Set G - Đời sống và Sức khỏe</option>
                    <option value="H">Set H - Câu hỏi Video</option>
                    
                  </select>
                  <p className="mt-1 text-sm text-gray-500 italic">
                    Mỗi bộ câu hỏi sẽ có chủ đề và độ khó khác nhau
                  </p>
                </div>
              )}

              <div className="flex flex-col items-center gap-3">
                <p className="text-gray-600">
                  {game.hostId === currentUserId ? 'Chia sẻ mã game cho bạn bè:' : 'Mã game của bạn:'}
                </p>
                <div className="flex items-center gap-2 bg-red-50 px-4 py-2 rounded-lg border border-red-200">
                  <span className="text-2xl font-mono font-semibold text-red-600">
                    {game.gameCode}
                  </span>
                  {game.hostId === currentUserId && (
                    <button 
                      className="text-red-500 hover:text-red-700 transition-colors"
                      onClick={() => {
                        navigator.clipboard.writeText(game.gameCode);
                        alert('Đã sao chép mã game!');
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
              
              {game.hostId === currentUserId && (
                <div className="mt-4 space-y-4">
                  <div className="flex items-center justify-center gap-2">
                    <div className="text-green-600 text-lg font-semibold">
                      {game.players.filter(player => player.name !== 'Host').length} người chơi đã tham gia
                    </div>
                  </div>
                <Button
                  onClick={handleStartGame}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Đang bắt đầu...
                    </div>
                  ) : (
                    'Bắt đầu game'
                  )}
                </Button>
                  <div className="mt-2">
                    <button 
                      onClick={() => {
                        const url = `${window.location.origin}/game/${game.gameCode}`;
                        navigator.clipboard.writeText(url);
                        alert('Đã sao chép liên kết mời!');
                      }}
                      className="text-red-600 hover:text-red-800 text-sm flex items-center justify-center gap-1 mx-auto"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Chia sẻ liên kết mời
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (game.status === 'FINISHED' || (currentUserId && game.completedPlayers.includes(currentUserId))) {
      return (
        <>
          <div className="bg-red-100/80 backdrop-blur-sm rounded-lg p-4 mb-6 text-center shadow-lg border-2 border-red-500/70 relative overflow-hidden">
            <div className="absolute inset-0 liberation-gradient opacity-5"></div>
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-center mb-2 heading-gradient">
                🌟 Thông tin phòng game 🌟
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 justify-center">
                <div className="bg-red-50 rounded-lg p-4 text-center flex-1 border border-red-200">
                  <p className="text-sm text-gray-600 mb-1">Mã phòng</p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-xl font-mono font-semibold text-red-600">
                      {game.gameCode}
                    </span>
                    <button 
                      className="text-red-500 hover:text-red-700 transition-colors"
                      onClick={() => {
                        navigator.clipboard.writeText(game.gameCode);
                        alert('Đã sao chép mã game!');
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4 text-center flex-1 border border-green-200">
                  <p className="text-sm text-gray-600 mb-1">Người chơi</p>
                  <p className="text-xl font-semibold text-green-600">
                    {game.players.filter(player => player.name !== 'Host').length} người
                  </p>
                </div>
                
                <div className="bg-yellow-50 rounded-lg p-4 text-center flex-1 border border-yellow-200">
                  <p className="text-sm text-gray-600 mb-1">Đã hoàn thành</p>
                  <p className="text-xl font-semibold text-yellow-600">
                    {game.completedPlayers.length}/{game.players.filter(player => player.name !== 'Host').length}
                  </p>
                </div>
              </div>
              
              <button 
                onClick={() => {
                  const url = `${window.location.origin}/game/${game.gameCode}`;
                  navigator.clipboard.writeText(url);
                  alert('Đã sao chép liên kết mời!');
                }}
                className="text-red-600 hover:text-red-800 text-sm flex items-center justify-center gap-1 mx-auto mt-4"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Chia sẻ liên kết mời
              </button>
            </div>
          </div>
          
        <GameResult 
          players={game.players}
          isHost={game.hostId === currentUserId}
          currentUserId={currentUserId}
          onRestart={handleRestart}
          completedPlayers={game.completedPlayers}
        />
        </>
      );
    }

    if (game.status === 'PLAYING') {
      if (game.hostId === currentUserId) {
        // Giao diện đặc biệt cho host khi game đang chơi
        const activePlayers = game.players.filter(player => player.name !== 'Host');
        const sortedPlayers = [...activePlayers].sort((a, b) => b.score - a.score);
        const completedCount = game.completedPlayers.length;
        
        return (
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border-2 border-red-500/70 relative overflow-hidden">
            <div className="absolute inset-0 liberation-gradient opacity-5"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="h-5 w-5 vietnam-flag"></div>
                <h2 className="text-2xl font-bold heading-gradient text-center">
                  Quản lý phòng game
                </h2>
                <div className="h-5 w-5 vietnam-flag"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 justify-center mb-6">
                <div className="bg-red-50 rounded-lg p-4 text-center flex-1 border border-red-200">
                  <p className="text-sm text-gray-600 mb-1">Mã phòng</p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-xl font-mono font-semibold text-red-600">
                      {game.gameCode}
                    </span>
                    <button 
                      className="text-red-500 hover:text-red-700 transition-colors"
                      onClick={() => {
                        navigator.clipboard.writeText(game.gameCode);
                        alert('Đã sao chép mã game!');
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4 text-center flex-1 border border-green-200">
                  <p className="text-sm text-gray-600 mb-1">Người chơi</p>
                  <p className="text-xl font-semibold text-green-600">
                    {activePlayers.length} người
                  </p>
                </div>
                
                <div className="bg-yellow-50 rounded-lg p-4 text-center flex-1 border border-yellow-200">
                  <p className="text-sm text-gray-600 mb-1">Đã hoàn thành</p>
                  <p className="text-xl font-semibold text-yellow-600">
                    {completedCount}/{activePlayers.length}
                  </p>
                </div>
              </div>
              
              <button 
                onClick={() => {
                  const url = `${window.location.origin}/game/${game.gameCode}`;
                  navigator.clipboard.writeText(url);
                  alert('Đã sao chép liên kết mời!');
                }}
                className="text-red-600 hover:text-red-800 text-sm flex items-center justify-center gap-1 mx-auto mb-6"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Chia sẻ liên kết mời
              </button>
              
              <div className="mb-6">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <LiberationBadge label="Bảng xếp hạng" />
                </div>
                <div className="bg-white/50 p-4 rounded-lg border border-red-200 max-h-60 overflow-y-auto pr-2">
                  {sortedPlayers.length > 0 ? (
                    sortedPlayers.map((player, index) => (
                      <div 
                        key={player.id}
                        className={`
                          p-3 mb-2 rounded-lg transition-all
                          ${index === 0 
                            ? 'bg-yellow-50 border border-yellow-200' 
                            : index === 1
                              ? 'bg-gray-50 border border-gray-200'
                              : index === 2
                                ? 'bg-amber-50 border border-amber-200'
                                : 'bg-white/60 border border-gray-100'
                          }
                        `}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">
                              {index === 0 && '🥇'}
                              {index === 1 && '🥈'}
                              {index === 2 && '🥉'}
                              {index > 2 && `${index + 1}.`}
                            </span>
                            <span className="font-medium">
                              {player.name}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <span className="font-bold text-blue-600">
                              {player.score || 0}
                            </span>
                            {game.completedPlayers.includes(player.id) && (
                              <span className="ml-2 text-green-500" title="Đã hoàn thành">
                                ✓
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">Chưa có người chơi nào tham gia</p>
                  )}
                </div>
              </div>
              
              {completedCount === activePlayers.length && activePlayers.length > 0 && (
                <div className="text-center">
                  <Button
                    onClick={handleRestart}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg
                      shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    Kết thúc và chơi lại
                  </Button>
                </div>
              )}
            </div>
          </div>
        );
      }

      const playerQuestions = getCurrentPlayerQuestions();
      if (playerQuestions && playerQuestions.length > 0) {
        const currentQuestionData = playerQuestions[currentQuestion].question;
        
        return (
          <QuestionCard
            content={currentQuestionData.content}
            options={currentQuestionData.options}
            image={currentQuestionData.image}
            answerImage={currentQuestionData.answerImage}
            answerExplanation={currentQuestionData.answerExplanation}
            videoUrl={currentQuestionData.videoUrl}
            timeLeft={timeLeft}
            onAnswer={handleAnswer}
            disabled={hasAnswered}
            currentQuestion={currentQuestion}
            totalQuestions={playerQuestions.length}
            selectedAnswer={selectedAnswer}
            correctAnswer={correctAnswer}
            isAnswered={hasAnswered}
            scoreEarned={scoreEarned}
          />
        );
      }
    }

    return (
      <div className="text-white text-center">
        Đang tải câu hỏi...
      </div>
    );
  };

  // Effect mới để kiểm tra thời gian
  useEffect(() => {
    const checkLastQuestionTime = () => {
      const lastQuestionTime = localStorage.getItem('lastQuestionAnsweredTime');
      const isLastQuestion = localStorage.getItem('isLastQuestion');

      if (lastQuestionTime && isLastQuestion === 'true') {
        const timeElapsed = Date.now() - parseInt(lastQuestionTime);
        
        // Nếu đã trôi qua 60 giây
        if (timeElapsed >= 60000) {
          if (currentUserId) {
            setCompletedPlayers((prev: Set<string>) => new Set([...prev, currentUserId]));
          }
          // Xóa dữ liệu localStorage
          localStorage.removeItem('lastQuestionAnsweredTime');
          localStorage.removeItem('isLastQuestion');
        }
      }
    };

    // Kiểm tra mỗi giây
    const interval = setInterval(checkLastQuestionTime, 1000);
    return () => clearInterval(interval);
  }, [currentUserId]);

  // Reset state khi component unmount
  useEffect(() => {
    return () => {
      localStorage.removeItem('lastQuestionAnsweredTime');
      localStorage.removeItem('isLastQuestion');
    };
  }, []);

  // Add debug logging useEffect
  useEffect(() => {
    if (game && currentUserId) {
      console.log('GameClient - Debug Info:', {
        gameId: game.id,
        gameCode: game.gameCode,
        hostId: game.hostId,
        currentUserId,
        isHost: game.hostId === currentUserId,
        playersCount: game.players.length,
        players: game.players.map(p => ({ id: p.id, name: p.name, isHost: p.id === game.hostId }))
      });
    }
  }, [game, currentUserId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-2xl text-gray-800">Đang tải...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-red-600 bg-red-50 p-4 rounded-lg border border-red-200">
          Lỗi: {error}
        </div>
      </div>
    )
  }

  if (!game) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-2xl text-gray-800">Không tìm thấy game</div>
      </div>
    )
  }

  console.log('All player questions:', game?.playerQuestions);
  console.log('Current userId:', currentUserId);

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <LiberationBanner className="mb-6 hidden md:block" />
      
      <div className="grid lg:grid-cols-3 gap-6 md:grid-cols-1">
        {/* Main content - đổi thứ tự để nội dung chính hiển thị trước trên mobile */}
        <div className="lg:col-span-2 order-2 lg:order-1">
          {renderMainContent()}
        </div>
        
        {/* Sidebar */}
        <div className="lg:col-span-1 order-1 lg:order-2 mb-6 lg:mb-0">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 mb-4 shadow-sm border border-red-200">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Trạng thái:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                game?.status === 'WAITING' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                game?.status === 'PLAYING' ? 'bg-green-100 text-green-800 border border-green-200' :
                'bg-gray-100 text-gray-800 border border-gray-200'
              }`}>
                {game?.status === 'WAITING' && 'Đang chờ'}
                {game?.status === 'PLAYING' && 'Đang chơi'}
                {game?.status === 'FINISHED' && 'Đã kết thúc'}
              </span>
            </div>
          </div>
          {/* Debug hostId and currentUserId */}
          {(() => { console.log('GameClient - passing to PlayerList:', { hostId: game?.hostId, currentUserId }); return null; })()}
          <PlayerList 
            players={game?.players || []} 
            currentUserId={currentUserId}
            hostId={game?.hostId}
          />
        </div>
        </div>

      <div className="mt-6 text-center">
        <LiberationBadge label="Giải Phóng Miền Nam 30/4" className="mx-auto" />
      </div>
    </div>
  )
}