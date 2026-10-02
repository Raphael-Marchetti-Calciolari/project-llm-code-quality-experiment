import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api';
import '../styles.css';

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    api.getProduct(slug).then(setProduct).catch(() => {});
    api.getSettings().then(setSettings).catch(() => {});
  }, [slug]);

  if (!product || !settings) return null;

  const whatsappUrl = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(`Olá! Tenho interesse no produto: ${product.name}`)}`;

  return (
    <>
      <header className="header">
        <div className="container">
          <h1><Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>{settings.storeName}</Link></h1>
        </div>
      </header>

      <main className="container">
        <Link to="/" className="back-link">&#8592; Voltar</Link>
        <div className="product-detail">
          <img src={product.imageUrl} alt={product.name} />
          <h2>{product.name}</h2>
          <p className="price">{product.price}</p>
          <p className="description">{product.fullDescription}</p>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
            Falar no WhatsApp
          </a>
        </div>
      </main>
    </>
  );
}
