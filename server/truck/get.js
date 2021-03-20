const main = require('../main');
const utils = require('../utils');
const jwt = require('../jwt');

let truck = [];
let aditionalTruck = {};
let truckExpenses = {};

const sumRecieved = async data => {
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
        sum += data[i].recieved;
    }
    return sum;
}

const sumDelivered = async data => {
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
        sum += data[i].delivered;
    }
    return sum;
}

const getStopsCost = async (number, year) => {
    try {
        const rows = await utils.query('select cost from stops where way_list_number =' + number + ' and way_list_year =' + year);
        const cost = await sumStops(rows);
        return cost;
    } catch (err) {
        console.log(err)
    }
}

const sumStops = async data => {
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
        sum += data[i].cost
    }
    return sum;
}

const getExpensesCost = async (number, year) => {
    try {
        const rows = await utils.query('select cost from expenses where way_list_number =' + number + ' and way_list_year =' + year);
        const cost = sumExpenses(rows);
        return cost;
    } catch (err) {
        console.log(err)
    }
}

const sumExpenses = async data => {
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
        sum += data[i].cost;
    }
    return sum;
}

const getFuelCostByCash = async (number, year) => {
    try {
        const rows = await utils.query('select fuel_cost, tractor_filled, installation_filled'
                                    + ' from fuel where way_list_number =' + number 
                                    + ' and way_list_year =' + year + ' and by_cash > 0');
        const cost = sumFuelByCash(rows);
        return cost;
    } catch (err) {
        console.log(err)
    }
}

const sumFuelByCash = async data => {
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
        sum += data[i].fuel_cost * (data[i].tractor_filled + data[i].installation_filled);
    }
    return sum;
}

const getTruckAditionInformation = async (number, year) => {
    try {
        const rows = await utils.query('select recieved, delivered from money_flow where way_list_number =' + number + ' and way_list_year =' + year);
        const recieved = await sumRecieved(rows);
        const delivered = await sumDelivered(rows);
        aditionalTruck.recieved = recieved;
        aditionalTruck.delivered = delivered;
      } catch(err) {
        console.log(err);
      } finally {
          truck[0].truck_recieved = aditionalTruck.recieved;
          truck[0].truck_delivered = aditionalTruck.delivered;
      }
}

const getTruckExpenses = async (number, year) => {
    try {
        const stops = await getStopsCost(number, year);
        const expenses = await getExpensesCost(number, year);
        const fuelByCash = await getFuelCostByCash(number, year);
        truckExpenses.stops = stops;
        truckExpenses.expenses = expenses;
        truckExpenses.fuelByCash = Number((fuelByCash).toFixed(2));
      } catch(err) {
        console.log(err);
      } finally {
          truck[0].stops = truckExpenses.stops;
          truck[0].truckExpenses = truckExpenses.expenses;
          truck[0].fuelByCash = truckExpenses.fuelByCash;
          truck[0].truck_expenses = (truckExpenses.stops + truckExpenses.expenses + Number(truckExpenses.fuelByCash)).toFixed(2);
      }
}

const fillTruckTable = async data => {
    let localData = data[0];
    localData.traveled_in_all = localData.speedometer_end - localData.speedometer_start;
    localData.fuel_in_all = localData.fuel_start + localData.tractor_full_fuel - localData.fuel_end;
    localData.average_fuel_in_distance = (localData.fuel_in_all/localData.traveled_in_all * 100).toFixed(2);
    localData.instal_traveled_in_all = localData.instal_speedometer_end - localData.instal_speedometer_start;
    localData.instal_fuel_in_all = localData.instal_fuel_start + localData.installation_full_fuel - localData.instal_fuel_end;
    localData.instal_average_fuel_in_distance = (localData.instal_fuel_in_all/(localData.instal_traveled_in_all)).toFixed(2);
}

const sumTractorFuel = async (data) => {
    let sumTractor = 0;
    for (let i = 0; i < data.length; i++) {
        sumTractor += data[i].tractor_filled;
    }
    return sumTractor
}

const sumInstallationFuel = async data => {
    let sumInstallation = 0;
    for (let i = 0; i < data.length; i++) {
        sumInstallation += data[i].installation_filled;
    }
    return sumInstallation;
}

const getAllTruckFuel = async (number, year, data) => {
    try {
        const rows = await utils.query('select tractor_filled, installation_filled from fuel where way_list_number =' + number + ' and way_list_year =' + year);
        const sumTractor = await sumTractorFuel(rows);
        const sumInstallation = await sumInstallationFuel(rows);
        if (data.length) {
            data[0].tractor_full_fuel = sumTractor;
            data[0].installation_full_fuel = sumInstallation;
        }
    } catch (err) {
        console.log(err);
    }
}

main.app.get('/api/getTruck', jwt.checkJwt, async (req, res) => {
    const wayListYear = req.query.year
    const wayListNumber = req.query.number;
    try {
      const rows = await utils.query('select * from truck where way_list_number =' + wayListNumber + ' and way_list_year =' + wayListYear);
      if (rows.length){
        await getAllTruckFuel(wayListNumber, wayListYear, rows);
        await fillTruckTable(rows);
      }
      truck = await rows;
      if (rows.length) {
        await getTruckAditionInformation(wayListNumber, wayListYear);
        await getTruckExpenses(wayListNumber, wayListYear);
      }
    } catch(err) {
      res.send({
        msg: err
    });
    } finally {
        if (truck.length){
            truck[0].truck_result = (truck[0].truck_recieved - truck[0].truck_expenses - truck[0].truck_delivered).toFixed(2);
        }
      res.send({
        msg: truck
    });
    }
});

module.exports.sumRecieved = sumRecieved;
module.exports.sumDelivered = sumDelivered;
module.exports.sumStops = sumStops;
module.exports.getFuelCostByCash = getFuelCostByCash;
module.exports.sumFuelByCash = sumFuelByCash;
module.exports.fillTruckTable = fillTruckTable;
module.exports.sumTractorFuel = sumTractorFuel;
module.exports.sumInstallationFuel = sumInstallationFuel;