import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./blog-list/blog-list.component').then(
        (m) => m.BlogListComponent
      ),
  },
  {
    path: 'new-story',
    loadComponent: () =>
      import('./add-blog/add-blog.component').then(
        (m) => m.AddBlogComponent
      ),
  },
  {
    path: 'view/:id',
    loadComponent: () => import('./view-blog/view-blog.component').then(
      (m) => m.ViewBlogComponent
    )
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./edit-blog/edit-blog.component').then(
      (m) => m.EditBlogComponent
    )
  }
];
