import {Component, OnDestroy, OnInit} from '@angular/core';
import {SearchService} from '../../../services/search.service';
import {Asset} from '../../../interfaces/asset';
import {BehaviorSubject, combineLatest, Observable} from 'rxjs';
import {debounceTime, filter, map} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {WebsocketService} from '../../../services/websocket.service';
import {Bar} from '../../../interfaces/bar';

@Component({
  selector: 'app-shares-list',
  templateUrl: './shares-list.component.html',
  styleUrls: ['./shares-list.component.scss']
})
export class SharesListComponent implements OnInit, OnDestroy {
  private filterAssets = new BehaviorSubject<string>('');
  filterAssetsAction$ = this.filterAssets.asObservable();

  collectionSize = 500;
  page = 1;
  pageSize = 30;
  searchText = '';
  input = new FormControl('');
  lastBars: Bar[];
  symbols: string[] = [];
  data: Asset[];
  prices: number[];
  // SOCKET
  SOCKET_URL = 'wss://stream.data.alpaca.markets/v2/iex';
  API_KEY = 'PKIFNV6GOLXP3KMIOYGE';
  SECRET_KEY = 'zRempFxPrLX0leMRWv9YzbFW9a1oLloYLhcBgx0C';
  auth: object = {action: 'auth', key: this.API_KEY, secret: this.SECRET_KEY};
  alpacaSocket: WebSocket;
  subscribe: object = {action: 'subscribe', trades: ['AAPL']};
  respData: object;
  assets$ = combineLatest([
    this.searchService.allAssets$,
    this.filterAssetsAction$
  ]).pipe(
    map(([assets, term]) => {
      assets.filter(asset => asset.symbol.toLowerCase().includes(term.toLowerCase()));
    })
  );

  constructor(private searchService: SearchService,
              private socketService: WebsocketService) {
  }

  // über REST API alle Aktien beziehen, dann über das Symbol mit Websockets für jede Aktie den aktuellen Preis darstellen?
  ngOnInit(): void {
    this.connectSocket();
    this.updatePrices();
  }

  ngOnDestroy(): void {
    this.closeSocket();
  }

  updatePrices(): void {
    this.symbols = [];
    // symbols on the currently visited site.
    for (const key in this.data) {
      if (Number(key) >= this.pageSize * this.page - this.pageSize && Number(key) < this.pageSize * this.page) {
        this.symbols.push(this.data[key].symbol);
      }
    }
    this.onMessage(this.symbols);
  }

  // Socket functions

  connectSocket(): void {
    this.alpacaSocket = new WebSocket(this.SOCKET_URL);
    console.log(this.alpacaSocket);
  }

  onMessage(symbols?: string[]): void {
    console.log(symbols);
    const returnData = [];
    this.alpacaSocket.onmessage = event => {
      this.respData = JSON.parse(event.data);
      const message = this.respData[0]['msg'];
      if (message === 'connected') {
        this.alpacaSocket.send(JSON.stringify(this.auth));
      }
      // Zuletzt bei 5:04 in Part2 Grid Bot tutorial
      // ausprobieren, da maximal 30 verschiedene Symbole abgefragt werden, dass man den aktuellste Preis aus dem Trade entnimmt
      // this.subscribe['trades'] = this.symbols
      this.symbols = symbols;
      this.subscribe['trades'] = this.symbols;
      if (message === 'authenticated') {
        this.alpacaSocket.send(JSON.stringify(this.subscribe));
      }
      // tslint:disable-next-line:forin
      for (const key in this.respData) {
        for (const i in this.data) {
          // CHECK BACK HERE IF PRICES ARE REFRESHED INSIDE SHARES LIST
          if (this.data[i].symbol === this.respData[key]['S']) {
            this.data[i].lastPrice = this.respData[key]['p'];
          }
        }
        console.log(this.respData[key]['S'] + ' price is ' + this.respData[key]['p']);
      }
    };
  }

  closeSocket(): void {
    console.log('closed Connection');
    this.alpacaSocket.close();
  }

  pagi(): void {
    this.data = this.searchService.res;
  }

  onInput(term: string): void {
    this.filterAssets.next(term);
  }
}


// Last three -> FA MAQCU PSNL
