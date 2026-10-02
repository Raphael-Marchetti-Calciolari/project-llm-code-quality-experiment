import test from 'node:test';
import assert from 'node:assert/strict';
import { hashPassword, verifyPassword, signToken, verifyToken } from '../src/auth.js';

test('hash de senha valida somente a senha correta', () => {
  const hash = hashPassword('admin123');
  assert.ok(verifyPassword('admin123', hash));
  assert.ok(!verifyPassword('outra', hash));
});

test('token assinado é verificável e adulteração é rejeitada', () => {
  const token = signToken({ sub: 'a@b.c' });
  assert.equal(verifyToken(token).sub, 'a@b.c');
  assert.equal(verifyToken(token.slice(0, -2) + 'xx'), null);
  assert.equal(verifyToken('lixo'), null);
});

test('token expirado é rejeitado', () => {
  assert.equal(verifyToken(signToken({ sub: 'x' }, -1)), null);
});
