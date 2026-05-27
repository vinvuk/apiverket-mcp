FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

FROM node:22-alpine AS runtime

WORKDIR /app
ENV NODE_ENV=production
ENV GOVDATA_API_URL=https://apiverket.se
ENV GOVDATA_API_KEY=sk_test_demo

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist
COPY README.md LICENSE server.json ./

CMD ["node", "dist/index.js"]
