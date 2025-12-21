FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN mkdir -p public
ARG FIREBASE_SERVICE_ACCOUNT
ARG FIREBASE_SERVICE_ACCOUNT_B64
ENV FIREBASE_SERVICE_ACCOUNT=${FIREBASE_SERVICE_ACCOUNT}
RUN if [ -n "$FIREBASE_SERVICE_ACCOUNT_B64" ]; then \
  export FIREBASE_SERVICE_ACCOUNT="$(echo "$FIREBASE_SERVICE_ACCOUNT_B64" | base64 -d)" ; \
  fi && \
  npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
RUN npm ci --omit=dev
EXPOSE 3000
CMD ["npm", "run", "start"]
