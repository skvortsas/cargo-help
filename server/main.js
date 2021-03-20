const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');

// Create a new Express app
const app = express();

app.use(bodyParser.json());

// app.use(express.json());

// app.use(bodyParser.urlencoded({ extended: true }));

// Accept cross-origin requests from the frontend app
app.use(cors({ origin: 'http://localhost:29999' }));

module.exports.app = app;