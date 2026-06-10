FROM node:22-alpine

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml .npmrc ./

RUN pnpm install

COPY . .

EXPOSE 4200

CMD ["pnpm", "start", "--host", "0.0.0.0"]