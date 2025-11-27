import { Component, inject } from '@angular/core';
import { ArticleCardComponent } from '../../../shared/components/article-card/article-card.component';
import { CommonModule } from '@angular/common';
import { BlogService } from '../services/blog.service';

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

  ngOnInit() {
    this.blogService.getBlogList().subscribe({
      next: (res: any) => {
        this.blogs = res.blogs;          // blog array
        this.totalPages = res.totalPages;
        this.limit = res.limit;
        this.page = res.page;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}
