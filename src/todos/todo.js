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
    archived: { // to delete ( deprecated )
        type: Boolean,
        required: false,
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    projectId: { // __week || __month || __year means that the tasks is a goal
        type: String,
        required: false,
        default: null
    },
    tagColor: {
        type: Number,
        required: false,
        default: null
    },
    startedRecuringTime: {
        type: Date,
        required: false,
        default: null
    },
    recuringTime: {
        type: Number, // represent the number of days this is used for custom habits habits
        required: false,
        default: null
    },
    recuringDate: { // for yearly habits habits
        type: Date,
        required: false,
        default: null
    },
    recuringDay: { // For monthly habits the number represent the date
        type: Number,
        required: false,
        default: null
    },
    recuringWeekDay: { // for weekly habits
        type: String,
        required: false,
        default: null
    },
    dueDate: {
        type: Date,
        required: false,
        default: null
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    lastUpdate: {
        type: Date,
        required: true,
        default: Date.now
    }
});

module.exports = mongoose.model('Todo', TodoSchema);