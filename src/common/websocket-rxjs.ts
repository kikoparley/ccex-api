// RxJs wrapper for websocket
import { Observable, ReplaySubject } from 'rxjs';
import { take, filter } from 'rxjs/operators';
import * as WebSocket from '../lib/isomorphic-ws';

export class WebSocketRxJs<T = any> {
  private readonly webSocket: WebSocket;
  private readonly data$ = new ReplaySubject<T>(1);
  private readonly opened$ = new ReplaySubject<boolean>(1);

  /**
   * message stream
   */
  get message$(): Observable<T> {
    return this.data$.asObservable();
  }

  constructor(url: string) {
    this.webSocket = new WebSocket(url);
    this.webSocket.onopen = () => {
      this.opened$.next(true);
    };
    this.webSocket.onclose = () => {
      this.opened$.next(false);
    };
    this.webSocket.onerror = () => {
      this.opened$.next(false);
    };
    this.webSocket.onmessage = (e: any) => {
      try {
        const data = JSON.parse(<string>e.data);
        this.data$.next(data);
      } catch (error) {
        console.error(error);
      }
    };
  }

  /**
   * @param text
   */
  send(text: string): void {
    // wait until socket open and send the text only once per call
    this.opened$
      .pipe(
        take(1),
        filter((opened) => opened),
      )
      .subscribe(() => {
        this.webSocket.send(text);
      });
  }

  close(): void {
    this.webSocket.close();
    this.data$.complete();
  }
}
