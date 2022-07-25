import { Injectable } from '@angular/core';
import {Trade} from '../interfaces/trade';
import {Bar} from '../interfaces/bar';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  SOCKET_URL = 'wss://stream.data.alpaca.markets/v2/iex';
  API_KEY = 'PKIFNV6GOLXP3KMIOYGE';
  SECRET_KEY = 'zRempFxPrLX0leMRWv9YzbFW9a1oLloYLhcBgx0C';
  auth: object = { action: 'auth', key: this.API_KEY, secret: this.SECRET_KEY };
  alpacaSocket: WebSocket;
  data: object;
  symbols: string[] = [];
  subscribe: object = { action: 'subscribe', bars: ['AAPL'] };
  trades: Trade[] = [];
  constructor() {
  }

  connectSocket(): void {
    this.alpacaSocket = new WebSocket(this.SOCKET_URL);
    console.log(this.alpacaSocket);
  }

  onMessage(symbols?: string[]): Bar[] {
    console.log(symbols);
    const returnData = [];
    this.alpacaSocket.onmessage = event => {
      this.data = JSON.parse(event.data);
      const message = this.data[0]['msg'];
      if (message === 'connected') {
        this.alpacaSocket.send(JSON.stringify(this.auth));
      }
      // Zuletzt bei 5:04 in Part2 Grid Bot tutorial
      // ausprobieren, da maximal 30 verschiedene Symbole abgefragt werden, dass man den aktuellste Preis aus dem Trade entnimmt
      // this.subscribe['trades'] = this.symbols
      this.symbols = symbols;
      this.subscribe['bars'] = this.symbols;
      if (message === 'authenticated') {
        this.alpacaSocket.send(JSON.stringify(this.subscribe));
      }
      // tslint:disable-next-line:forin
      for (const key in this.data) {
        if (this.data[key]['T'] === 'b') {
          returnData.push(this.data[key]);
        }
      }
    };
    return returnData;
  }

  closeSocket(): void {
    console.log('closed Connection');
    this.alpacaSocket.close();
  }

  onBar(bar: any): void {
    console.log('got a bar');
    console.log(bar);
  }

  onTrade(trade: any): void {
    console.log('got a trade');
    console.log(trade);
  }
}
