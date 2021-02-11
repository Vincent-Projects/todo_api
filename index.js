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

server.use(express.static(path.join(__dirname, 'docs', 'src')));
server.use('/docs', (req, res, next) => {
    res.setHeader('Content-Type', 'text/html');
    res.status(statusCodes.OK).sendFile(path.join(__dirname, 'docs', 'src', 'index.html'));
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
