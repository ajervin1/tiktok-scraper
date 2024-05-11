/* TikTok Requests */
// Get TikToks By Music ID
import querystring from "querystring";
import { signRequest, tiktokRequest, signTokRequest } from "./helpers.js";
import { addItemListToDatabase } from "../db/models.js";
import { getUserInfo } from "./tiktokinfo.js";


const msToken = "YkuQ8qGabOtryQ7k8cFpR9supZ_XCgRM2oY0mwT3xBs73yQ8vj74DPmFtX1eF83f-Zq9tTZtG0CvBeiHmjonGRVjYn5zBEQME21ytbSDbgRXpbl5LONHaysuwms9FBYwks3JTeeluaic"
/* Control Count Here */
const COUNT = 30
// Get TikToks by User Id
export async function getTikTokByUserId(userId = "MS4wLjABAAAAQ09e6Ck9CQrQQYAPLehEKMlvVS8XzmGcbNHTGXsXIZSIj7Pe21eYtDq0nzKy6-5V", cursor = 0) {
	// This the final URL you make a request to for the API call, it is ALWAYS this, do not mistaken it for the signed URL
	// Parameters
	const TT_REQ_PERM_URL = "https://www.tiktok.com/api/post/item_list/?WebIdLastTime=1684959661&aid=1988&app_language=en&app_name=tiktok_web&browser_language=en-US&browser_name=Mozilla&browser_online=true&browser_platform=Win32&browser_version=5.0%20%28Windows%20NT%2010.0%3B%20Win64%3B%20x64%29%20AppleWebKit%2F537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome%2F123.0.0.0%20Safari%2F537.36%20Edg%2F123.0.0.0&channel=tiktok_web&cookie_enabled=true&count=35&coverFormat=2&cursor=0&device_id=7236846595559933467&device_platform=web_pc&focus_state=true&from_page=user&history_len=8&is_fullscreen=false&is_page_visible=true&language=en&os=windows&priority_region=RO&referer=https%3A%2F%2Fwww.tiktok.com%2Fbusiness-suite%2Fmessages%3Ffrom%3Dhomepage%26lang%3Den&region=RO&root_referer=https%3A%2F%2Fwww.tiktok.com%2Fbusiness-suite%2Fmessages%3Ffrom%3Dhomepage%26lang%3Den&screen_height=1080&screen_width=1920&secUid=MS4wLjABAAAATdiadghBG5ZZqRrY93j0-jyzqPW_toWf5ir6b9aeB64HebodSB1scEXNpC020bPq&tz_name=Europe%2FBucharest&verifyFp=verify_lv1bd0o8_AA3QC5jZ_70uk_4haw_BYSy_P6oIpsr0LMUE&webcast_language=en&msToken=riqlJPr42AMSGAwHu9g9z5PhCqn3Hzp-CjRpNH8XqPTcwNCehHnQqvP5BAgx7HwkuQfAcVxbttMfK3fGHZvUXYB__GZK7iWaYaItDzaDJxeVock0JIurABWe1b5T30PY61UM&X-Bogus=DFSzswVurstANHsMt5bgOw4m8iGH&_signature=_02B4Z6wo00001tPwkyAAAIDBIzv5q2eTgMbT8JeAANLu81";
	const apiUrl = `https://www.tiktok.com/api/post/item_list/?`
	const PARAMS = {
		msToken,
		count: COUNT,
		device_id: '7165118680723998211',
		secUid: userId,
		cursor: cursor,
	};
	// Parse the URL
	const parsedUrl = new URL(TT_REQ_PERM_URL);
	// Extract the query parameters
	const parsedQuery = querystring.parse(parsedUrl.search.slice(1));
	// Merge parsedQuery with PARAMS
	const mergedParams = { ...parsedQuery, ...PARAMS };
	// Sign Request
	const { signature, navigator } = await signTokRequest(apiUrl, TT_REQ_PERM_URL, mergedParams)
	const { "x-tt-params": xTtParams, signed_url } = signature;
	const { user_agent: userAgent } = navigator;
	// Scrape TikTok Data
	const res = await tiktokRequest({ userAgent, xTtParams, signed_url });
	const { data } = res;

	await addItemListToDatabase(data.itemList)
	return {newCursor: data.cursor, hasMore: data.hasMore}

}
async function main(  ) {
	const { userId } = await getUserInfo("katbritoo")
	let state = {
		cursor: 0,
		hasMore: true
	}
	await getTikTokByUserId(userId);
	// while ( state.hasMore  === true){
	// 	const {newCursor, hasMore}  = await getTikTokByUserId(userId, state.cursor)
	// 	state.cursor = newCursor;
	// 	state.hasMore = hasMore;
	// }
	console.log("Done Downloading Data")

}



