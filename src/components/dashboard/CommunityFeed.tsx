import { mockCommunityPosts } from "@/lib/mockData";

const CommunityFeed = () => (
  <div className="p-6 md:p-10 max-w-3xl">
    <h1 className="text-2xl md:text-3xl text-foreground mb-2">Comunidad</h1>
    <p className="text-muted-foreground mb-8">Análisis de alumnos y anuncios del equipo.</p>

    <div className="space-y-6">
      {/* Announcements */}
      <div>
        <p className="text-xs font-heading font-medium uppercase tracking-widest text-muted-foreground mb-3">
          Anuncios
        </p>
        <div className="border border-border rounded-lg divide-y divide-border">
          {mockCommunityPosts.filter((p) => p.type === "announcement").map((post) => (
            <div key={post.id} className="p-4">
              <p className="text-sm font-heading font-medium text-foreground">{post.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{post.author} · {post.date}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Student Analyses */}
      <div>
        <p className="text-xs font-heading font-medium uppercase tracking-widest text-muted-foreground mb-3">
          Análisis de alumnos
        </p>
        <div className="border border-border rounded-lg divide-y divide-border">
          {mockCommunityPosts.filter((p) => p.type === "analysis").map((post) => (
            <div key={post.id} className="p-4">
              <p className="text-sm font-heading font-medium text-foreground">{post.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{post.author} · {post.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default CommunityFeed;
