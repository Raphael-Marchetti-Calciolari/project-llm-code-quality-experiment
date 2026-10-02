import { Link } from "react-router-dom";
import { api } from "../api.js";
import { useAsync } from "../hooks/useAsync.js";

export default function Home() {
  const settings = useAsync(api.getSettings);
  const products = useAsync(api.getProducts);

  if (settings.loading || products.loading) return <p className="container">Carregando...</p>;
  if (settings.error || products.error) return <p className="container error">Erro ao carregar a vitrine.</p>;

  return (
    <div className="container">
      <header className="hero">
        <p className="store-name">{settings.data.storeName}</p>
        <h1>{settings.data.headline}</h1>
        <p>{settings.data.subtitle}</p>
      </header>

      {products.data.length === 0 && <p>Nenhum produto disponível.</p>}
      <div className="grid">
        {products.data.map((product) => (
          <Link key={product._id} to={`/produtos/${product.slug}`} className="card" data-testid={`public-product-card-${product.slug}`}>
            {product.imageUrl && <img src={product.imageUrl} alt={product.name} />}
            <h2>{product.name}</h2>
            <p>{product.shortDescription}</p>
            <strong>{product.price}</strong>
          </Link>
        ))}
      </div>
    </div>
  );
}
