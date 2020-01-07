FROM node:lts-alpine

WORKDIR /app/

COPY app/package.json /app/
COPY app/package-lock.json /app
RUN npm install

COPY app/ /app/

RUN npm run build

CMD ["npm","run","start"]