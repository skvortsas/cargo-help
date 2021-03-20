const main = require('../main');
const utils = require('../utils');
const jwt = require('../jwt');

let moneyFlow = [];

main.app.get('/api/getMoneyFlow', jwt.checkJwt, async (req, res) => {
    const wayListYear = req.query.year
    const wayListNumber = req.query.number;
    try {
      const rows = await utils.query('select * from money_flow where way_list_number =' + wayListNumber + ' and way_list_year =' + wayListYear);
      await utils.setDateToLocal(rows);
      moneyFlow = await rows;
    } catch(err) {
      res.send({
        msg: err
    });
    } finally {
      res.send({
        msg: moneyFlow
    });
    }
});