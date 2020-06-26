const axios = require('axios');
require('dotenv').config();

const { heroListUrl, heroAuthUrl } = require('../common/urlProducer');
const handler = require('../common/handler');
const { getAuthHeroDetail, saveAuthHeroDetail } = require('../models/hero');

const defaultReqHeader = {
  'Content-Type': 'application/json',
};

const getAuthHeroesList = async (req, res, next) => {
  const { name, password } = req.headers;
  if (name && password) {
    const authBody = { name, password };
    const [authRes, authError] = await handler(axios.post(heroAuthUrl, authBody, defaultReqHeader));
    if (authError) {
      return res.status(400).json({
        message: 'Please check hahow & password are correct.',
      });
    }
    // success auth
    if (authRes.status === 200) {
      const [heroListRes, getHeroListError] = await handler(axios.get(heroListUrl));
      if (getHeroListError) {
        return res.status(500).json({
          message: 'server error, please try it again',
        });
      }
      for (let i = 0; i < heroListRes.data.length; i += 1) {
        const eachHeroInfo = heroListRes.data[i];
        // in order to ensure the order of id, ignore eslint hint here
        // eslint-disable-next-line no-await-in-loop
        const [heroProfileRes, getProfileError] = await handler(axios.get(`${heroListUrl}/${eachHeroInfo.id}/profile`));
        if (getProfileError) {
          return res.status(500).json({
            message: 'server error, please try it again',
          });
        }
        eachHeroInfo.profile = heroProfileRes.data;
      }
      return res.json({
        heroes: heroListRes.data,
      });
    }
  }
  return next();
};

const getAuthSingleHero = async (req, res, next) => {
  const heroId = req.params.id;
  const { name, password } = req.headers;
  if (name && password) {
    const authBody = { name, password };
    const [authRes, authError] = await handler(axios.post(heroAuthUrl, authBody, defaultReqHeader));
    if (authError) {
      return res.status(400).json({
        message: 'Please check hahow & password are correct.',
      });
    }
    // success auth
    if (authRes.status === 200) {
      // check cache first
      const [heroAuthInfo, cacheError] = await handler(getAuthHeroDetail(heroId));
      if (!cacheError && heroAuthInfo) {
        return res.json(JSON.parse(heroAuthInfo));
      }
      const [heroDetailRes, getHeroDetailError] = await handler(axios.get(`${heroListUrl}/${heroId}`));
      if (getHeroDetailError) {
        return res.status(400).json({
          message: 'maybe the input hero id out of range, please try other id again',
        });
      }
      if (heroDetailRes.status === 200 && heroDetailRes.data.code === 1000) {
        return res.status(500).json({
          message: 'server error, please try it again',
        });
      }
      const [heroProfileRes, getProfileError] = await handler(axios.get(`${heroListUrl}/${heroDetailRes.data.id}/profile`));
      if (getProfileError) {
        return res.status(500).json({
          message: 'server error, please try it again',
        });
      }
      heroDetailRes.data.profile = heroProfileRes.data;
      saveAuthHeroDetail(heroId, JSON.stringify(heroDetailRes.data));
      return res.json(heroDetailRes.data);
    }
  }
  return next();
};

module.exports = {
  getAuthHeroesList,
  getAuthSingleHero,
};
