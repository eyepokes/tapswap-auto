import {generateRandomNumber, loadJSON, sleep} from "./utils";
import {applyBoost, checkLogin, submitTaps} from "./tapswap";

async function tapLoop(token: string, id: number, maxTapsPerSubmit: number) {
    let hasEnergy = true;
    while(hasEnergy) {
        let tapResponse = await submitTaps(token, id, maxTapsPerSubmit);

        if(tapResponse && tapResponse.player.energy < maxTapsPerSubmit) {
            hasEnergy = false;
            console.log("Current energy level", tapResponse.player.energy, "have to stop it");
        }
        await sleep(14);
    }
}

(async () => {

    const maxTouchPoints = 5;

    try {
        // load response from https://api.tapswap.club/api/account/challenge, updates every hour, look at tests/login_ts.js
        let initial = await loadJSON("./initial.json");

        if (!initial) {
            console.log("Update initial.json file");
            return;
        }

        if (checkLogin(initial.player.login_ts)) {
            console.log("Update initial.json file, session expired");
            return;
        }

        const token = initial.access_token;
        const {energy, tap_level, id} = initial.player;
        const [turboBoost] = initial.player.boost.filter((item: any) => item.type === "turbo");
        const [energyBoost] = initial.player.boost.filter((item: any) => item.type === "energy");

        // submit taps method should be executed every 15 seconds according to submit_interval_s
        const maxTapsPerSubmit = generateRandomNumber(maxTouchPoints * 14, maxTouchPoints * 15); // assume that user taps every second

        if(energy < tap_level) {
            console.log("You don't have enough energy for 1 request, you have", energy, ", you need", tap_level * maxTapsPerSubmit);
            return;
        }

        // tap without boost
        await tapLoop(token, id, maxTapsPerSubmit);

        // tap with boost x5 turbo
        // during boost I found that user can submit 2 request with taps
        for(let i = 0; i < turboBoost.cnt; i++) {
            let abResponse = await applyBoost(token, "turbo");
            if(!abResponse) {
                console.log("Cannot apply turbo boost");
                break;
            }
            await sleep(14);
            await submitTaps(token, id, maxTapsPerSubmit);
            await sleep(4);
            await submitTaps(token, id, maxTapsPerSubmit);
            await sleep(2);
        }

        // tap with boost energy
        for(let i = 0; i < energyBoost.cnt; i++) {
            let abResponse = await applyBoost(token, "energy");
            if(!abResponse) {
                console.log("Cannot apply energy boost");
                break;
            }
            await tapLoop(token, id, maxTapsPerSubmit);
        }

        console.log("Finished");
    } catch (e: any) {
        console.log(e);
        console.log("Update token");
    }
})();
