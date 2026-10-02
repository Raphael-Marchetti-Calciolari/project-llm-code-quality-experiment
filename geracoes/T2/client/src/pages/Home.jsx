import { useFetch } from '../useFetch.js';
import ProductCard from '../components/ProductCard.jsx';

export default function Home() {
  const store = useFetch('/store');
  const products = useFetch('/products');

  if (store.loading || products.loading) return <p className="page">Carregando…</p>;
  if (store.error || products.error) return <p className="page error">Não foi possível carregar a loja.</p>;

  return (
    <div className="page">
      <header className="hero">
        <p className="store-name">{store.data.storeName}</p>
        <h1>{store.data.headline}</h1>
        <p>{store.data.subtitle}</p>
      </header>
      {products.data.length === 0 ? (
        <p>Nenhum produto disponível no momento.</p>
      ) : (
        <div className="grid">
          {products.data.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
