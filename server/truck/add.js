const main = require('../main');
const utils = require('../utils');
const jwt = require('../jwt');

main.app.post('/api/addTruck', jwt.checkJwt, async (req, res) => {
    const wayListNumber = req.body.number;
    const wayListYear = req.body.year;
    const { speedometerStart, speedometerEnd,
            fuelStart, fuelEnd,
            instalSpeedometerStart, instalSpeedometerEnd,
            instalFuelStart, instalFuelEnd } = req.body;

    try { 
        await utils.query("INSERT INTO `truck` (way_list_number, way_list_year, speedometer_start,"
                    +" speedometer_end, fuel_start, fuel_end, instal_speedometer_start,"
                    +" instal_speedometer_end, instal_fuel_start, instal_fuel_end) VALUES ("+ wayListNumber +", "+ wayListYear +", "
                    + speedometerStart + ", "+ speedometerEnd +", "+ fuelStart +", "+ fuelEnd +", "+ instalSpeedometerStart +", "
                    + instalSpeedometerEnd + ", "+ instalFuelStart +", "+ instalFuelEnd +")");
    } catch(err) {
        res.send({
            msg: err,
            success: false
        })
    } finally {
        res.send({
            msg: 'Таблица удачно добавлена',
            success:true
        })
    }
});