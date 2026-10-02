import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { fetchPublicProducts } from '../../api/products.js';
import { ProductCard } from '../../components/ProductCard.jsx';
import { Loading, ErrorMessage, EmptyState } from '../../components/Feedback.jsx';

/**
 * Página inicial da loja: exibe título/subtítulo da vitrine
 * e a listagem dos produtos ativos.
 */
export function HomePage() {
  const { settings } = useOutletContext();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublicProducts()
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="hero">
        <h1 className="hero__title">{settings?.mainTitle}</h1>
        {settings?.subtitle && <p className="hero__subtitle">{settings.subtitle}</p>}
      </section>

      <section>
        {loading && <Loading label="Carregando produtos..." />}
        <ErrorMessage message={error} />
        {!loading && !error && products.length === 0 && (
          <EmptyState message="Nenhum produto disponível no momento." />
        )}
        {!loading && !error && products.length > 0 && (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
