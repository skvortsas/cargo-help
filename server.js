const express = require("express");
const cors = require("cors");
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const mysql = require('mysql');
const util = require('util');
const bodyParser = require('body-parser');

// Create a new Express app
const app = express();

// Connect to db
const connection = mysql.createConnection({
    host: 'remotemysql.com',
    user: 'WaxbmNDvnO',
    password: 'IU3z5iSD8U',
    database: 'WaxbmNDvnO'
});

let query = util.promisify(connection.query).bind(connection);

let moneyFlow = [];
let truck = [];
let aditionalTruck = {};
let truckExpenses = {};
let expeditions = [];
let fuel = [];
let stops = [];
let expenses = [];
let main = [];

// Accept cross-origin requests from the frontend app
app.use(cors({ origin: 'http://localhost:3000' }));

// app.use(express.json());

// app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

// Set up Auth0 configuration
const authConfig = {
  domain: "ourbearr.auth0.com",
  audience: "https://ourbearr.auth0.com/api/v2/"
};

// Define middleware that validates incoming bearer tokens
// using JWKS from ourbearr.auth0.com
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`
  }),

  audience: authConfig.audience,
  issuer: `https://${authConfig.domain}/`,
  algorithm: ["RS256"]
});

// converting date to local if table has one date
const setDateToLocal = async data => {
    for (let i = 0; i < data.length; i++) {
        data[i].date = new Date(data[i].date).toLocaleDateString();
    }
}

const setTwoDatesToLocal = async data => {
    for (let i = 0; i < data.length; i++) {
        data[i].date_start = new Date(data[i].date_start).toLocaleDateString();
        data[i].date_end = new Date(data[i].date_end).toLocaleDateString();
    }
}

//way-list/truck
//GET
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
        const rows = await query('select cost from stops where way_list_number =' + number + ' and way_list_year =' + year);
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
        const rows = await query('select cost from expenses where way_list_number =' + number + ' and way_list_year =' + year);
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
        const rows = await query('select fuel_cost, tractor_filled, installation_filled'
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
        const rows = await query('select recieved, delivered from money_flow where way_list_number =' + number + ' and way_list_year =' + year);
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
          truck[0].truck_expenses = (truckExpenses.stops + truckExpenses.expenses + Number(truckExpenses.fuelByCash));
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
        const rows = await query('select tractor_filled, installation_filled from fuel where way_list_number =' + number + ' and way_list_year =' + year);
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

app.get('/api/getTruck', checkJwt, async (req, res) => {
    const wayListYear = req.query.year
    const wayListNumber = req.query.number;
    try {
      const rows = await query('select * from truck where way_list_number =' + wayListNumber + ' and way_list_year =' + wayListYear);
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
            truck[0].truck_result = truck[0].truck_recieved - truck[0].truck_expenses - truck[0].truck_delivered;//not full formula
        }
      res.send({
        msg: truck
    });
    }
});
//UPDATE
app.put('/api/updateTruck', checkJwt, async (req, res) => {
    const wayListYear = req.body.year
    const wayListNumber = req.body.number;
    const newValue = req.body.value;
    const column = req.body.column;

    try {
        await query("update `truck` set `"+ column +"` = '" + newValue + "' where way_list_number = "
                       + wayListNumber +" and way_list_year = " + wayListYear);
    } catch(err) {
        console.log(err);
        return res.send({
            msg: err.errno,
            success: false
        })
    } finally {
        return res.send({
            msg: 'Успешно обновлено',
            success: true
        })
    }
});
//POST
app.post('/api/addTruck', checkJwt, async (req, res) => {
    const wayListNumber = req.body.number;
    const wayListYear = req.body.year;
    const { speedometerStart, speedometerEnd,
            fuelStart, fuelEnd,
            instalSpeedometerStart, instalSpeedometerEnd,
            instalFuelStart, instalFuelEnd } = req.body;

    try { 
        await query("INSERT INTO `truck` (way_list_number, way_list_year, speedometer_start,"
                    +" speedometer_end, fuel_start, fuel_end, instal_speedometer_start,"
                    +" instal_speedometer_end, instal_fuel_start, instal_fuel_end) VALUES ("+ wayListNumber +", "+ wayListYear +", "
                    + speedometerStart + ", "+ speedometerEnd +", "+ fuelStart +", "+ fuelEnd +", "+ instalSpeedometerStart +", "
                    + instalSpeedometerEnd + ", "+ instalFuelStart +", "+ instalFuelEnd +")");
    } catch(err) {
        res.send({
            msg: err,
            success: false
        })
    } finally {
        res.send({
            msg: 'Таблица удачно добавлена',
            success:true
        })
    }
});

