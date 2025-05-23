import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format currency values
export function formatCurrency(value: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

// Format percentage values
export function formatPercentage(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
}

// Format dates
export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

// Get color for signal type
export function getSignalColor(type: 'BUY' | 'SELL' | 'HOLD'): string {
  switch (type) {
    case 'BUY':
      return 'text-green-600 bg-green-100';
    case 'SELL':
      return 'text-red-600 bg-red-100';
    case 'HOLD':
      return 'text-yellow-600 bg-yellow-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
}

// Get color for market state
export function getMarketStateColor(state: string): string {
  switch (state) {
    case 'BULL':
      return 'text-green-600';
    case 'BEAR':
      return 'text-red-600';
    case 'VOLATILE':
      return 'text-orange-600';
    default:
      return 'text-gray-600';
  }
}
