import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-background pt-20">
    <div className="text-center px-6">
      <span className="font-mono text-sm text-muted-foreground block mb-4">Error 404</span>
      <h1 className="text-5xl md:text-6xl font-heading font-bold text-foreground mb-4">
        Página no encontrada
      </h1>
      <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
        La página que buscás no existe o fue movida.
      </p>
      <Button asChild variant="cta" size="cta">
        <Link to="/">Volver al inicio</Link>
      </Button>
    </div>
  </div>
);

export default NotFound;
