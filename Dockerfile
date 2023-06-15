FROM node:18-alpine AS builder

LABEL maintainer="Aimee LaPlant <aimee@aimeelaplant.com>"

WORKDIR /comiccruncher

ENV NODE_OPTIONS='--openssl-legacy-provider'

COPY . .

RUN yarn install --frozen-lockfile

RUN yarn build

FROM mesosphere/aws-cli AS uploader

ENV NODE_OPTIONS='--openssl-legacy-provider'

WORKDIR /app

RUN apk add make --no-cache

ARG CC_AWS_ACCESS_KEY_ID
ARG CC_AWS_SECRET_ACCESS_KEY
ARG CC_AWS_DEFAULT_REGION
ARG CC_AWS_BUCKET

ENV AWS_ACCESS_KEY_ID=$CC_AWS_ACCESS_KEY_ID
ENV AWS_SECRET_ACCESS_KEY=$CC_AWS_SECRET_ACCESS_KEY
ENV AWS_DEFAULT_REGION=$CC_AWS_DEFAULT_REGION
ENV CC_AWS_BUCKET=$CC_AWS_BUCKET

COPY --from=builder /comiccruncher/Makefile ./

COPY --from=builder /comiccruncher/.next/ ./.next

COPY --from=builder /comiccruncher/static/ ./static

RUN make s3_upload_all

FROM node:18-alpine AS app

RUN npm install pm2 -g

ENV NODE_ENV ${ENVIRONMENT}

ENV APPDIR /srv/www/comiccruncher

ENV PORT 8008

WORKDIR ${APPDIR}

COPY --from=builder /comiccruncher/next.config.js /comiccruncher/package.json /comiccruncher/yarn.lock /comiccruncher/server.js ./

COPY --from=builder /comiccruncher/deploy/uploads/pm2/config.json ./deploy/uploads/pm2/config.json

COPY --from=builder /comiccruncher/.next ./.next

RUN yarn install --production --frozen-lockfile

CMD pm2-runtime start ./deploy/uploads/pm2/config.json

EXPOSE 8008
