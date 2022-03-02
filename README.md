# mahur

[![Build Status](https://github.com/mgenware/mahur/workflows/Build/badge.svg)](https://github.com/mgenware/mahur/actions)
[![npm version](https://img.shields.io/npm/v/mahur.svg?style=flat-square)](https://npmjs.com/package/mahur)
[![Node.js Version](http://img.shields.io/node/v/mahur.svg?style=flat-square)](https://nodejs.org/en/)

Tiny event emitter for browser.

## Installation

```sh
npm i mahur
```

## Usage

Register and dispatch an event:

```ts
import { EventEmitter } from 'mahur';

const emitter = new EventEmitter();
// Register handler.
e.on('event', (arg) => console.log(arg));
// Dispatch events.
e.dispatch('event', 'hello');
// Prints 'hello'.
e.dispatch('event', 'world');
// Prints 'world'.
```

`once`:

Register and dispatch an event:

```ts
import { EventEmitter } from 'mahur';

const emitter = new EventEmitter();
// Register handler.
e.once('event', (arg) => console.log(arg));
// Dispatch events.
e.dispatch('event', 'hello');
// Prints 'hello'.
e.dispatch('event', 'world');
// `dispatch` returns false and nothing happens.
```

Unregister a handler:

```ts
import { EventEmitter } from 'mahur';

const emitter = new EventEmitter();
// Register handler.
const unreg = e.on('event', (arg) => console.log(arg));
// Dispatch events.
e.dispatch('event', 'hello');
// Prints 'hello'.
// Unregister the handler.
unreg();
e.dispatch('event', 'world');
// `dispatch` returns false and nothing happens.
```

Multiple handlers are supported:

```ts
import { EventEmitter } from 'mahur';

const emitter = new EventEmitter();
// Register handler.
e.once('event', (arg) => console.log('handler 1', arg));
e.once('event', (arg) => console.log('handler 2', arg));
// Dispatch events.
e.dispatch('event', 'hello');
// Prints 'handler 1, hello'.
// Prints 'handler 2, hello'.
```
