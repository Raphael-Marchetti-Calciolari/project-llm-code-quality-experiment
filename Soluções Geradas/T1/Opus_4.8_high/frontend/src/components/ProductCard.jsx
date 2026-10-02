import { Link } from 'react-router-dom';

/**
 * Cartão de produto exibido na listagem da vitrine.
 */
export function ProductCard({ product }) {
  return (
    <Link to={`/produto/${product.slug}`} className="product-card">
      <div className="product-card__image">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} loading="lazy" />
        ) : (
          <span className="product-card__placeholder">Sem imagem</span>
        )}
      </div>
      <div className="product-card__body">
        <h3 className="product-card__name">{product.name}</h3>
        {product.shortDescription && (
          <p className="product-card__desc">{product.shortDescription}</p>
        )}
        {product.price && <p className="product-card__price">{product.price}</p>}
      </div>
    </Link>
  );
}
