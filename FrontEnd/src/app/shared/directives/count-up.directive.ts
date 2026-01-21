import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  OnInit,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appCountUp]',
  standalone: true,
})
export class CountUpDirective implements OnChanges, OnInit {
  @Input('appCountUp') targetValue: number = 0;
  @Input() duration: number = 2000; // ms

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    this.animate();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['targetValue'] && !changes['targetValue'].firstChange) {
      this.animate();
    }
  }

  private animate() {
    const start = 0;
    const end = this.targetValue;
    const range = end - start;
    const startTime = new Date().getTime();
    const endTime = startTime + this.duration;

    const run = () => {
      const now = new Date().getTime();
      const remaining = Math.max((endTime - now) / this.duration, 0);
      const value = Math.round(end - remaining * range);

      this.renderer.setProperty(
        this.el.nativeElement,
        'innerText',
        value.toLocaleString()
      ); // Add commas

      if (value !== end) {
        requestAnimationFrame(run);
      }
    };

    requestAnimationFrame(run);
  }
}
