import { Component, Input } from '@angular/core';
import { Book, Recipe } from '../../services/data.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'recipe-complete',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './recipe-complete.component.html',
  styleUrl: './recipe-complete.component.css'
})
export class RecipeCompleteComponent {
  @Input() recipe!: Recipe;
  @Input() book!: Book;
  @Input() modernize: boolean = false;

  constructor() {}

  getNameSymbol(): string {
    const words = this.book.person.split(' ').map(word => word.trim())
    const initials: string[] = words.filter((_, idx) => idx === 0 || idx === words.length -1).map(w => w[0]);
    return initials.join("").toUpperCase();
  }
}
