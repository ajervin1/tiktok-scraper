import { chromium } from 'playwright'

async function getToken() {
	let cookies = [];
	const browser = await chromium.launch({ headless: true });
	const context = await browser.newContext();

	const page = await context.newPage();
	await page.goto("https://www.tiktok.com/@mads.yo?lang=en");

	// ... Login codes ...

	// Get cookies from the current context


	await page.waitForSelector("#loginContainer")
	cookies = await context.cookies();
	console.log(cookies);

	const msToken = cookies.find(cookie => cookie.name === "msToken").value;
	return msToken
}

async function main() {
	const msToken = await getToken()
	console.log(msToken)
}

main()