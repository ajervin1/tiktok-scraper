import { DataTypes, Op, QueryTypes } from "sequelize";
import {db} from '../database/db.js'
import { getVideoDownloadUrl } from "../requests/helpers.js";
// Define the TikTok Model but in sqlite3
const TikTok = db.define('TikToks',
	{
		tiktokId: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		createtime: {
			type: DataTypes.DATE,
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

	const res = await TikTok.sync();
}


export async function getTikToksByYear(year) {
	const startOfYear = new Date(year, 0, 1);
	const endOfYear = new Date(year, 11, 31, 23, 59, 59);

	const tiktoks = await TikTok.findAll({
		where: {
			createtime: {
				[Op.between]: [startOfYear, endOfYear]
			}
		}
	});
	console.log(tiktoks)
	return tiktoks;
}
export async function getTikToksByMonth(year, month) {
	const startOfMonth = new Date(year, month - 1, 1);
	const endOfMonth = new Date(year, month, 0, 23, 59, 59);
	const tiktoks = await TikTok.findAll({
		where: {
			createtime: {
				[Op.between]: [startOfMonth, endOfMonth]
			}
		}
	});
	return tiktoks;
}

export async function getAllTikToks() {
	const tiktoks = await TikTok.findAll();
	console.log(tiktoks)
	return tiktoks;
}


async function getUserTotalViewsMonthly(username) {
	const sql = `WITH previous_query as (
    SELECT strftime('%Y-%m', createtime) as 'month', *
      FROM tiktoks
      where authorname = "${username}"
)
SELECT month, SUM(playCount) as 'total_plays_monthly'
from previous_query
GROUP BY month
ORDER BY 2 DESC`
	const result = await db.query(sql, { type: QueryTypes.SELECT });
	console.log(result)
	return result;
}
getUserTotalViewsMonthly("avajustin")
function convertUnixTimestamp(timestamp) {
	// Create a new Date object with the Unix timestamp
	const date = new Date(timestamp * 1000);

	// Format the date and time
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');
	const seconds = String(date.getSeconds()).padStart(2, '0');

	// Return the formatted date and time
	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
export async function addItemListToDatabase( itemList ) {
	const newItems = itemList.map(async item => {
		let { id: tiktokId, createTime, desc, author, music, statsV2, video, challenges, stats } = item
		const { collectCount, commentCount, diggCount, playCount, shareCount } = stats
		const { id: authorId, avatarLarger, secUid, signature: authorDescription, uniqueId, nickname } = author;
		const { authorName, coverLarge, duration: songDuration, id: musicId, playUrl, title } = music
		let { repostCount } = statsV2
		repostCount = Number(repostCount)
		createTime = convertUnixTimestamp(createTime);
		const { id: videoId, downloadAddr, dynamicCover, duration: videoDuration } = video
		const videoUrl = await getVideoDownloadUrl(uniqueId, videoId);
		return {
			tiktokId,
			title: desc,
			videourl: videoUrl,
			playcount: playCount,
			authorname: uniqueId,
			createtime: createTime,
			collectcount: collectCount,
			commentcount: commentCount,
			diggcount: diggCount,
			sharecount: shareCount,
			repostcoun: repostCount
		}
	})
	const promiseItems = await Promise.all(newItems)
	await createBulkTikTok(promiseItems);
}

export async function createBulkTikTok( items ) {
	const tiktok = await TikTok.bulkCreate(items, {
		fields: [ 'tiktokId', 'title', 'videourl', 'playcount', 'authorname', 'createtime', 'collectcount', 'commentcount', 'diggcount', 'sharecount', 'repostcount' ],
		ignoreDuplicates: true
	})
}



// Takes Item List and Adds to database
// Bulk adds item to the database, does not add item if already exists



