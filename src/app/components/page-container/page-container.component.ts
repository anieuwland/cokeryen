import { Component, EventEmitter, Input, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { RecipeBook } from '../../domain/recipe-book';
import { BookTeasersComponent } from "../book-teasers/book-teasers.component";
import { ToolbarComponent } from "../toolbar/toolbar.component";

@Component({
  selector: 'page-container',
  standalone: true,
  imports: [BookTeasersComponent, ToolbarComponent],
  templateUrl: './page-container.component.html',
  styleUrl: './page-container.component.css'
})
export class PageContainerComponent {
  @Input() books: { [key: string]: RecipeBook; } = {};
  @Input() weergave: string = "historiseren";
  @Input() modernizable = true;
  @Input() pageTitle = "";

  modernize: boolean = false;
  @Output() modernizeChange = new EventEmitter<boolean>();

  ngOnChanges() {
    this.modernize = this.weergave === "moderniseren";
    this.modernizeChange.emit(this.modernize);
  }
}
