import { Component, OnInit, Input } from '@angular/core';


import { BusinessCard } from '../businessCard';

@Component({
  selector: 'app-businessCardDetail',
  templateUrl: './businessCardDetail.component.html',
  styleUrls: ['./businessCardDetail.component.css']
})
export class BusinessCardDetailComponent implements OnInit {

  @Input() businessCard: BusinessCard;
  @Input() searchWith: string;

  constructor() { }

  ngOnInit() {
  }

}
