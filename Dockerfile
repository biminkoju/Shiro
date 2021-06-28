FROM node:15

WORKDIR /usr/sr
COPY package*.json ./
RUN yarn install
COPY . .

EXPOSE 8080
CMD [ "yarn", "start" ]
