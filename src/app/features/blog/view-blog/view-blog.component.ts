import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../services/blog.service';
import { DatePipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-view-blog',
  imports: [DatePipe, NgIf],
  templateUrl: './view-blog.component.html',
  styleUrl: './view-blog.component.css'
})
export class ViewBlogComponent {

  route = inject(ActivatedRoute)
  router = inject(Router)
  blogService = inject(BlogService)

  blog: any
  comments: any[] = []
  blogId = this.route.snapshot.params['id']

  ngOnInit() {
    this.blogService.getBlogById(this.blogId).subscribe({
      next: (res: any) => {
        console.log(res);
        this.blog = res?.data
        this.comments = res?.data?.comments
        this.blog.authorAvatarUrl = this.blog.authorAvatarUrl ? this.blog.authorAvatarUrl : 'https://i.pinimg.com/736x/8a/14/fe/8a14fefc276ab576e8ceac207cace638.jpg'
      },
      error(err) {
        console.log(err);
      },
    })
  }

  goToEdit(id: number) {
    this.router.navigateByUrl(`blogs/edit/${id}`)
  }
}
