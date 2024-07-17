import { Injectable } from '@angular/core';
import { RECIPES } from '../app.recipes';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  public getBooks(): Book[] {
    return [
      {year: 1499, title: "Een Gents Handschrift", person: "Drie handen", transcriber: "", ref: "GENT1499", modernized: false},
      {year: 1514, title: "Een notabel boeckxen van cokeryen", person: "Vander Noot", transcriber: "Willebrands", ref: "Noot1514", modernized: true},
      {year: 1593, title: "Eenen seer schoonen ende excellenten Cocboeck", person: "Baten", transcriber: null, ref: "Baten1593", modernized: false},
      {year: 1612, title: "Koocboek oft familieren keukenboec", person: "Magirus", transcriber: null, ref: "MAGIRUS1612", modernized: false},
      {year: 1669, title: "De verstandige kock", person: "N", transcriber: "Willebrands", ref: "N1669", modernized: true},
      {year: 1752, title: "Aaltje, de volmaakte Hollandsche keuken-meid", person: "Esveldt", transcriber: "Willebrands", ref: "ESVELDT1752", modernized: false},
    ]
  }

  public getBooksAsMap(): {[key: string]: Book} {
    let map: {[key: string]: Book} = {};
    this.getBooks().forEach(b => map[b.ref] = b);
    return map;
  }

  public getRecipes(): Recipe[] {
    return RECIPES;
  }
}

export interface Book {
  title: string,
  year: number,
  person: string,
  transcriber: string | null,
  ref: string,
  modernized: boolean,
}

export interface Recipe {
  id: number,
  title: string,
  bookRef: string,
  instructions: string,
  modernized: Modernization | undefined,
};

export interface Modernization {
  title: string,
  recipe: string,
  visualized: string,
  ingredients: [string, string][],
  tags: string[],
  original: string,
  image_url: string,
}