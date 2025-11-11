'use client';

import { useState } from 'react';
import { Users, Plus, Mail, Shield, MoreHorizontal, UserCheck, UserX } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

const users = [
  {
    id: '1',
    name: 'Gabriel Henrique',
    email: 'gabriel@antz.com',
    role: 'admin',
    status: 'active',
    lastLogin: '2025-11-07T15:30:00Z',
    avatar: 'https://github.com/shadcn.png',
    businessUnits: ['all'],
  },
  {
    id: '2',
    name: 'Ana Silva',
    email: 'ana.silva@antz.com',
    role: 'analyst',
    status: 'active',
    lastLogin: '2025-11-07T14:20:00Z',
    avatar: null,
    businessUnits: ['sul', 'sudeste'],
  },
  {
    id: '3',
    name: 'Carlos Santos',
    email: 'carlos.santos@antz.com',
    role: 'viewer',
    status: 'active',
    lastLogin: '2025-11-07T09:15:00Z',
    avatar: null,
    businessUnits: ['nordeste'],
  },
  {
    id: '4',
    name: 'Maria Oliveira',
    email: 'maria.oliveira@antz.com',
    role: 'analyst',
    status: 'inactive',
    lastLogin: '2025-11-05T16:45:00Z',
    avatar: null,
    businessUnits: ['sul'],
  },
  {
    id: '5',
    name: 'João Costa',
    email: 'joao.costa@antz.com',
    role: 'admin',
    status: 'pending',
    lastLogin: null,
    avatar: null,
    businessUnits: ['all'],
  },
];

const permissions = {
  viewer: ['Visualizar dashboards', 'Exportar relatórios básicos'],
  analyst: ['Visualizar dashboards', 'Exportar relatórios', 'Criar cenários', 'Usar simuladores', 'Acessar Ant\'z Agent'],
  admin: ['Acesso completo', 'Gerenciar usuários', 'Configurações do sistema', 'Todos os módulos'],
};

export default function UsersPage() {
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'viewer',
    businessUnits: [] as string[],
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'analyst': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'viewer': return 'bg-slate-50 text-slate-700 border-slate-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'inactive': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'pending': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'analyst': return 'Analista';
      case 'viewer': return 'Visualizador';
      default: return role;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'inactive': return 'Inativo';
      case 'pending': return 'Pendente';
      default: return status;
    }
  };

  const handleInviteUser = () => {
    if (!newUser.name || !newUser.email) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    toast.success(`Convite enviado para ${newUser.email}`);
    setInviteDialogOpen(false);
    setNewUser({ name: '', email: '', role: 'viewer', businessUnits: [] });
  };

  const handleToggleUserStatus = (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    toast.success(`Usuário ${newStatus === 'active' ? 'ativado' : 'desativado'} com sucesso`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Usuários</h2>
          <p className="text-muted-foreground">Gerencie usuários e permissões</p>
        </div>
        <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Convidar Usuário
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Convidar Novo Usuário</DialogTitle>
              <DialogDescription>
                Envie um convite para um novo usuário se juntar ao sistema
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Digite o nome completo"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="usuario@empresa.com"
                />
              </div>
              <div>
                <Label htmlFor="role">Função</Label>
                <Select value={newUser.role} onValueChange={(value) => setNewUser(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="viewer">Visualizador</SelectItem>
                    <SelectItem value="analyst">Analista</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Unidades de Negócio</Label>
                <div className="space-y-2 mt-2">
                  {['all', 'sul', 'sudeste', 'nordeste'].map((bu) => (
                    <div key={bu} className="flex items-center space-x-2">
                      <Checkbox
                        id={bu}
                        checked={newUser.businessUnits.includes(bu)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setNewUser(prev => ({ ...prev, businessUnits: [...prev.businessUnits, bu] }));
                          } else {
                            setNewUser(prev => ({ ...prev, businessUnits: prev.businessUnits.filter(b => b !== bu) }));
                          }
                        }}
                      />
                      <Label htmlFor={bu} className="capitalize">
                        {bu === 'all' ? 'Todas as Unidades' : `BU ${bu}`}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleInviteUser} className="flex-1">
                  <Mail className="h-4 w-4 mr-2" />
                  Enviar Convite
                </Button>
                <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">usuários cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <UserCheck className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {users.filter(u => u.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">online recentemente</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Convites Pendentes</CardTitle>
            <Mail className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {users.filter(u => u.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">aguardando aceite</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administradores</CardTitle>
            <Shield className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-600">
              {users.filter(u => u.role === 'admin').length}
            </div>
            <p className="text-xs text-muted-foreground">acesso completo</p>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Lista de Usuários</CardTitle>
          <CardDescription>Gerencie usuários e suas permissões</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Função</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Último Login</TableHead>
                  <TableHead>Unidades</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar || undefined} />
                          <AvatarFallback>
                            {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge className={getRoleColor(user.role)}>
                        {getRoleLabel(user.role)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(user.status)}>
                        {getStatusLabel(user.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.lastLogin ? (
                        <span className="text-sm">
                          {new Date(user.lastLogin).toLocaleString('pt-BR')}
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">Nunca</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.businessUnits.slice(0, 2).map(bu => (
                          <Badge key={bu} variant="outline" className="text-xs">
                            {bu === 'all' ? 'Todas' : bu.toUpperCase()}
                          </Badge>
                        ))}
                        {user.businessUnits.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{user.businessUnits.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            Editar Usuário
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            Resetar Senha
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleUserStatus(user.id, user.status)}>
                            {user.status === 'active' ? (
                              <>
                                <UserX className="h-4 w-4 mr-2" />
                                Desativar
                              </>
                            ) : (
                              <>
                                <UserCheck className="h-4 w-4 mr-2" />
                                Ativar
                              </>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Permissions Matrix */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Matriz de Permissões</CardTitle>
          <CardDescription>Permissões por função de usuário</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(permissions).map(([role, perms]) => (
              <div key={role} className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Badge className={getRoleColor(role)}>
                    {getRoleLabel(role)}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {users.filter(u => u.role === role).length} usuários
                  </span>
                </div>
                <div className="grid gap-2 md:grid-cols-2">
                  {perms.map((permission) => (
                    <div key={permission} className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span>{permission}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
