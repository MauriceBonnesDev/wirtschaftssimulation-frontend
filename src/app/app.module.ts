import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';

registerLocaleData(localeDe, 'de-DE', localeDeExtra);

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PortfolioHeadingComponent } from './components/portfolio/portfolio-heading/portfolio-heading.component';
import { PortfolioInvestmentsComponent } from './components/portfolio/portfolio-investments/portfolio-investments.component';
import { MenuBarComponent } from './components/menu-bar/menu-bar.component';
import { PortfolioComponent } from './components/portfolio/portfolio.component';
import { SharesListComponent } from './components/search/shares-list/shares-list.component';
import { SearchComponent } from './components/search/search.component';
import { SearchbarComponent } from './components/search/searchbar/searchbar.component';
import { RecommendationsComponent } from './components/recommendations/recommendations.component';
import { PortfolioChartComponent } from './components/portfolio/portfolio-chart/portfolio-chart.component';
import { StockComponent } from './components/stock/stock.component';
import { StockChartComponent } from './components/stock/stock-chart/stock-chart.component';
import { StockOverviewComponent } from './components/stock/stock-overview/stock-overview.component';
import { RecommendationsHeadingComponent } from './components/recommendations/recommendations-heading/recommendations-heading.component';
import { PortfolioPieChartComponent } from './components/portfolio/portfolio-pie-chart/portfolio-pie-chart.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { FooterComponent } from './components/footer/footer.component';
import { LoadingIndicatorComponent } from './loading-indicator/loading-indicator.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    PortfolioHeadingComponent,
    PortfolioInvestmentsComponent,
    MenuBarComponent,
    PortfolioComponent,
    SharesListComponent,
    SearchComponent,
    SearchbarComponent,
    RecommendationsComponent,
    PortfolioChartComponent,
    StockComponent,
    StockChartComponent,
    StockOverviewComponent,
    RecommendationsHeadingComponent,
    PortfolioPieChartComponent,
    FooterComponent,
    LoadingIndicatorComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    NgApexchartsModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