//way-list/expeditions
app.get('/api/getExpeditions', checkJwt, async (req, res) => {
    const wayListYear = req.query.year
    const wayListNumber = req.query.number;
    try {
      const rows = await query('select * from expeditions where way_list_number =' + wayListNumber + ' and way_list_year =' + wayListYear);
      await setDateToLocal(rows);
      expeditions = await rows;
    } catch(err) {
      res.send({
        msg: err
    });
    } finally {
      res.send({
        msg: expeditions
    });
    }
});
//UPDATE
app.put('/api/updateExpeditions', checkJwt, async (req, res) => {
    const newValue = req.body.value;
    const column = req.body.column;
    const id = req.body.id;

    try {
        await query("update `expeditions` set `"+ column +"` = '" + newValue + "' where id =" + id);
    } catch(err) {
        console.log(err);
        return res.send({
            msg: err.errno,
            success: false
        })
    } finally {
        return res.send({
            msg: 'Успешно обновлено',
            success: true
        })
    }
});
//POST
app.post('/api/addExpedition', checkJwt, async (req, res) => {
    const wayListNumber = req.body.number;
    const wayListYear = req.body.year;
    const { expedition, date,
            cargo, cash} = req.body;

    try { 
        await query("INSERT INTO `expeditions` (way_list_number, way_list_year, expedition,"
                    +" date, cargo, cash) VALUES ("+ wayListNumber +", "+ wayListYear +", '"
                    + expedition + "', '"+ date +"', '"+ cargo +"', "+ cash +")");
    } catch(err) {
        res.send({
            msg: err.errno,
            success: false
        })
    } finally {
        res.send({
            msg: 'Таблица удачно добавлена',
            success:true
        })
    }
});

//way-list/fuel
const fillFuelTable = async data => {
    for (let i = 0; i < data.length; i++) {
        data[i].by_cash = data[i].by_cash ? 'Наличка' : 'Безнал';
        data[i].cost_in_all = (data[i].fuel_cost * (data[i].tractor_filled + data[i].installation_filled)).toFixed(2);
        data[i].result = (data[i].tractor_filled - data[i].filled_indeed).toFixed(2);
    }
}

app.get('/api/getFuel', checkJwt, async (req, res) => {
    const wayListYear = req.query.year
    const wayListNumber = req.query.number;
    try {
      const rows = await query('select * from fuel where way_list_number =' + wayListNumber + ' and way_list_year =' + wayListYear);
      await setDateToLocal(rows);
      await fillFuelTable(rows);
      fuel = await rows;
    } catch(err) {
      res.send({
        msg: err
    });
    } finally {
      res.send({
        msg: fuel
    });
    }
});
//UPDATE
app.put('/api/updateFuel', checkJwt, async (req, res) => {
    const newValue = req.body.value;
    const column = req.body.column;
    const id = req.body.id;

    try {
        await query("update `fuel` set `"+ column +"` = '" + newValue + "' where id =" + id);
    } catch(err) {
        console.log(err);
        return res.send({
            msg: err.errno,
            success: false
        })
    } finally {
        return res.send({
            msg: 'Успешно обновлено',
            success: true
        })
    }
});
//POST
app.post('/api/addFuel', checkJwt, async (req, res) => {
    const wayListNumber = req.body.number;
    const wayListYear = req.body.year;
    const { by_cash, location,
            date, fuel_cost,
            tractor_filled, installation_filled,
            filled_indeed} = req.body;

    try { 
        await query("INSERT INTO `fuel` (way_list_number, way_list_year, by_cash,"
                    +" location, date, fuel_cost, tractor_filled, installation_filled, filled_indeed) "
                    + "VALUES ("+ wayListNumber +", "+ wayListYear +", "+ by_cash +", '"
                    + location + "', '"+ date +"', "+ fuel_cost +", "+ tractor_filled +", "+ installation_filled +", "
                    + filled_indeed +")");
    } catch(err) {
        res.send({
            msg: err.errno,
            success: false
        })
    } finally {
        res.send({
            msg: 'Таблица удачно добавлена',
            success:true
        })
    }
});

