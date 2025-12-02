import { Component, effect, inject, signal, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import Quill from 'quill';
import { QuillModule } from 'ngx-quill'
import { AuthService } from '../../auth/auth/services/auth.service';
import { NgIf } from '@angular/common';
import { BlogService } from '../services/blog.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-blog',
  imports: [FormsModule, QuillModule, NgIf],
  templateUrl: './add-blog.component.html',
  styleUrl: './add-blog.component.css'
})
export class AddBlogComponent {
  title = '';
  categoryId = '';
  editorContent = signal(''); // SIGNAL tracking editor content
  authService = inject(AuthService)
  blogService = inject(BlogService)
  router = inject(Router)

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

  private lastHtml = '';

  constructor(private http: HttpClient) {

    effect(() => {
      debugger
      const currentHtml = this.editorContent();
      if (this.lastHtml) {
        this.detectDeletedImages(currentHtml);
      }
      this.lastHtml = currentHtml;
    });
  }

  ngAfterViewInit() {
    this.quill = this.editorRef.quillEditor;

  }

  // Image Upload Logic
  handleImageUpload() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.click();

    input.onchange = async () => {
      debugger
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
        `<img src="${imgUrl}" class="mx-auto"/>`
      );

      // Update signal manually after image insert
      this.editorContent.set(this.quill.root.innerHTML);
      this.lastHtml = this.editorContent();
    };
  }


  detectDeletedImages(currentHtml: string) {

    const prevImgs = this.extractImgUrls(this.lastHtml);
    const currImgs = this.extractImgUrls(currentHtml);

    const deleted = prevImgs.filter(src => !currImgs.includes(src));
    deleted.forEach(url => {
      const publicId = this.extractImagePublicId(url);
      if (publicId) {
        this.blogService.deleteInlineImage(publicId).subscribe({
          next: (res) => {
            debugger
            console.log('Deleted inline image:', res)
          },
          error: (err) => {
            debugger
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

  // Submit blog
  submitBlog(status: string) {
    // const imageIds = this.extractImagePublicIds(contentHtml);

    const formData = new FormData()

    formData.append('title', this.title)
    formData.append('categoryId', this.categoryId)
    formData.append('status', status)
    formData.append('content', this.cleanHtml(this.editorContent()))

    // Add featured image ONLY if user selected one
    if (this.selectedFile) {
      formData.append('featuredImage', this.selectedFile);
    }

    this.blogService.createBlog(formData).subscribe({
      next: (res) => {
        console.log(res);
        this.router.navigateByUrl('blogs');
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  previewUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  onFileSelected(event: any) {
    const file = event.target.files[0]
    if (!file) return

    this.selectedFile = file
    const reader = new FileReader()

    reader.onload = () => {
      this.previewUrl = reader.result
    }

    reader.readAsDataURL(file)
  }

  removeFeaturedImage() {
    this.previewUrl = null;
    this.selectedFile = null;
  }

  cleanHtml(html: string): string {
    return html
      .replace(/(&nbsp;)+/g, ' ')
      .replace(/<p><br><\/p>/g, '') // remove empty line blocks
      .replace(/\s+/g, ' ')
      .trim();
  }
}
