const main = require('../main');
const utils = require('../utils');
const jwt = require('../jwt');

let stops = [];

const fillStopsTable = async data => {
    for (let i = 0; i < data.length; i++) {
        let date_start = new Date(data[i].date_start);
        let date_end = new Date(data[i].date_end);
        let difference = date_end - date_start;
        let differenceDays = Math.ceil(difference/(1000 * 60 * 60 * 24));
        data[i].day_amount = differenceDays;
    }
}

main.app.get('/api/getStops', jwt.checkJwt, async (req, res) => {
    const wayListYear = req.query.year
    const wayListNumber = req.query.number;
    try {
      const rows = await utils.query('select * from stops where way_list_number =' + wayListNumber + ' and way_list_year =' + wayListYear);
      await fillStopsTable(rows);
      await utils.setTwoDatesToLocal(rows);
      stops = await rows;
    } catch(err) {
      res.send({
        msg: err
    });
    } finally {
      res.send({
        msg: stops
    });
    }
});

module.exports.fillStopsTable = fillStopsTable;