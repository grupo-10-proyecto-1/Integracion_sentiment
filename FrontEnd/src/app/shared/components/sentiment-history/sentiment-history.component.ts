import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SentimentHistoryItem } from '../../../core/models/sentiment-response';
import { SentimentTranslatePipe } from '../../../shared/pipes/sentiment-translate.pipe';

@Component({
  selector: 'app-sentiment-history',
  standalone: true,
  imports: [CommonModule, SentimentTranslatePipe],
  templateUrl: './sentiment-history.component.html',
})
export class SentimentHistoryComponent {
  @Input() history: SentimentHistoryItem[] = [];
  @Output() selectItem = new EventEmitter<SentimentHistoryItem>();

  getSentimentColor(sentiment: string): string {
    switch (sentiment) {
      case 'POSITIVE':
        return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'NEGATIVE':
        return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
      default:
        return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  }

  onSelect(item: SentimentHistoryItem) {
    this.selectItem.emit(item);
  }
}
