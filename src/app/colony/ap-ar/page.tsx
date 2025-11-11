'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Download, Mail, Phone, Calendar, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { fetchInvoices } from '@/lib/mocks';
import { formatCurrency, formatDate } from '@/lib/format';
import { useAppStore } from '@/lib/store';
import { toast } from 'sonner';
import type { Invoice } from '@/lib/types';

export default function APARPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'AP' | 'AR'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'paid' | 'overdue'>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [collectionDialogOpen, setCollectionDialogOpen] = useState(false);

  const { addAgentMessage } = useAppStore();

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchInvoices();
        setInvoices(data);
        setFilteredInvoices(data);
      } catch (error) {
        console.error('Erro ao carregar faturas:', error);
        toast.error('Erro ao carregar faturas');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    let filtered = invoices;

    if (searchTerm) {
      filtered = filtered.filter(invoice => 
        invoice.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(invoice => invoice.kind === filterType);
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(invoice => invoice.status === filterStatus);
    }

    setFilteredInvoices(filtered);
  }, [invoices, searchTerm, filterType, filterStatus]);

  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'paid': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'overdue': return 'bg-rose-50 text-rose-700 border-rose-200';
      default: return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  const getStatusLabel = (status: Invoice['status']) => {
    switch (status) {
      case 'paid': return 'Pago';
      case 'overdue': return 'Em Atraso';
      default: return 'Em Aberto';
    }
  };

  const agingBuckets = {
    current: filteredInvoices.filter(inv => inv.status === 'open' && !inv.daysOverdue).length,
    days30: filteredInvoices.filter(inv => inv.daysOverdue && inv.daysOverdue <= 30).length,
    days60: filteredInvoices.filter(inv => inv.daysOverdue && inv.daysOverdue > 30 && inv.daysOverdue <= 60).length,
    days90: filteredInvoices.filter(inv => inv.daysOverdue && inv.daysOverdue > 60 && inv.daysOverdue <= 90).length,
    days90plus: filteredInvoices.filter(inv => inv.daysOverdue && inv.daysOverdue > 90).length,
  };

  const totalAR = filteredInvoices
    .filter(inv => inv.kind === 'AR' && inv.status !== 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const totalAP = filteredInvoices
    .filter(inv => inv.kind === 'AP' && inv.status !== 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const overdueAmount = filteredInvoices
    .filter(inv => inv.status === 'overdue')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const handleGenerateCollection = () => {
    const overdueInvoices = filteredInvoices.filter(inv => 
      inv.kind === 'AR' && inv.status === 'overdue' && 
      inv.daysOverdue && inv.daysOverdue >= 30 && inv.daysOverdue <= 60
    );

    const message = `Gerar régua de cobrança para ${overdueInvoices.length} clientes com atraso entre 30-60 dias`;
    addAgentMessage({
      id: `apar-${Date.now()}`,
      type: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    });

    setCollectionDialogOpen(false);
    toast.success('Régua de cobrança gerada pelo Ant\'z Agent');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
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
          <h2 className="text-2xl font-bold">Contas a Pagar/Receber</h2>
          <p className="text-muted-foreground">Gestão de faturas e aging de recebíveis</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={collectionDialogOpen} onOpenChange={setCollectionDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Mail className="h-4 w-4 mr-2" />
                Gerar Cobrança
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Gerar Régua de Cobrança</DialogTitle>
                <DialogDescription>
                  Criar campanha de cobrança automatizada para clientes em atraso
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Clientes Selecionados</h4>
                  <p className="text-sm text-muted-foreground">
                    Clientes com atraso entre 30-60 dias: <strong>{agingBuckets.days60}</strong>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Valor total: <strong>{formatCurrency(
                      filteredInvoices
                        .filter(inv => inv.kind === 'AR' && inv.daysOverdue && inv.daysOverdue > 30 && inv.daysOverdue <= 60)
                        .reduce((sum, inv) => sum + inv.amount, 0)
                    )}</strong>
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Template de Cobrança</h4>
                  <Select defaultValue="smb-v2">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="smb-v2">SMB v2 - Cobrança Amigável</SelectItem>
                      <SelectItem value="enterprise">Enterprise - Formal</SelectItem>
                      <SelectItem value="urgent">Urgente - Cobrança Intensiva</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleGenerateCollection} className="flex-1">
                    Gerar e Enviar
                  </Button>
                  <Button variant="outline" onClick={() => setCollectionDialogOpen(false)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contas a Receber</CardTitle>
            <Calendar className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{formatCurrency(totalAR)}</div>
            <p className="text-xs text-muted-foreground">
              {filteredInvoices.filter(inv => inv.kind === 'AR' && inv.status !== 'paid').length} faturas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contas a Pagar</CardTitle>
            <Calendar className="h-4 w-4 text-rose-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-600">{formatCurrency(totalAP)}</div>
            <p className="text-xs text-muted-foreground">
              {filteredInvoices.filter(inv => inv.kind === 'AP' && inv.status !== 'paid').length} faturas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Atraso</CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{formatCurrency(overdueAmount)}</div>
            <p className="text-xs text-muted-foreground">
              {filteredInvoices.filter(inv => inv.status === 'overdue').length} faturas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">DSO</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">54 dias</div>
            <p className="text-xs text-muted-foreground">
              +8% vs mês anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Aging Buckets */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Aging de Recebíveis</CardTitle>
          <CardDescription>Distribuição por faixa de vencimento</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-5">
            <div className="text-center p-4 border rounded-lg bg-emerald-50">
              <h4 className="font-medium text-emerald-700">A Vencer</h4>
              <p className="text-2xl font-bold text-emerald-600">{agingBuckets.current}</p>
              <p className="text-sm text-muted-foreground">faturas</p>
            </div>
            <div className="text-center p-4 border rounded-lg bg-amber-50">
              <h4 className="font-medium text-amber-700">1-30 dias</h4>
              <p className="text-2xl font-bold text-amber-600">{agingBuckets.days30}</p>
              <p className="text-sm text-muted-foreground">faturas</p>
            </div>
            <div className="text-center p-4 border rounded-lg bg-orange-50">
              <h4 className="font-medium text-orange-700">31-60 dias</h4>
              <p className="text-2xl font-bold text-orange-600">{agingBuckets.days60}</p>
              <p className="text-sm text-muted-foreground">faturas</p>
            </div>
            <div className="text-center p-4 border rounded-lg bg-red-50">
              <h4 className="font-medium text-red-700">61-90 dias</h4>
              <p className="text-2xl font-bold text-red-600">{agingBuckets.days90}</p>
              <p className="text-sm text-muted-foreground">faturas</p>
            </div>
            <div className="text-center p-4 border rounded-lg bg-rose-50">
              <h4 className="font-medium text-rose-700">+90 dias</h4>
              <p className="text-2xl font-bold text-rose-600">{agingBuckets.days90plus}</p>
              <p className="text-sm text-muted-foreground">faturas</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Faturas</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="AR">A Receber</SelectItem>
                <SelectItem value="AP">A Pagar</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos Status</SelectItem>
                <SelectItem value="open">Em Aberto</SelectItem>
                <SelectItem value="overdue">Em Atraso</SelectItem>
                <SelectItem value="paid">Pagos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Atraso</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-mono text-sm">{invoice.id}</TableCell>
                    <TableCell>
                      <Badge variant={invoice.kind === 'AR' ? 'default' : 'secondary'}>
                        {invoice.kind}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{invoice.name}</TableCell>
                    <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                    <TableCell>{formatDate(invoice.due)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(invoice.status)}>
                        {getStatusLabel(invoice.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {invoice.daysOverdue ? (
                        <span className="text-rose-600 font-medium">
                          {invoice.daysOverdue} dias
                        </span>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {invoice.kind === 'AR' && invoice.status === 'overdue' && (
                          <>
                            <Button size="sm" variant="ghost">
                              <Mail className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Phone className="h-3 w-3" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredInvoices.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma fatura encontrada</p>
              <p className="text-sm">Ajuste os filtros para ver mais resultados</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
