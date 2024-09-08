import { Component, Input, OnChanges } from '@angular/core';
import { DataService } from '../../services/data.service';
import { AuthService, User } from '@auth0/auth0-angular';
import { BookTeasersComponent } from "../../components/book-teasers/book-teasers.component";
import { ToolbarComponent } from "../../components/toolbar/toolbar.component";
import { CommonModule } from '@angular/common';
import { RecipeBook } from '../../domain/recipe-book';
import { RecipeEntry } from '../../domain/recipe-entry';
import { isUser } from '../../domain/user';
import { RecipeTeaserComponent } from "../../components/recipe-teaser/recipe-teaser.component";
import { PageContainerComponent } from "../../components/page-container/page-container.component";
import { RecipesOverviewComponent } from "../../components/recipes-overview/recipes-overview.component";

@Component({
  selector: 'profile-page',
  standalone: true,
  imports: [CommonModule, BookTeasersComponent, ToolbarComponent, RecipeTeaserComponent, PageContainerComponent, RecipesOverviewComponent],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css'
})
export class ProfilePage implements OnChanges {
  @Input() weergave: string = "historiseren";

  books: { [key: string]: RecipeBook; } = {};
  modernize: boolean = false;
  recipes: RecipeEntry[] = [];
  user: User | null | undefined;
  
  constructor(
    private data: DataService,
    private auth: AuthService,
  ) {
    this.data.getBooksAsMap().then(books => this.books = books);
    this.auth.user$.subscribe(user => { this.user = user; this.ngOnChanges() });
  }

  public ngOnChanges() {
    this.modernize = this.weergave === 'moderniseren';

    if (!isUser(this.user)) return;
    this.data.getRecipesLikedBy(this.user).then(rs => this.recipes = rs);
  }
}
