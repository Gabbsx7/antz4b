'use client';

import { useState } from 'react';
import { Calculator, Save, RotateCcw, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { LineChart } from '@/components/charts/LineChart';
import { formatCurrency, formatPercent } from '@/lib/format';
import { toast } from 'sonner';

export default function SimulatorPage() {
  const [params, setParams] = useState({
    price: 100,
    volume: 1000,
    cac: 150,
    churn: 0.05,
    rate: 0.12,
    fx: 5.2,
    costs: 65,
  });

  const calculateMetrics = () => {
    const revenue = params.price * params.volume;
    const totalCosts = params.costs * params.volume;
    const grossMargin = revenue - totalCosts;
    const marginPct = grossMargin / revenue;
    const ltv = (params.price * 12) / params.churn;
    const ltvCacRatio = ltv / params.cac;
    const monthlyRevenue = revenue;
    const adjustedRevenue = monthlyRevenue * (1 - params.rate * 0.1) * params.fx / 5.2;

    return {
      revenue: adjustedRevenue,
      grossMargin,
      marginPct,
      ltv,
      ltvCacRatio,
      totalCosts,
    };
  };

  const metrics = calculateMetrics();

  const generateChartData = () => {
    const data = [];
    for (let i = 1; i <= 12; i++) {
      const growth = 1 + (i * 0.02); // 2% growth per month
      data.push({
        month: `${i}/25`,
        revenue: metrics.revenue * growth,
        margin: metrics.grossMargin * growth,
        costs: metrics.totalCosts * growth,
      });
    }
    return data;
  };

  const chartData = generateChartData();

  const handleSaveScenario = () => {
    toast.success('Cenário salvo com sucesso!');
  };

  const handleReset = () => {
    setParams({
      price: 100,
      volume: 1000,
      cac: 150,
      churn: 0.05,
      rate: 0.12,
      fx: 5.2,
      costs: 65,
    });
    toast.info('Parâmetros resetados');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Simulador de Cenários</h2>
          <p className="text-muted-foreground">Simule diferentes cenários financeiros em tempo real</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleSaveScenario}>
            <Save className="h-4 w-4 mr-2" />
            Salvar Cenário
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Controles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Parâmetros de Simulação
            </CardTitle>
            <CardDescription>Ajuste os valores para ver o impacto em tempo real</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-sm font-medium">
                Preço Médio: {formatCurrency(params.price)}
              </Label>
              <Slider
                value={[params.price]}
                onValueChange={([value]) => setParams(prev => ({ ...prev, price: value }))}
                max={200}
                min={50}
                step={5}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">R$ 50 - R$ 200</p>
            </div>

            <div>
              <Label className="text-sm font-medium">
                Volume Mensal: {params.volume.toLocaleString()} unidades
              </Label>
              <Slider
                value={[params.volume]}
                onValueChange={([value]) => setParams(prev => ({ ...prev, volume: value }))}
                max={2000}
                min={500}
                step={50}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">500 - 2.000 unidades</p>
            </div>

            <div>
              <Label className="text-sm font-medium">
                Custo Unitário: {formatCurrency(params.costs)}
              </Label>
              <Slider
                value={[params.costs]}
                onValueChange={([value]) => setParams(prev => ({ ...prev, costs: value }))}
                max={120}
                min={30}
                step={5}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">R$ 30 - R$ 120</p>
            </div>

            <div>
              <Label className="text-sm font-medium">
                CAC (Custo de Aquisição): {formatCurrency(params.cac)}
              </Label>
              <Slider
                value={[params.cac]}
                onValueChange={([value]) => setParams(prev => ({ ...prev, cac: value }))}
                max={300}
                min={100}
                step={10}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">R$ 100 - R$ 300</p>
            </div>

            <div>
              <Label className="text-sm font-medium">
                Churn Rate: {formatPercent(params.churn)}
              </Label>
              <Slider
                value={[params.churn]}
                onValueChange={([value]) => setParams(prev => ({ ...prev, churn: value }))}
                max={0.15}
                min={0.01}
                step={0.01}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">1% - 15% ao mês</p>
            </div>

            <div>
              <Label className="text-sm font-medium">
                Taxa de Juros: {formatPercent(params.rate)}
              </Label>
              <Slider
                value={[params.rate]}
                onValueChange={([value]) => setParams(prev => ({ ...prev, rate: value }))}
                max={0.25}
                min={0.05}
                step={0.01}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">5% - 25% ao ano</p>
            </div>

            <div>
              <Label className="text-sm font-medium">
                Câmbio USD/BRL: R$ {params.fx.toFixed(2)}
              </Label>
              <Slider
                value={[params.fx]}
                onValueChange={([value]) => setParams(prev => ({ ...prev, fx: value }))}
                max={6.0}
                min={4.5}
                step={0.1}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">R$ 4,50 - R$ 6,00</p>
            </div>
          </CardContent>
        </Card>

        {/* Resultados */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Resultados da Simulação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Receita Mensal</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {formatCurrency(metrics.revenue)}
                  </p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Margem Bruta</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatCurrency(metrics.grossMargin)}
                  </p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Margem %</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {formatPercent(metrics.marginPct)}
                  </p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">LTV/CAC</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {metrics.ltvCacRatio.toFixed(1)}x
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Análise Rápida</h4>
                <div className="space-y-1 text-sm">
                  <p className={metrics.marginPct > 0.4 ? 'text-emerald-600' : metrics.marginPct > 0.25 ? 'text-amber-600' : 'text-rose-600'}>
                    • Margem {metrics.marginPct > 0.4 ? 'excelente' : metrics.marginPct > 0.25 ? 'adequada' : 'baixa'} ({formatPercent(metrics.marginPct)})
                  </p>
                  <p className={metrics.ltvCacRatio > 3 ? 'text-emerald-600' : metrics.ltvCacRatio > 2 ? 'text-amber-600' : 'text-rose-600'}>
                    • LTV/CAC {metrics.ltvCacRatio > 3 ? 'saudável' : metrics.ltvCacRatio > 2 ? 'aceitável' : 'crítico'} ({metrics.ltvCacRatio.toFixed(1)}x)
                  </p>
                  <p className={params.churn < 0.05 ? 'text-emerald-600' : params.churn < 0.08 ? 'text-amber-600' : 'text-rose-600'}>
                    • Churn {params.churn < 0.05 ? 'baixo' : params.churn < 0.08 ? 'moderado' : 'alto'} ({formatPercent(params.churn)})
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <LineChart
            title="Projeção 12 Meses"
            description="Evolução baseada nos parâmetros atuais"
            data={chartData}
            lines={[
              { dataKey: 'revenue', name: 'Receita', color: '#10b981' },
              { dataKey: 'margin', name: 'Margem', color: '#3b82f6' },
              { dataKey: 'costs', name: 'Custos', color: '#ef4444' },
            ]}
            height={250}
          />
        </div>
      </div>

      {/* Cenários Pré-definidos */}
      <Card>
        <CardHeader>
          <CardTitle>Cenários Pré-definidos</CardTitle>
          <CardDescription>Compare com cenários de referência</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
              <h4 className="font-medium text-emerald-600">Cenário Conservador</h4>
              <p className="text-sm text-muted-foreground mt-1">Preço baixo, volume alto, margem segura</p>
              <div className="mt-3 space-y-1 text-xs">
                <p>• Preço: R$ 80 | Volume: 1.500</p>
                <p>• Margem: 30% | Churn: 3%</p>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
              <h4 className="font-medium text-blue-600">Cenário Equilibrado</h4>
              <p className="text-sm text-muted-foreground mt-1">Balance entre preço e volume</p>
              <div className="mt-3 space-y-1 text-xs">
                <p>• Preço: R$ 100 | Volume: 1.000</p>
                <p>• Margem: 35% | Churn: 5%</p>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
              <h4 className="font-medium text-purple-600">Cenário Agressivo</h4>
              <p className="text-sm text-muted-foreground mt-1">Preço premium, foco em margem</p>
              <div className="mt-3 space-y-1 text-xs">
                <p>• Preço: R$ 150 | Volume: 700</p>
                <p>• Margem: 45% | Churn: 7%</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
