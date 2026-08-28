function ekstrakKoordinat(url: string): string | null {
  const m = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (m) return `${m[1]},${m[2]}`;
  const ll = url.match(/[?&]ll=(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (ll) return `${ll[1]},${ll[2]}`;
  return null;
}

// Mengubah berbagai bentuk URL Google Maps menjadi URL yang bisa di-render
// di dalam <iframe>. Mengembalikan null jika tidak bisa dikonversi.
export async function ubahKeEmbedMaps(url: string): Promise<string | null> {
  const bersih = url.trim();
  if (!bersih) return "";

  // Sudah berupa link embed — pakai apa adanya.
  if (bersih.includes("/maps/embed?") || bersih.includes("output=embed")) {
    return bersih;
  }

  // Bukan URL Google Maps — tolak.
  if (!/^(https?:\/\/)([a-z0-9-]+\.)?google\.(com|co\.id)\//i.test(bersih)) {
    return null;
  }

  let target = bersih;

  // Resolve short-link maps.app.goo.gl ke URL final.
  if (/maps\.app\.goo\.gl\//i.test(target)) {
    try {
      const res = await fetch(target, {
        method: "HEAD",
        redirect: "follow",
      });
      target = res.url || target;
    } catch {
      return null;
    }
  }

  if (target.includes("/maps/embed?") || target.includes("output=embed")) {
    return target;
  }

  // Ambil koordinat lalu bangun embed via ?q=LAT,LNG&output=embed.
  const koordinat = ekstrakKoordinat(target);
  if (koordinat) {
    return `https://www.google.com/maps?q=${koordinat}&output=embed`;
  }

  // Ambil query ?q=... lalu tambahkan output=embed.
  const q = target.match(/[?&]q=([^&]+)/);
  if (q) {
    return `https://www.google.com/maps?q=${q[1]}&output=embed`;
  }

  return null;
}
