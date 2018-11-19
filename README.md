It will try to find the price of the received url.


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
