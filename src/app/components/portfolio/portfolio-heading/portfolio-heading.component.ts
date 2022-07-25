import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-portfolio-heading',
  templateUrl: './portfolio-heading.component.html',
  styleUrls: ['./portfolio-heading.component.scss']
})
export class PortfolioHeadingComponent implements OnInit {

  @Input() budget: number;
  constructor() { }

  ngOnInit(): void {
  }

}
