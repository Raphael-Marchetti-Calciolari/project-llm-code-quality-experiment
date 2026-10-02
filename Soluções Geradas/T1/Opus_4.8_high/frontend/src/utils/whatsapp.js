/**
 * Monta o link "wa.me" para iniciar uma conversa no WhatsApp,
 * já com uma mensagem pré-preenchida sobre o produto.
 *
 * @param {string} number - número com DDI/DDD, somente dígitos.
 * @param {string} message - texto da mensagem inicial.
 * @returns {string|null} URL do WhatsApp ou null se não houver número.
 */
export function buildWhatsAppLink(number, message) {
  const digits = String(number || '').replace(/\D/g, '');
  if (!digits) {
    return null;
  }
  const text = encodeURIComponent(message || '');
  return `https://wa.me/${digits}?text=${text}`;
}

/**
 * Texto padrão para o contato sobre um produto específico.
 */
export function productInquiryMessage(storeName, productName) {
  return `Olá, ${storeName || 'loja'}! Tenho interesse no produto "${productName}".`;
}
