import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
// import {switchMap} from 'rxjs/operators';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';
import { of } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';
// import * as firebase from 'firebase';
import * as firebase from 'firebase/app';

import { DatabaseService } from '../service/database.service';

@Injectable()
export class LoginService {
  authState: Observable<{} | null>;

  user: Observable<{} | null>;
  userUid: string;

  loggedIn: boolean = false;
  isAdmin: boolean = false;
  adminRef: any;
  businessCardsTmp: any;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private db: AngularFireDatabase,
    private dbService: DatabaseService
  ) {

    this.user = this.afAuth.authState
      .switchMap((user) => {
        if (user) {
          this.userUid = user.uid;
          return this.db.object(`users/${user.uid}`).update({ email: user.email }).then(() => {
            return this.db.object(`users/${user.uid}`).valueChanges();
          }).catch((error) => {
            console.log(error);
          });
        } else {
          return of(null);
        }
      });
  }

  loginWithEmail(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((auth) => {
        this.loggedIn = true;
        this.adminRef = this.dbService.isAdminUser(auth.user.uid).subscribe(
          (result) => {
            if (result === true) {
              this.isAdmin = true;
            } else {
              this.isAdmin = false;
            }
            this.adminRef.unsubscribe();
          }
        );

        const CREATEDAT = firebase.database.ServerValue.TIMESTAMP;
        const SESSIONKEY = this.db.database
          .ref(`sessions`)
          .push({
            userUid: auth.user.uid
          }).key;

        const sessionPayload: any = {
          createdAt: CREATEDAT,
          userUid: auth.user.uid,
          currentSessionKey: SESSIONKEY,
        };

        const sessionPayloads: any = {};
        sessionPayloads[`currentSession/${auth.user.uid}`] = sessionPayload;
        sessionPayloads[`users/${auth.user.uid}/sessions/${SESSIONKEY}`] = { 'createdAt': CREATEDAT };
        return this.db.database.ref().update(sessionPayloads);
      })
      .catch(error => {
        console.log(error);
        throw error;
      });
  }

  signOut() {
    if (this.businessCardsTmp) {
      this.businessCardsTmp.unsubscribe();
    }
    this.afAuth.auth.signOut();
    this.router.navigate(['/']);
    this.loggedIn = false;
  }
}
