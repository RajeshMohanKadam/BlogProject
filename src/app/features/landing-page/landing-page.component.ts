import { NgIf } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { AuthComponent } from "../auth/auth/auth.component";

@Component({
  selector: 'app-landing-page',
  imports: [AuthComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {

  // @ViewChild('authModal') authModal!: AuthComponent
  // constructor(private modalService: NgbModal) { }

  // openAuthModal() {
  //   this.modalService.open(this.authModal, { centered: true });
  // }

}
