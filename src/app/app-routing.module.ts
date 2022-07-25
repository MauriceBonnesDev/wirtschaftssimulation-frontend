import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PortfolioComponent} from './components/portfolio/portfolio.component';
import {SearchComponent} from './components/search/search.component';
import {RecommendationsComponent} from './components/recommendations/recommendations.component';
import {StockComponent} from './components/stock/stock.component';

const routes: Routes = [
  { path: '', redirectTo: 'portfolio', pathMatch: 'full' },
  { path: 'portfolio', component: PortfolioComponent },
  { path: 'suche', component: SearchComponent },
  { path: 'empfehlungen', component: RecommendationsComponent },
  { path: 'aktie/:symbol', component: StockComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
