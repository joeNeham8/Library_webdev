const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
const url = 'mongodb://localhost:27017';
const dbName = 'libraryDB';
let db;

MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to Database');
        db = client.db(dbName);
    })
    .catch(error => console.error(error));

// API endpoint to handle form submission
app.post('/addBook', (req, res) => {
    const { bookName, author, type } = req.body;
    const book = { name: bookName, author, type };

    // Insert the book into the 'books' collection
    db.collection('books').insertOne(book)
        .then(result => {
            console.log('Book saved:', result);
            res.send({ message: 'Book saved to MongoDB!' });
        })
        .catch(error => {
            console.error(error);
            res.status(500).send({ error: 'Error saving book' });
        });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
