# Build
FROM --platform=linux/amd64 node:20.12.2-buster-slim AS builder

RUN mkdir /build
WORKDIR /build

COPY *.json /build
RUN npm install

COPY src/ /build/src
RUN rm /build/src/assets/env.js  # Use nginx-defined env.js at run time
RUN npm run build

# Runtime
FROM --platform=linux/amd64 nginx:1.25.3-alpine3.18-slim AS runtime
ARG VERSION

ENV COKERYEN_DB_AUTH=''
ENV COKERYEN_DB_URL=''
ENV COKERYEN_SRV_URL=''

MAINTAINER Arthur Nieuwland <anieuwland@nimmerfort.eu>
LABEL org.opencontainers.image.authors="Arthur Nieuwland <anieuwland@nimmerfort.eu>" \
#      org.opencontainers.image.source="https://bitbucket.org/nimmerwoner/moneymoneymoney/" \
      org.opencontainers.image.version=$VERSION \
      org.opencontainers.image.licenses="EUPL-1.2"

RUN rm -rv /usr/share/nginx/html
COPY --from=builder /build/dist/gekook/browser /usr/share/nginx/html
COPY nginx.default.conf.template /etc/nginx/templates/default.conf.template
EXPOSE 80