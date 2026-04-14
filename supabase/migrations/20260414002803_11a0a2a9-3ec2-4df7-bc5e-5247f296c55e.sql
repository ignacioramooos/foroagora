
-- Lessons table
CREATE TABLE public.lessons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  module_number INT NOT NULL,
  lesson_number INT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  estimated_minutes INT DEFAULT 10,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lessons are viewable by everyone"
ON public.lessons FOR SELECT TO public
USING (is_published = true);

-- Lesson progress table
CREATE TABLE public.lesson_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own progress"
ON public.lesson_progress FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can record their own progress"
ON public.lesson_progress FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Certificates table
CREATE TABLE public.certificates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  certificate_code TEXT UNIQUE DEFAULT 'CCC-' || UPPER(SUBSTR(gen_random_uuid()::TEXT, 1, 8))
);

ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own certificate"
ON public.certificates FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own certificate"
ON public.certificates FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- SEED: 8 lessons across 3 modules

INSERT INTO public.lessons (module_number, lesson_number, title, content, estimated_minutes) VALUES

(1, 1, 'El problema del dinero parado',
'## ¿Qué pasa cuando dejás tu plata quieta?

Imaginá que tenés $1.000 dólares guardados en tu casa. Suena bien, ¿no? Pero hay un problema invisible que pocos te explican: **la inflación**.

La inflación es el aumento general de los precios con el tiempo. En Uruguay, los precios suben en promedio entre un 7% y un 9% por año. Eso significa que lo que hoy comprás con $1.000, dentro de 10 años te va a costar alrededor de $2.000.

### Un ejemplo concreto

Supongamos que hoy un almuerzo completo sale $400. Si la inflación promedia 8% anual:
- En 5 años, ese mismo almuerzo cuesta ~$588
- En 10 años, cuesta ~$863

Tu billete de $1.000 sigue diciendo "$1.000", pero **compra menos cosas**. Tu dinero pierde valor sin que vos hagas nada.

### Entonces, ¿qué hacemos?

La solución no es gastar todo ahora. La solución es **poner tu dinero a trabajar** — es decir, invertirlo en algo que crezca al menos al ritmo de la inflación, o idealmente más rápido.

No hace falta ser millonario para invertir. Hace falta entender cómo funciona el dinero. Y eso es exactamente lo que vamos a aprender juntos en esta formación.

> "El dinero parado es dinero que se achica." — Warren Buffett (parafraseado)', 8),

(1, 2, 'Acciones vs. otras inversiones',
'## ¿Dónde podés poner tu plata?

Cuando hablamos de invertir, hay varias opciones. Cada una tiene ventajas y desventajas. Acá te las explicamos de forma simple.

### 1. Plazo fijo (depósito a término)
Le prestás tu plata al banco por un tiempo fijo. A cambio, te devuelven un poco más (el interés). Es seguro, pero el rendimiento suele ser bajo — muchas veces **ni siquiera le gana a la inflación**.

### 2. Bonos
Son como un "préstamo" que le hacés a un gobierno o empresa. Te pagan intereses periódicos. Son más seguros que las acciones pero con menor potencial de ganancia.

### 3. Inmuebles (propiedades)
Comprar una casa o apartamento para alquilar. Puede ser rentable, pero necesitás **mucho capital inicial** y no es fácil vender rápido si necesitás la plata.

### 4. Acciones
Cuando comprás una acción, comprás **una pequeña parte de una empresa**. Si la empresa crece y gana más plata, tu inversión crece con ella.

### ¿Por qué nos enfocamos en acciones?

Las acciones son accesibles (podés empezar con poco dinero), líquidas (podés vender cuando quieras) y, históricamente, **son la inversión que más rinde a largo plazo**.

El índice S&P 500 (que agrupa las 500 empresas más grandes de EEUU) ha rendido en promedio ~10% anual durante los últimos 50 años. Eso no significa que suba todos los años — hay años malos — pero a largo plazo, la tendencia es clara.

En esta formación vamos a aprender a analizar empresas para tomar decisiones inteligentes con nuestro dinero.', 10),

(1, 3, 'El poder del tiempo: interés compuesto',
'## El concepto más poderoso de las finanzas

Albert Einstein supuestamente dijo que el interés compuesto es la "octava maravilla del mundo". No sabemos si lo dijo de verdad, pero el concepto es real y poderoso.

### ¿Qué es el interés compuesto?

Es cuando **ganás interés sobre tu interés**. En lugar de retirar lo que ganás, lo dejás invertido. Así, cada año ganás un poco más que el anterior.

### Un ejemplo que lo explica todo

Supongamos que invertís $1.000 con un rendimiento del 10% anual:

| Año | Capital al inicio | Ganancia | Capital al final |
|-----|------------------|----------|-----------------|
| 1   | $1.000           | $100     | $1.100          |
| 2   | $1.100           | $110     | $1.210          |
| 3   | $1.210           | $121     | $1.331          |
| 5   | -                | -        | $1.611          |
| 10  | -                | -        | $2.594          |
| 20  | -                | -        | $6.728          |
| 30  | -                | -        | $17.449         |

¿Viste lo que pasó? En los primeros años la ganancia es chica. Pero después de 20-30 años, **el crecimiento es explosivo**. Esa curva exponencial es la magia del interés compuesto.

### ¿Por qué importa empezar joven?

Si empezás a los 17, tenés **más de 40 años** para que el interés compuesto trabaje a tu favor. Alguien que empieza a los 35 tiene la mitad de tiempo. El tiempo es tu mayor ventaja.

> "No necesitás mucho dinero para empezar. Necesitás empezar." — Consejo de InvertíUY', 10),

(2, 4, '¿Qué es una acción realmente?',
'## Una acción no es un billete de lotería

Mucha gente piensa que comprar acciones es como apostar. Comprás, cruzás los dedos y esperás que "suba". Eso no es invertir — eso es especular.

### La realidad

Una acción es un **certificado de propiedad parcial de una empresa**. Si comprás una acción de Apple, sos dueño de una pequeñísima parte de Apple. Eso significa que:

- Tenés derecho a una porción de las ganancias (dividendos)
- Si la empresa crece, tu parte vale más
- Podés vender tu parte cuando quieras en el mercado

### Pensalo así

Imaginá que tu amigo abre una pizzería. Necesita $100.000 para arrancar y te pide $10.000. A cambio, te da el 10% de la pizzería. Si la pizzería gana $50.000 por año, a vos te corresponden $5.000. Si después de unos años la pizzería vale $200.000, tu 10% vale $20.000.

Una acción funciona **exactamente igual**, pero con empresas más grandes y en un mercado donde podés comprar y vender fácilmente.

### ¿Por qué suben o bajan las acciones?

El precio de una acción refleja lo que la gente **cree que la empresa va a ganar en el futuro**. Si salen buenas noticias, más gente quiere comprar → el precio sube. Si salen malas noticias, la gente vende → el precio baja.

Pero acá está la clave: **el precio y el valor no siempre son lo mismo**. A veces el mercado exagera, tanto para arriba como para abajo. Aprender a distinguir precio de valor es el corazón del análisis fundamental.', 10),

(2, 5, 'Cómo gana dinero una empresa',
'## Toda empresa es una máquina de transformar dinero

No importa si es una multinacional o un puesto de panchos: toda empresa funciona con la misma lógica básica.

### La fórmula más simple del mundo

**Ganancia = Ingresos − Costos**

Los **ingresos** (revenue) son todo el dinero que entra por vender productos o servicios. Los **costos** son todo lo que gastás para operar: materiales, sueldos, alquiler, luz, impuestos, etc.

### Un ejemplo: la pizzería de Montevideo

Imaginá una pizzería que funciona así cada mes:

- **Ingresos**: vende 2.000 porciones a $80 c/u = $160.000
- **Costo de ingredientes**: $48.000 (harina, muzzarella, salsa)
- **Sueldos**: $60.000 (2 empleados + el dueño)
- **Alquiler y servicios**: $25.000
- **Impuestos y otros**: $12.000

**Ganancia del mes**: $160.000 − $145.000 = **$15.000**

### ¿Por qué importa esto para invertir?

Cuando analizás una empresa que cotiza en bolsa, estás haciendo exactamente este ejercicio pero a mayor escala. Querés saber:

1. ¿Cuánto vende? (¿Los ingresos crecen o se estancan?)
2. ¿Cuánto le cuesta operar? (¿Es eficiente o gasta de más?)
3. ¿Cuánto le queda al final? (¿La ganancia es buena en relación a lo que vende?)

### El concepto clave: márgenes

El **margen** es el porcentaje de ganancia sobre los ingresos. En nuestra pizzería: $15.000 / $160.000 = 9.4% de margen neto. Eso está bien para una pizzería, pero sería bajo para una empresa de software (que suele tener márgenes del 20-30%).

Comparar márgenes entre empresas del mismo sector te ayuda a identificar cuáles son más eficientes.', 12),

(2, 6, 'El Estado de Resultados simplificado',
'## Tu herramienta número uno para entender una empresa

El Estado de Resultados (o Income Statement en inglés) es el "resumen de cómo le fue" a una empresa en un período. Es como una libreta de calificaciones financiera.

### Las líneas que importan

Vamos de arriba hacia abajo, paso a paso:

**1. Ingresos (Revenue)**
Todo lo que la empresa facturó por sus ventas. Es la "línea de arriba" del estado.

**2. Costo de ventas (COGS)**
Lo que costó directamente producir lo que vendió: materias primas, manufactura, etc.

**3. Ganancia Bruta = Ingresos − Costo de ventas**
Cuánto queda después de cubrir los costos directos. Si vendés una remera por $1.000 que te costó $400 hacer, tu ganancia bruta es $600.

**4. Gastos operativos**
Los costos de mantener la empresa funcionando: sueldos de oficina, marketing, alquiler, investigación, etc.

**5. Ganancia Operativa = Ganancia Bruta − Gastos operativos**
Cuánto gana la empresa por su actividad principal, antes de intereses e impuestos.

**6. Intereses e impuestos**
Lo que paga por deudas y al Estado.

**7. Ganancia Neta = Ganancia Operativa − Intereses − Impuestos**
La "última línea". Lo que realmente le queda a la empresa (y a vos como accionista).

### ¿Cómo se lee en la práctica?

Buscá el Income Statement de cualquier empresa pública (ej: Apple, MercadoLibre) en sitios como Yahoo Finance. Vas a ver exactamente estas líneas. No te asustes por los números grandes — lo importante son los **porcentajes y las tendencias** (¿los ingresos crecen? ¿los márgenes mejoran o empeoran?).

En el próximo módulo vamos a usar esta herramienta para empezar a evaluar si una empresa está cara o barata.', 12),

(3, 7, '¿Cara o barata? Introducción al P/E ratio',
'## El ratio más famoso del mundo financiero

Ya sabés que una acción representa una parte de una empresa, y que las empresas ganan (o pierden) dinero. Ahora la pregunta clave: **¿cómo sabés si una acción está cara o barata?**

### El ratio P/E (Price-to-Earnings)

Es la relación entre el **precio de la acción** y las **ganancias por acción** (EPS).

**P/E = Precio de la acción ÷ Ganancia por acción**

### Un ejemplo simple

Si una acción cuesta $100 y la empresa gana $5 por acción al año, su P/E es 20. Eso significa que estás pagando **20 años de ganancias actuales** por esa acción.

### ¿Qué es un P/E "bueno"?

No hay un número mágico, pero algunas referencias:
- **P/E < 15**: Podría estar barata (o tener problemas)
- **P/E 15–25**: Rango normal para una empresa estable
- **P/E > 30**: Cara, pero quizás justificada si crece mucho

### Cuidado con las trampas

Un P/E bajo no siempre es bueno. Puede significar que el mercado espera que las ganancias caigan. Un P/E alto no siempre es malo — puede reflejar que la empresa está creciendo rápido y el mercado espera que gane mucho más en el futuro.

### La clave: comparar

El P/E sirve para **comparar empresas del mismo sector**. No tiene sentido comparar el P/E de un banco con el de una empresa de tecnología — son negocios muy distintos.

> Este es tu primer paso en la valoración de empresas. En las clases presenciales vamos a profundizar con herramientas más avanzadas como el DCF.', 10),

(3, 8, 'Por qué no enseñamos trading',
'## Invertir ≠ Especular

En InvertíUY tenemos una posición clara: **no enseñamos trading**. No es porque sea "malo" — es porque creemos que hay una forma mejor de pensar sobre el dinero.

### ¿Qué es trading?

Trading es comprar y vender activos en períodos cortos (minutos, horas, días) intentando ganar con las fluctuaciones del precio. Se basa principalmente en **análisis técnico**: estudiar gráficos, patrones de precios y señales estadísticas.

### ¿Qué es invertir con análisis fundamental?

Es estudiar el **negocio detrás de la acción**: qué vende la empresa, cuánto gana, qué tan buena es su posición competitiva, y cuánto vale realmente. Después, comprás cuando el precio del mercado está por debajo de ese valor. Y esperás.

### ¿Por qué elegimos el análisis fundamental?

1. **Las probabilidades están a tu favor**: Históricamente, los inversores a largo plazo ganan más que los traders. Más del 80% de los traders activos pierden dinero a largo plazo.

2. **No necesitás estar pegado a una pantalla**: Un inversor fundamental revisa sus inversiones unas pocas veces al mes. Un trader necesita mirar gráficos todo el día.

3. **Entendés lo que comprás**: No estás apostando a líneas en un gráfico. Estás comprando parte de un negocio real que entendés.

4. **Es más compatible con tu vida**: Sos estudiante. Tenés clases, amigos, hobbies. No necesitás (ni deberías) pasar horas mirando gráficos.

### El mensaje final

Aprender análisis fundamental te da una habilidad para toda la vida. No importa si terminás invirtiendo mucho o poco — vas a entender cómo funcionan las empresas, cómo se toman decisiones financieras y cómo pensar con criterio propio sobre el dinero.

> "El mercado es un mecanismo para transferir dinero del impaciente al paciente." — Warren Buffett

**¡Felicitaciones! Completaste la formación introductoria.** Si completaste todas las lecciones, podés descargar tu certificado.', 10);
