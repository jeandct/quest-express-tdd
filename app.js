// app.js
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const connection = require('./connection');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello World!' });
});

app.post('/bookmarks', (req, res) => {
  const { url, title } = req.body;
  if (!url || !title) {
    res.status(422).json({ error: 'required field(s) missing' });
  } else {
    connection.query(
      'INSERT INTO bookmark(url, title) VALUES(?,?)',
      [url, title],
      (err, result) => {
        if (result) {
          connection.query(
            'SELECT * FROM bookmark WHERE id = ?',
            result.insertId,
            (err, bookmark) => {
              res.status(200).json(bookmark[0]);
            }
          );
        }
      }
    );
  }
});

app.get('/bookmarks/:id', (req, res) => {
  const { id } = req.params;
  connection.query(
    'SELECT * FROM bookmark WHERE id = ?',
    [id],
    (err, results) => {
      if (results.length <= 0) {
        return res.status(404).json({ error: 'Bookmark not found' });
      }

      const { id, ...rest } = results[0];

      res.status(200).json(rest);
    }
  );
});

module.exports = app;
