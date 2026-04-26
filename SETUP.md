# Printel - EverShop Store Setup Guide

This is your Printel e-commerce store powered by **EverShop 2.1.2**. This guide will help you get it running locally.

## Prerequisites

Before you begin, make sure you have:

- **Node.js** 18+ and npm 9+
- **PostgreSQL** 12+ (locally or via Docker)
- **Docker & Docker Compose** (optional, for running PostgreSQL in a container)

## Quick Start (5 minutes)

### Step 1: Verify PostgreSQL is Running

**Option A: Using Docker** (recommended for local development)

```bash
docker-compose up -d
```

Verify it's running:
```bash
docker-compose ps
```

**Option B: Using Local PostgreSQL**

If you have PostgreSQL installed locally, make sure it's running on port 5432.

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Run the Setup Script

This will create the database schema and initialize your store:

```bash
npm run setup
```

The setup wizard will ask you for:
1. **Database Connection** — Confirm or update connection details
2. **Admin User Details** — Email, password (min 8 characters with letter + digit), and name

### Step 4: Build the Site

```bash
npm run build
```

### Step 5: Start Your Store

**For Development** (with hot-reloading):
```bash
npm run dev
```

**For Production**:
```bash
npm run start
```

Your store is now running at: **http://localhost:3000**
Admin panel: **http://localhost:3000/admin**

---

## Configuration

### Database Settings

Edit `.env` to change database connection details:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=evershop
DB_USER=postgres
DB_PASSWORD=postgres
DB_SSLMODE=disable
```

### Store Settings

Edit `config/default.json` to customize:
- Store name
- Default currency & language
- Timezone
- Extensions & theme

Example:
```json
{
  "shop": {
    "name": "Printel",
    "language": "en",
    "currency": "USD",
    "timezone": "UTC"
  }
}
```

---

## Common Commands

### Development
```bash
npm run dev              # Start with hot-reloading (development mode)
npm run start:debug      # Start with debug logging
npm run build            # Build for production
```

### Admin Management
```bash
npm run user:create          # Create a new admin user
npm run user:changePassword  # Change admin password
```

### Demo Data
```bash
npm run seed             # Populate with sample products & categories
```

### Production
```bash
npm run build            # Build the site
npm run start            # Start in production mode
```

---

## Project Structure

```
printel/
├── config/              # Store configuration
│   └── default.json    # Main configuration file
├── extensions/          # Custom extensions/plugins
│   └── (empty)         # Add custom extensions here when needed
├── themes/              # Store themes
│   └── sample/         # Sample theme
├── media/               # User-uploaded files (images, etc.)
├── public/              # Static assets
├── translations/        # i18n translation files
├── .log/                # Application logs
├── .env                 # Environment variables (DO NOT COMMIT)
├── .env.example         # Template for .env
├── package.json         # Node.js dependencies
└── docker-compose.yml   # PostgreSQL Docker configuration
```

---

## Customization After Setup

Once your store is running, you can:

### 1. Create Custom Theme
```bash
mkdir themes/my-theme
# Add your theme files following EverShop theme structure
```

### 2. Build Custom Extension
```bash
mkdir extensions/my-extension
# Add your extension files
```

### 3. Add Database Migrations
Create migration files in the appropriate extension or theme folder.

### 4. Update Store Settings
Edit `config/default.json` for:
- Store name, currency, language
- Enable/disable extensions
- Change theme
- Configure security settings

### 5. Use Environment Variables
Update `.env` for:
- Database connection (if using external DB)
- Application port
- Third-party service credentials (AWS S3, etc.)

### 6. Configure ANAF e-Factura / SPV

1. Leave `anaf.enabled=false` in config until the store has been validated in sandbox.
2. Add the optional ANAF environment variables to `.env`:

```env
ANAF_CLIENT_ID=your_anaf_client_id
ANAF_CLIENT_SECRET=your_anaf_client_secret
ANAF_REDIRECT_URI=http://127.0.0.1:3000/api/anaf/connect/callback
ANAF_TOKEN_ENCRYPTION_KEY=replace-with-32-byte-secret
```

`ANAF_TOKEN_ENCRYPTION_KEY` is required; the integration now fails fast if it is missing. Only set `ANAF_SIMULATION_MODE` for local development or test doubles, never for the real ANAF sandbox/live flow.

3. Open **Admin → Settings → Store** and review the **ANAF e-Factura / SPV** section.
4. Start in **Sandbox / test**, connect the profile, and run a connection check before enabling automatic submissions. The administrator performing this step must have the registered SPV OAuth app details and the required ANAF certificate/token flow available on their machine.
5. Reconnect after certificate renewal, token replacement, or redirect URI changes, then rerun **Check connection** to confirm the stored refresh token can be renewed correctly.
6. Manual mode keeps orders in a pending-approval state until an administrator approves the ANAF submission from the order detail screen.
7. Automatic retries run on the `anaf.retryCron` schedule. You can force a retry pass manually with:

```bash
node scripts/run-anaf-retry-worker.mjs
```

8. Optional sandbox Playwright coverage is disabled by default. Enable it explicitly only when sandbox credentials and infrastructure are available:

```bash
RUN_ANAF_E2E=true npm run test:e2e
```

---

## Docker Setup for PostgreSQL

The project includes a `docker-compose.yml` for easy PostgreSQL setup:

```bash
# Start PostgreSQL container
docker-compose up -d

# Stop PostgreSQL container
docker-compose down

# View logs
docker-compose logs -f postgres

# Access database directly
docker-compose exec postgres psql -U postgres -d evershop
```

**Data Persistence**: PostgreSQL data is stored in the `postgres_data` Docker volume and persists across container restarts.

---

## Troubleshooting

### "Connection refused" error
1. Verify PostgreSQL is running: `docker-compose ps`
2. Check `.env` database settings match your PostgreSQL
3. Wait a few seconds for PostgreSQL to fully start

### "Port 3000 already in use"
Change the port in `.env`:
```env
PORT=3001
```

### "Database not found"
Run the setup script again:
```bash
npm run setup
```

### Permission denied on media/public directories
Ensure write permissions:
```bash
chmod -R 755 media/ public/ .log/ .evershop/
```

---

## Next Steps

1. ✅ **Setup complete** — Store is running
2. 📝 **Create an admin user** — `npm run user:create`
3. 🎨 **Customize theme** — Edit `themes/sample/` or create new theme
4. 🔌 **Build extensions** — Add features via `extensions/`
5. 📦 **Add products** — Use admin panel or CSV import
6. 🚀 **Deploy** — See [EverShop deployment guide](https://evershop.io/docs)

---

## Support & Resources

- **Official Docs**: https://evershop.io/docs
- **Discord Community**: https://discord.com/invite/GSzt7dt7RM
- **GitHub**: https://github.com/evershopcommerce/evershop
- **Issues**: Found a bug? Report on [GitHub Issues](https://github.com/evershopcommerce/evershop/issues)

---

## Important Notes

⚠️ **Security**:
- Never commit `.env` file to version control
- Change default database password in production
- Enable HTTPS in production (`enableHttps: true` in config)

📌 **Database**:
- PostgreSQL migrations run automatically on app start
- Use the provided Docker setup for local development
- For production, use managed PostgreSQL service (AWS RDS, etc.)

📁 **Media Files**:
- For production Docker deployments, use cloud storage (AWS S3, Azure Blob)
- Local volumes work for development only

---

**Ready to get started? Run `npm run setup` now!** 🚀
