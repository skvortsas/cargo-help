const main = require('../main');
const utils = require('../utils');
const jwt = require('../jwt');

main.app.post('/api/addMoneyFlow', jwt.checkJwt, async (req, res) => {
    const wayListNumber = req.body.number;
    const wayListYear = req.body.year;
    const { date, recieved,
            delivered, comments } = req.body;

    try { 
        await utils.query("INSERT INTO `money_flow` (way_list_number, way_list_year, date,"
                    +" recieved, delivered, comments) VALUES ("+ wayListNumber +", "+ wayListYear +", '"
                    + date + "', "+ recieved +", "+ delivered +", '"+ comments +"')");
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