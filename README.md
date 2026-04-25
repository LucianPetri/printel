# Printel - Modern E-Commerce Platform

Printel is a feature-rich e-commerce store built with **EverShop 2.1.2**, a modern, open-source e-commerce platform.

<div align="center">

**[Setup Guide](./SETUP.md)** • **[Documentation](https://evershop.io/docs)** • **[Discord Community](https://discord.com/invite/GSzt7dt7RM)**

</div>

## Features

- 🛍️ **Complete E-Commerce**  — Products, categories, shopping cart, and checkout
- 🎨 **Flexible Theming** — Customizable store appearance with React-based themes
- 🔌 **Extensible** — Build custom functionality with EverShop extensions framework
- 📱 **Responsive Design** — Works seamlessly on desktop, tablet, and mobile
- 🔍 **SEO Optimized** — Built-in SEO features for better search visibility
- 💳 **Payment Ready** — Multiple payment gateway integrations
- 📊 **Admin Dashboard** — Powerful tools for managing products, orders, and customers
- 🚀 **High Performance** — Modern Node.js stack with React and PostgreSQL

## Tech Stack

- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Build Tool**: Parcel
- **Language**: TypeScript & JavaScript

## Getting Started

### Quick Start (5 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Start PostgreSQL with Docker
docker-compose up -d

# 3. Run setup wizard
npm run setup

# 4. Build the site
npm run build

# 5. Start development server
npm run dev
```

Then open **http://localhost:3000** in your browser.

👉 **[Read the detailed setup guide →](./SETUP.md)**

## Available Commands

```bash
npm run dev              # Development mode with hot-reloading
npm run build:extensions # Compile custom EverShop workspaces
npm run build            # Build for production
npm run start            # Start production server
npm run start:debug      # Start with debug logging
npm run lint             # Type-check all custom workspaces
npm run test:unit        # Run unit tests for compiled extensions
npm run test:e2e         # Run Playwright storefront/admin tests
npm run setup            # Run installation wizard
npm run seed             # Populate with demo data
npm run user:create      # Create admin user
npm run user:changePassword  # Change password
```

## Project Structure

```
printel/
├── config/              # Configuration files
├── extensions/          # Custom extensions/plugins
├── themes/              # Store themes
├── media/               # Uploaded files & images
├── public/              # Static assets
├── docker-compose.yml   # PostgreSQL container setup
├── .env                 # Environment variables (local only)
├── SETUP.md            # Setup instructions
└── README.md           # This file
```

## Customization Guide

### 1. Store Configuration

Edit `config/default.json`:
```json
{
  "shop": {
    "name": "Printel",
    "currency": "USD",
    "language": "en"
  }
}
```

### 2. Custom Theme

Create a new theme in `themes/my-theme/` following:
- `src/pages/` — React components for pages
- `src/graphql/` — GraphQL queries/mutations
- `tailwind.config.js` — Styling configuration

### 3. Custom Extension

Create in `extensions/my-extension/`:
- API routes in `src/api/`
- GraphQL types in `src/graphql/`
- Hooks and subscribers for custom logic

### 4. Database Configuration

Update `.env`:
```env
DB_HOST=your-postgres-host
DB_PORT=5432
DB_NAME=evershop
DB_USER=your-user
DB_PASSWORD=your-password
```

## Database Setup

### Using Docker (Recommended)

```bash
# Start PostgreSQL in Docker
docker-compose up -d

# View logs
docker-compose logs -f postgres

# Stop
docker-compose down
```

### Using Local PostgreSQL

Update `.env` with your local PostgreSQL credentials, then run setup.

## Deployment

### Docker Deployment

See `docker/README.md` for complete Docker containerization guide.

### Cloud Deployment

- **Heroku**: Supports Node.js and PostgreSQL add-on
- **Vercel**: Node.js backend support
- **AWS**: ECS, Lambda, or EC2
- **DigitalOcean**: App Platform or Droplets
- **Railway**: One-click deployment

Recommended: Configure cloud storage (AWS S3, Azure Blob) for media files in production.

## Environment Variables

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

# Optional: AWS S3
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_S3_BUCKET=your_bucket
```

Copy `.env.example` to `.env` and customize:
```bash
cp .env.example .env
```

## API Documentation

EverShop provides:
- **REST API** — For external integrations
- **GraphQL API** — For frontend queries
- **Internal API** — For extensions and themes

Access GraphQL playground at `http://localhost:3000/graphql` (development mode)

## Troubleshooting

### Setup Issues
- Verify PostgreSQL is running
- Check `.env` database settings
- Review logs: `tail -f .log/evershop.log`

### Performance
- Enable caching in production
- Use CDN for static assets
- Optimize images in `media/`

### Common Errors
- **"Port 3000 already in use"** — Change `PORT` in `.env`
- **"Connection refused"** — Verify PostgreSQL is running
- **"Module not found"** — Run `npm install` again

See [SETUP.md](./SETUP.md) for more troubleshooting tips.

## Contributing

We welcome contributions! To contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run the applicable validation commands (`npm run lint`, `npm run test:unit`,
   `npm run test:e2e`, `npm run build`; include `npm run build:extensions` when
   changing extension source)
5. Submit a pull request

See [CONTRIBUTING.md](https://github.com/evershopcommerce/evershop/blob/main/CONTRIBUTING.md) in main repo.

## Security

- Keep dependencies updated: `npm update`
- Never commit `.env` file
- Use strong passwords for admin accounts
- Enable HTTPS in production
- Review [Security Best Practices](https://evershop.io/docs/security)

## License

This project is licensed under the Open Software License (OSL 3.0).

## Support

- 📚 **Docs**: https://evershop.io/docs
- 💬 **Discord**: https://discord.com/invite/GSzt7dt7RM
- 🐛 **Issues**: https://github.com/evershopcommerce/evershop/issues
- 💙 **Sponsor**: https://opencollective.com/evershopcommerce

---

<div align="center">

Made with ❤️ by the EverShop community

[⭐ Star us on GitHub](https://github.com/evershopcommerce/evershop) | [Sponsor the project](https://opencollective.com/evershopcommerce)

</div>
