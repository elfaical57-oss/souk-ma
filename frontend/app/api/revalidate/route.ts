import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

// Called by the backend right after a product/seller write so the SSR'd
// detail page stops serving a stale (up to revalidate: 3600) price/stock
// while the client-fetched listing pages (always fresh) already show it.
export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  const { paths } = (await req.json()) as { paths?: string[] };
  if (!paths?.length) {
    return NextResponse.json({ message: "No paths provided" }, { status: 400 });
  }

  for (const path of paths) revalidatePath(path);
  return NextResponse.json({ revalidated: paths });
}
