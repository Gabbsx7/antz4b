// Sistema de mocks com latência e erros simulados

import kpisData from '@/mocks/kpis.json';
import agentEventsData from '@/mocks/agent-events.json';
import type { KPI, AgentEvent, CashPoint, Invoice, Scenario, Product, RiskScore, OKR } from './types';

// Simula latência de rede
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simula erro ocasional (5% de chance)
const shouldError = () => Math.random() < 0.05;

// Wrapper para simular API calls
async function mockApiCall<T>(data: T, errorMessage = 'Erro na API'): Promise<T> {
  const latency = Math.random() * 400 + 200; // 200-600ms
  await delay(latency);
  
  if (shouldError()) {
    throw new Error(errorMessage);
  }
  
  return data;
}

// KPIs
export async function fetchKPIs(): Promise<KPI[]> {
  return mockApiCall(kpisData as KPI[], 'Erro ao carregar KPIs');
}

// Agent Events
export async function fetchAgentEvents(): Promise<AgentEvent[]> {
  return mockApiCall(agentEventsData as AgentEvent[], 'Erro ao carregar eventos do Agent');
}

// Fluxo de Caixa
export async function fetchCashFlow(): Promise<CashPoint[]> {
  const data: CashPoint[] = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);
  
  for (let i = 0; i < 60; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    const inflow = Math.random() * 50000 + 10000;
    const outflow = Math.random() * 40000 + 15000;
    const balance = i === 0 ? 500000 : data[i - 1].balance + inflow - outflow;
    
    data.push({
      date: date.toISOString().split('T')[0],
      inflow,
      outflow,
      balance,
      burn: outflow - inflow,
    });
  }
  
  return mockApiCall(data, 'Erro ao carregar fluxo de caixa');
}

// Contas a Pagar/Receber
export async function fetchInvoices(): Promise<Invoice[]> {
  const invoices: Invoice[] = [];
  const statuses: Invoice['status'][] = ['open', 'paid', 'overdue'];
  const kinds: Invoice['kind'][] = ['AP', 'AR'];
  
  for (let i = 1; i <= 50; i++) {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + (Math.random() * 60 - 30));
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const daysOverdue = status === 'overdue' ? Math.floor(Math.random() * 90) + 1 : undefined;
    
    invoices.push({
      id: `inv-${i}`,
      kind: kinds[Math.floor(Math.random() * kinds.length)],
      name: `${kinds[Math.floor(Math.random() * kinds.length)] === 'AP' ? 'Fornecedor' : 'Cliente'} ${i}`,
      amount: Math.random() * 100000 + 5000,
      due: dueDate.toISOString().split('T')[0],
      status,
      daysOverdue,
      tags: Math.random() > 0.5 ? ['SMB'] : ['Enterprise'],
      description: `Fatura ${i} - ${status === 'overdue' ? 'Em atraso' : 'Regular'}`,
    });
  }
  
  return mockApiCall(invoices, 'Erro ao carregar faturas');
}

// Cenários
export async function fetchScenarios(): Promise<Scenario[]> {
  const scenarios: Scenario[] = [
    {
      id: 'sc1',
      name: 'Cenário Base 2025',
      price: 100,
      volume: 1000,
      cac: 150,
      churn: 0.05,
      rate: 0.12,
      fx: 5.2,
      revenue: 100000,
      marginPct: 0.35,
      createdAt: '2025-01-15',
      status: 'active',
    },
    {
      id: 'sc2',
      name: 'Cenário Otimista',
      price: 110,
      volume: 1200,
      cac: 140,
      churn: 0.03,
      rate: 0.10,
      fx: 5.0,
      revenue: 132000,
      marginPct: 0.42,
      createdAt: '2025-01-20',
      status: 'draft',
    },
    {
      id: 'sc3',
      name: 'Cenário Pessimista',
      price: 90,
      volume: 800,
      cac: 180,
      churn: 0.08,
      rate: 0.15,
      fx: 5.5,
      revenue: 72000,
      marginPct: 0.28,
      createdAt: '2025-01-18',
      status: 'archived',
    },
  ];
  
  return mockApiCall(scenarios, 'Erro ao carregar cenários');
}

// Produtos e Pricing
export async function fetchProducts(): Promise<Product[]> {
  const products: Product[] = [
    { id: 'p1', name: 'Produto Alpha', sku: 'ALPHA-001', price: 299.99, cost: 180.00, margin: 119.99, marginPct: 0.40, volume: 150, category: 'Premium' },
    { id: 'p2', name: 'Produto Beta', sku: 'BETA-002', price: 199.99, cost: 140.00, margin: 59.99, marginPct: 0.30, volume: 300, category: 'Standard' },
    { id: 'p3', name: 'Produto Gamma', sku: 'GAMMA-003', price: 99.99, cost: 65.00, margin: 34.99, marginPct: 0.35, volume: 500, category: 'Basic' },
    { id: 'p4', name: 'Produto Delta', sku: 'DELTA-004', price: 499.99, cost: 320.00, margin: 179.99, marginPct: 0.36, volume: 80, category: 'Premium' },
    { id: 'p5', name: 'Produto Epsilon', sku: 'EPS-005', price: 149.99, cost: 95.00, margin: 54.99, marginPct: 0.37, volume: 220, category: 'Standard' },
  ];
  
  return mockApiCall(products, 'Erro ao carregar produtos');
}

