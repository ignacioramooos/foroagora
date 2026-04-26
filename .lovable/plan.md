# Logo SVG "camino de piedras" en Hero y Navbar

Voy a recrear el isotipo del logo de Foro Agora como un componente SVG nativo (no imagen) que use `currentColor`, garantizando contraste perfecto en modo claro y oscuro al heredar el color del texto. Lo colocaré a la derecha del texto en el Hero de la landing y también junto al wordmark del Navbar para unificar la identidad de marca.

### Cambios

**1. Nuevo componente `src/components/StonePathLogo.tsx`**
- SVG puro con 7 elipses apiladas verticalmente (de la más pequeña arriba a la más grande abajo), replicando el isotipo del logo
- `fill="currentColor"` en todas las elipses → el color se hereda del `text-foreground` del contenedor → negro en modo claro, blanco en modo oscuro
- Props: `className`, opcional `size`
- viewBox proporcional (~1:2 vertical), sin colores hardcodeados ni gradientes

**2. Hero en `src/pages/Index.tsx`**
- Reestructurar el contenedor a grid de 2 columnas en desktop (`md:grid-cols-[1fr_auto]`):
  - Izquierda: todo el bloque actual (h1, párrafo subtítulo, `LiveStudentCounter`, botón "Inscribite") sin tocar el contenido
  - Derecha: `<StonePathLogo>` centrado verticalmente con altura responsive (~`h-80 md:h-[28rem]`) y `text-foreground`
- En mobile (<md) el logo se oculta (`hidden md:block`) para preservar el layout vertical actual

**3. Navbar en `src/components/Navbar.tsx`**
- En el `<Link to="/">` anteponer un `<StonePathLogo>` pequeño (~18-20px de alto) al texto "Foro Agora" con un pequeño gap
- Hereda `text-foreground` → contraste correcto en ambos temas

### Lo que NO se toca
- Contenido textual del Hero, del CTA, ni del contador
- Ningún color hardcodeado: todo vía `currentColor` y variables semánticas
- No se agregan archivos de imagen — el logo es código puro