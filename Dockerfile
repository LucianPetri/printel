FROM node:22-bookworm-slim AS build

WORKDIR /app

COPY package.json package-lock.json ./
COPY patches ./patches
COPY config ./config
COPY docker ./docker
COPY extensions ./extensions
COPY translations ./translations
COPY media ./media
COPY public ./public

RUN npm ci

COPY . .

RUN npm run build

FROM node:22-bookworm-slim AS runtime

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=build /app /app

EXPOSE 3000

CMD ["npm", "run", "start"]