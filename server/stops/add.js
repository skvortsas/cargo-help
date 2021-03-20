const main = require('../main');
const utils = require('../utils');
const jwt = require('../jwt');

main.app.post('/api/addStop', jwt.checkJwt, async (req, res) => {
    const wayListNumber = req.body.number;
    const wayListYear = req.body.year;
    const { location, date_start,
            date_end, cost,
            inn, comments } = req.body;

    try { 
        await utils.query("INSERT INTO `stops` (way_list_number, way_list_year, location,"
                    +" date_start, date_end, cost, inn,"
                    +" comments) VALUES ("+ wayListNumber +", "+ wayListYear +", '"
                    + location + "', '"+ date_start +"', '"+ date_end +"', "+ cost +", '"+ inn +"', '"
                    + comments + "')");
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