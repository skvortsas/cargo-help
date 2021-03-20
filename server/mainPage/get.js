const mainData = require('../main');
const utils = require('../utils');
const jwt = require('../jwt');
const { Sequelize } = require('sequelize');
const {gt} = Sequelize.Op;

let main = [];
const sequelize = new Sequelize('3McukbEEix', '3McukbEEix', 'Vsy6jz7O2L', {
    host: 'remotemysql.com',
    dialect: 'mysql'
});

let db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

const MoneyToHold = sequelize.define("truck", {
   way_list_number: {
        type: Sequelize.INTEGER
   },
   way_list_year: {
        type: Sequelize.INTEGER
   },
   hold: {
       type: Sequelize.DOUBLE
   }
}, {
    timestamps: false,
   freezeTableName: true
});

const Parts = sequelize.define("wheels", {
    way_list_number: {
        type: Sequelize.INTEGER
    },
    way_list_year: {
        type: Sequelize.INTEGER
    },
    cost: {
        type: Sequelize.DOUBLE
    }
}, {
    timestamps: false,
   freezeTableName: true
});

const MainTable = sequelize.define("main_table", {
    way_list_number: {
        type: Sequelize.INTEGER
    },
    way_list_year: {
        type: Sequelize.INTEGER
    },
    driver: {
        type: Sequelize.STRING
    },
    number_of_tractor: {
        type: Sequelize.INTEGER
    },
    number_of_installation: {
        type: Sequelize.INTEGER
    },
    date_start: {
        type: Sequelize.DATE
    },
    date_end: {
        type: Sequelize.DATE
    },
    speedometer_start: {
        type: Sequelize.INTEGER
    },
    speedometer_end: {
        type: Sequelize.INTEGER
    },
    earned: {
        type: Sequelize.DOUBLE
    },
    expenses: {
        type: Sequelize.DOUBLE
    },
    fuel: {
        type: Sequelize.DOUBLE
    },
    average_tractor_expenses: {
        type: Sequelize.FLOAT
    },
    average_installation_expenses: {
        type: Sequelize.FLOAT
    }
}, {
    timestamps: false,
   freezeTableName: true
});

// const Truck = sequelize.define("truck", {
//     way_list_number: {
//         type: Sequelize.INTEGER
//     },
//     way_list_year: {
//         type: Sequelize.INTEGER
//     },
//     speedometer_start: {
//         type: Sequelize.INTEGER
//     },
//     speedometer_end: {
//         type: Sequelize.INTEGER
//     },
// }, {
//     timestamps: false,
//    freezeTableName: true
// });

db.sequelize.sync();

// Truck.findAll({attributes: [
//     speedometer_end - speedometer_start
// ]});

const getCarPartsData = async () => {
    try {
        const rows = await utils.query("select way_list_number, way_list_year, sum(cost) as 'parts_cost' from wheels"+ 
                                " group by way_list_number, way_list_year");
        return rows;
    } catch (err) {
        console.log(err);
    }
}

const getWheelsData = async () => {
    return Parts.findAll({attributes: [
        'way_list_number',
        'way_list_year',
        [sequelize.fn('sum', sequelize.col('cost')), 'wheels_cost'],
    ], where: { is_wheel: { [gt]: 0 } }, group: ['way_list_number', 'way_list_year'] });
}

const getEarnedMoneyData = async () => {
    return Parts.findAll({attributes: [
        'way_list_number',
        'way_list_year',
        [sequelize.fn('sum', sequelize.col('cost')), 'wheels_cost'],
    ], group: ['way_list_number', 'way_list_year'] });
}

const fillMainTable = async (data, partsCost, wheelsCost, moneyToHold, earnedMoneyData) => {
    for (let i = 0; i < data.length; i++) {
        partsCost.map((part) => {
            if (part.way_list_number === data[i].way_list_number 
                && part.way_list_year === data[i].way_list_year){
                data[i].car_parts = part.parts_cost;
            }
        });
        wheelsCost.map((part) => {
            if (part.way_list_number === data[i].way_list_number
                && part.way_list_year === data[i].way_list_year){
                data[i].wheels = part.wheels_cost;
            }
        });
        moneyToHold.map((row) => {
            if (row.way_list_number === data[i].way_list_number
                && row.way_list_year === data[i].way_list_year) {
                    data[i].hold = row.hold;
                } else {
                    data[i].hold = 0;
                }
        });
        earnedMoneyData.map((row) => {
            if (row.way_list_number === data[i].way_list_number
                && row.way_list_year === data[i].way_list_year) {
                    data[i].earned_indeed = row.earned_indeed;
                } else {
                    data[i].earned_indeed = data[i].earned;
                }
        });

        if (!data[i].car_parts)
            data[i].car_parts = 0;
        if (!data[i].wheels)
            data[i].wheels = 0;
        data[i].distance = data[i].speedometer_end - data[i].speedometer_start;
        data[i].driver_salary = (data[i].earned * 0.15 - data[i].hold).toFixed(2);
        data[i].income = (data[i].earned_indeed - data[i].driver_salary - data[i].expenses - data[i].car_parts - data[i].fuel).toFixed(2);
    }
};

