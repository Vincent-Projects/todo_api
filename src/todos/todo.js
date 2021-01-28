const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TodoSchema = Schema({
    task: {
        type: String,
        required: true,
    },
    complete: {
        type: Boolean,
        required: true,
        default: false
    },
    archived: {
        type: Boolean,
        required: true,
        default: false
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
});

module.exports = mongoose.model("Todo", TodoSchema);