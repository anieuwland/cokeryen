import { Component, Input } from '@angular/core';
import { Book, Recipe } from '../../services/data.service';

@Component({
  selector: 'recipe-complete',
  standalone: true,
  imports: [],
  templateUrl: './recipe-complete.component.html',
  styleUrl: './recipe-complete.component.css'
})
export class RecipeCompleteComponent {
  @Input() recipe!: Recipe;
  @Input() book!: Book;

  constructor() {}

  getNameSymbol(): string {
    const words = this.book.person.split(' ').map(word => word.trim())
    const initials: string[] = words.filter((_, idx) => idx === 0 || idx === words.length -1).map(w => w[0]);
    return initials.join("").toUpperCase();
  }
}
