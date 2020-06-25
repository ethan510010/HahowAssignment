const axios = require('axios');
require('dotenv').config();

const { heroListUrl, heroAuthUrl } = require('../common/urlProducer');

const getAuthHeroesList = async (req, res, next) => {
  const { name, password } = req.headers;
  if (name && password) {
    try {
      const authBody = { name, password };
      const response = await axios.post(heroAuthUrl, authBody, {
        'Content-Type': 'application/json',
      });
      if (response.status === 200) {
        // success auth
        const heroListRes = await axios.get(heroListUrl);
        for (let i = 0; i < heroListRes.data.length; i += 1) {
          const eachHeroInfo = heroListRes.data[i];
          // in order to ensure the order of id, ignore eslint hint here
          // eslint-disable-next-line no-await-in-loop
          const heroProfileRes = await axios.get(`${heroListUrl}/${eachHeroInfo.id}/profile`);
          eachHeroInfo.profile = heroProfileRes.data;
        }
        return res.json({
          heroes: heroListRes.data,
        });
      }
    } catch (error) {
      return res.status(400).json({
        message: 'Please check hahow & password are correct.',
      });
    }
  }
  return next();
};

const getAuthSingleHero = async (req, res, next) => {
  const heroId = req.params.id;
  const { name, password } = req.headers;
  if (name && password) {
    try {
      const authBody = { name, password };
      const response = await axios.post(heroAuthUrl, authBody, {
        'Content-Type': 'application/json',
      });
      if (response.status === 200) {
        // success auth
        const heroDetailRes = await axios.get(`${heroListUrl}/${heroId}`);
        const heroProfileRes = await axios.get(`${heroListUrl}/${heroDetailRes.data.id}/profile`);
        heroDetailRes.data.profile = heroProfileRes.data;
        return res.json(heroDetailRes.data);
      }
    } catch (error) {
      return res.status(400).json({
        message: 'Please check hahow & password are correct.',
      });
    }
  }
  return next();
};

module.exports = {
  getAuthHeroesList,
  getAuthSingleHero,
};
