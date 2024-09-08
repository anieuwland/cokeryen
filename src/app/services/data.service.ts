import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RecipeBook } from '../domain/recipe-book';
import { RecipeEntry } from '../domain/recipe-entry';
import { ENV } from '../app.env';

const SUPPORT_BOOKS = ['GENT1499', 'NOOT1514', 'BATEN1593', 'N1669'];

@Injectable({
  providedIn: 'root'
})
export class DataService {
  api: ApiClient;

  constructor(
    private readonly http: HttpClient,
  ) {
    this.api = new ApiClient(this.http);
  }

  public async getBooks(): Promise<RecipeBook[]> {
    const query = "select RecipeBook {*} filter .reference in {'GENT1499', 'NOOT1514', 'BATEN1593', 'N1669'} order by .year;";
    return this.api.query<RecipeBook>(query);
  }

  public async getBooksAsMap(): Promise<{ [key: string]: RecipeBook }> {
    const map: { [key: string]: RecipeBook } = {};
    (await this.getBooks() ?? []).forEach(b => map[b.reference] = b);
    return map;
  }

  public async getRecipe(bookRef: string, number: string): Promise<RecipeEntry | undefined> {
    const query = `select RecipeEntry {id, book: {reference}, number, tags, historical: {*}, modernized: {*}} filter .book.reference = '${bookRef}' and .number = ${number}`;
    const result = this.api.query<RecipeEntry>(query);
    return result.then(rs => rs.length !== 1 ? undefined : rs[0]);
  }

  public async getRecipeHistoricalTitle(bookRef: string, number: string): Promise<string> {
    interface TitleObject { historical: { title: string } };
    const query = `select RecipeEntry {historical: {title}} filter .book.reference = '${bookRef}' and .number = ${number}`;
    const result = this.api.query<TitleObject>(query);
    return result.then(rs => rs.length !== 1 ? "" : rs[0].historical.title);
  }

  public async getRecipesFrom(bookRef: string): Promise<RecipeEntry[]> {
    const query = `select RecipeEntry {id, book: {reference}, number, tags, historical: {*}, modernized: {*}} filter .book.reference = '${bookRef}';`
    return this.api.query<RecipeEntry>(query);
  }

  public async getRecipesLandingPage(): Promise<[RecipeEntry, RecipeBook][]> {
    const query = "select RecipeEntry {*, book: {*}, historical: {*}, modernized: {*}} filter .number in {1, 172, 88, 28, 484, 483, 130, 474, 167};";
    const result = this.api.query<RecipeEntry>(query);
    // @ts-ignore
    return result.then(rs => rs.map(r => [r, r.book]));
  }

  public async getRecipes(): Promise<RecipeEntry[]> {
    const books = await this.getBooks() ?? [];
    const bookRefs = books.map(b => b.reference);

    const recipes = await this.getRecipesAll();
    const available = recipes.filter(r => bookRefs.indexOf(r.book.reference) > -1);

    console.debug(`Filtered ${recipes.length} recipes down to ${available.length} with ${bookRefs.length} books (${bookRefs.join(", ")})`)
    return available;
  }

  public async getRecipesAll(): Promise<RecipeEntry[]> {
    // const query = "select RecipeEntry {id, book: {reference} number, tags, variants: {*}} filter .reference in {'GENT1499', 'NOOT1514', 'BATEN1593', 'N1669'} order by .number;"
    const query = "select RecipeEntry {id, book: {reference}, number, tags, historical: {*}, modernized: {*}} " +
      `filter .book.reference in {${SUPPORT_BOOKS.map(s => `'${s}'`).join(", ")}} ` +
      "order by .number";
    return this.api.query<RecipeEntry>(query);
  }
}

interface ApiResult<T> {
  data: T[]
}

class ApiClient {
  private cache = new Map<string, any>();

  constructor(
    private http: HttpClient
  ) { }

  public async query<T>(query: string): Promise<T[]> {
    const cached: T | undefined = this.cache.get(query);
    if (Array.isArray(cached)) {
      return Promise.resolve(cached)
    }

    const cors = { "content-type": "application/json" };
    const authorization = ENV.COKERYEN_DB_AUTH;
    const headers = { authorization, ...cors };
    const payload = { query }
    return this.http.post<ApiResult<T>>(ENV.COKERYEN_DB_URL, payload, { headers, responseType: "json" })
      .toPromise()
      .then(r => r?.data)
      .then(data => { if (data) this.cache.set(query, data); return data })
      .then(data => data === undefined ? [] : data);
  }
}
