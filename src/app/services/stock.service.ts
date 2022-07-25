import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bar } from '../interfaces/bar';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  BASE_URL = 'https://data.alpaca.markets/v2/stocks';
  API_KEY = 'PKIFNV6GOLXP3KMIOYGE';
  SECRET_KEY = 'zRempFxPrLX0leMRWv9YzbFW9a1oLloYLhcBgx0C';
  headers: HttpHeaders = new HttpHeaders({ 'APCA-API-KEY-ID': this.API_KEY, 'APCA-API-SECRET-KEY': this.SECRET_KEY });

  constructor(private http: HttpClient) { }

  getBarsAPI(symbol: string, timeframe: string): Observable<any> {
    let start = '';
    if (timeframe === '1Min') {
      // 60secs * 60mins = 1hour * 24hours = 1 day * 6.5days = 6.5days before now    * 1000 (Miliseconds)
      start = new Date(Date.now() - (259200 * 1000)).toISOString();
    } else if (timeframe === '5Min') {
      // 259.200mins * 5mins = 1.296.000 Minutes before now -> 32.5 days
      start = new Date(Date.now() - (1296000 * 1000)).toISOString();
      console.log('5 Mins here ' + start);
    } else if (timeframe === '1hour') {
      // 15.552.000mins before now ->  390 days
      start = new Date(Date.now() - (15552000 * 1000)).toISOString();
    }
    return this.http.get<any>(`${ this.BASE_URL }/${ symbol }/bars?timeframe=${ timeframe }&start=${ start }&limit=10000`,
      { headers: this.headers });
  }
}
