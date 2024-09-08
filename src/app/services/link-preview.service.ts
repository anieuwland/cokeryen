import { Injectable } from '@angular/core';
import { ENV } from '../app.env';
import { Meta, MetaDefinition, Title } from '@angular/platform-browser';
import { imageUrl, RecipeEntry } from '../domain/recipe-entry';

@Injectable({
  providedIn: 'root'
})
export class LinkPreviewService {
    constructor(private meta: Meta, private title: Title) {}

    public updatePreviewTags(modernize: boolean, title: string, recipe: RecipeEntry | undefined) {
        const tags = phraseTags(modernize, title, recipe);
        tags.forEach(tag => this.meta.updateTag(tag, `name='${tag.name}'`))
        this.title.setTitle(title);
    }
}

const phraseTags = (modernize: boolean, title: string, recipe: RecipeEntry | undefined): MetaDefinition[] => {
    // https://stackoverflow.com/questions/19778620/provide-an-image-for-whatsapp-link-sharing
    // https://stackoverflow.com/questions/56662831/how-to-display-image-thumbnail-while-sharing-links-of-my-angular-website
  
    const description = ""; // description and og:description (max 65 characters)
    const image = recipe ? imageUrl(recipe) : ""; // og:image
    const url = window.location.href; // og:url
  
    return [
      // {
      //   name: "description",
      //   content: description,
      // },
      // {
      //   name: "og:description",
      //   content: description,
      // },
      {
        name: "og:image",
        content: image,
      },
      {
        name: "title",
        content: title,
      },
      {
        name: "og:title",
        content: title,
      },
      {
        name: "og:url",
        content: url,
      },
    ]
  }
  
  const spliceUrlProtocol = (url: string): [string, string] => {
    const parts = url.split(":");
    const protocol = parts[0];
    const rest = parts.filter((_, i) => i != 0).join('')
    return [protocol, rest];
  }