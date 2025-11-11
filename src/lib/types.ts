// Tipos globais do Ant'z For Business

export type KPI = {
  id: string;
  label: string;
  value: number;
  deltaPct?: number;
  fmt?: 'currency' | 'percent' | 'number';
  unit?: string;
};

export type CashPoint = {
  date: string;
  inflow: number;
  outflow: number;
  balance: number;
  burn?: number;
};

export type Invoice = {
  id: string;
  kind: 'AP' | 'AR';
  name: string;
  amount: number;
  due: string;
  status: 'open' | 'paid' | 'overdue';
  daysOverdue?: number;
  tags?: string[];
  description?: string;
};

export type Scenario = {
  id: string;
  name: string;
  price: number;
  volume: number;
  cac: number;
  churn: number;
  rate: number;
  fx: number;
  revenue: number;
  marginPct: number;
  createdAt: string;
  status: 'draft' | 'active' | 'archived';
};

export type AgentEvent = {
  id: string;
  type: 'alert' | 'insight' | 'task' | 'explanation' | 'action';
  severity?: 'low' | 'medium' | 'high';
  title: string;
  body?: string;
  timestamp: string;
  cta?: {
    label: string;
    href: string;
  };
  status?: 'open' | 'done' | 'dismissed';
};

export type AgentMessage = {
  id: string;
  type: 'user' | 'agent';
  content: string;
  timestamp: string;
  category?: 'alert' | 'insight' | 'task' | 'explanation' | 'action';
};

export type BusinessUnit = {
  id: string;
  name: string;
  code: string;
};

export type Currency = {
  code: string;
  symbol: string;
  name: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'viewer' | 'analyst' | 'admin';
  avatar?: string;
  businessUnits: string[];
};

export type DataSource = {
  id: string;
  name: string;
  type: 'csv' | 'api' | 'database' | 'google_sheets';
  status: 'connected' | 'error' | 'syncing';
  lastSync?: string;
  description?: string;
};

export type Pipeline = {
  id: string;
  name: string;
  nodes: PipelineNode[];
  status: 'draft' | 'running' | 'stopped' | 'error';
  lastRun?: string;
};

export type PipelineNode = {
  id: string;
  type: 'ingest' | 'transform' | 'enrich' | 'route' | 'output';
  name: string;
  position: { x: number; y: number };
  config?: Record<string, any>;
};

export type AntFunction = {
  id: string;
  name: string;
  type: 'ingest' | 'transform' | 'enrich' | 'route' | 'alert';
  description: string;
  inputs: string[];
  outputs: string[];
  category: string;
};

export type OKR = {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  unit: string;
  owner: string;
  dueDate: string;
  keyResults: KeyResult[];
};

export type KeyResult = {
  id: string;
  title: string;
  progress: number;
  target: number;
  unit: string;
};

export type RiskScore = {
  id: string;
  entity: string;
  score: 'A' | 'B' | 'C' | 'D' | 'E';
  probability: number;
  limit: number;
  exposure: number;
  lastUpdate: string;
};

export type Product = {
  id: string;
  name: string;
  sku: string;
  price: number;
  cost: number;
  margin: number;
  marginPct: number;
  volume: number;
  category: string;
};

export type ChartDataPoint = {
  name: string;
  value: number;
  [key: string]: any;
};

export type DateRange = {
  from: Date;
  to: Date;
};

export type Theme = 'light' | 'dark' | 'system';

export type AppSettings = {
  theme: Theme;
  currency: string;
  businessUnit: string;
  timezone: string;
  language: string;
};

// Ant'z Cloud Types
export type CloudFile = {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: number;
  mimeType?: string;
  extension?: string;
  createdAt: string;
  updatedAt: string;
  owner: string;
  shared: boolean;
  tags?: string[];
  path: string;
  parentId?: string;
  isStarred?: boolean;
  downloadUrl?: string;
};

export type CloudDatabase = {
  id: string;
  name: string;
  type: 'sql' | 'nosql' | 'timeseries' | 'vector';
  status: 'active' | 'inactive' | 'maintenance';
  size: number;
  tables?: number;
  connections: number;
  region: string;
  createdAt: string;
  lastBackup?: string;
  tier: 'basic' | 'standard' | 'premium';
};

export type CloudWorkspace = {
  id: string;
  name: string;
  type: 'analytics' | 'ml' | 'reporting';
  status: 'active' | 'stopped' | 'starting';
  resources: {
    cpu: number;
    memory: number;
    storage: number;
  };
  runtime: string;
  createdAt: string;
  lastUsed?: string;
  collaborators: string[];
};

export type CloudUsage = {
  storage: {
    used: number;
    total: number;
    unit: 'GB' | 'TB';
  };
  compute: {
    used: number;
    total: number;
    unit: 'hours';
  };
  bandwidth: {
    used: number;
    total: number;
    unit: 'GB';
  };
};
