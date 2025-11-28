import { NgIf } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { count, filter } from 'rxjs/operators';
import { AuthService } from '../../features/auth/auth/services/auth.service';

@Component({
  selector: 'app-default-layout',
  imports: [RouterOutlet, NgIf],
  templateUrl: './default-layout.component.html',
  styleUrl: './default-layout.component.css'
})
export class DefaultLayoutComponent {

  private authService = inject(AuthService);
  private navCounter = signal(0);
  private data!: any | null;
  name: any

  showDefaultNavbar = computed(() => {
    // read signal to make computed re-evaluate when updated
    this.navCounter();
    return !this.router.url.includes('/blogs/new-story');
  });

  constructor(private router: Router) {
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
      this.navCounter.update(counter => counter + 1)
    })

    this.data = localStorage.getItem('auth_token');
    this.data = JSON.parse(this.data);
    this.name = this.data?.name.split(' ')[0]

  }

  goToAddBlog() {
    this.router.navigateByUrl('blogs/new-story')
  }

  goBack() {

  }

  menuOpen = false;

  toggleMenu() {
    debugger
    this.menuOpen = !this.menuOpen;
  }

  logout() {
    // your logout code here
    console.log("Logged out");
  }
}
