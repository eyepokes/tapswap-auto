import {request} from "./utils";

const headers = {
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.5",
    "cache-control": "no-cache",
    "content-type": "application/json",
    "pragma": "no-cache",
    "priority": "u=1, i",
    "sec-ch-ua-mobile": "?1",
    "sec-ch-ua-platform": "\"android\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "x-app": "tapswap_server",
    "x-cv": "651", //build version //TonWalletButton this.log.info("[AppContext] buildNum: 651"),
    "x-touch": "1",
    "Referer": "https://app.tapswap.club/",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "User-Agent": "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.6533.64 Mobile Safari/537.36"
}

export async function submitTaps(token: string, playerId: number, taps: number) {
    const timestamp = Date.now();
    return await request("POST", "https://api.tapswap.club/api/player/submit_taps", {
        ...headers,
        "authorization": `Bearer ${token}`,
        "cache-id": makeRandomString(8),
        "content-id": hs(playerId, timestamp).toString(),
    }, false, JSON.stringify({taps, "time": timestamp}) );
}

export async function applyBoost(token: string, type: "turbo" | "energy") {
    return await request("POST", "https://api.tapswap.club/api/player/apply_boost", {
        ...headers,
        "authorization": `Bearer ${token}`,
        "cache-id": makeRandomString(8),
    }, false, JSON.stringify({type}) );
}


export function checkLogin(loginTs: number): boolean {
    let now = Date.now();
    let e = 3600;
    let n = 300;
    return loginTs + e * 1e3 - now <= n * 1e3;
}

export function hs(e: number, n: number): number {
    return e * n % e
}

export function makeRandomString($: number, R="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"): string {
    let W = "";
    const V = R.length;
    for (let Y = 0; Y < $; Y++)
        W += R.charAt(Math.floor(Math.random() * V));
    return W
}
