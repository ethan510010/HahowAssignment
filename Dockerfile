FROM node:10.15.1

WORKDIR /workspace
COPY ./package.json /workspace

RUN npm install --production
RUN npm install pm2 -g

COPY . /workspace

EXPOSE 3000

CMD ["pm2-runtime", "process.yaml"]