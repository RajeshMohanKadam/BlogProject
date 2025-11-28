import { Component, inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../services/blog.service';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import Quill from 'quill';
import { QuillModule } from 'ngx-quill'

@Component({
  selector: 'app-edit-blog',
  imports: [FormsModule, NgIf, QuillModule],
  templateUrl: './edit-blog.component.html',
  styleUrl: './edit-blog.component.css'
})
export class EditBlogComponent {

  route = inject(ActivatedRoute)
  blogService = inject(BlogService)
  http = inject(HttpClient)
  router = inject(Router)
  blog: any
  title: any
  categoryId: any
  editorContent: any
  selectedFile: any
  previewUrl: any

  @ViewChild('editorRef') editorRef: any;
  quill!: Quill;

  modules = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],

        [{ header: 1 }, { header: 2 }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ script: 'sub' }, { script: 'super' }],
        [{ indent: '-1' }, { indent: '+1' }],
        [{ direction: 'rtl' }],

        [{ size: ['small', false, 'large', 'huge'] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],

        [{ color: [] }, { background: [] }],
        [{ font: [] }],
        [{ align: [] }],

        ['clean'],

        ['image'] // <-- image button
      ],

      handlers: {
        image: () => this.handleImageUpload()  // <-- your function is registered here
      }
    }
  };

  blogId = this.route.snapshot.params['id']

  ngOnInit() {
    this.blogService.getBlogById(this.blogId).subscribe({
      next: (res: any) => {
        console.log(res);
        this.blog = res?.data
        this.editorContent = this.blog.content
        this.title = this.blog.title
        this.categoryId = this.blog.categoryId
        this.previewUrl = this.blog.featuredImageUrl
      },
      error(err) {
        console.log(err);
      },
    })
  }

  // Image Upload Logic
  handleImageUpload() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.click();

    input.onchange = async () => {
      const file = input.files![0];
      const form = new FormData();
      form.append('image', file);

      // API upload → Cloudinary
      const res: any = await this.http.post('http://localhost:3000/api/blogs/upload-image', form).toPromise();

      console.log('Response - ', res);

      const imgUrl = res.imageUrl;
      console.log(imgUrl);

      const publicId = res.publicId;

      const range = this.quill.getSelection(true);

      this.quill.clipboard.dangerouslyPasteHTML(
        range.index,
        `<img src="${imgUrl}" data-public-id="${publicId}" class="mx-auto"/>`
      );
    };
  }

  onFileSelected(event: any) {
    event.preventDefault();
    const file = event.target.files[0];
    if (!file) return;

    this.selectedFile = file;
    const reader = new FileReader();

    reader.onload = () => {
      this.previewUrl = reader.result;
    }

    reader.readAsDataURL(file);
  }

  removeFeaturedImage() {

  }

  updateBlog(status: string) {
    const formData = new FormData();
    formData.append('title', this.title);
    formData.append('categoryId', this.categoryId);
    formData.append('status', status);
    const cleanedContent = this.cleanHtml(this.editorContent)

    formData.append('content', cleanedContent);

    // Adding featured image ONLY if user selected one
    if (this.selectedFile) {
      formData.append('featuredImage', this.selectedFile);
    }

    this.blogService.updateBlog(this.blogId, formData).subscribe({
      next: (res) => {
        console.log(res);
        // this.router.navigateByUrl('blogs');
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  cleanHtml(html: string): string {
    return html
      .replace(/&nbsp;/g, ' ')
      .replace(/\u00A0/g, ' ')
      .replace(/\s+/g, ' ')        // collapse multiple spaces
      .trim();
  }

}
