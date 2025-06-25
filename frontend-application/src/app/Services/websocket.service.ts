import { Injectable } from '@angular/core';
import {WebSocketSubject, webSocket} from 'rxjs/webSocket';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket$: WebSocketSubject<any> | undefined;

  constructor() {
    // Initialize the WebSocket connection
    this.connect();
  }

connect() {
  if (!this.socket$ || this.socket$.closed) {
    this.socket$ = webSocket({
      url: 'ws://192.168.0.31:8765',
      openObserver: {
        next: () => console.log('WebSocket connected')
      },
      closeObserver: {
        next: () => console.log('WebSocket closed')
      }
    });
  }
}

  sendMessage(message: any) {
    this.socket$?.next(message);
  }

  getMessage(): Observable<any> {
    return this.socket$!.asObservable();
  }

  closeConnection() {
    this.socket$?.complete();
  }
}