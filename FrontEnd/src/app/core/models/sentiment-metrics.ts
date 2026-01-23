// C:\PROYECTO\teleton-sentiment\frontend\frontend-sentiment\src\app\core\models\sentiment-metrics.ts
export interface SentimentMetricsApiResponse {
  total: number;
  positivos: number;
  neutros: number;
  negativos: number;
  pctPositivos: number;
  pctNeutros: number;
  pctNegativos: number;
}

export interface SentimentMetrics {
  total: number;

  positivos: number;
  neutros: number;
  negativos: number;

  pctPositivos: number;
  pctNeutros: number;
  pctNegativos: number;
}
