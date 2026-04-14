import { useRef, useCallback } from "react";
import { Trophy, Download, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useAuth } from "@/contexts/AuthContext";

interface Props {
  certificate: { certificate_code: string; issued_at: string };
  compact?: boolean;
}

const CertificateView = ({ certificate, compact = false }: Props) => {
  const certRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const studentName = user?.name || "Estudiante";
  const issuedDate = new Date(certificate.issued_at).toLocaleDateString("es-UY", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handleDownload = useCallback(async () => {
    if (!certRef.current) return;
    // Make visible for capture
    certRef.current.style.display = "block";
    const canvas = await html2canvas(certRef.current, {
      scale: 2,
      backgroundColor: null,
      useCORS: true,
    });
    certRef.current.style.display = "none";

    const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const imgData = canvas.toDataURL("image/png");
    pdf.addImage(imgData, "PNG", 0, 0, 297, 210);
    pdf.save(`certificado-${certificate.certificate_code}.pdf`);
  }, [certificate.certificate_code]);

  const linkedInText = encodeURIComponent(
    "Completé la formación introductoria de @CreciConCriterio sobre análisis fundamental de inversiones. #EducaciónFinanciera #Uruguay"
  );
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://aperr.lovable.app/formacion")}&summary=${linkedInText}`;

  if (compact) {
    return (
      <div className="border border-border rounded-lg p-5">
        <div className="flex items-center gap-3 mb-3">
          <Trophy size={20} style={{ color: "#22D07A" }} />
          <div>
            <p className="font-heading font-semibold text-foreground text-sm">Certificado obtenido</p>
            <p className="text-xs text-muted-foreground">{issuedDate}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleDownload} variant="cta" size="sm" className="gap-1.5">
            <Download size={14} /> Descargar
          </Button>
          <Button asChild variant="cta-outline" size="sm" className="gap-1.5">
            <a href={linkedInUrl} target="_blank" rel="noopener noreferrer">
              <Linkedin size={14} /> Compartir
            </a>
          </Button>
        </div>
        {/* Hidden certificate for PDF generation */}
        <div ref={certRef} style={{ display: "none", position: "fixed", left: "-9999px" }}>
          <CertificateCanvas name={studentName} code={certificate.certificate_code} date={issuedDate} />
        </div>
      </div>
    );
  }

  return (
    <div className="mb-10">
      <div className="text-center mb-8">
        <Trophy size={48} style={{ color: "#22D07A" }} className="mx-auto mb-4" />
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-2">
          ¡Completaste la formación!
        </h2>
        <p className="text-muted-foreground">
          Felicitaciones. Podés descargar tu certificado.
        </p>
      </div>
      <div className="flex justify-center gap-3 mb-8">
        <Button onClick={handleDownload} variant="cta" size="cta" className="gap-2">
          <Download size={16} /> Descargar mi certificado
        </Button>
        <Button asChild variant="cta-outline" size="cta" className="gap-2">
          <a href={linkedInUrl} target="_blank" rel="noopener noreferrer">
            <Linkedin size={16} /> Compartir en LinkedIn
          </a>
        </Button>
      </div>
      {/* Hidden certificate for PDF generation */}
      <div ref={certRef} style={{ display: "none", position: "fixed", left: "-9999px" }}>
        <CertificateCanvas name={studentName} code={certificate.certificate_code} date={issuedDate} />
      </div>
    </div>
  );
};

const CertificateCanvas = ({ name, code, date }: { name: string; code: string; date: string }) => (
  <div
    style={{
      width: 1122,
      height: 794,
      backgroundColor: "#0D1B2A",
      position: "relative",
      fontFamily: "system-ui, sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: 60,
    }}
  >
    {/* Green border frame */}
    <div
      style={{
        position: "absolute",
        top: 20,
        left: 20,
        right: 20,
        bottom: 20,
        border: "2px solid #22D07A",
        borderRadius: 4,
      }}
    />

    {/* Content */}
    <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
      <p style={{ color: "#22D07A", fontSize: 36, fontWeight: 700, marginBottom: 16, letterSpacing: 2 }}>
        Crecí con Criterio
      </p>
      <p style={{ color: "white", fontSize: 16, marginBottom: 40, opacity: 0.7 }}>
        Certifica que
      </p>
      <p style={{ color: "white", fontSize: 28, fontWeight: 700, marginBottom: 32 }}>
        {name}
      </p>
      <p style={{ color: "white", fontSize: 14, lineHeight: 1.6, maxWidth: 600, margin: "0 auto 48px", opacity: 0.8 }}>
        ha completado satisfactoriamente la Formación Online Introductoria en Análisis Fundamental de Inversiones.
      </p>
      <p style={{ color: "white", fontSize: 11, opacity: 0.5, maxWidth: 500, margin: "0 auto" }}>
        Este certificado acredita conocimientos introductorios y no constituye asesoramiento financiero.
      </p>
    </div>

    {/* Bottom info */}
    <div style={{ position: "absolute", bottom: 36, left: 40, right: 40, display: "flex", justifyContent: "space-between" }}>
      <span style={{ color: "white", fontSize: 10, opacity: 0.4 }}>{code}</span>
      <span style={{ color: "white", fontSize: 10, opacity: 0.4 }}>{date}</span>
    </div>
  </div>
);

export default CertificateView;
