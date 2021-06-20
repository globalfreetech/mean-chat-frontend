import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseURL = environment.baseUrl;
  public currentUser: Observable<any>;
  private currentUserSubject: BehaviorSubject<any>;
  constructor(
    private http: HttpClient
  ) {
    this.currentUserSubject = new BehaviorSubject<any>(localStorage.getItem('token'));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  signupUser(data) {
    return this.http.post(`${this.baseURL}/user/signup`, data).pipe(map((user: any) => {
      // signup successful if there's a jwt token in the response
      if (user) {
        localStorage.setItem('token', user.token);
        localStorage.setItem('user', JSON.stringify(user.data));
        this.currentUserSubject.next(user.token);
      }
      return user;
    }))
  }

  loginUser(data) {
    return this.http.post(`${this.baseURL}/user/login`, data).pipe(map((user: any) => {
      // sigin successful if there's a jwt token in the response
      if (user) {
        localStorage.setItem('token', user.token);
        localStorage.setItem('user', JSON.stringify(user.data));
        this.currentUserSubject.next(user.token);
      }
      return user;
    }))
  }

  searchUsers(keyword){
    return this.http.get(`${this.baseURL}/user/findUsersByNameEmail/${keyword}`)
  }
}
