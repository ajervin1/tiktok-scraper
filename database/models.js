import { DataTypes } from "sequelize";
import {db} from './connection.js'

// Define the TikTok Model but in sqlite3
// This is the model that will be used to interact with the database


const TikTok = db.define('TikToks',
	{
		tiktokId: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		createtime: {
			type: DataTypes.INTEGER,
		},
		authorname: {
			type: DataTypes.STRING
		},
		title: {
			type: DataTypes.STRING
		},
		videourl: {
			type: DataTypes.TEXT
		},
		playcount: {
			type: DataTypes.INTEGER
		},
		collectcount: {
			type: DataTypes.INTEGER
		},
		commentcount: {
			type: DataTypes.INTEGER
		},
		diggcount: {
			type: DataTypes.INTEGER
		},
		sharecount: {
			type: DataTypes.INTEGER
		},
		repostcount: {
			type: DataTypes.INTEGER
		},
	},

	{
		timestamps: false, // Disable timestamps
		tableName: "tiktoks",

	}
);

async function createTable() {

	const res = await TikTok.sync({});
}


export default TikTok;


// Takes Item List and Adds to database
// Bulk adds item to the database, does not add item if already exists



