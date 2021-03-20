const main = require('../main');
const utils = require('../utils');
const jwt = require('../jwt');

main.app.post('/api/addExpense', jwt.checkJwt, async (req, res) => {
    const wayListNumber = req.body.number;
    const wayListYear = req.body.year;
    const { location, date,
            cost, expenses,
            comments } = req.body;

    try { 
        await utils.query("INSERT INTO `expenses` (way_list_number, way_list_year, location,"
                    +" date, cost, expenses, comments) VALUES ("+ wayListNumber +", "+ wayListYear +", '"
                    + location + "', '"+ date +"', "+ cost +", '"+ expenses +"', '"+ comments +"')");
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