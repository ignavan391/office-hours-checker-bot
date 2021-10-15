FROM node:14.17-alpine as dev

WORKDIR /app/

COPY ./tg-bot/yarn.lock ./tg-bot/package.json ./

RUN yarn 

COPY ./tg-bot .
COPY .env .env

FROM node:14.17-alpine as builder

WORKDIR /app/

COPY --from=dev /app/ /app/

RUN yarn build 


FROM node:14.17-alpine

WORKDIR /app/
COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock ./

RUN NODE_ENV=production
RUN yarn

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.env .env