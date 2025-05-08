FROM node:24.0.0-alpine3.21 AS base


FROM base AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci


FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build


FROM alpine:3.21 AS runner
WORKDIR /app

# Install Node.js
COPY --from=base /usr/local/bin/node /usr/local/bin/node
COPY --from=base /usr/lib /usr/lib

# Copy app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Create and use non-root user
RUN addgroup -g 1001 nodejs && adduser -S -u 1001 -G nodejs nextjs
USER nextjs

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
EXPOSE 3000
CMD ["node", "server.js"]