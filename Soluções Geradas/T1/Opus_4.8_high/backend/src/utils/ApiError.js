/**
 * Erro de aplicação com código de status HTTP associado.
 * Permite que controllers sinalizem falhas previsíveis
 * (ex.: 404, 400, 401) de forma consistente.
 */
export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}