// Get Trending TikToks
export async function getTrendingTikToks() {
	// This the final URL you make a request to for the API call, it is ALWAYS this, do not mistaken it for the signed URL
	// Parameters
	const TT_REQ_PERM_URL = "https://www.tiktok.com/api/post/item_list/?WebIdLastTime=1684959661&aid=1988&app_language=en&app_name=tiktok_web&browser_language=en-US&browser_name=Mozilla&browser_online=true&browser_platform=Win32&browser_version=5.0%20%28Windows%20NT%2010.0%3B%20Win64%3B%20x64%29%20AppleWebKit%2F537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome%2F123.0.0.0%20Safari%2F537.36%20Edg%2F123.0.0.0&channel=tiktok_web&cookie_enabled=true&count=35&coverFormat=2&cursor=0&device_id=7236846595559933467&device_platform=web_pc&focus_state=true&from_page=user&history_len=8&is_fullscreen=false&is_page_visible=true&language=en&os=windows&priority_region=RO&referer=https%3A%2F%2Fwww.tiktok.com%2Fbusiness-suite%2Fmessages%3Ffrom%3Dhomepage%26lang%3Den&region=RO&root_referer=https%3A%2F%2Fwww.tiktok.com%2Fbusiness-suite%2Fmessages%3Ffrom%3Dhomepage%26lang%3Den&screen_height=1080&screen_width=1920&secUid=MS4wLjABAAAATdiadghBG5ZZqRrY93j0-jyzqPW_toWf5ir6b9aeB64HebodSB1scEXNpC020bPq&tz_name=Europe%2FBucharest&verifyFp=verify_lv1bd0o8_AA3QC5jZ_70uk_4haw_BYSy_P6oIpsr0LMUE&webcast_language=en&msToken=riqlJPr42AMSGAwHu9g9z5PhCqn3Hzp-CjRpNH8XqPTcwNCehHnQqvP5BAgx7HwkuQfAcVxbttMfK3fGHZvUXYB__GZK7iWaYaItDzaDJxeVock0JIurABWe1b5T30PY61UM&X-Bogus=DFSzswVurstANHsMt5bgOw4m8iGH&_signature=_02B4Z6wo00001tPwkyAAAIDBIzv5q2eTgMbT8JeAANLu81";
	const apiUrl = `https://us.tiktok.com/api/recommend/item_list/?`
	const PARAMS = {
		msToken,
		count: 2,
		device_id: '7165118680723998211',
		cursor: 0,
	};
	// Parse the URL
	const parsedUrl = new URL(TT_REQ_PERM_URL);
	// Extract the query parameters
	const parsedQuery = querystring.parse(parsedUrl.search.slice(1));

	// Merge parsedQuery with PARAMS
	const mergedParams = { ...parsedQuery, ...PARAMS };
	// Sign Request
	const { signature, navigator } = await signRequest(apiUrl, TT_REQ_PERM_URL, mergedParams)
	const { "x-tt-params": xTtParams, signed_url } = signature;
	const { user_agent: userAgent } = navigator;
	// Scrape TikTok Data
	const res = await tiktokRequest({ userAgent, xTtParams, signed_url });
	const { data } = res;
	await addItemListToDatabase(data.itemList)
}
