import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SentimentService } from '../../../core/services/sentiment.service';

@Component({
  selector: 'app-mock-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mock-carousel.component.html',
  styleUrl: './mock-carousel.component.css',
})
export class MockCarouselComponent implements OnInit, OnDestroy {
  currentIndex = 0;
  isMobile = false;

  // 🔹 Todos los registros del backend
  allMocks: any[] = [];

  // 🔹 Los 3 visibles (1 por sentimiento)
  mocks: any[] = [];

  // 🔹 Colas balanceadas
  positiveQueue: any[] = [];
  negativeQueue: any[] = [];
  neutralQueue: any[] = [];

  // 🔹 Intervalos
  carouselInterval?: number;
  rotationInterval?: number;

  readonly CAROUSEL_TIME = 5000; // mobile
  readonly ROTATION_TIME = 6000; // desktop

  constructor(private sentimentService: SentimentService) {}

  // ================================
  // 🚀 LIFECYCLE
  // ================================
  ngOnInit() {
    this.checkScreen();
    this.loadHistory();
  }

  ngOnDestroy() {
    this.stopCarousel();
    this.stopRotation();
  }

  // ================================
  // 📡 DATA
  // ================================
  reload() {
    this.loadHistory();
  }

  private loadHistory() {
    this.sentimentService.getHistory().subscribe((res) => {
      this.allMocks = res || [];

      this.resetQueues();
      this.pickBalancedMocks();

      if (this.isMobile) {
        this.startCarousel();
      } else {
        this.startRotation();
      }
    });
  }

  // ================================
  // 🎯 BALANCED LOGIC
  // ================================
  private pickBalancedMocks() {
    if (
      !this.positiveQueue.length ||
      !this.negativeQueue.length ||
      !this.neutralQueue.length
    ) {
      this.resetQueues();
    }

    const positive = this.positiveQueue.shift();
    const negative = this.negativeQueue.shift();
    const neutral = this.neutralQueue.shift();

    this.mocks = [positive, negative, neutral].filter(Boolean);
    this.currentIndex = 0;
  }

  private resetQueues() {
    this.positiveQueue = this.shuffle(
      this.allMocks.filter((m) => m.sentiment === 'POSITIVE')
    );

    this.negativeQueue = this.shuffle(
      this.allMocks.filter((m) => m.sentiment === 'NEGATIVE')
    );

    this.neutralQueue = this.shuffle(
      this.allMocks.filter((m) => m.sentiment === 'NEUTRAL')
    );
  }

  private shuffle(array: any[]) {
    return [...array].sort(() => Math.random() - 0.5);
  }

  // ================================
  // 📱 MOBILE CAROUSEL (1 en 1)
  // ================================
  private startCarousel() {
    this.stopCarousel();
    this.carouselInterval = window.setInterval(() => {
      if (!this.mocks.length) return;
      this.currentIndex = (this.currentIndex + 1) % this.mocks.length;
    }, this.CAROUSEL_TIME);
  }

  private stopCarousel() {
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
      this.carouselInterval = undefined;
    }
  }

  // ================================
  // 🖥️ DESKTOP ROTATION (3 balanceados)
  // ================================
  private startRotation() {
    this.stopRotation();
    this.rotationInterval = window.setInterval(() => {
      this.pickBalancedMocks();
    }, this.ROTATION_TIME);
  }

  private stopRotation() {
    if (this.rotationInterval) {
      clearInterval(this.rotationInterval);
      this.rotationInterval = undefined;
    }
  }

  // ================================
  // 📐 RESPONSIVE
  // ================================
  @HostListener('window:resize')
  onResize() {
    this.checkScreen();
  }

  private checkScreen() {
    const mobileNow = window.innerWidth < 768;

    if (mobileNow !== this.isMobile) {
      this.isMobile = mobileNow;

      this.stopCarousel();
      this.stopRotation();

      if (this.isMobile) {
        this.startCarousel();
      } else {
        this.pickBalancedMocks();
        this.startRotation();
      }
    }
  }

  // ================================
  // 🎨 UI HELPERS
  // ================================
  getVisibleMocks() {
    if (this.isMobile) {
      return this.mocks.length ? [this.mocks[this.currentIndex]] : [];
    }
    return this.mocks;
  }

  badgeClass(sentiment: string) {
    return sentiment === 'POSITIVE'
      ? 'bg-emerald-500 text-emerald-900'
      : sentiment === 'NEGATIVE'
      ? 'bg-rose-500 text-rose-900'
      : 'bg-slate-400 text-slate-900';
  }

  barClass(sentiment: string) {
    return sentiment === 'POSITIVE'
      ? 'bg-emerald-500'
      : sentiment === 'NEGATIVE'
      ? 'bg-rose-500'
      : 'bg-slate-400';
  }

  borderClass(sentiment: string) {
    return sentiment === 'POSITIVE'
      ? 'border-emerald-500'
      : sentiment === 'NEGATIVE'
      ? 'border-rose-500'
      : 'border-slate-400';
  }
}
