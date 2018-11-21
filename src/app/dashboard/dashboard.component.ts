import { Component, OnInit } from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import { Gtag } from 'angular-gtag';

import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';

import { CloudVisionService } from '../service/cloud-vision.service';
import { DatabaseService } from '../service/database.service';
import { LoginService } from '../login/login.service';

import { BusinessCard } from '../businessCard';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  searchEmail: string = '';
  searchCardWithEmail: BusinessCard;

  businessCards: BusinessCard[];

  isCamera: boolean = false;
  isImage: boolean = false;
  trigger: Subject<void> = new Subject<void>();
  webcamImage: WebcamImage = null;

  detected: boolean = false;
  deFirstName: string = '';
  deLastName: string = '';
  deEmail: string = '';
  dePhoneNum: string = '';
  deText: string = '';
  detectedImageUri: string = '';


  constructor(
    private cloudVisionService: CloudVisionService,
    private dbService: DatabaseService,
    private loginService: LoginService,
    private gtag: Gtag
  ) {
    this.isImage = true; 
  }

  ngOnInit() {
    this.loginService.businessCardsTmp = this.dbService.getBusinessCards().subscribe(
      (results) => {
        console.log('Successful !');
        console.log(results);

        this.businessCards = results;
      },
      (error) => {
        console.log('Failed !');
      }
    );
  }

  detectText() {
    if (this.isImage !== true) {
      return;
    }

    let imageUri = 'https://lh3.googleusercontent.com/-sQsJlPZIPTc/ThwkpQeADtI/AAAAAAAAAuI/MWUH1I_7X0A/w530-h289-n/patrick-bateman-card.png';
    
    this.cloudVisionService.detectText(imageUri).subscribe(
      (response) => {
        console.log('Successful !');
        
        console.log(response);

        this.getBusinessCardInfo(response);
        
        this.detected = true;

        this.addHistory('Text detection performed on business card');
      },
      (error) => {
        console.log('Failed !');
        console.log(error);
      }
    );

  }

  getBusinessCardInfo(imageTexts: any[]) {
    let imageText = imageTexts[0].description;

    this.deEmail = this.getEmail(imageText);
    this.dePhoneNum = this.getNumber(imageText);
    this.deFirstName = 'Xiaoxi';
    this.deLastName = 'Zhang';
    this.deText = this.getText(imageText);
  }

  getText(imageText: string): string {
    let text = imageText;

    text = text.replace(this.deEmail, '');
    text = text.replace(this.dePhoneNum, '');
    text = text.replace(/\n/g, '');

    return text;
  }

  addCard() {
    if (this.isImage !== true) {
      return;
    }


    let bc = new BusinessCard();
    bc.firstName = this.deFirstName;
    bc.lastName = this.deLastName;
    bc.email = this.deEmail;
    bc.phoneNumber = this.dePhoneNum;
    bc.text = this.deText;
    bc.imageUri = this.detectedImageUri;

    this.sendCardToDB(bc);

    this.addHistory('A new business card added to database');

    this.sendEventToGoogle();

    this.isImage = false;
    this.detected = false;
    this.deFirstName = '';
    this.deLastName = '';
    this.deEmail = '';
    this.dePhoneNum = '';
    this.deText = '';
  }

  sendEventToGoogle() {
    this.gtag.event('addnew', {
      'event_category': 'engagement',
      'event_label': 'added a new business card to database successfully',
    });
  }

  switchCamera() {
    this.isCamera = !this.isCamera;
  }

  snapshot() {
    this.trigger.next();
  }

  public getImage(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
    this.isImage = true;
  }

  public get getTrigger(): Observable<void> {
    return this.trigger.asObservable();
  }

  getEmail(imageText: string): string {
    let reg = new RegExp(/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/, 'g');

    let res = reg.exec(imageText);
    
    return res !== null ? res[0] : '';
  }

  getNumber(imageText: string): string {
    let reg = new RegExp(/((\d)\D)?(\(?(\d\d\d)\)?)?\D(\d\d\d)\D(\d\d\d\d)/, 'g');

    let res = reg.exec(imageText);
    
    return res !== null ? res[0] : '';
  }

  searchWithEmail() {
    if (this.searchEmail.length === 0) {
      return;
    }

    this.searchCardWithEmail = this.businessCards.find(businessCard => {
      return businessCard.email === this.searchEmail;
    });

    this.addHistory('Searching Card With Email');
  }

  addHistory(msg: string) {
    this.dbService.addHistory(msg).then(
      (_) => {
        console.log(`addHistory() Succeed !`);       
      },
      (error) => {
        console.log(`addHistory() Failed !`);
      }
    );
  }

  sendCardToDB(businessCard: BusinessCard) {
    this.dbService.addCard(businessCard).then(
      (_) => {
        console.log('sendCardToDB() Succeed !');      
      },
      (error) => {
        console.log('sendCardToDB() Failed !');
      }
    );
  }
}
