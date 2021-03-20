const main = require('../main');
const utils = require('../utils');
const jwt = require('../jwt');

let driverStatistics = [];

main.app.get('/api/driverStatistics', jwt.checkJwt, async (req, res) => {
    try {
        const rows = await utils.query("SELECT driver, count(driver) as 'count', sum(average_tractor_expenses) as 'average_tractor_expenses', "+
        "sum(fuel) as 'fuel', sum(speedometer_end - speedometer_start) as 'distance' "+
        "FROM `main_table` "+
        "GROUP BY driver");
        driverStatistics = await rows;
    } catch (err) {
        console.log(err);
        res.send({
            msg: err
        });
    } finally {
        res.send({
            msg: driverStatistics
        });
    }
});