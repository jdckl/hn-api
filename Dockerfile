# Development Dockerfile
# No building for production
FROM node:16-alpine

WORKDIR /usr/src/app
COPY package.json .
COPY tsconfig.json .
COPY src ./src
COPY types ./types
RUN npm install

EXPOSE 3000
CMD [ "npm", "run", "start:dev" ]