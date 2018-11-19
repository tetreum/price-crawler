[![Build Status](https://travis-ci.org/tetreum/price-crawler.svg?branch=master)](https://travis-ci.org/tetreum/price-crawler)

It will try to find the price of the received url by looking for metadata tags or using a custom crawler if available.


# Requirements
- node >= v8

# Setup
- `npm install`

# Usage
- `node index.js`
- Make the request against `http://localhost:18935/price?url=ARTICLE_URL_YOU_WANT_ITS_PRICE`

On success reply will be:
```js
{
  "amount": 499,
  "currency": "EUR",
}
```

On fail:
```js
{
}
```

# Add a custom crawler

If the website you wanna crawl doesn't have SEO metadata (ex: amazon). You can create a custom crawler in `/crawlers/` folder. Before using the generic methods, price-crawler will check if the given url has it's own crawler there.
