const express = require('express');

const router = express.Router();

const { listHeroes, getSingleHero } = require('../controllers/heroes');
const checkIdValidity = require('../middlewares/idChecker');
const { getAuthHeroesList, getAuthSingleHero } = require('../middlewares/authProfile');

router.get('/', getAuthHeroesList, listHeroes);
router.get('/:id', checkIdValidity, getAuthSingleHero, getSingleHero);

module.exports = router;
