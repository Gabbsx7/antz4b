'use client';

import { Zap, Download, Code, Database, ArrowRight, Filter, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const antFunctions = [
  {
    id: 'csv-ingest',
    name: 'CSV Ingest',
    type: 'ingest',
    category: 'Data Sources',
    description: 'Lê arquivos CSV e converte para formato estruturado',
    inputs: ['file_path', 'delimiter', 'encoding'],
    outputs: ['dataframe', 'row_count', 'columns'],
    version: '1.2.0',
    downloads: 1247,
    rating: 4.8,
  },
  {
    id: 'api-fetch',
    name: 'API Fetch',
    type: 'ingest',
    category: 'Data Sources',
    description: 'Consome APIs REST e GraphQL com autenticação',
    inputs: ['url', 'headers', 'auth_token', 'method'],
    outputs: ['response_data', 'status_code', 'headers'],
    version: '2.1.0',
    downloads: 2156,
    rating: 4.9,
  },
  {
    id: 'data-cleaner',
    name: 'Data Cleaner',
    type: 'transform',
    category: 'Data Quality',
    description: 'Remove duplicatas, trata valores nulos e padroniza formatos',
    inputs: ['raw_data', 'rules_config', 'null_strategy'],
    outputs: ['clean_data', 'quality_report', 'rejected_rows'],
    version: '1.5.2',
    downloads: 3421,
    rating: 4.7,
  },
  {
    id: 'ml-scorer',
    name: 'ML Scorer',
    type: 'enrich',
    category: 'Machine Learning',
    description: 'Aplica modelos de ML para scoring e classificação',
    inputs: ['features', 'model_path', 'threshold'],
    outputs: ['scores', 'predictions', 'confidence'],
    version: '3.0.1',
    downloads: 987,
    rating: 4.6,
  },
  {
    id: 'risk-router',
    name: 'Risk Router',
    type: 'route',
    category: 'Business Logic',
    description: 'Roteia dados baseado em regras de risco e compliance',
    inputs: ['data', 'risk_rules', 'thresholds'],
    outputs: ['high_risk', 'medium_risk', 'low_risk'],
    version: '1.8.0',
    downloads: 756,
    rating: 4.5,
  },
  {
    id: 'email-alert',
    name: 'Email Alert',
    type: 'alert',
    category: 'Notifications',
    description: 'Envia alertas por email com templates customizáveis',
    inputs: ['recipients', 'template', 'data', 'priority'],
    outputs: ['sent_status', 'message_id', 'delivery_time'],
    version: '2.3.1',
    downloads: 1834,
    rating: 4.4,
  },
  {
    id: 'webhook-sender',
    name: 'Webhook Sender',
    type: 'alert',
    category: 'Integrations',
    description: 'Envia dados via webhook para sistemas externos',
    inputs: ['webhook_url', 'payload', 'headers', 'retry_config'],
    outputs: ['response', 'status', 'retry_count'],
    version: '1.4.0',
    downloads: 1123,
    rating: 4.3,
  },
  {
    id: 'db-writer',
    name: 'Database Writer',
    type: 'output',
    category: 'Data Sinks',
    description: 'Escreve dados em bancos SQL e NoSQL',
    inputs: ['connection_string', 'table_name', 'data', 'write_mode'],
    outputs: ['rows_affected', 'execution_time', 'errors'],
    version: '2.0.3',
    downloads: 2890,
    rating: 4.8,
  },
];

const categories = ['Todos', 'Data Sources', 'Data Quality', 'Machine Learning', 'Business Logic', 'Notifications', 'Integrations', 'Data Sinks'];
const types = ['Todos', 'ingest', 'transform', 'enrich', 'route', 'alert', 'output'];

export default function AntCreatorPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Ant Creator</h2>
          <p className="text-muted-foreground">Biblioteca de funções modulares (formigas) para pipelines</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nova Formiga
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Formigas Disponíveis</CardTitle>
            <Zap className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{antFunctions.length}</div>
            <p className="text-xs text-muted-foreground">funções ativas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Downloads Totais</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(antFunctions.reduce((sum, ant) => sum + ant.downloads, 0) / 1000)}k
            </div>
            <p className="text-xs text-muted-foreground">este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rating Médio</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(antFunctions.reduce((sum, ant) => sum + ant.rating, 0) / antFunctions.length).toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">de 5.0</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categorias</CardTitle>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length - 1}</div>
            <p className="text-xs text-muted-foreground">disponíveis</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Input placeholder="Buscar formigas..." className="flex-1" />
            <Select defaultValue="Todos">
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select defaultValue="Todos">
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {types.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Ant Functions Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {antFunctions.map((ant) => (
          <Card key={ant.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-emerald-600" />
                  <CardTitle className="text-lg">{ant.name}</CardTitle>
                </div>
                <Badge variant="outline" className="text-xs">
                  v{ant.version}
                </Badge>
              </div>
              <CardDescription>{ant.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {ant.category}
                </Badge>
                <Badge variant="outline" className="text-xs capitalize">
                  {ant.type}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Downloads:</span>
                  <p className="font-medium">{ant.downloads.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Rating:</span>
                  <p className="font-medium">{ant.rating}/5.0</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Inputs/Outputs</h4>
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex gap-1">
                    {ant.inputs.slice(0, 2).map(input => (
                      <Badge key={input} variant="outline" className="text-xs">
                        {input}
                      </Badge>
                    ))}
                    {ant.inputs.length > 2 && (
                      <span className="text-muted-foreground">+{ant.inputs.length - 2}</span>
                    )}
                  </div>
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  <div className="flex gap-1">
                    {ant.outputs.slice(0, 2).map(output => (
                      <Badge key={output} variant="outline" className="text-xs">
                        {output}
                      </Badge>
                    ))}
                    {ant.outputs.length > 2 && (
                      <span className="text-muted-foreground">+{ant.outputs.length - 2}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Plus className="h-3 w-3 mr-1" />
                  Adicionar ao Pipeline
                </Button>
                <Button size="sm" variant="ghost">
                  <Code className="h-3 w-3 mr-1" />
                  Docs
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Popular Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Categorias Populares</CardTitle>
          <CardDescription>Formigas mais utilizadas por categoria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {categories.slice(1, 5).map((category) => {
              const categoryFunctions = antFunctions.filter(ant => ant.category === category);
              const totalDownloads = categoryFunctions.reduce((sum, ant) => sum + ant.downloads, 0);
              
              return (
                <div key={category} className="p-4 border rounded-lg text-center">
                  <h4 className="font-medium mb-2">{category}</h4>
                  <p className="text-2xl font-bold text-emerald-600">{categoryFunctions.length}</p>
                  <p className="text-sm text-muted-foreground">
                    {Math.round(totalDownloads / 1000)}k downloads
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
