import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';

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
  authenticated: boolean | undefined = undefined;

  constructor(
    @Inject(DOCUMENT) public document: Document,
    private auth: AuthService
  ) {
    this.auth.isAuthenticated$.subscribe(bool => this.authenticated = bool);
    // this.auth.user$.subscribe(u => this.authenticated = (u !== null && u !== undefined));
  }

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
  }

  public login() {
    this.auth.loginWithRedirect();
  }

  public logout() {
    const options = {logoutParams: {returnTo: this.document.location.origin}};
    this.auth.logout(options);
  }
}