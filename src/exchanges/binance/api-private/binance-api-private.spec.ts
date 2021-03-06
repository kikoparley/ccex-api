 /* tslint:disable-next-line */
const apiKeys = require('./api-key-test');
import { BinanceApiPrivate } from './binance-api-private';
import { BinanceApiPrivateSigned } from './binance-api-private-signed';
import { checkBinanceAccountInformation } from './internal/functions-test';

const binanceApiPrivateSigned = new BinanceApiPrivateSigned(apiKeys.key, apiKeys.secret);
const binanceApiPrivate = new BinanceApiPrivate(apiKeys.key);

describe('Test binance api private functions', () => {
  it('Should fetch account information', (done) => {
    binanceApiPrivateSigned.getAccountInformation().subscribe((accountInfo) => {
      checkBinanceAccountInformation(accountInfo);
      done();
    });
  });

  it('Should fetch user data stream listen key', (done) => {
    binanceApiPrivate.getUserStreamListenKey$().subscribe((listenKey) => {
      expect(listenKey);
      done();
    });
  });
});
