# Atomik Framework - Changements récents

## ✅ Tâches accomplies

### 1. **Suppression des fichiers cors.ts des templates**

- ❌ Supprimé `templates/full/src/middleware/cors.ts`
- ❌ Supprimé `templates/api/src/middleware/cors.ts`
- ✅ Modifié le CLI pour ne plus générer ces fichiers

### 2. **Utilisation directe du CORS d'Atomik**

Les templates utilisent maintenant directement `cors()` importé d'Atomik :

```typescript
import { Atomik, cors } from 'atomikjs';

const app = new Atomik({ port: 3000 });
app.use(cors()); // ← Directement depuis atomikjs
```

### 3. **Fichiers de définition TypeScript créés**

#### `index.d.ts` (principal)

```typescript
declare class Atomik implements Router {
	constructor(options?: AtomikOptions);
	get(path: string, handler: RouteHandler): void;
	post(path: string, handler: RouteHandler): void;
	// ... autres méthodes HTTP
	use(middleware: MiddlewareFunction): void;
	use(path: string, router: Router): void;
	listen(port?: number, callback?: () => void): void;
}

declare function cors(options?: CorsOptions): MiddlewareFunction;
declare function createRouter(): Router;
```

#### `src/types/index.ts`

Définit toutes les interfaces :

- `Context` : Contexte de requête/réponse
- `MiddlewareFunction` : Type pour middleware
- `RouteHandler` : Type pour gestionnaires de routes
- `AtomikOptions` : Options du constructeur
- `CorsOptions` : Options du middleware CORS
- `Router` : Interface du routeur

### 4. **Mise à jour du package.json**

```json
{
	"main": "dist/src/index.js",
	"types": "index.d.ts",
	"files": ["dist", "templates", "index.d.ts", "types.d.ts"]
}
```

### 5. **Gestion dynamique des gestionnaires de packages**

Le CLI détecte automatiquement et utilise le bon gestionnaire :

- **pnpm** (prioritaire si détecté)
- **yarn**
- **bun**
- **npm** (fallback)

## 🎯 Résultat final

### Templates nettoyées

- ✅ **basic** : Serveur simple sans fichier cors.ts superflu
- ✅ **api** : API avec CORS direct depuis atomikjs
- ✅ **full** : App complète avec CORS direct depuis atomikjs

### Développement amélioré

- ✅ **IntelliSense** : Support complet TypeScript avec définitions
- ✅ **CLI intelligent** : Détection automatique du gestionnaire de packages
- ✅ **Simplicité** : Moins de fichiers, utilisation directe du framework

### Architecture cohérente

```
src/
├── core/           # Cœur du framework
│   ├── router.ts   # Système de routage avec paramètres
│   ├── context.ts  # Contexte de requête
│   └── server.ts   # Serveur HTTP
├── plugins/        # Middlewares intégrés
│   └── cors.ts     # CORS middleware
└── types/          # Définitions TypeScript
    └── index.ts    # Interfaces principales
```

## 🚀 Prêt pour la publication

Le framework Atomik est maintenant prêt avec :

- Fichiers de définition TypeScript complets
- Templates épurées sans code redondant
- CLI intelligent avec détection automatique des outils
- Architecture cohérente et maintenable
