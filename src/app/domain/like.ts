export interface LikeLandingPage {
    datetime: string,
    recipe: { 
        book: { reference: string }, 
        historical: { title: string }, 
        modernized: { title: string },
        number: number 
    }, 
    user: { sub: string, name: string },
};