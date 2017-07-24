import { Component, OnInit, NgZone } from '@angular/core';
import { ShopService } from '../shared/shop.service';
import { AuthService } from '../shared/auth.service';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  providers: [ShopService],
  host: {
    '(document:click)': 'onClick($event)',
  }
})
export class MainComponent implements OnInit {

  public main_height: String = '';
  public modal_top: String = '';
  public category: String = '';
  public isTour: Boolean = false;
  public page_number: Number = 1;
  public page_count: Number = 2;
  public tour_type: Number = 1;
  public user: any;
  public active_status: Number [] = [0, 0, 0, 0, 0, 0];
  private sub: any;

  constructor(private route: ActivatedRoute, private ngZone:NgZone, private authService: AuthService, private mainRoute: Router) {

    window.onresize = (e) =>
    {
      this.ngZone.run(() => {
        this.main_height = window.innerHeight + 'px';
        this.modal_top = (window.innerHeight - 454) / 2 + 'px';
      });
      
    };

    this.main_height = window.innerHeight + 'px';
    this.modal_top = (window.innerHeight - 454) / 2 + 'px';
  }

  ngOnInit() {
    this.sub = this.route.queryParams.subscribe(params => {
      if (params['tour'] == 'true') this.isTour = true;
      else this.isTour = false;
    });

    this.user = this.authService.getUser();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onClick(event) {
   if (event.target.id == 'tour-container') {
     this.isTour = false;
   }
  }

  goPage(page) {
    if (page == 0 || page - 1 == this.page_count) return;
    this.page_number  = page;
  }

  logout() {
    this.authService.logout();
  }

  showTour(type, count) {
    this.tour_type = type;
    this.page_count = count;
    this.page_number = 1;
  }

  setMouseOver(index) {
    this.active_status[index] = 1;
  }

  setMouseOut(index) {
    this.active_status[index] = 0;
  }

  getImage(index, fileName) {
    if ((this.active_status[index] == 1 || this.mainRoute.url.indexOf('/main/vault') != -1) && index == 0)
      return '/assets/images/' + fileName + '-active.png';
    else
      return '/assets/images/' + fileName + '.png';
  }

  isUrlActive(url) {
    return this.mainRoute.url.indexOf(url) != -1;
  }
}
