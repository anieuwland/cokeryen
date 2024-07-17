import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'toolbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css'
})
export class ToolbarComponent {
  label: string = "Moderniseer";

  @Input() modernizableBook: boolean = false;
  @Output() modernize = new EventEmitter<boolean>();

  constructor(
    private cdr: ChangeDetectorRef
  ) { }

  get historical(): boolean {
    return this.label === "Moderniseer";
  }

  get modernized(): boolean {
    return this.label === "Historiseer";
  }

  public toggle() {
    const map: {[key: string]: string} = {
      "Historiseer": "Moderniseer",
      "Moderniseer": "Historiseer",
    }

    this.label = map[this.label];
    this.cdr.detectChanges();
    this.modernize.emit(this.modernized);
  }
}