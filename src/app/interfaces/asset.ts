export interface Asset {
  class: string;
  easy_to_borrow: boolean;
  exchange: string;
  fractionable: boolean;
  id: string;
  marginable: boolean;
  name: string;
  shortable: boolean;
  status: string;
  symbol: string;
  tradable: boolean;
  // my own attributes
  lastPrice?: number;
}
