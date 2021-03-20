const main = require('../main');
const utils = require('../utils');
const jwt = require('../jwt');


let popularParts = [];

main.app.get('/api/popularParts', jwt.checkJwt, async (req, res) => {
    try {
        const rows = await utils.query("select part_name, sum(cost) as 'sum' "+
                                    "from wheels "+
                                    "group by part_name "+
                                    "order by sum desc");
        popularParts = await rows;
    } catch(err) {
        console.log(err);
        res.send({
            msg: err
        });
    } finally {
        res.send({
            msg: popularParts
        });
    }
});