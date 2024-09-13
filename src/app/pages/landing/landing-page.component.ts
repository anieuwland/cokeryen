import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { BookTeaserComponent } from '../../components/book-teaser/book-teaser.component';
import { BookTeasersComponent } from "../../components/book-teasers/book-teasers.component";
import { RecipeTeaserComponent } from '../../components/recipe-teaser/recipe-teaser.component';
import { ToolbarComponent } from '../../components/toolbar/toolbar.component';
import { DataService } from '../../services/data.service';
import { RecipeBook } from '../../domain/recipe-book';
import { RecipeEntry, RecipeImageUrlPipe, RecipeUrlPipe } from '../../domain/recipe-entry';
import { LinkPreviewService } from '../../services/link-preview.service';
import { PageContainerComponent } from "../../components/page-container/page-container.component";
import { changeRecipeColumns, RecipesOverviewComponent } from "../../components/recipes-overview/recipes-overview.component";
import { ResponsiveColumn } from "../../components/responsive-column/responsive-column.component";
import { LikeLandingPage } from '../../domain/like';
import { fromEvent, Observable, Subscription } from 'rxjs';

export const LANDING_PAGE_TITLE = "Smaak van de redactie - Cokeryen";

@Component({
  selector: 'landing-page',
  standalone: true,
  imports: [BookTeaserComponent, BookTeasersComponent, CommonModule, RecipeTeaserComponent, ToolbarComponent, PageContainerComponent, RecipesOverviewComponent, RecipeImageUrlPipe, RecipeUrlPipe, ResponsiveColumn],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPage implements OnInit, OnChanges {
  @Input() weergave: string = 'historiseren';

  books: { [key: string]: RecipeBook } = {};
  likes: LikeLandingPage[] = []
  modernize: boolean = false;
  pageTitle = LANDING_PAGE_TITLE;
  recipes: RecipeEntry[] = [];

  constructor(
    private data: DataService,
    private linkPreview: LinkPreviewService,
  ) { }

  ngOnInit() {
    const books = this.data.getBooksAsMap().then(bs => this.books = bs);
    // const recipes = this.data.getRecipes().then(rs => this._recipes = rs);
    const recipes = this.data.getRecipesLandingPage().then(rs => this.recipes = rs);
    const promises = [books, recipes];
    Promise.all(promises).then(_ => this.ngOnChanges());

    this.data.getLikeLandingPage().then(ls => this.likes = ls).then(_ => this.ngOnChanges())
  }

  ngOnChanges() {
    this.modernize = this.weergave === 'moderniseren';
    const firstRecipe = this.recipes.length > 0 ? this.recipes[0] : undefined;
    this.linkPreview.updatePreviewTags(this.modernize, LANDING_PAGE_TITLE, firstRecipe);
  }
}