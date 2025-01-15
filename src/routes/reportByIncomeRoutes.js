const express = require('express');
const router = express.Router();
const reportByIncomeController = require('../modules/reportByIncome/reportByIncomeController');

router.get('/', async (req, res) => {
    res.render('reportByIncome', {
        layout: 'main',
        title: 'reportByIncome',
    });
});

//${sortByValue}/${orderValue}
router.get('/StatisticMoneyByYear/:sortByValue/:orderValue', reportByIncomeController.moneyStatisticByYear);
router.get('/StatisticMoneyByMonth/:sortByValue/:orderValue', reportByIncomeController.moneyStatisticByMonth);
router.get('/StatisticMoneyByDay/:sortByValue/:orderValue', reportByIncomeController.moneyStatisticByDay);

module.exports = router;