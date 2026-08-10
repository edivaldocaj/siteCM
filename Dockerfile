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
ARG DATABASE_URL=postgres://postgres:postgres@localhost:5432/payload_build
ARG PAYLOAD_SECRET=build_time_secret_replace_at_runtime
ENV DATABASE_URL=$DATABASE_URL
ENV PAYLOAD_SECRET=$PAYLOAD_SECRET
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
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 CMD node -e "fetch('http://127.0.0.1:3000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["sh", "scripts/docker-entrypoint.sh"]


