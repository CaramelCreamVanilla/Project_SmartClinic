FROM node:16

WORKDIR /app

COPY package*.json ./

RUN npm install

# After installing node modules, change the permissions
RUN chmod +x ./node_modules/.bin/vite

COPY . .

RUN npm run build

RUN npm install -g serve

EXPOSE 5557

CMD ["serve", "-s", "dist", "-p", "5557"]
