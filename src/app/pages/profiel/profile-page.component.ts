import { Component } from '@angular/core';
import { Book, DataService } from '../../services/data.service';
import { AuthService, User } from '@auth0/auth0-angular';
import { BookTeasersComponent } from "../../components/book-teasers/book-teasers.component";
import { ToolbarComponent } from "../../components/toolbar/toolbar.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'profile-page',
  standalone: true,
  imports: [CommonModule, BookTeasersComponent, ToolbarComponent],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css'
})
export class ProfilePage {
  books: { [key: string]: Book; };
  user: User | null | undefined;
  
  constructor(
    private data: DataService,
    private auth: AuthService,
  ) {
    this.books = this.data.getBooksAsMap();
    this.auth.user$.subscribe(user => this.user = user);
  }
}
