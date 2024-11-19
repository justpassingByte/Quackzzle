'use client'

import { useEffect, useState, useCallback } from 'react'
import { PlayerList } from '@/components/game/PlayerList'
import { QuestionCard } from './QuestionCard'
import { Button } from '@/components/ui/Button'
import { GameResult } from './GameResult'

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
  const [isHost, setIsHost] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [hasAnswered, setHasAnswered] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string>('')
  const [correctAnswer, setCorrectAnswer] = useState<string>('')
  const [scoreEarned, setScoreEarned] = useState<number>(0)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [completedPlayers, setCompletedPlayers] = useState<Set<string>>(new Set())
  const [serverCompletedPlayers, setServerCompletedPlayers] = useState<string[]>([])
  const [showCongrats, setShowCongrats] = useState(false)
  const [selectedQuestionSet, setSelectedQuestionSet] = useState('A')
  const [isShowingLastQuestion, setIsShowingLastQuestion] = useState(false)
  const [canShowCongrats, setCanShowCongrats] = useState(false)
  const [lastQuestionState, setLastQuestionState] = useState({
    isLast: false,
    startTime: 0
  });

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
      setIsHost(game.hostId === currentUserId);
    }
  }, [game?.hostId, currentUserId]);

  const handleNextQuestion = useCallback(() => {
    if (!game || isTransitioning) return;

    setIsTransitioning(true);
    setHasAnswered(false);
    setSelectedAnswer('');
    setCorrectAnswer('');
    setScoreEarned(0);
    setTimeLeft(60);

    if (currentQuestion < game.playerQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 500);
    } else {
      setIsTransitioning(false);
    }
  }, [game, currentQuestion, isTransitioning]);

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
              setShowCongrats(true);
            } else {
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
  }, [game?.status, hasAnswered, currentQuestion]);

  // Fetch game data
  const fetchGame = useCallback(async () => {
    try {
      const res = await fetch(`/api/game/${gameCode}`, {
        cache: 'no-store'
      });
      const data = await res.json();
      
      console.log('Fetched game data:', {
        gameHostId: data.data.game?.hostId,
        currentUserId,
        status: data.data.game?.status
      });
      
      if (data.success) {
        setGame(data.data.game);
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Không thể tải thông tin game');
      console.error('Fetch game error:', error);
    } finally {
      setLoading(false);
    }
  }, [gameCode, currentUserId]);

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
    
    console.log('Starting game...', {
      isHost,
      currentUserId,
      gameCode: game.gameCode,
      questionSet: selectedQuestionSet
    });
    
    try {
      const response = await fetch(`/api/game/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameCode: game.gameCode,
          status: 'PLAYING',
          questionSet: selectedQuestionSet,
          hostId: currentUserId,
          gameId: game.id
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.data?.game) {
        setGame(data.data.game);
        setCurrentQuestion(0);
        setTimeLeft(60);
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
          if (isLastQuestion) {
            setShowCongrats(true);
          } else {
            setCurrentQuestion(prev => prev + 1);
            setHasAnswered(false);
            setSelectedAnswer('');
            setCorrectAnswer('');
            setScoreEarned(0);
            setTimeLeft(60);
          }
        }, 10000);
      }
    } catch (error) {
      console.error('Error submitting answer');
    }
  };

  // Reset state khi game thay đổi
  useEffect(() => {
    setIsShowingLastQuestion(false);
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
        setTimeLeft(60);
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
  const currentQuestionData = game?.playerQuestions?.[currentQuestion]

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

  // Thêm polling để kiểm tra trạng thái game thờng xuyên
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
      setTimeLeft(60);
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

  const getCurrentPlayerQuestions = useCallback(() => {
    if (!game?.playerQuestions || !currentUserId) return [];
    
    // Lọc câu hỏi cho player hiện tại
    return game.playerQuestions.filter(pq => pq.playerId === currentUserId);
  }, [game?.playerQuestions, currentUserId]);

  const renderMainContent = () => {
    if (game.status === 'WAITING') {
      return (
        <div className="flex flex-col items-center justify-center space-y-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-8 text-center shadow-lg border border-purple-100">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800">
                {isHost ? 'Đang chờ người chơi...' : 'Đang chờ host bắt đầu...'}
              </h2>
              
              {isHost && (
                <div className="mb-4">
                  <label className="block text-gray-600 text-sm font-medium mb-2">
                    Chọn bộ câu hỏi cho trò chơi
                  </label>
                  <select 
                    value={selectedQuestionSet}
                    onChange={(e) => setSelectedQuestionSet(e.target.value)}
                    className="w-full max-w-xs p-2 border rounded-lg bg-white/80 text-gray-700 border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300"
                  >
                    <option value="A">Set A</option>
                    <option value="B">Set B</option>
                    <option value="C">Set C</option>
                    <option value="D">Set D</option>
                  </select>
                  <p className="mt-1 text-sm text-gray-500 italic">
                    Mỗi b câu hỏi sẽ có chủ đề và độ khó khác nhau
                  </p>
                </div>
              )}

              <div className="flex flex-col items-center gap-2">
                <p className="text-gray-600">
                  {isHost ? 'Chia sẻ mã game cho bạn bè:' : 'Mã game của bạn:'}
                </p>
                <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-lg">
                  <span className="text-2xl font-mono font-semibold text-indigo-600">
                    {game.gameCode}
                  </span>
                </div>
              </div>
              
              {isHost && (
                <Button
                  onClick={handleStartGame}
                  className="mt-4 bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  Bắt đầu game
                </Button>
              )}
            </div>
          </div>
        </div>
      );
    }

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

    if (game.status === 'PLAYING') {
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

      const playerQuestions = getCurrentPlayerQuestions();
      if (playerQuestions && playerQuestions.length > 0) {
        const currentQuestionData = playerQuestions[currentQuestion].question;
        
        return (
          <QuestionCard
            content={currentQuestionData.content}
            options={currentQuestionData.options}
            image={currentQuestionData.image}
            answerImage={currentQuestionData.answerImage}
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
        if (timeElapsed >= 60000 && !canShowCongrats) {
          setCanShowCongrats(true);
          if (currentUserId) {
            setCompletedPlayers(prev => new Set([...prev, currentUserId]));
          }
        }
        
        // Nếu đã trôi qua 80 giây
        if (timeElapsed >= 80000) {
          setShowCongrats(true);
          // Xóa dữ liệu localStorage
          localStorage.removeItem('lastQuestionAnsweredTime');
          localStorage.removeItem('isLastQuestion');
        }
      }
    };

    // Kiểm tra mỗi giây
    const interval = setInterval(checkLastQuestionTime, 1000);
    return () => clearInterval(interval);
  }, [canShowCongrats, currentUserId]);

  // Reset state khi component unmount
  useEffect(() => {
    return () => {
      localStorage.removeItem('lastQuestionAnsweredTime');
      localStorage.removeItem('isLastQuestion');
    };
  }, []);

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