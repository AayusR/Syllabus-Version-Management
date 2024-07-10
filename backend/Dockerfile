FROM node:20

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 7132

HEALTHCHECK --interval=30s --timeout=10s --retries=3 CMD curl -f http://localhost:7132/ || exit 1

CMD [ "npm", "start" ]