const redis = require('redis');

const redisConfig = require('../config/redis');

const redisCli = redis.createClient(redisConfig);

redisCli.on('connection', () => {
  // eslint-disable-next-line no-console
  console.log('redis connect successfully');
});

redisCli.on('error', (err) => {
  // eslint-disable-next-line no-console
  console.log('redis connect failed', err);
});

const closeInstance = () => {
  redisCli.quit();
};

module.exports = {
  redisCli,
  closeInstance,
};
