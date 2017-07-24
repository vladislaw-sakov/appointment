import { Component, OnInit, NgZone, ElementRef } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  public user: any = {
    email: '', 
    password: '', 
    firstName: '', 
    lastName: '', 
    city: 'city', 
    state: 'state', 
    country: ''
  };
  public main_height: string = '';
  public errorMessage: string = '';
  public successMessage: string = '';
  public isProcessing: boolean = false;
  public countryList: string[] = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua &amp; Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas"
    ,"Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia &amp; Herzegovina","Botswana","Brazil","British Virgin Islands"
    ,"Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Cape Verde","Cayman Islands","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica"
    ,"Cote D Ivoire","Croatia","Cruise Ship","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea"
    ,"Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana"
    ,"Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India"
    ,"Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyz Republic","Laos","Latvia"
    ,"Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania"
    ,"Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia"
    ,"New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal"
    ,"Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre &amp; Miquelon","Samoa","San Marino","Satellite","Saudi Arabia","Senegal","Serbia","Seychelles"
    ,"Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","St Kitts &amp; Nevis","St Lucia","St Vincent","St. Lucia","Sudan"
    ,"Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad &amp; Tobago","Tunisia"
    ,"Turkey","Turkmenistan","Turks &amp; Caicos","Uganda","Ukraine","United Arab Emirates","United Kingdom","Uruguay","Uzbekistan","Venezuela","Vietnam","Virgin Islands (US)"
    ,"Yemen","Zambia","Zimbabwe"];

  constructor(private ngZone:NgZone, private el: ElementRef, public authService: AuthService, private router:Router) {
    window.onresize = (e) =>
    {
      this.ngZone.run(() => {
        this.main_height = (window.innerHeight > 800 ? window.innerHeight : 800) + 'px';
        //console.log(this.el.nativeElement.offsetHeight);
      });
      
    };

    this.main_height = window.innerHeight + 'px';
  }

  ngOnInit() {
  }

  signup() {

    this.errorMessage = '';
    this.successMessage = '';
    this.isProcessing = false;

    if (this.user.email == '' || this.user.password == '' || this.user.firstName == '' || this.user.lastName == '' || this.user.country == '') {
      this.errorMessage = 'Please input user information!';
      return;
    }

    this.user.email = this.user.email.trim();
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(this.user.email)) {
      this.errorMessage = 'Please input valid email address!';
      return;
    }

    this.isProcessing = true;
    this.authService.signup(this.user)
    .subscribe(
      data => {
        this.isProcessing = false;
        if (data.code == 403)
          this.errorMessage = 'Email already registered!';
        else if (data.code == 200) {
          let user = data.data;
          user.token = data.token;
          this.authService.setUser(user);
          this.router.navigate(['main/shop', 'Body Comp'], { queryParams: { tour: 'true' } });
        }
        else
          this.errorMessage = 'Internal Server Error!';
      }, 
      err => {
        this.isProcessing = false;
        this.errorMessage = 'Internal Server Error!';
      });
  }

}
