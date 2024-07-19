import { Component, Input } from '@angular/core';
import { BookTeaserComponent } from '../book-teaser/book-teaser.component';
import { Book } from '../../services/data.service';

@Component({
  selector: 'book-teasers',
  standalone: true,
  imports: [BookTeaserComponent],
  templateUrl: './book-teasers.component.html',
  styleUrl: './book-teasers.component.css'
})
export class BookTeasersComponent {
  @Input() books!: { [key: string]: Book; };
}
