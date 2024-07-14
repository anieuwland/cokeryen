import { Component, Input } from '@angular/core';
import { RecipeShortInstructionsPipe } from '../../pipes/recipe-short-instructions.pipe';
import { Book, Recipe } from '../../services/data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'recipe-teaser',
  standalone: true,
  imports: [CommonModule, RecipeShortInstructionsPipe],
  templateUrl: './recipe-teaser.component.html',
  styleUrl: './recipe-complete.component.css'
})
export class RecipeTeaserComponent {
  @Input() recipe!: Recipe;
  @Input() book!: Book;
  @Input() modernize: boolean = false;
}
