
# FROM node:15.11.0-alpine3.10 as build

# WORKDIR /app/backend
# COPY . /app/backend

# RUN npm i 
# RUN npm run build

# CMD ["npm", "run", "start:prod"]

# Base image
FROM node:16-alpine

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN yarn install

# Bundle app source
COPY . .

# Creates a "dist" folder with the production build
RUN yarn build