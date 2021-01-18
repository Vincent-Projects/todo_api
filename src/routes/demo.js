const express = require("express");

const demoController = require('../controllers/demoController');

const demoRoutes = express.Router();

demoRoutes.get('/todos', demoController.getTodos);

module.exports = demoRoutes;