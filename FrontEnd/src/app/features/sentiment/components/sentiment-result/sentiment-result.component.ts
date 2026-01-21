import { Component, Input, ElementRef, ViewChild } from '@angular/core';
import { SentimentResponse } from '../../../../core/models/sentiment-response';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SentimentTranslatePipe } from '../../../../shared/pipes/sentiment-translate.pipe';
import { toPng } from 'html-to-image';

@Component({
  selector: 'app-sentiment-result',
  standalone: true,
  imports: [CommonModule, FormsModule, SentimentTranslatePipe],
  templateUrl: './sentiment-result.component.html',
  styleUrl: './sentiment-result.component.css',
})
export class SentimentResultComponent {
  @Input() text!: string;
  @Input() result!: SentimentResponse;
  @ViewChild('resultCard') resultCard!: ElementRef;

  downloading = false;

  get badgeColor() {
    return {
      POSITIVE: ' text-emerald-600 dark:text-emerald-500',
      NEUTRAL: ' text-slate-600 dark:text-slate-500',
      NEGATIVE: ' text-rose-600 dark:text-rose-500',
    }[this.result.sentiment];
  }

  get barColor() {
    return {
      POSITIVE: 'bg-emerald-500 dark:bg-emerald-500',
      NEUTRAL: 'bg-slate-400 dark:bg-slate-400',
      NEGATIVE: 'bg-rose-500 dark:bg-rose-500',
    }[this.result.sentiment];
  }

  get borderColor() {
    return {
      POSITIVE: 'border-emerald-500 dark:border-emerald-500',
      NEUTRAL: 'border-slate-400 dark:border-slate-400',
      NEGATIVE: 'border-rose-500 dark:border-rose-500',
    }[this.result.sentiment];
  }

  get containerBackground() {
    return {
      POSITIVE:
        'from-emerald-50 to-white dark:from-emerald-950/20 dark:to-slate-950 border-emerald-200 dark:border-emerald-500/10',
      NEUTRAL:
        'from-slate-50 to-white dark:from-slate-800/20 dark:to-slate-950 border-slate-200 dark:border-slate-700/30',
      NEGATIVE:
        'from-rose-50 to-white dark:from-rose-950/20 dark:to-slate-950 border-rose-200 dark:border-rose-500/10',
    }[this.result.sentiment];
  }

  async downloadCertificate() {
    if (this.downloading) return;
    this.downloading = true;

    try {
      const dataUrl = await toPng(this.resultCard.nativeElement, {
        backgroundColor: '#020617', // slate-950
        cacheBust: true,
        pixelRatio: 2,
      });

      const link = document.createElement('a');
      link.download = `sentimiento-${new Date().getTime()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error generating certificate', err);
    } finally {
      this.downloading = false;
    }
  }
}
