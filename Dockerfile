FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat bash

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN echo "legacy-peer-deps=true" > .npmrc && npm install

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV SKIP_DB_DURING_BUILD=true
RUN mkdir -p src/migrations
RUN DATABASE_URL=postgres://postgres:postgres@localhost:5432/payload_build PAYLOAD_SECRET=build_time_placeholder npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
COPY --from=builder /app ./
EXPOSE 3000

CMD ["sh", "scripts/docker-entrypoint.sh"]
