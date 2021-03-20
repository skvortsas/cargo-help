const main = require('../main');
const utils = require('../utils');
const jwt = require('../jwt');


main.app.post('/api/addWheels', jwt.checkJwt, async (req, res) => {
    const wayListNumber = req.body.number;
    const wayListYear = req.body.year;
    const { date, part_name,
            amount, cost,
            to_tractor, is_wheel,
            comments } = req.body;

    try { 
        await utils.query("INSERT INTO `wheels` (way_list_number, way_list_year, date,"
                    +" part_name, amount, cost, to_tractor, is_wheel, comments) VALUES ("+ wayListNumber +", "+ wayListYear +", '"
                    + date + "', '"+ part_name +"', "+ amount +", "+ cost +", "+ to_tractor +", "+ is_wheel +", '"+ comments +"')");
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