/* Helper Functions */
// Create Function that signRequest and returns navigator and signature
import Signer from "tiktok-signature"
import SignTok from "signtok"
import axios from "axios"
import TikChan from "tikchan"

export async function signRequest( apiUrl, tiktokUserAgent, params ) {
	const signer = new Signer(null, tiktokUserAgent);
	await signer.init();
	const qsObject = new URLSearchParams(params);
	const qs = qsObject.toString();
	const unsignedUrl = `${ apiUrl }${ qs }`;
	const signature = await signer.sign(unsignedUrl);
	const navigator = await signer.navigator();
	await signer.close();
	return { signature, navigator }
}
// This function is synchronous and faster
export async function signTokRequest( apiUrl, tiktokUserAgent, params ) {
	const signer = new SignTok(tiktokUserAgent);
	const qsObject = new URLSearchParams(params);
	const qs = qsObject.toString();
	const unsignedUrl = `${ apiUrl }${ qs }`;
	const signature = signer.sign(unsignedUrl)
	const navigator = signer.navigator();
	return { signature, navigator }
}
export async function tiktokRequest( { userAgent, xTtParams, signed_url } ) {
	const options = {
		headers: {
			"user-agent": userAgent,
			"x-tt-params": xTtParams,
		},
	};
	return axios.get(signed_url, options)
}
export async function getVideoDownloadUrl( uniqueId, videoId ) {
	const video = await TikChan.download(`https://www.tiktok.com/@${uniqueId}/video/${videoId}`);

	return video.no_wm
}
