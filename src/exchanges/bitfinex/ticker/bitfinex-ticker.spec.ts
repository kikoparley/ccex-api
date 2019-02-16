import { take } from 'rxjs/operators';

import { checkTicker } from '../../exchange-test.functions';
import { BitfinexTicker } from './bitfinex-ticker';
import { BitfinexWebsocket } from '../websocket';
import { MOCK_SOCKET } from './test-helpers';

const bitfinexWebsocket = new BitfinexWebsocket(MOCK_SOCKET as any);
const bitfinexTicker = new BitfinexTicker('', bitfinexWebsocket);

const pair = 'btc_usd';

describe('bitfinexTicker', () => {
  jest.setTimeout(30000);

  it(`should fetch ticker ${pair}`, (done) => {
    bitfinexTicker.fetchTicker$(pair).subscribe(
      (ticker) => {
        checkTicker(ticker);
      },
      () => {
        /* error */
      },
      () => {
        done();
      },
    );
  });

  it(`should get ticker realtime ${pair}`, (done) => {
    bitfinexTicker
      .ticker$(pair)
      .pipe(take(2))
      .subscribe(
        (ticker) => {
          checkTicker(ticker);
        },
        (e) => console.log('Error'),
        () => {
          bitfinexTicker.stopTicker(pair);
          bitfinexWebsocket.destroy();
          done();
        },
      );
  });
});
