import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { AuthService } from './auth.service';

@Injectable()
export class BoxService {

  constructor(public http: Http, private authService: AuthService) {
    
  }

  getFolderList(fid) {
    return this.http.get('/api/box/' + fid + '?token=' + this.authService.getUser().token)
      .map((res: Response) => res.json())
      .catch((err: any) => Observable.throw(err.json()));
  }

  getFolderInfo(fid) {
    return this.http.get('/api/box/' + fid + '/info?type=folder&token=' + this.authService.getUser().token)
      .map((res: Response) => res.json())
      .catch((err: any) => Observable.throw(err.json()));
  }

  createFolder(folder, parent) {
    return this.http.post('/api/box/' + parent + '?token=' + this.authService.getUser().token, {name: folder.name, description: folder.description})
      .map((res: Response) => res.json())
      .catch((err: any) => Observable.throw(err.json()));
  }

  createNote(folder, note) {
    return this.http.post('/api/box/' + folder + '/note?token=' + this.authService.getUser().token, note)
      .map((res: Response) => res.json())
      .catch((err: any) => Observable.throw(err.json()));
  }

  deleteItem(id, type) {
    return this.http.delete('/api/box/' + id + '?token=' + this.authService.getUser().token + '&type=' + type)
      .map((res: Response) => res.json())
      .catch((err: any) => Observable.throw(err.json()));
  }

  downloadFile(file) {
    return this.http.get('/api/box/' + file + '/download?token=' + this.authService.getUser().token)
      .map((res: Response) => res.json())
      .catch((err: any) => Observable.throw(err.json()));
  }

}