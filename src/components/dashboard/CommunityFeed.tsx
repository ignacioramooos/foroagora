import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface CommunityPost {
  id: string;
  author: string;
  type: "analysis" | "announcement";
  title: string;
  created_at: string;
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("es-UY", { day: "numeric", month: "short", year: "numeric" });

const CommunityFeed = () => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await (supabase as any)
        .from("community_posts")
        .select("id, author, type, title, created_at")
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .limit(10);

      if (data) setPosts(data as CommunityPost[]);
    };

    fetchPosts();
  }, []);

  const announcements = posts.filter((p) => p.type === "announcement");
  const analyses = posts.filter((p) => p.type === "analysis");

  return (
    <div className="p-6 md:p-10 max-w-3xl">
      <h1 className="text-2xl md:text-3xl text-foreground mb-2">Comunidad</h1>
      <p className="text-muted-foreground mb-8">Análisis de alumnos y anuncios del equipo.</p>

      {posts.length === 0 ? (
        <div className="border border-dashed border-border rounded-lg p-8 text-center text-sm text-muted-foreground">
          Próximamente — publicaciones del equipo y análisis de alumnos.
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <p className="text-xs font-heading font-medium uppercase tracking-widest text-muted-foreground mb-3">
              Anuncios
            </p>
            <div className="border border-border rounded-lg divide-y divide-border">
              {announcements.map((post) => (
                <div key={post.id} className="p-4">
                  <p className="text-sm font-heading font-medium text-foreground">{post.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{post.author} · {formatDate(post.created_at)}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-heading font-medium uppercase tracking-widest text-muted-foreground mb-3">
              Análisis de alumnos
            </p>
            <div className="border border-border rounded-lg divide-y divide-border">
              {analyses.map((post) => (
                <div key={post.id} className="p-4">
                  <p className="text-sm font-heading font-medium text-foreground">{post.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{post.author} · {formatDate(post.created_at)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityFeed;
