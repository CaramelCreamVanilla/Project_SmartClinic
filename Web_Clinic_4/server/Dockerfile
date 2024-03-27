FROM node:21

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY ./server.js ./

COPY . .

EXPOSE 5555

CMD ["node", "server.js"]
