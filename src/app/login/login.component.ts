import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { Router } from "@angular/router";
import { FacebookService, LoginResponse } from '../facebook';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public user: any = {email: '', password: ''};
  public errorMessage: string = '';
  public successMessage: string = '';
  public isProcessing: boolean = false;
  public main_height: string = '';

  constructor(private ngZone:NgZone, private router:Router, public authService: AuthService, private fb: FacebookService) {
    window.onresize = (e) =>
    {
      this.ngZone.run(() => {
        this.main_height = (window.innerHeight > 800 ? window.innerHeight : 800) + 'px';
      });
      
    };
    
    this.main_height = window.innerHeight + 'px';
  }

  ngOnInit() {
  }

  fb_login () {
    this.fb.login()
      .then((response: LoginResponse) => console.log('Logged in ', response))
      .catch(e => console.error('Error logging in'));
  }

  login() {
    this.errorMessage = '';
    this.successMessage = '';
    this.isProcessing = false;

    if (this.user.email == '' || this.user.password == '') {
      this.errorMessage = 'Please input login credentials!';
      return;
    }

    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(this.user.email)) {
      this.errorMessage = 'Please input valid email address!';
      return;
    }

    this.isProcessing = true;
    this.authService.login(this.user)
    .subscribe(
      data => {
        if (data.code == 200) {
          let user = data.data;
          user.token = data.token;
          this.authService.setUser(user);
          this.router.navigate(['main/shop', 'Body Comp']);
        } else if(data.code == 401)
          this.errorMessage = 'Invalid credentials!';
        else
          this.errorMessage = 'Internal Server Error!';
        this.isProcessing = false;
      },
      err => {
        this.errorMessage = 'Internal Server Error!';
        this.isProcessing = false;
      });
  }

}
