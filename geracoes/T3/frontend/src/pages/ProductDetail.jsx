import { Link, useParams } from "react-router-dom";
import { api } from "../api.js";
import { useAsync } from "../hooks/useAsync.js";
import { whatsappLink } from "../utils/whatsapp.js";

export default function ProductDetail() {
  const { slug } = useParams();
  const product = useAsync(() => api.getProduct(slug), [slug]);
  const settings = useAsync(api.getSettings);

  if (product.loading || settings.loading) return <p className="container">Carregando...</p>;
  if (product.error) {
    const message = product.error.status === 404 ? "Produto não encontrado." : "Erro ao carregar produto.";
    return <p className="container error">{message} <Link to="/">Voltar</Link></p>;
  }

  const item = product.data;

  return (
    <div className="container" data-testid="product-detail">
      <Link to="/">← Voltar</Link>
      <div className="detail">
        {item.imageUrl && <img src={item.imageUrl} alt={item.name} />}
        <div>
          <h1>{item.name}</h1>
          <strong className="price">{item.price}</strong>
          <p>{item.description}</p>
          {settings.error ? (
            <p className="error">Contato via WhatsApp indisponível no momento.</p>
          ) : (
            <a
              className="button whatsapp"
              data-testid="whatsapp-button"
              href={whatsappLink(settings.data.whatsappNumber, item.name)}
              target="_blank"
              rel="noreferrer"
            >
              Falar no WhatsApp
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
