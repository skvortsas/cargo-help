const main = require('../main');
const utils = require('../utils');
const jwt = require('../jwt');

let tractorParts = [];

main.app.get('/api/tractorParts', jwt.checkJwt, async (req, res) => {
    try {
        const rows = await utils.query("select main_table.number_of_tractor, sum(wheels.cost * wheels.amount) as 'sum' " +
                                "from main_table "+
                                "join wheels on main_table.way_list_number = wheels.way_list_number "+
                                "and main_table.way_list_year = wheels.way_list_year "+
                                "where wheels.to_tractor > 0 "+
                                "group by main_table.number_of_tractor "+
                                "order by sum desc");
        tractorParts = await rows;
    } catch(err) {
        console.log(err);
        res.send({
            msg: tractorParts
        });
    } finally {
        res.send({
            msg: tractorParts
        });
    }
});