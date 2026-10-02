import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  return (
    <Link to={`/produtos/${product.slug}`} className="card-link">
      <article className="card" data-testid={`public-product-card-${product.slug}`}>
        <img src={product.imageUrl} alt={product.name} />
        <h3>{product.name}</h3>
        <p>{product.shortDescription}</p>
        <strong>{product.price}</strong>
      </article>
    </Link>
  );
}
