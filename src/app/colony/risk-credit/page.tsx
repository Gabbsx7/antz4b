'use client';

import { useState, useEffect } from 'react';
import { Shield, AlertTriangle, TrendingUp, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { fetchRiskScores } from '@/lib/mocks';
import { formatCurrency, formatPercent } from '@/lib/format';
import type { RiskScore } from '@/lib/types';

export default function RiskCreditPage() {
  const [riskScores, setRiskScores] = useState<RiskScore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchRiskScores();
        setRiskScores(data);
      } catch (error) {
        console.error('Erro ao carregar scores de risco:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getScoreColor = (score: RiskScore['score']) => {
    switch (score) {
      case 'A': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'B': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'C': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'D': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'E': return 'bg-rose-50 text-rose-700 border-rose-200';
    }
  };

  const scoreCounts = {
    A: riskScores.filter(r => r.score === 'A').length,
    B: riskScores.filter(r => r.score === 'B').length,
    C: riskScores.filter(r => r.score === 'C').length,
    D: riskScores.filter(r => r.score === 'D').length,
    E: riskScores.filter(r => r.score === 'E').length,
  };

  const totalExposure = riskScores.reduce((sum, r) => sum + r.exposure, 0);
  const highRiskExposure = riskScores.filter(r => ['D', 'E'].includes(r.score)).reduce((sum, r) => sum + r.exposure, 0);

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
      <div>
        <h2 className="text-2xl font-bold">Risco & Crédito</h2>
        <p className="text-muted-foreground">Análise de risco e gestão de crédito</p>
      </div>

      {/* KPIs de Risco */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exposição Total</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalExposure)}</div>
            <p className="text-xs text-muted-foreground">
              {riskScores.length} clientes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alto Risco</CardTitle>
            <AlertTriangle className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-600">{formatCurrency(highRiskExposure)}</div>
            <p className="text-xs text-muted-foreground">
              {formatPercent(highRiskExposure / totalExposure)} da exposição
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Score Médio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">B+</div>
            <p className="text-xs text-muted-foreground">
              Carteira balanceada
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inadimplência</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.7%</div>
            <p className="text-xs text-muted-foreground">
              +1.4pp vs mês anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Distribuição de Scores */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Distribuição de Scores</CardTitle>
          <CardDescription>Classificação da carteira por nível de risco</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-5">
            <div className="text-center p-4 border rounded-lg bg-emerald-50">
              <h4 className="font-medium text-emerald-700">Score A</h4>
              <p className="text-2xl font-bold text-emerald-600">{scoreCounts.A}</p>
              <p className="text-sm text-muted-foreground">Baixo Risco</p>
            </div>
            <div className="text-center p-4 border rounded-lg bg-blue-50">
              <h4 className="font-medium text-blue-700">Score B</h4>
              <p className="text-2xl font-bold text-blue-600">{scoreCounts.B}</p>
              <p className="text-sm text-muted-foreground">Risco Moderado</p>
            </div>
            <div className="text-center p-4 border rounded-lg bg-amber-50">
              <h4 className="font-medium text-amber-700">Score C</h4>
              <p className="text-2xl font-bold text-amber-600">{scoreCounts.C}</p>
              <p className="text-sm text-muted-foreground">Risco Médio</p>
            </div>
            <div className="text-center p-4 border rounded-lg bg-orange-50">
              <h4 className="font-medium text-orange-700">Score D</h4>
              <p className="text-2xl font-bold text-orange-600">{scoreCounts.D}</p>
              <p className="text-sm text-muted-foreground">Alto Risco</p>
            </div>
            <div className="text-center p-4 border rounded-lg bg-rose-50">
              <h4 className="font-medium text-rose-700">Score E</h4>
              <p className="text-2xl font-bold text-rose-600">{scoreCounts.E}</p>
              <p className="text-sm text-muted-foreground">Risco Crítico</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Scores */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Scores Individuais</CardTitle>
          <CardDescription>Detalhamento por cliente</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Probabilidade</TableHead>
                  <TableHead>Limite</TableHead>
                  <TableHead>Exposição</TableHead>
                  <TableHead>Utilização</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {riskScores.slice(0, 10).map((risk) => (
                  <TableRow key={risk.id}>
                    <TableCell className="font-medium">{risk.entity}</TableCell>
                    <TableCell>
                      <Badge className={getScoreColor(risk.score)}>
                        {risk.score}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatPercent(risk.probability)}</TableCell>
                    <TableCell>{formatCurrency(risk.limit)}</TableCell>
                    <TableCell>{formatCurrency(risk.exposure)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              risk.exposure / risk.limit > 0.8 ? 'bg-rose-500' :
                              risk.exposure / risk.limit > 0.6 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.min(100, (risk.exposure / risk.limit) * 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatPercent(risk.exposure / risk.limit)}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Políticas de Crédito */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Políticas de Crédito</CardTitle>
          <CardDescription>Regras e limites por classificação</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <h4 className="font-medium">Limites por Score</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Score A:</span>
                  <span className="font-medium">Até R$ 100k</span>
                </div>
                <div className="flex justify-between">
                  <span>Score B:</span>
                  <span className="font-medium">Até R$ 50k</span>
                </div>
                <div className="flex justify-between">
                  <span>Score C:</span>
                  <span className="font-medium">Até R$ 25k</span>
                </div>
                <div className="flex justify-between">
                  <span>Score D:</span>
                  <span className="font-medium">Até R$ 10k</span>
                </div>
                <div className="flex justify-between">
                  <span>Score E:</span>
                  <span className="font-medium text-rose-600">Bloqueado</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Prazos de Pagamento</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Score A:</span>
                  <span className="font-medium">30-60 dias</span>
                </div>
                <div className="flex justify-between">
                  <span>Score B:</span>
                  <span className="font-medium">30 dias</span>
                </div>
                <div className="flex justify-between">
                  <span>Score C:</span>
                  <span className="font-medium">15 dias</span>
                </div>
                <div className="flex justify-between">
                  <span>Score D:</span>
                  <span className="font-medium">À vista</span>
                </div>
                <div className="flex justify-between">
                  <span>Score E:</span>
                  <span className="font-medium text-rose-600">À vista</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
