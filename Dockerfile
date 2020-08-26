FROM node:10-alpine

WORKDIR /app

ADD package.json /app/package.json

RUN yarn install

ADD . /app

CMD ["yarn", "run", "start:dev"]