const main = require('../main');
const utils = require('../utils');
const jwt = require('../jwt');

let fuel = [];

const fillFuelTable = async data => {
    for (let i = 0; i < data.length; i++) {
        data[i].by_cash = data[i].by_cash ? 'Наличка' : 'Безнал';
        data[i].cost_in_all = (data[i].fuel_cost * (data[i].tractor_filled + data[i].installation_filled)).toFixed(2);
        data[i].result = (data[i].tractor_filled - data[i].filled_indeed).toFixed(2);
    }
}

main.app.get('/api/getFuel', jwt.checkJwt, async (req, res) => {
    const wayListYear = req.query.year
    const wayListNumber = req.query.number;
    try {
      const rows = await utils.query('select * from fuel where way_list_number =' + wayListNumber + ' and way_list_year =' + wayListYear);
      await utils.setDateToLocal(rows);
      await fillFuelTable(rows);
      fuel = await rows;
    } catch(err) {
      res.send({
        msg: err
    });
    } finally {
      res.send({
        msg: fuel
    });
    }
});

module.exports.fillFuelTable = fillFuelTable;