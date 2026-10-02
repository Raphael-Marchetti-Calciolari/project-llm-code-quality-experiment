import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api.js';

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [showcase, setShowcase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([api.getProduct(slug), api.getShowcase()])
      .then(([productData, showcaseData]) => {
        setProduct(productData);
        setShowcase(showcaseData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="page">
        <p>Carregando produto...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <Link to="/" className="back-link">← Voltar para a vitrine</Link>
        <p className="error">{error}</p>
      </div>
    );
  }

  const message = `Olá! Tenho interesse no produto: ${product.name}.`;
  const whatsappUrl = `https://wa.me/${showcase?.whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="page">
      <Link to="/" className="back-link">← Voltar para a vitrine</Link>
      <article className="product-detail">
        <div className="product-detail-image">
          <img src={product.imageUrl} alt={product.name} />
        </div>
        <div className="product-detail-body">
          <h1>{product.name}</h1>
          <p className="product-price-large">{product.price}</p>
          <p className="product-short">{product.shortDescription}</p>
          <p className="product-full">{product.fullDescription}</p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-button"
          >
            Falar no WhatsApp sobre este produto
          </a>
        </div>
      </article>
    </div>
  );
}
