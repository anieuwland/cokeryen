import { RecipeEntry } from "./recipe-entry";
import { User } from "./user";

export interface RecipeComment {
    comment: string,
    datetime: string,
    recipe: RecipeEntry
    user: User,
}