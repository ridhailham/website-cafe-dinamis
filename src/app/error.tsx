"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 text-4xl">
        ☕
      </div>
      <h1 className="mt-6 font-serif text-3xl font-bold text-stone-900">
        Kopinya belum tersaji
      </h1>
      <p className="mt-3 max-w-md text-stone-600">
        Maaf, ada kendala saat memuat halaman. Silakan coba lagi — mungkin
        cuma butuh secangkir waktu.
      </p>
      <p className="mt-2 text-xs text-stone-400">
        {error.digest ? `Kode: ${error.digest}` : ""}
      </p>
      <button
        onClick={reset}
        className="mt-8 rounded-full bg-amber-600 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-amber-700"
      >
        Coba lagi
      </button>
    </div>
  );
}
