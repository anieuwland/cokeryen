import { Component, Input, SimpleChanges } from '@angular/core';
import { RecipeCompleteComponent } from '../../components/recipe-complete/recipe-complete.component';
import { BookTeaserComponent } from '../../components/book-teaser/book-teaser.component';
import { Book, DataService, Recipe } from '../../services/data.service';
import { RECIPES } from '../../app.recipes';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'recipe-page',
  standalone: true,
  imports: [
    RecipeCompleteComponent,
    BookTeaserComponent,
    CommonModule,
  ],
  templateUrl: './recipe-page.component.html',
  styleUrl: './recipe-page.component.css'
})
export class RecipePage {
  @Input() bookRef!: string;
  @Input() recipeId!: string;

  public recipe: Recipe | null = null;
  public book: Book | null = null;

  data: DataService

  constructor(data: DataService) {
    this.data = data;
  }

  ngAfterViewInit() {
    console.log(this.bookRef, this.recipeId);
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('bookRef' in changes || 'recipeId' in changes) {
      if (
        this.bookRef === undefined || 
        this.bookRef === null || 
        this.recipeId === undefined || 
        this.recipeId === null
      ) {
        return;
      }

      const recipe = RECIPES.find(r => r.id.toString() == this.recipeId && r.bookRef == this.bookRef);
      const book = this.data.getBooks().find(b => b.ref === recipe?.bookRef);
      this.recipe = recipe ?? null;
      this.book = book ?? null;
    }
  }
}
