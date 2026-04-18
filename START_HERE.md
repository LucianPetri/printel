# ✅ Printel - EverShop Setup Complete!

Your complete e-commerce store **Printel** using **EverShop 2.1.2** is now configured and ready to launch!

## 📋 Setup Summary

All files and configurations have been created with sensible defaults. You can customize any of them later as needed.

### ✅ What's Been Set Up

#### 1. **Configuration Files**
- ✅ `package.json` — Updated with all scripts and dev dependencies
- ✅ `config/default.json` — Store settings with defaults
  - Store name: **Printel**
  - Currency: **USD**
  - Language: **en**
  - Timezone: **UTC**
- ✅ `.env` — Database and environment variables (local development)
- ✅ `.env.example` — Template for the team
- ✅ `.env.production` — Production environment template

#### 2. **Documentation** (📚 Start Here!)
- ✅ **[GETTING_STARTED.md](GETTING_STARTED.md)** ⭐ **START HERE** — Step-by-step checklist
- ✅ **[SETUP.md](SETUP.md)** — Detailed setup guide
- ✅ **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** — Commands & troubleshooting
- ✅ **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)** — File reference guide
- ✅ **[README.md](README.md)** — Project overview

#### 3. **Database Setup**
- ✅ `docker-compose.yml` — PostgreSQL 16 container configuration
- ✅ `docker/init.sql` — Database initialization script
- ✅ `docker/README.md` — Docker setup guide

#### 4. **Directory Structure**
- ✅ `extensions/` — Custom plugins & functionality
- ✅ `themes/` — Store themes & layouts
- ✅ `config/` — Configuration files
- ✅ `media/` — User-uploaded files
- ✅ `public/` — Static assets
- ✅ `translations/` — i18n translation files
- ✅ `.log/` — Application logs
- ✅ `.evershop/` — Internal data & cache

#### 5. **Utilities**
- ✅ `install.sh` — Automated setup script
- ✅ `.gitignore` — Version control configuration

---

## 🚀 Quick Start (3 Commands)

### Option A: Manual Setup (Recommended First Time)

```bash
# 1. Install dependencies
npm install

# 2. Start PostgreSQL with Docker
docker-compose up -d

# 3. Run setup wizard (interactive)
npm run setup
```

Then follow the prompts to complete setup.

### Option B: Automated Setup (If using Docker)

```bash
chmod +x install.sh
./install.sh
```

This runs all setup steps automatically.

---

## 📖 Documentation Reading Order

**Start here based on your situation:**

1. **First Time?** → **[GETTING_STARTED.md](GETTING_STARTED.md)** ⭐
   - Complete checklist for initial setup
   - Verification steps to confirm everything works
   - Estimated time: 30-45 minutes

2. **Need Details?** → **[SETUP.md](SETUP.md)**
   - In-depth setup instructions
   - Configuration options explained
   - Troubleshooting common issues

3. **Want Quick Commands?** → **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)**
   - Command reference
   - File locations
   - Common tasks

4. **Understanding Structure?** → **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)**
   - Complete file reference
   - Directory details
   - Configuration points

5. **Project Overview?** → **[README.md](README.md)**
   - Features list
   - Technology stack
   - Deployment information

---

## ⚙️ Default Configuration

All defaults are production-ready for local development and can be easily customized:

| Setting | Default | Location |
|---------|---------|----------|
| **Store Name** | Printel | `config/default.json` |
| **Currency** | USD | `config/default.json` |
| **Language** | English (en) | `config/default.json` |
| **Database Host** | localhost | `.env` |
| **Database Port** | 5432 | `.env` |
| **Database Name** | evershop | `.env` |
| **Database User** | postgres | `.env` |
| **App Port** | 3000 | `.env` |
| **Theme** | sample | `config/default.json` |
| **Environment** | development | `.env` |

---

## 🎯 What You Can Do Now

### Immediately
- ✅ Start the development server: `npm run dev`
- ✅ Access store: http://localhost:3000
- ✅ Access admin: http://localhost:3000/admin

### After Setup
- ✅ Create new admin users
- ✅ Add products via admin panel
- ✅ Customize theme colors and styling
- ✅ Build custom extensions
- ✅ Add demo products and categories
- ✅ Deploy to production

---

## 📝 Next Steps

### 1. Complete Initial Setup (30 mins)
Follow **[GETTING_STARTED.md](GETTING_STARTED.md)** checklist:
```bash
npm install
docker-compose up -d
npm run setup
npm run build
npm run dev
```