//way-list/stops
const fillStopsTable = async data => {
    for (let i = 0; i < data.length; i++) {
        let date_start = new Date(data[i].date_start);
        let date_end = new Date(data[i].date_end);
        let difference = date_end - date_start;
        let differenceDays = Math.ceil(difference/(1000 * 60 * 60 * 24));
        data[i].day_amount = differenceDays;
    }
}

app.get('/api/getStops', checkJwt, async (req, res) => {
    const wayListYear = req.query.year
    const wayListNumber = req.query.number;
    try {
      const rows = await query('select * from stops where way_list_number =' + wayListNumber + ' and way_list_year =' + wayListYear);
      await fillStopsTable(rows);
      await setTwoDatesToLocal(rows);
      stops = await rows;
    } catch(err) {
      res.send({
        msg: err
    });
    } finally {
      res.send({
        msg: stops
    });
    }
});
//UPDATE
app.put('/api/updateStops', checkJwt, async (req, res) => {
    const newValue = req.body.value;
    const column = req.body.column;
    const id = req.body.id;

    try {
        await query("update `stops` set `"+ column +"` = '" + newValue + "' where id =" + id);
    } catch(err) {
        console.log(err);
        return res.send({
            msg: err.errno,
            success: false
        })
    } finally {
        return res.send({
            msg: 'Успешно обновлено',
            success: true
        })
    }
});
//POST
app.post('/api/addStop', checkJwt, async (req, res) => {
    const wayListNumber = req.body.number;
    const wayListYear = req.body.year;
    const { location, date_start,
            date_end, cost,
            inn, comments } = req.body;

    try { 
        await query("INSERT INTO `stops` (way_list_number, way_list_year, location,"
                    +" date_start, date_end, cost, inn,"
                    +" comments) VALUES ("+ wayListNumber +", "+ wayListYear +", '"
                    + location + "', '"+ date_start +"', '"+ date_end +"', "+ cost +", '"+ inn +"', '"
                    + comments + "')");
    } catch(err) {
        res.send({
            msg: err,
            success: false
        })
    } finally {
        res.send({
            msg: 'Таблица удачно добавлена',
            success:true
        })
    }
});

//way-list/expenses
app.get('/api/getExpenses', checkJwt, async (req, res) => {
    const wayListYear = req.query.year
    const wayListNumber = req.query.number;
    try {
      const rows = await query('select * from expenses where way_list_number =' + wayListNumber + ' and way_list_year =' + wayListYear);
      await setDateToLocal(rows);
      expenses = await rows;
    } catch(err) {
      res.send({
        msg: err
    });
    } finally {
      res.send({
        msg: expenses
    });
    }
});
//UPDATE
app.put('/api/updateExpenses', checkJwt, async (req, res) => {
    const newValue = req.body.value;
    const column = req.body.column;
    const id = req.body.id;

    try {
        await query("update `expenses` set `"+ column +"` = '" + newValue + "' where id =" + id);
    } catch(err) {
        console.log(err);
        return res.send({
            msg: err.errno,
            success: false
        })
    } finally {
        return res.send({
            msg: 'Успешно обновлено',
            success: true
        })
    }
});
//POST
app.post('/api/addExpense', checkJwt, async (req, res) => {
    const wayListNumber = req.body.number;
    const wayListYear = req.body.year;
    const { location, date,
            cost, expenses,
            comments } = req.body;

    try { 
        await query("INSERT INTO `expenses` (way_list_number, way_list_year, location,"
                    +" date, cost, expenses, comments) VALUES ("+ wayListNumber +", "+ wayListYear +", '"
                    + location + "', '"+ date +"', "+ cost +", '"+ expenses +"', '"+ comments +"')");
    } catch(err) {
        res.send({
            msg: err,
            success: false
        })
    } finally {
        res.send({
            msg: 'Таблица удачно добавлена',
            success:true
        })
    }
});

