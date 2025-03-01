import { NextResponse } from "next/server";

export function middleware(request: {
  nextUrl: { pathname: any };
  cookies: { get: (arg0: string) => any };
  url: string | URL | undefined;
}) {
  const { pathname } = request.nextUrl;
  const isCookieExist = !!request.cookies.get("sb_token");
  const isLoginPage = pathname.startsWith("/login");

  if (
    isCookieExist === false &&
    !isLoginPage &&
    !["/register"].includes(pathname)
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isCookieExist && isLoginPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: "/((?!api|_next|static|public|favicon.ico).*)",
};
