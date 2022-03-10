import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { tap } from 'rxjs/internal/operators/tap';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  apiUrl = `http://localhost:3000/users`;
  watcher$: BehaviorSubject<User[] | User | any> = new BehaviorSubject([]);

  constructor(
    private http: HttpClient,
  ) { }

  refresh(): void {
    this.get().toPromise().then(
      users => this.watcher$.next(users as User[]),
      err => console.error(err)
    );
  }

  get(id?: string | number): Observable<User | User[]> {
    return this.http.get<User | User[]>(`${this.apiUrl}/${id || ``}`);
  }

  create(data: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}`, data);
  }

  update(id: string | number, data: User): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string | number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap( () => {
        this.refresh();
      })
    );
  }
} 