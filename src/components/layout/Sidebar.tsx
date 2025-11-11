'use client';

import { useState, memo, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePrefetch } from '@/lib/hooks';
import { 
  LayoutDashboard, 
  Building2, 
  TrendingUp, 
  DollarSign, 
  CreditCard, 
  Shield, 
  Calculator, 
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
  ChevronDown,
  ChevronRight,
  Cloud
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/lib/store';

interface NavItem {
  title: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  children?: NavItem[];
}

const navigation: NavItem[] = [
  {
    title: 'Overview',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    title: 'Colônia Financeira',
    icon: Building2,
    children: [
      { title: 'FP&A', href: '/colony/fpna', icon: TrendingUp },
      { title: 'Fluxo de Caixa', href: '/colony/cashflow', icon: DollarSign },
      { title: 'AP/AR', href: '/colony/ap-ar', icon: CreditCard },
      { title: 'Risco & Crédito', href: '/colony/risk-credit', icon: Shield },
      { title: 'Simulador', href: '/colony/simulator', icon: Calculator },
      { title: 'Collections', href: '/colony/collections', icon: Users },
      { title: 'Investor Relations', href: '/colony/ir', icon: PieChart },
      { title: 'Pricing & Margem', href: '/colony/pricing-margin', icon: TrendingUp },
      { title: 'KPIs & OKRs', href: '/colony/kpis-okrs', icon: Target },
    ],
  },
  {
    title: 'Public Nest', 
    href: '/intelligence-core',
    icon: Brain,
  },
  {
    title: 'Dash Integrator',
    href: '/dash-integrator',
    icon: BarChart3,
  },
  {
    title: 'Data Gateways',
    href: '/data-gateways',
    icon: Database,
  },
  {
    title: 'Colony Builder',
    href: '/colony-builder',
    icon: Workflow,
  },
  {
    title: 'Ant Creator',
    href: '/ant-creator',
    icon: Zap,
  },
  {
    title: 'Test Lab',
    href: '/test-lab',
    icon: TestTube,
  },
  {
    title: 'Antz Cloud',
    href: '/antz-cloud',
    icon: Cloud,
  },
  {
    title: 'Admin',
    icon: Settings,
    children: [
      { title: 'Configurações', href: '/admin/settings', icon: Settings },
      { title: 'Usuários', href: '/admin/users', icon: Users },
    ],
  },
];

interface SidebarItemProps {
  item: NavItem;
  level?: number;
}

const SidebarItem = memo(function SidebarItem({ item, level = 0 }: SidebarItemProps) {
  const pathname = usePathname();
  const { prefetch, prefetchMultiple } = usePrefetch();
  const [isOpen, setIsOpen] = useState(
    item.children?.some(child => pathname === child.href) || false
  );

  const isActive = pathname === item.href;
  const hasActiveChild = item.children?.some(child => pathname === child.href);

  // Prefetch das rotas filhas quando expandir
  const handleToggle = useCallback(() => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    
    // Prefetch das rotas filhas quando expandir
    if (newIsOpen && item.children) {
      const childRoutes = item.children
        .map(child => child.href)
        .filter(Boolean) as string[];
      prefetchMultiple(childRoutes);
    }
  }, [isOpen, item.children, prefetchMultiple]);

  // Prefetch da rota no hover
  const handleMouseEnter = useCallback(() => {
    if (item.href) {
      prefetch(item.href);
    }
  }, [item.href, prefetch]);

  if (item.children) {
    return (
      <div>
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-between h-9 md:h-10 px-2 md:px-3 text-sm transition-colors',
            level > 0 && 'ml-3 md:ml-4',
            (isActive || hasActiveChild) && 'bg-accent text-accent-foreground'
          )}
          onClick={handleToggle}
          onMouseEnter={handleMouseEnter}
        >
          <div className="flex items-center gap-2 md:gap-3">
            <item.icon className="h-4 w-4 shrink-0" />
            <span className="text-sm font-medium truncate">{item.title}</span>
            {item.badge && (
              <Badge variant="secondary" className="ml-auto text-xs">
                {item.badge}
              </Badge>
            )}
          </div>
          {isOpen ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
        {isOpen && (
          <div className="mt-1 space-y-0.5 md:space-y-1">
            {item.children.map((child) => (
              <SidebarItem key={child.title} item={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      className={cn(
        'w-full justify-start h-9 md:h-10 px-2 md:px-3 text-sm transition-colors',
        level > 0 && 'ml-3 md:ml-4',
        isActive && 'bg-accent text-accent-foreground'
      )}
      asChild
    >
      <Link 
        href={item.href!} 
        onMouseEnter={handleMouseEnter}
        prefetch={true}
      >
        <item.icon className="h-4 w-4 shrink-0" />
        <span className="text-sm font-medium truncate">{item.title}</span>
        {item.badge && (
          <Badge variant="secondary" className="ml-auto text-xs">
            {item.badge}
          </Badge>
        )}
      </Link>
    </Button>
  );
});

const SidebarNavigation = memo(function SidebarNavigation() {
  return (
    <nav className="space-y-1 md:space-y-2">
      {navigation.map((item) => (
        <SidebarItem key={item.title} item={item} />
      ))}
    </nav>
  );
});

export const Sidebar = memo(function Sidebar() {
  const { sidebarOpen } = useAppStore();

  return (
    <aside
      className={cn(
        'fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 transform border-r bg-background transition-transform duration-200 ease-in-out',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        'md:relative md:top-0 md:h-[calc(100vh-4rem)] md:translate-x-0'
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-auto p-3 md:p-4">
          <SidebarNavigation />
        </div>
        
        {/* Footer */}
        <div className="border-t p-3 md:p-4">
          <div className="text-xs text-muted-foreground">
            <p>Antz For Business v1.0</p>
            <p>Protótipo Interativo</p>
          </div>
        </div>
      </div>
    </aside>
  );
});
