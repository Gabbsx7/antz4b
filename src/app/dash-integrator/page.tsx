'use client';

import { BarChart3, ExternalLink, Plus, RefreshCw, Settings, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const dashboards = [
  {
    id: 'powerbi-financial',
    name: 'Financial Dashboard - Power BI',
    type: 'Power BI',
    status: 'connected',
    lastSync: '2025-11-07T15:30:00Z',
    url: 'https://app.powerbi.com/view?r=eyJrIjoiMTIzNDU2NzgtOTBhYi1jZGVmLTEyMzQtNTY3ODkwYWJjZGVmIiwidCI6IjEyMzQ1Njc4LTkwYWItY2RlZi0xMjM0LTU2Nzg5MGFiY2RlZiIsImMiOjEwfQ%3D%3D',
  },
  {
    id: 'tableau-sales',
    name: 'Sales Performance - Tableau',
    type: 'Tableau',
    status: 'connected',
    lastSync: '2025-11-07T14:45:00Z',
    url: 'https://public.tableau.com/views/SalesPerformance/Dashboard1',
  },
  {
    id: 'looker-operations',
    name: 'Operations KPIs - Looker',
    type: 'Looker',
    status: 'error',
    lastSync: '2025-11-07T10:15:00Z',
    url: 'https://looker.company.com/dashboards/operations',
  },
  {
    id: 'metabase-marketing',
    name: 'Marketing Analytics - Metabase',
    type: 'Metabase',
    status: 'syncing',
    lastSync: '2025-11-07T16:00:00Z',
    url: 'https://metabase.company.com/dashboard/42',
  },
];

export default function DashIntegratorPage() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'syncing': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'error': return 'bg-rose-50 text-rose-700 border-rose-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Dash Integrator</h2>
          <p className="text-muted-foreground">Integração com dashboards externos e ferramentas de BI</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Dashboard
        </Button>
      </div>

      {/* Status Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dashboards Conectados</CardTitle>
            <BarChart3 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {dashboards.filter(d => d.status === 'connected').length}
            </div>
            <p className="text-xs text-muted-foreground">de {dashboards.length} total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sincronizações Hoje</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">atualizações</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio Sync</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.3s</div>
            <p className="text-xs text-muted-foreground">última hora</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas</CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">1</div>
            <p className="text-xs text-muted-foreground">requer atenção</p>
          </CardContent>
        </Card>
      </div>

      {/* Dashboards Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {dashboards.map((dashboard) => (
          <Card key={dashboard.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{dashboard.name}</CardTitle>
                  <CardDescription>Plataforma: {dashboard.type}</CardDescription>
                </div>
                <Badge className={getStatusColor(dashboard.status)}>
                  {getStatusLabel(dashboard.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm">
                <span className="text-muted-foreground">Última sincronização: </span>
                <span className="font-medium">
                  {new Date(dashboard.lastSync).toLocaleString('pt-BR')}
                </span>
              </div>

              {/* Embedded Dashboard Preview */}
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border-2 border-dashed">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">Preview do Dashboard</p>
                  <p className="text-xs text-muted-foreground">{dashboard.type}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Abrir Original
                </Button>
                <Button size="sm" variant="outline">
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Sync
                </Button>
                <Button size="sm" variant="ghost">
                  <Settings className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Integration Options */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Plataformas Suportadas</CardTitle>
          <CardDescription>Conecte seus dashboards favoritos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="p-4 border rounded-lg text-center hover:bg-muted/50 transition-colors cursor-pointer">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="h-6 w-6 text-amber-600" />
              </div>
              <h4 className="font-medium">Power BI</h4>
              <p className="text-xs text-muted-foreground mt-1">Microsoft Power BI</p>
            </div>

            <div className="p-4 border rounded-lg text-center hover:bg-muted/50 transition-colors cursor-pointer">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-medium">Tableau</h4>
              <p className="text-xs text-muted-foreground mt-1">Tableau Desktop/Server</p>
            </div>

            <div className="p-4 border rounded-lg text-center hover:bg-muted/50 transition-colors cursor-pointer">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="h-6 w-6 text-emerald-600" />
              </div>
              <h4 className="font-medium">Looker</h4>
              <p className="text-xs text-muted-foreground mt-1">Google Looker Studio</p>
            </div>

            <div className="p-4 border rounded-lg text-center hover:bg-muted/50 transition-colors cursor-pointer">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-medium">Metabase</h4>
              <p className="text-xs text-muted-foreground mt-1">Open Source BI</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Status das Conexões</CardTitle>
          <CardDescription>Monitoramento em tempo real</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dashboards.map((dashboard) => (
              <div key={dashboard.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    dashboard.status === 'connected' ? 'bg-emerald-500' :
                    dashboard.status === 'syncing' ? 'bg-blue-500 animate-pulse' :
                    'bg-rose-500'
                  }`}></div>
                  <div>
                    <p className="font-medium">{dashboard.name}</p>
                    <p className="text-xs text-muted-foreground">{dashboard.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={getStatusColor(dashboard.status)} variant="outline">
                    {getStatusLabel(dashboard.status)}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(dashboard.lastSync).toLocaleTimeString('pt-BR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
