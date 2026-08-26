import { kedai } from "@/data/kedai";
import { WhatsAppIcon } from "./whatsapp-icon";

export function FloatingWA() {
  return (
    <a
      href={kedai.wa.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg shadow-green-600/30 transition-transform hover:scale-110"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
