import test from 'node:test';
import assert from 'node:assert/strict';
import { BALLS, LETTERS, previousFive, letterFor, pickAvailable, spokenText } from '../src/bingo.js';

test('el tablero contiene 75 números consecutivos', () => {
  assert.equal(BALLS.length, 75);
  assert.deepEqual([BALLS[0], BALLS.at(-1)], [1, 75]);
});

test('cada bloque de quince tiene la letra de bingo correspondiente', () => {
  assert.deepEqual([1, 15, 16, 30, 31, 45, 46, 60, 61, 75].map(letterFor), ['B', 'B', 'I', 'I', 'N', 'N', 'G', 'G', 'O', 'O']);
  assert.equal(LETTERS.length, 5);
});

test('el historial devuelve las cinco anteriores a la última, con la más reciente primero', () => {
  assert.deepEqual(previousFive([1, 2, 3, 4, 5, 6, 7]), [6, 5, 4, 3, 2]);
  assert.deepEqual(previousFive([1]), []);
  assert.deepEqual(previousFive([]), []);
});

test('la selección aleatoria solo toma números disponibles y termina al agotarlos', () => {
  const allButLast = BALLS.slice(0, 74);
  assert.equal(pickAvailable(allButLast, () => 0), 75);
  assert.equal(pickAvailable(BALLS), null);
  assert.equal(pickAvailable([], () => 0.5), 38);
});

test('los tres formatos verbales producen el anuncio esperado', () => {
  assert.equal(spokenText(12, 'letter-number'), 'B 12');
  assert.equal(spokenText(12, 'number'), '12');
  assert.equal(spokenText(12, 'pause'), 'B... 12');
});
