import { Component, OnInit } from '@angular/core';
import {CommonAppService} from '../services/common-app.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  amount: boolean = true;
  kilowats: boolean = false;
  amountValue: number;
  kilowatsValue: number;
  constructor(private sharedService: CommonAppService) { }
  message:string;
  ngOnInit(): void {
    this.amountValue = 128;
    this.kilowatsValue = 185;
    this.sharedService.sharedMessage.subscribe(message =>{
      this.message = message;
      if(message == 'kilowats'){
        this.kilowats = true;
        this.amount = false;
      }else{
        this.amount = true;
        this.kilowats = false;
      }
    });
    
  }

}