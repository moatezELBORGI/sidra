import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import {provideAnimations} from "@angular/platform-browser/animations";
import {provideHttpClient, withFetch} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withFetch()),
    CookieService

  ]
}).catch(err => console.error(err));
