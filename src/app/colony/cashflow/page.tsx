'use client';

import { useState, useEffect } from 'react';
import { Plus, TrendingDown, TrendingUp, AlertTriangle, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart } from '@/components/charts/LineChart';
import { fetchCashFlow } from '@/lib/mocks';
import { formatCurrency, formatDate } from '@/lib/format';
import { toast } from 'sonner';
import type { CashPoint } from '@/lib/types';

export default function CashflowPage() {
  const [cashData, setCashData] = useState<CashPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [entryDialogOpen, setEntryDialogOpen] = useState(false);
  const [exitDialogOpen, setExitDialogOpen] = useState(false);
  const [newEntry, setNewEntry] = useState({
    type: 'inflow' as 'inflow' | 'outflow',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchCashFlow();
        setCashData(data);
      } catch (error) {
        console.error('Erro ao carregar fluxo de caixa:', error);
        toast.error('Erro ao carregar dados do fluxo de caixa');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const currentBalance = cashData.length > 0 ? cashData[cashData.length - 1].balance : 0;
  const averageBurn = cashData.length > 0 
    ? cashData.slice(-30).reduce((acc, point) => acc + (point.burn || 0), 0) / 30
    : 0;
  const runway = averageBurn < 0 ? Math.ceil(currentBalance / Math.abs(averageBurn)) : 0;

  const handleAddEntry = () => {
    if (!newEntry.amount || !newEntry.description) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const amount = parseFloat(newEntry.amount);
    const lastPoint = cashData[cashData.length - 1];
    
    const newPoint: CashPoint = {
      date: newEntry.date,
      inflow: newEntry.type === 'inflow' ? amount : lastPoint.inflow,
      outflow: newEntry.type === 'outflow' ? amount : lastPoint.outflow,
      balance: lastPoint.balance + (newEntry.type === 'inflow' ? amount : -amount),
      burn: newEntry.type === 'outflow' ? amount : (lastPoint.burn || 0),
    };

    setCashData([...cashData, newPoint]);
    setNewEntry({
      type: 'inflow',
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      category: '',
    });
    
    setEntryDialogOpen(false);
    setExitDialogOpen(false);
    toast.success(`${newEntry.type === 'inflow' ? 'Entrada' : 'Saída'} adicionada com sucesso`);
  };

  const chartData = cashData.slice(-30).map((point, index) => ({
    date: new Date(point.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    balance: point.balance,
    inflow: point.inflow,
    outflow: point.outflow,
  }));

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
          <h2 className="text-2xl font-bold">Fluxo de Caixa</h2>
          <p className="text-muted-foreground">Controle de entradas, saídas e projeções</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={entryDialogOpen} onOpenChange={setEntryDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Entrada
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nova Entrada</DialogTitle>
                <DialogDescription>Registrar uma nova entrada de caixa</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="amount">Valor</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0,00"
                    value={newEntry.amount}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, amount: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Input
                    id="description"
                    placeholder="Descrição da entrada"
                    value={newEntry.description}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Categoria</Label>
                  <Select value={newEntry.category} onValueChange={(value) => setNewEntry(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vendas">Vendas</SelectItem>
                      <SelectItem value="investimento">Investimento</SelectItem>
                      <SelectItem value="emprestimo">Empréstimo</SelectItem>
                      <SelectItem value="outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="date">Data</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newEntry.date}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => { setNewEntry(prev => ({ ...prev, type: 'inflow' })); handleAddEntry(); }} className="flex-1">
                    Adicionar Entrada
                  </Button>
                  <Button variant="outline" onClick={() => setEntryDialogOpen(false)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={exitDialogOpen} onOpenChange={setExitDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Saída
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nova Saída</DialogTitle>
                <DialogDescription>Registrar uma nova saída de caixa</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="amount">Valor</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0,00"
                    value={newEntry.amount}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, amount: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Input
                    id="description"
                    placeholder="Descrição da saída"
                    value={newEntry.description}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Categoria</Label>
                  <Select value={newEntry.category} onValueChange={(value) => setNewEntry(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="folha">Folha de Pagamento</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="infraestrutura">Infraestrutura</SelectItem>
                      <SelectItem value="fornecedores">Fornecedores</SelectItem>
                      <SelectItem value="impostos">Impostos</SelectItem>
                      <SelectItem value="outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="date">Data</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newEntry.date}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => { setNewEntry(prev => ({ ...prev, type: 'outflow' })); handleAddEntry(); }} className="flex-1">
                    Adicionar Saída
                  </Button>
                  <Button variant="outline" onClick={() => setExitDialogOpen(false)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* KPIs do Fluxo de Caixa */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Atual</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(currentBalance)}</div>
            <p className="text-xs text-muted-foreground">
              Posição em {formatDate(new Date())}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Burn Rate</CardTitle>
            <TrendingDown className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-600">{formatCurrency(averageBurn)}</div>
            <p className="text-xs text-muted-foreground">
              Média últimos 30 dias
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Runway</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{runway} meses</div>
            <p className="text-xs text-muted-foreground">
              Com burn atual
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <AlertTriangle className={`h-4 w-4 ${runway < 6 ? 'text-rose-500' : runway < 12 ? 'text-amber-500' : 'text-emerald-500'}`} />
          </CardHeader>
          <CardContent>
            <Badge variant={runway < 6 ? 'destructive' : runway < 12 ? 'default' : 'secondary'}>
              {runway < 6 ? 'Crítico' : runway < 12 ? 'Atenção' : 'Saudável'}
            </Badge>
            <p className="text-xs text-muted-foreground mt-1">
              Situação financeira
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Fluxo de Caixa */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <LineChart
            title="Evolução do Saldo"
            description="Últimos 30 dias"
            data={chartData}
            lines={[
              { dataKey: 'balance', name: 'Saldo', color: '#3b82f6' },
            ]}
            height={350}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Entradas vs Saídas</CardTitle>
            <CardDescription>Últimos 7 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {chartData.slice(-7).map((point, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{point.date}</span>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="text-xs">
                      +{formatCurrency(point.inflow)}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      -{formatCurrency(point.outflow)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projeções */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Projeções</CardTitle>
          <CardDescription>Cenários baseados no histórico atual</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 border rounded-lg">
              <h4 className="font-medium text-emerald-600">Cenário Otimista</h4>
              <p className="text-2xl font-bold mt-2">{runway + 3} meses</p>
              <p className="text-sm text-muted-foreground">Redução de 20% no burn</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <h4 className="font-medium text-amber-600">Cenário Base</h4>
              <p className="text-2xl font-bold mt-2">{runway} meses</p>
              <p className="text-sm text-muted-foreground">Burn atual mantido</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <h4 className="font-medium text-rose-600">Cenário Pessimista</h4>
              <p className="text-2xl font-bold mt-2">{Math.max(0, runway - 2)} meses</p>
              <p className="text-sm text-muted-foreground">Aumento de 15% no burn</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
