import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  message: string;
  type: 'success' | 'error' | 'info';
  id?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  toasts$ = this.toastsSubject.asObservable();

  private counter = 0;

  show(message: string, type: 'success' | 'error' | 'info' = 'info') {
    const id = this.counter++;
    const current = this.toastsSubject.value;

    // Prevent duplicates
    const isDuplicate = current.some(
      (t) => t.message === message && t.type === type
    );
    if (isDuplicate) return;

    // Limit to 3 toasts
    if (current.length >= 3) {
      current.shift();
    }

    this.toastsSubject.next([...current, { message, type, id }]);

    setTimeout(() => {
      this.remove(id);
    }, 5000); // Auto remove after 5s
  }

  showError(message: string) {
    this.show(message, 'error');
  }

  showSuccess(message: string) {
    this.show(message, 'success');
  }

  remove(id: number) {
    const current = this.toastsSubject.value;
    this.toastsSubject.next(current.filter((t) => t.id !== id));
  }
}
