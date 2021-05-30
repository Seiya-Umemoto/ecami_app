FROM node

WORKDIR /app/frontend
COPY package.json .

RUN npm install --save
RUN npm install react-input-slider --save

EXPOSE 3000
CMD ["npm", "start"]
