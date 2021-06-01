FROM node

ENV PATH $PATH:/node_modules/.bin

WORKDIR /app/frontend
COPY package*.json ./

RUN npm install --legacy-peer-deps && npm cache clean --force

EXPOSE 3000
CMD ["npm", "start"]
