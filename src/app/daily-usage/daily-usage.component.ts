import { Component, OnInit } from '@angular/core';
import { HostListener } from "@angular/core";
import { CommonAppService } from '../services/common-app.service';
import { ChartDataSets, ChartOptions,ChartType } from 'chart.js';
import { Color } from 'ng2-charts';
@Component({
  selector: 'app-daily-usage',
  templateUrl: './daily-usage.component.html',
  styleUrls: ['./daily-usage.component.scss']
})

export class DailyUsageComponent implements OnInit {
  amount: boolean = true;
  kilowats: boolean = false;
  amountValue: number;
  kilowatsValue: number;
  webStatus: boolean = false;
  month: any;
  day: any;
  screenHeight: number;
  screenWidth: number;
  // myColors: any = [
  //   { name: 'upto average', value: 'rgba(48,45,52,.2)' },
  //   { name: 'usage', value: '#7033FF' },
  //   { name: 'exceed average', value: '#F16F3F' }
  // ];
  myColors: any = [
    { name: 'upto average', value: 'rgba(3,155,229,.2)' },
    { name: 'usage', value: '#039be5' },
    { name: 'exceed average', value: '#039be5' }
  ];
  width: any;
  barPadding: number = 20;
  view: any;
  chartDataAmount: any;
  chartDataKwh: any;
  chartDataAmountSection: any;
  chartDataKwhSection: any;
  nextCount: any = 1;
  prevCount: any = 1;
  nextCountStatus: boolean = true;
  prevCountStatus: boolean = false;
  customTransform: any;
  monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  hourlyUsage:any=[];
  sixHoursData:any=[];
  twelveHoursData:any=[];
  eighteenHoursData:any=[];
  twentyfourHoursData:any=[];
  hourlyMonthName:any;
  hourlyDay:any;
  currentDay:any;
  hourlyDate:any;
  dateIndex:any = 0;
  loader: boolean = true;
  monthlyDataLoader: boolean = true;
  isHourlyUsageEmpty:boolean = false;
  accountType:any;
  gasUnit:any;
  gasSwitchText:any;
  chartDataAmountMonthly:any = [];
  chartDataKwhMonthly:any = [];
  multiAmount: any[];
  
