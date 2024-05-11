import  { DataTypes } from "sequelize";
import db from './db.js'
import { getVideoDownloadUrl } from "../tiktokrequests/helpers.js";

const TikTok = db.define('TikToks',
	{
		tiktokId : {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		authorName: {
			type: DataTypes.STRING
		},
		title: {
			type: DataTypes.STRING
		},
		videoUrl: {
			type: DataTypes.TEXT
		},
		playCount: {
			type: DataTypes.INTEGER
		}
		},

	{
		timestamps: false, // Disable timestamps
		tableName: "tiktoks",
		schema: "public"
	}
);
async function createTable(  ) {
	const res = await TikTok.sync({});
	console.log(res)
}

/* Add Data To Database From TikTok */
export async function createTikTok( tiktokId, title, videoUrl, playCount, authorName ) {
	const tiktok = await TikTok.findOrCreate({
		where: {tiktokId:tiktokId},

		defaults: {
			tiktokId,
			title,
			videoUrl,
			playCount,
			authorName
		}
	});
	console.log(tiktok)
}
export async function createBulkTikTok( items ) {
	const tiktok = await TikTok.bulkCreate(items, {
		fields: ['tiktokId', 'title', 'videoUrl', 'playCount', 'authorName'],
		ignoreDuplicates: true
	})
}


// Takes Item List and Adds to database
export async function addItemListToDatabase( itemList ) {
	const newItems = itemList.map(async item => {
		const {id : tiktokId, createTime, desc, author, music, statsV2, video, challenges} = item
		const {id : authorId, avatarLarger, secUid, signature : authorDescription, uniqueId, nickname} = author;
		const {authorName, coverLarge, duration : songDuration, id : musicId, playUrl, title} = music
		const { collectCount, commentCount, diggCount, playCount, repostCount, shareCount } = statsV2
		const {id: videoId, downloadAddr, dynamicCover, duration: videoDuration} = video
		const videoUrl = await getVideoDownloadUrl(uniqueId, videoId);
		return {tiktokId, title: desc, videoUrl, playCount, authorName: uniqueId}
	})
	const promiseItems = await Promise.all(newItems)
	await createBulkTikTok(promiseItems);

}

function downloadItems(  ) {
		// for (const item of itemList){
	// 	const {id : tiktokId, createTime, desc, author, music, statsV2, video, challenges} = item
	// 	const {id : authorId, avatarLarger, secUid, signature : authorDescription, uniqueId, nickname} = author;
	// 	const {authorName, coverLarge, duration : songDuration, id : musicId, playUrl, title} = music
	// 	const { collectCount, commentCount, diggCount, playCount, repostCount, shareCount } = statsV2
	// 	const {id: videoId, downloadAddr, dynamicCover, duration: videoDuration} = video
	// 	const videoUrl = await getVideoDownloadUrl(uniqueId, videoId);
	// 	await createTikTok(tiktokId, desc, videoUrl, playCount, uniqueId)
	// }
}
