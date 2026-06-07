import { prisma } from "./prisma";

export function toSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
}

export async function uniqueSellerSlug(businessName: string, excludeUserId?: string): Promise<string> {
  const base = toSlug(businessName) || "boutique";
  let slug = base;
  let attempt = 0;
  while (true) {
    const existing = await prisma.sellerProfile.findUnique({
      where: { slug },
      select: { userId: true },
    });
    if (!existing || existing.userId === excludeUserId) return slug;
    attempt++;
    slug = `${base}-${attempt}`;
  }
}
