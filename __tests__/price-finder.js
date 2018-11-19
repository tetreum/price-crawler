const priceFinder = require('../src/priceFinder');
const crawler = require('../src/crawler');

jest.setTimeout(30000000)

describe('priceFinder', async () => {
  it("Should return article's price", async () => {
      let tests = [
          {
              url: "https://www.amazon.es/Teclast-F7-Port%C3%A1til-14pulgadas-Pantalla/dp/B07D71VKKT/ref=sr_1_1?ie=UTF8&qid=1542574739&sr=8-1&keywords=teclast+f5",
              result: {
                amount: 319.99,
                currency: "EUR",
              }
          },
          {
              url: "https://www.mediamarkt.es/es/product/_lenovo-portátil-lenovo-ideapad-520s-14ikb-14-intel-core-i7-8550u-ram-8-gb-512-ssd-dorado-1429850.html",
              result: {
                amount: 999,
                currency: "EUR",
              }
          },
          {
              url: "https://www.fnac.es/Portatil-Lenovo-Ideapad-520S-14IKB-Gris-Ordenador-portatil-PC-Portatil/a1436283",
              result: {
                amount: 690,
                currency: "EUR",
              }
          },
          {
              url: "https://www.pccomponentes.com/portatil-xiaomi-mi-air-13-pulgadas",
              result: {
                amount: 899,
                currency: "EUR",
              }
          }
      ], test;

      for (let k in tests) {
          test = tests[k];

          console.log("Testing " + test.url);
          let price = await priceFinder.find(test.url);
          
          expect(price).not.toBe(false);

          expect(price).toEqual(test.result);
      }
      crawler.close();
  });
});

    
    