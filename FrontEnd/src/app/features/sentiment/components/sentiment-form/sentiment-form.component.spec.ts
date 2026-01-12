import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SentimentFormComponent } from './sentiment-form.component';

describe('SentimentFormComponent', () => {
  let component: SentimentFormComponent;
  let fixture: ComponentFixture<SentimentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SentimentFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SentimentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
