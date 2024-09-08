import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NormalizeRecipeTextPipe } from "../../pipes/normalize-recipe-text.pipe";
import { ToSentenceCasePipe } from "../../pipes/to-sentence-case.pipe";
import { RecipeBook } from '../../domain/recipe-book';
import { RecipeEntry, RecipeImageUrlPipe, recipeLekkerCountPipe } from '../../domain/recipe-entry';
import { AuthService } from '@auth0/auth0-angular';
import { DataService } from '../../services/data.service';
import { isUser, likedRecipe, User, UserLikedRecipePipe } from '../../domain/user';

@Component({
  selector: 'recipe-complete',
  standalone: true,
  imports: [CommonModule, RouterModule, NormalizeRecipeTextPipe, ToSentenceCasePipe, RecipeImageUrlPipe, recipeLekkerCountPipe, UserLikedRecipePipe],
  templateUrl: './recipe-complete.component.html',
  styleUrl: './recipe-complete.component.css'
})
export class RecipeCompleteComponent implements OnChanges {
  @Input() recipe!: RecipeEntry;
  @Input() book!: RecipeBook;
  @Input() modernize: boolean = false;

  user: User | null | undefined = undefined;

  constructor(
    private auth: AuthService,
    private data: DataService,
  ) { }

  ngOnChanges() { 
    this.auth.user$.subscribe(u => this.user = isUser(u) ? u : undefined);
  }

  getNameSymbol(): string {
    const words = this.book.person.split(' ').map(word => word.trim())
    const initials: string[] = words.filter((_, idx) => idx === 0 || idx === words.length - 1).map(w => w[0]);
    return initials.join("").toUpperCase();
  }

  async submitLike() {
    const user = this.user;
    const recipe = this.recipe;
    if (!isUser(user)) {
      console.warn("Attempted to submit a like while not logged in.")
      return;
    }

    if (likedRecipe(user, recipe)) {
      console.warn(`Attempted to like recipe ${recipe.id} while already liked by user ${user.sub} (aborting).`)
      return;
    }

    const _ = await this.data.insertLike(this.recipe.id, user);
    recipe.likes.push({user});
    this.recipe = { ...recipe };
  }

  async submitUnlike() {
    const user = this.user;
    const recipe = this.recipe;
    if (!isUser(user)) {
      console.warn("Attempted to submit a like while not logged in.")
      return;
    }

    if (!likedRecipe(user, recipe)) {
      console.warn(`Attempted to unlike recipe ${recipe.id} while not liked by user ${user.sub} (aborting).`)
      return;
    }

    const _ = await this.data.deleteLike(this.recipe.id, user);
    const i = recipe.likes.findIndex((l) => l.user.sub === user.sub);
    recipe.likes.splice(i, 1);
    this.recipe = { ...recipe };
  }
}
