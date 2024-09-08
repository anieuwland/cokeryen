import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NormalizeRecipeTextPipe } from "../../pipes/normalize-recipe-text.pipe";
import { ToSentenceCasePipe } from "../../pipes/to-sentence-case.pipe";
import { RecipeBook } from '../../domain/recipe-book';
import { RecipeEntry, RecipeImageUrlPipe } from '../../domain/recipe-entry';

@Component({
  selector: 'recipe-complete',
  standalone: true,
  imports: [CommonModule, RouterModule, NormalizeRecipeTextPipe, ToSentenceCasePipe, RecipeImageUrlPipe],
  templateUrl: './recipe-complete.component.html',
  styleUrl: './recipe-complete.component.css'
})
export class RecipeCompleteComponent implements OnChanges {
  @Input() recipe!: RecipeEntry;
  @Input() book!: RecipeBook;
  @Input() modernize: boolean = false;

  constructor() { }

  ngOnChanges() { }

  getNameSymbol(): string {
    const words = this.book.person.split(' ').map(word => word.trim())
    const initials: string[] = words.filter((_, idx) => idx === 0 || idx === words.length - 1).map(w => w[0]);
    return initials.join("").toUpperCase();
  }
}
