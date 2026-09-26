export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/templates/:path*",
    "/create/:path*",
    "/posters/:path*",
    "/history/:path*",
  ],
};