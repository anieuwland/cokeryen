import { Routes } from '@angular/router';
import { LandingPage } from './pages/landing/landing-page.component';
import { RecipePage } from './pages/recipe/recipe-page.component';
import { RecipesPage } from './pages/recipes/recipes-page.component';
import { ProfilePage } from './pages/profiel/profile-page.component';

export const routes: Routes = [
    { "path": "", component: LandingPage },
    { "path": "profiel", component: ProfilePage},
    { "path": "recepten", component: RecipesPage},
    { "path": "recepten/:bookRef", component: RecipesPage},
    { "path": "recepten/:bookRef/:recipeId", component: RecipePage },
];
