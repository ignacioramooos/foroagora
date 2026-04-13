import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Plus, Pencil, Trash2, Video, FileText, Download, LogOut } from "lucide-react";
import { toast } from "@/hooks/use-toast";

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
  sort_order: number;
  is_published: boolean;
  created_at: string;
}

const emptyForm = {
  title: "",
  description: "",
  type: "video" as ContentType,
  youtube_url: "",
  content_body: "",
  file_url: "",
  module_name: "",
  duration_minutes: "",
  sort_order: "0",
  is_published: false,
};

const AdminPage = () => {
  const { isLoggedIn, logout, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [filterType, setFilterType] = useState<ContentType | "all">("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchItems = async () => {
    const { data } = await supabase
      .from("content_items")
      .select("*")
      .order("sort_order", { ascending: true });
    if (data) setItems(data as ContentItem[]);
    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin) fetchItems();
  }, [isAdmin]);

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <span className="text-muted-foreground text-sm font-heading">Cargando...</span>
      </div>
    );
  }

  if (!isLoggedIn || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <h1 className="text-xl font-heading font-semibold text-foreground">Acceso denegado</h1>
          <p className="text-muted-foreground text-sm">No tenés permisos de administrador.</p>
          <Button asChild variant="outline">
            <Link to="/dashboard">Volver al Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (item: ContentItem) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      description: item.description || "",
      type: item.type,
      youtube_url: item.youtube_url || "",
      content_body: item.content_body || "",
      file_url: item.file_url || "",
      module_name: item.module_name || "",
      duration_minutes: item.duration_minutes?.toString() || "",
      sort_order: item.sort_order.toString(),
      is_published: item.is_published,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast({ title: "El título es obligatorio", variant: "destructive" });
      return;
    }
    setSaving(true);

    const { data: { user } } = await supabase.auth.getUser();
    
    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      type: form.type,
      youtube_url: form.type === "video" ? (form.youtube_url.trim() || null) : null,
      content_body: form.type === "article" ? (form.content_body.trim() || null) : null,
      file_url: form.type === "material" ? (form.file_url.trim() || null) : null,
      module_name: form.module_name.trim() || null,
      duration_minutes: form.duration_minutes ? parseInt(form.duration_minutes) : null,
      sort_order: parseInt(form.sort_order) || 0,
      is_published: form.is_published,
    };

    let error;
    if (editingId) {
      ({ error } = await supabase.from("content_items").update(payload).eq("id", editingId));
    } else {
      ({ error } = await supabase.from("content_items").insert({ ...payload, created_by: user!.id }));
    }

    setSaving(false);
    if (error) {
      toast({ title: "Error al guardar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: editingId ? "Contenido actualizado" : "Contenido creado" });
      setDialogOpen(false);
      fetchItems();
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from("content_items").delete().eq("id", deleteId);
    if (error) {
      toast({ title: "Error al eliminar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Contenido eliminado" });
      fetchItems();
    }
    setDeleteId(null);
  };

  const filtered = filterType === "all" ? items : items.filter((i) => i.type === filterType);
  const typeIcon = { video: Video, article: FileText, material: Download };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="icon">
              <Link to="/dashboard"><ArrowLeft size={18} /></Link>
            </Button>
            <h1 className="text-lg font-heading font-semibold text-foreground">Panel de Administración</h1>
          </div>
          <Button variant="ghost" size="sm" onClick={logout}>
            <LogOut size={16} className="mr-2" /> Salir
          </Button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(["video", "article", "material"] as const).map((t) => {
            const count = items.filter((i) => i.type === t).length;
            const Icon = typeIcon[t];
            return (
              <Card key={t}>
                <CardContent className="p-4 flex items-center gap-3">
                  <Icon size={20} className="text-muted-foreground" />
                  <div>
                    <p className="text-2xl font-heading font-semibold">{count}</p>
                    <p className="text-xs text-muted-foreground">
                      {t === "video" ? "Clases" : t === "article" ? "Artículos" : "Materiales"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-accent" />
              <div>
                <p className="text-2xl font-heading font-semibold">{items.filter((i) => i.is_published).length}</p>
                <p className="text-xs text-muted-foreground">Publicados</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex gap-2">
            {(["all", "video", "article", "material"] as const).map((t) => (
              <Button key={t} variant={filterType === t ? "default" : "outline"} size="sm" onClick={() => setFilterType(t)}>
                {t === "all" ? "Todos" : t === "video" ? "Clases" : t === "article" ? "Artículos" : "Materiales"}
              </Button>
            ))}
          </div>
          <Button onClick={openCreate} size="sm">
            <Plus size={16} className="mr-1" /> Nuevo contenido
          </Button>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center text-muted-foreground text-sm">Cargando...</div>
            ) : filtered.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">No hay contenido. Creá el primero.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead className="hidden md:table-cell">Tipo</TableHead>
                    <TableHead className="hidden md:table-cell">Módulo</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((item) => {
                    const Icon = typeIcon[item.type];
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium font-heading">{item.title}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant="secondary" className="text-xs">
                            <Icon size={12} className="mr-1" />
                            {item.type === "video" ? "Clase" : item.type === "article" ? "Artículo" : "Material"}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                          {item.module_name || "—"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={item.is_published ? "default" : "outline"} className="text-xs">
                            {item.is_published ? "Publicado" : "Borrador"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" onClick={() => openEdit(item)}>
                              <Pencil size={14} />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => setDeleteId(item.id)}>
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading">{editingId ? "Editar contenido" : "Nuevo contenido"}</DialogTitle>
            <DialogDescription>Completá los campos para {editingId ? "actualizar" : "crear"} el contenido.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Tipo de contenido</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as ContentType })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Clase (Video)</SelectItem>
                  <SelectItem value="article">Artículo</SelectItem>
                  <SelectItem value="material">Material descargable</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Título *</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Ej: Análisis Técnico - Clase 1" />
            </div>

            <div className="space-y-2">
              <Label>Descripción</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Breve descripción del contenido..." rows={2} />
            </div>

            <div className="space-y-2">
              <Label>Módulo</Label>
              <Input value={form.module_name} onChange={(e) => setForm({ ...form, module_name: e.target.value })} placeholder="Ej: Módulo 1 - Fundamentos" />
            </div>

            {form.type === "video" && (
              <>
                <div className="space-y-2">
                  <Label>URL de YouTube (no listado)</Label>
                  <Input value={form.youtube_url} onChange={(e) => setForm({ ...form, youtube_url: e.target.value })} placeholder="https://www.youtube.com/watch?v=..." />
                </div>
                <div className="space-y-2">
                  <Label>Duración (minutos)</Label>
                  <Input type="number" value={form.duration_minutes} onChange={(e) => setForm({ ...form, duration_minutes: e.target.value })} placeholder="45" />
                </div>
              </>
            )}

            {form.type === "article" && (
              <div className="space-y-2">
                <Label>Contenido del artículo</Label>
                <Textarea value={form.content_body} onChange={(e) => setForm({ ...form, content_body: e.target.value })} placeholder="Escribí el contenido del artículo..." rows={8} />
              </div>
            )}

            {form.type === "material" && (
              <div className="space-y-2">
                <Label>URL del archivo</Label>
                <Input value={form.file_url} onChange={(e) => setForm({ ...form, file_url: e.target.value })} placeholder="https://drive.google.com/..." />
              </div>
            )}

            <div className="space-y-2">
              <Label>Orden</Label>
              <Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} placeholder="0" />
            </div>

            <div className="flex items-center gap-3">
              <Switch checked={form.is_published} onCheckedChange={(v) => setForm({ ...form, is_published: v })} />
              <Label>Publicar inmediatamente</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? "Guardando..." : "Guardar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-heading">¿Eliminar contenido?</DialogTitle>
            <DialogDescription>Esta acción no se puede deshacer.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDelete}>Eliminar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPage;
