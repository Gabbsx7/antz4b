// Utilitários de formatação

export function formatCurrency(value: number, currency = 'BRL'): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
  }).format(value);
}

export function formatPercent(value: number, decimals = 1): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatNumber(value: number, decimals = 0): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('pt-BR').format(d);
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(d);
}

export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 60) return 'agora há pouco';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}min atrás`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h atrás`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d atrás`;
  
  return formatDate(d);
}

export function formatKPI(value: number, fmt: 'currency' | 'percent' | 'number' = 'number'): string {
  switch (fmt) {
    case 'currency':
      return formatCurrency(value);
    case 'percent':
      return formatPercent(value);
    default:
      return formatNumber(value);
  }
}

export function formatDelta(delta: number, fmt: 'currency' | 'percent' | 'number' = 'percent'): string {
  const sign = delta >= 0 ? '+' : '';
  switch (fmt) {
    case 'currency':
      return `${sign}${formatCurrency(delta)}`;
    case 'percent':
      return `${sign}${formatPercent(delta)}`;
    default:
      return `${sign}${formatNumber(delta)}`;
  }
}

export function getDeltaColor(delta: number): string {
  if (delta > 0) return 'text-emerald-600 dark:text-emerald-400';
  if (delta < 0) return 'text-rose-600 dark:text-rose-400';
  return 'text-slate-600 dark:text-slate-400';
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'active':
    case 'connected':
    case 'paid':
    case 'running':
      return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950';
    case 'warning':
    case 'syncing':
    case 'pending':
      return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950';
    case 'error':
    case 'overdue':
    case 'stopped':
      return 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950';
    default:
      return 'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950';
  }
}
