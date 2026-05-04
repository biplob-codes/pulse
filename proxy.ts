import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getSession } from "./lib/auth-session";
// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: "/dashboard/:path*",
};
