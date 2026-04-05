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
ENV DATABASE_URL=postgres://postgres:CmAdmin2026@cavalcante_melo_cavalcante_melo-postgres:5432/cavalcantemelo
ENV PAYLOAD_SECRET=temp_build_secret_32chars_long!!
RUN mkdir -p src/migrations
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app ./
RUN chown -R nextjs:nodejs /app
USER nextjs
EXPOSE 3000

# Migrations: responde 'y' ao prompt interativo e limita a 60s para não travar o startup
CMD ["bash", "-c", "echo 'y' | timeout 60 npx payload migrate:create auto 2>/dev/null || true; echo 'y' | timeout 60 npx payload migrate 2>/dev/null || true; npm run start"]
