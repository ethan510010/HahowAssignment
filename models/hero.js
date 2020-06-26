const { redisCli } = require('../db/redis');

const saveNoAuthHeroDetail = (id, heroInfo) => {
  // cache time set 2 hours = 7200 seconds
  redisCli.setex(`${id}`, 7200, heroInfo);
};

const getNoAuthHeroDetail = (id) => new Promise((resolve, reject) => {
  redisCli.get(`${id}`, (err, data) => {
    if (err) {
      reject(err);
    }
    resolve(data);
  });
});

const saveAuthHeroDetail = (id, heroInfo) => {
  redisCli.setex(`auth${id}`, 7200, heroInfo);
};

const getAuthHeroDetail = (id) => new Promise((resolve, reject) => {
  redisCli.get(`auth${id}`, (err, data) => {
    if (err) {
      reject(err);
    }
    resolve(data);
  });
});

module.exports = {
  saveNoAuthHeroDetail,
  getNoAuthHeroDetail,
  saveAuthHeroDetail,
  getAuthHeroDetail,
};
