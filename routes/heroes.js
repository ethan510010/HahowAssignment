const express = require('express');

const router = express.Router();

const { listHeroes, getSingleHero } = require('../controllers/heroes');
const checkIdValidity = require('../middlewares/idChecker');

router.get('/', listHeroes);
router.get('/:id', checkIdValidity, getSingleHero);

module.exports = router;
