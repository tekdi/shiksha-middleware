FROM node:20 as dependencies
WORKDIR usr/src/app
ENV NODE_TLS_REJECT_UNAUTHORIZED=1
COPY package*.json  ./
RUN npm install
ENV NODE_TLS_REJECT_UNAUTHORIZED=1
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
