import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExportService } from '../../../../core/services/export.service';
import { SentimentTranslatePipe } from '../../../../shared/pipes/sentiment-translate.pipe';

@Component({
  selector: 'app-batch-results',
  standalone: true,
  imports: [CommonModule, SentimentTranslatePipe],
  template: `
    <div
      class="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500"
    >
      <div
        class="p-6 border-b border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4"
      >
        <div>
          <h3 class="text-xl font-bold text-white flex items-center gap-2">
            📊 Resultados del Lote
          </h3>
          <p class="text-sm text-slate-400">
            {{ results.length }} comentarios procesados
          </p>
        </div>

        <button
          (click)="export()"
          class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-emerald-900/20"
        >
          <span>📥</span> Descargar Excel Completo
        </button>
      </div>

      <div class="overflow-x-auto max-h-[500px] custom-scrollbar">
        <table class="w-full text-left border-collapse">
          <thead class="bg-slate-950 sticky top-0 z-10">
            <tr>
              <th
                class="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider"
              >
                Texto
              </th>
              <th
                class="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider"
              >
                Sentimiento
              </th>
              <th
                class="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider"
              >
                Confianza
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800">
            <tr
              *ngFor="let item of results"
              class="hover:bg-slate-800/30 transition-colors"
            >
              <td
                class="p-4 text-sm text-slate-300 max-w-md truncate"
                [title]="item.text"
              >
                {{ item.text }}
              </td>
              <td class="p-4">
                <span
                  class="px-2 py-1 rounded text-xs font-bold uppercase tracking-wide border"
                  [ngClass]="{
                    'bg-emerald-500/10 text-emerald-400 border-emerald-500/20':
                      item.analysis?.sentiment === 'POSITIVE',
                    'bg-rose-500/10 text-rose-400 border-rose-500/20':
                      item.analysis?.sentiment === 'NEGATIVE',
                    'bg-slate-500/10 text-slate-400 border-slate-500/20':
                      item.analysis?.sentiment === 'NEUTRAL'
                  }"
                >
                  {{ item.analysis?.sentiment | sentimentTranslate }}
                </span>
              </td>
              <td class="p-4 text-sm font-mono text-slate-400">
                {{ item.analysis?.probability * 100 | number : '1.1-1' }}%
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [
    `
      .custom-scrollbar::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: #0f172a;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #334155;
        border-radius: 4px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #475569;
      }
    `,
  ],
})
export class BatchResultsComponent {
  @Input() results: any[] = [];

  constructor(private exportService: ExportService) {}

  export() {
    // Check if we need to modify ExportService to handle this specific format?
    // Current ExportService.exportToExcel expects Metrics + History.
    // The requirement is "export arbitrary array".
    // I should create a generic export or map this to a history-like format?
    // User requested "devuelva otro excel... con dos columnas extra".
    // I will call a NEW method in ExportService or reuse.
    // I'll create `exportBatchResults` in ExportService.
    this.exportService.exportBatchResults(this.results);
  }
}
