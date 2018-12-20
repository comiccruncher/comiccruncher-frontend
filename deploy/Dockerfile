FROM node:11.4-alpine

LABEL maintainer="Aimee LaPlant <aimee@aimeelaplant.com>"

RUN npm install pm2 -g

ENV NODE_ENV production

ENV APPDIR /srv/www/comiccruncher

WORKDIR ${APPDIR}

COPY next.config.js package.json yarn.lock server.js ./

# Make sure to `yarn build` (outside container) to get latest next build.
COPY .next ./.next

COPY ./deploy/uploads/pm2/config.json ./deploy/uploads/pm2/config.json

RUN NODE_ENV=production yarn install --production --frozen-lockfile

CMD pm2-runtime start ./deploy/uploads/pm2/config.json

EXPOSE 3000
