import {Injectable} from '@angular/core';
import {WebSocketSubject} from 'rxjs/webSocket';
import {forkJoin, map, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private wsUrl = `ws://localhost:5000?token=${localStorage.getItem('jwt')}`;
  private socket$: WebSocketSubject<any>;

  constructor(private http: HttpClient) {
    this.socket$ = new WebSocketSubject(this.wsUrl);
  }
  getCoachName(id: string): Observable<any> {
    return this.http.get(`http://localhost:3000/api/users/${id}`);
  }

  getUsers(currentUserId: string): Observable<any> {
    return new Observable((observer) => {
      this.socket$.subscribe((data) => {
        if (data?.type === 'messages' && Array.isArray(data.data)) {
          const filteredItems = data.data
            .map((item: any) => {
              return item.users.find((u: any) => u !== currentUserId);
            })
            .filter((id: string | undefined) => id !== undefined);

          const requests = filteredItems.map((id: string) =>
            this.getCoachName(id).pipe(
              map((response) => ({
                id,
                name: response.data.name,
              }))
            )
          );

          forkJoin(requests).subscribe((results) => {
            observer.next(results);
          });
        }
      });
    });
  }

  getMessagesForUser(userId: string): Observable<any[]> {
    this.socket$.next({ type: 'getMessages', userId });

    return new Observable((observer) => {
      this.socket$.subscribe((data) => {
        if (data.type === 'messages') {
          console.log("📩 Kaptunk üzeneteket:", data.data);
          observer.next(data.data);
        } else if (data.type === 'no_messages') {
          console.log("⚠️ Nincsenek üzenetek.");
          observer.next([]);
        }
      });
    });
  }


  sendMessage(receiverId: string, message: string) {
    this.socket$.next({
      type: 'sendMessage',
      receiverId,
      message
    });
  }
  selectUser(userId: string) {
    this.socket$.next({
      type: 'getMessages',
      userId
    });
  }

  getMessages() {
    return new Observable((observer) => {
      this.socket$.subscribe((data) => {
        if (data.type === 'new_message') {
          observer.next(data);
        }
      });
    });
  }


  closeConnection() {
    this.socket$.complete();
  }
}
