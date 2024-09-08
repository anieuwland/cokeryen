import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { BookTeaserComponent } from '../../components/book-teaser/book-teaser.component';
import { BookTeasersComponent } from "../../components/book-teasers/book-teasers.component";
import { RecipeTeaserComponent } from '../../components/recipe-teaser/recipe-teaser.component';
import { ToolbarComponent } from '../../components/toolbar/toolbar.component';
import { DataService } from '../../services/data.service';
import { RecipeBook } from '../../domain/recipe-book';
import { RecipeEntry } from '../../domain/recipe-entry';
import { LinkPreviewService } from '../../services/link-preview.service';
import { PageContainerComponent } from "../../components/page-container/page-container.component";

export const LANDING_PAGE_TITLE = "Smaak van de redactie - Cokeryen";

@Component({
  selector: 'landing-page',
  standalone: true,
  imports: [BookTeaserComponent, BookTeasersComponent, CommonModule, RecipeTeaserComponent, ToolbarComponent, PageContainerComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPage implements OnInit, OnChanges {
  @Input() weergave: string = 'historiseren';

  modernize: boolean = false;

  _recipes: RecipeEntry[] = [];
  recipes: [RecipeEntry, RecipeBook][][] = [];
  books: { [key: string]: RecipeBook } = {};
  pageTitle = LANDING_PAGE_TITLE;

  constructor(
    private data: DataService,
    private linkPreview: LinkPreviewService,
  ) { }

  ngOnInit() {
    const books = this.data.getBooksAsMap().then(bs => this.books = bs);
    // const recipes = this.data.getRecipes().then(rs => this._recipes = rs);
    const recipes = this.data.getRecipesLandingPage().then(rs => this.recipes = explode(rs));
    const promises = [books, recipes];
    Promise.all(promises).then(_ => this.ngOnChanges());
  }

  ngOnChanges() {
    this.modernize = this.weergave === 'moderniseren';
    const firstRecipe = this._recipes.length > 0 ? this._recipes[0] : undefined;
    this.linkPreview.updatePreviewTags(this.modernize, LANDING_PAGE_TITLE, firstRecipe);
  }
}

function explode(left: any[]): any[] {
  const numCols = 3;
  const restructured: [RecipeEntry, RecipeBook][][] = Array(numCols);
  restructured[0] = left.slice(0, numCols);
  restructured[1] = left.slice(numCols, numCols * 2);
  restructured[2] = left.slice(numCols * 2, numCols * 3);
  return restructured;
}
