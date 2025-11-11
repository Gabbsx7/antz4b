'use client';

import { useState } from 'react';
import { 
  Server, 
  Play, 
  Pause, 
  Settings, 
  Users, 
  Cpu, 
  HardDrive, 
  MemoryStick, 
  Activity,
  ExternalLink,
  MoreHorizontal,
  Trash2,
  Copy
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import type { CloudWorkspace } from '@/lib/types';

interface WorkspaceCardProps {
  workspace: CloudWorkspace;
  onStatusChange?: (id: string, status: CloudWorkspace['status']) => void;
}

export function WorkspaceCard({ workspace, onStatusChange }: WorkspaceCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const getStatusColor = (status: CloudWorkspace['status']) => {
    switch (status) {
      case 'active': return 'bg-emerald-500';
      case 'stopped': return 'bg-slate-500';
      case 'starting': return 'bg-blue-500 animate-pulse';
      default: return 'bg-slate-500';
    }
  };

  const getTypeIcon = (type: CloudWorkspace['type']) => {
    switch (type) {
      case 'ml': return '🤖';
      case 'analytics': return '📊';
      case 'reporting': return '📋';
      default: return '💻';
    }
  };

  const handleStatusToggle = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newStatus = workspace.status === 'active' ? 'stopped' : 'starting';
      onStatusChange?.(workspace.id, newStatus);
      
      // Simulate starting process
      if (newStatus === 'starting') {
        setTimeout(() => {
          onStatusChange?.(workspace.id, 'active');
        }, 3000);
      }
      
      toast.success(
        newStatus === 'starting' 
          ? 'Workspace iniciando...' 
          : 'Workspace pausado'
      );
    } catch (error) {
      toast.error('Erro ao alterar status do workspace');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = () => {
    toast.success('Conectando ao workspace...');
    // Simulate opening workspace in new tab
    setTimeout(() => {
      toast.info('Workspace aberto em nova aba');
    }, 1000);
  };

  const handleClone = () => {
    toast.success('Clonando workspace...');
  };

  const handleDelete = () => {
    toast.error('Funcionalidade de exclusão não implementada no protótipo');
  };

  const cpuUsage = Math.random() * 80 + 10; // Mock usage
  const memoryUsage = Math.random() * 70 + 20; // Mock usage
  const storageUsage = Math.random() * 60 + 30; // Mock usage

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Server className="h-5 w-5 text-emerald-500" />
              <span className="text-lg font-medium">{getTypeIcon(workspace.type)}</span>
            </div>
            <div>
              <CardTitle className="text-base">{workspace.name}</CardTitle>
              <CardDescription className="text-xs">
                {workspace.runtime}
              </CardDescription>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${getStatusColor(workspace.status)}`} />
            <Badge variant="outline" className="text-xs">
              {workspace.type.toUpperCase()}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleClone}>
                  <Copy className="h-4 w-4 mr-2" />
                  Clonar
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="h-4 w-4 mr-2" />
                  Configurações
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="text-rose-600">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Resource Specs */}
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <Cpu className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
            <p className="font-medium">{workspace.resources.cpu} cores</p>
            <p className="text-xs text-muted-foreground">CPU</p>
          </div>
          <div className="text-center">
            <MemoryStick className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
            <p className="font-medium">{workspace.resources.memory}GB</p>
            <p className="text-xs text-muted-foreground">RAM</p>
          </div>
          <div className="text-center">
            <HardDrive className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
            <p className="font-medium">{workspace.resources.storage}GB</p>
            <p className="text-xs text-muted-foreground">Storage</p>
          </div>
        </div>

        {/* Resource Usage (only show if active) */}
        {workspace.status === 'active' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">CPU</span>
              <span className="font-medium">{cpuUsage.toFixed(1)}%</span>
            </div>
            <Progress value={cpuUsage} className="h-1" />
            
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Memória</span>
              <span className="font-medium">{memoryUsage.toFixed(1)}%</span>
            </div>
            <Progress value={memoryUsage} className="h-1" />
            
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Disco</span>
              <span className="font-medium">{storageUsage.toFixed(1)}%</span>
            </div>
            <Progress value={storageUsage} className="h-1" />
          </div>
        )}

        {/* Collaborators */}
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <div className="flex -space-x-2">
            {workspace.collaborators.slice(0, 3).map((collaborator, index) => (
              <Avatar key={index} className="h-6 w-6 border-2 border-background">
                <AvatarFallback className="text-xs">
                  {collaborator.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            ))}
            {workspace.collaborators.length > 3 && (
              <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs">
                +{workspace.collaborators.length - 3}
              </div>
            )}
          </div>
          <span className="text-xs text-muted-foreground ml-2">
            {workspace.collaborators.length} colaborador{workspace.collaborators.length !== 1 ? 'es' : ''}
          </span>
        </div>

        {/* Last Used */}
        <div className="text-xs text-muted-foreground">
          Último uso: {workspace.lastUsed ? new Date(workspace.lastUsed).toLocaleString('pt-BR') : 'Nunca'}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          {workspace.status === 'active' ? (
            <>
              <Button 
                size="sm" 
                onClick={handleConnect}
                className="flex-1"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Conectar
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleStatusToggle}
                disabled={isLoading}
              >
                <Pause className="h-4 w-4 mr-2" />
                Pausar
              </Button>
            </>
          ) : (
            <Button 
              size="sm" 
              onClick={handleStatusToggle}
              disabled={isLoading || workspace.status === 'starting'}
              className="flex-1"
            >
              <Play className="h-4 w-4 mr-2" />
              {workspace.status === 'starting' ? 'Iniciando...' : 'Iniciar'}
            </Button>
          )}
          
          <Button size="sm" variant="outline">
            <Activity className="h-4 w-4 mr-2" />
            Logs
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
