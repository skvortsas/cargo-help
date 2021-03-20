const main = require('../main');
const utils = require('../utils');
const jwt = require('../jwt');

main.app.delete('/api/deleteExpedition', jwt.checkJwt, async (req, res) => {
    const id = req.body.id;
    try {
        await utils.query("delete from expeditions where id=" + id);
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