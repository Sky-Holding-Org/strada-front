export function truncateToThreeSentences(text: string): string {
  const sentences = text.match(/[^\.!?]+[\.!?]+/g) || [];
  return sentences.slice(0, 3).join(" ").trim();
}

export function formatPrice(price: string | number): string {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EGP",
    minimumFractionDigits: 0,
  }).format(numPrice);
}
