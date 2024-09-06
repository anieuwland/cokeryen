import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { provideAuth0 } from '@auth0/auth0-angular';
import { HttpClientModule } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  // imports: [CommonModule, BrowserModule, ApolloModule],
  providers: [
    importProvidersFrom(HttpClientModule),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideAuth0({
      domain: 'dev-t7ibp8jqu6zifkrr.eu.auth0.com',
      clientId: 'R06UQhs0Wz62jedGNQcAsDo8egV7Jz2G',
      authorizationParams: {
        redirect_uri: window.location.origin,
      }
    }),
  ]
};
