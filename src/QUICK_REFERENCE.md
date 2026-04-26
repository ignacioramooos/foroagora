# 🎨 Foro Agora Brand - Quick Reference Card

## Brand Colors

```
PRIMARY BLUE    SECONDARY CYAN    BLACK          GRAY
#2563EB         #48D1C5           #111111        #333333
███             ███               ███            ███
```

## Quick Copy-Paste Code

### Hero Section with Brand Colors
```tsx
<section className="relative py-24">
  <div className="absolute inset-0 -z-10">
    <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-blue/5 rounded-full blur-3xl" />
    <div className="absolute top-1/2 -left-20 w-96 h-96 bg-secondary-cyan/5 rounded-full blur-3xl" />
  </div>

  <h1 className="text-6xl font-bold text-foreground">
    Your headline, <span className="bg-gradient-to-r from-primary-blue to-secondary-cyan bg-clip-text text-transparent">highlighted</span>.
  </h1>
  
  <Button className="bg-primary-blue hover:bg-blue-700">Primary Action</Button>
</section>
```

### Values Section
```tsx
import CoreValues from "@/components/CoreValues";

<section>
  <h2>Our Principles</h2>
  <CoreValues layout="grid" />
</section>
```

### Stat Cards
```tsx
<div className="grid grid-cols-3 gap-6">
  <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-background p-6">
    <h3 className="text-primary-blue font-bold text-4xl">1,234</h3>
    <p className="text-muted-foreground">Estudiantes</p>
  </div>
  
  <div className="rounded-2xl bg-gradient-to-br from-cyan-50 to-background p-6">
    <h3 className="text-secondary-cyan font-bold text-4xl">89</h3>
    <p className="text-muted-foreground">Recursos</p>
  </div>
</div>
```

### Pattern Decoration
```tsx
import ForoAgoraPattern from "@/components/ForoAgoraPattern";

<ForoAgoraPattern 
  ovals={6} 
  color="gradient" 
  className="h-64 w-64 opacity-30"
/>
```

## Tailwind Classes

### Colors
```
text-primary-blue        (Text)
bg-primary-blue          (Background)
border-primary-blue      (Border)
text-secondary-cyan      (Text)
bg-secondary-cyan        (Background)
```

### Gradients
```
bg-gradient-to-r from-primary-blue to-secondary-cyan
from-blue-50/50 to-background/80
```

### Animations
```
animate-pulse-glow
animate-slide-up
animate-float
```

## Brand Assets

### Logo Variations
- Horizontal: "🔹 Foro Agora" with stacked ovals
- Icon Only: Stacked oval stack
- Vertical: Logo stacked above text

### Font Pairing
- Headings: Poppins (bold, strong)
- Body: Inter (readable, clean)

## Core Values (6)

| Icon | Label | Color |
|------|-------|-------|
| 📈 | Progreso | Blue |
| 💡 | Oportunidades | Cyan |
| ⚡ | Potencial | Yellow |
| 📚 | Educación | Purple |
| 👥 | Comunidad | Green |
| ❤️ | Confianza | Pink |

## Tagline
**"Educamos hoy para transformar el mañana"**

## File Locations

```
Components:
  - src/components/CoreValues.tsx
  - src/components/ForoAgoraPattern.tsx

Pages:
  - src/pages/Index.tsx
  - src/pages/ImpactPage.tsx

Config:
  - tailwind.config.ts

Docs:
  - src/FORO_AGORA_USAGE_GUIDE.md
  - src/components/README_FORO_AGORA.md
```

## Common Patterns

### Branded Button
```tsx
<Button className="bg-primary-blue hover:bg-blue-700 text-white">
  Action <ArrowRight size={16} />
</Button>
```

### Branded Card
```tsx
<div className="rounded-2xl border border-border p-6 hover:shadow-lg">
  <div className="w-12 h-12 rounded-lg bg-primary-blue text-white flex items-center justify-center">
    <Icon />
  </div>
  <h3 className="font-bold text-foreground mt-4">Title</h3>
  <p className="text-muted-foreground">Description</p>
</div>
```

### Branded Badge
```tsx
<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full 
                bg-primary-blue/10 border border-primary-blue/20">
  <Sparkles size={14} className="text-primary-blue" />
  <span className="text-xs font-semibold text-primary-blue">Badge</span>
</div>
```

## Do's & Don'ts

✅ **DO:**
- Use blue for primary actions
- Use cyan for secondary elements
- Apply gradients to key headlines
- Include organizational values
- Maintain consistent spacing

❌ **DON'T:**
- Mix too many colors
- Reduce button contrast
- Remove value indicators
- Use undefined colors
- Forget dark mode support

## Accessibility Checklist
- [ ] Text contrast ≥ 4.5:1
- [ ] Focus states visible
- [ ] Keyboard navigation works
- [ ] Icons have labels
- [ ] Colors aren't sole indicator
- [ ] Animations <3 seconds

---

**Quick Tips:**
1. Always use color + pattern/icon (not color alone)
2. Test dark mode automatically
3. Maintain 8px spacing grid
4. Use CoreValues component for consistency
5. Apply gradients to important text

**Support:** See `FORO_AGORA_USAGE_GUIDE.md` for full documentation
