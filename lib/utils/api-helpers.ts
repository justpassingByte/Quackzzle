/**
 * API helper functions for Quackzzle
 */

/**
 * Xử lý lỗi API và trả về response chuẩn
 */
export function handleApiError(error: unknown) {
  if (error instanceof Error) {
    console.error('API Error:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
  
  console.error('Unknown API Error:', error);
  return {
    success: false,
    error: 'An unknown error occurred'
  };
}

/**
 * Kiểm tra mã phòng game hợp lệ
 */
export function validateGameCode(gameCode: string) {
  console.log('Validating game code:', gameCode);
  if (typeof gameCode !== 'string') {
    console.log('Game code is not a string');
    return false;
  }
  
  // Code ít nhất phải có 1 ký tự và không vượt quá 20 ký tự
  if (gameCode.length < 1 || gameCode.length > 20) {
    console.log('Game code length is invalid:', gameCode.length);
    return false;
  }
  
  console.log('Game code is valid');
  return true;
}

/**
 * Kiểm tra tên người chơi hợp lệ
 */
export function validatePlayerName(name: string) {
  return typeof name === 'string' && name.length >= 2 && name.length <= 20;
}

export function validateQuestion(content: string, options: string[], correctAnswer: string) {
  return (
    typeof content === 'string' &&
    content.length >= 10 &&
    Array.isArray(options) &&
    options.length >= 2 &&
    options.includes(correctAnswer)
  );
}

export function sanitizeGameData(game: any) {
  const { id, gameCode, status, currentRound, players, questions } = game;
  return {
    id,
    gameCode,
    status,
    currentRound,
    players: players?.map((p: any) => ({
      id: p.id,
      name: p.name,
      score: p.score,
      timeSpent: p.timeSpent
    })),
    questions: questions?.map((q: any) => ({
      id: q.id,
      content: q.content,
      options: q.options
    }))
  };
}