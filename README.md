# Hahow Assignment

Host: https://ethanlinhomework.com

## Table of Contents
* [Start Server](#Start-Server)
    * [Preparation](#Preparation)
    * [Local start](#Local-start)
    * [Run API test](#Run-API-test)
* [Server Architecture](#Server-Architecture)
* [Third party library](#Third-party-library)
* [Comment rule](#Comment-rule)
* [Difficulty](#Difficulty)
* [Bonus](#Bonus)
* [API Documentation](#API-Documentation)

## Start Server

### Preparation
make sure to add **.env** file
ex:
```
hahowAPIHost=...
hahowHeroesPath=...
hahowHeroAuthPath=...
redisHost=...
testRedisHost=...
redisPort=...
```
### Local start
1. **modify docker-compose.yaml**: 
comment out below code  
`- /etc/ssl:/etc/ssl`  
`- 443:443`
2. **modify nginx/virtual.conf**:  
ex:
```
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_tokens off;

    if ($http_x_forwarded_proto = "http") {
        return 301 https://$host$request_uri;
    }

    location / {
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_set_header X-NginX-Proxy true;

        proxy_pass http://node:3000;
        proxy_redirect off;
    }
}
```
3. **Run docker-compose.yaml**:
Remember start docker first.  
`docker-compose up -d --build`

4. **Now you can call local api**:   
http://localhost/heroes  
http://localhost/heroes/:heroId

### Run API test
1. Please install redis-server on local machine, and start redis-server.
2. `npm run test`

## Server Architecture
![](https://i.imgur.com/35vUOGK.png)

## Third party library
* **express**: a light web framework of Node.js helps us to establish web server
* **axios**: promise based HTTP client for the browser and node.js, I use this library to call outside api service 
* **dotenv**: a zero-dependency module that loads environment variables from a .env file into process.env, it helps us to mananage our environment variable conveniently
* **redis**:  a in-memory key-value database, I use it as cache
* **jest**: a delightful JavaScript Testing Framework with a focus on simplicity
* **supertest**: a module provides a high-level abstraction for testing HTTP

## Comment rule
* Some code in order to put emphasis on purpose, I would use comment.
* Some special cases for judging the response from third party api response, I would use comment.
* The code of config file (ex: nginx/virtual.conf) to seperate the difference between dev (ex: local) or production environment, I would use comment.

## Difficulty
* In this project, when I use certbot to handle all things about SSL certificate, it always show the message like "please check A name points to correct ip", and I check again and again, but it still appears this error; the solution I use is via **SSL for free** to handle related things about SSL certificate.

## Bonus
* I handle the error cases for possible scenarios I can figure out, such as id out of range, third party api error and so on.
* I use **eslint** to make my coding style more strictly.
* I use **jenkins** and **docker** to make a simple CI/CD process of this project.
* I use **redis** to cache single hero and authentificated single hero data in order to decrease the frequency to call third party api.

## API Documentation
### List Heroes [GET] /heroes
* Request
```
curl -H "Accept: application/json" -H "Content-Type: application/json" -X GET https://ethanlinhomework.com/heroes
```

* Success case:
`Response 200`
```json=
{
  "heroes": [
    {
      "id": "1",
      "name": "Daredevil",
      "image": "http://i.annihil.us/u/prod/marvel/i/mg/6/90/537ba6d49472b/standard_xlarge.jpg"
    },
    {
      "id": "2",
      "name": "Thor",
      "image": "http://x.annihil.us/u/prod/marvel/i/mg/5/a0/537bc7036ab02/standard_xlarge.jpg"
    },
    // ...
  ]
}
```

* Error Case:
`Response 500`
```json=
{
    "message": "server error, please try it again"
}
```

### Single Hero [GET] /heroes/:heroId
* Request
```
curl -H "Accept: application/json" -H "Content-Type: application/json" -X GET https://ethanlinhomework.com/heroes/1
```
* Success Response:
`Response 200`
```json=
{
  "id": "1",
  "name": "Daredevil",
  "image": "http://i.annihil.us/u/prod/marvel/i/mg/6/90/537ba6d49472b/standard_xlarge.jpg"
}
```

* Error Response:

 1. invalid id (id should be a positive interger)
`Response 400`
```json=
{
  "message": "the hero id should be a positive interger"
}
```
2. id out of range (id is greater than total count of heroes) 
`Response 400`
```json=
{
  "message": "maybe the input hero id out of range, please try other id again"
}
```
3. server error
`Response 500`
```json=
{
  "message": "server error, please try it again"
}
```

### Authenticated List Heroes [GET] /heroes
* Request
```
curl -H "Accept: application/json" -H "Content-Type: application/json" -H "Name: hahow" -H "Password: rocks" -X GET https://ethanlinhomework.com/heroes
```

* Success Response
`Response 200`
```json=
{
  "heroes": [
    {
      "id": "1",
      "name": "Daredevil",
      "image": "http://i.annihil.us/u/prod/marvel/i/mg/6/90/537ba6d49472b/standard_xlarge.jpg",
      "profile": {
        "str": 2,
        "int": 7,
        "agi": 9,
        "luk": 7
      },
    },
    {
      "id": "2",
      "name": "Thor",
      "image": "http://x.annihil.us/u/prod/marvel/i/mg/5/a0/537bc7036ab02/standard_xlarge.jpg"
      "profile": {
        "str": 8,
        "int": 2,
        "agi": 5,
        "luk": 9
      },
    },
    // ...
  ]
}
```
* Error Response:
1. Name or Password incorrect
`Response 400`
```json=
{
    "message": "Please check hahow & password are correct."
}
```
2. server error
`Response 500`
```json=
{
    "message": "server error, please try it again"
}
```
### Authenticated Single Heroes [GET] /heroes/:heroId
* Request
```
curl -H "Accept: application/json" -H "Content-Type: application/json" -H "Name: hahow" -H "Password: rocks" -X GET https://ethanlinhomework/heroes/1
```
* Success Response
`Response 200`
```json=
{
  "id": "1",
  "name": "Daredevil",
  "image": "http://i.annihil.us/u/prod/marvel/i/mg/6/90/537ba6d49472b/standard_xlarge.jpg",
  "profile": {
    "str": 2,
    "int": 7,
    "agi": 9,
    "luk": 7
  }
}
```
* Error Response
1. invalid id (id should be a positive interger)
`Response 400`
```json=
{
  "message": "the hero id should be a positive interger"
}
```
2. id out of range (id is greater than total count of heroes) 
`Response 400`
```json=
{
  "message": "maybe the input hero id out of range, please try other id again"
}
```
3. Name or Password incorrect
`Response 400`
```json=
{
    "message": "Please check hahow & password are correct."
}
```
4. server error
`Response 500`
```json=
{
  "message": "server error, please try it again"
}
``` 