// Risk Scores
export async function fetchRiskScores(): Promise<RiskScore[]> {
  const scores: RiskScore[] = [];
  const grades: RiskScore['score'][] = ['A', 'B', 'C', 'D', 'E'];
  
  for (let i = 1; i <= 20; i++) {
    const score = grades[Math.floor(Math.random() * grades.length)];
    const probability = score === 'A' ? 0.02 : score === 'B' ? 0.05 : score === 'C' ? 0.12 : score === 'D' ? 0.25 : 0.45;
    
    scores.push({
      id: `risk-${i}`,
      entity: `Cliente ${i}`,
      score,
      probability,
      limit: Math.random() * 100000 + 10000,
      exposure: Math.random() * 50000 + 5000,
      lastUpdate: new Date().toISOString(),
    });
  }
  
  return mockApiCall(scores, 'Erro ao carregar scores de risco');
}

// OKRs
export async function fetchOKRs(): Promise<OKR[]> {
  const okrs: OKR[] = [
    {
      id: 'okr1',
      title: 'Aumentar Receita Recorrente',
      description: 'Crescer ARR em 40% até Q4',
      progress: 65,
      target: 100,
      unit: '%',
      owner: 'Time Comercial',
      dueDate: '2025-12-31',
      keyResults: [
        { id: 'kr1', title: 'Adquirir 500 novos clientes', progress: 320, target: 500, unit: 'clientes' },
        { id: 'kr2', title: 'Reduzir churn para 3%', progress: 4.2, target: 3.0, unit: '%' },
      ],
    },
    {
      id: 'okr2',
      title: 'Otimizar Margem Operacional',
      description: 'Melhorar eficiência operacional',
      progress: 45,
      target: 100,
      unit: '%',
      owner: 'Time Financeiro',
      dueDate: '2025-12-31',
      keyResults: [
        { id: 'kr3', title: 'Reduzir CAC em 20%', progress: 12, target: 20, unit: '%' },
        { id: 'kr4', title: 'Aumentar LTV/CAC para 4x', progress: 3.2, target: 4.0, unit: 'x' },
      ],
    },
  ];
  
  return mockApiCall(okrs, 'Erro ao carregar OKRs');
}

// Dados para gráficos
export async function fetchChartData(type: 'revenue' | 'margin' | 'receivables'): Promise<any[]> {
  let data: any[] = [];
  
  switch (type) {
    case 'revenue':
      for (let i = 0; i < 12; i++) {
        data.push({
          month: `${i + 1}/25`,
          real: Math.random() * 200000 + 600000,
          forecast: Math.random() * 180000 + 620000,
        });
      }
      break;
    case 'margin':
      ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon'].forEach(product => {
        data.push({
          name: product,
          margin: Math.random() * 0.3 + 0.25,
        });
      });
      break;
    case 'receivables':
      data = [
        { name: 'A Vencer', value: 45, amount: 2500000 },
        { name: '1-30 dias', value: 25, amount: 1400000 },
        { name: '31-60 dias', value: 20, amount: 1100000 },
        { name: '61-90 dias', value: 7, amount: 380000 },
        { name: '+90 dias', value: 3, amount: 170000 },
      ];
      break;
  }
  
  return mockApiCall(data, `Erro ao carregar dados do gráfico ${type}`);
}

// Ant'z Cloud
import cloudFilesData from '@/mocks/cloud-files.json';
import cloudDatabasesData from '@/mocks/cloud-databases.json';
import cloudWorkspacesData from '@/mocks/cloud-workspaces.json';
import type { CloudFile, CloudDatabase, CloudWorkspace, CloudUsage } from './types';

export async function fetchCloudFiles(parentId?: string): Promise<CloudFile[]> {
  const files = cloudFilesData as CloudFile[];
  const filteredFiles = parentId 
    ? files.filter(file => file.parentId === parentId)
    : files.filter(file => !file.parentId);
  return mockApiCall(filteredFiles, 'Erro ao carregar arquivos');
}

export async function fetchCloudDatabases(): Promise<CloudDatabase[]> {
  return mockApiCall(cloudDatabasesData as CloudDatabase[], 'Erro ao carregar databases');
}

export async function fetchCloudWorkspaces(): Promise<CloudWorkspace[]> {
  return mockApiCall(cloudWorkspacesData as CloudWorkspace[], 'Erro ao carregar workspaces');
}

export async function fetchCloudUsage(): Promise<CloudUsage> {
  const usage: CloudUsage = {
    storage: {
      used: 1.2,
      total: 5.0,
      unit: 'TB'
    },
    compute: {
      used: 156,
      total: 500,
      unit: 'hours'
    },
    bandwidth: {
      used: 45,
      total: 100,
      unit: 'GB'
    }
  };
  return mockApiCall(usage, 'Erro ao carregar uso da nuvem');
}
