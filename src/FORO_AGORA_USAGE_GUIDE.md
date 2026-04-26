# 🎨 Foro Agora Design System - Usage Guide

## Brand Colors

### Primary Brand Colors
```css
/* Foro Agora Brand Palette */
--primary-blue: #2563EB;      /* Main brand color */
--secondary-cyan: #48D1C5;    /* Secondary accent */
--primary-dark: #111111;      /* Strong emphasis */
--secondary-gray: #333333;    /* Secondary text */
--light: #F5F5F2;             /* Light background */
```

### Tailwind Usage Examples
```tsx
// Primary blue background
<div className="bg-primary-blue text-white">
  Primary blue element
</div>

// Cyan accent
<div className="border-b-2 border-secondary-cyan">
  Accented content
</div>

// Gradient combination
<h1 className="bg-gradient-to-r from-primary-blue to-secondary-cyan bg-clip-text text-transparent">
  Gradient text
</h1>
```

## Component Usage Examples

### 1. CoreValues Component

#### Grid Layout (Default)
```tsx
import CoreValues from "@/components/CoreValues";

export default function ValuesPage() {
  return (
    <section>
      <h2>Our Principles</h2>
      <CoreValues layout="grid" />
    </section>
  );
}
```

Renders a 3-column grid of value cards with:
- Unique gradient background for each value
- Icon specific to the value
- Description text
- Hover animations

#### Inline Layout
```tsx
import CoreValues from "@/components/CoreValues";

export default function FeatureTeaser() {
  return (
    <div>
      <h3>What We Stand For</h3>
      <CoreValues layout="inline" />
    </div>
  );
}
```

Renders horizontal badges with:
- Compact display
- Gradient text for each value
- Perfect for sidebars or headers

### 2. ForoAgoraPattern Component

#### Basic Usage
```tsx
import ForoAgoraPattern from "@/components/ForoAgoraPattern";

export default function Hero() {
  return (
    <div className="relative">
      {/* Background decoration */}
      <ForoAgoraPattern 
        className="absolute -right-20 -top-20 opacity-30"
        ovals={5}
        color="blue"
      />
      
      {/* Content */}
      <h1>Welcome to Foro Agora</h1>
    </div>
  );
}
```

#### With Animations
```tsx
<ForoAgoraPattern 
  className="h-40 w-40"
  ovals={6}
  color="gradient"
  animated={true}
/>
```

Creates a pulsing animated pattern with brand gradient.

#### Color Options
```tsx
// Solid colors
<ForoAgoraPattern color="blue" />      // #2563EB
<ForoAgoraPattern color="cyan" />      // #48D1C5
<ForoAgoraPattern color="black" />     // #111111

// Gradient blend
<ForoAgoraPattern color="gradient" />  // Blue → Cyan
```

## Page Enhancement Examples

### Landing Page Pattern
```tsx
export default function LandingPage() {
  return (
    <>
      {/* Hero with brand colors */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          {/* Brand-colored background blobs */}
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-blue/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -left-20 w-96 h-96 bg-secondary-cyan/5 rounded-full blur-3xl" />
        </div>

        <div className="container">
          {/* Branded badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-blue/10 border border-primary-blue/20">
            <Sparkles size={14} className="text-primary-blue" />
            <span className="text-xs font-semibold text-primary-blue">Educación financiera accesible</span>
          </div>

          {/* Gradient headline */}
          <h1 className="text-6xl font-semibold">
            Aprendé a invertir con criterio propio, 
            <span className="bg-gradient-to-r from-primary-blue to-secondary-cyan bg-clip-text text-transparent">
              Gratis
            </span>
          </h1>

          {/* Primary brand button */}
          <Button className="bg-primary-blue hover:bg-blue-700">
            Inscribite ahora
          </Button>
        </div>
      </section>

      {/* Values section */}
      <CoreValues />
    </>
  );
}
```

