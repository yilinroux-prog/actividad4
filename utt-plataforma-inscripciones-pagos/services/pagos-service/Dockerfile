FROM node:18-alpine
WORKDIR /usr/src/app
COPY package.json package-lock.json* ./
RUN npm install --only=production || npm install --only=production
COPY src ./src
RUN mkdir -p /usr/src/app/receipts
VOLUME ["/usr/src/app/receipts"]
EXPOSE 3002
CMD ["npm", "start"]
