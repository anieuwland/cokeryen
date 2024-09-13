import { Component, Input } from '@angular/core';
import { RecipeTeaserComponent } from "../recipe-teaser/recipe-teaser.component";
import { CommonModule } from '@angular/common';
import { RecipeEntry } from '../../domain/recipe-entry';
import { fromEvent, Observable, Subscription } from 'rxjs';

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
  @Input() linkTags: string[] = [];
  
  columns: number[] = [0];
  numColumns = 1;
  resizeObservable$: Observable<Event>;
  resizeSubscription$: Subscription;
    
  constructor() {
    this.resizeObservable$ = fromEvent(window, 'resize');
    this.resizeSubscription$ = this.resizeObservable$.subscribe((e: Event) => this.numColumns = changeRecipeColumns())
  }

  ngOnChanges() {
    this.columns = [...Array(this.numColumns).keys()];
    this.numColumns = changeRecipeColumns();
    console.log(this.numColumns, this.columns);
  }
}

export const changeRecipeColumns = (): number => {
  const elements = document.getElementsByTagName("h1");
  if (elements.length !== 1) {
    console.error("Could not find expect recipes container '<h1>'", elements)
    return -1;
  }

  const width = elements[0].scrollWidth;
  let numColumns = 0;
  if (width >= 774) {
    numColumns = 3;
  }
  else if (width >= 512) {
    numColumns = 2;
  }
  else {
    numColumns = 1;
  }
  // console.debug(width, numColumns);
  return numColumns
}