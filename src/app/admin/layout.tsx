export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="border-b pb-3 md:pb-4">
        <h1 className="text-xl md:text-2xl font-bold text-slate-600">Administração</h1>
        <p className="text-sm md:text-base text-muted-foreground mt-1">
          Configurações do sistema e gerenciamento de usuários
        </p>
      </div>
      {children}
    </div>
  );
}