### 2. Access Your Store (2 mins)
- Store: **http://localhost:3000**
- Admin: **http://localhost:3000/admin**
- Login with admin email/password from setup

### 3. Customize Store (As needed)
- Edit `config/default.json` for store settings
- Modify `themes/sample/` for styling
- Add products via admin panel
- Create extensions in `extensions/`

### 4. Prepare Deployment (When ready)
- Update `.env.production` with production credentials
- Configure cloud PostgreSQL (AWS RDS, etc.)
- Set up cloud storage for media (AWS S3, etc.)
- See deployment section in [SETUP.md](SETUP.md)

---

## 📦 Available Scripts

```bash
# Development
npm run dev              # Start with hot-reloading
npm run start:debug      # Start with debug logging
npm run build            # Build for production
npm run start            # Start production server

# Data Management
npm run setup            # Run setup wizard
npm run seed             # Add demo products
npm run user:create      # Create admin user
npm run user:changePassword  # Change password
```

---

## 🐳 Docker Commands

```bash
# Start PostgreSQL
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f postgres

# Stop PostgreSQL
docker-compose down

# Full reset (deletes data!)
docker-compose down -v
docker-compose up -d
```

---

## 🔐 Important Security Notes

⚠️ **Before Going Live:**

- [ ] Change default database password in `.env`
- [ ] Never commit `.env` file to version control
- [ ] Create strong admin passwords (8+ chars, letter + digit)
- [ ] Enable HTTPS in production
- [ ] Use cloud storage for media files (AWS S3, etc.)
- [ ] Use managed PostgreSQL service in production
- [ ] Regularly update dependencies: `npm update`

---

## 🆘 Troubleshooting Quick Links

| Issue | Solution |
|-------|----------|
| Connection refused | Check `docker-compose ps` for PostgreSQL status |
| Port 3000 in use | Change `PORT` in `.env` to another number |
| Module not found | Run `npm install` again |
| Permission denied | Run `chmod -R 755 media/ public/ .log/` |
| Database error | Verify `.env` settings match PostgreSQL |

**For detailed troubleshooting**, see **[SETUP.md](SETUP.md#troubleshooting)** or **[QUICK_REFERENCE.md](QUICK_REFERENCE.md#troubleshooting)**.

---

## 📚 File Quick Reference

### Documentation Files
| File | Purpose |
|------|---------|
| [GETTING_STARTED.md](GETTING_STARTED.md) | Initial setup checklist ⭐ START HERE |
| [SETUP.md](SETUP.md) | Detailed setup instructions |
| [QUICK_REFERENCE.md](QUICK_REFERENCE.md) | Commands & quick reference |
| [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) | File structure & locations |
| [README.md](README.md) | Project overview |

### Configuration Files
| File | Purpose |
|------|---------|
| `package.json` | Node.js dependencies & scripts |
| `config/default.json` | Store configuration |
| `.env` | Environment variables (local) |
| `.env.example` | Environment template |
| `.env.production` | Production environment template |
| `docker-compose.yml` | PostgreSQL Docker setup |

### Directories
| Directory | Purpose |
|-----------|---------|
| `extensions/` | Custom plugins |
| `themes/` | Store themes |
| `config/` | Store configuration |
| `media/` | Uploaded files |
| `public/` | Static assets |
| `translations/` | i18n files |

---

## 💡 Pro Tips

1. **Read GETTING_STARTED.md First** — It's the fastest way to get running
2. **Use Docker** — Simplest PostgreSQL setup for local development
3. **Commit .env.example** — Help team members set up their own .env
4. **Never commit .env** — It contains sensitive database passwords
5. **Use npm run dev** — Hot-reloading makes development faster
6. **Check QUICK_REFERENCE.md** — When you need a command quickly
7. **Review PROJECT_STRUCTURE.md** — Understand where to put new code
8. **Join Discord Community** — Get help from other developers

---

## 🎉 You're All Set!

Your Printel EverShop installation is configured and ready to go!

### Start Here:
👉 **[Read GETTING_STARTED.md](GETTING_STARTED.md)** for the complete setup checklist

### Questions?
- 📖 Check the documentation files above
- 💬 Join [Discord Community](https://discord.com/invite/GSzt7dt7RM)
- 🐛 Search [GitHub Issues](https://github.com/evershopcommerce/evershop/issues)
- 📚 Read [Official Docs](https://evershop.io/docs)

---

**Last Updated**: April 2026
**EverShop Version**: 2.1.2
**Status**: ✅ Ready for Development

Good luck building your store! 🚀
