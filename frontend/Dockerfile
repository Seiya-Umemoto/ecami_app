FROM node

WORKDIR /app/frontend
COPY package.json .

RUN npm install --save
RUN npm install axios --save
RUN npm install bootstrap --save
RUN npm install react-router-dom --save

EXPOSE 3000
CMD ["npm", "start"]
