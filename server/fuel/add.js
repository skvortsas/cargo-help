const main = require('../main');
const utils = require('../utils');
const jwt = require('../jwt');

main.app.post('/api/addFuel', jwt.checkJwt, async (req, res) => {
    const wayListNumber = req.body.number;
    const wayListYear = req.body.year;
    const { by_cash, location,
            date, fuel_cost,
            tractor_filled, installation_filled,
            filled_indeed} = req.body;

    try { 
        await utils.query("INSERT INTO `fuel` (way_list_number, way_list_year, by_cash,"
                    +" location, date, fuel_cost, tractor_filled, installation_filled, filled_indeed) "
                    + "VALUES ("+ wayListNumber +", "+ wayListYear +", "+ by_cash +", '"
                    + location + "', '"+ date +"', "+ fuel_cost +", "+ tractor_filled +", "+ installation_filled +", "
                    + filled_indeed +")");
    } catch(err) {
        res.send({
            msg: err.errno,
            success: false
        })
    } finally {
        res.send({
            msg: 'Таблица удачно добавлена',
            success:true
        })
    }
});