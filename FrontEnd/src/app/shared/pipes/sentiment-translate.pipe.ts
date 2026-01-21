import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sentimentTranslate',
  standalone: true,
})
export class SentimentTranslatePipe implements PipeTransform {
  transform(value: string | undefined | null): string {
    if (!value) return '';

    switch (value.toUpperCase()) {
      case 'POSITIVE':
        return 'POSITIVO';
      case 'NEGATIVE':
        return 'NEGATIVO';
      case 'NEUTRAL':
        return 'NEUTRO';
      default:
        return value;
    }
  }
}
