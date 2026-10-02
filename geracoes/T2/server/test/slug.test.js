import test from 'node:test';
import assert from 'node:assert/strict';
import { slugify } from '../src/slug.js';

test('slugify remove acentos, espaços e símbolos', () => {
  assert.equal(slugify('  Camiseta Básica Açaí! '), 'camiseta-basica-acai');
  assert.equal(slugify('A  --  B'), 'a-b');
});
