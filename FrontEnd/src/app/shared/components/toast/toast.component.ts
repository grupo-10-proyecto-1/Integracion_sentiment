import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="fixed top-24 right-6 z-[100] flex flex-col gap-3 pointer-events-none"
    >
      <div
        *ngFor="let toast of toastService.toasts$ | async"
        class="pointer-events-auto min-w-[300px] max-w-sm p-4 rounded-xl shadow-2xl border backdrop-blur-md animate-slide-in flex items-start gap-3 transition-all transform hover:scale-[1.02]"
        [ngClass]="{
          'bg-slate-900/90 border-slate-700 text-white': toast.type === 'info',
          'bg-emerald-950/90 border-emerald-500/30 text-emerald-100':
            toast.type === 'success',
          'bg-rose-950/90 border-rose-500/30 text-rose-100':
            toast.type === 'error'
        }"
      >
        <!-- Icon -->
        <span class="text-xl">
          {{
            toast.type === 'success'
              ? '✅'
              : toast.type === 'error'
              ? '🚫'
              : 'ℹ️'
          }}
        </span>

        <div class="flex-1">
          <h4
            class="font-bold text-sm uppercase tracking-wider mb-1"
            [ngClass]="{
              'text-emerald-400': toast.type === 'success',
              'text-rose-400': toast.type === 'error',
              'text-slate-400': toast.type === 'info'
            }"
          >
            {{
              toast.type === 'error'
                ? 'Error'
                : toast.type === 'success'
                ? 'Éxito'
                : 'Info'
            }}
          </h4>
          <p class="text-sm opacity-90 leading-relaxed font-medium">
            {{ toast.message }}
          </p>
        </div>

        <button
          (click)="toastService.remove(toast.id!)"
          class="opacity-50 hover:opacity-100 transition-opacity"
        >
          ✖
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateX(20px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      .animate-slide-in {
        animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      }
    `,
  ],
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}
}
