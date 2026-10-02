import { whatsappUrl } from '../src/whatsapp.js';

test('monta link wa.me com mensagem codificada sobre o produto', () => {
  const url = new URL(whatsappUrl('5511999999999', 'Produto Fixture'));
  expect(url.origin + url.pathname).toBe('https://wa.me/5511999999999');
  expect(url.searchParams.get('text')).toContain('Produto Fixture');
});
