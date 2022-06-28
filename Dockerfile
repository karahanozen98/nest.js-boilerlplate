FROM node:lts As production

WORKDIR /usr/src/app

COPY package*.json ./

 ARG NODE_ENV=production
 ENV NODE_ENV=${NODE_ENV}

RUN npm set-script prepare ""
RUN npm ci --omit=dev

COPY . .

RUN npm run build

CMD ["node", "dist/main"]