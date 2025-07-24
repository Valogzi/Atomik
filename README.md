# ⚛️ Atomik

An ultra-fast and lightweight web framework for Node.js, inspired by simplicity and performance.

[![npm version](https://badge.fury.io/js/atomik.svg)](https://badge.fury.io/js/atomik) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Quick start

```bash
pnpm create atomikjs <projectName>
```

```typescript
import { Atomik } from 'atomikjs';

const app = new Atomik();

app.get('/', c => {
	return c.text('Hello, Atomik! 🚀');
});

export default app;

// Server starts automatically on port 5656
```

## 🌟 Features

- ⚡ **Ultra-fast** - Built with performance in mind
- 🪶 **Lightweight** - Minimal with no heavy dependencies
- 🔧 **Simple** - Intuitive and easy-to-use API
- 🛣️ **Routing** - Built-in routing system
- 🔌 **Middleware** - Full middleware support
- 📦 **TypeScript** - Native TypeScript support
- 🎯 **Context API** - Rich context for requests/responses
- 🕹️ **Multi-runtime** - Works on Cloudflare, Fastly, Deno, Bun, AWS, or Node.js. The same code runs on all platforms

## 🚀 Installation

```bash
# npm
npm install atomikjs

# pnpm
pnpm add atomikjs

# yarn
yarn add atomikjs
```

## 📖 Quick Start Guide

### Basic Application

```typescript
import { Atomik } from 'atomikjs';

const app = new Atomik();

app.get('/', c => {
	return c.text('Welcome to Atomik!');
});

app.post('/api/users', c => {
	return c.json({ message: 'User created' });
});

app.get('/html', c => {
	return c.html('<h1>Hello HTML!</h1>');
});

export default app;
```

### Supported HTTP Methods

```typescript
app.get('/users', c => c.json({ users: [] }));
app.post('/users', c => c.json({ created: true }));
app.put('/users/:id', c => c.json({ updated: true }));
app.delete('/users/:id', c => c.json({ deleted: true }));
app.patch('/users/:id', c => c.json({ patched: true }));
app.options('/users', c => c.set('x-header', 'preload').status(204).json({})); // empty json call signature to validate the request
app.head('/head', c => c.set('x-header', 'preload').status(204).json({})); // empty json call signature to validate the request
app.all('/all', c => c.json({ ok: true }));
```

### Middleware

```typescript
import { Atomik } from 'atomikjs';

const app = new Atomik();

// Logging middleware

// NOTE: When you use an explicit path in middleware, it's not just the exact path that's intercepted, it's the exact path and the entire route below it.
// ----- (e.g.) app.use("/post") --> captured routes: /post/*

// with implicit routing (*)
app.use((c, next) => {
	console.log(`${c.method} ${c.url}`);
	next();
});

// with explicit routing
app.use('*', (c, next) => {
	console.log(c.method, c.url);
	next();
});

// on specific route
app.use('/post/user', (c, next) => {
	// captured routes: /post/user/*
	console.log('From /post/user base url');
	next();
});

// CORS middleware
app.use(cors());

app.get('/', c => c.text('Hello with middleware!'));

export default app;
```

### Group Routing

```typescript
import { Atomik } from 'atomikjs';

const api = new Atomik();
// CORS middleware
api.use(cors());

api.get('/posts', c => c.json({ posts: ['all posts'] }));

api.get('/posts/:id', c => {
	const id = c.params.id;
	return c.json({
		postId: id,
	});
});

api.post('/posts/:id', c => {
	const id = c.params.id;
	const db = []; // fake db

	db.push(id);

	return c.json({
		ok: true,
		newDb: db,
	});
});

const status = new Atomik();

status.get('/current', c => c.json({ current: 'operational' }));

const app = new Atomik();
app.route('/api', api); // every routes of api router are now based on /api ==> (api router) /posts/:id -> (app router) /api/posts/:id
app.route('/status', status); // same things here ==> (status router) /current -> (app router) /status/current

export default app; // Accessible routes are only those of the exported router. You will not be able to access other routes if they are not connected to the router exported by app.route()
```

### Set a base path

```typescript
import { Atomik } from 'atomikjs';

const app = new Atomik().basePath('/api');

app.get('/test', c => {
	return c.json({
		message: 'endpoint /test with custom basePath',
	});
});

export default app;
```

### Base path with route group routing

```typescript
import { Atomik } from 'atomikjs';

const api = new Atomik().basePath('/api');

api.get('/test', c => {
	// /api/test
	return c.json({
		message: 'endpoint /test with custom basePath',
	});
});

const status = new Atomik();

status.get('/test', c => {
	// /test
	return c.json({
		message: 'test',
	});
});

const test = new Atomik();

test.get('/test', c => {
	// /v1/test
	return c.json({
		message: 'from /test',
	});
});

const app = new Atomik();

app.route('/', status);
app.route('/', api);
app.route('/v1', test);

export default app;
```

### Context API

The context (`c`) provides useful methods for handling requests and responses:

```typescript
app.get('/api/demo/:id', c => {
	// Text response
	return c.text('Hello World');

	// JSON response
	return c.json({ message: 'Hello', status: 'success' });

	// HTML response
	return c.html('<h1>Hello HTML</h1>');

	// Set header
	return c.set('x-header', 'header-content').json({ customHeader: true });

	// Send
	return c.send('text'); // string <=> c.text("text")
	return c.send({ data: [] }); // json <=> c.json({ data: [] })

	// Set status
	return c.status(201).json({ created: true });

	// Redirect
	return c.redirect('/other-page');

	// Access query parameters
	const name = c.query.get('name');
	return c.text(`Hello ${name}`);

	// Access url params
	const id = c.params.id;
	return c.text(`Hello id: ${id}`);
});

export default app;
```

## ⚠️ Warning

Make sure to always return a response in all your endpoints

### Common errors

```typescript
// in Edge environement
app.get('/', c => c.json({ ok: true })); // ✅ implicit handler --> auto retrun
app.get('/', c => {
	return c.json({ ok: true }); // ✅ explicit handler --> manual return
});
app.get('/', c => {
	c.json({ ok: true }); // ❌ explicit handler without return --> null body in edge env
});

// in nodejs environement
app.get('/', c => c.json({ ok: true })); // ✅
app.get('/', c => {
	return c.json({ ok: true }); // ✅
});
app.get('/', c => {
	c.json({ ok: true }); // ✅
});
```

## 🏗️ Architecture

Atomik is built around three main concepts:

- **Router**: Route and HTTP method management
- **Context**: Rich interface for requests/responses
- **Server**: Optimized HTTP server

## 🔧 Advanced Configuration

### Nodejs runtime

```typescript
import { Atomik, serve, cors } from '../index';

const app = new Atomik();

app.get('/', c => c.text('Custom server'));

serve({ app: app, port: 3476 });
```

## 📊 Performance

Atomik is designed to be one of the fastest frameworks:

- Optimized routing
- Low overhead
- Efficient URL parsing
- Optimized memory management

## 🤝 Comparison with Other Frameworks

| Feature           | Atomik | Express | Fastify | Hono   |
| ----------------- | ------ | ------- | ------- | ------ |
| Native TypeScript | ✅     | ❌      | ✅      | ✅     |
| Size (gzipped)    | ~2KB   | ~15KB   | ~8KB    | ~3KB   |
| Performance       | ⚡⚡⚡ | ⚡      | ⚡⚡    | ⚡⚡⚡ |
| Modern API        | ✅     | ❌      | ✅      | ✅     |

## 🛠️ Development

```bash
# Clone the repo
git clone https://github.com/valogzi/atomik.git
cd atomik

# Install dependencies
pnpm install

# Development
pnpm dev

# Build
pnpm build
```

## 📝 Examples

Check the [`examples/`](./src/exemples/) folder for complete examples.

## 🤝 Contributing

Contributions are welcome! Check our [contribution guide](CONTRIBUTING.md).

## 📄 License

MIT © [Valogzi](https://github.com/valogzi)

## 🙏 Acknowledgments

Inspired by the excellent architecture of [Hono](https://hono.dev/) and optimized for Node.js.

---

<div align="center">
  <strong>Atomik</strong> - The web framework that doesn't slow down your development ⚛️
</div>