//way-list/money-flow
app.get('/api/getMoneyFlow', checkJwt, async (req, res) => {
    const wayListYear = req.query.year
    const wayListNumber = req.query.number;
    try {
      const rows = await query('select * from money_flow where way_list_number =' + wayListNumber + ' and way_list_year =' + wayListYear);
      await setDateToLocal(rows);
      moneyFlow = await rows;
    } catch(err) {
      res.send({
        msg: err
    });
    } finally {
      res.send({
        msg: moneyFlow
    });
    }
});
//UPDATE
app.put('/api/updateMoneyFlow', checkJwt, async (req, res) => {
    const newValue = req.body.value;
    const column = req.body.column;
    const id = req.body.id;

    try {
        await query("update `money_flow` set `"+ column +"` = '" + newValue + "' where id =" + id);
    } catch(err) {
        console.log(err);
        return res.send({
            msg: err.errno,
            success: false
        })
    } finally {
        return res.send({
            msg: 'Успешно обновлено',
            success: true
        })
    }
});
//POST
app.post('/api/addMoneyFlow', checkJwt, async (req, res) => {
    const wayListNumber = req.body.number;
    const wayListYear = req.body.year;
    const { date, recieved,
            delivered, comments } = req.body;

    try { 
        await query("INSERT INTO `money_flow` (way_list_number, way_list_year, date,"
                    +" recieved, delivered, comments) VALUES ("+ wayListNumber +", "+ wayListYear +", '"
                    + date + "', "+ recieved +", "+ delivered +", '"+ comments +"')");
    } catch(err) {
        res.send({
            msg: err,
            success: false
        })
    } finally {
        res.send({
            msg: 'Таблица удачно добавлена',
            success:true
        })
    }
});

//main
const fillMainTable = async data => {
    for (let i = 0; i < data.length; i++) {
        data[i].distance = data[i].speedometer_end - data[i].speedometer_start;
        data[i].driver_salary = data[i].earned * 0.15;
        data[i].income = data[i].earned - data[i].driver_salary - data[i].expenses - data[i].fuel;//not full formula
    }
}

app.get('/api/getMain', checkJwt, async (req, res) => {
    try {
      const rows = await query('select * from main_table');
      await setTwoDatesToLocal(rows);
      await fillMainTable(rows);
      main = await rows;
    } catch(err) {
      res.send({
        msg: err
    });
    } finally {
      res.send({
        msg: main
    });
    }
});

//UPDATE
app.put('/api/updateMain', checkJwt, async (req, res) => {
    const newValue = req.body.value;
    const column = req.body.column;
    const id = req.body.id;

    try {
        await query("update `main_table` set `"+ column +"` = '" + newValue + "' where id =" + id);
    } catch(err) {
        console.log(err);
        return res.send({
            msg: err.errno,
            success: false
        })
    } finally {
        return res.send({
            msg: 'Успешно обновлено',
            success: true
        })
    }
});
//POST
app.post('/api/addMain', checkJwt, async (req, res) => {
    const wayListNumber = req.body.number;
    const wayListYear = req.body.year;
    const { driver, number_of_tractor,
            number_of_installation, date_start,
            date_end, speedometer_start,
            speedometer_end, average_tractor_expenses,
            average_installation_expenses, earned,
            expenses, fuel } = req.body;

    try { 
        await query("INSERT INTO `main_table` (way_list_number, way_list_year, driver,"
                    +" number_of_tractor, number_of_installation, date_start, date_end, " 
                    +"speedometer_start, speedometer_end, average_tractor_expenses, "
                    +" average_installation_expenses, earned, expenses, fuel) VALUES ("+ wayListNumber +", "+ wayListYear +", '"
                    + driver + "', "+ number_of_tractor +", "+ number_of_installation +", '"+ date_start +"', '"
                    + date_end +"', "+ speedometer_start +", "+ speedometer_end +", "+ average_tractor_expenses +", "
                    + average_installation_expenses +", "+ earned +", "+ expenses +", "+ fuel +")");
    } catch(err) {
        res.send({
            msg: err,
            success: false
        })
    } finally {
        res.send({
            msg: 'Таблица удачно добавлена',
            success:true
        })
    }
});

// Start the app
app.listen(3001, () => console.log('API listening on 3001'));

app.on('close', () => {
    connection.end();
});