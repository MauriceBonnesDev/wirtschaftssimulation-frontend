import { Stock } from './stock';

export interface Portfolio {
  budget: number;
  stocks: Stock[];
}
