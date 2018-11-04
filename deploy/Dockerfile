FROM keymetrics/pm2:10-alpine

LABEL maintainer="Aimee LaPlant <aimee@aimeelaplant.com>"

ENV NODE_ENV production

ENV APPDIR /srv/www/comiccruncher

WORKDIR ${APPDIR}

COPY next.config.js package.json yarn.lock server.js ./

# Make sure to `yarn build` (outside container) to get latest next build.
COPY .next ./.next

COPY ./deploy/uploads/pm2/config.json ./deploy/uploads/pm2/config.json

RUN yarn install --production=true

CMD pm2-runtime start ./deploy/uploads/pm2/config.json

EXPOSE 3000
