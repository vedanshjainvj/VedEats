FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --production

COPY . .

RUN npm run build

EXPOSE 5173
CMD ["npx", "serve", "-s", "dist", "-l", "5173"]