import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'recipeShortInstructions',
  standalone: true
})
export class RecipeShortInstructionsPipe implements PipeTransform {

  transform(instructions: string): string {
    return instructions.split(' ', 40).map(word => word.trim()).join(' ');
  }

}
