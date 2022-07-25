import {Component, OnDestroy, OnInit} from '@angular/core';
import { Location } from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {WebsocketService} from '../../services/websocket.service';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})
export class StockComponent implements OnInit, OnDestroy {
  timeframe: string;
  symbol: string;
  currentPrice: number;
  constructor(private route: ActivatedRoute,
              private location: Location,
              private socketService: WebsocketService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(param => {
      // tslint:disable-next-line:forin
      for (const key in param) {
        this.symbol = param[key].symbol;
      }
      this.socketService.connectSocket();
      console.log(this.socketService.onMessage([this.symbol]));
    });
  }

  ngOnDestroy(): void {
    this.socketService.closeSocket();
  }

  goBack(): void {
    this.location.back();
  }

}
