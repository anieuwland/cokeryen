import { ChangeDetectorRef, Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'book-teaser',
  standalone: true,
  imports: [],
  templateUrl: './book-teaser.component.html',
  styleUrl: './book-teaser.component.css'
})
export class BookTeaserComponent {
  @ViewChild("bookTeaser") teaser: ElementRef<HTMLElement> | undefined =  undefined;

  color: string = "ffffff";
  lightened: string = "ff0000";
  
  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    const e = this.teaser?.nativeElement;
    if (e !== undefined) {
      const color = getComputedStyle(e).backgroundColor;

      try {
        const components = color.slice(4, -1).split(",").map((c => parseInt(c.trim())));
        this.color = "#" + components.map(c => c.toString(16).padStart(2, '0')).join('');
      }
      catch {
        console.warn(`Failed to parse calculated book teaser color: ${color}`);
        this.color = "#e88230";
      }

      this.lightened = `#${lighten(this.color.slice(1), 5)}`;
      console.log(this.color, this.lightened);
    }
    this.cdr.detectChanges();
  }
}

function lighten(color: string, percent: number): string {
  const num = parseInt(color, 16),
  amt = Math.round(2.55 * percent),
  R = (num >> 16) + amt,
  B = (num >> 8 & 0x00FF) + amt,
  G = (num & 0x0000FF) + amt;

  return (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (B<255?B<1?0:B:255)*0x100 + (G<255?G<1?0:G:255)).toString(16).slice(1);
};