import TikTok  from './models.js';
import { getVideoDownloadUrl } from "../requests/helpers.js";
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

/* Add Data To Database From TikTok */
export async function createTikTok( tiktokId, title, videoUrl, playCount, authorName, createTime ) {
	const tiktok = await TikTok.findOrCreate({
		where: {tiktokId:tiktokId},

		defaults: {
			tiktokId,
			title,
			videoUrl,
			playCount,
			authorName,
			createTime
		}
	});

}
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