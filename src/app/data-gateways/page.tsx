'use client';

import { Database, FileText, Globe, RefreshCw, CheckCircle, AlertCircle, XCircle, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const dataSources = [
  {
    id: 'erp-sap',
    name: 'ERP SAP',
    type: 'database',
    status: 'connected',
    lastSync: '2025-11-07T15:45:00Z',
    nextSync: '2025-11-07T16:00:00Z',
    records: 1250000,
    tables: ['customers', 'orders', 'products', 'inventory'],
    health: 98,
  },
  {
    id: 'crm-salesforce',
    name: 'CRM Salesforce',
    type: 'api',
    status: 'syncing',
    lastSync: '2025-11-07T15:30:00Z',
    nextSync: '2025-11-07T16:30:00Z',
    records: 45000,
    tables: ['leads', 'opportunities', 'accounts', 'contacts'],
    health: 95,
  },
  {
    id: 'sheets-financial',
    name: 'Planilhas Financeiras',
    type: 'google_sheets',
    status: 'connected',
    lastSync: '2025-11-07T15:00:00Z',
    nextSync: '2025-11-07T17:00:00Z',
    records: 8500,
    tables: ['budget', 'expenses', 'revenue'],
    health: 92,
  },
  {
    id: 'csv-exports',
    name: 'Exports CSV',
    type: 'csv',
    status: 'error',
    lastSync: '2025-11-07T12:00:00Z',
    nextSync: '2025-11-07T18:00:00Z',
    records: 0,
    tables: ['transactions', 'payments'],
    health: 0,
  },
  {
    id: 'api-banking',
    name: 'API Banking',
    type: 'api',
    status: 'connected',
    lastSync: '2025-11-07T15:50:00Z',
    nextSync: '2025-11-07T16:50:00Z',
    records: 125000,
    tables: ['transactions', 'balances', 'statements'],
    health: 100,
  },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'connected': return <CheckCircle className="h-4 w-4 text-emerald-500" />;
    case 'syncing': return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
    case 'error': return <XCircle className="h-4 w-4 text-rose-500" />;
    default: return <AlertCircle className="h-4 w-4 text-amber-500" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'connected': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'syncing': return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'error': return 'bg-rose-50 text-rose-700 border-rose-200';
    default: return 'bg-amber-50 text-amber-700 border-amber-200';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'connected': return 'Conectado';
    case 'syncing': return 'Sincronizando';
    case 'error': return 'Erro';
    default: return 'Desconhecido';
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'database': return <Database className="h-5 w-5 text-blue-600" />;
    case 'api': return <Globe className="h-5 w-5 text-emerald-600" />;
    case 'csv': return <FileText className="h-5 w-5 text-amber-600" />;
    case 'google_sheets': return <FileText className="h-5 w-5 text-green-600" />;
    default: return <Database className="h-5 w-5 text-slate-600" />;
  }
};

export default function DataGatewaysPage() {
  const totalRecords = dataSources.reduce((sum, ds) => sum + ds.records, 0);
  const connectedSources = dataSources.filter(ds => ds.status === 'connected').length;
  const averageHealth = Math.round(dataSources.reduce((sum, ds) => sum + ds.health, 0) / dataSources.length);

  const handleRunSync = (sourceId: string) => {
    console.log(`Executando sincronização para ${sourceId}`);
    // Simular sincronização
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Data Gateways</h2>
          <p className="text-muted-foreground">Conectores e fontes de dados</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nova Fonte
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fontes Conectadas</CardTitle>
            <Database className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{connectedSources}</div>
            <p className="text-xs text-muted-foreground">de {dataSources.length} total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registros Totais</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(totalRecords / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">registros sincronizados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saúde Média</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageHealth}%</div>
            <p className="text-xs text-muted-foreground">todas as fontes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sincronizações Hoje</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">execuções</p>
          </CardContent>
        </Card>
      </div>

      {/* Data Sources Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {dataSources.map((source) => (
          <Card key={source.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getTypeIcon(source.type)}
                  <div>
                    <CardTitle className="text-lg">{source.name}</CardTitle>
                    <CardDescription className="capitalize">{source.type.replace('_', ' ')}</CardDescription>
                  </div>
                </div>
                <Badge className={getStatusColor(source.status)}>
                  {getStatusLabel(source.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Registros:</span>
                  <p className="font-medium">{source.records.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Tabelas:</span>
                  <p className="font-medium">{source.tables.length}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Última Sync:</span>
                  <p className="font-medium">{new Date(source.lastSync).toLocaleTimeString('pt-BR')}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Próxima Sync:</span>
                  <p className="font-medium">{new Date(source.nextSync).toLocaleTimeString('pt-BR')}</p>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Saúde da Conexão</span>
                  <span className="text-sm text-muted-foreground">{source.health}%</span>
                </div>
                <Progress value={source.health} className="h-2" />
              </div>

              <div>
                <span className="text-sm font-medium">Tabelas:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {source.tables.slice(0, 3).map((table) => (
                    <Badge key={table} variant="outline" className="text-xs">
                      {table}
                    </Badge>
                  ))}
                  {source.tables.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{source.tables.length - 3} mais
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => handleRunSync(source.id)}
                  disabled={source.status === 'syncing'}
                >
                  <RefreshCw className={`h-3 w-3 mr-1 ${source.status === 'syncing' ? 'animate-spin' : ''}`} />
                  Executar Sync
                </Button>
                <Button size="sm" variant="ghost">
                  Configurar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Status Detalhado</CardTitle>
          <CardDescription>Monitoramento completo das fontes de dados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fonte</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Registros</TableHead>
                  <TableHead>Saúde</TableHead>
                  <TableHead>Última Sync</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dataSources.map((source) => (
                  <TableRow key={source.id}>
                    <TableCell className="font-medium">{source.name}</TableCell>
                    <TableCell className="capitalize">{source.type.replace('_', ' ')}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(source.status)}
                        <span className="text-sm">{getStatusLabel(source.status)}</span>
                      </div>
                    </TableCell>
                    <TableCell>{source.records.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={source.health} className="h-1 w-12" />
                        <span className="text-xs">{source.health}%</span>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(source.lastSync).toLocaleString('pt-BR')}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => handleRunSync(source.id)}>
                          <RefreshCw className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
