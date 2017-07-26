import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-qc',
	templateUrl: './qc.component.html',
	styleUrls: ['./qc.component.css']
})
export class QCComponent implements OnInit {

	public sub;
	public datetime;
	constructor(private route: ActivatedRoute) {
	}

	ngOnInit() {
		this.sub = this.route.queryParams.subscribe(params => {
			this.datetime = params['datetime'];
		});
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}

	getRemainingText() {
		var dateDifference = parseInt(this.datetime) - new Date().getTime();
		if (dateDifference > 0) {
			var d = Math.floor(dateDifference / (3600 * 1000 * 24));
			dateDifference = dateDifference - 3600 * 1000 * 24 * d;
			var h = Math.floor(dateDifference / (3600 * 1000));
			dateDifference = dateDifference - 3600 * 1000 * h;
			var m = Math.floor(dateDifference / (60 * 1000));
			dateDifference = dateDifference - 60 * 1000 * m;
			var s = Math.floor(dateDifference / 1000);
			return d + ' ' + h + ':' + m + ':' + s;
		} else {
			return '';
		}
	}

}
