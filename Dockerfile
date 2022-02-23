FROM node:17.4.0-alpine
ENV NODE_ENV=production

WORKDIR /app

RUN apk upgrade
RUN apk add --no-cache \
      curl \
      protobuf \
      build-base \
      g++ \
      libpng \
      libpng-dev \
      jpeg-dev \
      pango-dev \
      cairo-dev \
      giflib-dev \
      python3
RUN apk add --no-cache ca-certificates wget  && \
  wget -q -O /etc/apk/keys/sgerrand.rsa.pub https://alpine-pkgs.sgerrand.com/sgerrand.rsa.pub && \
  wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.29-r0/glibc-2.29-r0.apk && \
  apk add glibc-2.29-r0.apk

RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm

COPY ./ ./

RUN pnpm install
RUN pnpm i -g typescript

RUN pnpm run compile-protos
RUN pnpm run build

CMD ["node", "build/src/"]