### Impact Dashboard Pattern
```tsx
export default function ImpactPage() {
  return (
    <section>
      <div className="grid grid-cols-3 gap-6">
        {/* Blue-themed stat card */}
        <div className="rounded-2xl border border-border bg-gradient-to-br from-blue-50/50 to-background/80">
          <h3 className="text-foreground">Estudiantes</h3>
          <p className="text-4xl text-primary-blue font-bold">1,234</p>
          <GraduationCap className="text-primary-blue" />
        </div>

        {/* Cyan-themed stat card */}
        <div className="rounded-2xl border border-border bg-gradient-to-br from-cyan-50/50 to-background/80">
          <h3 className="text-foreground">Cohortes Activas</h3>
          <p className="text-4xl text-secondary-cyan font-bold">12</p>
          <Layers className="text-secondary-cyan" />
        </div>

        {/* Amber-themed stat card */}
        <div className="rounded-2xl border border-border bg-gradient-to-br from-amber-50/50 to-background/80">
          <h3 className="text-foreground">Contenido</h3>
          <p className="text-4xl text-amber-600 font-bold">89</p>
          <BookOpen className="text-amber-600" />
        </div>
      </div>

      {/* Department visualization with brand gradient */}
      <div className="rounded-2xl border border-border p-6">
        <div className="h-2 bg-secondary/20 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary-blue to-secondary-cyan" />
        </div>
      </div>

      {/* Values as inline badges */}
      <CoreValues layout="inline" />
    </section>
  );
}
```

## Animation Usage

### Pulse Glow
```tsx
<div className="animate-pulse-glow">
  Pulsing element
</div>
```

### Slide Up
```tsx
<div className="animate-slide-up">
  Enters with slide-up animation
</div>
```

### Float
```tsx
<div className="animate-float">
  Gently floating element
</div>
```

## Dark Mode Considerations

All components automatically adapt to dark mode through Tailwind's dark mode support:

```tsx
// Colors automatically invert
<div className="bg-blue-50 dark:bg-blue-950">
  Light mode: light blue background
  Dark mode: dark blue background
</div>

// Gradients work in both modes
<div className="from-primary-blue/20 dark:from-primary-blue/40">
  Gradient opacity adjusts for readability
</div>
```

## Responsive Design

All components are mobile-first and responsive:

```tsx
// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Stacks on mobile, 2 cols on tablet, 3 cols on desktop */}
</div>

// Responsive text
<h1 className="text-2xl md:text-4xl lg:text-6xl">
  Scales up on larger screens
</h1>

// Responsive spacing
<div className="p-4 md:p-8 lg:p-12">
  More padding on larger screens
</div>
```

## Accessibility Features

All components include accessibility features:

```tsx
// Semantic HTML
<section>
  <h2>Title</h2>
  <CoreValues layout="grid" />
</section>

// Focus states clearly visible
<button className="focus:ring-2 focus:ring-primary-blue focus:ring-offset-2">
  Accessible button
</button>

// Icon with label context
<div className="flex items-center gap-2">
  <GraduationCap size={24} />
  <span>Estudiantes</span>
</div>

// ARIA labels where needed
<svg aria-label="Foro Agora Logo" role="img">
  {/* SVG content */}
</svg>
```

## Common Patterns

### Branded CTA Button
```tsx
<Button className="bg-gradient-to-r from-primary-blue to-secondary-cyan text-white hover:shadow-lg transition-all">
  Call to Action
  <ArrowRight size={16} />
</Button>
```

### Branded Section Header
```tsx
<div>
  <div className="flex items-center gap-2 mb-4">
    <Sparkles size={16} className="text-primary-blue" />
    <p className="text-xs font-heading uppercase text-muted-foreground">
      Section Label
    </p>
  </div>
  <h2 className="text-4xl font-heading text-foreground">
    Section Title
  </h2>
</div>
```

### Branded Card
```tsx
<div className="rounded-2xl border border-border bg-card p-6 hover:shadow-lg transition-all">
  <div className="w-12 h-12 rounded-lg bg-primary-blue text-white flex items-center justify-center mb-4">
    <Icon size={24} />
  </div>
  <h3 className="text-lg font-semibold text-foreground mb-2">
    Card Title
  </h3>
  <p className="text-muted-foreground">
    Card description
  </p>
</div>
```

### Branded Badge
```tsx
<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-blue/10 border border-primary-blue/20">
  <span className="text-xs font-semibold text-primary-blue">
    Badge Text
  </span>
</div>
```

## Testing Checklist

When using Foro Agora brand components:

- [ ] Colors display correctly in light and dark mode
- [ ] Text contrast meets WCAG AA standards
- [ ] Components responsive on mobile (< 640px)
- [ ] Components responsive on tablet (640px - 1024px)
- [ ] Components responsive on desktop (> 1024px)
- [ ] Focus states visible with keyboard navigation
- [ ] Icons have proper labels/context
- [ ] Animations don't exceed 3 seconds
- [ ] No layout shift during animation
- [ ] Performance acceptable (< 3s load time)

---

For more information, see the component documentation in `src/components/README_FORO_AGORA.md`
