import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class TypeformService {

  constructor(public http: Http) {
    
  }

  getAnswer(uid) {
    return this.http.get('/api/typeform/' + uid)
      .map((res: Response) => res.json())
      .catch((err: any) => Observable.throw(err.json()));
  }
}