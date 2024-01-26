// app.js
const express = require('express');
const cors = require('cors');
const SseChannel = require('sse-channel');
require("dotenv").config({ path: "./config.env" });

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

const usersRoute = require('./routes/users');
app.use('/users', usersRoute);

const wordsRoute = require('./routes/words');
app.use('/words', wordsRoute);

const adminsRoute = require('./routes/admins');
app.use('/admins', adminsRoute);

const rankingRoute = require('./routes/ranking');
app.use('/ranking', rankingRoute);

const adChannel = new SseChannel();

app.get('/events/advertisement', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  adChannel.addClient(req, res);

  req.on('close', () => {
    adChannel.removeClient(req, res);
  });
});


const ads = require('./reklamy.json').advertising;

setInterval(() => {
    const randomIndex = Math.floor(Math.random() * ads.length);
    const randomAd = ads[randomIndex];
    adChannel.send(JSON.stringify(randomAd));
}, 10000);

app.listen(port, () => {
  console.log(`Server is running on: ${port}`);
});
