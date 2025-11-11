// Sistema de eventos proativos do Ant'z Agent

import { EventEmitter } from 'events';
import type { AgentEvent } from './types';

class AgentEventSystem extends EventEmitter {
  private intervalId: NodeJS.Timeout | null = null;
  private eventQueue: AgentEvent[] = [];
  private isRunning = false;

  // Eventos pré-definidos que podem ser disparados
  private eventTemplates: Omit<AgentEvent, 'id' | 'timestamp'>[] = [
    {
      type: 'alert',
      severity: 'high',
      title: 'Margem caiu 2,1pp na BU Sul',
      body: 'A margem bruta da unidade Sul apresentou queda significativa. Principais fatores: aumento de custo e desconto promocional.',
      cta: { label: 'Abrir Pricing', href: '/colony/pricing-margin?bu=Sul' },
      status: 'open',
    },
    {
      type: 'insight',
      severity: 'medium',
      title: 'DSO subiu para 54 dias',
      body: 'O prazo médio de recebimento aumentou 8% no último mês. Concentração em clientes categoria B e C.',
      cta: { label: 'Ver AP/AR', href: '/colony/ap-ar?sort=days_overdue' },
      status: 'open',
    },
    {
      type: 'alert',
      severity: 'high',
      title: 'Burn rate crítico detectado',
      body: 'Taxa de queima atual de R$ 180k/mês com runway de apenas 9 meses. Revisão urgente necessária.',
      cta: { label: 'Ver Fluxo de Caixa', href: '/colony/cashflow' },
      status: 'open',
    },
    {
      type: 'task',
      severity: 'medium',
      title: 'Criar régua de cobrança 30–60 dias',
      body: 'Usar template SMB v2 para clientes com atraso entre 30-60 dias. Estimativa: 47 clientes afetados.',
      status: 'open',
    },
    {
      type: 'insight',
      severity: 'low',
      title: 'Oportunidade de otimização fiscal',
      body: 'Identificada possibilidade de economia de 12% em impostos através de reorganização societária.',
      status: 'open',
    },
    {
      type: 'alert',
      severity: 'medium',
      title: 'Concentração de risco em cliente único',
      body: 'Cliente Alpha representa 23% do AR total. Recomendo diversificação da carteira.',
      cta: { label: 'Ver Risco & Crédito', href: '/colony/risk-credit' },
      status: 'open',
    },
    {
      type: 'insight',
      severity: 'medium',
      title: 'Sazonalidade detectada nas vendas',
      body: 'Padrão recorrente de queda de 15% nas vendas em janeiro. Considere estratégia de retenção.',
      cta: { label: 'Ver Simulador', href: '/colony/simulator' },
      status: 'open',
    },
    {
      type: 'task',
      severity: 'low',
      title: 'Atualizar política de crédito',
      body: 'Política atual desatualizada há 6 meses. Revisar limites e critérios de aprovação.',
      status: 'open',
    },
  ];

  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    
    // Dispara eventos a cada 45-90 segundos
    this.intervalId = setInterval(() => {
      this.generateRandomEvent();
    }, Math.random() * 45000 + 45000);
    
    // Dispara o primeiro evento após 10 segundos
    setTimeout(() => {
      this.generateRandomEvent();
    }, 10000);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
  }

  private generateRandomEvent() {
    const template = this.eventTemplates[Math.floor(Math.random() * this.eventTemplates.length)];
    
    const event: AgentEvent = {
      ...template,
      id: `agent-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    };

    this.emit('newEvent', event);
  }

  // Método para disparar evento específico (para testes)
  triggerEvent(eventType: string) {
    const template = this.eventTemplates.find(t => t.title.toLowerCase().includes(eventType.toLowerCase()));
    if (!template) return;

    const event: AgentEvent = {
      ...template,
      id: `agent-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    };

    this.emit('newEvent', event);
  }

  // Simula processamento de comando do usuário
  async processCommand(command: string): Promise<string> {
    // Simula delay de processamento
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const lowerCommand = command.toLowerCase();

    if (lowerCommand.includes('margem') || lowerCommand.includes('margin')) {
      return 'A margem bruta atual está em 41%, com queda de 2,1pp no último mês. A BU Sul apresenta a maior variação negativa. Recomendo análise detalhada dos custos de matéria-prima e revisão da política de descontos.';
    }

    if (lowerCommand.includes('dso') || lowerCommand.includes('receb')) {
      return 'O DSO atual é de 54 dias, 8% acima do período anterior. Principais fatores: concentração em clientes B/C (67% do total) e aumento de 12% nos prazos médios de pagamento. Sugestão: implementar régua de cobrança automatizada.';
    }

    if (lowerCommand.includes('burn') || lowerCommand.includes('queima')) {
      return 'Burn rate atual: R$ 180k/mês, resultando em runway de 9 meses. Principais componentes: folha (45%), marketing (25%), infraestrutura (20%). Recomendo otimização imediata dos gastos não-essenciais.';
    }

    if (lowerCommand.includes('briefing') || lowerCommand.includes('board')) {
      return `**Briefing Executivo - ${new Date().toLocaleDateString('pt-BR')}**

• **Receita**: R$ 820k (+12% vs mês anterior)
• **Margem**: 41% (-2,1pp) - atenção BU Sul
• **DSO**: 54 dias (+8%) - concentração B/C
• **Burn**: R$ 180k/mês - runway 9 meses
• **Inadimplência**: 8,7% (+1,4pp)

**Ações Recomendadas:**
1. Revisar política de preços BU Sul
2. Implementar cobrança automatizada
3. Otimizar gastos operacionais
4. Diversificar carteira de clientes`;
    }

    if (lowerCommand.includes('cenário') || lowerCommand.includes('simulação')) {
      return 'Criei um novo cenário baseado nas condições atuais. Principais premissas: preço +5%, volume estável, CAC -10%. Resultado projetado: margem de 43% e receita de R$ 861k/mês. Cenário salvo como "Otimização Q4 2025".';
    }

    // Resposta genérica
    return `Analisei sua solicitação sobre "${command}". Com base nos dados atuais, identifiquei algumas oportunidades de otimização. Posso gerar análises mais específicas se você detalhar qual aspecto gostaria de explorar.`;
  }
}

// Instância singleton
export const agentEventSystem = new AgentEventSystem();

// Hook para usar o sistema de eventos em componentes React
export function useAgentEvents() {
  return {
    start: () => agentEventSystem.start(),
    stop: () => agentEventSystem.stop(),
    triggerEvent: (eventType: string) => agentEventSystem.triggerEvent(eventType),
    processCommand: (command: string) => agentEventSystem.processCommand(command),
    on: (event: string, listener: (...args: any[]) => void) => agentEventSystem.on(event, listener),
    off: (event: string, listener: (...args: any[]) => void) => agentEventSystem.off(event, listener),
  };
}
