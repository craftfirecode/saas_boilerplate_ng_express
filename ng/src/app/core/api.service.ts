import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class APIService {
  private readonly http = inject(HttpClient);
  private readonly headers = new HttpHeaders({
    'Accept': 'application/vnd.api+json'
  });

  /**
   * Pings the PUBG API to verify connection
   * @returns Observable of the API response
   */
  ping(): Observable<unknown> {
    return this.http.get(`https://jsonplaceholder.typicode.com/todos/1`, {
      headers: this.headers
    });
  }

  pings(): Observable<unknown> {
    return this.http.get(`https://jsonplaceholder.typicode.com/todos`, {
      headers: this.headers
    });
  }

}
