const express = require('express');
const cors = require('cors');
const mqtt = require('mqtt')
require("dotenv").config({path: "./config.env"});

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

const usersRoute = require('./routes/users')
app.use('/users', usersRoute)

const wordsRoute = require('./routes/words')
app.use('/words', wordsRoute)

const adminsRoute = require('./routes/admins')
app.use('/admins', adminsRoute)

const rankingRoute = require('./routes/ranking')
app.use('/ranking', rankingRoute)

app.listen(port, () => {
    console.log(`Server is running on: ${port} `)
})