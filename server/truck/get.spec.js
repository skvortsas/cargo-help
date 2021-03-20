const expect = require('chai').expect
const getTruck = require('./get');

describe('truck page', function() {
    it('properly returns recieved sum', async function () {
        const testData = [{recieved: 1},{recieved: 2},{recieved: 3}];
        const result = await getTruck.sumRecieved(testData);

        expect(result).to.eql(6);
    });

    it('properly returns delivered sum', async function() {
        const testData = [{delivered: 1},{delivered: 2},{delivered: 3}];
        const result = await getTruck.sumDelivered(testData);

        expect(result).to.eql(6);
    });

    it('properly returns stops cost sum', async function() {
        const testData = [{cost: 1},{cost: 2},{cost: 3}];
        const result = await getTruck.sumStops(testData);

        expect(result).to.eql(6);
    });

    it('properly returns sum of all fuel by cash', async function() {
        const testData = [{fuel_cost: 1, tractor_filled: 2, installation_filled: 3},
            {fuel_cost: 2, tractor_filled: 1, installation_filled: 3},
            {fuel_cost: 3, tractor_filled: 2, installation_filled: 1}];
        const result = await getTruck.sumFuelByCash(testData);

        expect(result).to.eql(22);
    });

    it('properly fills truck table', async function() {
        const testData = [{speedometer_end: 2, speedometer_start: 1, fuel_start: 3, fuel_end: 1, tractor_full_fuel: 2,
            instal_speedometer_end: 4, instal_speedometer_start: 2, instal_fuel_start: 4, installation_full_fuel: 2, instal_fuel_end: 2}];
        await getTruck.fillTruckTable(testData);

        expect(testData[0].average_fuel_in_distance).to.eql('400.00');
        expect(testData[0].instal_average_fuel_in_distance).to.eql('2.00');
    });

    it("properly returns sum trucktor's fuel", async function() {
        const testData = [{tractor_filled: 2}, {tractor_filled: 1}, {tractor_filled: 2}];
        const result = await getTruck.sumTractorFuel(testData);

        expect(result).to.eql(5);
    });

    it("properly returns sum installation fuel", async function() {
        const testData = [{installation_filled: 2}, {installation_filled: 1}, {installation_filled: 2}];
        const result = await getTruck.sumInstallationFuel(testData);

        expect(result).to.eql(5);
    });
});