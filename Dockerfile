FROM node:12.0
#Install and build angular app
WORKDIR /usr/src/ng_argovis
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
RUN npm install && \
    npm install @angular/cli@9.0.4 -g && \
    npm install -g pm2
COPY . .
RUN ng build 
#Install and run express app
WORKDIR /usr/src/ng_argovis/backend_argovis
RUN npm install
# If you are building your code for production
# RUN npm install --only=production
EXPOSE 3000
CMD ["pm2", "start", "process.json", "--no-daemon"]

