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
  @Input() modernizable: boolean = false;
  @Input() modernize: boolean = false;
  @Output() modernizeChange = new EventEmitter<boolean>();

  label: string = "Moderniseer";

  constructor(
    private cdr: ChangeDetectorRef
  ) { }

  get historical(): boolean {
    return this.label === "Moderniseer";
  }

  get modernized(): boolean {
    return this.label === "Historiseer";
  }

  ngOnChanges() {
    if (this.modernize) this.label = "Historiseer";
    else this.label = "Moderniseer";
  }

  public toggle() {
    this.modernize = !this.modernize;
    // this.modernizeChange.emit(this.modernize);
  }
}