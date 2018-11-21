import { Component, OnInit } from '@angular/core';

import { DatabaseService } from '../service/database.service';
import { LoginService } from '../login/login.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  history: string[];
  historyTmp: any;

  constructor(private dbService: DatabaseService, private loginService: LoginService) {

  }

  ngOnInit() {
    this.historyTmp = this.dbService.getAllHistory().subscribe(
      (response) => {
        console.log(response);

        this.history = response;
        
        this.historyTmp.unsubscribe();
      },
      (error) => {
        console.log(error);
      }
    );
  }

}
