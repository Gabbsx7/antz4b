'use client';

import { useEffect, useState, Suspense, lazy } from 'react';
import { Calendar, Building2, DollarSign, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { KpiCard } from '@/components/charts/KpiCard';
import { Badge } from '@/components/ui/badge';
import { CardLoading } from '@/components/ui/loading';
import { useAppStore } from '@/lib/store';
import { fetchKPIs, fetchChartData } from '@/lib/mocks';
import { formatRelativeTime } from '@/lib/format';
import type { KPI, AgentEvent } from '@/lib/types';

// Lazy load dos componentes de gráficos para melhor performance
const LineChart = lazy(() => 
  import('@/components/charts/LineChart').then(module => ({ default: module.LineChart }))
);
const BarChart = lazy(() => 
  import('@/components/charts/BarChart').then(module => ({ default: module.BarChart }))
);
const DonutChart = lazy(() => 
  import('@/components/charts/DonutChart').then(module => ({ default: module.DonutChart }))
);

export default function OverviewPage() {
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [marginData, setMarginData] = useState<any[]>([]);
  const [receivablesData, setReceivablesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBU, setSelectedBU] = useState('all');
  const [selectedCurrency, setSelectedCurrency] = useState('BRL');
  
  const { agentEvents } = useAppStore();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [kpisData, revenueChartData, marginChartData, receivablesChartData] = await Promise.all([
          fetchKPIs(),
          fetchChartData('revenue'),
          fetchChartData('margin'),
          fetchChartData('receivables'),
        ]);

        setKpis(kpisData);
        setRevenueData(revenueChartData);
        setMarginData(marginChartData);
        setReceivablesData(receivablesChartData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedBU, selectedCurrency]);

  const recentEvents = agentEvents
    .filter(event => event.status === 'open')
    .slice(0, 3);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Overview</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(6)].map((_, i) => (
            <CardLoading key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-4">
        <div>
          <h1 className="text-3xl font-bold">Overview</h1>
          <p className="text-muted-foreground">
            Visão geral dos principais indicadores da organização
          </p>
        </div>
        
        <div className="flex items-center gap-2 md:gap-3">
          <Select value={selectedBU} onValueChange={setSelectedBU}>
            <SelectTrigger className="w-[160px] md:w-[180px]">
              <Building2 className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Unidade de Negócio" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Unidades</SelectItem>
              <SelectItem value="sul">BU Sul</SelectItem>
              <SelectItem value="sudeste">BU Sudeste</SelectItem>
              <SelectItem value="nordeste">BU Nordeste</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
            <SelectTrigger className="w-[100px] md:w-[120px]">
              <DollarSign className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BRL">BRL</SelectItem>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" className="shrink-0">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.id} kpi={kpi} />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Suspense fallback={<CardLoading />}>
          <LineChart
            title="Receita vs Forecast"
            description="Comparação entre receita realizada e projetada"
            data={revenueData}
            lines={[
              { dataKey: 'real', name: 'Realizado', color: '#10b981' },
              { dataKey: 'forecast', name: 'Forecast', color: '#f59e0b' },
            ]}
          />
        </Suspense>

        <Suspense fallback={<CardLoading />}>
          <BarChart
            title="Margem por Produto"
            description="Margem bruta por categoria de produto"
            data={marginData}
            dataKey="margin"
            nameKey="name"
            color="#3b82f6"
          />
        </Suspense>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Suspense fallback={<CardLoading />}>
            <DonutChart
              title="Composição de Recebíveis"
              description="Distribuição por faixa de vencimento"
              data={receivablesData}
              dataKey="value"
              nameKey="name"
              formatter={(value) => `${value}%`}
            />
          </Suspense>
        </div>

        {/* Agent Snapshot */}
        <Card className="h-fit">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></div>
              Antz Agent
            </CardTitle>
            <CardDescription>Últimas recomendações proativas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentEvents.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <p className="text-sm">Nenhum alerta recente</p>
                <p className="text-xs mt-1">O Agent irá notificar sobre insights importantes</p>
              </div>
            ) : (
              recentEvents.map((event) => (
                <div key={event.id} className="space-y-2 p-3 rounded-lg bg-muted/30 border">
                  <div className="flex items-center justify-between">
                    <Badge 
                      variant={event.severity === 'high' ? 'destructive' : 
                              event.severity === 'medium' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {event.severity}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatRelativeTime(event.timestamp)}
                    </span>
                  </div>
                  <h4 className="font-medium text-sm leading-tight">{event.title}</h4>
                  {event.body && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {event.body}
                    </p>
                  )}
                  {event.cta && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full text-xs h-8"
                      onClick={() => window.location.href = event.cta!.href}
                    >
                      {event.cta.label}
                    </Button>
                  )}
                </div>
              ))
            )}
            
            {recentEvents.length > 0 && (
              <Button 
                variant="ghost" 
                className="w-full text-xs h-8 mt-3"
                onClick={() => useAppStore.getState().setAgentPanelOpen(true)}
              >
                Ver todos os alertas
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Ações Rápidas</CardTitle>
          <CardDescription>Acesso direto às funcionalidades mais utilizadas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="justify-start h-10" asChild>
              <a href="/colony/simulator">
                <Calendar className="h-4 w-4 mr-2" />
                Simular Cenário
              </a>
            </Button>
            <Button variant="outline" className="justify-start h-10" asChild>
              <a href="/colony/cashflow">
                <DollarSign className="h-4 w-4 mr-2" />
                Ver Fluxo de Caixa
              </a>
            </Button>
            <Button variant="outline" className="justify-start h-10" asChild>
              <a href="/colony/ap-ar">
                <Filter className="h-4 w-4 mr-2" />
                Contas em Atraso
              </a>
            </Button>
            <Button variant="outline" className="justify-start h-10" asChild>
              <a href="/colony/ir">
                <Building2 className="h-4 w-4 mr-2" />
                Relatório IR
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}