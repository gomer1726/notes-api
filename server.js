require('dotenv').config();
const express = require('express');
const db = require('./config/db');
const app = express();

// Connect to DB
db.authenticate()
    .then(() => {
        console.log("Connected to DB");
    }).catch(e => {
    console.log("Failed connect to DB", e);
});


// Init middleware
app.use(express.json({ extended: false }));

// Routes
app.use('/api/notes', require('./routes/notes'));
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

module.exports = app;