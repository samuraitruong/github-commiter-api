FROM node:18-alpine
WORKDIR /app
COPY package.json .
COPY yarn.lock .
COPY ./app ./app
RUN yarn install
ENV PORT 8080
EXPOSE 8080
CMD [ "npm", "start" ]