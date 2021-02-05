FROM node:14-alpine3.12
WORKDIR /home/node
COPY package*.json ./
RUN npm i
RUN apk update; apk add curl
COPY . ./
CMD ["npm","start"]