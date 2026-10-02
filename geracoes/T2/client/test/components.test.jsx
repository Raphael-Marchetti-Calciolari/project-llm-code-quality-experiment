import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProductCard from '../src/components/ProductCard.jsx';
import ProductForm from '../src/components/ProductForm.jsx';

const product = { id: '1', slug: 'produto-fixture', name: 'Produto Fixture', shortDescription: 'Produto para testes', price: 'R$ 10,00', imageUrl: 'http://x/y.png' };

test('card público expõe data-testid com slug e link para detalhes', () => {
  render(<MemoryRouter><ProductCard product={product} /></MemoryRouter>);
  const card = screen.getByTestId('public-product-card-produto-fixture');
  expect(card.textContent).toContain('R$ 10,00');
  expect((card.closest('a') ?? card.querySelector('a')).getAttribute('href')).toBe('/produtos/produto-fixture');
});

test('formulário de produto expõe seletores e envia os dados preenchidos', async () => {
  const onSubmit = vi.fn().mockResolvedValue();
  render(<ProductForm onSubmit={onSubmit} />);
  for (const id of ['name', 'slug', 'short-description', 'description', 'price', 'image-url', 'active']) {
    expect(screen.getByTestId(`product-${id}`)).toBeTruthy();
  }
  fireEvent.change(screen.getByTestId('product-name'), { target: { value: 'Camiseta' } });
  fireEvent.change(screen.getByTestId('product-short-description'), { target: { value: 'c' } });
  fireEvent.change(screen.getByTestId('product-description'), { target: { value: 'd' } });
  fireEvent.change(screen.getByTestId('product-price'), { target: { value: 'R$ 1' } });
  fireEvent.change(screen.getByTestId('product-image-url'), { target: { value: 'http://i' } });
  fireEvent.click(screen.getByTestId('product-save'));
  await waitFor(() => expect(onSubmit).toHaveBeenCalled());
  expect(onSubmit.mock.calls[0][0]).toMatchObject({ name: 'Camiseta', price: 'R$ 1', active: true });
});

test('formulário exibe erro retornado pelo envio', async () => {
  const onSubmit = vi.fn().mockRejectedValue(new Error('Slug já está em uso'));
  render(<ProductForm onSubmit={onSubmit} />);
  fireEvent.click(screen.getByTestId('product-save'));
  expect((await screen.findByRole('alert')).textContent).toContain('Slug já está em uso');
});
