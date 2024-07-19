import { Component, Input } from '@angular/core';
import { RecipeShortInstructionsPipe } from '../../pipes/recipe-short-instructions.pipe';
import { Book, Recipe } from '../../services/data.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NormalizeRecipeTextPipe } from "../../pipes/normalize-recipe-text.pipe";
import { ToSentenceCasePipe } from "../../pipes/to-sentence-case.pipe";

@Component({
  selector: 'recipe-teaser',
  standalone: true,
  imports: [CommonModule, RecipeShortInstructionsPipe, RouterModule, NormalizeRecipeTextPipe, ToSentenceCasePipe],
  templateUrl: './recipe-teaser.component.html',
  styleUrl: './recipe-complete.component.css'
})
export class RecipeTeaserComponent {
  @Input() recipe!: Recipe;
  @Input() book!: Book;
  @Input() modernize: boolean = false;
  @Input() tags: string[] = [];
}
