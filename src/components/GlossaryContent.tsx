import { useState, useMemo, useRef } from "react";
import { Search } from "lucide-react";
import { glossaryTerms, categoryLabels, type GlossaryCategory } from "@/lib/glossaryData";

const allCategories: GlossaryCategory[] = ['conceptos-basicos', 'estados-financieros', 'ratios', 'valoracion', 'mercado'];

const GlossaryContent = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<GlossaryCategory | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    let items = glossaryTerms;
    if (activeCategory) items = items.filter((t) => t.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(
        (t) =>
          t.term.toLowerCase().includes(q) ||
          t.termEn.toLowerCase().includes(q) ||
          t.definition.toLowerCase().includes(q)
      );
    }
    return items;
  }, [search, activeCategory]);

  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const availableLetters = useMemo(
    () => new Set(filtered.map((t) => t.term[0].toUpperCase())),
    [filtered]
  );

  const scrollToLetter = (letter: string) => {
    const el = document.getElementById(`glossary-letter-${letter}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Group by first letter
  const grouped = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    filtered.forEach((t) => {
      const letter = t.term[0].toUpperCase();
      if (!map.has(letter)) map.set(letter, []);
      map.get(letter)!.push(t);
    });
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  return (
    <div ref={containerRef}>
      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar término..."
          className="w-full h-11 pl-10 pr-4 rounded-lg border border-border bg-background text-foreground text-sm font-heading focus:outline-none focus:ring-2 focus:ring-ring/50"
        />
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-3 py-1.5 rounded-md text-sm font-heading font-medium transition-colors ${
            !activeCategory
              ? "bg-accent text-accent-foreground"
              : "border border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          Todos
        </button>
        {allCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
            className={`px-3 py-1.5 rounded-md text-sm font-heading font-medium transition-colors ${
              activeCategory === cat
                ? "bg-accent text-accent-foreground"
                : "border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {categoryLabels[cat]}
          </button>
        ))}
      </div>

      {/* Alpha jump bar */}
      <div className="flex flex-wrap gap-1 mb-8">
        {letters.map((letter) => {
          const available = availableLetters.has(letter);
          return (
            <button
              key={letter}
              onClick={() => available && scrollToLetter(letter)}
              disabled={!available}
              className={`w-8 h-8 rounded text-xs font-heading font-semibold transition-colors ${
                available
                  ? "text-foreground hover:bg-secondary cursor-pointer"
                  : "text-muted-foreground/30 cursor-default"
              }`}
            >
              {letter}
            </button>
          );
        })}
      </div>

      {/* Terms */}
      {grouped.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-2">No encontramos ese término.</p>
          <p className="text-sm text-muted-foreground">
            ¿Querés que lo agreguemos?{" "}
            <a
              href="mailto:contacto@foroagora.com?subject=Sugerencia de término para el glosario"
              className="text-foreground underline underline-offset-2"
            >
              Escribinos
            </a>
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {grouped.map(([letter, terms]) => (
            <div key={letter} id={`glossary-letter-${letter}`}>
              <p className="text-xs font-heading font-semibold uppercase tracking-widest text-muted-foreground mb-3 border-b border-border pb-2">
                {letter}
              </p>
              <div className="grid gap-3">
                {terms.map((t) => (
                  <div key={t.term} className="border border-border rounded-lg p-5">
                    <div className="mb-2">
                      <h3 className="font-heading font-semibold text-foreground text-base inline">{t.term}</h3>
                      <span className="text-muted-foreground text-[13px] ml-2">{t.termEn}</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-2">{t.definition}</p>
                    <p className="text-sm text-muted-foreground/70 leading-relaxed pl-3 border-l-2 border-border italic">
                      {t.example}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-muted-foreground mt-10 text-center">
        {glossaryTerms.length} términos en total
      </p>
    </div>
  );
};

export default GlossaryContent;
