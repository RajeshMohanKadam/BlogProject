import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-article-card',
  imports: [DatePipe],
  templateUrl: './article-card.component.html',
  styleUrl: './article-card.component.css'
})
export class ArticleCardComponent {

  @Input() authorName!: string;
  @Input() authorAvatarUrl: string = 'https://i.pinimg.com/736x/8a/14/fe/8a14fefc276ab576e8ceac207cace638.jpg';
  @Input() title!: string;
  @Input() content!: string;
  @Input() date!: string;
  @Input() views!: number;
  @Input() comments!: number;
  @Input() imageUrl!: string;

  get subtitle() {
    return this.content?.replace(/<[^>]+>/g, '').slice(0, 160) + '...';
  }
}
