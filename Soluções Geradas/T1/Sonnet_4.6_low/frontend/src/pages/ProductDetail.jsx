import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api.js';

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    Promise.all([api.getProductBySlug(slug), api.getSettings()])
      .then(([p, s]) => { setProduct(p); setSettings(s); })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <p style={{ padding: '2rem', textAlign: 'center' }}>Carregando…</p>;
  if (notFound) return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <p>Produto não encontrado.</p>
      <Link to="/" className="back-link" style={{ marginTop: '1rem' }}>← Voltar à loja</Link>
    </div>
  );

  const whatsappMsg = encodeURIComponent(
    `Olá! Tenho interesse no produto: ${product.nome} (${product.preco})`
  );
  const whatsappUrl = `https://wa.me/${settings?.whatsapp}?text=${whatsappMsg}`;

  return (
    <>
      <header className="site-header">
        <div className="container">
          <h1>{settings?.nomeLoja}</h1>
        </div>
      </header>

      <main className="container">
        <div style={{ paddingTop: '1.5rem' }}>
          <Link to="/" className="back-link">← Voltar ao catálogo</Link>
        </div>

        <div className="product-detail">
          <img src={product.imagem} alt={product.nome} />
          <div className="info">
            <h2>{product.nome}</h2>
            <p className="price">{product.preco}</p>
            <p>{product.descricaoCurta}</p>
            <p style={{ color: '#444', lineHeight: 1.7 }}>{product.descricaoCompleta}</p>
            <a
              className="btn-whatsapp"
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              💬 Falar no WhatsApp
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
