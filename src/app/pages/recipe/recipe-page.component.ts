import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
} from '@angular/core';
import { BookTeaserComponent } from '../../components/book-teaser/book-teaser.component';
import { BookTeasersComponent } from '../../components/book-teasers/book-teasers.component';
import { RecipeCompleteComponent } from '../../components/recipe-complete/recipe-complete.component';
import { ToolbarComponent } from '../../components/toolbar/toolbar.component';
import { DataService } from '../../services/data.service';
import { RecipeEntry } from '../../domain/recipe-entry';
import { RecipeBook } from '../../domain/recipe-book';
import { LinkPreviewService } from '../../services/link-preview.service';
import { SpinnerComponent } from "../../components/spinner/spinner.component";

@Component({
  selector: 'recipe-page',
  standalone: true,
  imports: [
    BookTeaserComponent,
    BookTeasersComponent,
    CommonModule,
    RecipeCompleteComponent,
    ToolbarComponent,
    SpinnerComponent
],
  templateUrl: './recipe-page.component.html',
  styleUrl: './recipe-page.component.css',
})
export class RecipePage implements OnInit, OnChanges {
  @Input() bookRef!: string;
  @Input() recipeNumber!: string;
  @Input() weergave: string = 'historiseren';

  modernize: boolean = false;

  public recipe: RecipeEntry | undefined = undefined;
  public book: RecipeBook | undefined = undefined;
  public books: { [key: string]: RecipeBook } = {};

  constructor(
    private data: DataService,
    private linkPreview: LinkPreviewService,
  ) { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.book = undefined;
    this.recipe = undefined;
    this.modernize = this.weergave === 'moderniseren';

    const update0 = this.data.getBooksAsMap();
    const update2 = this.updateRecipe();
    Promise.all([update0, update2]).then(([books, recipe]) => {
      this.books = books;
      this.book = books[this.bookRef];
      this.recipe = recipe;
      if (recipe === undefined) {
        console.error("Failed to retrieve recipe, rendering interrupted");
        return;
      }

      const title = phraseTitle(this.weergave, recipe);
      this.linkPreview.updatePreviewTags(this.modernize, title, recipe);
    });
  }

  async updateRecipe(): Promise<RecipeEntry | undefined> {
    this.recipe = undefined;
    if (!this.bookRef) return undefined;
    else return this.data.getRecipe(this.bookRef, this.recipeNumber)
  }
}

const phraseTitle = (modernize: string, recipe: RecipeEntry): string => {
  const variantTitle = modernize ? recipe.modernized?.title : recipe.historical.title;
  const title = [variantTitle ?? '', 'Cokeryen'].filter(s => s !== "");
  return title.join(" - ");
}
