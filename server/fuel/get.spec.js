const expect = require('chai').expect
const getFuel = require('./get');

describe('fuel page', function() {
    it('properly fills fuel data', function () {
        const testData = [{by_cash: true, fuel_cost: 1, tractor_filled: 2, installation_filled: 3, filled_indeed: 1}];
        getFuel.fillFuelTable(testData);

        expect(testData[0].by_cash).to.eql('Наличка');
        expect(testData[0].cost_in_all).to.eql('5.00');
        expect(testData[0].result).to.eql('1.00');
    });
});