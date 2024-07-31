import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { BookTeaserComponent } from '../../components/book-teaser/book-teaser.component';
import { BookTeasersComponent } from "../../components/book-teasers/book-teasers.component";
import { RecipeTeaserComponent } from '../../components/recipe-complete/recipe-teaser.component';
import { ToolbarComponent } from '../../components/toolbar/toolbar.component';
import { Book, DataService, Recipe } from '../../services/data.service';

@Component({
  selector: 'landing-page',
  standalone: true,
  imports: [BookTeaserComponent, BookTeasersComponent, CommonModule, RecipeTeaserComponent, ToolbarComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPage {
  @Input() weergave: string = 'historiseren';
  modernize: boolean = false;

  _recipes: Recipe[] = [];
  recipes: [Recipe, Book][] = [];
  books: { [key: string]: Book } = {};

  constructor(
    data: DataService
  ) {
    this._recipes = data.getRecipes();
    this.books = data.getBooksAsMap();
  }

  ngOnChanges() {
    this.modernize = this.weergave === 'moderniseren';
    this.recipes = this._recipes.map(r => [r, this.books[r.bookRef]])
  }
}
