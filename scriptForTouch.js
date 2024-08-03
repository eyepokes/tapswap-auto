if(location.hostname === "app.tapswap.club") {
    const ua = () => {
        const androidVersions = ['10', '11', '12', '13', '14'];
        const deviceModels = ['SM-A205U', 'SM-A102U', 'SM-G960U', 'SM-N960U', 'LM-Q720', 'LM-X420', 'LM-Q710(FGN)'];
        const chromeVersions = ['120', '121', '122', '123', '124', '125', '126', '127'];

        const randomAndroidVersion = androidVersions[Math.floor(Math.random() * androidVersions.length)];
        const randomDeviceModel = deviceModels[Math.floor(Math.random() * deviceModels.length)];
        const randomChromeVersion = chromeVersions[Math.floor(Math.random() * chromeVersions.length)];
        const randomChromeBuild = Math.floor(Math.random() * 10000);

        return `Mozilla/5.0 (Linux; Android ${randomAndroidVersion}${randomDeviceModel}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${randomChromeVersion}.0.${randomChromeBuild}.64 Mobile Safari/537.36`;
    };

    Object.defineProperty(navigator, 'maxTouchPoints', {
        get: function() { return 5; }
    });

    Object.defineProperty(navigator, 'userAgent', {
        get: function() { return ua(); }
    });
}