const getTruckInfomation = async (number, year) => {
    try {
        const rows = await utils.query("SELECT (speedometer_end - speedometer_start) as 'distance', "+
        "ROUND((((select ROUND(sum(tractor_filled), 2) from `fuel` WHERE `way_list_number` = "+ number +" and `way_list_year` = "+ year +") +"+
        "fuel_start - fuel_end)/(speedometer_end - speedometer_start) * 100), 2) as 'average_tractor_expenses', "+
        "ROUND((((select ROUND(sum(installation_filled), 2) from `fuel` WHERE `way_list_number` = "+ number +" and `way_list_year` = "+ year +") +"+
        "instal_fuel_start - instal_fuel_end)/(instal_speedometer_end-instal_speedometer_start)), 2) as 'average_installation_expenses',"+
        "(select SUM(cash) from `expeditions` where `way_list_number` = "+ number +" and `way_list_year` = "+ year +") as 'earned',"+
        "(select ROUND(SUM((SELECT SUM(cost) from `stops` where `way_list_number` = "+ number +" and `way_list_year` = "+ year +") +"+
		"(SELECT SUM(cost) from `expenses` where `way_list_number` = "+ number +" and `way_list_year` = "+ year +") + "+
        "(SELECT SUM(fuel_cost * (tractor_filled + installation_filled)) from `fuel` "+
         "where `by_cash` > 0 and `way_list_number` = "+ number +" and `way_list_year` = "+ year +")), 2)) as 'expenses',"+
         "(SELECT ROUND(SUM(fuel_cost * (tractor_filled + installation_filled)), 2) from `fuel` where `way_list_number` = "+ number +" and `way_list_year` = "+ year +") as 'fuel'"+
        "FROM `truck` WHERE `way_list_number` = "+ number +" and `way_list_year` = "+ year);

        return rows;
    } catch (err) {
        console.log('err',err);
        return err;
    }
}

const compareTables = async data => {
    try {
    for (let i = 0; i < data.length; i++) {
        const tmpData = data[i];
        const truckInformation = await getTruckInfomation(tmpData.way_list_number, tmpData.way_list_year);
        console.log('kek', truckInformation);
        if (truckInformation.length){
        if (tmpData.distance === truckInformation[0].distance
            && tmpData.average_tractor_expenses === truckInformation[0].average_tractor_expenses
            && tmpData.average_installation_expenses === truckInformation[0].average_installation_expenses
            && tmpData.earned === truckInformation[0].earned && tmpData.expenses === truckInformation[0].expenses
            && tmpData.fuel === truckInformation[0].fuel) {
                tmpData.compound = {
                    success: true
                };
            }
        else {
            tmpData.compound = {
                success: false,
                mistakes: {
                    distance: truckInformation[0].distance === tmpData.distance ? 'ok' : truckInformation[0].distance,
                    average_tractor_expenses: truckInformation[0].average_tractor_expenses === tmpData.average_tractor_expenses ? 'ok' : truckInformation[0].average_tractor_expenses,
                    average_installation_expenses: truckInformation[0].average_installation_expenses === tmpData.average_installation_expenses ? 'ok' : truckInformation[0].average_installation_expenses,
                    earned: truckInformation[0].earned === tmpData.earned ? 'ok' : truckInformation[0].earned,
                    expenses: truckInformation[0].expenses === tmpData.expenses ? 'ok' : truckInformation[0].expenses,
                    fuel: truckInformation[0].fuel === tmpData.fuel ? 'ok' : truckInformation[0].fuel,
                } 
            };
        }}
    }
    } catch (err) {
        console.error(err);
    }
}

mainData.app.get('/api/getMain', jwt.checkJwt, async (req, res) => {
    try {
      const rows = await MainTable.findAll({ order: [[ 'id', 'DESC' ]] });
      await utils.setTwoDatesToLocal(rows);
      const partsCost = await getCarPartsData();
      const wheelsCost = await getWheelsData();
      const moneyToHold = await MoneyToHold.findAll();
      const earnedMoneyData = await getEarnedMoneyData();
      await fillMainTable(rows, partsCost, wheelsCost, moneyToHold, earnedMoneyData);
      await compareTables(rows);
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

module.exports.fillMainTable = fillMainTable;
module.exports.compareTables = compareTables;