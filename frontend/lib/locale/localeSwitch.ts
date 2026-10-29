// Maps a pathname + target language to its mirrored URL, for routes that
// actually have a translated counterpart. Returns null everywhere else, so
// the switcher falls back to today's in-place toggle on unmirrored routes.
// Phase 1 only mirrors the homepage — extend this as more routes get an
// /ar equivalent.
export function getMirrorPath(pathname: string, target: "fr" | "ar"): string | null {
  if (pathname === "/" && target === "ar") return "/ar";
  if (pathname === "/ar" && target === "fr") return "/";
  return null;
}
