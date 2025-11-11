'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Calculator, AlertCircle, Package } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { fetchProducts } from '@/lib/mocks';
import { formatCurrency, formatPercent } from '@/lib/format';
import { toast } from 'sonner';
import type { Product } from '@/lib/types';

export default function PricingMarginPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [whatIfDialogOpen, setWhatIfDialogOpen] = useState(false);
  const [priceAdjustment, setPriceAdjustment] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        toast.error('Erro ao carregar produtos');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const totalRevenue = products.reduce((sum, p) => sum + (p.price * p.volume), 0);
  const totalMargin = products.reduce((sum, p) => sum + p.margin * p.volume, 0);
  const averageMargin = totalMargin / totalRevenue;

  const calculateWhatIf = (product: Product, adjustment: number) => {
    const newPrice = product.price * (1 + adjustment / 100);
    const newMargin = newPrice - product.cost;
    const newMarginPct = newMargin / newPrice;
    const elasticity = -0.5; // Elasticidade simulada
    const newVolume = product.volume * (1 + elasticity * (adjustment / 100));
    const newRevenue = newPrice * newVolume;
    
    return {
      newPrice,
      newMargin,
      newMarginPct,
      newVolume,
      newRevenue,
      revenueImpact: newRevenue - (product.price * product.volume),
      marginImpact: (newMargin * newVolume) - (product.margin * product.volume),
    };
  };

  const whatIfResults = selectedProduct ? calculateWhatIf(selectedProduct, priceAdjustment) : null;

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
          <h2 className="text-2xl font-bold">Pricing & Margem</h2>
          <p className="text-muted-foreground">Análise de preços e otimização de margem</p>
        </div>
        <Dialog open={whatIfDialogOpen} onOpenChange={setWhatIfDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Calculator className="h-4 w-4 mr-2" />
              What-If de Preço
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Simulação de Preço</DialogTitle>
              <DialogDescription>
                Analise o impacto de mudanças de preço na receita e margem
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              <div>
                <Label>Selecionar Produto</Label>
                <select 
                  className="w-full mt-1 p-2 border rounded-md"
                  onChange={(e) => {
                    const product = products.find(p => p.id === e.target.value);
                    setSelectedProduct(product || null);
                  }}
                >
                  <option value="">Selecione um produto</option>
                  {products.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name} - {formatCurrency(product.price)}
                    </option>
                  ))}
                </select>
              </div>

              {selectedProduct && (
                <>
                  <div>
                    <Label>Ajuste de Preço: {priceAdjustment > 0 ? '+' : ''}{priceAdjustment}%</Label>
                    <Slider
                      value={[priceAdjustment]}
                      onValueChange={([value]) => setPriceAdjustment(value)}
                      max={50}
                      min={-30}
                      step={1}
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">-30% a +50%</p>
                  </div>

                  {whatIfResults && (
                    <div className="grid gap-4 md:grid-cols-2">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Situação Atual</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Preço:</span>
                            <span className="font-medium">{formatCurrency(selectedProduct.price)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Volume:</span>
                            <span className="font-medium">{selectedProduct.volume}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Margem:</span>
                            <span className="font-medium">{formatPercent(selectedProduct.marginPct)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Receita:</span>
                            <span className="font-medium">{formatCurrency(selectedProduct.price * selectedProduct.volume)}</span>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Cenário Simulado</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Preço:</span>
                            <span className="font-medium">{formatCurrency(whatIfResults.newPrice)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Volume:</span>
                            <span className="font-medium">{Math.round(whatIfResults.newVolume)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Margem:</span>
                            <span className="font-medium">{formatPercent(whatIfResults.newMarginPct)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Receita:</span>
                            <span className="font-medium">{formatCurrency(whatIfResults.newRevenue)}</span>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="md:col-span-2">
                        <CardHeader>
                          <CardTitle className="text-sm">Impacto</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Impacto na Receita:</span>
                            <span className={`font-medium ${whatIfResults.revenueImpact >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                              {whatIfResults.revenueImpact >= 0 ? '+' : ''}{formatCurrency(whatIfResults.revenueImpact)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Impacto na Margem:</span>
                            <span className={`font-medium ${whatIfResults.marginImpact >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                              {whatIfResults.marginImpact >= 0 ? '+' : ''}{formatCurrency(whatIfResults.marginImpact)}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* KPIs de Pricing */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              {products.length} produtos ativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Margem Média</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercent(averageMargin)}</div>
            <p className="text-xs text-muted-foreground">
              Ponderada por volume
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produto Top</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Alpha</div>
            <p className="text-xs text-muted-foreground">
              Maior margem: {formatPercent(0.40)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Oportunidade</CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">+R$ 45k</div>
            <p className="text-xs text-muted-foreground">
              Potencial otimização
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Produtos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Análise por Produto</CardTitle>
          <CardDescription>Performance de preço e margem por SKU</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Custo</TableHead>
                  <TableHead>Margem</TableHead>
                  <TableHead>Margem %</TableHead>
                  <TableHead>Volume</TableHead>
                  <TableHead>Receita</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                    <TableCell>{formatCurrency(product.price)}</TableCell>
                    <TableCell>{formatCurrency(product.cost)}</TableCell>
                    <TableCell>{formatCurrency(product.margin)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={product.marginPct > 0.35 ? 'text-emerald-600' : product.marginPct > 0.25 ? 'text-amber-600' : 'text-rose-600'}>
                          {formatPercent(product.marginPct)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{product.volume.toLocaleString()}</TableCell>
                    <TableCell>{formatCurrency(product.price * product.volume)}</TableCell>
                    <TableCell>
                      <Badge variant={product.marginPct > 0.35 ? 'default' : product.marginPct > 0.25 ? 'secondary' : 'destructive'}>
                        {product.marginPct > 0.35 ? 'Ótima' : product.marginPct > 0.25 ? 'Boa' : 'Baixa'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Recomendações */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recomendações do Ant'z Agent</CardTitle>
          <CardDescription>Sugestões baseadas em análise de dados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg bg-emerald-50 border-emerald-200">
              <div className="flex items-start gap-3">
                <TrendingUp className="h-5 w-5 text-emerald-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-emerald-800">Oportunidade de Aumento</h4>
                  <p className="text-sm text-emerald-700 mt-1">
                    Produto Beta pode suportar aumento de 8% no preço com impacto mínimo no volume. 
                    Potencial de +R$ 12k/mês em receita.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg bg-amber-50 border-amber-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-800">Atenção: Margem Baixa</h4>
                  <p className="text-sm text-amber-700 mt-1">
                    Produto Gamma com margem de 35% está abaixo do target. Revisar custos de produção 
                    ou considerar reposicionamento de preço.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
              <div className="flex items-start gap-3">
                <Package className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800">Bundle Opportunity</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Produtos Alpha + Delta frequentemente comprados juntos. Bundle pode aumentar 
                    ticket médio em 15% mantendo margem atrativa.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
