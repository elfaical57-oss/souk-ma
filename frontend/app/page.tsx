import HomeContent, { type Seller } from "./HomeContent";

export const revalidate = 0;

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function getTopSellers(): Promise<Seller[]> {
  try {
    const res = await fetch(`${API_URL}/sellers`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return (Array.isArray(data) ? data : []).slice(0, 8);
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const sellers = await getTopSellers();
  return <HomeContent sellers={sellers} />;
}
