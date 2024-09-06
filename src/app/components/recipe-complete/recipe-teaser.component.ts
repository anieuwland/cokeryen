import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { RecipeShortInstructionsPipe } from '../../pipes/recipe-short-instructions.pipe';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NormalizeRecipeTextPipe } from "../../pipes/normalize-recipe-text.pipe";
import { ToSentenceCasePipe } from "../../pipes/to-sentence-case.pipe";
import { RecipeEntry } from '../../domain/recipe-entry';
import { RecipeBook } from '../../domain/recipe-book';

@Component({
  selector: 'recipe-teaser',
  standalone: true,
  imports: [CommonModule, RecipeShortInstructionsPipe, RouterModule, NormalizeRecipeTextPipe, ToSentenceCasePipe],
  templateUrl: './recipe-teaser.component.html',
  styleUrl: './recipe-complete.component.css'
})
export class RecipeTeaserComponent {
  @Input() recipe!: RecipeEntry;
  @Input() book!: RecipeBook;
  @Input() modernize: boolean = false;
  @Input() tags: string[] = [];
}
