/* Get Detailed TikTok Information */
// Get User Info, needed to get a users SECUID
import querystring from "querystring";
import { getVideoDownloadUrl, signRequest, tiktokRequest, signTokRequest } from "./helpers.js";
const msToken = "YkuQ8qGabOtryQ7k8cFpR9supZ_XCgRM2oY0mwT3xBs73yQ8vj74DPmFtX1eF83f-Zq9tTZtG0CvBeiHmjonGRVjYn5zBEQME21ytbSDbgRXpbl5LONHaysuwms9FBYwks3JTeeluaic"

export async function getUserInfo(username = 'avajustin')  {
	// This the final URL you make a request to for the API call, it is ALWAYS this, do not mistaken it for the signed URL
	// Parameters
	const TT_REQ_PERM_URL =
		"https://www.tiktok.com/api/user/detail/?WebIdLastTime=1684959661&abTestVersion=%5Bobject%20Object%5D&aid=1988&appType=m&app_language=en&app_name=tiktok_web&browser_language=en-US&browser_name=Mozilla&browser_online=true&browser_platform=Win32&browser_version=5.0%20%28Windows%20NT%2010.0%3B%20Win64%3B%20x64%29%20AppleWebKit%2F537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome%2F123.0.0.0%20Safari%2F537.36%20Edg%2F123.0.0.0&channel=tiktok_web&cookie_enabled=true&device_id=7236846595559933400&device_platform=web_pc&focus_state=true&from_page=user&history_len=8&is_fullscreen=false&is_page_visible=true&language=en&os=windows&priority_region=RO&referer=https%3A%2F%2Fwww.tiktok.com%2Fbusiness-suite%2Fmessages%3Ffrom%3Dhomepage%26lang%3Den&region=RO&root_referer=https%3A%2F%2Fwww.tiktok.com%2Fbusiness-suite%2Fmessages%3Ffrom%3Dhomepage%26lang%3Den&screen_height=1080&screen_width=1920&secUid=&tz_name=Europe%2FBucharest&uniqueId=&user=%5Bobject%20Object%5D&verifyFp=verify_lv1bd0o8_AA3QC5jZ_70uk_4haw_BYSy_P6oIpsr0LMUE&webcast_language=en&msToken=gGkV_K79_CgoknlGzARe-cvv4ZSaZef9sjd_u6jSxLNHchbi_ZF9hPG_35EoQcHxHDAJkb4dDW9gec1CKXWV3ELFQ6bVUUSQBsj1Vfi_feLstK-6SHMxJMVc-Zvm6xA9AMUG&X-Bogus=DFSzswVue6zANHsMt5bgO74m8icv&_signature=_02B4Z6wo00001Xk8yMwAAIDCifeiRAutXwV5PMxAADhW65";

	const apiUrl = `https://www.tiktok.com/api/user/detail?`
	const PARAMS = {
		msToken,
		device_id: '7236846595559933400',
		uniqueId: username,
		cursor: 0,
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
	const { userInfo} = res.data;
	const {stats, user} = userInfo
	const userObject = {stats, user, userId: user.secUid}
	return userObject
}

// Get Video information along with video url to download
async function getVideoInfo(videoId = "7059427087198719238") {
	// This the final URL you make a request to for the API call, it is ALWAYS this, do not mistaken it for the signed URL
	// Parameters
	const TT_REQ_PERM_URL =
		"https://www.tiktok.com/api/user/detail/?WebIdLastTime=1684959661&abTestVersion=%5Bobject%20Object%5D&aid=1988&appType=m&app_language=en&app_name=tiktok_web&browser_language=en-US&browser_name=Mozilla&browser_online=true&browser_platform=Win32&browser_version=5.0%20%28Windows%20NT%2010.0%3B%20Win64%3B%20x64%29%20AppleWebKit%2F537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome%2F123.0.0.0%20Safari%2F537.36%20Edg%2F123.0.0.0&channel=tiktok_web&cookie_enabled=true&device_id=7236846595559933400&device_platform=web_pc&focus_state=true&from_page=user&history_len=8&is_fullscreen=false&is_page_visible=true&language=en&os=windows&priority_region=RO&referer=https%3A%2F%2Fwww.tiktok.com%2Fbusiness-suite%2Fmessages%3Ffrom%3Dhomepage%26lang%3Den&region=RO&root_referer=https%3A%2F%2Fwww.tiktok.com%2Fbusiness-suite%2Fmessages%3Ffrom%3Dhomepage%26lang%3Den&screen_height=1080&screen_width=1920&secUid=&tz_name=Europe%2FBucharest&uniqueId=&user=%5Bobject%20Object%5D&verifyFp=verify_lv1bd0o8_AA3QC5jZ_70uk_4haw_BYSy_P6oIpsr0LMUE&webcast_language=en&msToken=gGkV_K79_CgoknlGzARe-cvv4ZSaZef9sjd_u6jSxLNHchbi_ZF9hPG_35EoQcHxHDAJkb4dDW9gec1CKXWV3ELFQ6bVUUSQBsj1Vfi_feLstK-6SHMxJMVc-Zvm6xA9AMUG&X-Bogus=DFSzswVue6zANHsMt5bgO74m8icv&_signature=_02B4Z6wo00001Xk8yMwAAIDCifeiRAutXwV5PMxAADhW65";

	const apiUrl = `https://www.tiktok.com/api/item/detail/?itemId=${ videoId }&`
	const PARAMS = {
		device_id: '7236846595559933400',
		itemId: videoId,
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
	const uniqueId = res.data.itemInfo.itemStruct.author.uniqueId
	// Get Video Download Url
	const videoUrl = await getVideoDownloadUrl(uniqueId, videoId);
	return videoUrl
}