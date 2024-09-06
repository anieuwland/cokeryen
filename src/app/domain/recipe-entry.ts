import { RecipeVariant } from "./recipe-variant";

export interface RecipeEntry {
    book: { reference: string },
    historical: RecipeVariant,
    id: string,
    instructions: string,
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