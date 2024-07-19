import { Component, Input } from '@angular/core';
import { RecipeTeaserComponent } from '../../components/recipe-complete/recipe-teaser.component';
import { BookTeaserComponent } from '../../components/book-teaser/book-teaser.component';
import { ToolbarComponent } from '../../components/toolbar/toolbar.component';
import { Book, DataService, Recipe } from '../../services/data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'recipes-page',
  standalone: true,
  imports: [BookTeaserComponent, RecipeTeaserComponent, CommonModule, ToolbarComponent],
  templateUrl: './recipes-page.component.html',
  styleUrl: './recipes-page.component.css'
})
export class RecipesPage {
  @Input() bookRef: string | undefined = undefined;
  @Input() tag: string | string[] | undefined = undefined;
  tags: string[] = [];
  @Input() ingredient: string | string[] | undefined = undefined;
  ingredients: string[] = [];

  _recipes: Recipe[] = [];
  recipes: [Recipe, Book][] = [];
  books: {[key: string]: Book} = {};
  modernized: boolean = false;

  constructor(
    data: DataService
  ) {
    this._recipes = data.getRecipes();
    this.books = data.getBooksAsMap();
  }

  ngOnChanges() {
    this.tags = normalizeToArray(this.tag);
    this.ingredients = normalizeToArray(this.ingredient);

    const tagInArray = (tag: string, array: string[] | undefined) => (array ?? []).indexOf(tag) > -1
    const hasTags = (r: Recipe, tags: string[]) => tags.map((tag: string) => tagInArray(tag, r.modernized?.tags)).every(v => v);
    const hasIngr = (r: Recipe, tags: string[]) => tags.map((tag: string) => tagInArray(tag, (r.modernized?.ingredients ?? []).map(v => v[1]))).every(v => v);

    const f1 = (r: Recipe) => this.bookRef === undefined || r.bookRef === this.bookRef;
    const f2 = (r: Recipe) => this.tags.length > 0 ? hasTags(r, this.tags) : true;
    const f3 = (r: Recipe) => this.ingredients.length > 0 ? hasIngr(r, this.ingredients) : true;
    this.recipes = this._recipes.filter(f1).filter(f2).filter(f3).map(r => [r, this.books[r.bookRef]])

    this._recipes.filter(f1).forEach(r => console.warn(r.modernized?.tags, this.tag, normalizeToArray(this.tag), hasTags(r, normalizeToArray(this.tag))));
  }
}

function normalizeToArray<T>(value: T | T[] | undefined): T[] {
  const defined = value ?? [];
  const array = Array.isArray(defined) ? defined : [defined];
  return array;
}