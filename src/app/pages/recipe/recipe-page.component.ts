import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { RECIPES } from '../../app.recipes';
import { BookTeaserComponent } from '../../components/book-teaser/book-teaser.component';
import { BookTeasersComponent } from '../../components/book-teasers/book-teasers.component';
import { RecipeCompleteComponent } from '../../components/recipe-complete/recipe-complete.component';
import { ToolbarComponent } from '../../components/toolbar/toolbar.component';
import { Book, DataService, Recipe } from '../../services/data.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'recipe-page',
  standalone: true,
  imports: [
    BookTeaserComponent,
    BookTeasersComponent,
    CommonModule,
    RecipeCompleteComponent,
    ToolbarComponent,
  ],
  templateUrl: './recipe-page.component.html',
  styleUrl: './recipe-page.component.css',
})
export class RecipePage {
  @Input() bookRef!: string;
  @Input() recipeId!: string;
  @Input() weergave: string = "historiseren";

  modernize: boolean = false;
  title: Title;

  public recipe: Recipe | null = null;
  public book: Book | null = null;
  public books: { [key: string]: Book } = {};

  data: DataService;

  constructor(
    data: DataService,
    title: Title,
  ) {
    this.data = data;
    this.books = data.getBooksAsMap();
    this.title = title;
  }

  ngAfterViewInit() { }

  ngOnChanges(changes: SimpleChanges) {
    this.modernize = this.weergave === 'moderniseren';

    if ('bookRef' in changes || 'recipeId' in changes) {
      if (
        this.bookRef === undefined ||
        this.bookRef === null ||
        this.recipeId === undefined ||
        this.recipeId === null
      ) {
        return;
      }

      const recipe = RECIPES.find(
        (r) => r.id.toString() == this.recipeId && r.bookRef == this.bookRef
      );
      const book = this.data.getBooks().find((b) => b.ref === recipe?.bookRef);
      this.recipe = recipe ?? null;
      this.book = book ?? null;

      this.title.setTitle((this.recipe?.title ?? "") + " - Cokeryen");
    }
  }
}
