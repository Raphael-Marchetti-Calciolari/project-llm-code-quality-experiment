/**
 * Pequenos componentes reutilizáveis de feedback visual:
 * carregamento, mensagem de erro e estado vazio.
 */

export function Loading({ label = 'Carregando...' }) {
  return <p className="feedback feedback--muted">{label}</p>;
}

export function ErrorMessage({ message }) {
  if (!message) return null;
  return <p className="feedback feedback--error">{message}</p>;
}

export function EmptyState({ message }) {
  return <p className="feedback feedback--muted">{message}</p>;
}
