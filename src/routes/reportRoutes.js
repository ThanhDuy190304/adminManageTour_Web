const express = require('express');
const router = express.Router();
const reportController = require('../modules/report/reportController');

router.get('/', async (req, res) => {
    res.render('report', {
        layout: 'main',
        title: 'report',
    });
});

//${sortByValue}/${orderValue}
router.get('/StatisticMoneyByYear/:sortByValue/:orderValue', reportController.moneyStatisticByYear);
router.get('/StatisticMoneyByMonth/:sortByValue/:orderValue', reportController.moneyStatisticByMonth);
router.get('/StatisticMoneyByDay/:sortByValue/:orderValue', reportController.moneyStatisticByDay);

module.exports = router;