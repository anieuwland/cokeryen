import { Routes } from '@angular/router';
import { LandingPage } from './pages/landing-page/landing-page.component';
import { RecipePage } from './pages/recipe-page/recipe-page.component';

export const routes: Routes = [
    { "path": "", component: LandingPage },
    { "path": "recepten/:bookRef", component: LandingPage},
    { "path": "recepten/:bookRef/:recipeId", component: RecipePage },
];
