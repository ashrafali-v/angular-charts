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
  accountType:any;
  gasUnit:any;
  constructor(private sharedService: CommonAppService) { }
  message:string;
  ngOnInit(): void {
    this.sharedService.getRecentDayUsage().subscribe(data => {
      this.amountValue = data.predictedAmount;
      this.kilowatsValue = data.predictedKwh;
      this.accountType = data.accountType;
      if(this.accountType == 'GAS'){
        localStorage.gasUnit = 'lpg';
        localStorage.gasSwitchText = 'LPG';
      }
      this.gasUnit = localStorage.gasUnit;
    });
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
