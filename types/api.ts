export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface CreateGameRequest {
  hostId: string;
}

export interface JoinGameRequest {
  gameCode: string;
  playerName: string;
}

export interface SubmitAnswerRequest {
  gameId: string;
  playerId: string;
  questionId: string;
  answer: string;
  timeSpent: number;
}

export interface UpdateGameStatusRequest {
  gameId: string;
  status: 'WAITING' | 'PLAYING' | 'FINISHED';
  currentRound?: number;
}

export interface CreateQuestionRequest {
  content: string;
  options: string[];
  correctAnswer: string;
  category: string;
  createdBy: string;
}