  constructor(private sharedService: CommonAppService) {
  }
  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    if (this.screenWidth > 1400) {
      this.webStatus = true;
      this.width = 1024;
      this.barPadding = 20;
      this.view = [this.width, 300];
      this.chartDataAmountSection = this.chartDataAmount;
      this.chartDataKwhSection = this.chartDataKwh;
    } else if (this.screenWidth > 993) {
      this.webStatus = true;
      this.width = 700;
      this.barPadding = 20;
      this.view = [this.width, 250];
      this.chartDataAmountSection = this.chartDataAmount;
      this.chartDataKwhSection = this.chartDataKwh;
    } else {
      this.webStatus = false;
      this.width = 360;
      this.barPadding = 25;
      this.view = [this.width, 180];
      this.chartDataAmountSection = this.chartDataAmount.slice(0, 10);
      this.chartDataKwhSection = this.chartDataKwh.slice(0, 10);
    }
  }
  public barChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'bottom',
      display: false,
      labels: {
        fontSize: 12,
        fontFamily: 'Karla',
        //usePointStyle: true,
        boxWidth: 30,

      }
    },
    animation: {
      duration: 2000
    },
    layout: {
      padding: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      }
    },
    scales: {
      yAxes: [{
        ticks: {
          // Include a dollar sign in the ticks
          callback: function (value, index, values) {
            return '$'+value;
          },
          fontSize: 16,
          fontFamily: 'Karla',
        },
        gridLines: {
          display: true,
          borderDash: [8, 4]
        }
      }],
      xAxes: [{
        display: true,
        gridLines: {
          display: false,//this will remove all the x-axis grid lines
          drawBorder: false,
        }
      }]
    }
  };
  public barChartType: ChartType = 'bar';
  public barChartLegend = false;
  public lineChartType = 'line';
  public lineChartColors: Color[] = [
    {
      borderColor: '#039BE5'
    }
  ];
  public barChartData: ChartDataSets[] = [
    { data: [73,85,80,78,72,74], label: 'Temp in Fh', type: 'line',fill: false},
    { data: [40,75,125,56,34,78], label: 'Usage' },
  ];
  public barChartLabels: string[] = ['Oct 20','Nov 20','Dec 20','jan 21','Feb 21','Mar 21'];

  ngOnInit(): void {
    this.accountType = localStorage.accountType;
    this.gasUnit = localStorage.gasUnit;
    this.gasSwitchText = localStorage.gasSwitchText;
    console.log(this.gasSwitchText);
    this.multiAmount = [{name: "NOV19", value: 70.19},{name: "DEC19", value: 76.46},{month: "JAN20", value: 70.75},{name: "FEB20", value: 67.86},
    {name: "MAR20", value: 72.19},
    {name: "APR20", value: 65.18},
    {name: "MAY20", value: 75.13},
    {name: "JUN20", value: 69.88},
    {name: "JUL20", value: 76.21},
    {name: "AUG20", value: 75.89},
    {name: "SEP20", value: 70.94},
    {name: "OCT20", value: 73.97},
    {name: "NOV20", value: 71.29}];
    Object.assign(this.multiAmount);
    var today = new Date();
    this.currentDay = today.getDate();
    this.sharedService.getDailyUsage().subscribe(data => {
      this.loader = false;
      var day = new Date();
      this.month = this.monthNames[day.getMonth()];
      this.day = day.getDate();
      this.customTransform = `translate(-35 , 0)`;
      this.amountValue = data.totalUsageAmount;
      this.kilowatsValue = data.totalUsageKwh;
      this.chartDataAmount = data.usageAmount;
      this.chartDataKwh = data.usageKwh;
      this.hourlyDate = this.chartDataAmount[0].name;
      this.getHourlyUsageData(this.chartDataAmount[0].date);
      this.getScreenSize();
    });
    this.sharedService.getMonthlyUSage().subscribe(data => {
      this.chartDataAmountMonthly = data.usageAmount;
      console.log(this.chartDataAmountMonthly);
      
      this.chartDataKwhMonthly = data.usageKwh;
    });
    this.sharedService.nextMessage("amount");
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
    return val.toLocaleString() + 'kWh';
  }
  kwhTickFormattingGas(val: any) {
    return val.toLocaleString() + 'ccf';
  }
  selectDailyUsageData(key: any) {
    //Next and previuos button handling//
    if (key == 'next') {
      if (this.nextCount <= 3) {
        /*Enable prev button*/
        this.prevCountStatus = true;
        /**/
        /*Calculating array start and end based on next button click*/
        let arrayStart = 0 + (this.nextCount) * 10;
        let arrayEnd = 10 * (this.nextCount + 1);

        /*Calculating array start and end based on next button click*/
        if (this.nextCount == 2) {
          this.nextCountStatus = false;
          arrayEnd = 31;
        }

        /*Get the sliced array for display*/
        this.chartDataAmountSection = this.chartDataAmount.slice(arrayStart, arrayEnd);
        this.chartDataKwhSection = this.chartDataKwh.slice(arrayStart, arrayEnd);
        this.nextCount += 1;
        console.log('Next ->' + arrayStart + ' ' + arrayEnd);

      }
    } else {
      this.nextCount -= 1;
      this.nextCountStatus = true;
      let arrayStartPrev = 0 + (this.nextCount - 1) * 10;
      let arrayEndPrev = 10 * (this.nextCount);
      this.chartDataAmountSection = this.chartDataAmount.slice(arrayStartPrev, arrayEndPrev);
      this.chartDataKwhSection = this.chartDataKwh.slice(arrayStartPrev, arrayEndPrev);
      if (arrayStartPrev == 0) {
        this.prevCountStatus = false;
      }
      console.log('Next ->' + arrayStartPrev + ' ' + arrayEndPrev);
    }
  }
  prevDayData(){
    this.dateIndex += 1;
    //this.hourlyDate = this.chartDataAmount[this.dateIndex].name;
    this.hourlyDate = this.chartDataAmount[this.dateIndex].name;
    this.getHourlyUsageData(this.chartDataAmount[this.dateIndex].date);
  }
  nextDayData(){
    this.dateIndex -= 1;
    //this.hourlyDate = this.chartDataAmount[this.dateIndex].name;
    this.hourlyDate = this.chartDataAmount[this.dateIndex].name;
    this.getHourlyUsageData(this.chartDataAmount[this.dateIndex].date);
  }
  getHourlyUsageData(date:any){
    // var c = date.split(" ");
    // var dateValue = {'day':c[1],'month':c[0],'year':c[2]}
    this.sharedService.getHourlyUsage(date).subscribe(data => {
      if(Object.keys(data).length === 0 && data.constructor === Object ){
        this.isHourlyUsageEmpty = true;
      }
      
      this.hourlyUsage = data;
      this.sixHoursData = this.hourlyUsage.firstset;
      this.twelveHoursData = this.hourlyUsage.secondset;
      this.eighteenHoursData = this.hourlyUsage.thirdset;
      this.twentyfourHoursData = this.hourlyUsage.fourthset;
    });
  }
}
