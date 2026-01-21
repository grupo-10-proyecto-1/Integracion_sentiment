import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, map } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  SentimentResponse,
  SentimentApiResponse,
  SentimentHistoryItem,
} from '../models/sentiment-response';
import { environment } from '../../../environments/environment';
import { SentimentMetricsApiResponse } from '../models/sentiment-metrics';

@Injectable({
  providedIn: 'root',
})
export class SentimentService {
  private readonly API_URL =
    environment.api.baseUrl + environment.api.sentiment;

  private readonly METRICS_URL =
    environment.api.baseUrl + environment.api.stats;

  private readonly HISTORY_URL =
    environment.api.baseUrl + environment.api.history;

  constructor(private http: HttpClient) {}

  analyze(text: string): Observable<SentimentResponse> {
    return this.http.post<SentimentApiResponse>(this.API_URL, { text }).pipe(
      map((res) => ({
        sentiment: this.mapSentiment(res.prevision),
        probability: res.probabilidad,
      })),
      catchError(this.handleError)
    );
  }

  private mapSentiment(value: string): 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' {
    switch (value.toLowerCase()) {
      case 'positivo':
        return 'POSITIVE';
      case 'negativo':
        return 'NEGATIVE';
      default:
        return 'NEUTRAL';
    }
  }

  private handleError(error: HttpErrorResponse) {
    let message = 'Error inesperado 😬';

    if (error.status === 0) {
      message = 'No se puede conectar con el servidor';
    } else if (error.status === 400) {
      message = 'Texto inválido o vacío';
    } else if (error.status === 502) {
      message = 'El modelo no respondió (502)';
    } else if (error.status === 503) {
      message = 'Servicio no disponible (503)';
    }

    return throwError(() => new Error(message));
  }
  getMetrics() {
    return this.http.get<SentimentMetricsApiResponse>(this.METRICS_URL).pipe(
      map((res) => ({
        total: res.total,

        positivos: res.positivos,
        neutros: res.neutros,
        negativos: res.negativos,

        pctPositivos: res.pctPositivos,
        pctNeutros: res.pctNeutros,
        pctNegativos: res.pctNegativos,
      })),
      catchError(this.handleError)
    );
  }

  getHistory(): Observable<SentimentHistoryItem[]> {
    return this.http.get<any[]>(this.HISTORY_URL).pipe(
      map((res) =>
        res.map((item, index) => ({
          id: index,
          text: item.text,
          sentiment: this.mapSentiment(item.prevision),
          probability: item.probabilidad,
          date:
            item.created_at ||
            item.date ||
            item.timestamp ||
            new Date().toISOString(),
        }))
      ),
      catchError(this.handleError)
    );
  }
}
