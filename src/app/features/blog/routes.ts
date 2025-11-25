import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./blog-list/blog-list.component').then(
        (m) => m.BlogListComponent
      ),
  },
  // {
  //   path: ':id',
  //   loadComponent: () =>
  //     import('./blog-details/blog-details.component').then(
  //       (m) => m.BlogDetailsComponent
  //     ),
  // },
];
