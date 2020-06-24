const axios = require('axios');
require('dotenv').config();

const heroListUrl = `${process.env.hahowAPIHost}/${process.env.hahowHeroesPath}`;
const heroAuthUrl = `${process.env.hahowAPIHost}/${process.env.hahowHeroAuthPath}`;

const listHeroes = async (req, res, next) => {
  const { name, password } = req.headers;
  if (name && password) {
    try {
      const response = await axios.post(heroAuthUrl, {
        name,
        password
      }, {
        'Content-Type': 'application/json'
      });
      if (response.status === 200) {
        return res.json({
          message: 'auth successful'
        })
      }
    } catch (error) {
      throw new Error('auth server error');
    }
  }
  try {
    const response = await axios.get(heroListUrl);
    res.status(200).json({
      heroes: response.data,
    });
  } catch (error) {
    throw new Error('call third party api error, maybe try it later');
  }
};

const getSingleHero = async (req, res, next) => {
  // should add logic to block invalid id
  const heroId = req.params.id;
  try {
    const response = await axios.get(`${heroListUrl}/${heroId}`);
    res.status(200).json(response.data);
  } catch (error) {
    // maybe third party api error, maybe id over range
    throw new Error('call third party api error, maybe try it later');
  }
};

module.exports = {
  listHeroes,
  getSingleHero,
};
