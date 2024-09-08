import { Pipe, PipeTransform } from '@angular/core';
import { RecipeVariant } from "./recipe-variant";

export interface RecipeEntry {
    book: { reference: string, title: string },
    historical: RecipeVariant,
    id: string,
    instructions: string,
    likes: { user: { sub: string }}[],
    modernized?: RecipeVariant,
    number: number
    tags: string[],
    // variants: {
    //   id: string,
    //   ingredients: string[],
    //   instructions: string,
    //   title: string,
    //   variant: string,
    // }[]
};

export const modernized = (r: {modernized?: RecipeVariant}) => r.modernized !== undefined;
export const imageUrl = (r: RecipeEntry, baseHref: string | undefined = undefined): string => {
    if (baseHref === undefined) baseHref = window.location.origin;
    return `${baseHref}/assets/gerechten/${r.book.reference}/${r.book.reference}-${r.number}.jpg`;
};
export const numLikes = (r: RecipeEntry): number => {
    return r.likes.length;
}

@Pipe({
    name: 'recipeImageUrl',
    standalone: true
})
export class RecipeImageUrlPipe implements PipeTransform {
    transform(recipe: RecipeEntry, baseHref: string | undefined = undefined) {
        return imageUrl(recipe, baseHref);
    }
}

@Pipe({
    name: 'recipeNumLikes',
    standalone: true
})
export class recipeLekkerCountPipe implements PipeTransform {
    transform(recipe: RecipeEntry): number {
        return numLikes(recipe);
    }
}