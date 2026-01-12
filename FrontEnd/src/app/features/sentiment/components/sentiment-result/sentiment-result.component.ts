import { Component, Input } from '@angular/core';
import { SentimentResponse } from '../../../../core/models/sentiment-response';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sentiment-result',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sentiment-result.component.html',
  styleUrl: './sentiment-result.component.css'
})
export class SentimentResultComponent {

  @Input() text!: string;
  @Input() result!: SentimentResponse;

  get badgeColor() {
    return {
      POSITIVE: ' text-emerald-500',
      NEUTRAL: ' text-slate-500',
      NEGATIVE: ' text-rose-500',
    }[this.result.sentiment];
  }

  get barColor() {
    return {
      POSITIVE: 'bg-emerald-500',
      NEUTRAL: 'bg-slate-400',
      NEGATIVE: 'bg-rose-500',
    }[this.result.sentiment];
  }

  get borderColor() {
    return {
      POSITIVE: 'border-emerald-500',
      NEUTRAL: 'border-slate-400',
      NEGATIVE: 'border-rose-500',
    }[this.result.sentiment];
  }

}
