import { Link, useParams } from 'react-router-dom';
import { useFetch } from '../useFetch.js';
import { whatsappUrl } from '../whatsapp.js';

export default function ProductDetail() {
  const { slug } = useParams();
  const product = useFetch(`/products/${slug}`);
  const store = useFetch('/store');

  if (product.loading || store.loading) return <p className="page">Carregando…</p>;
  if (product.error) return <div className="page"><p className="error">Produto não encontrado.</p><Link to="/">Voltar</Link></div>;

  const p = product.data;
  return (
    <div className="page">
      <Link to="/">← Voltar</Link>
      <article className="detail" data-testid="product-detail">
        <img src={p.imageUrl} alt={p.name} />
        <div>
          <h1>{p.name}</h1>
          <strong className="price">{p.price}</strong>
          <p>{p.description}</p>
          <a
            className="button"
            data-testid="whatsapp-button"
            href={whatsappUrl(store.data?.whatsapp, p.name)}
            target="_blank"
            rel="noreferrer"
          >
            Falar no WhatsApp
          </a>
        </div>
      </article>
    </div>
  );
}
