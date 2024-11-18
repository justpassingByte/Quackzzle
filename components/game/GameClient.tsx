'use client'

import { useEffect, useState, useCallback } from 'react'
import { PlayerList } from '@/components/game/PlayerList'
import { Question } from './QuestionCard'
import { Button } from '@/components/ui/Button'
import { GameResult } from './GameResult'

interface GameData {
  id: string
  gameCode: string
  hostId: string
  status: 'WAITING' | 'PLAYING' | 'FINISHED'
  currentRound: number
  players: any[]
  questions: any[]
  completedPlayers: string[]
}

interface GameClientProps {
  gameCode: string
}

export default function GameClient({ gameCode }: GameClientProps) {
  const [game, setGame] = useState<GameData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isHost, setIsHost] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [hasAnswered, setHasAnswered] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string>('')
  const [correctAnswer, setCorrectAnswer] = useState<string>('')
  const [scoreEarned, setScoreEarned] = useState<number>(0)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [completedPlayers, setCompletedPlayers] = useState<Set<string>>(new Set())
  const [serverCompletedPlayers, setServerCompletedPlayers] = useState<string[]>([])
  const [showCongrats, setShowCongrats] = useState(false)

  useEffect(() => {
    const userId = localStorage.getItem('userId')
    setCurrentUserId(userId)
  }, [])

  const handleNextQuestion = useCallback(() => {
    if (!game || isTransitioning) return;

    setIsTransitioning(true);
    setHasAnswered(false);
    setSelectedAnswer('');
    setCorrectAnswer('');
    setScoreEarned(0);
    setTimeLeft(30);

    if (currentQuestion < game.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 100);
    } else {
      setIsTransitioning(false);
    }
  }, [game, currentQuestion, isTransitioning]);

  // Timer cho mỗi câu hỏi
  useEffect(() => {
    if (game?.status !== 'PLAYING' || isTransitioning || hasAnswered) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer)
          if (!hasAnswered) {
            setHasAnswered(true)
            setScoreEarned(0)
            
            const questionData = game.questions[currentQuestion]
            setCorrectAnswer(questionData.correctAnswer)

            // Đợi 2s để hiển thị đáp án
            setTimeout(() => {
              if (currentQuestion === game.questions.length - 1) {
                if (currentUserId) {
                  setCompletedPlayers(prev => new Set([...prev, currentUserId]))
                }
                handleNextQuestion()
              } else {
                handleNextQuestion()
              }
            }, 2000)
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [game?.status, isTransitioning, hasAnswered, currentQuestion, handleNextQuestion])

  // Fetch game data
  const fetchGame = async () => {
    try {
      const res = await fetch(`/api/game/${gameCode}`)
      const data = await res.json()
      
      console.log('Fetched game data:', data)

      if (data.success) {
        // Nếu game đang ở trạng thái PLAYING và không có câu hỏi, fetch câu hỏi mới
        if (data.data.game.status === 'PLAYING' && (!data.data.game.questions || data.data.game.questions.length === 0)) {
          const questionsRes = await fetch('/api/question')
          const questionsData = await questionsRes.json()
          
          if (questionsData.success) {
            data.data.game.questions = questionsData.data.questions
          }
        }

        setGame(data.data.game)
        console.log('Questions:', data.data.game.questions)
        
        if (data.data.game.hostId === localStorage.getItem('userId')) {
          setIsHost(true)
        }
      } else {
        setError(data.error)
      }
    } catch (error) {
      setError('Không thể tải thông tin game')
      console.error('Fetch game error:', error)
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    if (gameCode) {
      fetchGame()
    }
  }, [gameCode])

  // Polling để cp nhật danh sách người chơi
  useEffect(() => {
    if (!gameCode || game?.status !== 'WAITING') return

    const interval = setInterval(() => {
      fetchGame()
    }, 3000)

    return () => clearInterval(interval)
  }, [gameCode, game?.status])

  // Debug isHost changes
  useEffect(() => {
    console.log('Is Host:', isHost)
  }, [isHost])

  const handleStartGame = async () => {
    if (!isHost || !game) return;
    
    try {
      // 1. Fetch câu hỏi ngẫu nhiên
      const questionsRes = await fetch('/api/question');
      const questionsData = await questionsRes.json();
      
      console.log('Questions data from API:', questionsData);
      
      if (!questionsData?.success) {
        throw new Error('Không thể tải câu hỏi');
      }

      const questions = questionsData.data.questions;
      
      // 2. Cập nhật trạng thái game với ID của các câu hỏi
      const res = await fetch('/api/game/status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          gameCode: game.gameCode,
          status: 'PLAYING',
          questions: questions // Gửi toàn bộ câu hỏi để có ID
        })
      });

      const data = await res.json();
      console.log('Game status update response:', data);
      
      if (data.success && data.data?.game) {
        setGame({
          ...data.data.game,
          questions: questions // Sử dụng câu hỏi từ API question
        });
        setCurrentQuestion(0);
        setTimeLeft(30);
        setHasAnswered(false);
        setSelectedAnswer('');
        setCorrectAnswer('');
        setShowCongrats(false);
      }
    } catch (error) {
      console.error('Start game error:', error);
      setError('Có lỗi xảy ra khi bắt đầu game');
    }
  };

  const handleAnswer = async (answer: string) => {
    if (hasAnswered || !game || isHost || isTransitioning) return;
    
    setHasAnswered(true);
    setSelectedAnswer(answer);

    try {
      const isLastQuestion = currentQuestion === game.questions.length - 1;
      const response = await fetch('/api/game/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId: game.id,
          playerId: currentUserId,
          answer,
          timeSpent: 30 - timeLeft,
          isLastQuestion,
          currentQuestion
        })
      });

      const data = await response.json();
      
      if (data.success) {
        const { correctAnswer, isCorrect } = data.data.answer;
        setCorrectAnswer(correctAnswer);
        setScoreEarned(data.data.scoreEarned);

        if (isLastQuestion) {
          setTimeout(() => {
            setShowCongrats(true);
            if (currentUserId) {
              setCompletedPlayers(prev => new Set([...prev, currentUserId]));
            }
          }, 2000);
        } else {
          setTimeout(() => {
            setSelectedAnswer('');
            setCorrectAnswer('');
            setScoreEarned(0);
            setHasAnswered(false);
            handleNextQuestion();
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };

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
    if (!isHost || !game) return;
    
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
        setTimeLeft(30);
        setHasAnswered(false);
        setSelectedAnswer('');
        setCorrectAnswer('');
        setScoreEarned(0);
        setShowCongrats(false); // Reset showCongrats
        setCompletedPlayers(new Set()); // Reset completedPlayers
        setServerCompletedPlayers([]); // Reset serverCompletedPlayers nếu cần
      }
    } catch (error) {
      console.error('Failed to restart game:', error);
    }
  };

  // Kiểm tra xem có câu hỏi hiện tại không
  const currentQuestionData = game?.questions?.[currentQuestion]

  // Thêm effect để kiểm tra khi nào tất cả người chơi hoàn thành
  useEffect(() => {
    if (!game || !currentUserId) return;

    // Chỉ kiểm tra khi game đang PLAYING
    if (game.status !== 'PLAYING') return;

    // Lấy danh sách người chơi (không bao gồm host)
    const activePlayers = game.players.filter(player => player.id !== game.hostId);
    
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

  // Cập nhật effect để kiểm tra trng thái game
  useEffect(() => {
    if (!gameCode || game?.status !== 'PLAYING') return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/game/${gameCode}`)
        const data = await res.json()
        
        if (data.success) {
          // Chỉ cập nhật game state khi chuyển sang FINISHED
          if (data.data.game.status === 'FINISHED') {
            setGame(data.data.game)
          }
        }
      } catch (error) {
        console.error('Check game status error:', error)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [gameCode, game?.status])

  // Thêm polling để kiểm tra trạng thái game thường xuyên
  useEffect(() => {
    if (!gameCode || !game) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/game/${gameCode}`);
        const data = await res.json();
        
        if (data.success) {
          setGame(data.data.game);
        }
      } catch (error) {
        console.error('Poll game status error:', error);
      }
    }, 1000); // Poll mỗi giây

    return () => clearInterval(interval);
  }, [gameCode, game?.status]);

  useEffect(() => {
    if (!game || !currentUserId) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/game/${game.gameCode}`);
        const data = await res.json();
        if (data.success) {
          setGame(data.data.game);
        }
      } catch (error) {
        console.error('Error polling game status:', error);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [game?.gameCode, currentUserId]);

  // Thêm effect mới để theo dõi trạng thái game
  useEffect(() => {
    if (game?.status === 'WAITING') {
      // Reset tất cả state khi game chuyển sang WAITING
      setCurrentQuestion(0);
      setTimeLeft(30);
      setHasAnswered(false);
      setSelectedAnswer('');
      setCorrectAnswer('');
      setScoreEarned(0);
      setShowCongrats(false);
      setCompletedPlayers(new Set());
      setServerCompletedPlayers([]);
      setIsTransitioning(false);
    }
  }, [game?.status]);

  const renderMainContent = () => {
    console.log('Debug render:', {
      gameStatus: game?.status,
      currentQuestionData,
      isHost,
      questions: game?.questions,
      currentQuestion,
      showCongrats,
      completedPlayers
    });

    if (!game) return null;

    // Nếu đang chờ
    if (game.status === 'WAITING') {
      return (
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-8 text-center shadow-lg border border-purple-100">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">Đang chờ người chơi...</h2>
            <div className="flex flex-col items-center gap-2">
              <p className="text-gray-600">
                Chia sẻ mã game cho bạn bè:
              </p>
              <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-lg">
                <span className="text-2xl font-mono font-semibold text-indigo-600">
                  {game.gameCode}
                </span>
              </div>
            </div>
            
            {isHost ? (
              <Button
                onClick={handleStartGame}
                className="mt-4 bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                Bắt đầu game
              </Button>
            ) : (
              <p className="mt-4 text-gray-600 italic">
                Đang chờ host bắt đầu game...
              </p>
            )}
          </div>
        </div>
      );
    }

    // Nếu game đã kết thúc hoặc player đã hoàn thành
    if (game.status === 'FINISHED' || (currentUserId && game.completedPlayers.includes(currentUserId))) {
      return (
        <GameResult 
          players={game.players}
          isHost={isHost}
          currentUserId={currentUserId}
          onRestart={handleRestart}
          completedPlayers={game.completedPlayers}
        />
      );
    }

    // Nếu đang chơi (PLAYING)
    if (game.status === 'PLAYING') {
      // Nếu là host
      if (isHost) {
        return (
          <GameResult 
            players={game.players}
            isHost={true}
            currentUserId={currentUserId}
            onRestart={handleRestart}
            completedPlayers={game.completedPlayers}
          />
        );
      }

      // Nếu player đã hoàn thành tất cả câu hỏi
      if (showCongrats || (currentUserId && game.completedPlayers.includes(currentUserId))) {
        return (
          <GameResult 
            players={game.players}
            isHost={false}
            currentUserId={currentUserId}
            onRestart={handleRestart}
            completedPlayers={game.completedPlayers}
          />
        );
      }

      // Kiểm tra và hiển thị câu hỏi cho player
      if (game.questions && game.questions.length > 0) {
        return (
          <Question
            content={game.questions[currentQuestion].content}
            options={game.questions[currentQuestion].options}
            image={game.questions[currentQuestion].image}
            timeLeft={timeLeft}
            onAnswer={handleAnswer}
            disabled={hasAnswered}
            currentQuestion={currentQuestion}
            totalQuestions={game.questions.length}
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
  }

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

  console.log('Game object:', game);

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-3 gap-6 md:grid-cols-1">
        {/* Sidebar */}
        <div className="lg:col-span-1 md:order-2">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 mb-4 shadow-sm border border-purple-100">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Trạng thái:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                game?.status === 'WAITING' ? 'bg-yellow-100 text-yellow-800' :
                game?.status === 'PLAYING' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {game?.status === 'WAITING' && 'Đang chờ'}
                {game?.status === 'PLAYING' && 'Đang chơi'}
                {game?.status === 'FINISHED' && 'Đã kết thúc'}
              </span>
            </div>
          </div>
          <PlayerList 
            players={game?.players || []} 
            currentUserId={currentUserId}
          />
        </div>

        {/* Main content */}
        <div className="lg:col-span-2 md:order-1">
          {renderMainContent()}
        </div>
      </div>
    </div>
  )
}