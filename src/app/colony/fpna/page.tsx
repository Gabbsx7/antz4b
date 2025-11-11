'use client';

import { useState, useEffect, memo, useCallback, Suspense, lazy } from 'react';
import { Plus, Play, FileText, TrendingUp, Calculator } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { CardLoading } from '@/components/ui/loading';
import { fetchScenarios } from '@/lib/mocks';
import { formatCurrency, formatPercent } from '@/lib/format';
import { useAppStore } from '@/lib/store';
import { toast } from 'sonner';
import type { Scenario } from '@/lib/types';

// Lazy load do componente de gráfico para melhor performance
const LineChart = lazy(() => 
  import('@/components/charts/LineChart').then(module => ({ default: module.LineChart }))
);

interface SimulationParams {
  price: number;
  volume: number;
  cac: number;
  churn: number;
  rate: number;
  fx: number;
}

interface Projections {
  revenue: number;
  margin: number;
  marginPct: number;
}

// Memoizar o cálculo das projeções
const calculateProjections = (params: SimulationParams): Projections => {
  const revenue = params.price * params.volume;
  const margin = revenue * 0.35; // Margem base de 35%
  const adjustedMargin = margin * (1 - params.churn) * (1 - params.rate * 0.1);
  
  return {
    revenue,
    margin: adjustedMargin,
    marginPct: adjustedMargin / revenue,
  };
};

