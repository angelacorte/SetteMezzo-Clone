FROM node:alpine

WORKDIR /usr/src/app/server

COPY server/package*.json .

COPY common /usr/src/app/common

RUN npm install

COPY server .

RUN npm run build

ENV PORT=3000

EXPOSE 3000

CMD ["npm", "start"]
