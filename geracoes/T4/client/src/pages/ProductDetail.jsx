import { Link, useParams } from 'react-router-dom';
import { useFetch } from '../useFetch.js';
import { whatsappUrl } from '../whatsapp.js';
import Loading from '../components/Loading.jsx';

export default function ProductDetail() {
  const { slug } = useParams();
  const { data: product, error: productError, loading: productLoading } = useFetch(`/products/${encodeURIComponent(slug)}`);
  const { data: store, loading: storeLoading } = useFetch('/store');

  if (productLoading || storeLoading) return <Loading className="page" />;
  if (productError) {
    const message = productError.status === 404 ? 'Produto não encontrado.' : productError.message;
    return (
      <div className="page">
        <p className="error">{message}</p>
        <Link to="/">Voltar</Link>
      </div>
    );
  }

  return (
    <div className="page">
      <Link to="/">← Voltar</Link>
      <article className="detail" data-testid="product-detail">
        <img src={product.imageUrl} alt={product.name} />
        <div>
          <h1>{product.name}</h1>
          <strong className="price">{product.price}</strong>
          <p>{product.description}</p>
          {store?.whatsapp && (
            <a
              className="button"
              data-testid="whatsapp-button"
              href={whatsappUrl(store.whatsapp, product.name)}
              target="_blank"
              rel="noreferrer"
            >
              Falar no WhatsApp
            </a>
          )}
        </div>
      </article>
    </div>
  );
}
