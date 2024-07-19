import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'normalizeRecipeText',
  standalone: true
})
export class NormalizeRecipeTextPipe implements PipeTransform {

  transform(text: string): string {
    const commentRx = / \[.+?\]/g;
    text = text.replaceAll('*', '');
    text = text.replaceAll(commentRx, '');
    return text;
  }

}
