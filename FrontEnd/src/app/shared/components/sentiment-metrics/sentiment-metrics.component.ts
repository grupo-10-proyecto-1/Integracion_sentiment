import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SentimentMetrics } from '../../../core/models/sentiment-metrics';
import { CountUpDirective } from '../../directives/count-up.directive';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sentiment-metrics',
  standalone: true,
  imports: [CommonModule, CountUpDirective, RouterModule],
  templateUrl: './sentiment-metrics.component.html',
  styleUrl: './sentiment-metrics.component.css',
})
export class SentimentMetricsComponent {
  @Input() metrics!: SentimentMetrics;
}
