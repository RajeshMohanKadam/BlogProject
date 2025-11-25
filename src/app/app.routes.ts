import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layout/default-layout/default-layout.component';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/landing-page/landing-page.component').then(m => m.LandingPageComponent) },
  {
    path: '', component: DefaultLayoutComponent,
    children: [
      { path: 'blogs', loadChildren: () => import('./features/blog/routes').then(m => m.routes) },
    ]
  },
  {
    path: 'blogs',
    loadChildren: () =>
      import('./features/blog/routes').then((m) => m.routes),
  },
];
