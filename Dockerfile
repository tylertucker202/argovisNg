FROM node:8

#Install and build angular app
WORKDIR /usr/src/ng-argo
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./


RUN npm install
RUN npm install @angular/cli -g
# Install PM2
RUN npm install -g pm2
RUN ln -s /opt/nodejs/bin/pm2 /usr/bin/pm2
# copies everything from host dir to container work dir
COPY . .
RUN ng build 

#Install and run express app
WORKDIR /usr/src/ng-argo/argo
RUN npm install
# If you are building your code for production
# RUN npm install --only=production
EXPOSE 3000
#CMD [ 'npm' , 'run', 'dockerstart']
CMD ['pm2', 'start', 'process.json', '--no-daemon']

