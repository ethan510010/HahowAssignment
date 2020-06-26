require('dotenv').config();

const redisConfig = {
  host: process.env.NODE_ENV === 'test' ? process.env.testRedisHost : process.env.redisHost,
  port: process.env.redisPort,
};

module.exports = redisConfig;
