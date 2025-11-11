'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Calculator, 
  LayoutDashboard, 
  TrendingUp, 
  DollarSign, 
  CreditCard, 
  Shield, 
  Users, 
  PieChart, 
  Target,
  Brain,
  BarChart3,
  Database,
  Workflow,
  Zap,
  TestTube,
  Settings,
  Bot,
  Cloud
} from 'lucide-react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { useAppStore } from '@/lib/store';

interface Command {
  id: string;
  title: string;
  description?: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  category: 'navigation' | 'agent' | 'actions';
  keywords?: string[];
}

const commands: Command[] = [
  // Navigation
  { 
    id: 'overview', 
    title: 'Overview', 
    description: 'Visão geral dos KPIs', 
    href: '/', 
    icon: LayoutDashboard, 
    category: 'navigation',
    keywords: ['dashboard', 'home', 'início', 'kpis']
  },
  { 
    id: 'fpna', 
    title: 'FP&A', 
    description: 'Planejamento e orçamento', 
    href: '/colony/fpna', 
    icon: TrendingUp, 
    category: 'navigation',
    keywords: ['planejamento', 'orçamento', 'cenários']
  },
  { 
    id: 'cashflow', 
    title: 'Fluxo de Caixa', 
    description: 'Entradas e saídas', 
    href: '/colony/cashflow', 
    icon: DollarSign, 
    category: 'navigation',
    keywords: ['caixa', 'fluxo', 'burn', 'runway']
  },
  { 
    id: 'apar', 
    title: 'AP/AR', 
    description: 'Contas a pagar e receber', 
    href: '/colony/ap-ar', 
    icon: CreditCard, 
    category: 'navigation',
    keywords: ['contas', 'pagar', 'receber', 'faturas']
  },
  { 
    id: 'risk', 
    title: 'Risco & Crédito', 
    description: 'Análise de risco', 
    href: '/colony/risk-credit', 
    icon: Shield, 
    category: 'navigation',
    keywords: ['risco', 'crédito', 'score', 'inadimplência']
  },
  { 
    id: 'simulator', 
    title: 'Simulador', 
    description: 'Simulação de cenários', 
    href: '/colony/simulator', 
    icon: Calculator, 
    category: 'navigation',
    keywords: ['simulação', 'cenários', 'what-if']
  },
  { 
    id: 'collections', 
    title: 'Collections', 
    description: 'Cobrança e recuperação', 
    href: '/colony/collections', 
    icon: Users, 
    category: 'navigation',
    keywords: ['cobrança', 'recuperação', 'régua']
  },
  { 
    id: 'ir', 
    title: 'Investor Relations', 
    description: 'Relatórios para investidores', 
    href: '/colony/ir', 
    icon: PieChart, 
    category: 'navigation',
    keywords: ['investidores', 'relatórios', 'ir']
  },
  { 
    id: 'pricing', 
    title: 'Pricing & Margem', 
    description: 'Análise de preços e margem', 
    href: '/colony/pricing-margin', 
    icon: TrendingUp, 
    category: 'navigation',
    keywords: ['preços', 'margem', 'produtos']
  },
  { 
    id: 'okrs', 
    title: 'KPIs & OKRs', 
    description: 'Indicadores e objetivos', 
    href: '/colony/kpis-okrs', 
    icon: Target, 
    category: 'navigation',
    keywords: ['kpis', 'okrs', 'metas', 'objetivos']
  },
  { 
    id: 'intelligence', 
    title: 'Intelligence Core', 
    description: 'Modelos e algoritmos', 
    href: '/intelligence-core', 
    icon: Brain, 
    category: 'navigation',
    keywords: ['inteligência', 'modelos', 'algoritmos']
  },
  { 
    id: 'dash', 
    title: 'Dash Integrator', 
    description: 'Dashboards externos', 
    href: '/dash-integrator', 
    icon: BarChart3, 
    category: 'navigation',
    keywords: ['dashboards', 'integração', 'bi']
  },
  { 
    id: 'gateways', 
    title: 'Data Gateways', 
    description: 'Fontes de dados', 
    href: '/data-gateways', 
    icon: Database, 
    category: 'navigation',
    keywords: ['dados', 'fontes', 'conectores']
  },
  { 
    id: 'builder', 
    title: 'Colony Builder', 
    description: 'Construtor de pipelines', 
    href: '/colony-builder', 
    icon: Workflow, 
    category: 'navigation',
    keywords: ['pipeline', 'construtor', 'fluxo']
  },
  { 
    id: 'creator', 
    title: 'Ant Creator', 
    description: 'Biblioteca de funções', 
    href: '/ant-creator', 
    icon: Zap, 
    category: 'navigation',
    keywords: ['funções', 'formigas', 'biblioteca']
  },
  { 
    id: 'testlab', 
    title: 'Test Lab', 
    description: 'Ambiente de testes', 
    href: '/test-lab', 
    icon: TestTube, 
    category: 'navigation',
    keywords: ['testes', 'laboratório', 'debug']
  },
  { 
    id: 'cloud', 
    title: 'Ant\'z Cloud', 
    description: 'Armazenamento e computação em nuvem', 
    href: '/antz-cloud', 
    icon: Cloud, 
    category: 'navigation',
    keywords: ['nuvem', 'cloud', 'armazenamento', 'arquivos', 'databases', 'workspaces']
  },
  { 
    id: 'settings', 
    title: 'Configurações', 
    description: 'Configurações do sistema', 
    href: '/admin/settings', 
    icon: Settings, 
    category: 'navigation',
    keywords: ['configurações', 'admin', 'sistema']
  },

  // Agent Actions
  { 
    id: 'agent-margin', 
    title: 'Explicar variação de margem', 
    description: 'Análise detalhada da margem', 
    icon: Bot, 
    category: 'agent',
    keywords: ['margem', 'variação', 'análise']
  },
  { 
    id: 'agent-briefing', 
    title: 'Gerar briefing para board', 
    description: 'Resumo executivo', 
    icon: Bot, 
    category: 'agent',
    keywords: ['briefing', 'board', 'resumo']
  },
  { 
    id: 'agent-collections', 
    title: 'Criar régua de cobrança', 
    description: 'Template de cobrança', 
    icon: Bot, 
    category: 'agent',
    keywords: ['cobrança', 'régua', 'template']
  },
  { 
    id: 'agent-burn', 
    title: 'Analisar burn rate', 
    description: 'Análise de queima de caixa', 
    icon: Bot, 
    category: 'agent',
    keywords: ['burn', 'queima', 'caixa']
  },
];

