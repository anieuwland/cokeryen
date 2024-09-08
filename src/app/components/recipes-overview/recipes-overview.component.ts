import { Component, Input } from '@angular/core';
import { RecipeTeaserComponent } from "../recipe-teaser/recipe-teaser.component";
import { CommonModule } from '@angular/common';
import { RecipeEntry } from '../../domain/recipe-entry';

@Component({
  selector: 'recipes-overview',
  standalone: true,
  imports: [CommonModule, RecipeTeaserComponent],
  templateUrl: './recipes-overview.component.html',
  styleUrl: './recipes-overview.component.css'
})
export class RecipesOverviewComponent {
  @Input() recipes: RecipeEntry[] = [];
  @Input() modernize = false;
  @Input() numColumns = 1;
  @Input() linkTags: string[] = [];

  columns: number[] = [0];

  ngOnChanges() {
    this.columns = [...Array(this.numColumns).keys()];
  }
}
