const getPrice = async (url, page) => {
    /* alternative method
    let price = await page.q('#price_inside_buybox').text();
    price = price.trim().split(' ');
    
    return {
        price: price[1],
        currency: price[0],
    };*/
    
    let $el = await page.$('#cerberus-data-metrics');
    
    return {
        amount: await $el.attr("data-asin-price"),
        currency: await $el.attr("data-asin-currency-code"),
    };
};

module.exports = {
    urlContains: "www.amazon.",
    getPrice
}