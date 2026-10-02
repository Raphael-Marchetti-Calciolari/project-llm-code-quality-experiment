/**
 * Envolve um handler assíncrono do Express e encaminha qualquer erro
 * para o middleware de tratamento de erros, evitando try/catch repetido.
 */
export const asyncHandler = (handler) => (req, res, next) => {
  Promise.resolve(handler(req, res, next)).catch(next);
};
