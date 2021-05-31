FROM node

WORKDIR /app/frontend
COPY package.json .

RUN npm install --save
RUN npm install axios --save
RUN npm install bootstrap --save
RUN npm install react-router-dom --save
RUN npm install react-input-slider --save --legacy-peer-deps
RUN npm install react-bootstrap-range-slider --save --legacy-peer-deps

EXPOSE 3000
CMD ["npm", "start"]
