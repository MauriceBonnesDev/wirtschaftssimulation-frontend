export interface Stock {
  id?: number;
  symbol: string;
  timestamp?: Date;
  purchasePrice?: number;
  quantity?: number;
  name?: string;
  currentPrice?: number;
}
