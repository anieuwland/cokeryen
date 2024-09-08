import { Pipe, PipeTransform } from "@angular/core";
import { RecipeEntry } from "./recipe-entry";

export interface User {
    name: string,
    sub: string,
    picture: string,
}

export const isUser = (u: object | null | undefined): u is User => {
    return u !== null && u !== undefined && "name" in u && "sub" in u && "picture" in u;
}

export const toEDBString = (u: User): string => {
    return `User { sub := '${u.sub}', name := '${u.name}', picture := '${u.picture}'}`;
}
export const likedRecipe = (u: User | string, r: RecipeEntry): boolean => { 
    const sub: string = typeof u === "string" ? u : u.sub;
    return r.likes.map(l => l.user.sub).indexOf(sub) > -1
}

@Pipe({
    name: 'liked',
    standalone: true
})
export class UserLikedRecipePipe implements PipeTransform {
    transform(user: User, recipe: RecipeEntry): boolean {
        return likedRecipe(user, recipe);
    }
}