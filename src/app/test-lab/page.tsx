'use client';

import { useState } from 'react';
import { TestTube, Play, RotateCcw, Download, Terminal, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

const sampleDatasets = [
  { id: 'customers', name: 'Customer Data', records: 1250, format: 'CSV' },
  { id: 'transactions', name: 'Transaction History', records: 45000, format: 'JSON' },
  { id: 'products', name: 'Product Catalog', records: 850, format: 'XML' },
  { id: 'financial', name: 'Financial Reports', records: 120, format: 'Excel' },
];

const sampleRecipes = [
  { id: 'etl-basic', name: 'Basic ETL Pipeline', description: 'Extract, Transform, Load básico' },
  { id: 'ml-scoring', name: 'ML Scoring Recipe', description: 'Aplicação de modelo de ML' },
  { id: 'data-quality', name: 'Data Quality Check', description: 'Validação de qualidade de dados' },
  { id: 'risk-analysis', name: 'Risk Analysis', description: 'Análise de risco automatizada' },
];

export default function TestLabPage() {
  const [selectedDataset, setSelectedDataset] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    '[2025-11-07 16:00:00] Test Lab inicializado',
    '[2025-11-07 16:00:01] Aguardando seleção de dataset e recipe...',
  ]);

  const handleRunTest = async () => {
    if (!selectedDataset || !selectedRecipe) {
      toast.error('Selecione um dataset e uma recipe');
      return;
    }

    setIsRunning(true);
    const dataset = sampleDatasets.find(d => d.id === selectedDataset);
    const recipe = sampleRecipes.find(r => r.id === selectedRecipe);

    // Simular execução com logs em tempo real
    const newLogs = [
      `[${new Date().toLocaleTimeString()}] Iniciando execução...`,
      `[${new Date().toLocaleTimeString()}] Dataset: ${dataset?.name} (${dataset?.records} registros)`,
      `[${new Date().toLocaleTimeString()}] Recipe: ${recipe?.name}`,
      `[${new Date().toLocaleTimeString()}] Carregando dados...`,
    ];

    for (const log of newLogs) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setLogs(prev => [...prev, log]);
    }

    // Simular processamento
    const processingLogs = [
      `[${new Date().toLocaleTimeString()}] Validando schema de entrada...`,
      `[${new Date().toLocaleTimeString()}] ✓ Schema válido`,
      `[${new Date().toLocaleTimeString()}] Executando transformações...`,
      `[${new Date().toLocaleTimeString()}] ✓ Transformação 1/3 concluída`,
      `[${new Date().toLocaleTimeString()}] ✓ Transformação 2/3 concluída`,
      `[${new Date().toLocaleTimeString()}] ✓ Transformação 3/3 concluída`,
      `[${new Date().toLocaleTimeString()}] Aplicando regras de negócio...`,
      `[${new Date().toLocaleTimeString()}] ✓ Regras aplicadas com sucesso`,
      `[${new Date().toLocaleTimeString()}] Gerando relatório de qualidade...`,
      `[${new Date().toLocaleTimeString()}] ✓ Execução concluída com sucesso`,
      `[${new Date().toLocaleTimeString()}] Registros processados: ${dataset?.records}`,
      `[${new Date().toLocaleTimeString()}] Tempo total: 2.3s`,
    ];

    for (const log of processingLogs) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setLogs(prev => [...prev, log]);
    }

    setIsRunning(false);
    toast.success('Execução concluída com sucesso!');
  };

  const handleClearLogs = () => {
    setLogs([
      '[' + new Date().toLocaleTimeString() + '] Logs limpos',
      '[' + new Date().toLocaleTimeString() + '] Test Lab pronto para nova execução',
    ]);
  };

  const handleExportLogs = () => {
    const logsText = logs.join('\n');
    const blob = new Blob([logsText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `test-lab-logs-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Logs exportados com sucesso!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Test Lab</h2>
          <p className="text-muted-foreground">Ambiente de testes para datasets e recipes</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleClearLogs}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Limpar Logs
          </Button>
          <Button variant="outline" onClick={handleExportLogs}>
            <Download className="h-4 w-4 mr-2" />
            Exportar Logs
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TestTube className="h-5 w-5" />
              Configuração do Teste
            </CardTitle>
            <CardDescription>Selecione dataset e recipe para executar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Dataset</label>
              <Select value={selectedDataset} onValueChange={setSelectedDataset}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um dataset" />
                </SelectTrigger>
                <SelectContent>
                  {sampleDatasets.map(dataset => (
                    <SelectItem key={dataset.id} value={dataset.id}>
                      {dataset.name} ({dataset.records} registros)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Recipe</label>
              <Select value={selectedRecipe} onValueChange={setSelectedRecipe}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma recipe" />
                </SelectTrigger>
                <SelectContent>
                  {sampleRecipes.map(recipe => (
                    <SelectItem key={recipe.id} value={recipe.id}>
                      {recipe.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedDataset && selectedRecipe && (
              <div className="p-3 bg-muted rounded-lg">
                <h4 className="font-medium text-sm mb-2">Configuração Atual</h4>
                <div className="space-y-1 text-xs">
                  <p><strong>Dataset:</strong> {sampleDatasets.find(d => d.id === selectedDataset)?.name}</p>
                  <p><strong>Recipe:</strong> {sampleRecipes.find(r => r.id === selectedRecipe)?.name}</p>
                </div>
              </div>
            )}

            <Button 
              onClick={handleRunTest} 
              disabled={!selectedDataset || !selectedRecipe || isRunning}
              className="w-full"
            >
              <Play className="h-4 w-4 mr-2" />
              {isRunning ? 'Executando...' : 'Executar Teste'}
            </Button>
          </CardContent>
        </Card>

        {/* Console Logs */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Terminal className="h-5 w-5" />
              Console de Logs
            </CardTitle>
            <CardDescription>Logs de execução em tempo real</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] w-full border rounded-lg p-4 bg-slate-950 text-slate-100 font-mono text-sm">
              <div className="space-y-1">
                {logs.map((log, index) => (
                  <div key={index} className="whitespace-pre-wrap">
                    {log}
                  </div>
                ))}
                {isRunning && (
                  <div className="flex items-center gap-2 text-blue-400">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    Executando...
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Available Resources */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Datasets Disponíveis</CardTitle>
            <CardDescription>Dados de teste para validação</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sampleDatasets.map(dataset => (
                <div key={dataset.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{dataset.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {dataset.records.toLocaleString()} registros
                    </p>
                  </div>
                  <Badge variant="outline">{dataset.format}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recipes Disponíveis</CardTitle>
            <CardDescription>Pipelines de processamento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sampleRecipes.map(recipe => (
                <div key={recipe.id} className="p-3 border rounded-lg">
                  <h4 className="font-medium">{recipe.name}</h4>
                  <p className="text-sm text-muted-foreground">{recipe.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Test Results Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Histórico de Execuções</CardTitle>
          <CardDescription>Últimas execuções realizadas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Badge variant="default">Sucesso</Badge>
                <div>
                  <p className="font-medium">ETL Basic Pipeline + Customer Data</p>
                  <p className="text-sm text-muted-foreground">Há 5 minutos • 1.250 registros processados</p>
                </div>
              </div>
              <Button size="sm" variant="ghost">
                <FileText className="h-3 w-3 mr-1" />
                Ver Logs
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Badge variant="secondary">Sucesso</Badge>
                <div>
                  <p className="font-medium">ML Scoring Recipe + Transaction History</p>
                  <p className="text-sm text-muted-foreground">Há 1 hora • 45.000 registros processados</p>
                </div>
              </div>
              <Button size="sm" variant="ghost">
                <FileText className="h-3 w-3 mr-1" />
                Ver Logs
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Badge variant="destructive">Erro</Badge>
                <div>
                  <p className="font-medium">Data Quality Check + Product Catalog</p>
                  <p className="text-sm text-muted-foreground">Há 2 horas • Falha na validação de schema</p>
                </div>
              </div>
              <Button size="sm" variant="ghost">
                <FileText className="h-3 w-3 mr-1" />
                Ver Logs
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
