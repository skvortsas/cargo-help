const main = require('../main');
const jwt = require('../jwt');
const utils = require('../utils');

main.app.post('/api/addMain', jwt.checkJwt, async (req, res) => {
    const wayListNumber = req.body.number;
    const wayListYear = req.body.year;
    const { driver, number_of_tractor,
            number_of_installation, date_start,
            date_end, speedometer_start,
            speedometer_end, average_tractor_expenses,
            average_installation_expenses, earned,
            expenses, fuel } = req.body;

    try { 
        await utils.query("INSERT INTO `main_table` (way_list_number, way_list_year, driver,"
                    +" number_of_tractor, number_of_installation, date_start, date_end, " 
                    +"speedometer_start, speedometer_end, average_tractor_expenses, "
                    +" average_installation_expenses, earned, expenses, fuel) VALUES ("+ wayListNumber +", "+ wayListYear +", '"
                    + driver + "', "+ number_of_tractor +", "+ number_of_installation +", '"+ date_start +"', '"
                    + date_end +"', "+ speedometer_start +", "+ speedometer_end +", "+ average_tractor_expenses +", "
                    + average_installation_expenses +", "+ earned +", "+ expenses +", "+ fuel +")");
    } catch(err) {
        res.send({
            msg: err,
            success: false
        })
    } finally {
        res.send({
            msg: 'Строка удачно добавлена',
            success:true
        })
    }
});