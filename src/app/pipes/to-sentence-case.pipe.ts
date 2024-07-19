import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toSentenceCase',
  standalone: true
})
export class ToSentenceCasePipe implements PipeTransform {

  transform(text: string): string {
    if (text.length < 1) return "";
    text = text[0].toUpperCase() + text.slice(1).toLowerCase();
    return text
  }

}
