FROM node:20-alpine AS install
WORKDIR /install

COPY package.json package-lock.json ./
RUN npm install --omit=dev

FROM node:20-alpine AS builder
WORKDIR /build
COPY --from=install /install/node_modules ./node_modules

COPY ./app /build/app
COPY package.json package-lock.json ./

COPY tsconfig.json .
COPY next.config.js .

RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

ARG BACKEND_HOST
ENV BACKEND_HOST=${BACKEND_HOST}
ARG BACKEND_PORT
ENV BACKEND_PORT=${BACKEND_PORT}

COPY --from=builder /build/.next ./.next
COPY --from=builder /build/node_modules ./node_modules
COPY --from=builder /build/package.json ./package.json

ENV FRONTEND_PORT 3000
EXPOSE $FRONTEND_PORT

CMD ["npm", "run", "start"]
