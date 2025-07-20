# ⚛️ Atomik

Un mini-framework web ultra-rapide et léger pour Node.js, inspiré par la simplicité et la performance.

[![npm version](https://badge.fury.io/js/atomik.svg)](https://badge.fury.io/js/atomik) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

```typescript
import { Atomik } from 'atomik';

const app = new Atomik();

app.get('/', c => {
	return c.text('Hello, Atomik! 🚀');
});

// Le serveur démarre automatiquement sur le port 5500
```

## 🌟 Fonctionnalités

- ⚡ **Ultra-rapide** - Construit avec des performances en tête
- 🪶 **Léger** - Minimal et sans dépendances lourdes
- 🔧 **Simple** - API intuitive et facile à utiliser
- 🛣️ **Routing** - Système de routage intégré
- 🔌 **Middleware** - Support complet des middlewares
- 📦 **TypeScript** - Support TypeScript natif
- 🎯 **Context API** - Contexte riche pour les requêtes/réponses

## 🚀 Installation

```bash
# npm
npm install atomik

# pnpm
pnpm add atomik

# yarn
yarn add atomik
```

## 📖 Guide de démarrage rapide

### Application basique

```typescript
import { Atomik } from 'atomik';

const app = new Atomik();

app.get('/', c => {
	return c.text('Bienvenue sur Atomik!');
});

app.post('/api/users', c => {
	return c.json({ message: 'Utilisateur créé' });
});

app.get('/html', c => {
	return c.html('<h1>Hello HTML!</h1>');
});
```

### Méthodes HTTP supportées

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

// Middleware de logging
app.use((req, res, next) => {
	console.log(`${req.method} ${req.url}`);
	next();
});

// Middleware CORS
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
	next();
});

app.get('/', c => c.text('Hello avec middleware!'));
```

### Context API

Le contexte (`c`) fournit des méthodes utiles pour traiter les requêtes et réponses :

```typescript
app.get('/api/demo', c => {
	// Réponse texte
	return c.text('Hello World');

	// Réponse JSON
	return c.json({ message: 'Hello', status: 'success' });

	// Réponse HTML
	return c.html('<h1>Hello HTML</h1>');

	// Définir le status
	return c.status(201).json({ created: true });

	// Redirection
	return c.redirect('/autre-page');

	// Accès aux paramètres de requête
	const name = c.query.get('name');
	return c.text(`Hello ${name}`);
});
```

## 🏗️ Architecture

Atomik est construit autour de trois concepts principaux :

- **Router** : Gestion des routes et des méthodes HTTP
- **Context** : Interface riche pour les requêtes/réponses
- **Server** : Serveur HTTP optimisé

## 🔧 Configuration avancée

### Serveur personnalisé

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

Atomik est conçu pour être l'un des frameworks les plus rapides :

- Routage optimisé
- Faible overhead
- Parsing efficace des URLs
- Gestion mémoire optimisée

## 🤝 Comparaison avec d'autres frameworks

| Fonctionnalité   | Atomik | Express | Fastify | Hono   |
| ---------------- | ------ | ------- | ------- | ------ |
| TypeScript natif | ✅     | ❌      | ✅      | ✅     |
| Taille (gzipped) | ~2KB   | ~15KB   | ~8KB    | ~3KB   |
| Performance      | ⚡⚡⚡ | ⚡      | ⚡⚡    | ⚡⚡⚡ |
| API moderne      | ✅     | ❌      | ✅      | ✅     |

## 🛠️ Développement

```bash
# Cloner le repo
git clone https://github.com/votre-username/atomik.git
cd atomik

# Installer les dépendances
pnpm install

# Développement
pnpm dev

# Build
pnpm build
```

## 📝 Exemples

Consultez le dossier [`exemples/`](./src/exemples/) pour des exemples complets.

## 📄 Licence

MIT © [Valogzi](https://github.com/valogzi)

## 🙏 Remerciements

Inspiré par l'excellente architecture de [Hono](https://hono.dev/) et optimisé pour Node.js.

---

<div align="center">
  <strong>Atomik</strong> - Le framework web qui ne ralentit pas votre développement ⚛️
</div>
