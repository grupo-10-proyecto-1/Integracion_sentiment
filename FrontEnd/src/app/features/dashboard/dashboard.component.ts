import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SentimentChartComponent } from '../../shared/components/sentiment-chart/sentiment-chart.component';
import { SentimentService } from '../../core/services/sentiment.service';
import { SentimentMetrics } from '../../core/models/sentiment-metrics';
import { SentimentHistoryItem } from '../../core/models/sentiment-response';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    SentimentChartComponent,
    HeaderComponent,
    FooterComponent,
    RouterModule,
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  metrics?: SentimentMetrics;
  history: SentimentHistoryItem[] = [];

  constructor(private sentimentService: SentimentService) {}

  ngOnInit() {
    this.sentimentService.getMetrics().subscribe((m) => (this.metrics = m));
    this.sentimentService.getHistory().subscribe((h) => (this.history = h));
  }
}
