const express = require('express');

const router = express.Router();

const { listHeroes, getSingleHero } = require('../controllers/heroes');

router.get('/', listHeroes);
router.get('/:id', getSingleHero);

module.exports = router;
