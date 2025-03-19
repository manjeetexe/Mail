const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const cors = require('cors');
const cron = require("node-cron");
const connectToDB = require('./Database/DB');
const cookieParser = require('cookie-parser');
const sendMailRoute = require('./Routes/SendmailRoute');
const anlysisRoute = require('./Routes/Anlysis.route')

const { checkAndSendEmails } = require("./Controllers/Sendmail.controller");







// connectToDB();
app.use(cors()); 

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());


// Define a simple route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

cron.schedule("* * * * *", () => {
  console.log("Checking scheduled emails...");
  checkAndSendEmails();
});

app.use('/sendmail', sendMailRoute  );
app.use('/api', anlysisRoute );

module.exports = app;