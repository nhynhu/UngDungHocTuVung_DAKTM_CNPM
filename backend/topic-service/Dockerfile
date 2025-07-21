FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Tạo uploads folder
RUN mkdir -p uploads
VOLUME ["/app/uploads"]

EXPOSE 5005
CMD ["node", "index.js"]