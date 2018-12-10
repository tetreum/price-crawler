
const fs = require('fs');
const Url = require('url');

const crawler = require('./crawler');

const selectors = {
 '[itemprop="price"]' : async (page, $item) => {
    let amount = await $item.attr('content');
     
    if (amount === null || amount.length < 1) {
      amount = await $item.text();
    }
    return {
        "amount" : amount,
        "currency" : await page.q('[itemprop="priceCurrency"]').attr('content'),
    };
},
'[itemprop="lowPrice"]' : async (page, $item) => {
    return {
        "amount" : await $item.attr('content'),
        "currency" : await page.q('[itemprop="priceCurrency"]').attr('content'),
    };
},
'[type="application/ld+json"]' : async (page, $item) => {
    let json = (await $item.text()).trim();
    json = JSON.parse(json);

    if (typeof json.offers === "undefined" || typeof json.offers.price === "undefined" || typeof json.offers.priceCurrency === "undefined") {
        return false;
    }

    return {
        "amount" : json.offers.price,
        "currency" : json.offers.priceCurrency,
    }
}
};

let customCrawlers = null;

const getCustomCrawler = async (url, page) => {
    
    let crawlersFolder = __dirname + "/../crawlers/";
    
    if (customCrawlers === null) {
        customCrawlers = [];
        let items = fs.readdirSync(crawlersFolder);

        for (var i=0; i<items.length; i++) {
            customCrawlers.push(require(crawlersFolder + items[i]));
        }
    }
    
    let crawler;
    
    for (var i = 0; i < customCrawlers.length; i++) {
        crawler = customCrawlers[i];
        
        if (typeof crawler.urlContains !== -1 && url.indexOf(crawler.urlContains) !== -1) {
            return await crawler.getPrice(url, page);
        }
    }
    return false;
}

const processOutput = (price) => {
    price.amount = parseFloat(price.amount);
    
    return price;
}

const find = async (url) => {
    let price,
        page = await crawler.getPage();
    
    await page.goto(url);
    
    //await page.screenshot({path: '/tmp/price.png'});
    
    price = await getCustomCrawler(url, page);
    
    if (price) {
        p("has custom crawler");
        price = processOutput(price);
        return price;
    }

    for(let selector in selectors) {
      if (await page.exists(selector)) {
          p("has " + selector);

          price = await selectors[selector](page, await page.$(selector));
          if (price) {
              price = processOutput(price);
              return price;
          }
      }
    }
    
    return false;
}


module.exports = {
    find
};
