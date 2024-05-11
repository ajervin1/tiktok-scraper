import { Sequelize, DataTypes } from 'sequelize'
const db = new Sequelize('tiktokappscraper', 'postgres', 'dunk7onu', {
	host: 'localhost',
	dialect: 'postgres'
});
export default db;