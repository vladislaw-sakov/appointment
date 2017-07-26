import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'app-calendar',
	templateUrl: './calendar.component.html',
	styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

	public currentDate: Date;

	@Input() month: number;
	@Input() day: number;
	@Output() search: EventEmitter<any>;

	constructor() {
		this.search = new EventEmitter<any>();
	}

	ngOnInit() {
		let todayDate = new Date();
		this.currentDate = new Date(todayDate.getFullYear(), this.month, this.day);
	}

	ngOnDestroy() {
	}

	offsetLeft() {
		return this.currentDate.getDay();
	}

	getArrayList(len) {
		return new Array(len);
	}

	getCurrentMonthName() {
		let monthNameList = ['January', 'Feburary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		return monthNameList[this.currentDate.getMonth()];
	}

	goMonth(diff) {
		this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + diff, 1);
		this.month = this.currentDate.getMonth();
	}

	onSearch() {
		this.search.emit({month: this.month, day: this.day});
	}

	setDate(day) {
		this.day = day;
	}

}
