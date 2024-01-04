# Getting Node Base Image
FROM node:latest

# Creating a new directory for the app
RUN mkdir -p /usr/src/app

# Setting working directory in the container
WORKDIR /usr/src/app

# Copy Package.json
COPY ./package.json /usr/src/app/

# Copy package json file
RUN npm install

# Copying source code in the app file
COPY ./NodeApp/ /usr/src/app/

# Expose port
EXPOSE 5001

# Run app
CMD ["node", "/usr/src/app/server/server.js"]