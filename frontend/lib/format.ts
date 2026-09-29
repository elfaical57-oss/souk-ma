export function formatMAD(value: number): string {
  return `${Math.round(value).toLocaleString("fr-FR")} DH`;
}

export function formatCount(value: number): string {
  return value.toLocaleString("fr-FR");
}

export function startingPrice(
  price: number,
  bulkPrices?: { qty: number; price: number }[] | null
): number {
  if (!bulkPrices?.length) return price;
  return Math.min(price, ...bulkPrices.map((b) => b.price));
}

export function discountPercent(price: number, fromPrice: number): number | null {
  if (fromPrice >= price || price <= 0) return null;
  return Math.round((1 - fromPrice / price) * 100);
}
