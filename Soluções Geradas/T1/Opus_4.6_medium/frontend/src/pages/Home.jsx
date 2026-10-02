import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import '../styles.css';

export default function Home() {
  const [settings, setSettings] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.getSettings().then(setSettings).catch(() => {});
    api.getProducts().then(setProducts).catch(() => {});
  }, []);

  if (!settings) return null;

  return (
    <>
      <header className="header">
        <div className="container">
          <h1>{settings.storeName}</h1>
        </div>
      </header>

      <main className="container">
        <section className="hero">
          <h2>{settings.mainTitle}</h2>
          <p>{settings.subtitle}</p>
        </section>

        <section className="product-grid">
          {products.map((p) => (
            <Link to={`/produto/${p.slug}`} key={p._id} className="product-card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <img src={p.imageUrl} alt={p.name} />
              <div className="product-card-body">
                <h3>{p.name}</h3>
                <p className="short-desc">{p.shortDescription}</p>
                <p className="price">{p.price}</p>
              </div>
            </Link>
          ))}
        </section>
      </main>

      <footer className="footer">
        <p>{settings.storeName}</p>
      </footer>
    </>
  );
}
