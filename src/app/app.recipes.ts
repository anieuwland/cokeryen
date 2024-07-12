export interface Recipe {
    id: number,
    title: string,
    bookRef: string,
    instructions: string,
};

export const RECIPES: Recipe[] = (<any>window).RECIPES;