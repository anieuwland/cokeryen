import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { RecipeTeaserComponent } from '../../components/recipe-complete/recipe-teaser.component';
import { BookTeaserComponent } from '../../components/book-teaser/book-teaser.component';
import { ToolbarComponent } from '../../components/toolbar/toolbar.component';
import { DataService } from '../../services/data.service';
import { CommonModule } from '@angular/common';
import { BookTeasersComponent } from "../../components/book-teasers/book-teasers.component";
import { Title } from '@angular/platform-browser';
import { RecipeEntry } from '../../domain/recipe-entry';
import { RecipeBook } from '../../domain/recipe-book';
import { LinkPreviewService } from '../../services/link-preview.service';

@Component({
  selector: 'recipes-page',
  standalone: true,
  imports: [BookTeaserComponent, RecipeTeaserComponent, CommonModule, ToolbarComponent, BookTeasersComponent],
  templateUrl: './recipes-page.component.html',
  styleUrl: './recipes-page.component.css'
})
export class RecipesPage implements OnInit, OnChanges {
  @Input() bookRef: string | undefined = undefined;
  @Input() tag: string | string[] | undefined = undefined;
  tags: string[] = [];
  @Input() ingredient: string | string[] | undefined = undefined;
  ingredients: string[] = [];
  @Input() weergave: string = "historiseren";

  modernize: boolean = false;

  _recipes: RecipeEntry[] = [];
  recipes: [RecipeEntry, RecipeBook][] = [];
  books: { [key: string]: RecipeBook } = {};

  constructor(
    private data: DataService,
    private linkPreview: LinkPreviewService,
  ) {}

  public get pageTitle(): string {
    const bookRef = this.bookRef;
    const available = bookRef && (bookRef in this.books);
    return available ? this.books[bookRef].title : "";
  }

  ngOnInit() {
    const books = this.data.getBooksAsMap().then(books => this.books = books);
    const recipes = this.data.getRecipes().then(rs => this._recipes = rs);
    Promise.all([books, recipes]).then(_ => this.ngOnChanges());
  }

  ngOnChanges() {
    this.tags = normalizeToArray(this.tag);
    this.ingredients = normalizeToArray(this.ingredient);
    this.modernize = this.weergave === 'moderniseren';

    const tagInArray = (tag: string, array: string[] | undefined) => (array ?? []).indexOf(tag) > -1
    const hasTags = (r: RecipeEntry, tags: string[]) => tags.map((tag: string) => tagInArray(tag, r.modernized?.tags)).every(v => v);
    const hasIngr = (r: RecipeEntry, tags: string[]) => tags.map((tag: string) => tagInArray(tag, (r.modernized?.ingredients ?? []).map(v => v[1]))).every(v => v);

    const f1 = (r: RecipeEntry) => this.bookRef === undefined || r.book.reference === this.bookRef;
    const f2 = (r: RecipeEntry) => this.tags.length > 0 ? hasTags(r, this.tags) : true;
    const f3 = (r: RecipeEntry) => this.ingredients.length > 0 ? hasIngr(r, this.ingredients) : true;
    this.recipes = this._recipes.filter(f1).filter(f2).filter(f3).map(r => [r, this.books[r.book.reference]])

    const title = [this.pageTitle, "Cokeryen"].filter(s => s !== "").join(" - ");
    const firstRecipe = this.recipes.length > 0 ? this.recipes[0][0] : undefined;
    this.linkPreview.updatePreviewTags(this.modernize, title, firstRecipe);
  }
}

function normalizeToArray<T>(value: T | T[] | undefined): T[] {
  const defined = value ?? [];
  const array = Array.isArray(defined) ? defined : [defined];
  return array;
}

