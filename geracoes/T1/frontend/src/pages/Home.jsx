import { Link } from "react-router-dom";
import { api } from "../api.js";
import { useAsync } from "../components/useAsync.js";

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
        {products.data.map((p) => (
          <Link key={p._id} to={`/produtos/${p.slug}`} className="card" data-testid={`public-product-card-${p.slug}`}>
            {p.imageUrl && <img src={p.imageUrl} alt={p.name} />}
            <h2>{p.name}</h2>
            <p>{p.shortDescription}</p>
            <strong>{p.price}</strong>
          </Link>
        ))}
      </div>
    </div>
  );
}
