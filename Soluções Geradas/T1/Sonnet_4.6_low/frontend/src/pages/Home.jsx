import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';

export default function Home() {
  const [settings, setSettings] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getSettings(), api.getProducts()])
      .then(([s, p]) => { setSettings(s); setProducts(p); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ padding: '2rem', textAlign: 'center' }}>Carregando…</p>;

  return (
    <>
      <header className="site-header">
        <div className="container">
          <h1>{settings?.nomeLoja}</h1>
        </div>
      </header>

      <section className="hero">
        <h2>{settings?.tituloPrincipal}</h2>
        <p>{settings?.subtitulo}</p>
      </section>

      <main className="container">
        {products.length === 0 ? (
          <p className="empty">Nenhum produto disponível no momento.</p>
        ) : (
          <div className="product-grid">
            {products.map((p) => (
              <div className="card" key={p._id}>
                <img src={p.imagem} alt={p.nome} loading="lazy" />
                <div className="card-body">
                  <h3>{p.nome}</h3>
                  <p>{p.descricaoCurta}</p>
                  <span className="price">{p.preco}</span>
                  <Link to={`/produto/${p.slug}`}>Ver detalhes →</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
