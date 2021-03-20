const main = require('../main');
const utils = require('../utils');
const jwt = require('../jwt');

main.app.post('/api/addExpedition', jwt.checkJwt, async (req, res) => {
    const wayListNumber = req.body.number;
    const wayListYear = req.body.year;
    const { expedition, date,
            cargo, cash} = req.body;

    try { 
        await utils.query("INSERT INTO `expeditions` (way_list_number, way_list_year, expedition,"
                    +" date, cargo, cash) VALUES ("+ wayListNumber +", "+ wayListYear +", '"
                    + expedition + "', '"+ date +"', '"+ cargo +"', "+ cash +")");
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