import { ChangeDetectorRef, Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { Book } from '../../services/data.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'book-teaser',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './book-teaser.component.html',
  styleUrl: './book-teaser.component.css'
})
export class BookTeaserComponent {
  @ViewChild("bookTeaser") teaser: ElementRef<HTMLElement> | undefined =  undefined;
  @Input() book!: Book;
  @Input() weergave: string = ""

  origColor: string = "";
  color: string = "";
  lightened: string = "";
  
  constructor(private cdr: ChangeDetectorRef) {}

  get componentBackgroundColor(): string | undefined {
    const e = this.teaser?.nativeElement;
    return e ? getComputedStyle(e).backgroundColor : undefined;
  }

  ngAfterViewInit() {
    const color = this.componentBackgroundColor;
    if (color) {
      try {
        this.color = rgbToHex(color);
        this.origColor = this.color;
      }
      catch {
        console.warn(`Failed to parse calculated book teaser color: ${color}`);
        this.color = "#e88230";
      }

      this.lightened = `#${lightenHex(this.color, 5)}`;
    }
    this.cdr.detectChanges();
  }

  @HostListener('mouseenter')
  public mouseenterListener(): void {
    const color = this.componentBackgroundColor;
    if (!color) return;
    this.color = `#${lightenRgb(color, 5)}`;
  }

  @HostListener('mouseleave')
  public mouseleaveListener(): void {
    this.color = this.origColor;
  }
}

function lightenRgb(color: string, percent: number): string  {
  color = rgbToHex(color);
  color = lightenHex(color, percent);
  return color;
}

function lightenHex(color: string, percent: number): string {
  if (color[0] === "#") color = color.slice(1);
  const num = parseInt(color, 16),
  amt = Math.round(2.55 * percent),
  R = (num >> 16) + amt,
  B = (num >> 8 & 0x00FF) + amt,
  G = (num & 0x0000FF) + amt;

  return (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (B<255?B<1?0:B:255)*0x100 + (G<255?G<1?0:G:255)).toString(16).slice(1);
};

function rgbToHex(rgb: string): string {
  // Example rgb: rgb(255, 0, 128);
  const components = rgb.slice(4, -1).split(",").map((c => parseInt(c.trim())));
  return "#" + components.map(c => c.toString(16).padStart(2, '0')).join('');
}