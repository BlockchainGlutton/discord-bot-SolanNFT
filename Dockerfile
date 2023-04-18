FROM node:16

# Create bot directory
RUN mkdir -p /usr/src/bot
WORKDIR /usr/src/bot

# Install app dependencies
COPY tsconfig.json /usr/src/bot
COPY package.json /usr/src/bot
RUN ls -a
RUN npm install

COPY src /usr/src/bot/src

# CMD ['ts-node', 'src/index.ts']
CMD ["npm","run","start"]