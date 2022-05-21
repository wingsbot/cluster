FROM node:17.12.0-alpine
ENV NODE_ENV=production

WORKDIR /wings

RUN apk upgrade
RUN npm install -g pnpm

COPY ./ ./
RUN pnpm install

RUN pnpm run update-prisma
RUN pnpm run build

CMD ["node", "build/src/"]
