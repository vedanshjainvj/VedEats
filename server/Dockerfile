FROM node:18

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY server ./server

WORKDIR /app/server

RUN npm run build

EXPOSE 8000

CMD ["npm", "start"]
