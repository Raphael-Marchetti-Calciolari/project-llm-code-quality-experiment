import { useFetch } from '../useFetch.js';
import ProductCard from '../components/ProductCard.jsx';
import Loading from '../components/Loading.jsx';

export default function Home() {
  const { data: store, error: storeError, loading: storeLoading } = useFetch('/store');
  const { data: products, error: productsError, loading: productsLoading } = useFetch('/products');

  if (storeLoading || productsLoading) return <Loading className="page" />;
  if (storeError || productsError) return <p className="page error">Não foi possível carregar a loja.</p>;

  return (
    <div className="page">
      <header className="hero">
        <p className="store-name">{store.storeName}</p>
        <h1>{store.headline}</h1>
        <p>{store.subtitle}</p>
      </header>
      {products.length === 0 ? (
        <p>Nenhum produto disponível no momento.</p>
      ) : (
        <div className="grid">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      )}
    </div>
  );
}
