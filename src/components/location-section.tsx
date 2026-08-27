import { Clock, MapPin } from "lucide-react";
import { kedai } from "@/data/kedai";
import { WhatsAppIcon } from "./whatsapp-icon";

type JamBukaItem = { hari: string; jam: string };

type Props = {
  waUrl?: string;
  jamBuka?: JamBukaItem[];
  mapsEmbed?: string;
};

export function LocationSection({
  waUrl,
  jamBuka,
  mapsEmbed,
}: Props) {
  const waLink =
    waUrl || kedai.wa.url;
  const jam = jamBuka && jamBuka.length > 0 ? jamBuka : kedai.jamBuka;
  const peta = mapsEmbed || kedai.mapsEmbed;

  return (
    <section id="lokasi" className="scroll-mt-16 bg-white py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-amber-700">
            Lokasi
          </p>
          <h2 className="mt-2 font-serif text-3xl font-bold text-stone-900 sm:text-4xl">
            Mampir ke Tempat Kami
          </h2>
        </div>

        <div className="grid items-stretch gap-8 md:grid-cols-2">
          <div className="flex flex-col justify-between gap-6">
            <div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
                <p className="leading-relaxed text-stone-700">{kedai.alamat}</p>
              </div>

              <div className="mt-6 flex items-start gap-3">
                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
                <dl className="w-full space-y-2">
                  {jam.map((j, i) => (
                    <div
                      key={`${j.hari}-${i}`}
                      className="flex items-center justify-between border-b border-dashed border-stone-200 pb-2 text-stone-700"
                    >
                      <dt className="font-medium">{j.hari}</dt>
                      <dd>{j.jam} WIB</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-2 rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-700"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Reservasi via WhatsApp
            </a>
          </div>

          {peta && (
            <iframe
              src={peta}
              title={`Peta lokasi ${kedai.nama}`}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              className="h-72 w-full rounded-2xl border-0 md:h-auto md:min-h-80"
            />
          )}
        </div>
      </div>
    </section>
  );
}
