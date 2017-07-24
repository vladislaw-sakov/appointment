import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-questionnaire',
	templateUrl: './questionnaire.component.html',
	styleUrls: ['./questionnaire.component.css']
})
export class QuestionnaireComponent implements OnInit {

	public type = '';
	public sub;
	public frame_height = '';
	constructor(private route: ActivatedRoute, private ngZone: NgZone) {
		window.onresize = (e) =>
		{
			this.ngZone.run(() => {
			this.frame_height = window.innerHeight - 155 + 'px';
		});

		};

		this.frame_height = window.innerHeight - 155 + 'px';
	}

	ngOnInit() {
		this.sub = this.route.params.subscribe(params => {
			this.type = params['type'];
		});
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}

}
