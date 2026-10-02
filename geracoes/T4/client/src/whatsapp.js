export function whatsappUrl(number, productName) {
  const text = `Olá! Tenho interesse no produto: ${productName}`;
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}
