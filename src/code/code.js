const mongoose = require('mongoose');

const CodeSchema = new mongoose.Schema({
    code: {
        type: Number,
        required: true,
        unique: true
    }
});

module.exports = mongoose.model('Code', CodeSchema);