FROM node:18-alpine
WORKDIR /usr/src/app
COPY package.json package-lock.json* ./
RUN npm install --only=production || npm install --only=production
COPY src ./src
EXPOSE 3003
CMD ["npm", "start"]
