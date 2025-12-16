FROM node:20-slim
WORKDIR /usr/app

COPY package.json ./
RUN npm cache clean --force
RUN npm cache verify
RUN npm install

COPY . .

EXPOSE 3000
CMD ["npm","start"]