import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

import { provideAnimations } from '@angular/platform-browser/animations';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(), // IMPORTANT 
    BsModalService,      // IMPORTANT 
    importProvidersFrom(ModalModule.forRoot())  // VERY IMPORTANT 
  ],
};
