const express = require('express');

const isAuth = require('../middleware/isAuth');

const authRoutes = require('./auth');
const todosRoutes = require('./todos');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/todos', isAuth, todosRoutes);

module.exports = router;