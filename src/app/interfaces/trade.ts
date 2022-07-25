// This interface contains the details of one trade, such as the time of the trade,
// trade price, trade size and trade exchange.
export interface Trade {
  t: string;    // timestamp
  x: string;    // Exchange where the trade happened
  p: number;    // Trade price
  s: number;    // Trade size
  c: string[];  // Trade conditions
  i: number;    // Trade ID
  z: string;    // Tape
}
