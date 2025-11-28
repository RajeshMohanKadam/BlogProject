import { Component, inject } from '@angular/core';
import { ArticleCardComponent } from '../../../shared/components/article-card/article-card.component';
import { CommonModule } from '@angular/common';
import { BlogService } from '../services/blog.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-blog-list',
  imports: [ArticleCardComponent, CommonModule],
  templateUrl: './blog-list.component.html',
  styleUrl: './blog-list.component.css'
})
export class BlogListComponent {

  blogService = inject(BlogService)
  blogs: any[] = [];
  page = 1;
  limit = 10;
  totalPages = 0;

  router = inject(Router)

  ngOnInit() {
    this.blogService.getBlogList().subscribe({
      next: (res: any) => {
        this.blogs = res.blogs;          // blog array
        this.totalPages = res.totalPages;
        this.limit = res.limit;
        this.page = res.page;
        console.log(this.blogs[0].content);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  getBlog(id: any) {
    this.router.navigateByUrl(`blogs/view/${id}`)
  }
}
