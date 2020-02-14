const Operator = require('./model');

const lib = {};

lib.get_operator = function(phone_number, cb) {
    Operator.findOne({ phone_number }, cb);
}

lib.get_available_operator = function(cb) {
    Operator.findOne({ in_call: false }, cb);
} 

lib.update_operator = function(phone_number, body, cb) {
    Operator.updateOne({ phone_number }, body, cb);
}

lib.create_operator = function(phone_number, name, cb) {
    Operator.create({ phone_number, name }, cb);
}

lib.mark_operator_unavailable = function(operator_id) {
    Operator.updateOne({ _id: operator_id, in_call: false });
}

lib.mark_operator_available = function(operator_id) {
    Operator.updateOne({ _id: operator_id, in_call: true });
}

lib.create_test_data = function() {
    lib.get_operator("2019235253", (err, exists) => {
        if(!err && exists)
            return;

        lib.create_operator("2019235253", "Anthony", (err, data) => {
            console.log(err, data);
            console.log('> Info: Created Operator Anthony');
        });
    });
}

module.exports = lib;