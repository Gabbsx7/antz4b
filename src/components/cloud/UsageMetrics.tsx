'use client';

import { HardDrive, Cpu, TrendingUp, Zap, Activity, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/format';
import type { CloudUsage } from '@/lib/types';

interface UsageMetricsProps {
  usage: CloudUsage;
  billing?: {
    currentMonth: number;
    projectedMonth: number;
    currency: string;
  };
}

export function UsageMetrics({ usage, billing }: UsageMetricsProps) {
  const storagePercentage = (usage.storage.used / usage.storage.total) * 100;
  const computePercentage = (usage.compute.used / usage.compute.total) * 100;
  const bandwidthPercentage = (usage.bandwidth.used / usage.bandwidth.total) * 100;

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-rose-500';
    if (percentage >= 75) return 'text-amber-500';
    return 'text-emerald-500';
  };

  const getUsageStatus = (percentage: number) => {
    if (percentage >= 90) return { label: 'Crítico', variant: 'destructive' as const };
    if (percentage >= 75) return { label: 'Atenção', variant: 'default' as const };
    return { label: 'Normal', variant: 'secondary' as const };
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Storage Usage */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Armazenamento</CardTitle>
          <HardDrive className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {usage.storage.used} / {usage.storage.total} {usage.storage.unit}
          </div>
          <Progress value={storagePercentage} className="mt-2" />
          <div className="flex items-center justify-between mt-2">
            <p className={`text-xs font-medium ${getUsageColor(storagePercentage)}`}>
              {storagePercentage.toFixed(1)}% utilizado
            </p>
            <Badge variant={getUsageStatus(storagePercentage).variant} className="text-xs">
              {getUsageStatus(storagePercentage).label}
            </Badge>
          </div>
          <div className="mt-3 space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Arquivos</span>
              <span>{(usage.storage.used * 0.6).toFixed(1)} {usage.storage.unit}</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Databases</span>
              <span>{(usage.storage.used * 0.3).toFixed(1)} {usage.storage.unit}</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Backups</span>
              <span>{(usage.storage.used * 0.1).toFixed(1)} {usage.storage.unit}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compute Usage */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Computação</CardTitle>
          <Cpu className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {usage.compute.used} / {usage.compute.total} {usage.compute.unit}
          </div>
          <Progress value={computePercentage} className="mt-2" />
          <div className="flex items-center justify-between mt-2">
            <p className={`text-xs font-medium ${getUsageColor(computePercentage)}`}>
              {computePercentage.toFixed(1)}% utilizado
            </p>
            <Badge variant={getUsageStatus(computePercentage).variant} className="text-xs">
              {getUsageStatus(computePercentage).label}
            </Badge>
          </div>
          <div className="mt-3 space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>ML Workspaces</span>
              <span>{Math.round(usage.compute.used * 0.7)} horas</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Analytics</span>
              <span>{Math.round(usage.compute.used * 0.2)} horas</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Databases</span>
              <span>{Math.round(usage.compute.used * 0.1)} horas</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bandwidth Usage */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Banda</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {usage.bandwidth.used} / {usage.bandwidth.total} {usage.bandwidth.unit}
          </div>
          <Progress value={bandwidthPercentage} className="mt-2" />
          <div className="flex items-center justify-between mt-2">
            <p className={`text-xs font-medium ${getUsageColor(bandwidthPercentage)}`}>
              {bandwidthPercentage.toFixed(1)}% utilizado
            </p>
            <Badge variant={getUsageStatus(bandwidthPercentage).variant} className="text-xs">
              {getUsageStatus(bandwidthPercentage).label}
            </Badge>
          </div>
          <div className="mt-3 space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Download</span>
              <span>{(usage.bandwidth.used * 0.6).toFixed(1)} GB</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Upload</span>
              <span>{(usage.bandwidth.used * 0.3).toFixed(1)} GB</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>API Calls</span>
              <span>{(usage.bandwidth.used * 0.1).toFixed(1)} GB</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Billing Information */}
      {billing && (
        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faturamento</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(billing.currentMonth, billing.currency)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Mês atual
            </p>
            <div className="mt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Projeção mensal:</span>
                <span className="font-medium">
                  {formatCurrency(billing.projectedMonth, billing.currency)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Economia vs anterior:</span>
                <span className="font-medium text-emerald-500">
                  -12%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Metrics */}
      <Card className="md:col-span-2 lg:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Performance</CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Latência média</span>
              <span className="text-sm font-medium">45ms</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Uptime</span>
              <span className="text-sm font-medium text-emerald-500">99.9%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Workspaces ativos</span>
              <span className="text-sm font-medium">3</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Conexões DB</span>
              <span className="text-sm font-medium">28</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="md:col-span-2 lg:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Atividade Recente</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-emerald-500 rounded-full"></div>
              <span className="text-xs text-muted-foreground">
                Workspace ML iniciado
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
              <span className="text-xs text-muted-foreground">
                5 arquivos enviados
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-amber-500 rounded-full"></div>
              <span className="text-xs text-muted-foreground">
                Backup DB concluído
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
              <span className="text-xs text-muted-foreground">
                Modelo treinado
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
