import { useEffect, useState } from 'react';
import { Link, useOutletContext, useParams } from 'react-router-dom';
import { fetchPublicProduct } from '../../api/products.js';
import { WhatsAppButton } from '../../components/WhatsAppButton.jsx';
import { Loading, ErrorMessage } from '../../components/Feedback.jsx';

/**
 * Página de detalhes de um produto, com botão de contato via WhatsApp.
 */
export function ProductDetailPage() {
  const { slug } = useParams();
  const { settings } = useOutletContext();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setError('');
    fetchPublicProduct(slug)
      .then(setProduct)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <Loading label="Carregando produto..." />;
  if (error) {
    return (
      <>
        <ErrorMessage message={error} />
        <Link to="/" className="link-back">
          ← Voltar para a vitrine
        </Link>
      </>
    );
  }

  return (
    <article className="product-detail">
      <Link to="/" className="link-back">
        ← Voltar para a vitrine
      </Link>

      <div className="product-detail__content">
        <div className="product-detail__image">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} />
          ) : (
            <span className="product-card__placeholder">Sem imagem</span>
          )}
        </div>

        <div className="product-detail__info">
          <h1>{product.name}</h1>
          {product.price && <p className="product-detail__price">{product.price}</p>}
          {product.shortDescription && (
            <p className="product-detail__short">{product.shortDescription}</p>
          )}
          {product.fullDescription && (
            <p className="product-detail__full">{product.fullDescription}</p>
          )}

          <WhatsAppButton
            number={settings?.whatsappNumber}
            storeName={settings?.storeName}
            productName={product.name}
          />
        </div>
      </div>
    </article>
  );
}
