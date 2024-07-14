import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'toolbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css'
})
export class ToolbarComponent {
  label: string = "Historisch";
  @Output() modernize = new EventEmitter<boolean>();

  constructor(
    private cdr: ChangeDetectorRef
  ) { }

  get historical(): boolean {
    return this.label === "Historisch";
  }

  get modernized(): boolean {
    return this.label === "Gemoderniseerd";
  }

  public toggle() {
    const map: {[key: string]: string} = {
      "Historisch": "Gemoderniseerd",
      "Gemoderniseerd": "Historisch",
    }

    this.label = map[this.label];
    this.cdr.detectChanges();
    this.modernize.emit(this.modernized);
  }
}