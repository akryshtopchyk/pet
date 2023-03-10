
FROM node:15.11.0-alpine3.10 as build

WORKDIR /app/backend
COPY . /app/backend

RUN npm i 
RUN npm run build

CMD ["npm", "run", "start:prod"]
