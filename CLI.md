# Atomik CLI Usage Examples

## Creating a new project

```bash
# Basic project (TypeScript by default)
atomik create my-app

# API project
atomik create my-api --template api

# Full-stack project
atomik create my-fullstack --template full

# JavaScript project
atomik create my-js-app --javascript
```

## Development commands

```bash
# Start development server
atomik dev

# Start with custom port
atomik dev --port 8080

# Build for production
atomik build

# Start production server
atomik start
```

## Project Templates

### Basic Template

- Simple Atomik server
- Basic routing examples
- TypeScript/JavaScript support

### API Template

- REST API structure
- CORS middleware
- User routes example
- Error handling

### Full Template

- Complete full-stack setup
- Multiple route modules
- Logger middleware
- Static file serving
- HTML templates

## CLI Commands

| Command | Description | Options |
| --- | --- | --- |
| `create <name>` | Create new project | `--template`, `--typescript`, `--javascript` |
| `dev` | Start development | `--port`, `--watch` |
| `build` | Build for production | `--output` |
| `start` | Start production server | `--port` |
