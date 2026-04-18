# Postgres Docker Setup for Evershop

This directory contains Docker configuration for running PostgreSQL with Evershop.

## Quick Start

### 1. Start PostgreSQL

```bash
docker-compose up -d
```

This will:
- Start a PostgreSQL 16 container
- Create the `evershop` database
- Mount a volume for persistent data
- Expose the database on port `5432`

### 2. Verify Database is Running

```bash
docker-compose ps
```

You should see the `evershop-postgres` container in a healthy state.

### 3. Test Connection

```bash
docker-compose exec postgres psql -U postgres -d evershop
```

### 4. Configure Evershop

Update your Evershop configuration to use the PostgreSQL connection:

```javascript
// In your config/default.json or environment variables
{
  "database": {
    "host": "localhost",
    "port": 5432,
    "database": "evershop",
    "user": "postgres",
    "password": "postgres"
  }
}
```

Or if running Evershop in Docker, use:
```
DB_HOST=postgres
DB_PORT=5432
DB_NAME=evershop
DB_USER=postgres
DB_PASSWORD=postgres
```

## Environment Variables

Configure database settings in `.env` file:

- `DB_NAME` - Database name (default: evershop)
- `DB_USER` - Database user (default: postgres)
- `DB_PASSWORD` - Database password (default: postgres)
- `DB_HOST` - Database host (default: localhost)
- `DB_PORT` - Database port (default: 5432)

Copy `.env.example` to `.env` and modify as needed:

```bash
cp .env.example .env
```

## Common Commands

### Stop the database
```bash
docker-compose down
```

### Remove database and start fresh
```bash
docker-compose down -v
docker-compose up -d
```

### View logs
```bash
docker-compose logs -f postgres
```

### Access database directly
```bash
docker-compose exec postgres psql -U postgres -d evershop
```

### Backup database
```bash
docker-compose exec postgres pg_dump -U postgres evershop > backup.sql
```

### Restore database
```bash
docker-compose exec -T postgres psql -U postgres evershop < backup.sql
```

## Running Evershop with Docker Network

If you're also running Evershop in Docker, connect it to the same network:

```bash
docker run --network evershop-network \
  -e DB_HOST=postgres \
  -e DB_NAME=evershop \
  -e DB_USER=postgres \
  -e DB_PASSWORD=postgres \
  your-evershop-image
```

## Pull-Based Production Updates

If GitHub cannot open an inbound connection to your server, use the registry-based flow instead of deploying from GitHub directly.

### GitHub side

The CI workflow publishes a production image to GitHub Container Registry:

```text
ghcr.io/lucianpetri/printel:main
ghcr.io/lucianpetri/printel:latest
ghcr.io/lucianpetri/printel:sha-<commit>
```

### Server side

Use `docker-compose.release.yml` instead of the local build-based compose file and keep your production `.env` on the server.

To update manually:

```bash
DEPLOY_PATH=/srv/printel ./scripts/update-from-registry.sh
```

### Scheduler vs webhook

For this setup, a webhook is usually better than a scheduler because it updates immediately after GitHub finishes pushing the image.

- Scheduler: simple and robust, but delayed and does unnecessary checks
- Webhook: immediate and efficient, but you must secure the endpoint

If you do not want to expose a webhook at all, run the update script from cron every few minutes.

## Troubleshooting

### Database won't start
```bash
# Check logs
docker-compose logs postgres

# Verify port 5432 isn't in use
lsof -i :5432

# Remove stale container
docker-compose down -v
docker-compose up -d
```

### Connection refused
Wait a few seconds for the database to be ready. Check the healthcheck status:
```bash
docker-compose ps
```

The database should show as "healthy" before attempting connections.

### Permission denied (changing password)
PostgreSQL needs a moment to initialize. Wait 5-10 seconds before connecting.

## Notes

- Data is persisted in the `postgres_data` Docker volume
- The database is accessible from the host on `localhost:5432`
- Credentials are configured in `.env` file (don't commit `.env` to version control)
- The healthcheck ensures readiness before the app connects
