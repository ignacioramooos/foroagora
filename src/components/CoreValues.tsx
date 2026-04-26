/**
 * Foro Agora Core Values Component
 * Displays the organization's fundamental principles: PROGRESO, OPORTUNIDADES, POTENCIAL, etc.
 */

import { BookOpen, Lightbulb, Users, Zap, Heart, TrendingUp } from 'lucide-react';

interface Value {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const values: Value[] = [
  {
    id: 'progreso',
    label: 'Progreso',
    description: 'Avance constante en educación y habilidades financieras',
    icon: <TrendingUp size={24} />,
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 'oportunidades',
    label: 'Oportunidades',
    description: 'Acceso igualitario a educación de calidad para todos',
    icon: <Lightbulb size={24} />,
    color: 'from-cyan-500 to-cyan-600',
  },
  {
    id: 'potencial',
    label: 'Potencial',
    description: 'Desarrollar el máximo potencial de cada estudiante',
    icon: <Zap size={24} />,
    color: 'from-amber-500 to-amber-600',
  },
  {
    id: 'educacion',
    label: 'Educación',
    description: 'Conocimiento fundamental y pensamiento crítico',
    icon: <BookOpen size={24} />,
    color: 'from-violet-500 to-violet-600',
  },
  {
    id: 'comunidad',
    label: 'Comunidad',
    description: 'Construcción de redes de apoyo entre estudiantes',
    icon: <Users size={24} />,
    color: 'from-green-500 to-green-600',
  },
  {
    id: 'confianza',
    label: 'Confianza',
    description: 'Relaciones sólidas basadas en transparencia',
    icon: <Heart size={24} />,
    color: 'from-pink-500 to-pink-600',
  },
];

interface CoreValuesProps {
  layout?: 'grid' | 'inline';
  className?: string;
}

const CoreValues = ({ layout = 'grid', className = '' }: CoreValuesProps) => {
  if (layout === 'inline') {
    return (
      <div className={`flex flex-wrap gap-3 ${className}`}>
        {values.map((value) => (
          <div
            key={value.id}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 border border-secondary/40 hover:border-secondary/60 transition-all"
          >
            <span className={`bg-gradient-to-br ${value.color} bg-clip-text text-transparent font-heading font-semibold`}>
              {value.label}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`grid md:grid-cols-3 gap-6 ${className}`}>
      {values.map((value) => (
        <div
          key={value.id}
          className="group relative rounded-2xl border border-border bg-card p-6 hover:shadow-lg transition-all duration-300 overflow-hidden"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${value.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
          
          <div className="relative">
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${value.color} text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              {value.icon}
            </div>
            
            <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
              {value.label}
            </h3>
            
            <p className="text-sm text-muted-foreground leading-relaxed">
              {value.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CoreValues;
