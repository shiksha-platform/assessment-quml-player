import {Component, OnInit} from '@angular/core';
import {InteractionService} from './interaction.service';
import {playerConfig1} from './quml-library-data';
import {Router, RoutesRecognized} from '@angular/router';
import {environment} from '../environments/environment';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
    title = 'quml-main-app';
    contentId: string;
    qumlPlayerConfig: any = {...playerConfig1};
    parentUrl = environment.parentUrl;
    isLoading = true;

    constructor(
        private router: Router,
        private interactionService: InteractionService
    ) {
    }

    ngOnInit() {
        this.router.events.subscribe((res) => {
            if (res instanceof RoutesRecognized) {
                const params = res.state.root.queryParams;
                this.interactionService.initializeParams(params);
                this.contentId = params.questionId;
                const questionIds = params.questions ? params.questions.split(',') : [];
                if (params.parentUrl) {
                    this.parentUrl = params.parentUrl;
                }
                this.qumlPlayerConfig.metadata.children[0].children = [];
                questionIds.forEach(questionId => {
                    this.qumlPlayerConfig.metadata.children[0].children.push({
                        'identifier': questionId
                    });
                });
                this.isLoading = false;
            }
        });
    }

    getPlayerEvents(event) {
        console.log('get player events', JSON.stringify(event));
    }

    navigateToFinish(id) {
        this.router.navigate([`/finish/${id}`]);
    }

    onSubmit(event) {
        if (this.parentUrl) {
            window.parent.postMessage(event.result, this.parentUrl);
        }
    }

    getTelemetryEvents(event) {
        // console.log('event is for telemetry', JSON.stringify(event));
    }
}
