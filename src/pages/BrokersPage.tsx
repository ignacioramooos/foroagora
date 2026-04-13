import { useState } from "react";
import { mockBrokers } from "@/lib/mockData";
import SectionFade from "@/components/SectionFade";

const BrokersPage = () => {
  const [filter, setFilter] = useState<"all" | "local" | "internacional">("all");
  const filtered = filter === "all" ? mockBrokers : mockBrokers.filter((b) => b.type === filter);

  return (
    <div className="min-h-screen bg-background pt-28 md:pt-36 pb-20">
      <div className="container max-w-5xl">
        <SectionFade>
          <p className="text-xs font-heading font-medium uppercase tracking-widest text-muted-foreground mb-4">
            Directorio
          </p>
          <h1 className="text-3xl md:text-4xl text-foreground mb-2">
            Brokers para uruguayos
          </h1>
          <p className="text-muted-foreground mb-8 max-w-lg">
            Opciones reguladas para invertir desde Uruguay. Investigá cada opción antes de abrir una cuenta.
          </p>
          <p className="text-muted-foreground text-sm mb-8 max-w-lg">
          </p>
        </SectionFade>

        <div className="flex gap-2 mb-6">
          {(["all", "local", "internacional"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-md text-sm font-heading border transition-colors ${
                filter === f
                  ? "bg-foreground text-background border-foreground"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {f === "all" ? "Todos" : f === "local" ? "Locales" : "Internacionales"}
            </button>
          ))}
        </div>

        <div className="border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="text-left p-3 font-heading font-medium text-muted-foreground">Broker</th>
                  <th className="text-left p-3 font-heading font-medium text-muted-foreground">Tipo</th>
                  <th className="text-left p-3 font-heading font-medium text-muted-foreground">Depósito mín.</th>
                  <th className="text-left p-3 font-heading font-medium text-muted-foreground">Comisión</th>
                  <th className="text-left p-3 font-heading font-medium text-muted-foreground">Regulador</th>
                  <th className="text-left p-3 font-heading font-medium text-muted-foreground hidden md:table-cell">Notas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((b) => (
                  <tr key={b.name} className="hover:bg-secondary/30 transition-colors">
                    <td className="p-3 font-heading font-medium text-foreground">{b.name}</td>
                    <td className="p-3 text-muted-foreground capitalize">{b.type}</td>
                    <td className="p-3 text-muted-foreground">{b.minDeposit}</td>
                    <td className="p-3 text-muted-foreground">{b.commission}</td>
                    <td className="p-3 text-muted-foreground">{b.regulated}</td>
                    <td className="p-3 text-muted-foreground hidden md:table-cell">{b.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-4">
          Esta tabla es informativa. Verificá la información directamente con cada broker antes de operar.
        </p>
      </div>
    </div>
  );
};

export default BrokersPage;
