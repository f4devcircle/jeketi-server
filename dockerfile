FROM node:alpine
WORKDIR /app
COPY . /app
RUN yarn
CMD ["node", "index.js"]

EXPOSE 3000