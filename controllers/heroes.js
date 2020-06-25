const axios = require('axios');
require('dotenv').config();

const { heroListUrl } = require('../common/urlProducer');

const listHeroes = async (req, res, next) => {
  try {
    const response = await axios.get(heroListUrl);
    /*
    sometimes call third party api successfully,
    but the response is invalid format, need to handle the scenario
    */
    if (response.status === 200 && response.data.code === 1000) {
      return res.status(500).json({
        message: 'server error, please try it again',
      });
    }
    return res.status(200).json({
      heroes: response.data,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'server error, please try it again',
    });
  }
};

const getSingleHero = async (req, res, next) => {
  const heroId = req.params.id;
  try {
    const response = await axios.get(`${heroListUrl}/${heroId}`);
    if (response.status === 200 && response.data.code === 1000) {
      return res.status(500).json({
        message: 'server error, please try it again',
      });
    }
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(400).json({
      message: 'maybe the input hero id out of range, please try other id again',
    });
  }
};

module.exports = {
  listHeroes,
  getSingleHero,
};
