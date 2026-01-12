import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiHealthService {

  private readonly HEALTH_URL =
    environment.api.baseUrl + environment.api.health;

  constructor(private http: HttpClient) {}

  checkHealth(): Observable<{ status: string }> {
    return this.http.get<{ status: string }>(this.HEALTH_URL);
  }
}
