const expect = require('chai').expect
const getWheels = require('./get');

describe('wheels page', function() {
    it('properly fills wheels data', function () {
        const testData = [{to_tractor: false, is_wheel: true, by_cash: false}, {to_tractor: true, is_wheel: false, by_cash: true}];
        getWheels.fillWheelsTable(testData);

        expect(testData[0].to_tractor).to.eql('Реф');
        expect(testData[0].is_wheel).to.eql('Колёса');
        expect(testData[0].by_cash).to.eql('Безнал');
        expect(testData[1].to_tractor).to.eql('Тягач');
        expect(testData[1].is_wheel).to.eql('Не колёса');
        expect(testData[1].by_cash).to.eql('Наличка');
    });
});