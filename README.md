# ⚛️ Atomik

An ultra-fast and lightweight web framework for Node.js, inspired by simplicity and performance.

[![npm version](https://badge.fury.io/js/atomik.svg)](https://badge.fury.io/js/atomik) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

```typescript
import { Atomik } from 'atomik';

const app = new Atomik();

app.get('/', c => {
	return c.text('Hello, Atomik! 🚀');
});

// Server starts automatically on port 3000
```

## 🌟 Features

- ⚡ **Ultra-fast** - Built with performance in mind
- 🪶 **Lightweight** - Minimal with no heavy dependencies
- 🔧 **Simple** - Intuitive and easy-to-use API
- 🛣️ **Routing** - Built-in routing system
- 🔌 **Middleware** - Full middleware support
- 📦 **TypeScript** - Native TypeScript support
- 🎯 **Context API** - Rich context for requests/responses

## 🚀 Installation

```bash
# npm
npm install atomik

# pnpm
pnpm add atomik

# yarn
yarn add atomik
```

## 📖 Quick Start Guide

### Basic Application

```typescript
import { Atomik } from 'atomik';

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
```

### Supported HTTP Methods

```typescript
app.get('/users', c => c.json({ users: [] }));
app.post('/users', c => c.json({ created: true }));
app.put('/users/:id', c => c.json({ updated: true }));
app.patch('/users/:id', c => c.json({ patched: true }));
app.delete('/users/:id', c => c.json({ deleted: true }));
```

### Middleware

```typescript
import { Atomik } from 'atomik';

const app = new Atomik();

// Logging middleware
app.use((c, next) => {
	console.log(`${c.method} ${c.url}`);
	next();
});

// CORS middleware
app.use(cors());

app.get('/', c => c.text('Hello with middleware!'));
```

### Context API

The context (`c`) provides useful methods for handling requests and responses:

```typescript
app.get('/api/demo', c => {
	// Text response
	return c.text('Hello World');

	// JSON response
	return c.json({ message: 'Hello', status: 'success' });

	// HTML response
	return c.html('<h1>Hello HTML</h1>');

	// Set status
	return c.status(201).json({ created: true });

	// Redirect
	return c.redirect('/other-page');

	// Access query parameters
	const name = c.query.get('name');
	return c.text(`Hello ${name}`);
});
```

## 🏗️ Architecture

Atomik is built around three main concepts:

- **Router**: Route and HTTP method management
- **Context**: Rich interface for requests/responses
- **Server**: Optimized HTTP server

## 🔧 Advanced Configuration

### Custom Server

```typescript
import { Atomik } from 'atomik';

const app = new Atomik({
	port: 3000,
	callback: () => {
		console.log('📦 Custom start message');
	},
});

app.get('/', c => c.text('Custom server'));
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
