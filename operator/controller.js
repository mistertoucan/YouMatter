const Operator = require('./model');
const twilio = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

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

lib.mark_operator_unavailable = function(phone_number) {
    Operator.updateOne({ phone_number: phone_number, in_call: false });
}

lib.mark_operator_available = function(phone_number) {
    Operator.updateOne({ phone_number: phone_number, in_call: true });
}

lib.send_sms = function(operator, phone_number) {
    twilio.messages.create({
        from: process.env.TWILIO_PHONE_NUMBER,
        to: operator.phone_number,
        body: `YouMatter: ${phone_number} is calling you for help. Could you take a few minutes to make them feel better?`
    });
};

lib.get_dail_to = function(dial_sid, cb) {
    twilio.calls(dial_sid).fetch().then(cb);
};

// Tests

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

lib.create_test_data();

module.exports = lib;