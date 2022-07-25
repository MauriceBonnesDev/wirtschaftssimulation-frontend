import {Component, Input, OnInit, ViewChild} from '@angular/core';

import {ChartComponent, ApexNonAxisChartSeries, ApexChart, ApexResponsive} from 'ng-apexcharts';
import {Stock} from '../../../interfaces/stock';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};

@Component({
  selector: 'app-portfolio-pie-chart',
  templateUrl: './portfolio-pie-chart.component.html',
  styleUrls: ['./portfolio-pie-chart.component.scss']
})
export class PortfolioPieChartComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent;
  @Input() stocks: Stock[] = [];
  stockLabels = [];
  stockAmounts = [];
  public chartOptions: Partial<ChartOptions>;

  constructor() {
    console.log('Constructor');
    this.chartOptions = {
      series: this.stockAmounts,
      chart: {
        width: 380,
        type: 'pie',
        foreColor: '#f3f5f7',
      },
      labels: this.stockLabels,
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'top'
            },

          }
        }
      ]
    };
  }



  ngOnInit(): void {
    for (const stock of this.stocks) {
      this.stockLabels.push(stock.symbol);
      this.stockAmounts.push(stock.quantity);
    }
    console.log(this.stockLabels);
    console.log(this.stockAmounts);
  }

}
