const { Sequelize } = require('sequelize');


// Always create a sql server authenticate method for creating your user crendentials and password. Use the same to establish a connection.
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PWD, {
  dialect: 'mssql',
  host: 'localhost'
});



module.exports = sequelize;