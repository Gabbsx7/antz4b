'use client';

import { Brain, Code, Database, TrendingUp, Zap, FileText, Play, Settings } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const models = [
  {
    id: 'credit-score',
    name: 'Credit Score Model',
    type: 'Regressão',
    accuracy: 0.87,
    status: 'active',
    description: 'Modelo de credit scoring baseado em histórico de pagamentos e dados comportamentais',
    features: ['Histórico de Pagamentos', 'Renda Declarada', 'Score Externo', 'Comportamento Transacional'],
    lastTrained: '2025-01-15',
  },
  {
    id: 'churn-prediction',
    name: 'Churn Prediction',
    type: 'Classificação',
    accuracy: 0.82,
    status: 'active',
    description: 'Predição de churn de clientes baseada em padrões de uso e engajamento',
    features: ['Frequência de Uso', 'Valor Transacionado', 'Suporte Contactado', 'Tempo desde Último Login'],
    lastTrained: '2025-01-10',
  },
  {
    id: 'fraud-detection',
    name: 'Fraud Detection',
    type: 'Anomalia',
    accuracy: 0.94,
    status: 'training',
    description: 'Detecção de transações fraudulentas em tempo real',
    features: ['Valor da Transação', 'Horário', 'Localização', 'Padrão Histórico'],
    lastTrained: '2025-01-08',
  },
  {
    id: 'price-optimization',
    name: 'Price Optimization',
    type: 'Otimização',
    accuracy: 0.79,
    status: 'draft',
    description: 'Otimização de preços baseada em elasticidade e concorrência',
    features: ['Preço Atual', 'Demanda Histórica', 'Preços Concorrentes', 'Sazonalidade'],
    lastTrained: '2025-01-05',
  },
];

const businessRules = [
  {
    id: 'credit-limit',
    name: 'Limite de Crédito Automático',
    description: 'Aprovação automática de limites baseada em score e renda',
    conditions: 'Score > 700 AND Renda > R$ 3.000',
    action: 'Aprovar até R$ 10.000',
    status: 'active',
  },
  {
    id: 'discount-approval',
    name: 'Aprovação de Desconto',
    description: 'Regra para aprovação automática de descontos comerciais',
    conditions: 'Desconto <= 15% AND Cliente Premium',
    action: 'Aprovar automaticamente',
    status: 'active',
  },
  {
    id: 'payment-terms',
    name: 'Prazo de Pagamento',
    description: 'Definição automática de prazos baseada em histórico',
    conditions: 'Atraso médio < 5 dias nos últimos 6 meses',
    action: 'Prazo até 60 dias',
    status: 'active',
  },
];

export default function IntelligenceCorePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Intelligence Core</h2>
        <p className="text-muted-foreground">Centro de inteligência artificial e automação de decisões</p>
      </div>

      <Tabs defaultValue="models" className="space-y-4">
        <TabsList>
          <TabsTrigger value="models">Modelos ML</TabsTrigger>
          <TabsTrigger value="rules">Regras de Negócio</TabsTrigger>
          <TabsTrigger value="decisions">Log de Decisões</TabsTrigger>
        </TabsList>

        <TabsContent value="models" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Modelos Ativos</CardTitle>
                <Brain className="h-4 w-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-600">
                  {models.filter(m => m.status === 'active').length}
                </div>
                <p className="text-xs text-muted-foreground">em produção</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Acurácia Média</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(models.reduce((acc, m) => acc + m.accuracy, 0) / models.length * 100)}%
                </div>
                <p className="text-xs text-muted-foreground">todos os modelos</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Decisões/Dia</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,847</div>
                <p className="text-xs text-muted-foreground">automatizadas</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Economia</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ 45k</div>
                <p className="text-xs text-muted-foreground">por mês</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {models.map((model) => (
              <Card key={model.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{model.name}</CardTitle>
                      <CardDescription>{model.description}</CardDescription>
                    </div>
                    <Badge variant={
                      model.status === 'active' ? 'default' : 
                      model.status === 'training' ? 'secondary' : 'outline'
                    }>
                      {model.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Tipo:</span>
                      <p className="font-medium">{model.type}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Acurácia:</span>
                      <p className="font-medium">{(model.accuracy * 100).toFixed(1)}%</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Último Treino:</span>
                      <p className="font-medium">{new Date(model.lastTrained).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Features:</span>
                      <p className="font-medium">{model.features.length}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Features Principais</h4>
                    <div className="flex flex-wrap gap-1">
                      {model.features.slice(0, 3).map((feature) => (
                        <Badge key={feature} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {model.features.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{model.features.length - 3} mais
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" className="flex-1">
                          <FileText className="h-3 w-3 mr-1" />
                          Detalhes
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{model.name}</DialogTitle>
                          <DialogDescription>{model.description}</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium mb-2">Todas as Features</h4>
                            <div className="grid grid-cols-2 gap-2">
                              {model.features.map((feature) => (
                                <div key={feature} className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                  <span className="text-sm">{feature}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-2">Performance</h4>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Precisão:</span>
                                <p className="font-medium">{(model.accuracy * 100).toFixed(1)}%</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Recall:</span>
                                <p className="font-medium">{((model.accuracy - 0.05) * 100).toFixed(1)}%</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">F1-Score:</span>
                                <p className="font-medium">{((model.accuracy - 0.02) * 100).toFixed(1)}%</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    {model.status === 'active' && (
                      <Button size="sm" variant="outline">
                        <Play className="h-3 w-3 mr-1" />
                        Testar
                      </Button>
                    )}
                    
                    <Button size="sm" variant="ghost">
                      <Settings className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Regras de Negócio Ativas</CardTitle>
              <CardDescription>Automações baseadas em regras configuráveis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {businessRules.map((rule) => (
                  <div key={rule.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{rule.name}</h4>
                      <Badge variant={rule.status === 'active' ? 'default' : 'secondary'}>
                        {rule.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{rule.description}</p>
                    
                    <div className="grid gap-2 text-sm">
                      <div>
                        <span className="font-medium">Condições: </span>
                        <code className="bg-muted px-2 py-1 rounded text-xs">{rule.conditions}</code>
                      </div>
                      <div>
                        <span className="font-medium">Ação: </span>
                        <span className="text-emerald-600">{rule.action}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="decisions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Log de Decisões Automatizadas</CardTitle>
              <CardDescription>Auditoria de decisões tomadas pelos modelos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Log de Decisões</h3>
                <p className="mb-4">Sistema de auditoria em desenvolvimento</p>
                <div className="space-y-2 text-sm">
                  <p>✓ Rastreamento completo de decisões</p>
                  <p>✓ Explicabilidade de modelos ML</p>
                  <p>✓ Histórico de performance</p>
                  <p>✓ Alertas de drift de modelo</p>
                  <p>✓ Compliance e governança</p>
                </div>
                <Button className="mt-6" variant="outline">
                  Solicitar Demo Completa
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
