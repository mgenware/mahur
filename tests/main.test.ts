import * as assert from 'assert';
import { EventEmitter } from '../dist/main.js';

it('Register and dispatch', () => {
  const e = new EventEmitter();

  // Register and dispatch an event.
  let aStr = '';
  e.on('a', (arg) => (aStr += `${arg}`));
  assert.ok(e.dispatch('a', '1'));
  assert.strictEqual(aStr, '1');

  // Dispatch another event.
  let bStr = '';
  e.on('b', (arg) => (bStr += `${arg}`));
  assert.ok(e.dispatch('b', '1'));
  assert.strictEqual(bStr, '1');
  assert.strictEqual(aStr, '1');

  // Multiple handlers on an event.
  e.on('a', (arg) => (aStr += `(${arg})`));
  assert.ok(e.dispatch('a', '2'));
  assert.strictEqual(aStr, '12(2)');
  assert.strictEqual(bStr, '1');
});

it('on', () => {
  const e = new EventEmitter();
  let aStr = '';
  e.on('a', (arg) => (aStr += `${arg}`));

  assert.ok(e.dispatch('a', 1));
  assert.ok(e.dispatch('a', 2));
  assert.ok(e.dispatch('a', 3));
  assert.strictEqual(aStr, '123');
});

it('Unregister', () => {
  const e = new EventEmitter();
  let aStr = '';
  const unreg = e.on('a', (arg) => (aStr += `${arg}`));

  assert.ok(e.dispatch('a', 1));
  unreg();
  assert.ok(e.dispatch('a', 2) === false);
  assert.ok(e.dispatch('a', 3) === false);
  assert.strictEqual(aStr, '1');
});

it('Unregister (multiple actions)', () => {
  const e = new EventEmitter();
  let aStr = '';
  const unreg1 = e.on('a', (arg) => (aStr += `-${arg}`));
  const unreg2 = e.on('a', (arg) => (aStr += `=${arg}`));

  assert.ok(e.dispatch('a', 1));
  unreg1();
  assert.strictEqual(aStr, '-1=1');
  // Cancelling a token for multiple times has no side effects.
  assert.ok(e.dispatch('a', 1));
  unreg1();
  assert.strictEqual(aStr, '-1=1=1');

  unreg2();
  assert.ok(e.dispatch('a', 2) === false);
  assert.ok(e.dispatch('a', 3) === false);
  assert.strictEqual(aStr, '-1=1=1');
});

it('once', () => {
  const e = new EventEmitter();
  let aStr = '';
  e.once('a', (arg) => (aStr += `${arg}`));

  assert.ok(e.dispatch('a', 1));
  assert.strictEqual(aStr, '1');
  assert.ok(e.dispatch('a', 1) === false);
  assert.strictEqual(aStr, '1');
});

it('Unregister (once)', () => {
  const e = new EventEmitter();
  let aStr = '';
  const unreg = e.once('a', (arg) => (aStr += `${arg}`));

  unreg();
  assert.ok(e.dispatch('a', 1) === false);
  assert.strictEqual(aStr, '');
});

it('Arg of T', () => {
  const e = new EventEmitter<number>();
  let aStr = '';
  e.once('a', (arg) => (aStr += `${arg}`));

  assert.ok(e.dispatch('a', 1));
  assert.strictEqual(aStr, '1');
  assert.ok(e.dispatch('a', 1) === false);
  assert.strictEqual(aStr, '1');
});
