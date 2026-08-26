import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "kopi_session";

function secretKey() {
  return new TextEncoder().encode(
    process.env.AUTH_SECRET ?? "dev-secret-ganti-sebelum-produksi"
  );
}

export async function proxy(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  const token = req.cookies.get(COOKIE_NAME)?.value;

  try {
    await jwtVerify(token ?? "", secretKey());
    return NextResponse.next();
  } catch {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
