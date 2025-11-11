'use client';

import { useState, useEffect } from 'react';
import { Target, TrendingUp, Calendar, Users, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchKPIs, fetchOKRs } from '@/lib/mocks';
import { formatKPI, formatPercent } from '@/lib/format';
import type { KPI, OKR } from '@/lib/types';

export default function KPIsOKRsPage() {
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [okrs, setOkrs] = useState<OKR[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [kpisData, okrsData] = await Promise.all([
          fetchKPIs(),
          fetchOKRs(),
        ]);
        setKpis(kpisData);
        setOkrs(okrsData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-8 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">KPIs & OKRs</h2>
          <p className="text-muted-foreground">Indicadores-chave e objetivos estratégicos</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo OKR
        </Button>
      </div>

      <Tabs defaultValue="kpis" className="space-y-4">
        <TabsList>
          <TabsTrigger value="kpis">KPIs</TabsTrigger>
          <TabsTrigger value="okrs">OKRs</TabsTrigger>
        </TabsList>

        <TabsContent value="kpis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Biblioteca de KPIs</CardTitle>
              <CardDescription>Indicadores-chave de performance organizacional</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {kpis.map((kpi) => (
                  <Card key={kpi.id} className="relative">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {kpi.label}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold mb-2">
                        {formatKPI(kpi.value, kpi.fmt)}
                      </div>
                      {kpi.deltaPct !== undefined && (
                        <div className="flex items-center gap-2">
                          <Badge variant={kpi.deltaPct >= 0 ? 'default' : 'destructive'} className="text-xs">
                            {kpi.deltaPct >= 0 ? '+' : ''}{formatPercent(kpi.deltaPct)}
                          </Badge>
                          <span className="text-xs text-muted-foreground">vs período anterior</span>
                        </div>
                      )}
                      
                      {/* Indicador visual de performance */}
                      <div className={`absolute bottom-0 left-0 h-1 w-full ${
                        kpi.deltaPct && kpi.deltaPct > 0 ? 'bg-emerald-500' : 
                        kpi.deltaPct && kpi.deltaPct < 0 ? 'bg-rose-500' : 
                        'bg-slate-300'
                      }`} />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* KPIs por Categoria */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">KPIs Financeiros</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Revenue Growth Rate</span>
                  <div className="text-right">
                    <div className="font-bold text-emerald-600">+12%</div>
                    <div className="text-xs text-muted-foreground">MoM</div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Gross Margin</span>
                  <div className="text-right">
                    <div className="font-bold">41%</div>
                    <div className="text-xs text-rose-600">-2.1pp</div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Operating Cash Flow</span>
                  <div className="text-right">
                    <div className="font-bold">R$ 340k</div>
                    <div className="text-xs text-emerald-600">+8%</div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">EBITDA Margin</span>
                  <div className="text-right">
                    <div className="font-bold">18%</div>
                    <div className="text-xs text-muted-foreground">Estável</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">KPIs Operacionais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Customer Satisfaction</span>
                  <div className="text-right">
                    <div className="font-bold text-emerald-600">4.7/5</div>
                    <div className="text-xs text-emerald-600">+0.2</div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Employee Turnover</span>
                  <div className="text-right">
                    <div className="font-bold">8%</div>
                    <div className="text-xs text-emerald-600">-2pp</div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Time to Market</span>
                  <div className="text-right">
                    <div className="font-bold">45 dias</div>
                    <div className="text-xs text-emerald-600">-5 dias</div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">System Uptime</span>
                  <div className="text-right">
                    <div className="font-bold text-emerald-600">99.8%</div>
                    <div className="text-xs text-muted-foreground">Target: 99.5%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="okrs" className="space-y-4">
          <div className="space-y-6">
            {okrs.map((okr) => (
              <Card key={okr.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{okr.title}</CardTitle>
                      <CardDescription>{okr.description}</CardDescription>
                    </div>
                    <div className="text-right">
                      <Badge variant={okr.progress >= 70 ? 'default' : okr.progress >= 40 ? 'secondary' : 'destructive'}>
                        {okr.progress}% completo
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        Prazo: {new Date(okr.dueDate).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Progresso Geral</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {okr.progress}/{okr.target} {okr.unit}
                    </span>
                  </div>
                  <Progress value={okr.progress} className="h-2" />
                  
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Key Results</h4>
                    {okr.keyResults.map((kr) => (
                      <div key={kr.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">{kr.title}</span>
                          <span className="text-sm font-medium">
                            {kr.progress}/{kr.target} {kr.unit}
                          </span>
                        </div>
                        <Progress value={(kr.progress / kr.target) * 100} className="h-1" />
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Owner: {okr.owner}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {Math.ceil((new Date(okr.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} dias restantes
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* OKR Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resumo dos OKRs</CardTitle>
              <CardDescription>Performance geral dos objetivos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">
                    {okrs.filter(okr => okr.progress >= 70).length}
                  </div>
                  <p className="text-sm text-muted-foreground">No Prazo</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-600">
                    {okrs.filter(okr => okr.progress >= 40 && okr.progress < 70).length}
                  </div>
                  <p className="text-sm text-muted-foreground">Em Risco</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-rose-600">
                    {okrs.filter(okr => okr.progress < 40).length}
                  </div>
                  <p className="text-sm text-muted-foreground">Atrasados</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {Math.round(okrs.reduce((acc, okr) => acc + okr.progress, 0) / okrs.length)}%
                  </div>
                  <p className="text-sm text-muted-foreground">Progresso Médio</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
