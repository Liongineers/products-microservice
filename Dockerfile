FROM node:18-alpine
WORKDIR /usr/src/app
COPY package*.json ./
COPY tsconfig.json ./

# Install all dependencies
RUN npm ci

COPY . .

# Use npx to run nest build without global install
RUN npx nest build

EXPOSE 8080
CMD [ "node", "dist/main.js" ]

