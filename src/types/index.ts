export interface Person {
  id: string;
  name: string;
}

export interface Expense {
  id: string;
  payerId: string;
  amount: number;
  description: string;
  date: string;
}

export interface Balance {
  personId: string;
  name: string;
  paid: number;      // Total amount paid by this person
  shouldPay: number; // Amount this person should have paid (equal share)
  netBalance: number; // Positive if owed money, negative if owes money
}

export interface Settlement {
  from: string;
  to: string;
  amount: number;
} 