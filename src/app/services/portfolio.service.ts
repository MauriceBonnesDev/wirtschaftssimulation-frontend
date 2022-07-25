import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Stock } from '../interfaces/stock';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  BACKEND_URL = 'http://localhost:8080';
  STOCKS_URL = 'https://data.alpaca.markets/v2/stocks';
  API_KEY = 'PKIFNV6GOLXP3KMIOYGE';
  SECRET_KEY = 'zRempFxPrLX0leMRWv9YzbFW9a1oLloYLhcBgx0C';
  auth: object = { action: 'auth', API_KEY: this.API_KEY, SECRET_KEY: this.SECRET_KEY };
  headers: HttpHeaders = new HttpHeaders({'APCA-API-KEY-ID': this.API_KEY, 'APCA-API-SECRET-KEY': this.SECRET_KEY});

  constructor(private http: HttpClient) { }

  getBudget(): Observable<number> {
    console.log('getBudget - PortfolioService');
    return this.http.get<number>(this.BACKEND_URL + '/budget');
  }

  getStocks(): Observable<Stock[]> {
    console.log('getStocks - PortfolioService');
    return this.http.get<Stock[]>(this.BACKEND_URL + '/portfolio/stock');
  }

  // Iterate through all the available stocks in the portfolio, send get request for historical data for each stock -> use the symbol
  getStocksByMinuteAPI(symbols: string): Observable<object> {
    console.log('-------------');
    // const req = this.http.get<any>(`${ this.STOCKS_URL }/AAPL/bars?timeframe=1min&start=2021-07-07T08:00:00Z&limit=10000`,
    // { headers: this.headers });
    return this.http.get<object>(`${ this.STOCKS_URL }/bars?symbols=${ symbols }&timeframe=1Hour&start=2021-07-07T08:00:00Z&limit=5000`,
      { headers: this.headers });
  }
}
