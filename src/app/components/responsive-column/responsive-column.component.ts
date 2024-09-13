import { Component, Input } from '@angular/core';

@Component({
  selector: 'responsive-column, [responsive-column]',
  standalone: true,
  imports: [],
  templateUrl: './responsive-column.component.html',
  styleUrl: './responsive-column.component.css'
})
export class ResponsiveColumn {
  @Input() flexDirectionWide: FlexDirection = 'row';
  @Input() flexDirectionNarrow: FlexDirection = 'column';
}


export type FlexDirection = 'row'|'row-reverse'|'column'|'column-reverse';