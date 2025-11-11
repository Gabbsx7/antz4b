# Ant'z For Business - Protótipo Interativo

> **Ecossistema inteligente de gestão financeira e operacional com IA proativa**

Um protótipo navegável completo que demonstra todo o ecossistema **Ant'z For Business**, com foco especial na **Colônia Financeira** e no **Ant'z Agent Proativo**. Desenvolvido com Next.js, React, TypeScript e Tailwind CSS.

## 🚀 Características Principais

### 🏗️ Arquitetura Moderna
- **Next.js 16** com App Router
- **TypeScript** para type safety
- **Tailwind CSS** + **shadcn/ui** para UI consistente
- **Zustand** para gerenciamento de estado
- **React Query** para simulação de APIs
- **Recharts** para visualizações de dados

### 🤖 Ant'z Agent Proativo
- Sistema de eventos em tempo real
- Alertas inteligentes baseados em dados
- Command Palette integrado (⌘K)
- Recomendações contextuais
- Interface conversacional

### 💰 Colônia Financeira Completa
- **FP&A**: Planejamento e cenários
- **Fluxo de Caixa**: Controle de entradas/saídas
- **AP/AR**: Gestão de contas a pagar/receber
- **Risco & Crédito**: Análise de scoring
- **Simulador**: Cenários what-if interativos
- **Collections**: Pipeline de cobrança
- **IR**: Relatórios para investidores
- **Pricing**: Otimização de preços
- **KPIs & OKRs**: Indicadores e metas

### 🧠 Intelligence Core
- Biblioteca de modelos ML
- Regras de negócio automatizadas
- Log de decisões e auditoria
- Explicabilidade de algoritmos

### 🔗 Integrações
- **Dash Integrator**: Dashboards externos
- **Data Gateways**: Conectores de dados
- **Colony Builder**: Construtor visual de pipelines
- **Ant Creator**: Biblioteca de funções modulares
- **Test Lab**: Ambiente de testes
- **Ant'z Cloud**: Armazenamento e computação em nuvem

## 🛠️ Instalação e Execução

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Setup Rápido

```bash
# Clone o repositório
git clone <repository-url>
cd antz-protótipo

# Instale as dependências
npm install

# Execute em modo de desenvolvimento
npm run dev

# Abra no navegador
open http://localhost:3000
```

### Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run start        # Servidor de produção
npm run lint         # Verificação de código
```

## 🎯 Tour Guiado

### 1. Overview Dashboard
- **URL**: `/`
- **Funcionalidades**: KPIs principais, gráficos interativos, snapshot do Agent
- **Destaques**: Filtros por unidade de negócio, moeda, período

### 2. Colônia Financeira
- **Base URL**: `/colony/*`
- **Módulos**: 9 aplicações financeiras integradas
- **Simulações**: Cenários interativos com sliders em tempo real

### 3. Ant'z Agent
- **Acesso**: Botão flutuante ou ⌘I
- **Recursos**: Feed de alertas, chat interativo, ações de 1 clique
- **Proatividade**: Eventos automáticos a cada 45-90 segundos

### 4. Command Palette
- **Atalho**: ⌘K (Ctrl+K no Windows)
- **Funcionalidades**: Navegação rápida, ações do Agent
- **Busca**: Por nome, descrição ou palavras-chave

## 🎨 Design System

### Cores Principais
- **Primária**: Emerald (verde)
- **Secundária**: Slate (cinza)
- **Alertas**: Rose (vermelho), Amber (amarelo)
- **Dados**: Blue (azul), Purple (roxo)

### Componentes Base
- Cards com `rounded-2xl` e sombras suaves
- Grid responsivo com breakpoints consistentes
- Tipografia Inter com hierarquia clara
- Dark mode automático via `next-themes`

### Responsividade
- **Mobile**: ≥360px
- **Tablet**: ≥768px  
- **Desktop**: ≥1024px
- **Wide**: ≥1280px

## 📊 Dados Mock

### Sistema de Simulação
- **Latência**: 200-600ms simulada
- **Erros**: 5% de chance de falha
- **Dados**: JSON fixtures + geradores dinâmicos
- **Tempo Real**: EventEmitter para eventos do Agent

### Estruturas Principais
```typescript
// KPIs
type KPI = {
  id: string;
  label: string;
  value: number;
  deltaPct?: number;
  fmt?: 'currency' | 'percent' | 'number';
}

// Eventos do Agent
type AgentEvent = {
  id: string;
  type: 'alert' | 'insight' | 'task';
  severity?: 'low' | 'medium' | 'high';
  title: string;
  cta?: { label: string; href: string };
}
```

## ⌨️ Atalhos de Teclado

| Atalho | Ação |
|--------|------|
| `⌘K` / `Ctrl+K` | Abrir Command Palette |
| `⌘I` / `Ctrl+I` | Abrir Ant'z Agent |
| `Esc` | Fechar modais/painéis |

## 🔧 Configurações

### Temas
- **Claro**: Interface padrão
- **Escuro**: Dark mode completo
- **Sistema**: Segue preferência do OS

### Personalização
- Moeda padrão (BRL, USD, EUR)
- Fuso horário
- Unidade de negócio
- Idioma (pt-BR padrão)

## 📱 Funcionalidades Interativas

### Simuladores em Tempo Real
- **FP&A**: Sliders para preço, volume, CAC, churn
- **Pricing**: What-if de preços com elasticidade
- **Fluxo de Caixa**: Adição de entradas/saídas

### Ant'z Agent Proativo
- **Alertas Automáticos**: Margem baixa, DSO alto, burn crítico
- **Ações de 1 Clique**: Navegação contextual, filtros aplicados
- **Chat Inteligente**: Respostas baseadas em contexto

### Exportações
- **IR**: Relatórios em PDF/Excel simulados
- **Logs**: Export do Test Lab
- **Cenários**: Salvamento de simulações

## 🏗️ Arquitetura de Componentes

```
src/
├── app/                 # Pages (App Router)
├── components/
│   ├── layout/         # TopNav, Sidebar
│   ├── charts/         # KpiCard, LineChart, etc.
│   ├── agent/          # AgentButton, AgentPanel
│   └── ui/             # shadcn/ui components
├── lib/
│   ├── mocks.ts        # API simulada
│   ├── store.ts        # Estado global
│   ├── types.ts        # Tipagens
│   └── format.ts       # Formatadores
└── mocks/              # Dados JSON
```

## 🎭 Personas de Teste

### 1. CFO/Controller
- **Foco**: Overview, FP&A, IR
- **Cenários**: Análise de margem, projeções, relatórios

### 2. Analista Financeiro  
- **Foco**: Fluxo de Caixa, AP/AR, Simulador
- **Cenários**: Controle diário, aging, what-if

### 3. Gerente de Risco
- **Foco**: Risco & Crédito, Collections
- **Cenários**: Scoring, políticas, cobrança

### 4. Head de BI/Data
- **Foco**: Intelligence Core, Data Gateways, Colony Builder
- **Cenários**: Modelos ML, pipelines, integrações

## 🚨 Limitações do Protótipo

### Não Implementado
- ❌ Backend real / APIs
- ❌ Autenticação / Autorização
- ❌ Persistência de dados
- ❌ Webhooks reais
- ❌ Integrações externas

### Simulado
- ✅ Latência de rede
- ✅ Erros ocasionais
- ✅ Eventos em tempo real
- ✅ Processamento assíncrono
- ✅ Notificações push

## 🎯 Casos de Uso Demonstráveis

### Demo Executiva (5 min)
1. **Overview** → KPIs principais + Agent snapshot
2. **Agent Proativo** → Alerta de margem + navegação contextual
3. **Simulador** → What-if de preço em tempo real
4. **IR** → Export de relatório executivo

### Demo Técnica (15 min)
1. **Colony Builder** → Construção visual de pipeline
2. **Intelligence Core** → Modelos ML + explicabilidade
3. **Data Gateways** → Status de conectores
4. **Ant'z Cloud** → Armazenamento e workspaces ML
5. **Test Lab** → Execução com logs em tempo real

### Demo Completa (30 min)
- Tour por todos os módulos
- Interações do Agent
- Simulações avançadas
- Configurações e administração

## 📈 Métricas de Demonstração

### Performance
- **Carregamento inicial**: < 3s
- **Navegação**: < 500ms
- **Simulações**: Tempo real
- **Responsividade**: 360px+

### Engajamento
- **Agent Events**: 3-5 por minuto
- **Interações**: Click-through funcional
- **Simulações**: Feedback visual imediato

## 🔮 Roadmap Futuro

### Fase 2: Backend Real
- API REST/GraphQL
- Banco de dados real
- Autenticação JWT
- Webhooks funcionais

### Fase 3: IA Avançada
- Modelos ML reais
- NLP para Agent
- Predições avançadas
- AutoML pipeline

### Fase 4: Integrações
- ERPs reais (SAP, Oracle)
- APIs bancárias
- Dashboards BI
- Sistemas externos

## 🤝 Contribuição

### Estrutura de Commits
```
feat: nova funcionalidade
fix: correção de bug
docs: documentação
style: formatação
refactor: refatoração
test: testes
```

### Desenvolvimento Local
1. Fork o repositório
2. Crie branch feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit mudanças (`git commit -m 'feat: adiciona nova funcionalidade'`)
4. Push para branch (`git push origin feature/nova-funcionalidade`)
5. Abra Pull Request

## 📄 Licença

Este é um protótipo demonstrativo. Todos os direitos reservados.

---

**Ant'z For Business** - Transformando dados em decisões inteligentes 🐜✨