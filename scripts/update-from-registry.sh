#!/usr/bin/env bash
set -euo pipefail

deploy_path="${DEPLOY_PATH:-$PWD}"
compose_file="${COMPOSE_FILE:-../docker-compose.release.yml}"

cd "$deploy_path"

docker compose -f "$compose_file" pull app
docker compose -f "$compose_file" up -d app
docker image prune -f