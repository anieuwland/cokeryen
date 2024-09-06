export interface RecipeVariant {
    id: string,
    ingredients: [string, string][],
    instructions: string,
    recipe: string,
    tags: string[],
    title: string,
    // visualized: string,
    // original: string,
    // image_url: string,
}