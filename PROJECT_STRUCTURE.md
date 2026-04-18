# Project Structure & File Reference

Complete guide to all files and directories in the Printel EverShop project.

## Root Level Files

### Configuration & Setup
- **`package.json`** — Node.js project manifest with dependencies and scripts
- **`tsconfig.json`** — TypeScript configuration (if using TypeScript)
- **`.env`** — Environment variables for local development (DO NOT COMMIT)
- **`.env.example`** — Template for `.env` file (commit this)
- **`.env.production`** — Template for production environment variables
- **`.gitignore`** — Specifies files to ignore in version control

### Documentation
- **`README.md`** — Project overview and quick start guide
- **`SETUP.md`** — Detailed setup and configuration instructions
- **`QUICK_REFERENCE.md`** — Quick command reference and troubleshooting
- **`install.sh`** — Automated installation script (optional)

### Docker
- **`docker-compose.yml`** — PostgreSQL container configuration
- **`Dockerfile`** — (Optional) For containerizing the entire application

## Directories

### `/config`
Store configuration and settings.

```
config/
└── default.json        # Main store configuration
                       # - Store name, currency, language
                       # - Database connection settings
                       # - Theme and extension settings
                       # - Security settings
```

**File: `config/default.json`**
```json
{
  "shop": {
    "name": "Printel",
    "language": "en",
    "currency": "USD",
    "timezone": "UTC",
    "url": "http://localhost:3000"
  },
  "system": {
    "extensions": [...],
    "theme": "sample"
  },
  "database": {
    "host": "${DB_HOST}",
    "port": "${DB_PORT}",
    "database": "${DB_NAME}",
    "user": "${DB_USER}",
    "password": "${DB_PASSWORD}"
  }
}
```

Customization points:
- Change store name, language, currency
- Enable/disable extensions
- Switch active theme

---

### `/extensions`
Custom functionality and plugins.

```
extensions/
└── (empty)              # Add custom extensions here when needed
```

**Create a custom extension:**
```bash
mkdir extensions/my-extension
# Add src/, package.json, tsconfig.json
```

**Extension structure:**
- `src/api/` — REST API routes
- `src/graphql/` — GraphQL types, queries, mutations
- `src/pages/` — React components for specific pages
- `src/subscribers/` — Event subscribers for hooks
- `src/crons/` — Scheduled tasks
- `src/bootstrap.ts` — Extension initialization

Enable in `config/default.json`:
```json
{
  "system": {
    "extensions": [
      {
        "name": "my-extension",
        "resolve": "extensions/my-extension",
        "enabled": true
      }
    ]
  }
}
```

---

### `/themes`
Store frontend themes and layouts.

```
themes/
└── sample/              # Sample theme (comes with EverShop)
    ├── src/
    │   ├── pages/       # React page components
    │   │   ├── all/     # Global pages (all routes)
    │   │   ├── homepage/# Homepage specific
    │   │   └── [route]/ # Route-specific pages
    │   ├── graphql/     # GraphQL queries/fragments
    │   ├── assets/      # Images, fonts, etc.
    │   └── components/  # Reusable React components
    ├── tailwind.config.js # Tailwind CSS configuration
    ├── package.json
    ├── tsconfig.json
    └── Readme.md
```

**Create a custom theme:**
```bash
mkdir -p themes/my-theme/src/pages/{all,homepage}
# Add components, tailwind config, package.json, tsconfig.json
```

**Page hierarchy:**
- `/pages/all/` — Components shown on all pages
- `/pages/homepage/` — Homepage only components
- `/pages/[route]/` — Route-specific components

Select active theme in `config/default.json`:
```json
{
  "system": {
    "theme": "my-theme"
  }
}
```

---

### `/media`
User-uploaded files and media assets.

```
media/
├── images/              # Uploaded product images
├── documents/           # PDFs, documents
└── [other uploads]/     # Other user files
```

**Characteristics:**
- Requires write permissions (755)
- Persists across restarts (Docker volume)
- Use cloud storage (AWS S3) in production
- Not committed to version control

---

### `/public`
Static assets served directly.

```
public/
├── favicon.ico          # Site favicon
├── robots.txt           # SEO robots file
├── sitemap.xml          # XML sitemap
├── styles/              # Global CSS/styles
└── [other assets]/      # Images, fonts, etc.
```

**Characteristics:**
- Served as-is without processing
- Good for static resources
- Accessible at `/` root path of the site

Example URLs:
- `/favicon.ico` → `public/favicon.ico`
- `/robots.txt` → `public/robots.txt`

---

### `/translations`
Internationalization (i18n) files.

