import { buildWhatsAppLink, productInquiryMessage } from '../utils/whatsapp.js';

/**
 * Botão que abre o WhatsApp com uma mensagem pré-preenchida
 * sobre o produto. Não é exibido quando não há número configurado.
 */
export function WhatsAppButton({ number, storeName, productName }) {
  const link = buildWhatsAppLink(number, productInquiryMessage(storeName, productName));

  if (!link) {
    return null;
  }

  return (
    <a className="btn btn--whatsapp" href={link} target="_blank" rel="noopener noreferrer">
      Falar no WhatsApp
    </a>
  );
}
