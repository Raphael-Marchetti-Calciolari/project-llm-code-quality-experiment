import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="notfound">
      <h1>Página não encontrada</h1>
      <p>O endereço acessado não existe.</p>
      <Link to="/" className="link-back">
        ← Voltar para a vitrine
      </Link>
    </div>
  );
}
