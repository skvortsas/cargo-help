const main = require('../main');
const jwt = require('../jwt');
const utils = require('../utils');

main.app.put('/api/updateMain', jwt.checkJwt, async (req, res) => {
    console.log(req.body);
    const newValue = req.body.value;
    const column = req.body.column;
    const id = req.body.id;

    try {
        if (column === 'speedometer_end') {
            await utils.query("update `main_table` set `"+ column +"` = '" + newValue + "', `speedometer_start` = 0 where id =" + id);
        } else {
            await utils.query("update `main_table` set `"+ column +"` = '" + newValue + "' where id =" + id);
        }
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