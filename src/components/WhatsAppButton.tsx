import { MessageCircle } from "lucide-react";
import { useLocation } from "react-router-dom";

const WhatsAppButton = () => {
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard";

  return (
    <a
      href="https://chat.whatsapp.com/LIyfas9fhGUJzpv62LJTWg?mode=gi_t"
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed right-4 z-50 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform ${
        isDashboard
          ? "bottom-24 md:bottom-6 w-11 h-11 md:w-14 md:h-14"
          : "bottom-6 w-11 h-11 md:w-14 md:h-14"
      }`}
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />
    </a>
  );
};

export default WhatsAppButton;