```
translations/
├── en/                  # English
│   └── messages.json    # English translations
├── es/                  # Spanish
│   └── messages.json
├── fr/                  # French
│   └── messages.json
└── [locale]/
    └── messages.json
```

**Translation file format:**
```json
{
  "greeting": "Hello, welcome!",
  "product.addToCart": "Add to Cart",
  "cart.total": "Total: {amount}"
}
```

**Add new language:**
1. Create `translations/[locale]/messages.json`
2. Add translations
3. Update `config/default.json` to support the language

---

### `/.log`
Application logs and debugging information.

```
.log/
├── evershop.log         # Main application log
├── error.log            # Error logs
└── access.log           # Access logs
```

**Characteristics:**
- Requires write permissions (755)
- For development debugging
- Consider external logging for production

---

### `/.evershop`
Internal EverShop data and cache.

```
.evershop/
├── build/               # Build artifacts
├── dist/                # Compiled code
└── [internal data]/
```

**Characteristics:**
- Created automatically by EverShop
- Contains build and cache data
- Don't commit to version control

---

### `/node_modules`
Installed npm dependencies.

**Characteristics:**
- Created by `npm install`
- Don't commit to version control
- Add to `.gitignore`

---

### `/docker`
Docker configurations and scripts.

```
docker/
├── README.md            # Docker setup guide
├── init.sql             # PostgreSQL initialization script
└── Dockerfile           # (Optional) Application container
```

---

## Environment Variables

### `.env` (Local Development)
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=evershop
DB_USER=postgres
DB_PASSWORD=postgres
DB_SSLMODE=disable

# Application
NODE_ENV=development
PORT=3000
```

### `.env.example` (Template - Commit this)
Template for team members to copy and adjust.

### `.env.production` (Production Template)
Production-specific settings with examples.

**Important:**
- `.env` files are ignored by Git (in `.gitignore`)
- Always provide `.env.example` for reference
- Never commit `.env` with secrets to version control

---

## Key Configuration Points

### 1. Store Name & Branding
**File:** `config/default.json`
```json
{
  "shop": {
    "name": "Printel",
    "currency": "USD",
    "language": "en",
    "timezone": "UTC"
  }
}
```

### 2. Database Connection
**File:** `.env`
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=evershop
DB_USER=postgres
DB_PASSWORD=postgres
```

### 3. Active Theme
**File:** `config/default.json`
```json
{
  "system": {
    "theme": "sample"
  }
}
```

### 4. Extensions
**File:** `config/default.json`
```json
{
  "system": {
    "theme": "sample"
  }
}
```

### 5. Node Environment
**File:** `.env`
```env
NODE_ENV=development  # or "production"
PORT=3000
```

---

## File Permissions

EverShop needs write access to:

```bash
chmod -R 755 media/
chmod -R 755 public/
chmod -R 755 .log/
chmod -R 755 .evershop/
```

Or in one command:
```bash
chmod -R 755 media/ public/ .log/ .evershop/
```

---

## Git Management

### `.gitignore` should contain:
```
.env
.env.local
node_modules/
.log/
.evershop/
media/
postgres_data/
*.log
.DS_Store
.idea/
.vscode/
```

### DO commit:
- `.env.example` — Template for team
- `.env.production` — Production template with examples
- All source files in `extensions/`, `themes/`, `config/`
- `package.json`, `package-lock.json`
- `README.md`, `SETUP.md`, documentation

### DO NOT commit:
- `.env` — Contains database passwords
- `node_modules/` — Reinstalled from package.json
- `.log/` — Runtime logs
- `media/` — User uploads
- Build artifacts

---

## Development Workflow

1. **Initialize**
   - Clone repository
   - Copy `.env.example` → `.env`
   - Update `.env` with local database settings
   - Run `npm install`

2. **Configure**
   - Edit `config/default.json` for store settings
   - Configure theme in `system.theme`
   - Enable extensions in `system.extensions`

3. **Develop**
   - Create themes in `themes/`
   - Create extensions in `extensions/`
   - Run `npm run dev`

4. **Test**
   - Manual testing via browser
   - Check logs in `.log/`
   - Use admin panel to test features

5. **Deploy**
   - Commit changes
   - Run `npm run build`
   - Push to deployment environment
   - Set production `.env` variables
   - Run migrations if needed

---

## Useful Links

- [EverShop Docs](https://evershop.io/docs)
- [Theme Development Guide](https://evershop.io/docs/development/themes)
- [Extension Development Guide](https://evershop.io/docs/development/extensions)
- [GraphQL API Reference](https://evershop.io/docs/development/knowledge-base/graphql)

---

**For more details, see [SETUP.md](./SETUP.md) and [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)**
