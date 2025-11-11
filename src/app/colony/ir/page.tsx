'use client';

import { PieChart, Download, FileText, TrendingUp, Users, DollarSign } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function IRPage() {
  const handleExport = (type: string) => {
    toast.success(`Relatório ${type} exportado com sucesso!`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Investor Relations</h2>
          <p className="text-muted-foreground">Relatórios e métricas para investidores</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => handleExport('Executivo')}>
            <Download className="h-4 w-4 mr-2" />
            Exportar Relatório
          </Button>
        </div>
      </div>

      {/* Key Highlights */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Key Highlights - Q4 2025
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">R$ 9.8M</div>
              <p className="text-sm text-muted-foreground">ARR (Annual Recurring Revenue)</p>
              <Badge variant="secondary" className="mt-1">+42% YoY</Badge>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">41%</div>
              <p className="text-sm text-muted-foreground">Gross Margin</p>
              <Badge variant="secondary" className="mt-1">-2.1pp QoQ</Badge>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">3.2x</div>
              <p className="text-sm text-muted-foreground">LTV/CAC Ratio</p>
              <Badge variant="secondary" className="mt-1">+0.4x QoQ</Badge>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">118%</div>
              <p className="text-sm text-muted-foreground">Net Revenue Retention</p>
              <Badge variant="secondary" className="mt-1">+8pp QoQ</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Metrics */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Métricas Financeiras</CardTitle>
            <CardDescription>Indicadores chave de performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Monthly Recurring Revenue</span>
              <div className="text-right">
                <div className="font-bold">R$ 820k</div>
                <div className="text-xs text-emerald-600">+12% MoM</div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Customer Acquisition Cost</span>
              <div className="text-right">
                <div className="font-bold">R$ 150</div>
                <div className="text-xs text-emerald-600">-8% MoM</div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Churn Rate</span>
              <div className="text-right">
                <div className="font-bold">5.2%</div>
                <div className="text-xs text-rose-600">+0.3pp MoM</div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Burn Rate</span>
              <div className="text-right">
                <div className="font-bold">R$ 180k</div>
                <div className="text-xs text-emerald-600">-5% MoM</div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Runway</span>
              <div className="text-right">
                <div className="font-bold">9 meses</div>
                <div className="text-xs text-muted-foreground">Com burn atual</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Métricas Operacionais</CardTitle>
            <CardDescription>Indicadores de crescimento e eficiência</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Total Customers</span>
              <div className="text-right">
                <div className="font-bold">1,247</div>
                <div className="text-xs text-emerald-600">+18% QoQ</div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Average Revenue Per User</span>
              <div className="text-right">
                <div className="font-bold">R$ 658</div>
                <div className="text-xs text-emerald-600">+5% QoQ</div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Monthly Active Users</span>
              <div className="text-right">
                <div className="font-bold">3,891</div>
                <div className="text-xs text-emerald-600">+22% QoQ</div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Product Adoption Rate</span>
              <div className="text-right">
                <div className="font-bold">73%</div>
                <div className="text-xs text-emerald-600">+8pp QoQ</div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Support Ticket Resolution</span>
              <div className="text-right">
                <div className="font-bold">4.2h</div>
                <div className="text-xs text-emerald-600">-1.3h QoQ</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Executive Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Executive Summary</CardTitle>
          <CardDescription>Resumo executivo para investidores</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <p className="text-sm leading-relaxed">
              <strong>Q4 2025 Performance:</strong> Demonstramos crescimento sólido com ARR atingindo R$ 9.8M (+42% YoY), 
              impulsionado pela expansão da base de clientes (+18% QoQ) e melhoria no ARPU (+5% QoQ). 
              A margem bruta de 41% reflete pressões temporárias de custos, mas mantemos trajetória de otimização.
            </p>
            
            <p className="text-sm leading-relaxed mt-4">
              <strong>Eficiência de Capital:</strong> LTV/CAC ratio de 3.2x demonstra eficiência na aquisição, 
              com CAC reduzindo 8% MoM. NRR de 118% confirma forte expansão dentro da base instalada. 
              Burn rate controlado em R$ 180k/mês proporciona runway de 9 meses.
            </p>

            <p className="text-sm leading-relaxed mt-4">
              <strong>Próximos Passos:</strong> Foco em otimização de margem através de automação e 
              expansão para novos segmentos. Meta de atingir R$ 15M ARR até Q2 2026 com manutenção 
              de métricas de eficiência.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Relatórios Disponíveis</CardTitle>
          <CardDescription>Documentos para diferentes stakeholders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <FileText className="h-8 w-8 text-blue-600" />
                <div>
                  <h4 className="font-medium">Board Deck</h4>
                  <p className="text-xs text-muted-foreground">Apresentação completa</p>
                </div>
              </div>
              <Button size="sm" variant="outline" className="w-full" onClick={() => handleExport('Board Deck')}>
                <Download className="h-3 w-3 mr-1" />
                Exportar PDF
              </Button>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <PieChart className="h-8 w-8 text-emerald-600" />
                <div>
                  <h4 className="font-medium">Financial Summary</h4>
                  <p className="text-xs text-muted-foreground">Métricas financeiras</p>
                </div>
              </div>
              <Button size="sm" variant="outline" className="w-full" onClick={() => handleExport('Financial Summary')}>
                <Download className="h-3 w-3 mr-1" />
                Exportar Excel
              </Button>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Users className="h-8 w-8 text-purple-600" />
                <div>
                  <h4 className="font-medium">One-Pager</h4>
                  <p className="text-xs text-muted-foreground">Resumo executivo</p>
                </div>
              </div>
              <Button size="sm" variant="outline" className="w-full" onClick={() => handleExport('One-Pager')}>
                <Download className="h-3 w-3 mr-1" />
                Exportar PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
