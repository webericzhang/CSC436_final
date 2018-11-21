import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { LoginService } from './login.service';
import { DatabaseService } from '../service/database.service';

import { Observable } from 'rxjs/Observable';
import { map, take, tap } from 'rxjs/operators';

@Injectable()
export class AuthGuardAdmin implements CanActivate {

  constructor(
    private authService: LoginService,
    private router: Router,
    private dbService: DatabaseService
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {
    if (!this.authService.loggedIn) {
      console.log('access denied');
      return false;
    } else {
      if (this.authService.isAdmin) {
        return true;
      } else {
        console.log('Not a admin user!');
        return false;
      }
    }

  }

}
