import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SentimentMetrics } from '../../../core/models/sentiment-metrics';

@Component({
  selector: 'app-sentiment-metrics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sentiment-metrics.component.html',
  styleUrl: './sentiment-metrics.component.css'
})
export class SentimentMetricsComponent {

    @Input() metrics!: SentimentMetrics;

}
