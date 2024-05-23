import inquirer from 'inquirer';
import { getUserTikToks } from "./requests/getUserTikToks.js";
import { getUserInfo } from "./requests/getTikTokInfo.js";
import { db } from "./database/db.js";

async function askUsername( ) {
	const questions = [
		{
			type: 'input',
			name: 'username',
			message: "Enter tiktok account you want to scrape:",
		},
	];
	const {username} = await inquirer.prompt(questions)
	return username
}
async function main(  ) {
	const username = await askUsername();

	const { userId } = await getUserInfo(username)
	let state = {
		cursor: 0,
		hasMore: true,
		page: 1
	}

	while (state.hasMore === true  ){
		const {hasMore, newCursor} = await getUserTikToks(userId, state.cursor);
		state.cursor = newCursor;
		state.hasMore = hasMore
		state.page += 1
		console.log(`Done with page ${state.page}`)
	}
	await db.close()
	console.log("Done Downloading Data")
}

main()