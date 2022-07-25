import { Component, Input, OnInit } from '@angular/core';
import { CandlestickData, createChart, CrosshairMode, WhitespaceData } from 'lightweight-charts';
import { Observable, pipe } from 'rxjs';
import { StockService } from '../../../services/stock.service';
import { Bar } from '../../../interfaces/bar';
import { finalize, map } from 'rxjs/operators';
import { switchMap } from 'rxjs-compat/operator/switchMap';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-stock-chart',
  templateUrl: './stock-chart.component.html',
  styleUrls: ['./stock-chart.component.scss']
})
export class StockChartComponent implements OnInit {
  @Input() symbol = 'AAPL';
  candleSeries;
  chart;
  bars;
  @Input() timeframe = '1hour';
  data;

  // Websocket
  socket: WebSocket;
  SOCKET_URL = 'wss://stream.data.alpaca.markets/v2/iex';
  API_KEY = 'PKIFNV6GOLXP3KMIOYGE';
  SECRET_KEY = 'zRempFxPrLX0leMRWv9YzbFW9a1oLloYLhcBgx0C';
  auth: object = {action: 'auth', key: this.API_KEY, secret: this.SECRET_KEY};
  subscribe: object = {action: 'subscribe', bars: ['AAPL']};

  // API
  BASE_URL = 'https://data.alpaca.markets/v2/stocks';

  currentBar?: CandlestickData | WhitespaceData;
  trades;

  constructor(private stockService: StockService) {
  }

  ngOnInit(): void {
    this.socket = new WebSocket(this.SOCKET_URL);
    this.chart = createChart(document.getElementById('chart'), {
      width: 600,
      height: 300,
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      timeScale: {
        borderColor: '#cccccc',
        timeVisible: true
      }
    });

    this.socket.onmessage = event => {
      this.data = JSON.parse(event.data);
      const msg = this.data[0]['msg'];

      if (msg === 'connected') {
        this.socket.send(JSON.stringify(this.auth));
      }

      if (msg === 'authenticated') {
        this.socket.send(JSON.stringify(this.subscribe));
      }

      // tslint:disable-next-line:forin
      for (const key in this.data) {
        const type = this.data[key].T;
        if (type === 't') {
          this.trades.push(this.data[key].p);
          const open = this.trades[0];
          const high = Math.max(...this.trades);
          const low = Math.min(...this.trades);
          const close = this.trades[this.trades.length - 1];
          if (this.candleSeries && this.currentBar) {
            this.candleSeries.update({
              time: (this.currentBar.time.toString() + 60).toString(),
              open,
              low,
              high,
              close
            });
          }
        }
      }
    };

    this.candleSeries = this.chart.addCandlestickSeries();
    this.initHistoricalChartData(this.symbol, this.timeframe);
    // this.getBars();

  }
  // CHANGE MAP HERE
  // getBars(): void {
  //   this.stockService.getBarsAPI(this.symbol, '5Min').pipe(map(barsObj => ({
  //     open: barsObj['bars'].o
  //     })),
  //     finalize(this.candleSeries.setData(this.bars)))
  //     .subscribe(barsObj => {
  //     const bars = barsObj['bars'];
  //     this.bars = bars.map(bar => (
  //       {
  //         open: bar.o,
  //         close: bar.c,
  //         low: bar.l,
  //         high: bar.h
  //       }
  //     ));
  //   });
  // }

  initHistoricalChartData(symbol: string, timeframe: string): void {
    this.timeframe = timeframe;
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
    let chartData: any = null;
    fetch(`${ this.BASE_URL }/${ symbol }/bars?timeframe=${ timeframe }&start=${ start }&limit=10000`, {
      headers: {
        'APCA-API-KEY-ID': this.API_KEY,
        'APCA-API-SECRET-KEY': this.SECRET_KEY
      }
    }).then((r) => r.json()).then((response) => {
      console.log(response);
      if (response.bars) {
        chartData = response.bars.map((bar: any) => (
          {
            open: bar.o,
            high: bar.h,
            low: bar.l,
            close: bar.c,
            time: Date.parse(bar.t) / 1000
          }
        ));
        console.log(chartData);
        this.currentBar = chartData[chartData.length - 1];
        if (this.candleSeries) {
          this.candleSeries.setData(chartData);
        }
      }
    });
  }

}
