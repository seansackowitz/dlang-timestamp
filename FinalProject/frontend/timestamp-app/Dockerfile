FROM node:lts    
# Set working directory
WORKDIR /app

# install node modules
COPY ./package*.json ./
RUN npm ci

# Copy all files from current directory to working dir in image
COPY . ./
RUN npm run build
RUN npm install -g serve

ENV PORT 80
ENV CHOKIDAR_USEPOLLING true
ENV WEBPACK_USEPOLLING true
ENV WATCHPACK_POLLING true

# FROM nginx:stable-alpine
# COPY --from=build /app/build /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]

ENTRYPOINT [ "serve", "-s", "build" ]