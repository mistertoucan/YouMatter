const mongoose = require('mongoose');

mongoose.promise = global.Promise;

mongoose.connect(process.env.MONGODB_CONNECTION_URI, {useNewUrlParser: true})
.then(() => {
    console.log('> Connected to MongoDB Database!')
}, (err) => {
    console.log('> Error: Could not connect to MongoDB Database!');
    console.log('> Exiting...');
    process.exit(1);
})