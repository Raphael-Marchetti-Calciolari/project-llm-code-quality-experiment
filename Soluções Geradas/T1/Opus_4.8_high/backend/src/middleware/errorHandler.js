import { ApiError } from '../utils/ApiError.js';

/**
 * Middleware para rotas não encontradas (404).
 */
export function notFound(req, res, next) {
  next(new ApiError(404, `Rota não encontrada: ${req.method} ${req.originalUrl}`));
}

/**
 * Middleware central de tratamento de erros.
 * Converte erros conhecidos em respostas JSON consistentes.
 */
export function errorHandler(err, req, res, _next) {
  // Erro de validação do Mongoose.
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((e) => e.message)
      .join(' ');
    return res.status(400).json({ message });
  }

  // Violação de índice único (ex.: slug duplicado).
  if (err.code === 11000) {
    return res.status(400).json({ message: 'Já existe um registro com esse identificador.' });
  }

  const statusCode = err.statusCode || 500;
  if (statusCode === 500) {
    console.error(err);
  }

  res.status(statusCode).json({
    message: err.message || 'Erro interno do servidor.',
  });
}
