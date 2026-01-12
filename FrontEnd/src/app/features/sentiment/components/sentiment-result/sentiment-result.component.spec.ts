import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SentimentResultComponent } from './sentiment-result.component';

describe('SentimentResultComponent', () => {
  let component: SentimentResultComponent;
  let fixture: ComponentFixture<SentimentResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SentimentResultComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SentimentResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
