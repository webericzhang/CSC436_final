import { Component } from '@angular/core';

import { LoginService } from './login/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'csc436-businessCards';

  constructor(private loginService: LoginService) {
  }

  logout() {
    this.loginService.signOut();
  }
}
