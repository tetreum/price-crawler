const http = require('http');
const Url = require('url');

const priceFinder = require('./src/priceFinder');
const port = 18935;

process
  .on('unhandledRejection', (reason, p) => {
    console.error(p);
    process.exit(1);
  })
  .on('uncaughtException', err => {
    console.error(err, 'Uncaught Exception thrown');
    process.exit(1);
  });

const server = http.createServer(async (req, res) => {
    console.log("Received " + req.url);

    let parsedUrl = Url.parse(req.url, true);
    parsedUrl.pathname = parsedUrl.pathname.substr(1);

    switch (parsedUrl.pathname) {
        case "price":
            let price;
            
            try {
                price = await priceFinder.find(parsedUrl.query.url);
            } catch (e) {
                console.log("Error trying to parse " + parsedUrl.query.url + " : " + e.message);
                return res.end(JSON.stringify({}));
            }
            
            if (price) {
                return res.end(JSON.stringify(price));
            }
            res.end(JSON.stringify({}));
            break;
        default:
            res.end('Invalid request path: ' + parsedUrl.pathname);
            break;
    }
});

server.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`price-finder is listening on ${port}`)
})