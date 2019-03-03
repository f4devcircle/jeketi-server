const express = require('express');
const router = express.Router();
const transaction = require('../controllers/transaction');

router.post('/:timestamp', transaction.buyticket);

module.exports = router;