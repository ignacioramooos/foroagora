export interface User {
  id: string;
  name: string;
  email: string;
  streak: number;
  completedClasses: number;
  totalClasses: number;
  publishedTheses: number;
}

export interface Module {
  id: string;
  title: string;
  status: "completed" | "in_progress" | "locked";
  currentClass?: number;
  totalClasses?: number;
}

export interface Thesis {
  id: string;
  company: string;
  date: string;
  status: "borrador" | "publicado";
  content: string;
}

export interface CommunityPost {
  id: string;
  author: string;
  type: "analysis" | "announcement";
  title: string;
  date: string;
}

export interface GlossaryTerm {
  term: string;
  definition: string;
}

export interface Broker {
  name: string;
  type: "local" | "internacional";
  minDeposit: string;
  commission: string;
  regulated: string;
  notes: string;
}

export const mockUser: User = {
  id: "1",
  name: "Nacho",
  email: "nacho@ejemplo.com",
  streak: 5,
  completedClasses: 4,
  totalClasses: 12,
  publishedTheses: 2,
};

export const mockModules: Module[] = [
  { id: "1", title: "Introducción", status: "completed", totalClasses: 3, currentClass: 3 },
  { id: "2", title: "Análisis Fundamental", status: "in_progress", currentClass: 1, totalClasses: 4 },
  { id: "3", title: "Valuación de Activos", status: "locked", totalClasses: 3 },
  { id: "4", title: "Tesis Final", status: "locked", totalClasses: 2 },
];

export const mockTheses: Thesis[] = [
  { id: "1", company: "Mercado Libre", date: "2025-05-10", status: "publicado", content: "MELI opera en e-commerce y fintech en LatAm con ventaja competitiva fuerte." },
  { id: "2", company: "Vista Energy", date: "2025-06-01", status: "borrador", content: "Empresa de Oil & Gas con operaciones en Vaca Muerta." },
];

export const mockCommunityPosts: CommunityPost[] = [
  { id: "1", author: "Valentina R.", type: "analysis", title: "Análisis de Globant: ¿Comprar o esperar?", date: "2025-06-08" },
  { id: "2", author: "Equipo Foro Agora", type: "announcement", title: "Nueva sede confirmada: INJU Centro", date: "2025-06-05" },
  { id: "3", author: "Martín G.", type: "analysis", title: "Mi primer DCF: Coca-Cola", date: "2025-06-03" },
  { id: "4", author: "Equipo Foro Agora", type: "announcement", title: "Material de Módulo 2 disponible", date: "2025-06-01" },
];

export const mockGlossary: GlossaryTerm[] = [
  { term: "Acción", definition: "Unidad de propiedad en una empresa. Quien tiene acciones es dueño parcial de esa empresa." },
  { term: "Balance General", definition: "Estado financiero que muestra los activos, pasivos y patrimonio de una empresa en un momento dado." },
  { term: "Cash Flow", definition: "Flujo de efectivo. La cantidad de dinero que entra y sale de una empresa en un período." },
  { term: "DCF", definition: "Discounted Cash Flow. Método de valuación que estima el valor presente de los flujos de caja futuros." },
  { term: "Deuda", definition: "Dinero que una empresa debe a terceros (bancos, bonistas, etc.)." },
  { term: "Dividendo", definition: "Porción de las ganancias que una empresa reparte entre sus accionistas." },
  { term: "EBITDA", definition: "Earnings Before Interest, Taxes, Depreciation & Amortization. Indicador de rentabilidad operativa." },
  { term: "Estado de Resultados", definition: "Informe que muestra los ingresos, costos y ganancias de una empresa en un período." },
  { term: "Free Cash Flow", definition: "Efectivo que genera una empresa después de cubrir sus gastos operativos e inversiones." },
  { term: "Margen Neto", definition: "Porcentaje de ganancia neta sobre los ingresos totales. Indica cuánto gana la empresa por cada peso vendido." },
  { term: "Moat", definition: "Ventaja competitiva duradera de una empresa que la protege de la competencia." },
  { term: "P/E Ratio", definition: "Price-to-Earnings. Relación entre el precio de la acción y las ganancias por acción. Indica cuántos años de ganancias estás pagando." },
  { term: "ROE", definition: "Return on Equity. Rentabilidad sobre el patrimonio. Mide cuánto gana la empresa por cada peso invertido por los accionistas." },
  { term: "Valuación", definition: "Proceso de estimar cuánto vale una empresa o activo." },
  { term: "Value Investing", definition: "Estrategia de inversión que busca comprar empresas por debajo de su valor intrínseco." },
];

export const mockBrokers: Broker[] = [
  { name: "Sura Inversiones", type: "local", minDeposit: "USD 1.000", commission: "0.5% + IVA", regulated: "BCU", notes: "Broker uruguayo con presencia regional" },
  { name: "Gastón Bengochea", type: "local", minDeposit: "USD 5.000", commission: "Variable", regulated: "BCU", notes: "Casa de bolsa tradicional en Uruguay" },
  { name: "Interactive Brokers", type: "internacional", minDeposit: "USD 0", commission: "USD 1 por orden", regulated: "SEC / FINRA", notes: "Acceso a mercados globales. Acepta residentes UY" },
  { name: "Charles Schwab", type: "internacional", minDeposit: "USD 25.000", commission: "USD 0 acciones US", regulated: "SEC / FINRA", notes: "Requiere cuenta internacional" },
  { name: "TD Ameritrade", type: "internacional", minDeposit: "USD 0", commission: "USD 0 acciones US", regulated: "SEC / FINRA", notes: "Herramientas de análisis avanzadas" },
];
