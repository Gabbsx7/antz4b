'use client';

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatKPI, formatDelta, getDeltaColor } from '@/lib/format';
import type { KPI } from '@/lib/types';

interface KpiCardProps {
  kpi: KPI;
}

export function KpiCard({ kpi }: KpiCardProps) {
  const deltaValue = kpi.deltaPct || 0;
  const isPositive = deltaValue > 0;
  const isNegative = deltaValue < 0;
  const isNeutral = deltaValue === 0;

  const TrendIcon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus;

  return (
    <Card className="relative overflow-hidden hover:shadow-md transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
        <CardTitle className="text-xs font-medium text-muted-foreground leading-tight line-clamp-2">
          {kpi.label}
        </CardTitle>
        {kpi.deltaPct !== undefined && (
          <TrendIcon className={`h-4 w-4 ${getDeltaColor(deltaValue)} shrink-0`} />
        )}
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="text-xl sm:text-2xl font-bold leading-tight mb-1">
          {formatKPI(kpi.value, kpi.fmt)}
        </div>
        {kpi.deltaPct !== undefined && (
          <div className={`text-xs ${getDeltaColor(deltaValue)} flex items-center gap-1`}>
            <span>
              {formatDelta(deltaValue, 'percent')}
            </span>
            <span className="text-muted-foreground">vs anterior</span>
          </div>
        )}
        {kpi.unit && (
          <p className="text-xs text-muted-foreground mt-1">
            {kpi.unit}
          </p>
        )}
      </CardContent>
      
      {/* Indicador visual de performance */}
      <div className={`absolute bottom-0 left-0 h-1 w-full transition-colors duration-200 ${
        isPositive ? 'bg-emerald-500' : 
        isNegative ? 'bg-rose-500' : 
        'bg-slate-300 dark:bg-slate-600'
      }`} />
    </Card>
  );
}
