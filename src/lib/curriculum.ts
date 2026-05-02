export type CurriculumResourceType = "PDF" | "Plantilla" | "Lectura";

export interface CurriculumResource {
  label: string;
  type: CurriculumResourceType;
}

export interface CurriculumClass {
  id: string;
  classNumber: number;
  title: string;
  shortTitle: string;
  summary: string;
  duration: string;
  topics: string[];
  resources: CurriculumResource[];
}

export type CurriculumProgressStatus = "completed" | "in_progress" | "locked";

export interface CurriculumProgressItem {
  id: string;
  classNumber: number;
  title: string;
  shortTitle: string;
  summary: string;
  duration: string;
  topics: string[];
  status: CurriculumProgressStatus;
}

export const curriculumClasses: CurriculumClass[] = [
  {
    id: "class-1",
    classNumber: 1,
    title: "Acciones y análisis fundamental",
    shortTitle: "Acciones y fundamentos",
    summary:
      "Una introducción clara al mercado: qué es una acción, por qué algunas empresas cotizan en bolsa, cómo funciona una IPO y cómo vamos a analizar compañías con criterio propio.",
    duration: "1h 20m · Presencial",
    topics: [
      "Modalidad del programa: clases presenciales, grabaciones y recursos online.",
      "Uso de stockanalysis.com y fuentes similares para encontrar información financiera.",
      "Acciones como pequeñas partes de propiedad de una empresa.",
      "Empresas públicas, empresas privadas e IPOs.",
      "Fundamental investing vs. trading y quantitative investing.",
      "Principios de Warren Buffett y Peter Lynch.",
      "Introducción a Income Statement, Balance Sheet y Cash Flow Statement.",
    ],
    resources: [
      { label: "Guía: cómo usar stockanalysis.com", type: "PDF" },
      { label: "Glosario inicial: acciones, IPO y estados financieros", type: "Lectura" },
      { label: "Checklist: analizar una empresa desde cero", type: "Plantilla" },
    ],
  },
  {
    id: "class-2",
    classNumber: 2,
    title: "Income Statement",
    shortTitle: "Income Statement",
    summary:
      "Aprendemos a leer el estado de resultados línea por línea para entender ingresos, costos, gastos, márgenes y ganancias sin quedarnos solo con el titular.",
    duration: "1h 20m · Presencial",
    topics: [
      "Ingresos, costo de ventas, gastos operativos y ganancia neta.",
      "Qué significa que la contabilidad prorratee ciertos gastos.",
      "Amortización y depreciación con ejemplos simples.",
      "Por qué algunos estados financieros se mueven con inercia.",
      "Lectura línea por línea de un Income Statement real.",
    ],
    resources: [
      { label: "Plantilla de análisis de Income Statement", type: "Plantilla" },
      { label: "Guía: ingresos, gastos, márgenes y utilidad neta", type: "PDF" },
      { label: "Ejercicio: detectar qué mueve la rentabilidad", type: "Lectura" },
    ],
  },
  {
    id: "class-3",
    classNumber: 3,
    title: "Cash Flow Statement",
    shortTitle: "Cash Flow",
    summary:
      "Vemos cómo entra y sale el efectivo de una empresa, por qué el free cash flow importa tanto y cómo se diferencia del resultado contable.",
    duration: "1h 20m · Presencial",
    topics: [
      "Cash from operations: net income, depreciation, amortization y ajustes operativos.",
      "Capex e investing expenses.",
      "Free cash flow y net cash flow.",
      "Diferencia entre registrar una inversión en Cash Flow vs. Income Statement.",
      "Ejemplos con hyperscalers como Amazon, Google y Apple.",
    ],
    resources: [
      { label: "Plantilla de Free Cash Flow", type: "Plantilla" },
      { label: "Caso práctico: cash flow de una empresa real", type: "PDF" },
      { label: "Lectura: por qué el efectivo no siempre coincide con la ganancia", type: "Lectura" },
    ],
  },
  {
    id: "class-4",
    classNumber: 4,
    title: "Balance Sheet y métricas de valuación",
    shortTitle: "Balance y métricas",
    summary:
      "Conectamos activos, pasivos y patrimonio con métricas de valuación para entender qué estamos pagando cuando compramos una acción.",
    duration: "1h 20m · Presencial",
    topics: [
      "Activos, pasivos y patrimonio.",
      "Por qué el Balance Sheet es especialmente importante en bancos.",
      "Book value y lectura básica del balance.",
      "P/E, Forward P/E, P/FCF, P/B, PEG y CAGR.",
      "Alertas como one-time taxes y resultados no recurrentes.",
      "Psicología de mercado: buy when others are fearful.",
    ],
    resources: [
      { label: "Cheatsheet de métricas de valuación", type: "PDF" },
      { label: "Plantilla de análisis fundamental", type: "Plantilla" },
      { label: "Lectura: múltiplos, crecimiento y contexto", type: "Lectura" },
    ],
  },
  {
    id: "class-5",
    classNumber: 5,
    title: "Margin of Safety, ETFs y cierre",
    shortTitle: "Margin of Safety y ETFs",
    summary:
      "Integramos todo el proceso: estimar valor, compararlo con el precio de mercado, entender ETFs y cerrar con preguntas para que cada estudiante pueda seguir aprendiendo.",
    duration: "1h 20m · Presencial",
    topics: [
      "Margin of Safety: distancia entre valor estimado y precio de mercado.",
      "Cuándo tiene sentido ser comprador neto y cuándo el mercado puede pagar demasiado.",
      "Earnings calls, guidance y formatos de presentaciones.",
      "ETFs como SPY y VOO.",
      "MAG7 y empresas más grandes del mundo.",
      "Preguntas, cierre y próximos pasos.",
    ],
    resources: [
      { label: "Checklist final de decisión de inversión", type: "PDF" },
      { label: "Guía rápida: ETFs, SPY y VOO", type: "Lectura" },
      { label: "Plantilla: tesis de inversión con margin of safety", type: "Plantilla" },
    ],
  },
];

export const curriculumClassCount = curriculumClasses.length;

export const buildCurriculumProgress = (completedClasses = 0): CurriculumProgressItem[] => {
  const completed = Math.max(0, Math.floor(completedClasses));

  return curriculumClasses.map((item) => {
    const status: CurriculumProgressStatus =
      item.classNumber <= completed
        ? "completed"
        : item.classNumber === completed + 1
          ? "in_progress"
          : "locked";

    return {
      ...item,
      status,
    };
  });
};
