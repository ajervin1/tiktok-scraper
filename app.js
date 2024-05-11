import inquirer from 'inquirer';
import { getTikTokByUserId } from "./tiktokrequests/tiktokapi.js";
import { getUserInfo } from "./tiktokrequests/tiktokinfo.js";
import db from "./db/db.js";

async function askUsername( ) {
	const questions = [
		{
			type: 'input',
			name: 'username',
			message: "Give tiktok username you would like to scrape: ",
		},
	];
	const {username} = await inquirer.prompt(questions)
	return username
}
async function main(  ) {
	const username = await askUsername();
	console.log(username)
	const { userId } = await getUserInfo(username)
	let state = {
		cursor: 0,
		hasMore: true,
		page: 1
	}

	console.log("Start Scraper")
	while (state.hasMore === true  ){
		const {hasMore, newCursor} = await getTikTokByUserId(userId, state.cursor);
		state.cursor = newCursor;
		state.hasMore = hasMore
		state.page += 1
		console.log(`Done with page ${state.page}`)
	}
	await db.close()

	console.log("Done Downloading Data")

}
main()