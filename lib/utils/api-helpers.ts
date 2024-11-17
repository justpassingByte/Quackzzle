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
export function validateGameCode(gameCode: string) {
  // return typeof gameCode === 'string' && gameCode.length === 6;
  return true;
}

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