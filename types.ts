
export type TransactionType = 'cash-in' | 'cash-out';

export interface Transaction {
  id: string;
  personName: string;
  amount: number;
  type: TransactionType;
  date: string;
  category: string;
}

export interface SummaryStats {
  totalBalance: number;
  totalSavings: number;
  totalVolume: number;
  totalCashIn: number;
  totalCashOut: number;
}
