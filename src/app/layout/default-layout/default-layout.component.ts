import { NgIf } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { count, filter } from 'rxjs/operators';

@Component({
  selector: 'app-default-layout',
  imports: [RouterOutlet, NgIf],
  templateUrl: './default-layout.component.html',
  styleUrl: './default-layout.component.css'
})
export class DefaultLayoutComponent {

  private navCounter = signal(0);

  showDefaultNavbar = computed(() => {
    // read signal to make computed re-evaluate when updated
    this.navCounter();
    return !this.router.url.includes('/blogs/new-story');
  });

  constructor(private router: Router) {
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
      this.navCounter.update(counter => counter + 1)
    })
  }

  goToAddBlog() {
    this.router.navigateByUrl('blogs/new-story')
  }

  goBack() {

  }
}
