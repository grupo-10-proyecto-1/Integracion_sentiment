import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { ApiHealthService } from '../../../core/services/api-health.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs'; // Import Subscription

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent implements AfterViewInit, OnInit, OnDestroy {
  apiStatus: 'online' | 'offline' | 'checking' = 'checking';
  private healthSub?: Subscription;

  @ViewChild('stackDetails') stackDetails!: ElementRef<HTMLDetailsElement>;
  @ViewChild('metricsDetails') metricsDetails!: ElementRef<HTMLDetailsElement>;

  ngAfterViewInit() {
    this.updateDetailsState();
  }

  @HostListener('window:resize')
  onResize() {
    this.updateDetailsState();
  }

  private updateDetailsState() {
    const isDesktop = window.innerWidth >= 768; // md breakpoint

    [this.stackDetails, this.metricsDetails].forEach((ref) => {
      if (!ref) return;

      if (isDesktop) {
        ref.nativeElement.open = true;
      } else {
        ref.nativeElement.open = false;
      }
    });
  }

  constructor(private apiHealth: ApiHealthService) {}

  ngOnInit() {
    this.healthSub = this.apiHealth.status$.subscribe((isOnline) => {
      this.apiStatus = isOnline ? 'online' : 'offline';
    });
  }

  ngOnDestroy() {
    this.healthSub?.unsubscribe();
  }
}
