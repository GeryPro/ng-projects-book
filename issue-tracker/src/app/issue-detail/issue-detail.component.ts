import { EventEmitter, Output, Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Issue } from '../issue';
import { IssuesService } from '../issues.service';

@Component({
	selector: 'app-issue-detail',
	templateUrl: './issue-detail.component.html',
	styleUrls: ['./issue-detail.component.css'],
})
export class IssueDetailComponent implements OnInit {
	issueForm: FormGroup | undefined;
	suggestions: Issue[] = [];
	@Input() issue?: Issue | undefined;
	@Output() formClose = new EventEmitter();

	constructor(
		private builder: FormBuilder,
		private issueService: IssuesService
	) {}

	ngOnInit(): void {
		if (!this.issue) {
			this.issueForm = this.builder.group({
				title: ['', Validators.required],
				description: [''],
				priority: ['', Validators.required],
				type: ['', Validators.required],
			});
			this.issueForm.controls.title.valueChanges.subscribe((title: string) => {
				this.suggestions = this.issueService.getSuggestions(title);
			});
		} else {
			this.issueForm = this.builder.group({
				title: [this.issue?.title, Validators.required],
				description: [this.issue?.description],
				priority: [this.issue?.priority, Validators.required],
				type: [this.issue?.type, Validators.required],
			});
		}
	}

	saveIssue() {
		if (this.issueForm && this.issueForm.invalid) {
			this.issueForm.markAllAsTouched();
			return;
		}
		if (this.issue) {
			this.issueService.updateIssue(this.issue.issueNo, this.issueForm?.value);
		} else {
			this.issueService.createIssue(this.issueForm?.value);
		}
		this.formClose.emit();
	}
}
