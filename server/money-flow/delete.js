const main = require('../main');
const utils = require('../utils');
const jwt = require('../jwt');

main.app.delete('/api/deleteMoneyFlow', jwt.checkJwt, async (req, res) => {
    const id = req.body.id;
    try {
        await utils.query("delete from money_flow where id=" + id);
    } catch (err) {
        console.log(err);
        res.send({
            msg: err,
            success: false
        });
    } finally {
        res.send({
            msg: 'Строка успешно удалена',
            success: true
        });
    }
});