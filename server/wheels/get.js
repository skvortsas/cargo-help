const main = require('../main');
const utils = require('../utils');
const jwt = require('../jwt');

let wheels= [];

const fillWheelsTable = async data => {
    for (let i = 0; i < data.length; i++) {
        data[i].to_tractor = data[i].to_tractor ? 'Тягач' : 'Реф';
        data[i].is_wheel = data[i].is_wheel ? 'Колёса' : 'Не колёса';
        data[i].by_cash = data[i].by_cash ? 'Наличка': 'Безнал';
    }
}

main.app.get('/api/getWheels', jwt.checkJwt, async (req, res) => {
    const wayListYear = req.query.year
    const wayListNumber = req.query.number;
    try {
      const rows = await utils.query('select * from wheels where way_list_number =' + wayListNumber + ' and way_list_year =' + wayListYear);
      await fillWheelsTable(rows);
      await utils.setDateToLocal(rows);
      wheels = await rows;
    } catch(err) {
      res.send({
        msg: err
    });
    } finally {
      res.send({
        msg: wheels
    });
    }
});

module.exports.fillWheelsTable = fillWheelsTable;