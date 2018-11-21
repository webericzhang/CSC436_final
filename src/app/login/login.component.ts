import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Gtag } from 'angular-gtag';

import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;
  
  constructor(
    private loginService: LoginService,
    private router: Router,
    private gtag: Gtag
  ) { }

  ngOnInit() {
  }

  onLoginEmail(): void {
    if (this.checkForm(this.email, this.password)) {
      this.loginWithEmail(this.email, this.password);
    }
  }

  checkForm(email: string, password: string): boolean {
    if (!email || email.length === 0) {
      return false;
    }

    if (!password || password.length === 0) {
      return false;
    }

    if (password.length < 6) {
      return false;
    }
    return true;
  }

  loginWithEmail(email: string, password: string) {
    this.loginService.loginWithEmail(this.email, this.password)
        .then(
          () => {
            this.sendEventToGoogle();
            this.router.navigate(['/dashboard']);
          }
        )
        .catch( error => {
          console.log(error);
          this.router.navigate(['/login']);
        });
  }

  sendEventToGoogle() {
    this.gtag.event('mylogin', {
      'event_category': 'engagement',
      'event_label': 'Log in succeed !',
    });
  }
}
