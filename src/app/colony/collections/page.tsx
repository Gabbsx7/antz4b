'use client';

import { Users, Mail, Phone, Calendar, Target } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function CollectionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Collections</h2>
        <p className="text-muted-foreground">Gestão de cobrança e recuperação de crédito</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Cobrança</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">clientes ativos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Recuperação</CardTitle>
            <Target className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">68%</div>
            <p className="text-xs text-muted-foreground">últimos 30 dias</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor em Cobrança</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 1.2M</div>
            <p className="text-xs text-muted-foreground">total em aberto</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximas Ações</CardTitle>
            <Mail className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">23</div>
            <p className="text-xs text-muted-foreground">hoje</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Pipeline de Cobrança</CardTitle>
          <CardDescription>Fluxo de recuperação por estágio</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center p-4 border rounded-lg bg-blue-50">
              <h4 className="font-medium text-blue-700">Notificação</h4>
              <p className="text-2xl font-bold text-blue-600">12</p>
              <p className="text-sm text-muted-foreground">1-7 dias</p>
            </div>
            <div className="text-center p-4 border rounded-lg bg-amber-50">
              <h4 className="font-medium text-amber-700">Cobrança Ativa</h4>
              <p className="text-2xl font-bold text-amber-600">18</p>
              <p className="text-sm text-muted-foreground">8-30 dias</p>
            </div>
            <div className="text-center p-4 border rounded-lg bg-orange-50">
              <h4 className="font-medium text-orange-700">Negociação</h4>
              <p className="text-2xl font-bold text-orange-600">11</p>
              <p className="text-sm text-muted-foreground">31-60 dias</p>
            </div>
            <div className="text-center p-4 border rounded-lg bg-rose-50">
              <h4 className="font-medium text-rose-700">Jurídico</h4>
              <p className="text-2xl font-bold text-rose-600">6</p>
              <p className="text-sm text-muted-foreground">+60 dias</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center py-12 text-muted-foreground">
        <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-medium mb-2">Módulo Collections</h3>
        <p className="mb-4">Sistema completo de cobrança em desenvolvimento</p>
        <div className="space-y-2 text-sm">
          <p>✓ Réguas de cobrança automatizadas</p>
          <p>✓ Templates de comunicação</p>
          <p>✓ Integração com WhatsApp e Email</p>
          <p>✓ Dashboard de performance</p>
          <p>✓ Acordos e parcelamentos</p>
        </div>
        <Button className="mt-6" variant="outline">
          Solicitar Demo Completa
        </Button>
      </div>
    </div>
  );
}
