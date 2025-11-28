import { NgIf } from '@angular/common';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-auth',
  imports: [NgIf, FormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
  isSignIn = true;
  isSignUp = false;

  router = inject(Router);
  authervice = inject(AuthService)

  modalRef?: BsModalRef;

  @ViewChild('authModal') authModal: any;

  constructor(private modalService: BsModalService) { }

  open() {
    this.modalRef = this.modalService.show(this.authModal);
  }

  close() {
    this.modalRef?.hide();
  }

  showSignUpForm(event: any) {
    event.preventDefault();
    this.isSignIn = false;
    this.isSignUp = true;
  }

  showSignInForm(event: any) {
    event.preventDefault();
    this.isSignIn = true;
    this.isSignUp = false;
  }

  // login(form: any, type: any,) {
  //   if (form.invalid) {
  //     form.control.markAllAsTouched(); // Show all error messages
  //     return;
  //   }
  //   else if (this.isSignIn) {
  //     this.authervice.login(form.value).subscribe({
  //       next: (res) => {
  //         console.log(res);
  //         if (type == "signin") { this.close(); }
  //         this.authervice.saveToken(JSON.stringify(res))
  //         this.router.navigateByUrl('blogs');
  //       },
  //       error: (err) => {
  //         console.log(err);
  //       }
  //     })
  //   }
  //   else {
  //     this.isSignIn = true;
  //     this.isSignUp = false;
  //   }
  // }

  login(form: any) {
    this.authervice.login(form.value).subscribe({
      next: (res) => {
        this.authervice.saveToken(JSON.stringify(res))
        this.close();
        this.router.navigateByUrl('blogs');
      },
      error(err) {
        console.log(err);
      },
    })
  }

  register(form: any) {
    this.authervice.register(form.value).subscribe({
      next: (res) => {
        this.isSignIn = true;
        this.isSignUp = false;
      },
      error(err) {
        console.log(err);
      }
    })
  }
}
