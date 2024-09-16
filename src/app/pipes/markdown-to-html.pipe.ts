import { Pipe, PipeTransform } from '@angular/core';
import { marked } from "marked";

@Pipe({
  name: 'markdownToHtml',
  standalone: true
})
export class MarkdownToHtmlPipe implements PipeTransform {
  transform(input: string): string | Promise<string> {
    return input && input.length > 0 ? marked(input) : input;
  }
}
