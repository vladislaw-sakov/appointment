import { Component, OnInit } from '@angular/core';
import { MindbodyService } from '../shared/mindbody.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css'],
  host: {
    '(document:click)': 'onClick($event)',
  }
})
export class BookComponent implements OnInit {

  public mon = 6;
  public day = 4;
  public isDetail = false;
  public isBooking = false;
  public isLoading = false;
  public locations = [];
  public staffs = [];
  public sessiontypes = [];
  public appointments = {};
  public selectedDate = new Date();
  public filter = {
    AppointmentID: '',
    StaffID: '',
    LocationID: ''
  };

  constructor(private mindbodyService: MindbodyService, private router: Router) {
  }

  ngOnInit() {
    this.mindbodyService.getLocations()
      .subscribe(
        data => {
          this.locations = data.data;
        },
        err => {
          console.log(err);
        });
    this.mindbodyService.getStaffs()
      .subscribe(
        data => {
          this.staffs = data.data;
        },
        err => {
          console.log(err);
        });

    this.mindbodyService.getSessionTypes()
      .subscribe(
        data => {
          this.sessiontypes = data.data;
        },
        err => {
          console.log(err);
        });
    this.mon = new Date().getMonth();
    this.day = new Date().getDate();
  }

  ngOnDestroy() {
  }

  keys() : Array<string> {
    return Object.keys(this.appointments);
  }

  onClick(event) {
   if (event.target.id == 'custom-modal-container') {
     this.isBooking = false;
   }
  }

  book(item) {
    this.isBooking = true;
    this.isLoading = true;
    let that = this;
    setTimeout(function() {
      that.router.navigate(['main/thankyou'], { queryParams: { datetime: item.StartDateTime.getTime() } });
      this.isLoading = false;
    }, 3000);
  }

  onSearch(date) {
    this.appointments = {};
    this.selectedDate = new Date(2017, date.month, date.day);
    this.isLoading = true;
    this.mindbodyService.getAppointments({startDate: '2017-' + (date.month > 8 ? (date.month + 1) : '0' + (date.month + 1)) + '-' + (date.day > 9 ? date.day : '0' + date.day), endDate: '2017-' + (date.month > 8 ? (date.month + 1) : '0' + (date.month + 1)) + '-' + (date.day > 9 ? date.day : '0' + date.day)})
      .subscribe(
        data => {
          if (data.code == 500 || !data.data) {

          } else {
            for( var i = 0; i < data.data.Appointment.length; i++) {
              var obj = data.data.Appointment[i];
              if (this.appointments[obj.Staff.Name]) {
                this.appointments[obj.Staff.Name].push({StartDateTime: new Date(obj.StartDateTime)});
              } else {
                this.appointments[obj.Staff.Name] = [{StartDateTime: new Date(obj.StartDateTime)}];
              }
            }

            this.isDetail = true;
          }

          this.isLoading = false;
          
        },
        err => {
          this.isLoading = false;
          console.log(err);
        });

    /*this.mindbodyService.addAppointment({
      userId: '1',
      mindbodyId: '2',
      locationId: '3',
      sessionType: '4',
      staff: '5',
      appointmentDate: new Date()
    })
      .subscribe(
        data => {
          console.log(data);
        },
        err => {
          console.log(err);
        });*/
  	this.mon = date.month;
    this.day = date.day;
  }
}
