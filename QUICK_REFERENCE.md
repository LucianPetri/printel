# Quick Reference Guide - Printel EverShop

## Installation Checklist

- [ ] Node.js 18+ and npm 9+ installed
- [ ] PostgreSQL ready (local or Docker)
- [ ] `.env` file configured with database credentials
- [ ] Dependencies installed: `npm install`
- [ ] Setup completed: `npm run setup`
- [ ] Site built: `npm run build`
- [ ] Admin user created during setup

## Development Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start with hot-reloading (development) |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run start:debug` | Start with debug logging |
| `npm run setup` | Run installation wizard |
| `npm run seed` | Add sample products & categories |
| `npm run user:create` | Create new admin user |
| `npm run user:changePassword` | Change admin password |

## Database Commands

| Command | Purpose |
|---------|---------|
| `docker-compose up -d` | Start PostgreSQL (Docker) |
| `docker-compose down` | Stop PostgreSQL |
| `docker-compose ps` | Check PostgreSQL status |
| `docker-compose logs -f postgres` | View PostgreSQL logs |

## File Locations

| File/Folder | Purpose |
|-------------|---------|
| `config/default.json` | Store settings & configuration |
| `.env` | Database & environment variables |
| `extensions/` | Custom extensions/plugins |
| `themes/` | Store themes & layouts |
| `media/` | Uploaded images & files |
| `.log/` | Application logs |

## Configuration Files

### Environment Variables (`.env`)

Key variables for local development:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=evershop
DB_USER=postgres
DB_PASSWORD=postgres
NODE_ENV=development
PORT=3000
```

### Store Configuration (`config/default.json`)

Key settings:
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

## Common Tasks

### Create a New Admin User
```bash
npm run user:create
# Enter email, password (min 8 chars, letter + digit), and name
```

### Access the Store
- Store: http://localhost:3000
- Admin: http://localhost:3000/admin

### Change Admin Password
```bash
npm run user:changePassword
```

### Add Demo Data
```bash
npm run seed
```

### Build for Production
```bash
npm run build
npm run start
```

### Enable Debug Mode
```bash
npm run start:debug
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Connection refused | Verify PostgreSQL is running: `docker-compose ps` |
| Port 3000 in use | Change PORT in `.env` to another port |
| Setup fails | Check database connection in `.env` |
| Permission denied on media/ | Run `chmod -R 755 media/` |
| Module not found | Run `npm install` again |

## Directory Permissions

Ensure these directories are writable:
```bash
chmod -R 755 media/ public/ .log/ .evershop/
```

## Environment-Specific Configs

- **Development**: `.env` (default)
- **Production**: `.env.production`
- **Testing**: `.env.test` (optional)

Copy template and update:
```bash
cp .env.example .env
```

## Important Notes

⚠️ **Security**
- Never commit `.env` to version control
- Use strong passwords for admin accounts
- Change default database password
- Enable HTTPS in production

📌 **Database**
- Migrations run automatically on startup
- Use Docker PostgreSQL for local development
- Use managed PostgreSQL for production (AWS RDS, etc.)

📁 **Media Files**
- Local volumes work for development
- Use AWS S3 or Azure Blob Storage for production

## Useful Links

- 📚 [EverShop Documentation](https://evershop.io/docs)
- 💬 [Discord Community](https://discord.com/invite/GSzt7dt7RM)
- 🐛 [GitHub Issues](https://github.com/evershopcommerce/evershop/issues)
- 🚀 [Deployment Guide](https://evershop.io/docs/development/getting-started/deployment)

## Next Steps

1. ✅ Complete setup with `npm run setup`
2. 🎨 Customize theme in `themes/sample/`
3. 🔌 Build extensions in `extensions/`
4. 📦 Add products via admin panel
5. 🚀 Deploy to production

---

**For detailed setup instructions, see [SETUP.md](./SETUP.md)**
