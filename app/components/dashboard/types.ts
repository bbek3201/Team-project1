export type Transaction = {
  id: number;
  name: string;
  avatar: string;
  socialURL: string;
  amount: number;
  message: string;
  createdAt: string;
};

export type DashboardData = {
  user: { name: string; avatar: string; username: string };
  earnings: number;
  transactions: Transaction[];
};

export const RANGE_LABELS: Record<string, string> = {
  "30": "Last 30 days",
  "90": "Last 90 days",
  all: "All time",
};

export const AMOUNT_OPTIONS = [1, 2, 5, 10];
