require('dotenv').config()
const express = require('express');

const { Pool, Client } = require('pg')
const Promise = require('bluebird');
const path = require('path');

const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/bougebeta'
const pool = new Pool({
  connectionString: connectionString
})

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'views')));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/coordinates', async (req, res, next) => {
  try {
    console.log("Fetching coordinates");
    const { rows } = await pool.query('SELECT * FROM PolyLines'); // <=
    res.send(rows);
  } catch (err) {
    next(err);
  }
});

app.post('/coordinates', (req,res) => {
  console.log(JSON.stringify(req.body));
  console.log("Inserting coordinates");
  var stringify_coordinates = JSON.stringify(req.body);
  pool.query('INSERT INTO PolyLines (sahkjdhajksdh) VALUES($1) RETURNING id', [],
  (error, result) => {
      if (error) {
        console.log(error.toString())
        res.status(500).send(`An error occurred while inserting the data.`)
    } else {
        res.status(201).send(`Coordinates added with ID: ${result.rows[0].id}`)
    }
  })
});

app.get('/polygonID', async (req, res, next) => {
  try {
    console.log("Fetching id");
    const { rows } = await pool.query('SELECT id FROM PolyLines ORDER BY ID DESC LIMIT 1'); // <=
    res.send(rows);
  } catch (err) {
    next(err);
  }
});


app.get('*', (req,res) => {
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.listen(port);
