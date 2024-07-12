import { Pipe, PipeTransform } from '@angular/core';
import { Recipe } from '../app.recipes';

@Pipe({
  name: 'recipeShortInstructions',
  standalone: true
})
export class RecipeShortInstructionsPipe implements PipeTransform {

  transform(recipe: Recipe): string {
    return recipe.instructions.split(' ', 40).map(word => word.trim()).join(' ');
  }

}
