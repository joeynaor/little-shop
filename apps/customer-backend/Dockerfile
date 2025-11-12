FROM node:24-alpine3.21 AS base


FROM base AS installer
WORKDIR /app
RUN apk add bash make g++
COPY . .
RUN npm ci
RUN npm run build
RUN npm ci --omit=dev

FROM node:24-alpine3.21 AS final
ARG WORKSPACE_NAME
WORKDIR /app
COPY --from=installer /app/node_modules ./node_modules
COPY --from=installer /app/package*.json ./
COPY --from=installer /app/dist ./dist
EXPOSE 3000
CMD node --enable-source-maps /app/dist/index.js