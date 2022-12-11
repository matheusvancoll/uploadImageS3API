FROM node:16.13.2
WORKDIR /app/service/imageapi/

COPY ./package*.json /app/service/imageapi
COPY ./src/ /app/service/imageapi/src/

RUN npm install

EXPOSE 8085

CMD ["npm", "start"]