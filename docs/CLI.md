# 🚀 Atomik CLI & Templates

Le CLI Atomik permet de créer rapidement des projets avec différents templates pré-configurés.

## 📦 Installation

Une fois Atomik publié sur npm :

```bash
npm install -g atomik
```

Pour le développement local :

```bash
# Construire le CLI
npm run build:cli

# Tester localement
node dist/package/cli.js --help
```

## 🎯 Commandes Disponibles

### Créer un nouveau projet

```bash
atomik create <nom-projet> [options]
```

**Options :**

- `--template <type>` : Template à utiliser (basic, api, full)
- `--typescript` : Utiliser TypeScript (par défaut)
- `--javascript` : Utiliser JavaScript

**Exemples :**

```bash
# Projet basique TypeScript
atomik create mon-app

# API TypeScript
atomik create mon-api --template api

# Projet complet TypeScript
atomik create mon-site --template full

# Projet JavaScript basique
atomik create mon-app-js --javascript
```

### Développement

```bash
# Démarrer le serveur de développement
atomik dev

# Avec port personnalisé
atomik dev --port 8080
```

### Production

```bash
# Construire pour la production
atomik build

# Démarrer le serveur de production
atomik start
```

## 🗂️ Templates Disponibles

### 📄 Basic Template

Projet simple avec :

- Configuration TypeScript/JavaScript
- Routes de base (/, /json, /html)
- Structure minimale

**Structure :**

```
mon-app/
├── src/
│   └── index.ts
├── public/
├── package.json
├── tsconfig.json (si TS)
└── README.md
```

### 🔌 API Template

Projet API REST avec :

- Structure modulaire
- Middleware CORS
- Routes utilisateurs exemple
- Gestion d'erreurs

**Structure :**

```
mon-api/
├── src/
│   ├── index.ts
│   ├── routes/
│   │   └── users.ts
│   ├── middleware/
│   │   └── cors.ts
│   └── utils/
├── package.json
└── tsconfig.json
```

### 🌐 Full Template

Projet full-stack complet avec :

- API et routes statiques
- Middleware de logging
- Serveur de fichiers
- Templates HTML
- Structure avancée

**Structure :**

```
mon-site/
├── src/
│   ├── index.ts
│   ├── routes/
│   │   ├── api.ts
│   │   └── static.ts
│   ├── middleware/
│   │   ├── logger.ts
│   │   └── cors.ts
│   └── utils/
├── public/
│   └── index.html
├── package.json
└── tsconfig.json
```

## ⚙️ Fonctionnalités du CLI

### Auto-détection

Le CLI détecte automatiquement :

- Type de projet (TypeScript/JavaScript)
- Version de Node.js pour le watch mode
- Structure des dossiers

### Scripts générés

Chaque projet inclut des scripts npm :

**TypeScript :**

```json
{
	"scripts": {
		"dev": "ts-node-dev --respawn --transpile-only src/index.ts",
		"build": "tsc",
		"start": "node dist/index.js"
	}
}
```

**JavaScript :**

```json
{
	"scripts": {
		"dev": "node --watch src/index.js",
		"start": "node src/index.js"
	}
}
```

### Configuration automatique

- **tsconfig.json** pour les projets TypeScript
- **.gitignore** avec les patterns Node.js
- **package.json** avec les bonnes dépendances
- **README.md** avec la documentation

## 🔧 Développement du CLI

### Structure du code

```
package/
├── cli.ts              # Point d'entrée CLI
├── index.ts           # Exports publics
└── commands/
    ├── create.ts      # Commande create
    ├── serve.ts       # Commande dev
    └── build.ts       # Commande build
```

### Ajouter un nouveau template

1. Créer les templates dans `getTemplateFiles()`
2. Ajouter le type dans l'interface `TEMPLATES`
3. Implémenter la logique dans `getMainTemplate()`

### Tests

```bash
# Tester la création
node dist/package/cli.js create test-app

# Tester le développement
cd test-app && node ../dist/package/cli.js dev

# Tester le build
node ../dist/package/cli.js build
```

## 🎉 Exemple d'utilisation complète

```bash
# 1. Créer un projet API
atomik create mon-api --template api

# 2. Aller dans le dossier
cd mon-api

# 3. Démarrer le développement
atomik dev

# 4. Dans un autre terminal - tester l'API
curl http://localhost:3000/
curl http://localhost:3000/api/users
curl -X POST http://localhost:3000/api/users

# 5. Construire pour la production
atomik build

# 6. Démarrer en production
atomik start
```

Le CLI Atomik offre une expérience de développement moderne et productive ! 🚀
