FROM node

ENV PATH $PATH:/node_modules/.bin

WORKDIR /app/frontend
COPY package.json package-lock.json ./

RUN npm install --save

EXPOSE 3000
CMD ["npm", "start"]
