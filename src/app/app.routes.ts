import { ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { LANDING_PAGE_TITLE, LandingPage } from './pages/landing/landing-page.component';
import { RecipePage } from './pages/recipe/recipe-page.component';
import { RecipesPage } from './pages/recipes/recipes-page.component';
import { ProfilePage } from './pages/profiel/profile-page.component';
import { ResolveFn } from "@angular/router";
import { DataService } from './services/data.service';
import { inject } from '@angular/core';

const RecipeHistoricalTitleResolver: ResolveFn<string> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    data: DataService = inject(DataService),
): Promise<string> => {
    const bookRef = route.paramMap.get("bookRef");
    const recipeNumber = route.paramMap.get("recipeNumber");
    return bookRef !== null && recipeNumber !== null ? 
          data.getRecipeHistoricalTitle(bookRef, recipeNumber) 
        : Promise.resolve("");
}

export const routes: Routes = [
    { "path": "", component: LandingPage, title: LANDING_PAGE_TITLE },
    { "path": "profiel", component: ProfilePage },
    { "path": "recepten", component: RecipesPage, },
    { "path": "recepten/:bookRef", component: RecipesPage },
    { "path": "recepten/:bookRef/:recipeNumber", component: RecipePage, title: RecipeHistoricalTitleResolver },
];
