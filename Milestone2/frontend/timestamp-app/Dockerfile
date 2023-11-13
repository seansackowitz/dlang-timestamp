FROM node:lts    
# Set working directory
WORKDIR /app

# install node modules
COPY ./package*.json ./
RUN npm install

# Copy all files from current directory to working dir in image
COPY . ./

ENV PORT 80
ENV CHOKIDAR_USEPOLLING true
ENV WEBPACK_USEPOLLING true
ENV WATCHPACK_POLLING true

ENTRYPOINT [ "npm", "start" ]