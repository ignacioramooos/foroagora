import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Play, FileText, Download, Clock, BookOpen } from "lucide-react";

type ContentType = "video" | "article" | "material";

interface ContentItem {
  id: string;
  title: string;
  description: string | null;
  type: ContentType;
  youtube_url: string | null;
  content_body: string | null;
  file_url: string | null;
  module_name: string | null;
  thumbnail_url: string | null;
  duration_minutes: number | null;
  is_published: boolean;
}

const typeLabels: Record<ContentType, string> = {
  video: "Clase",
  article: "Artículo",
  material: "Material",
};

const typeIcons: Record<ContentType, typeof Play> = {
  video: Play,
  article: FileText,
  material: Download,
};

const extractYouTubeId = (url: string) => {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?\s]+)/);
  return match?.[1] || null;
};

const ContentLibrary = () => {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [filterType, setFilterType] = useState<ContentType | "all">("all");

  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await supabase
        .from("content_items")
        .select("*")
        .eq("is_published", true)
        .order("sort_order", { ascending: true });

      if (data) setItems(data as ContentItem[]);
      setLoading(false);
    };
    fetchContent();
  }, []);

  const filtered = filterType === "all" ? items : items.filter((i) => i.type === filterType);
  const modules = [...new Set(filtered.map((i) => i.module_name).filter(Boolean))];

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-semibold text-foreground">Clases y Recursos</h1>
        <p className="text-muted-foreground text-sm mt-1">Accedé a todas las clases grabadas, artículos y materiales del programa.</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {(["all", "video", "article", "material"] as const).map((t) => (
          <Button
            key={t}
            variant={filterType === t ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType(t)}
          >
            {t === "all" ? "Todos" : typeLabels[t]}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="text-muted-foreground text-sm py-12 text-center">Cargando contenido...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <BookOpen className="mx-auto text-muted-foreground" size={40} />
          <p className="text-muted-foreground">Aún no hay contenido disponible.</p>
          <p className="text-muted-foreground text-sm">Próximamente subiremos clases, artículos y materiales.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {modules.length > 0
            ? modules.map((mod) => (
                <div key={mod}>
                  <h2 className="text-lg font-heading font-medium text-foreground mb-3">{mod}</h2>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filtered
                      .filter((i) => i.module_name === mod)
                      .map((item) => (
                        <ContentCard key={item.id} item={item} onClick={() => setSelectedItem(item)} />
                      ))}
                  </div>
                </div>
              ))
            : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((item) => (
                  <ContentCard key={item.id} item={item} onClick={() => setSelectedItem(item)} />
                ))}
              </div>
            )}
        </div>
      )}

      {/* Detail Modal */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedItem && (
            <>
              <DialogHeader>
                <DialogTitle className="font-heading">{selectedItem.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {selectedItem.type === "video" && selectedItem.youtube_url && (
                  <div className="aspect-video rounded-md overflow-hidden bg-muted">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${extractYouTubeId(selectedItem.youtube_url)}`}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={selectedItem.title}
                    />
                  </div>
                )}
                {selectedItem.description && (
                  <p className="text-sm text-muted-foreground">{selectedItem.description}</p>
                )}
                {selectedItem.type === "article" && selectedItem.content_body && (
                  <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap">
                    {selectedItem.content_body}
                  </div>
                )}
                {selectedItem.type === "material" && selectedItem.file_url && (
                  <Button asChild variant="outline">
                    <a href={selectedItem.file_url} target="_blank" rel="noopener noreferrer">
                      <Download size={16} className="mr-2" />
                      Descargar material
                    </a>
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const ContentCard = ({ item, onClick }: { item: ContentItem; onClick: () => void }) => {
  const Icon = typeIcons[item.type];
  return (
    <Card className="cursor-pointer hover:border-foreground/20 transition-colors" onClick={onClick}>
      {item.type === "video" && item.youtube_url && (
        <div className="aspect-video bg-muted relative overflow-hidden rounded-t-lg">
          <img
            src={`https://img.youtube.com/vi/${extractYouTubeId(item.youtube_url)}/hqdefault.jpg`}
            alt={item.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-foreground/20">
            <Play className="text-background" size={36} />
          </div>
        </div>
      )}
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            <Icon size={12} className="mr-1" />
            {typeLabels[item.type]}
          </Badge>
          {item.duration_minutes && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock size={12} /> {item.duration_minutes} min
            </span>
          )}
        </div>
        <CardTitle className="text-base font-heading">{item.title}</CardTitle>
      </CardHeader>
      {item.description && (
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
        </CardContent>
      )}
    </Card>
  );
};

export default ContentLibrary;
