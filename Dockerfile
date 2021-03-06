FROM node:10-alpine as microservice-redis
LABEL maintainer="sandeep"
LABEL product="Microservice Redis"

WORKDIR /app

ADD package.json /app/package.json

RUN yarn install

ADD . /app

RUN yarn run build

CMD ["yarn", "run", "start:prod"]