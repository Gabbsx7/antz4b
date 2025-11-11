'use client';

import { useState } from 'react';
import { Workflow, Play, Save, RotateCcw, Plus, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const nodeTypes = [
  { id: 'ingest', name: 'Ingest', color: 'bg-blue-500', description: 'Capturar dados de fontes' },
  { id: 'transform', name: 'Transform', color: 'bg-emerald-500', description: 'Transformar e limpar dados' },
  { id: 'enrich', name: 'Enrich', color: 'bg-purple-500', description: 'Enriquecer com dados externos' },
  { id: 'route', name: 'Route', color: 'bg-amber-500', description: 'Rotear dados condicionalmente' },
  { id: 'output', name: 'Output', color: 'bg-rose-500', description: 'Enviar para destinos' },
];

const samplePipelines = [
  {
    id: 'financial-etl',
    name: 'Financial Data ETL',
    description: 'Pipeline de dados financeiros do ERP para Data Warehouse',
    status: 'active',
    lastRun: '2025-11-07T15:30:00Z',
    nodes: 5,
  },
  {
    id: 'customer-sync',
    name: 'Customer Data Sync',
    description: 'Sincronização de dados de clientes entre CRM e sistema interno',
    status: 'draft',
    lastRun: null,
    nodes: 3,
  },
  {
    id: 'risk-scoring',
    name: 'Risk Scoring Pipeline',
    description: 'Pipeline de cálculo de score de risco em tempo real',
    status: 'running',
    lastRun: '2025-11-07T16:00:00Z',
    nodes: 7,
  },
];

export default function ColonyBuilderPage() {
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [pipelineName, setPipelineName] = useState('');

  const handleNodeClick = (nodeType: string) => {
    setSelectedNodes([...selectedNodes, nodeType]);
    toast.success(`Node ${nodeType} adicionado ao pipeline`);
  };

  const handleSavePipeline = () => {
    if (selectedNodes.length === 0) {
      toast.error('Adicione pelo menos um node ao pipeline');
      return;
    }
    toast.success('Pipeline salvo com sucesso!');
    setSelectedNodes([]);
    setPipelineName('');
  };

  const handleRunPipeline = () => {
    if (selectedNodes.length === 0) {
      toast.error('Construa um pipeline antes de executar');
      return;
    }
    toast.success('Pipeline executado! Logs enviados para Test Lab');
  };

  const handleClearCanvas = () => {
    setSelectedNodes([]);
    toast.info('Canvas limpo');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Colony Builder</h2>
          <p className="text-muted-foreground">Construtor visual de pipelines de dados</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleClearCanvas}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Limpar
          </Button>
          <Button variant="outline" onClick={handleSavePipeline}>
            <Save className="h-4 w-4 mr-2" />
            Salvar
          </Button>
          <Button onClick={handleRunPipeline}>
            <Play className="h-4 w-4 mr-2" />
            Executar
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Node Palette */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Palette de Nodes</CardTitle>
            <CardDescription>Arraste ou clique para adicionar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {nodeTypes.map((nodeType) => (
              <div
                key={nodeType.id}
                className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleNodeClick(nodeType.id)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded ${nodeType.color}`}></div>
                  <div>
                    <p className="font-medium text-sm">{nodeType.name}</p>
                    <p className="text-xs text-muted-foreground">{nodeType.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Canvas */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg">Canvas de Pipeline</CardTitle>
            <CardDescription>
              {selectedNodes.length === 0 
                ? 'Clique nos nodes à esquerda para construir seu pipeline'
                : `Pipeline com ${selectedNodes.length} nodes`
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="min-h-[400px] border-2 border-dashed rounded-lg p-6">
              {selectedNodes.length === 0 ? (
                <div className="flex items-center justify-center h-full text-center">
                  <div>
                    <Workflow className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                    <p className="text-muted-foreground">Canvas vazio</p>
                    <p className="text-sm text-muted-foreground">Adicione nodes para começar</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4 flex-wrap">
                  {selectedNodes.map((nodeType, index) => {
                    const nodeConfig = nodeTypes.find(nt => nt.id === nodeType);
                    return (
                      <div key={`${nodeType}-${index}`} className="flex items-center gap-2">
                        <div className="flex items-center gap-2 p-3 border rounded-lg bg-background">
                          <div className={`w-3 h-3 rounded ${nodeConfig?.color}`}></div>
                          <span className="text-sm font-medium">{nodeConfig?.name}</span>
                        </div>
                        {index < selectedNodes.length - 1 && (
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Templates de Pipeline</CardTitle>
          <CardDescription>Pipelines pré-configurados para casos comuns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
              <h4 className="font-medium mb-2">ETL Básico</h4>
              <p className="text-sm text-muted-foreground mb-3">Ingest → Transform → Output</p>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded bg-blue-500"></div>
                <div className="w-2 h-2 rounded bg-emerald-500"></div>
                <div className="w-2 h-2 rounded bg-rose-500"></div>
              </div>
            </div>

            <div className="p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
              <h4 className="font-medium mb-2">Data Enrichment</h4>
              <p className="text-sm text-muted-foreground mb-3">Ingest → Enrich → Transform → Output</p>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded bg-blue-500"></div>
                <div className="w-2 h-2 rounded bg-purple-500"></div>
                <div className="w-2 h-2 rounded bg-emerald-500"></div>
                <div className="w-2 h-2 rounded bg-rose-500"></div>
              </div>
            </div>

            <div className="p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
              <h4 className="font-medium mb-2">Conditional Routing</h4>
              <p className="text-sm text-muted-foreground mb-3">Ingest → Transform → Route → Output</p>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded bg-blue-500"></div>
                <div className="w-2 h-2 rounded bg-emerald-500"></div>
                <div className="w-2 h-2 rounded bg-amber-500"></div>
                <div className="w-2 h-2 rounded bg-rose-500"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Existing Pipelines */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Pipelines Existentes</CardTitle>
          <CardDescription>Gerencie seus pipelines criados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {samplePipelines.map((pipeline) => (
              <div key={pipeline.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Workflow className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <h4 className="font-medium">{pipeline.name}</h4>
                    <p className="text-sm text-muted-foreground">{pipeline.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {pipeline.nodes} nodes
                      </Badge>
                      {pipeline.lastRun && (
                        <span className="text-xs text-muted-foreground">
                          Última execução: {new Date(pipeline.lastRun).toLocaleString('pt-BR')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={
                    pipeline.status === 'active' ? 'default' : 
                    pipeline.status === 'running' ? 'secondary' : 'outline'
                  }>
                    {pipeline.status}
                  </Badge>
                  <Button size="sm" variant="outline">
                    <Play className="h-3 w-3 mr-1" />
                    Executar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
