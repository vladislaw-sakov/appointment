import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class AuthService {

  // Create a stream of logged in status to communicate throughout app
  loggedIn: boolean;
  user: any;

  constructor(private router: Router, public http: Http) {
    // If authenticated, set local profile property and update login status subject
    if (localStorage.getItem('dexafit_user')) {
      this.user = JSON.parse(localStorage.getItem('dexafit_user'));
      this.loggedIn = true;
    } else {
      this.user = '';
      this.loggedIn = false;
    }
  }

  setLoggedIn(value: boolean) {
    // Update login status subject
    this.loggedIn = value;
  }

  login(user: Object) {
    return this.http.post('/api/users/login', user)
      .map((res: Response) => res.json())
      .catch((err: any) => Observable.throw(err.json()));
  }

  setUser(user: Object) {
    this.user = user;
    this.loggedIn = true;
    localStorage.setItem('dexafit_user', JSON.stringify(user));
  }

  getUser() {
    return this.user;
  }

  signup(user: Object) {
    return this.http.post('/api/users', user)
      .map((res: Response) => res.json())
      .catch((err: any) => Observable.throw(err.json()));
  }

  logout() {
    // Remove tokens and profile and update login status subject
    localStorage.removeItem('dexafit_user');
    this.router.navigate(['/login']);
    this.setLoggedIn(false);
  }

  authenticated() {
    // Check if there's an unexpired access token
    return this.loggedIn;
  }

}