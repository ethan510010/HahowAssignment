require('dotenv').config();

const heroListUrl = `${process.env.hahowAPIHost}/${process.env.hahowHeroesPath}`;
const heroAuthUrl = `${process.env.hahowAPIHost}/${process.env.hahowHeroAuthPath}`;

module.exports = {
  heroListUrl,
  heroAuthUrl,
};
