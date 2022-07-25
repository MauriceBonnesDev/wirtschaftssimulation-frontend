import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {BehaviorSubject, Observable, ReplaySubject, Subject} from 'rxjs';
import { Asset } from '../interfaces/asset';
import { Bar } from '../interfaces/bar';
import {map, shareReplay} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  ASSET_URL = 'https://paper-api.alpaca.markets/v2/assets';
  BASE_URL = 'https://data.alpaca.markets/v2/stocks';
  API_KEY = 'PKIFNV6GOLXP3KMIOYGE';
  SECRET_KEY = 'zRempFxPrLX0leMRWv9YzbFW9a1oLloYLhcBgx0C';
  headers: HttpHeaders = new HttpHeaders({ 'APCA-API-KEY-ID': this.API_KEY, 'APCA-API-SECRET-KEY': this.SECRET_KEY });

  res: Asset[];
  allAssets = new ReplaySubject<Asset[]>();
  allAssets$ = this.allAssets.asObservable();

  constructor(private http: HttpClient) { }
  getAllAssetsAPI(): Observable<Asset[]> {
    return this.allAssets$ = this.http.get<Asset[]>(`${ this.ASSET_URL }?exchange=NASDAQ&status=active`, { headers: this.headers })
      .pipe(
        map(assets =>
          assets.map(asset =>
            ({
              ...asset
            } as Asset)
          )
        ),
        shareReplay(1)
      );
  }



  getBarsAPI(symbol: string, timeframe: string): Observable<Bar[]> {
    return this.http.get<Bar[]>(`${ this.BASE_URL }/${ symbol }bars?timeframe=${ timeframe }`);
  }

  doSearch(q: string): Observable<Asset[]> {
    return this.http
      .get<Asset[]>(`${ this.ASSET_URL }?exchange=NASDAQ&status=active`, { headers: this.headers })
      .pipe(
        map(assets =>
          assets.filter(
            asset => asset.symbol.toLowerCase().includes(q.toLowerCase())
          )
        )
      );
  }
}
