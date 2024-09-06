import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RecipeBook } from '../domain/recipe-book';
import { RecipeEntry } from '../domain/recipe-entry';

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

  public async getRecipesFrom(bookRef: string): Promise<RecipeEntry[]> {
    const query = `select RecipeEntry {id, book: {reference}, number, tags, historical: {*}, modernized: {*}} filter .book.reference = '${bookRef}';`
    return this.api.query<RecipeEntry>(query);
  }

  public async getRecipesLandingPage(): Promise<[RecipeEntry, RecipeBook][]> {
    const query = "select RecipeEntry {*, book: {*}, historical: {*}, modernized: {*}} filter .number in {1, 172, 88, 28, 484, 483, 130, 474, 167};";
    const result = this.api.query<RecipeEntry>(query);
    // @ts-ignore
    return result.then(rs => rs.map(r =>[r, r.book]));
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
  private URL = "https://cokeryen--anieuwland.c-21.i.aws.edgedb.cloud:5656/branch/dev/edgeql";
  private AUTH_STR = "Bearer nbwt1_eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJlZGIuZC5hbGwiOnRydWUsImVkYi5pIjpbImFuaWV1d2xhbmQvY29rZXJ5ZW4iXSwiZWRiLnIuYWxsIjp0cnVlLCJpYXQiOjE3MjUyMTQwMzMsImlzcyI6ImF3cy5lZGdlZGIuY2xvdWQiLCJqdGkiOiJCQXg3aUdpTkVlLXhtZDlXRVVreUlnIiwic3ViIjoiSVJnZHBFMElFZS1EUWFldDZEUnphZyJ9.ih7FZ37c-KUuuBZrDHzWtl3veB34rWp-5GPR0YhwvuZ3DBmESYWaGjGj95oH7lOsdW9RDbR5TZS0AcQR0ZjaKg";
  // private URL = "http://localhost:10702/branch/dev/edgeql";
  // private AUTH_STR = "Basic ZWRnZWRiOmJ1YUpkYmFySnBpSEVsZTN6c0tlNmlZOA=="

  private cache = new Map<string, any>();

  constructor(
    private http: HttpClient
  ) { }

  public async query<T>(query: string): Promise<T[]> {
    const cached: T | undefined = this.cache.get(query);
    if (Array.isArray(cached)) {
      return Promise.resolve(cached)
    }

    const cors = {
      "content-type": "application/json",
    };
    const authorization = this.AUTH_STR;
    const headers = { authorization, ...cors };
    // const headers = {...cors };
    // const httpOptions = { headers };
    const payload = { query }
    return this.http.post<ApiResult<T>>(this.URL, payload, {headers, responseType: "json"})
    // return this.http.post<ApiResult<T>>(this.URL, payload, {headers, responseType: "text" })
      .toPromise()
      .then(r => r?.data)
      .then(data => {if (data) this.cache.set(query, data); return data})
      .then(data => data === undefined ? [] : data);
  }
}
