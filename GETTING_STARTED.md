# Getting Started Checklist - Printel EverShop

Complete this checklist to get your Printel store up and running.

## Pre-Installation (5-10 minutes)

- [ ] **Install Node.js**
  - Minimum: Node.js 18 and npm 9
  - Download from: https://nodejs.org
  - Verify: `node -v` and `npm -v` in terminal

- [ ] **Install PostgreSQL** (Choose one)
  - [ ] **Option A: Docker** (Recommended)
    - Install Docker Desktop: https://www.docker.com/products/docker-desktop
    - Verify: `docker -v` and `docker-compose -v`
  - [ ] **Option B: Local Installation**
    - Download from: https://www.postgresql.org/download
    - Verify: `psql --version`

- [ ] **Clone/Download Project**
  - Navigate to project directory
  - Confirm you see: `package.json`, `config/`, `extensions/`, `themes/`, etc.

## Installation (15-20 minutes)

### Step 1: Install Dependencies
```bash
npm install
```
- [ ] Successfully completed without errors
- [ ] `node_modules/` directory created

### Step 2: Configure Environment
```bash
# Copy environment template
cp .env.example .env

# Optional: Review and edit if needed
cat .env
```

- [ ] `.env` file created in project root
- [ ] Database credentials configured (default values work with Docker)
- [ ] Verify: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`

### Step 3: Start PostgreSQL
Choose based on your installation:

**If using Docker:**
```bash
docker-compose up -d
```
- [ ] Docker desktop running
- [ ] PostgreSQL container started
- [ ] Verify: `docker-compose ps` shows `evershop-postgres` running

**If using Local PostgreSQL:**
- [ ] PostgreSQL server running
- [ ] Listening on port 5432
- [ ] User `postgres` exists (or configured user in `.env`)
- [ ] Empty database ready or will be created by setup

### Step 4: Run Setup Wizard
```bash
npm run setup
```

The wizard will ask for:
1. **Database Confirmation**
   - [ ] Confirm host: `localhost`
   - [ ] Confirm port: `5432`
   - [ ] Confirm database name: `evershop`
   - [ ] Confirm user: `postgres`
   - [ ] Confirm password: `postgres` (or your password)

2. **Admin User Details**
   - [ ] Enter admin email: (e.g., `admin@printel.local`)
   - [ ] Enter admin password: (min 8 chars, must have letter + digit)
   - [ ] Confirm password
   - [ ] Enter admin name: (e.g., `Store Administrator`)

- [ ] Setup completed successfully
- [ ] Database tables created
- [ ] Admin user created
- [ ] `.env` file updated with database settings

### Step 5: Build the Site
```bash
npm run build
```

- [ ] Build completed without errors
- [ ] Build artifacts created in `.evershop/` and published to `public/`
- [ ] No "Module not found" errors

## Post-Installation (5 minutes)

### Step 6: Start Development Server
```bash
npm run dev
```

- [ ] Server started successfully
- [ ] Terminal shows: "listening on port 3000" or similar
- [ ] No errors in console

### Step 7: Access Your Store
Open web browser and navigate to:

- [ ] **Store**: http://localhost:3000
  - Page loads without errors
  - See your store homepage
  - Can navigate to different pages

- [ ] **Admin Panel**: http://localhost:3000/admin
  - Redirects to login page
  - Can log in with admin email and password from setup
  - See admin dashboard

## Post-Launch (Optional but Recommended)

### Create Additional Admin Users
```bash
npm run user:create
```
- [ ] New admin user created successfully
- [ ] Can log in with new credentials

### Add Demo Data (Optional)
```bash
npm run seed
```
- [ ] Demo products and categories added
- [ ] Visible in admin panel and store

### Verify Folder Permissions
```bash
ls -la | grep -E "media|public|.log|.evershop"
```
- [ ] All directories are readable and writable (755 permissions)
- [ ] If not: `chmod -R 755 media/ public/ .log/ .evershop/`

## Initial Customization

### Theme Customization
- [ ] Reviewed theme structure in `themes/sample/`
- [ ] Understand page components in `themes/sample/src/pages/`
- [ ] Ready to modify styling in `themes/sample/tailwind.config.js`

### Store Configuration
- [ ] Reviewed `config/default.json`
- [ ] Ready to customize store name, currency, language
- [ ] Understand extension and theme configuration

### Environment Setup
- [ ] Added to `.gitignore`: `.env` file (never commit sensitive data)
- [ ] Created `.env.example` from `.env`
- [ ] Have `.env` template for deployment

## Development Workflow

- [ ] Understand available npm scripts:
  - `npm run dev` — Development with hot-reload
  - `npm run build` — Production build
  - `npm run start` — Production server
  - `npm run seed` — Add sample data
  - `npm run user:create` — Create admin user

- [ ] Know where to make changes:
  - Theme: `themes/sample/`
  - Extensions: `extensions/` (create a custom extension when needed)
  - Configuration: `config/default.json`
  - Environment: `.env`

## Docker Management

- [ ] Understand Docker commands:
  - `docker-compose up -d` — Start PostgreSQL
  - `docker-compose down` — Stop PostgreSQL
  - `docker-compose ps` — Check status
  - `docker-compose logs -f postgres` — View logs

- [ ] Know data persists:
  - PostgreSQL data saved in `postgres_data` volume
  - Changes persist across container restarts
  - Can safely stop/start container

## Troubleshooting

### Common Issues
- [ ] **"Connection refused"**
  - Verify PostgreSQL running: `docker-compose ps`
  - Check `.env` database settings
  - Restart PostgreSQL: `docker-compose restart`

- [ ] **"Port 3000 already in use"**
  - Change PORT in `.env` to another number
  - Or kill existing process: `lsof -i :3000`

- [ ] **"Module not found"**
  - Run `npm install` again
  - Delete `node_modules/` and reinstall if persists
  - Check for typos in imports

- [ ] **"Setup wizard failed"**
  - Verify PostgreSQL connection: `psql -U postgres`
  - Check `.env` database settings
  - Try running setup again

## Next Steps After Checklist

1. ✅ **Explore Admin Panel**
   - Add your first product
   - Test checkout process
   - Configure payment methods

2. 🎨 **Customize Theme**
   - Modify homepage layout
   - Change colors and styling
   - Add your branding

3. 🔌 **Build Custom Extensions**
   - Add business logic
   - Create custom endpoints
   - Extend GraphQL API

4. 📖 **Read Documentation**
   - [SETUP.md](./SETUP.md) — Detailed setup guide
   - [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) — File reference
   - [Official Docs](https://evershop.io/docs) — Complete documentation

5. 🚀 **Prepare for Production**
   - Set up production `.env` file
   - Configure PostgreSQL on cloud service (AWS RDS, etc.)
   - Set up media storage (AWS S3, Azure Blob)
   - Plan deployment strategy

## Success Indicators

✅ **Your setup is complete when:**
- [ ] Development server running without errors
- [ ] Store homepage loads at http://localhost:3000
- [ ] Admin panel accessible at http://localhost:3000/admin
- [ ] Can log in with admin credentials
- [ ] Can create a product in admin panel
- [ ] Product appears on store homepage
- [ ] No console errors in browser or terminal

🎉 **You're ready to start building your store!**

---

## Support Resources

- **Setup Issues**: See [SETUP.md](./SETUP.md)
- **Quick Reference**: See [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)
- **File Structure**: See [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)
- **Official Docs**: https://evershop.io/docs
- **Community Discord**: https://discord.com/invite/GSzt7dt7RM

**Total estimated time: 30-45 minutes**

Questions? Check the documentation files or ask in the Discord community.

Good luck! 🚀
