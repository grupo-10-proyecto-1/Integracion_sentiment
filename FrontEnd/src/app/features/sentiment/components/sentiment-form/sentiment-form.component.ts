import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-sentiment-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sentiment-form.component.html',
  styleUrl: './sentiment-form.component.css'
})
export class SentimentFormComponent {

   text = '';
  loading = false;

  @Output() analyzeText = new EventEmitter<string>();

  submit() {
    if (!this.text.trim()) return;

    this.loading = true;
    this.analyzeText.emit(this.text);
  }

  stopLoading() {
    this.loading = false;
  }

}