// Componente memoizado para os cards de cenário
const ScenarioCard = memo(function ScenarioCard({ 
  scenario, 
  onExecute, 
  onAnalyze 
}: { 
  scenario: Scenario;
  onExecute: (scenario: Scenario) => void;
  onAnalyze: (scenario: Scenario) => void;
}) {
  const handleExecute = useCallback(() => onExecute(scenario), [scenario, onExecute]);
  const handleAnalyze = useCallback(() => onAnalyze(scenario), [scenario, onAnalyze]);

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{scenario.name}</CardTitle>
          <Badge variant={scenario.status === 'active' ? 'default' : scenario.status === 'draft' ? 'secondary' : 'outline'}>
            {scenario.status}
          </Badge>
        </div>
        <CardDescription>
          Criado em {new Date(scenario.createdAt).toLocaleDateString('pt-BR')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-muted-foreground">Receita:</span>
            <p className="font-medium">{formatCurrency(scenario.revenue)}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Margem:</span>
            <p className="font-medium">{formatPercent(scenario.marginPct)}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Volume:</span>
            <p className="font-medium">{scenario.volume.toLocaleString()}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Churn:</span>
            <p className="font-medium">{formatPercent(scenario.churn)}</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1" onClick={handleExecute}>
            <Play className="h-3 w-3 mr-1" />
            Executar
          </Button>
          <Button size="sm" variant="ghost" className="flex-1" onClick={handleAnalyze}>
            <TrendingUp className="h-3 w-3 mr-1" />
            Analisar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

// Componente memoizado para o simulador
const ScenarioSimulator = memo(function ScenarioSimulator({
  params,
  projections,
  onParamChange,
  onSave,
  onCancel
}: {
  params: SimulationParams;
  projections: Projections;
  onParamChange: (key: keyof SimulationParams, value: number) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  const handleSliderChange = useCallback((key: keyof SimulationParams) => 
    ([value]: number[]) => onParamChange(key, value), 
    [onParamChange]
  );

  return (
    <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
      <div className="space-y-4 md:space-y-6">
        <div className="space-y-3 md:space-y-4">
          <div>
            <Label>Preço Médio: {formatCurrency(params.price)}</Label>
            <Slider
              value={[params.price]}
              onValueChange={handleSliderChange('price')}
              max={200}
              min={50}
              step={5}
              className="mt-2"
            />
          </div>
          
          <div>
            <Label>Volume: {params.volume.toLocaleString()} unidades</Label>
            <Slider
              value={[params.volume]}
              onValueChange={handleSliderChange('volume')}
              max={2000}
              min={500}
              step={50}
              className="mt-2"
            />
          </div>
          
          <div>
            <Label>CAC: {formatCurrency(params.cac)}</Label>
            <Slider
              value={[params.cac]}
              onValueChange={handleSliderChange('cac')}
              max={300}
              min={100}
              step={10}
              className="mt-2"
            />
          </div>
          
          <div>
            <Label>Churn: {formatPercent(params.churn)}</Label>
            <Slider
              value={[params.churn]}
              onValueChange={handleSliderChange('churn')}
              max={0.15}
              min={0.01}
              step={0.01}
              className="mt-2"
            />
          </div>
          
          <div>
            <Label>Taxa de Juros: {formatPercent(params.rate)}</Label>
            <Slider
              value={[params.rate]}
              onValueChange={handleSliderChange('rate')}
              max={0.25}
              min={0.05}
              step={0.01}
              className="mt-2"
            />
          </div>
          
          <div>
            <Label>Câmbio USD/BRL: R$ {params.fx.toFixed(2)}</Label>
            <Slider
              value={[params.fx]}
              onValueChange={handleSliderChange('fx')}
              max={6.0}
              min={4.5}
              step={0.1}
              className="mt-2"
            />
          </div>
        </div>
        
        <div className="flex gap-2 pt-2">
          <Button onClick={onSave} className="flex-1">
            Salvar Cenário
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </div>
      
      <div className="space-y-3 md:space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Projeções</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 md:space-y-4">
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Receita</p>
                <p className="text-2xl font-bold">{formatCurrency(projections.revenue)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Margem</p>
                <p className="text-2xl font-bold">{formatCurrency(projections.margin)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Margem %</p>
                <p className="text-2xl font-bold">{formatPercent(projections.marginPct)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">LTV/CAC</p>
                <p className="text-2xl font-bold">{(projections.revenue / params.cac / 12).toFixed(1)}x</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Suspense fallback={<CardLoading />}>
          <LineChart
            title="Projeção de Receita"
            data={[
              { month: 'Jan', value: projections.revenue * 0.8 },
              { month: 'Fev', value: projections.revenue * 0.9 },
              { month: 'Mar', value: projections.revenue },
              { month: 'Abr', value: projections.revenue * 1.1 },
              { month: 'Mai', value: projections.revenue * 1.2 },
              { month: 'Jun', value: projections.revenue * 1.15 },
            ]}
            lines={[{ dataKey: 'value', name: 'Receita Projetada', color: '#10b981' }]}
            height={200}
          />
        </Suspense>
      </div>
    </div>
  );
});

export default function FPAPage() {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState(true);
  const [simulatorOpen, setSimulatorOpen] = useState(false);
  const [simulationParams, setSimulationParams] = useState<SimulationParams>({
    price: 100,
    volume: 1000,
    cac: 150,
    churn: 0.05,
    rate: 0.12,
    fx: 5.2,
  });

  const { addAgentMessage } = useAppStore();

  // Memoizar as projeções
  const projections = calculateProjections(simulationParams);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchScenarios();
        setScenarios(data);
      } catch (error) {
        console.error('Erro ao carregar cenários:', error);
        toast.error('Erro ao carregar cenários');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleGenerateBriefing = useCallback(() => {
    const message = `Gerar briefing executivo com base nos cenários atuais`;
    addAgentMessage({
      id: `fpna-${Date.now()}`,
      type: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    });
    
    toast.success('Solicitação enviada ao Antz Agent');
  }, [addAgentMessage]);

  const handleSaveScenario = useCallback(() => {
    const newScenario: Scenario = {
      id: `sc-${Date.now()}`,
      name: `Cenário Simulado ${new Date().toLocaleDateString()}`,
      ...simulationParams,
      ...projections,
      createdAt: new Date().toISOString(),
      status: 'draft',
    };

    setScenarios(prev => [newScenario, ...prev]);
    setSimulatorOpen(false);
    toast.success('Cenário salvo com sucesso');
  }, [simulationParams, projections]);

  const handleParamChange = useCallback((key: keyof SimulationParams, value: number) => {
    setSimulationParams(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleExecuteScenario = useCallback((scenario: Scenario) => {
    toast.info(`Executando cenário: ${scenario.name}`);
  }, []);

  const handleAnalyzeScenario = useCallback((scenario: Scenario) => {
    toast.info(`Analisando cenário: ${scenario.name}`);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <CardLoading key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">FP&A</h2>
          <p className="text-muted-foreground">Planejamento Financeiro e Análise</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={simulatorOpen} onOpenChange={setSimulatorOpen}>
            <DialogTrigger asChild>
              <Button>
                <Calculator className="h-4 w-4 mr-2" />
                Simular Cenário
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Simulador de Cenários</DialogTitle>
                <DialogDescription>
                  Ajuste os parâmetros para simular diferentes cenários financeiros
                </DialogDescription>
              </DialogHeader>
              
              <ScenarioSimulator
                params={simulationParams}
                projections={projections}
                onParamChange={handleParamChange}
                onSave={handleSaveScenario}
                onCancel={() => setSimulatorOpen(false)}
              />
            </DialogContent>
          </Dialog>
          
          <Button variant="outline" onClick={handleGenerateBriefing}>
            <FileText className="h-4 w-4 mr-2" />
            Gerar Briefing
          </Button>
        </div>
      </div>

      <Tabs defaultValue="scenarios" className="space-y-4">
        <TabsList>
          <TabsTrigger value="scenarios">Cenários</TabsTrigger>
          <TabsTrigger value="budget">Orçamento</TabsTrigger>
          <TabsTrigger value="variance">Variações</TabsTrigger>
        </TabsList>

        <TabsContent value="scenarios" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {scenarios.map((scenario) => (
              <ScenarioCard
                key={scenario.id}
                scenario={scenario}
                onExecute={handleExecuteScenario}
                onAnalyze={handleAnalyzeScenario}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="budget" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Orçamento Anual 2025</CardTitle>
              <CardDescription>Planejamento orçamentário por categoria</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Módulo de orçamento em desenvolvimento</p>
                <p className="text-sm">Funcionalidade completa disponível em breve</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="variance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Variações</CardTitle>
              <CardDescription>Real vs Orçado - Análise de desvios</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Análise de variações em desenvolvimento</p>
                <p className="text-sm">Dashboard de variações disponível em breve</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
