const main = require('../main');
const utils = require('../utils');
const jwt = require('../jwt');

main.app.put('/api/updateTruck', jwt.checkJwt, async (req, res) => {
    const wayListYear = req.body.year
    const wayListNumber = req.body.number;
    const newValue = req.body.value;
    const column = req.body.column;

    try {
        await utils.query("update `truck` set `"+ column +"` = '" + newValue + "' where way_list_number = "
                       + wayListNumber +" and way_list_year = " + wayListYear);
    } catch(err) {
        console.log(err);
        return res.send({
            msg: err.errno,
            success: false
        })
    } finally {
        return res.send({
            msg: 'Успешно обновлено',
            success: true
        })
    }
});