FROM node:22.17.0-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]

# FROM node:20

# WORKDIR /app

# COPY package.json .
# COPY yarn.lock .

# RUN npm install

# COPY . .

# EXPOSE 3000

# CMD ["npm", "run", "dev"]
