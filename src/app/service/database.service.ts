import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

import { BusinessCard } from '../businessCard';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  businessCardsTmp: any;
  historyTmp: any;

  constructor(private db: AngularFireDatabase) {
    this.businessCardsTmp = this.db.list('businessCards');
    this.historyTmp = this.db.list('history');
  }

  addCard(businessCard: BusinessCard): Promise<any> {
    return this.businessCardsTmp.push(businessCard);
  }

  getBusinessCards() {
    return this.businessCardsTmp.valueChanges();
  }

  addHistory(userMsg: string): Promise<any> {
    let msg = userMsg + '  --  ' + new Date();

    return this.historyTmp.push(msg);
  }

  getAllHistory() {
    return this.historyTmp.valueChanges();
  }

  isAdminUser(userId: string) {
    return this.db.object(`admins/${userId}`).valueChanges();
  }

}
