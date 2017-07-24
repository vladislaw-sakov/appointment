import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ShopService } from '../shared/shop.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {

  private sub: any;
  public category: string = '';
  public items: any [] = [];
  public mostPopularItems: any [] = [];
  public newReleasedItems: any [] = [];
  public selectedItem: any = {};
  public selectedCategory: number = 1;
  public startIndexArray: number [] = [0, 0, 0];
  public isLearnMore = false;
  public iframe_height = '';

  constructor(private route: ActivatedRoute, private ngZone: NgZone, private shopService: ShopService) {
    window.onresize = (e) =>
    {
      this.ngZone.run(() => {
        this.iframe_height = window.innerHeight - 150 + 'px';
      });
      
    };

    this.iframe_height = window.innerHeight - 150 + 'px';
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.category = params['category'];
      this.shopService.setSelectedCategory(this.category);
      this.items = this.shopService.getByCategory(this.category);
      this.mostPopularItems = this.shopService.getPopularItems();
      this.newReleasedItems = this.shopService.getNewReleasedItems();
      this.selectedItem = {};
      this.isLearnMore = false;

      if (this.items && this.items.length > 0) {
        this.selectedCategory = 1;
        this.selectedItem = this.items[0];
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  selectItem(item: any, category: number) {
  	this.selectedItem = item;
  	this.selectedCategory = category;
  }

  displayItem(idx: number, diff: number) {
    this.startIndexArray[idx] = diff;
  }

  getMostPopularItems() {
    let newItems = [];
    for( let i = this.startIndexArray[1]; i < this.startIndexArray[1] + 4; i++ ) {
      newItems.push(this.mostPopularItems[i]);
    }
    return newItems;
  }

  getNewReleasedItems() {
    let newItems = [];
    for( let i = this.startIndexArray[2]; i < this.startIndexArray[2] + 4; i++ ) {
      newItems.push(this.newReleasedItems[i]);
    }
    return newItems;
  }

}
