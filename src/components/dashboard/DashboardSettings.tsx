import { useAuth } from "@/contexts/AuthContext";

const DashboardSettings = () => {
  const { user, logout } = useAuth();

  return (
    <div className="p-6 md:p-10 max-w-xl">
      <h1 className="text-2xl md:text-3xl text-foreground mb-2">Configuración</h1>
      <p className="text-muted-foreground mb-8">Ajustes de tu cuenta.</p>

      <div className="border border-border rounded-lg divide-y divide-border">
        <div className="p-5">
          <p className="text-xs font-heading text-muted-foreground mb-1">Nombre</p>
          <p className="text-sm font-heading font-medium text-foreground">{user?.name}</p>
        </div>
        <div className="p-5">
          <p className="text-xs font-heading text-muted-foreground mb-1">Email</p>
          <p className="text-sm font-heading font-medium text-foreground">{user?.email}</p>
        </div>
        <div className="p-5">
          <button
            onClick={logout}
            className="h-9 px-4 rounded-md border border-destructive text-destructive text-sm font-heading font-medium hover:bg-destructive/10 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardSettings;
