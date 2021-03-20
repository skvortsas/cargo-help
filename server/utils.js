const util = require('util');
const mysql = require('mysql');

// Connect to db
const connection = mysql.createConnection({
    host: 'remotemysql.com',
    user: '3McukbEEix',
    password: 'Vsy6jz7O2L',
    database: '3McukbEEix'
});

const setTwoDatesToLocal = async data => {
    for (let i = 0; i < data.length; i++) {
        data[i].date_start = new Date(data[i].date_start).toLocaleDateString();
        data[i].date_end = new Date(data[i].date_end).toLocaleDateString();
    }
}

// converting date to local if table has one date
const setDateToLocal = async data => {
    for (let i = 0; i < data.length; i++) {
        data[i].date = new Date(data[i].date).toLocaleDateString();
    }
}

let query = util.promisify(connection.query).bind(connection);

module.exports.connection = connection;
module.exports.setTwoDatesToLocal = setTwoDatesToLocal;
module.exports.query = query;
module.exports.setDateToLocal = setDateToLocal;