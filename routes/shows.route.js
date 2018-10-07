const express = require('express');
const router = express.Router();
const shows = require('../controllers/showController')

router.get('/', shows.getAll);
// router.get('/:memberName', shows.getByMember);
// router.get('/:setList', shows.getBySetlist);

module.exports = router