const main = require('../main');
const utils = require('../utils');
const jwt = require('../jwt');


main.app.put('/api/updateWheels', jwt.checkJwt, async (req, res) => {
    const newValue = req.body.value;
    const column = req.body.column;
    const id = req.body.id;

    try {
        await utils.query("update `wheels` set `"+ column +"` = '" + newValue + "' where id =" + id);
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