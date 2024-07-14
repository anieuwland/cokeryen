import { Component } from '@angular/core';
import { RecipeTeaserComponent } from '../../components/recipe-complete/recipe-teaser.component';
import { BookTeaserComponent } from '../../components/book-teaser/book-teaser.component';
import { ToolbarComponent } from '../../components/toolbar/toolbar.component';
import { Book, DataService, Recipe } from '../../services/data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'landing-page',
  standalone: true,
  imports: [BookTeaserComponent, RecipeTeaserComponent, CommonModule, ToolbarComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPage {
  _recipes: Recipe[] = [];
  recipes: [Recipe, Book][];
  books: {[key: string]: Book} = {};
  modernized: boolean = false;

  constructor(
    data: DataService
  ) {
    this._recipes = data.getRecipes();
    data.getBooks().forEach(b => this.books[b.ref] = b);

    this.recipes = this._recipes.map(r => [r, this.books[r.bookRef]])
  }
}
