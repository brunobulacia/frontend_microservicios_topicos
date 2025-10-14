import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Obtener el token de las cookies (si usas persist de zustand)
  const authCookie = request.cookies.get("auth")?.value;

  let token = null;
  if (authCookie) {
    try {
      const authData = JSON.parse(authCookie);
      token = authData.state?.token;
    } catch (error) {
      console.error("Error parsing auth cookie:", error);
    }
  }

  // Rutas que no requieren autenticación
  const publicPaths = ["/login", "/register"];
  const isPublicPath = publicPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  // Si no hay token y está intentando acceder a rutas protegidas
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Si tiene token y está intentando acceder al login, redirigir al dashboard
  if (token && isPublicPath) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Proteger todas las rutas excepto las públicas
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
