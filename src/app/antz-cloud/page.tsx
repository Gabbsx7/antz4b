'use client';

import { useState, useEffect } from 'react';
import { 
  Cloud, 
  HardDrive, 
  Database, 
  Cpu, 
  Upload, 
  Download, 
  Share2, 
  Star, 
  Folder, 
  FileText, 
  MoreHorizontal,
  Plus,
  Search,
  Filter,
  Grid3X3,
  List,
  Play,
  Pause,
  Settings,
  Users,
  Activity,
  TrendingUp,
  Server,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { fetchCloudFiles, fetchCloudDatabases, fetchCloudWorkspaces, fetchCloudUsage } from '@/lib/mocks';
import { formatCurrency, formatNumber } from '@/lib/format';
import type { CloudFile, CloudDatabase, CloudWorkspace, CloudUsage } from '@/lib/types';

export default function AntzCloudPage() {
  const [files, setFiles] = useState<CloudFile[]>([]);
  const [databases, setDatabases] = useState<CloudDatabase[]>([]);
  const [workspaces, setWorkspaces] = useState<CloudWorkspace[]>([]);
  const [usage, setUsage] = useState<CloudUsage | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [filesData, databasesData, workspacesData, usageData] = await Promise.all([
          fetchCloudFiles(),
          fetchCloudDatabases(),
          fetchCloudWorkspaces(),
          fetchCloudUsage()
        ]);

        setFiles(filesData);
        setDatabases(databasesData);
        setWorkspaces(workspacesData);
        setUsage(usageData);
      } catch (error) {
        console.error('Erro ao carregar dados do Cloud:', error);
        toast.error('Erro ao carregar dados do Ant\'z Cloud');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getFileIcon = (file: CloudFile) => {
    if (file.type === 'folder') return Folder;
    switch (file.extension) {
      case 'xlsx':
      case 'csv':
        return FileText;
      case 'pkl':
      case 'ipynb':
        return Cpu;
      case 'pbix':
        return Activity;
      default:
        return FileText;
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '-';
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-500';
      case 'inactive': return 'bg-slate-500';
      case 'maintenance': return 'bg-amber-500';
      case 'stopped': return 'bg-rose-500';
      case 'starting': return 'bg-blue-500';
      default: return 'bg-slate-500';
    }
  };

  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Cloud className="h-8 w-8 text-blue-500" />
            Ant'z Cloud
          </h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Cloud className="h-8 w-8 text-blue-500" />
            Ant'z Cloud
          </h1>
          <p className="text-muted-foreground">
            Plataforma de armazenamento e computação em nuvem para dados e modelos ML
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button>
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Novo Workspace
          </Button>
        </div>
      </div>

      {/* Usage Overview */}
      {usage && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Armazenamento</CardTitle>
              <HardDrive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {usage.storage.used} / {usage.storage.total} {usage.storage.unit}
              </div>
              <Progress value={(usage.storage.used / usage.storage.total) * 100} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {((usage.storage.used / usage.storage.total) * 100).toFixed(1)}% utilizado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Computação</CardTitle>
              <Cpu className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {usage.compute.used} / {usage.compute.total} {usage.compute.unit}
              </div>
              <Progress value={(usage.compute.used / usage.compute.total) * 100} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                Este mês
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Banda</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {usage.bandwidth.used} / {usage.bandwidth.total} {usage.bandwidth.unit}
              </div>
              <Progress value={(usage.bandwidth.used / usage.bandwidth.total) * 100} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                Este mês
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Tabs defaultValue="files" className="space-y-4">
        <TabsList>
          <TabsTrigger value="files">Arquivos</TabsTrigger>
          <TabsTrigger value="databases">Databases</TabsTrigger>
          <TabsTrigger value="workspaces">Workspaces</TabsTrigger>
        </TabsList>

        <TabsContent value="files" className="space-y-4">
          {/* Files Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar arquivos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Files Content */}
          {viewMode === 'grid' ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredFiles.map((file) => {
                const IconComponent = getFileIcon(file);
                return (
                  <Card key={file.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <IconComponent className="h-8 w-8 text-blue-500" />
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Share2 className="h-4 w-4 mr-2" />
                              Compartilhar
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Star className="h-4 w-4 mr-2" />
                              Favoritar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <h3 className="font-medium text-sm mb-1 line-clamp-2">{file.name}</h3>
                      <p className="text-xs text-muted-foreground mb-2">
                        {formatFileSize(file.size)} • {file.owner}
                      </p>
                      {file.tags && file.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {file.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {file.tags.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{file.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Proprietário</TableHead>
                    <TableHead>Tamanho</TableHead>
                    <TableHead>Modificado</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFiles.map((file) => {
                    const IconComponent = getFileIcon(file);
                    return (
                      <TableRow key={file.id}>
                        <TableCell className="flex items-center gap-2">
                          <IconComponent className="h-4 w-4 text-blue-500" />
                          <span className="font-medium">{file.name}</span>
                          {file.isStarred && <Star className="h-3 w-3 text-amber-500 fill-current" />}
                        </TableCell>
                        <TableCell>{file.owner}</TableCell>
                        <TableCell>{formatFileSize(file.size)}</TableCell>
                        <TableCell>{new Date(file.updatedAt).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem>
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Share2 className="h-4 w-4 mr-2" />
                                Compartilhar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="databases" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {databases.map((db) => (
              <Card key={db.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5 text-blue-500" />
                      {db.name}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${getStatusColor(db.status)}`} />
                      <Badge variant="outline" className="text-xs">
                        {db.type.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription>
                    {db.region} • {db.tier} tier • {db.size}GB
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Conexões</p>
                      <p className="font-medium">{db.connections}</p>
                    </div>
                    {db.tables && (
                      <div>
                        <p className="text-muted-foreground">Tabelas</p>
                        <p className="font-medium">{db.tables}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-muted-foreground">Último Backup</p>
                      <p className="font-medium">
                        {db.lastBackup ? new Date(db.lastBackup).toLocaleDateString('pt-BR') : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Status</p>
                      <p className="font-medium capitalize">{db.status}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      Configurar
                    </Button>
                    <Button size="sm" variant="outline">
                      <Activity className="h-4 w-4 mr-2" />
                      Métricas
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="workspaces" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {workspaces.map((workspace) => (
              <Card key={workspace.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Server className="h-5 w-5 text-emerald-500" />
                      {workspace.name}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${getStatusColor(workspace.status)}`} />
                      <Badge variant="outline" className="text-xs">
                        {workspace.type.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription>
                    {workspace.runtime}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                    <div>
                      <p className="text-muted-foreground">CPU</p>
                      <p className="font-medium">{workspace.resources.cpu} cores</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">RAM</p>
                      <p className="font-medium">{workspace.resources.memory}GB</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Storage</p>
                      <p className="font-medium">{workspace.resources.storage}GB</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-4">
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
                  </div>

                  <div className="flex gap-2">
                    {workspace.status === 'active' ? (
                      <Button size="sm">
                        <Pause className="h-4 w-4 mr-2" />
                        Pausar
                      </Button>
                    ) : (
                      <Button size="sm">
                        <Play className="h-4 w-4 mr-2" />
                        Iniciar
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <Zap className="h-4 w-4 mr-2" />
                      Conectar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
