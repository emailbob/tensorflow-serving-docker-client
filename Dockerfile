FROM node:8.6.0-alpine

RUN apk update && \
    apk upgrade && \
    apk add --no-cache git libc6-compat

WORKDIR /tensorflowclient

COPY index.js ./
COPY package*.json ./

RUN npm install

ENTRYPOINT [ "node", "index.js" ]
