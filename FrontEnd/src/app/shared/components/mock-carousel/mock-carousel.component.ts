import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mock-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mock-carousel.component.html',
  styleUrl: './mock-carousel.component.css'
})
export class MockCarouselComponent implements OnInit, OnDestroy {

  currentIndex = 0;
  intervalId?: number;
  isMobile = false;

  mocks = [
    {
      text: 'Este producto es increíble, funciona mejor de lo que esperaba.',
      sentiment: 'POSITIVE',
      probability: 0.96,
      id: 1
    },
    {
      text: 'El servicio cumple con lo básico, no es malo pero tampoco destaca.',
      sentiment: 'NEUTRAL',
      probability: 0.96,
      id: 2
    },
    {
      text: 'Muy mala experiencia, el sistema falla y nadie responde.',
      sentiment: 'NEGATIVE',
      probability: 0.81,
      id: 3
    }
  ];

  ngOnInit() {
    this.checkScreen();
    if (this.isMobile) {
      this.startCarousel();
    }
  }

  ngOnDestroy() {
    this.stopCarousel();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreen();
  }

  private checkScreen() {
    const mobileNow = window.innerWidth < 768;

    if (mobileNow && !this.isMobile) {
      this.isMobile = true;
      this.startCarousel();
    }

    if (!mobileNow && this.isMobile) {
      this.isMobile = false;
      this.stopCarousel();
    }
  }

  private startCarousel() {
    this.stopCarousel();
    this.intervalId = window.setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.mocks.length;
    }, 5000);
  }

  private stopCarousel() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  getVisibleMocks() {
    if (this.isMobile) {
      return [this.mocks[this.currentIndex]];
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
