require('dotenv').config();
require('./db');

const express = require('express');
const { urlencoded } = require('body-parser');

const VoiceResponse = require('twilio').twiml.VoiceResponse;

const OperatorController = require('./operator/controller');

const app = express();

app.use(urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.use((req, res, next) => {
    res.type('text/xml');
    next();
});

app.post('/webhooks/voice', (req, res) => {
    const { From } = ctx.body;
    const response = new VoiceResponse();
    response.say("You Matter! And we're here to make sure you know so.", { voice: "female" });

    OperatorController.get_available_operator(function(err, operator) {
        if(!err && operator) {
            console.log(`> Info: Dialing ${operator.phone_number}`);
            response.say(`You are being redirect to talk to ${operator.name.split(' ')[0]}.`);
            response.dial(operator.phone_number, { action: '/end' });
            res.send(response.toString());

            OperatorController.send_sms(operator, From);
            OperatorController.mark_operator_unavailable(operator.phone_number);
        } else {
            console.log('> Info: Can\'t connect find available operator @ webhooks/voice', err);
            const dial = response.dial(operator.phone_number);
            dial.queue({
                url: './queue'
            });

            res.send(response.toString());
        }
    });

});

app.post('/webhooks/voice/queue', (req, res) => {
    const response = new VoiceResponse();
    response.say("Please wait while we connect you...");

    res.send(response.toString());
});

app.post('/webhooks/voice/end', (req, res) => {
    const { DialSid } = res.status;

    OperatorController.get_dail_to(DialSid, function(call) {
        const { to } = call;

        OperatorController.mark_operator_available(to);
        ctx.status = 200;
    });
});

app.post("*", (req, res) => {
    console.log("REQUEST RECEIVED");
    console.log(req, res);
});

const port = process.env.PORT || 3000;

app.listen(port, function() {
    console.log(`> Info: The server has started listening on port ${port}!`);
});