const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OperatorSchema = Schema({
    name: {type: String, required: true},
    phone_number: {type: String, required: true},
    available_start: {type: Date, required: false},
    available_end: {type: Date, required: false},
    in_call: {type: Boolean, default: false},
});

module.exports = mongoose.model('Operator', OperatorSchema);