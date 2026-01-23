import { Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { BehaviorSubject, Observable, of, timer } from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  map,
  switchMap,
  tap,
} from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { SKIP_ERROR_NOTIFICATION } from '../interceptors/error.interceptor';

@Injectable({
  providedIn: 'root',
})
export class ApiHealthService {
  private readonly HEALTH_URL =
    environment.api.baseUrl + environment.api.health;

  // State management
  private statusSubject = new BehaviorSubject<boolean>(false);
  status$ = this.statusSubject.asObservable().pipe(distinctUntilChanged());

  constructor(private http: HttpClient) {
    this.startMonitoring();
  }

  private startMonitoring() {
    timer(0, 5000)
      .pipe(
        switchMap(() =>
          this.checkHealthRaw().pipe(
            map(() => true),
            catchError(() => of(false))
          )
        )
      )
      .subscribe((isOnline) => {
        this.statusSubject.next(isOnline);
      });
  }

  // Raw check for immediate needs if any
  checkHealthRaw(): Observable<any> {
    return this.http.get<{ status: string }>(this.HEALTH_URL, {
      context: new HttpContext().set(SKIP_ERROR_NOTIFICATION, true),
    });
  }

  // Deprecated but kept for compatibility if needed, though we should migrate calls
  checkHealth(): Observable<{ status: string }> {
    return this.checkHealthRaw();
  }
}
