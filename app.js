const { exec } = require('child_process');
const express = require('express');
const mongoose = require('mongoose');
const mongoDB = require('./config/database/connection');
const environments = require('./config/environments');
const UserRoutes = require('./components/user/userRouter');
const ErrorHandler = require('./middlewares/error-handling/errorHandler');

const port = environments.PORT;
const apiURL = `http://localhost:${port}/api/v1`;
mongoose.Promise = global.Promise;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(mongoDB.connectionsString());

mongoose.connection.on('connected', () => {
  console.log(`Mongoose default connection open to ${mongoDB.connectionsString()}`);
});

mongoose.connection.on('error', (err) => {
  console.log(`Mongoose default connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose default connection disconnected');
});

mongoose.connection.on('open', () => {
  console.log('Mongoose default connection is open');
  exec('mongoimport  -d friends -c users --drop --jsonArray ./data.json', (err, stdout, stderr) => {
    if (err) {
      return console.log('Can not import data into database');
    }
    console.log('Success imported data into database');
  });
});

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});

app.use('/api/v1', UserRoutes);
app.use(ErrorHandler);

app.listen(port);
module.exports = app;
