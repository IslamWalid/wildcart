const cors = require('cors');
const express = require('express');

const app = express();

app.use(cors({
  origin: process.env.ALLOWED_ORIGIN
}));
app.use(express.json());

module.exports = app;
