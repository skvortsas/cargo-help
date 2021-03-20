const main = require('./main');
const utils = require('./utils');
require('./mainPage/mainPage');
require('./truck/truckPage');
require('./expeditions/expeditionsPage');
require('./fuel/fuelPage');
require('./stops/stopsPage');
require('./expenses/expensesPage');
require('./money-flow/moneyFlowPage');
require('./wheels/wheelsPage');
require('./statistics/statisticsPage');

// Start the app
main.app.listen(3001, () => console.log('API listening on 3001'));

main.app.on('close', () => {
    utils.connection.end();
});