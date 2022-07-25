import { Trade } from './trade';

export interface Trades {
  trades: Trade[];
  symbol: string;
  next_page_token: string;
}
