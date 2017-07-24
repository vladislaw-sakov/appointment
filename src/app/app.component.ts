import { Component, Directive, ElementRef, Renderer, ChangeDetectionStrategy, ViewEncapsulation, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute, NavigationStart } from '@angular/router';
import { AuthService } from './shared/auth.service';
import { FacebookService, LoginResponse, InitParams } from './facebook';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

//
/////////////////////////
// ** Example Directive
// Notice we don't touch the Element directly

@Directive({
  selector: '[xLarge]'
})
export class XLargeDirective {
  constructor(element: ElementRef, renderer: Renderer) {
    // ** IMPORTANT **
    // we must interact with the dom through -Renderer-
    // for webworker/server to see the changes
    renderer.setElementStyle(element.nativeElement, 'fontSize', 'x-large');
    // ^^
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.Emulated,
  selector: 'app',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'ftw';
  constructor(
    private router: Router, 
    private titleService: Title,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private fb: FacebookService
  ) {

    let initParams: InitParams = {
      appId: '301754406917969',
      xfbml: true,
      version: 'v2.8'
    };

    fb.init(initParams);

    router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {

        if (event.url == "/login" || event.url == "/signup") return;
        if (!authService.getUser().token)
          router.navigate(['login']);
      }
    });


  }
  ngOnInit() {
    this.router.events
      .filter(event => event instanceof NavigationEnd)
      .map(() => this.activatedRoute)
      .map(route => {
        while (route.firstChild) route = route.firstChild;
        return route;
      })
      .filter(route => route.outlet === 'primary')
      .mergeMap(route => route.data)
      .subscribe((event) => {
        this.titleService.setTitle(event['title'])
        console.log(event['title']);
      });
  }
}
