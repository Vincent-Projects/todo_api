const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { statusCodes } = require('./src/constants');

if (process.env.NODE_ENV === 'development')
    require('dotenv').config({ path: path.join(__dirname, 'config', 'config.env') });

const apiRoutes = require('./src/routes');

const server = express();

server.use(cors());
server.use(express.json());
server.use(apiRoutes);

server.use('/docs', (req, res, next) => {
    const message = '<h1>The documentation of the TodoList REST API is in progress</h1>' +
        '<p>You can see the <a href="https://github.com/Vincent-Projects/todo_api">github repo</a> if you want more informations. You can also DM me as well to know more about this API.</p>';
    res.send(message);
});

server.use(async (err, req, res, next) => {
    return res.status(statusCodes.SERVER_ERROR).json({
        message: 'Server Side Problem',
        data: {
            err: err.message,
            url: err.url
        }
    });
});



const PORT = process.env.PORT || '8080';
const MONGO_URI = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@cluster0.xekax.mongodb.net/${process.env.MONGODB_NAME}`;
const MONGO_OPTIONS = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

mongoose.connect(MONGO_URI, MONGO_OPTIONS, (err) => {
    if (!err) {
        server.listen(PORT);
    } else {
        console.log(err);
    }
});
