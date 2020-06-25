FROM node:10.15.1

WORKDIR /workspace
COPY ./package.json /workspace

RUN npm install --production

COPY . /workspace

EXPOSE 3000

CMD ["npm","start"]