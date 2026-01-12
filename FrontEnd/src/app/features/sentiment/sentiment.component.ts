import { Component, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SentimentService } from '../../core/services/sentiment.service';
import { SentimentResponse } from '../../core/models/sentiment-response';
import { SentimentMetrics } from '../../core/models/sentiment-metrics';

import { SentimentMetricsComponent } from '../../shared/components/sentiment-metrics/sentiment-metrics.component';
import { SentimentFormComponent } from './components/sentiment-form/sentiment-form.component';
import { SentimentResultComponent } from './components/sentiment-result/sentiment-result.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { MockCarouselComponent } from "../../shared/components/mock-carousel/mock-carousel.component";

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
    MockCarouselComponent
],
  templateUrl: './sentiment.component.html',
  styleUrl: './sentiment.component.css'
})
export class SentimentComponent implements OnInit {

  text = '';
  result?: SentimentResponse;
  metrics?: SentimentMetrics;

  @ViewChild(SentimentFormComponent)
  formComponent!: SentimentFormComponent;

  constructor(private sentimentService: SentimentService) {}

  ngOnInit() {
    this.loadMetrics();
  }

  analyze(text: string) {
    this.text = text;

    this.sentimentService.analyze(text).subscribe({
      next: res => {
        this.result = res;
        this.formComponent.stopLoading();
        this.loadMetrics(); // refresca métricas
      },
      error: () => this.formComponent.stopLoading()
    });
  }

  private loadMetrics() {
    this.sentimentService.getMetrics().subscribe({
      next: res => this.metrics = res
    });
  }
}
