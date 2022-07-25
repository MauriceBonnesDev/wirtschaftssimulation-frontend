import {Component, Input, OnInit} from '@angular/core';
import {Stock} from '../../../interfaces/stock';

@Component({
  selector: 'app-portfolio-investments',
  templateUrl: './portfolio-investments.component.html',
  styleUrls: ['./portfolio-investments.component.scss']
})
export class PortfolioInvestmentsComponent implements OnInit {

  @Input() stocks: Stock[];
  constructor() { }

  ngOnInit(): void {
  }

}
