import { Link, useParams } from "react-router-dom";
import { api } from "../api.js";
import { useAsync } from "../components/useAsync.js";
import { whatsappLink } from "../components/whatsapp.js";

export default function ProductDetail() {
  const { slug } = useParams();
  const product = useAsync(() => api.getProduct(slug), [slug]);
  const settings = useAsync(api.getSettings);

  if (product.loading || settings.loading) return <p className="container">Carregando...</p>;
  if (product.error) return <p className="container error">Produto não encontrado. <Link to="/">Voltar</Link></p>;

  const p = product.data;
  return (
    <div className="container" data-testid="product-detail">
      <Link to="/">← Voltar</Link>
      <div className="detail">
        {p.imageUrl && <img src={p.imageUrl} alt={p.name} />}
        <div>
          <h1>{p.name}</h1>
          <strong className="price">{p.price}</strong>
          <p>{p.description}</p>
          <a
            className="button whatsapp"
            data-testid="whatsapp-button"
            href={whatsappLink(settings.data?.whatsappNumber, p.name)}
            target="_blank"
            rel="noreferrer"
          >
            Falar no WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
