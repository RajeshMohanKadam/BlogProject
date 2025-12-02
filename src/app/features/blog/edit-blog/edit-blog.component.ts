import { Component, inject, effect, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../services/blog.service';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'app-edit-blog',
  imports: [FormsModule, NgIf, QuillModule],
  templateUrl: './edit-blog.component.html',
  styleUrl: './edit-blog.component.css'
})
export class EditBlogComponent {

  route = inject(ActivatedRoute);
  blogService = inject(BlogService);
  http = inject(HttpClient);
  router = inject(Router);

  blogId = this.route.snapshot.params['id'];

  title = '';
  categoryId = '';
  editorContent = signal(''); // SIGNAL tracking editor content
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;

  private lastHtml = '';

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
        [{ color: [] }, { background: [] }],
        [{ font: [] }],
        [{ align: [] }],
        ['clean'],
        ['image']
      ],
      handlers: {
        image: () => this.handleImageUpload()
      }
    }
  };

  quill!: any;

  constructor() {
    // EFFECT: Runs whenever editorContent changes
    effect(() => {
      const currentHtml = this.editorContent();
      if (this.lastHtml) {
        this.detectDeletedImages(currentHtml);
      }
      this.lastHtml = currentHtml;
    });
  }

  ngOnInit() {
    this.blogService.getBlogById(this.blogId).subscribe({
      next: (res: any) => {
        const blog = res?.data;
        if (!blog) return;


        this.title = blog.title;
        this.categoryId = blog.categoryId;
        this.editorContent.set(blog.content);
        this.previewUrl = blog.featuredImageUrl;

        this.lastHtml = blog.content;

        console.log(this.lastHtml);

      },
      error(err) {
        console.log(err);
      }
    });


  }

  onEditorCreated(quill: any) {
    this.quill = quill;
  }

  detectDeletedImages(currentHtml: string) {

    const prevImgs = this.extractImgUrls(this.lastHtml);
    const currImgs = this.extractImgUrls(currentHtml);

    const deleted = prevImgs.filter(src => !currImgs.includes(src));
    if (deleted.length === 0) return;
    deleted.forEach(url => {
      const publicId = this.extractImagePublicId(url);
      if (publicId) {
        this.blogService.deleteInlineImage(publicId).subscribe({
          next: (res) => {
            console.log('Deleted inline image:', res)
          },
          error: (err) => {
            console.log('Error deleting inline image:', err)
          }
        });
      }
    });


  }

  extractImgUrls(html: string) {
    const div = document.createElement('div');
    div.innerHTML = html;
    return Array.from(div.querySelectorAll('img')).map(img => img.src);
  }

  extractImagePublicId(url: string) {
    const versionIndex = url.indexOf('/v');
    if (versionIndex === -1) return null;
    const afterVersion = url.substring(versionIndex);
    const parts = afterVersion.split('/');
    parts.shift();
    parts.shift();
    const filename = parts.pop()!;
    const nameWithoutExt = filename.split('.')[0];
    return [...parts, nameWithoutExt].join('/');
  }

  handleImageUpload() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.click();


    input.onchange = async () => {
      const file = input.files![0];
      const form = new FormData();
      form.append('image', file);

      const res: any = await this.http.post('http://localhost:3000/api/blogs/upload-image', form).toPromise();
      const imgUrl = res.imageUrl;

      const range = this.quill.getSelection(true);
      this.quill.clipboard.dangerouslyPasteHTML(range.index, `<img src="${imgUrl}" class="mx-auto"/>`);

      // Update signal manually after image insert
      this.editorContent.set(this.quill.root.innerHTML);
    };


  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    this.selectedFile = file;


    const reader = new FileReader();
    reader.onload = () => this.previewUrl = reader.result;
    reader.readAsDataURL(file);
  }

  removeFeaturedImage() {
    this.previewUrl = null;
    this.selectedFile = null;
  }

  updateBlog(status: string) {
    debugger
    const formData = new FormData();
    formData.append('title', this.title);
    formData.append('categoryId', this.categoryId);
    formData.append('status', status);
    formData.append('content', this.cleanHtml(this.editorContent()));

    if (this.selectedFile) {
      formData.append('featuredImage', this.selectedFile);
    }

    this.blogService.updateBlog(this.blogId, formData).subscribe({
      next: (res) => {
        console.log(res);
        this.router.navigateByUrl('blogs/view/' + this.blogId);
      },
      error: (err) => console.log(err)
    });


  }

  cleanHtml(html: string): string {
    return html
      .replace(/(&nbsp;)+/g, ' ')
      .replace(/<p><br><\/p>/g, '') // remove empty line blocks
      .replace(/\s+/g, ' ')
      .trim();
  }

}
