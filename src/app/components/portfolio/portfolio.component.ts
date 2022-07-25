import { Component, OnInit } from '@angular/core';
import { Portfolio } from '../../interfaces/portfolio';
import {PortfolioService} from '../../services/portfolio.service';
import {Stock} from '../../interfaces/stock';
import {Observable, zip} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {Bar} from '../../interfaces/bar';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss'],
})
export class PortfolioComponent implements OnInit {

  bars: Bar[];

  chartVisible = true;
  pieChartVisible = false;
  portfolio: Portfolio = {
    budget: 0,
    stocks: [{ id: 1, symbol: 'vw', quantity: 2, name: 'VW', purchasePrice: 100, timestamp: new Date()},
      { id: 2, symbol: 'xyz', quantity: 3, name: 'Tesla', purchasePrice: 200, timestamp: new Date()},
      { id: 3, symbol: 'abcd', quantity: 4, name: 'Apple', purchasePrice: 300, timestamp: new Date()}
    ]
  };
  constructor(private portfolioService: PortfolioService) {}

  ngOnInit(): void {
    // first version
    // concat(
    //   this.portfolioService.getBudget(),
    //   this.portfolioService.getStocks()
    // ).subscribe(data => {
    //   if (typeof data === 'number') {
    //     this.portfolio.budget = data;
    //   } else {
    //     this.portfolio.stocks = data;
    //     this.calcBudget();
    //   }});

    /*  init callen -> getBudget, getStocks, getStocksByMinute, calcBudget wird dort aufgerufen, Reihenfolge von
     *  getBudget und getStocks ist egal, hauptsache die werden ausgeführt, bevor calcBudget und getStocksByMinute
     *  aufgerufen werden.
     *
     * getBudget und getStocks weisen jeweils noch dem portfolio ihre Werte hinzu
     * calcBudget benötigt die Werte aus den beiden Funktionen, verwendet das dann initialisierte Portfolio
     * die Portfoliowerte werden nun mit echten Daten für den Chart und die aktuellen Werte des Portfolios belegt.
     */



    // better version?
    zip(
      this.getBudget(),
      this.getStocks().pipe(switchMap(stocks => this.getStocksByMinute(stocks)
      ))
    ).subscribe(() => this.calcBudget());
  }

  calcBudget(): void {
    for (const stock of this.portfolio.stocks) {
      this.portfolio.budget += stock.quantity * stock.purchasePrice;
      console.log('quantity ' + stock.quantity);
      console.log('purchase Price ' + stock.purchasePrice);
    }
    console.log(this.portfolio.budget);
  }

  toggleChart(): void {
    this.chartVisible = true;
    this.pieChartVisible = false;
  }

  togglePieChart(): void {
    this.pieChartVisible = true;
    this.chartVisible = false;
  }

  getBudget(): Observable<number> {
    return this.portfolioService.getBudget().pipe(map(budget => {
      return this.portfolio.budget = budget;
    }));


    // this.portfolioService.getBudget().subscribe((budget: number) => {
    //   console.log('Budget: ' + budget);
    //   this.portfolio.budget = budget;
    // });
    // return this.portfolioService.getBudget();
  }

  getStocks(): Observable<Stock[]> {
    return this.portfolioService.getStocks().pipe(map(stocks => {
      console.log(stocks);
      return this.portfolio.stocks = stocks;
    }));

    // this.portfolioService.getStocks().subscribe((stocks: Stock[]) => {
    //   this.portfolio.stocks = stocks;
    //   console.log(this.portfolio.stocks);
    // });
    // return this.portfolioService.getStocks();
  }

  getStocksByMinute(stocks: Stock[]): Observable<any> {
    let symbols = '';
    console.log(stocks);
    this.portfolio.stocks.forEach((stock, idx, arr) => {
      if (idx === arr.length - 1) {
        symbols += stock.symbol;
      } else {
        symbols += stock.symbol + ',';
      }
    });
    const response = this.portfolioService.getStocksByMinuteAPI(symbols);
    response.subscribe(data => {
      const dataJSON: object = JSON.parse(JSON.stringify(data));

      this.bars = Object.values(dataJSON)[0].AMZN;
      console.log(this.bars);
    });
    return response;
  }
}
