import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription, timer, of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';

import { SentimentService } from '../../core/services/sentiment.service';
import { ApiHealthService } from '../../core/services/api-health.service';
import { ToastService } from '../../core/services/toast.service';

import {
  SentimentResponse,
  SentimentHistoryItem,
} from '../../core/models/sentiment-response';
import { SentimentMetrics } from '../../core/models/sentiment-metrics';

import { SentimentMetricsComponent } from '../../shared/components/sentiment-metrics/sentiment-metrics.component';
import { SentimentFormComponent } from './components/sentiment-form/sentiment-form.component';
import { SentimentResultComponent } from './components/sentiment-result/sentiment-result.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { MockCarouselComponent } from '../../shared/components/mock-carousel/mock-carousel.component';
import { SentimentChartComponent } from '../../shared/components/sentiment-chart/sentiment-chart.component';
import { SentimentHistoryComponent } from '../../shared/components/sentiment-history/sentiment-history.component';

@Component({
  selector: 'app-sentiment',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SentimentMetricsComponent,
    SentimentFormComponent,
    SentimentResultComponent,
    HeaderComponent,
    FooterComponent,
    MockCarouselComponent,
    SentimentHistoryComponent,
  ],
  templateUrl: './sentiment.component.html',
  styleUrl: './sentiment.component.css',
})
export class SentimentComponent implements OnInit, OnDestroy {
  text = '';
  result?: SentimentResponse;
  metrics?: SentimentMetrics;
  history: SentimentHistoryItem[] = [];
  showHistory = false;

  apiOnline = false;
  checkingApi = true;
  private healthSubscription?: Subscription;

  @ViewChild(SentimentFormComponent)
  formComponent!: SentimentFormComponent;

  @ViewChild(MockCarouselComponent)
  carouselComponent!: MockCarouselComponent;

  constructor(
    private sentimentService: SentimentService,
    private apiHealth: ApiHealthService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.subscribeToHealth();
  }

  ngOnDestroy() {
    this.healthSubscription?.unsubscribe();
  }

  private subscribeToHealth() {
    this.healthSubscription = this.apiHealth.status$.subscribe((isOnline) => {
      const wasChecking = this.checkingApi;
      this.apiOnline = isOnline;
      this.checkingApi = false;

      // Reload data whenever connection is available
      if (isOnline) {
        this.loadMetrics();
        this.carouselComponent?.reload();
      }

      if (!wasChecking) {
        // Subsequent status change
        if (isOnline) {
          this.toastService.showSuccess('Conexión con la API restablecida 🟢');
        } else {
          this.toastService.showError('Conexión con la API perdida 🔴');
        }
      } else {
        // Initial check
        if (isOnline) {
          this.toastService.showSuccess('API Conectada y lista 🚀');
        }
      }
    });
  }

  analyze(text: string) {
    if (!this.apiOnline) return;

    this.text = text;

    this.sentimentService.analyze(text).subscribe({
      next: (res) => {
        this.result = res;
        this.formComponent.stopLoading();
        this.formComponent.clear(); // Clear text on success
        this.loadMetrics();
        this.scrollToResult();
      },
      error: () => this.formComponent.stopLoading(),
    });
  }

  selectHistoryItem(item: SentimentHistoryItem) {
    this.text = item.text;
    this.result = {
      sentiment: item.sentiment,
      probability: item.probability,
    };
    this.scrollToResult();
  }

  private scrollToResult() {
    // Scroll to result after view updates
    setTimeout(() => {
      const element = document.getElementById('sentiment-result');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  loadMetrics() {
    this.sentimentService.getMetrics().subscribe({
      next: (res) => (this.metrics = res),
    });

    this.sentimentService.getHistory().subscribe({
      next: (res) => (this.history = res),
    });
  }
}
