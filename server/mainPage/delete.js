const main = require('../main');
const jwt = require('../jwt');
const utils = require('../utils');

main.app.delete('/api/deleteMain', jwt.checkJwt, async (req, res) => {
    const id = req.body.id;
    try {
        await utils.query("delete from main_table where id=" + id);
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