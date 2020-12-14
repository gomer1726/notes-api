const { Sequelize } = require('sequelize');

const dbHost = process.env.DB_HOST;
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

const db = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    dialect: 'mysql'
});

module.exports = db;