const axios = require('axios');
require('dotenv').config();

const { heroListUrl } = require('../common/urlProducer');
const handler = require('../common/handler');

const listHeroes = async (req, res, next) => {
  const [heroesInfoRes, error] = await handler(axios.get(heroListUrl));
  if (error) {
    return res.status(500).json({
      message: 'server error, please try it again',
    });
  }
  /*
    sometimes call third party api successfully,
    but the response is invalid format, need to handle the scenario,
    in this case, third party response will have status code 200 and
    response body 'code' equals 1000
  */
  if (heroesInfoRes.status === 200 && heroesInfoRes.data.code === 1000) {
    return res.status(500).json({
      message: 'server error, please try it again',
    });
  }
  return res.status(200).json({
    heroes: heroesInfoRes.data,
  });
};

const getSingleHero = async (req, res, next) => {
  const heroId = req.params.id;
  const [heroDetailRes, error] = await handler(axios.get(`${heroListUrl}/${heroId}`));
  if (error) {
    return res.status(400).json({
      message: 'maybe the input hero id out of range, please try other id again',
    });
  }
  if (heroDetailRes.status === 200 && heroDetailRes.data.code === 1000) {
    return res.status(500).json({
      message: 'server error, please try it again',
    });
  }
  return res.status(200).json(heroDetailRes.data);
};

module.exports = {
  listHeroes,
  getSingleHero,
};
