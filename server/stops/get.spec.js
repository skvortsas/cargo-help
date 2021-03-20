const expect = require('chai').expect
const getStops = require('./get');

describe('stops page', function() {
    it('properly fills stops data', function () {
        const testData = [{date_start: new Date(0), date_end: new Date(1000 * 60 * 60 * 24)}];
        getStops.fillStopsTable(testData);

        expect(testData[0].day_amount).to.eql(1);
    });
});