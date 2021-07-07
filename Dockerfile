FROM node:16

WORKDIR /usr/sr
COPY package*.json ./
RUN yarn install
COPY . .

CMD [ "yarn", "start" ]