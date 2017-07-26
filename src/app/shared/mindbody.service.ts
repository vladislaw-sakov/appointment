import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class MindbodyService {

  constructor(public http: Http) {
    
  }

  getLocations() {
    return this.http.get('/api/mindbody/location')
      .map((res: Response) => res.json())
      .catch((err: any) => Observable.throw(err.json()));
  }

  getStaffs() {
    return this.http.get('/api/mindbody/staff')
      .map((res: Response) => res.json())
      .catch((err: any) => Observable.throw(err.json()));
  }

  getSessionTypes() {
    return this.http.get('/api/mindbody/sessiontype')
      .map((res: Response) => res.json())
      .catch((err: any) => Observable.throw(err.json()));
  }

  getAppointments(params) {
    return this.http.get('/api/mindbody/appointments?startDate=' + params.startDate + '&endDate=' + params.endDate)
      .map((res: Response) => res.json())
      .catch((err: any) => Observable.throw(err.json()));
  }

  addAppointment(appointment) {
    return this.http.post('/api/mindbody/appointments', appointment)
      .map((res: Response) => res.json())
      .catch((err: any) => Observable.throw(err.json()));
  }

}