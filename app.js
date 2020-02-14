require('dotenv').config();
require('./db');

const express = require('express');
const { urlencoded } = require('body-parser');
const VoiceResponse = require('twilio').twiml.VoiceResponse;

const OperatorController = require('./operator/controller');

const app = express();

app.use(urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.post('/webhooks/voice', (req, res) => {
    const response = new VoiceResponse();
    response.say("You Matter, and we're here to make sure you know so.", { voice: "female" });

    OperatorController.get_available_operator(function(err, operator) {
        if(!err && operator) {
            console.log(``> Info: Dialing `${operator.phone_number}`);
            response.dial(operator.phone_number, { action: '/end' });

            res.json(response.toString());

            OperatorController.mark_operator_unavailable(phone_number);
        } else {
            console.log('> Info: Can\'t connect find available operator @ webhooks/voice', err);
            const dial = response.dial(operator.phone_number);
            response.queue({
                url: './queue'
            });
        }
    });

});

app.post('/webhooks/voice/queue', (req, res) => {
    const response = new VoiceResponse();
    response.say("Please wait while we connect you...");

    res.send(response.toString());
});

app.post('/webhooks/voice/end', (req, res) => {
    const { To } = req.body;
});

const port = process.env.PORT || 3000;

app.listen(function() {
    console.log(`> Info: The server has started listening on port ${port}!`);
}, port);