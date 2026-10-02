export function whatsappLink(number, productName) {
  const digits = String(number || "").replace(/\D/g, "");
  const text = encodeURIComponent(`Olá! Tenho interesse no produto: ${productName}`);
  return `https://wa.me/${digits}?text=${text}`;
}
