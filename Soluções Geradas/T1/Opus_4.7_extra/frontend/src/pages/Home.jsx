import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';

export default function Home() {
  const [showcase, setShowcase] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([api.getShowcase(), api.getProducts()])
      .then(([showcaseData, productsData]) => {
        setShowcase(showcaseData);
        setProducts(productsData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="page">
        <p>Carregando vitrine...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <p className="error">{error}</p>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="hero">
        <p className="store-name">{showcase?.storeName}</p>
        <h1>{showcase?.heading}</h1>
        <p className="hero-subheading">{showcase?.subheading}</p>
      </header>

      <section>
        <h2 className="section-title">Produtos</h2>
        {products.length === 0 ? (
          <p>Nenhum produto disponível no momento.</p>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <Link
                key={product._id}
                to={`/produto/${product.slug}`}
                className="product-card"
              >
                <div className="product-card-image">
                  <img src={product.imageUrl} alt={product.name} />
                </div>
                <div className="product-card-body">
                  <h3>{product.name}</h3>
                  <p className="product-short">{product.shortDescription}</p>
                  <p className="product-price">{product.price}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
