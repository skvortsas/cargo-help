const expect = require('chai').expect
const utils = require('./utils');

describe('dates to local ones', function() {
    it('one date to local', function () {
        const testDate = [{date: new Date(0)}];
        utils.setDateToLocal(testDate);

        expect(testDate[0].date).to.eql(new Date(0).toLocaleDateString());
    });

    it('two dates set to local', function() {
        const testDates = [{date_start: new Date(0), date_end: new Date(1)}];
        utils.setTwoDatesToLocal(testDates);

        expect(testDates[0].date_start).to.eql(new Date(0).toLocaleDateString());
        expect(testDates[0].date_end).to.eql(new Date(1).toLocaleDateString());
    });
});