export function CommandPalette() {
  const router = useRouter();
  const { commandPaletteOpen, setCommandPaletteOpen, setAgentPanelOpen, addAgentMessage } = useAppStore();
  const [search, setSearch] = useState('');

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  const handleSelect = (command: Command) => {
    setCommandPaletteOpen(false);
    setSearch('');

    if (command.category === 'navigation' && command.href) {
      router.push(command.href);
    } else if (command.category === 'agent') {
      // Abre o Agent Panel e adiciona a mensagem
      setAgentPanelOpen(true);
      
      // Simula envio da mensagem para o agent
      const message = command.title.replace('Explicar ', '').replace('Gerar ', '').replace('Criar ', '').replace('Analisar ', '');
      addAgentMessage({
        id: `cmd-${Date.now()}`,
        type: 'user',
        content: message,
        timestamp: new Date().toISOString(),
      });
    }
  };

  const filteredCommands = commands.filter(command => {
    const searchLower = search.toLowerCase();
    return (
      command.title.toLowerCase().includes(searchLower) ||
      command.description?.toLowerCase().includes(searchLower) ||
      command.keywords?.some(keyword => keyword.toLowerCase().includes(searchLower))
    );
  });

  const navigationCommands = filteredCommands.filter(cmd => cmd.category === 'navigation');
  const agentCommands = filteredCommands.filter(cmd => cmd.category === 'agent');

  return (
    <CommandDialog open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen}>
      <CommandInput 
        placeholder="Digite um comando ou pesquise..." 
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
        
        {navigationCommands.length > 0 && (
          <CommandGroup heading="Navegação">
            {navigationCommands.map((command) => (
              <CommandItem
                key={command.id}
                onSelect={() => handleSelect(command)}
                className="flex items-center gap-2"
              >
                <command.icon className="h-4 w-4" />
                <div className="flex flex-col">
                  <span>{command.title}</span>
                  {command.description && (
                    <span className="text-xs text-muted-foreground">{command.description}</span>
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {agentCommands.length > 0 && (
          <>
            {navigationCommands.length > 0 && <CommandSeparator />}
            <CommandGroup heading="Ant'z Agent">
              {agentCommands.map((command) => (
                <CommandItem
                  key={command.id}
                  onSelect={() => handleSelect(command)}
                  className="flex items-center gap-2"
                >
                  <command.icon className="h-4 w-4 text-emerald-600" />
                  <div className="flex flex-col">
                    <span>{command.title}</span>
                    {command.description && (
                      <span className="text-xs text-muted-foreground">{command.description}</span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
