const express = require("express");

const isAuth = require("../middleware/isAuth");

const demoRoutes = require("./demo");
const authRoutes = require("./auth");
const todosRoutes = require("./todos");

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/demo', demoRoutes);
router.use('/todos', isAuth, todosRoutes);

module.exports = router;