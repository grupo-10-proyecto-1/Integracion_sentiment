import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ApiHealthService } from '../../../core/services/api-health.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
   imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements AfterViewInit {
   apiStatus: 'online' | 'offline' | 'checking' = 'checking';

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

    [this.stackDetails, this.metricsDetails].forEach(ref => {
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
    this.apiHealth.checkHealth().subscribe({
      next: () => this.apiStatus = 'online',
      error: () => this.apiStatus = 'offline'
    });
  }

}
