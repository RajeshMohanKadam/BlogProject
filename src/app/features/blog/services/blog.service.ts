import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  constructor(private http: HttpClient) { }

  baseUrl = environment.apiUrl

  createBlog(data: any) {
    return this.http.post(`${this.baseUrl}/blogs`, data);
  }

  getBlogList() {
    return this.http.get(`${this.baseUrl}/blogs/all`);
  }

  getBlogById(id: number) {
    return this.http.get(`${this.baseUrl}/blogs/${id}`)
  }

  updateBlog(id: number, data: any) {
    return this.http.put(`${this.baseUrl}/blogs/${id}`, data)
  }

}
