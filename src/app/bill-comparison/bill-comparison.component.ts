import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { CommonAppService } from '../services/common-app.service';

@Component({
  selector: 'app-bill-comparison',
  templateUrl: './bill-comparison.component.html',
  styleUrls: ['./bill-comparison.component.scss']
})
export class BillComparisonComponent implements OnInit {
  amount: boolean = true;
  kilowats: boolean = false;
  amountValue: number;
  kilowatsValue: number;
  view: any[] = [280, 240];
  //Desktop width  view: any[] = [480, 420];
  multiAmount: any[];
  multikwh: any[];
  colorSchemeAmount: any = { domain: Array };
  colorSchemeKwh: any = { domain: Array };
  datePickerStatus: boolean = false;
  model: NgbDateStruct;
  modelDateFirst = '';
  modelDateSecond = '';
  modelDateThird = '';
  minDate: Date;
  maxDate: Date;
  selectMonthFirst: any;
  selectMonthSecond: any;
  selectMonthThird: any;
  selectYearFirst: any;
  selectYearSecond: any;
  selectYearThird: any;
  year: any;
  month: any;
  selectMonthFirstName: any;
  selectMonthSecondName: any;
  selectMonthThirdName: any;
  currentMonthName: any;
  calendarData: any;
  monthNames = ["dummy", "Jan", "Feb", "March", "April", "May", "June",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  constructor(private calendar: NgbCalendar, private sharedService: CommonAppService) {
    this.minDate = new Date();
    this.maxDate = new Date();
    this.minDate.setDate(this.minDate.getDate() - 365);
    this.maxDate.setDate(this.maxDate.getDate());
  }

  ngOnInit(): void {
    var today = new Date();
    this.year = today.getFullYear();
    this.month = today.getMonth() + 1;
    if (this.month == 1) {
      this.selectMonthFirst = 12;
      this.selectMonthSecond = 11;
      this.selectMonthThird = 10;
      this.selectYearFirst = this.selectYearSecond = this.selectYearThird = this.year - 1;
    } else if (this.month == 2) {
      this.selectMonthFirst = this.month - 1;
      this.selectMonthSecond = 12;
      this.selectMonthThird = 11;
      this.selectYearFirst = this.year;
      this.selectYearSecond = this.selectYearThird = this.year - 1;
    } else if (this.month == 3) {
      this.selectMonthFirst = this.month - 1;
      this.selectMonthSecond = this.month - 2;
      this.selectMonthThird = 12;
      this.selectYearFirst = this.selectYearSecond = this.year;
      this.selectYearThird = this.year - 1;
    }
    else {
      this.selectMonthFirst = this.month - 1;
      this.selectMonthSecond = this.month - 2;
      this.selectMonthThird = this.month - 3;
      this.selectYearFirst = this.selectYearSecond = this.year;
      this.selectYearFirst = this.selectYearSecond = this.selectYearThird = this.year;
    }

    this.calendarData = [{ "month": this.selectMonthFirst, "year": this.selectYearFirst },
    { "month": this.selectMonthSecond, "year": this.selectYearSecond },
    { "month": this.selectMonthThird, "year": this.selectMonthThird }];
    console.log(this.calendarData);

    this.selectMonthFirstName = this.monthNames[this.selectMonthFirst];
    this.selectMonthSecondName = this.monthNames[this.selectMonthSecond];
    this.selectMonthThirdName = this.monthNames[this.selectMonthThird];
    this.currentMonthName = this.monthNames[today.getMonth() + 1];

    console.log(this.currentMonthName + "--" + this.selectMonthFirstName + "--" + this.selectMonthSecondName);


    this.sharedService.nextMessage("amount");
    let colorsAmount: any[];
    let colorsKwh: any[];
    this.amountValue = 128;
    this.kilowatsValue = 185;
    var multiAmount = [
      {
        "name": "2019 APR",
        "value": 12
      },
      {
        "name": "2019 March",
        "value": 25
      },
      {
        "name": "2020 APR",
        "value": 13
      }
    ];
    var multikwh = [
      {
        "name": "2019 APR",
        "value": 26
      },
      {
        "name": "2019 March",
        "value": 30
      },
      {
        "name": "2020 APR",
        "value": 22
      }
    ];
    colorsAmount = [];
    colorsKwh = [];
    multiAmount.forEach((element) => {
      if (element.value > 18) {
        colorsAmount.push("#F16F3F");
      } else {
        colorsAmount.push("#7033FF");
      }
    })
    multikwh.forEach((element) => {
      if (element.value > 25) {
        colorsKwh.push("#F16F3F");
      } else {
        colorsKwh.push("#7033FF");
      }
    })
    this.colorSchemeAmount.domain = colorsAmount;
    this.colorSchemeKwh.domain = colorsKwh;
    Object.assign(this, { multiAmount });
    Object.assign(this, { multikwh });
  }
  handleSelected($event) {
    if ($event.target.checked === true) {
      this.amount = false;
      this.kilowats = true;
      this.sharedService.nextMessage("kilowats");
    } else {
      this.amount = true;
      this.kilowats = false;
      this.sharedService.nextMessage("amount");
    }
  }
  currencyTickFormatting(val: any) {
    return '$' + val.toLocaleString();
  }
  kwhTickFormatting(val: any) {
    return val.toLocaleString() + ' kWh';
  }
  yAxisTickFormatting(value) {
    if (this.amount) {
      return this.currencyTickFormatting(value);
    } else {
      return this.kwhTickFormatting(value);
    }
  }
  getDate() {
    this.datePickerStatus = true;
  }
  selectToday() {
    //this.model = this.calendar.getToday();
    this.datePickerStatus = false;
    console.log(this.model);
  }
  onOpenCalendar(container, index) {
    container.monthSelectHandler = (event: any): void => {
      container._store.dispatch(container._actions.select(event.date));
      console.log(index);
      switch (index) {
        case 1:
          var selectedDate = this.modelDateFirst;
          var d = new Date(selectedDate);
          var month = d.getMonth() + 1;
          this.selectYearFirst = d.getFullYear();
          this.selectMonthFirstName = this.getMonthName(month);
          var details = { "month": month, "year": this.selectYearFirst }
          break;
        case 2:
          var selectedDate = this.modelDateSecond;
          var d = new Date(selectedDate);
          var month = d.getMonth() + 1;
          this.selectYearSecond = d.getFullYear();
          this.selectMonthSecondName = this.getMonthName(month);
          var details = { "month": month, "year": this.selectYearSecond }
          break;
        case 3:
          var selectedDate = this.modelDateThird;
          var d = new Date(selectedDate);
          var month = d.getMonth() + 1;
          this.selectYearThird = d.getFullYear();
          this.selectMonthThirdName = this.getMonthName(month);
          var details = { "month": month, "year": this.selectYearThird }
          break;

      }
      console.log(details);

    };
    container.setViewMode('month');
  }
  getMonthName(index) {
    return this.monthNames[index];
  }

}
