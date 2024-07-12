import { Component, Input } from '@angular/core';
import { Recipe } from '../../app.recipes';
import { RecipeShortInstructionsPipe } from '../../pipes/recipe-short-instructions.pipe';
import { Book } from '../../services/data.service';

@Component({
  selector: 'recipe-teaser',
  standalone: true,
  imports: [RecipeShortInstructionsPipe],
  templateUrl: './recipe-teaser.component.html',
  styleUrl: './recipe-complete.component.css'
})
export class RecipeTeaserComponent {
  @Input() recipe!: Recipe;
  @Input() book!: Book;


}
