/**
 * Converte um texto em um identificador amigável para URL.
 * Ex.: "Camiseta Branca Premium" -> "camiseta-branca-premium".
 */
export function slugify(text) {
  return String(text)
    .normalize('NFD') // separa acentos das letras
    .replace(/\p{Diacritic}/gu, '') // remove as marcas de acento combinantes
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-') // troca não-alfanuméricos por hífen
    .replace(/^-+|-+$/g, ''); // remove hífens nas pontas
}
