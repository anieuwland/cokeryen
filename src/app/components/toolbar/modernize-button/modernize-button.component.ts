import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'modernize-button',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './modernize-button.component.html',
  styleUrl: './modernize-button.component.css'
})
export class ModernizeButton {
  @Input() modernizable: boolean = false;
  @Input() modernize: boolean = false;
  @Output() modernizeChange = new EventEmitter<boolean>();

  label: string = "Moderniseren";

  get historical(): boolean {
    return this.label === "Moderniseren";
  }

  get modernized(): boolean {
    return this.label === "Historiseren";
  }

  ngOnChanges() {
    if (this.modernize) this.label = "Historiseren";
    else this.label = "Moderniseren";
  }
}
