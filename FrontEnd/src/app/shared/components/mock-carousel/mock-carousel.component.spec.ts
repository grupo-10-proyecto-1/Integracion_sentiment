import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockCarouselComponent } from './mock-carousel.component';

describe('MockCarouselComponent', () => {
  let component: MockCarouselComponent;
  let fixture: ComponentFixture<MockCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MockCarouselComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MockCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
