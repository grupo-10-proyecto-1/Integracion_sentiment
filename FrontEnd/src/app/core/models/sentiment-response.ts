export interface SentimentApiResponse {
  prevision: 'Positivo' | 'Negativo' | 'Neutro';
  probabilidad: number;
}

export interface SentimentResponse {
    sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
    probability: number;
}
