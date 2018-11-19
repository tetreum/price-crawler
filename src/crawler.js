const puppeteer = require('puppeteer');

require('perfect-print-js');
require('puppeteer-for-crawling');

let browser,
    closeTimer,
    page = null;

const getPage = async () => {
    if (page === null) {
        if ('TRAVIS' in process.env && 'CI' in process.env) {
            browser = await puppeteer.launch({args: ['--no-sandbox']});
        } else {
            browser = await puppeteer.launch();
        }
        
        page = await browser.newPage();
        
        await page.setRequestInterception(true);

        page.on('request', (request) => {
            if (['image', 'stylesheet', 'font', 'script'].indexOf(request.resourceType()) !== -1) {
                request.abort();
            } else {
                request.continue();
            }
        });        
    }
    closeTimer = resetTimer();
    
    return page;
}

const resetTimer = () => {
    if (typeof closeTimer !== "undefined") {
        clearTimeout(closeTimer);
    }
    return setTimeout(async () => {
        console.log("timer closing chrome");
        await close();
    }, 1000 * 60 * 15);
}

const close = async () => {
    if (typeof browser !== "undefined") {
        await browser.close();
        page = null;
    }
}

const exitHandler = async (options, exitCode) => {
    console.log("exit handler");
    await close();
}

process.on('exit', exitHandler);

//catches ctrl+c event
process.on('SIGINT', exitHandler);
process.on('SIGTERM', exitHandler);

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler);
process.on('SIGUSR2', exitHandler);

//catches uncaught exceptions
process.on('uncaughtException', exitHandler);

module.exports = {
    getPage,
    close
};
