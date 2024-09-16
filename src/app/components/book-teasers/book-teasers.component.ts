import { Component, Input } from '@angular/core';
import { BookTeaserComponent } from '../book-teaser/book-teaser.component';
import { CommonModule } from '@angular/common';
import { RecipeBook } from '../../domain/recipe-book';
import { SpinnerComponent } from "../spinner/spinner.component";

@Component({
  selector: 'book-teasers',
  standalone: true,
  imports: [BookTeaserComponent, CommonModule, SpinnerComponent],
  templateUrl: './book-teasers.component.html',
  styleUrl: './book-teasers.component.css'
})
export class BookTeasersComponent {
  @Input() books: { [key: string]: RecipeBook; } = {};
  @Input() weergave: string = "";

  booksByYear: RecipeBook[] = [];

  ngOnChanges() {
    this.booksByYear = Object.values(this.books).sort((a, b) => a.year - b.year);
  }
}
