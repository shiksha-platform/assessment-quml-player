import {Component, OnInit} from '@angular/core';
import {InteractionService} from './interaction.service';
import {playerConfig1} from './quml-library-data';
import {Router, ParamMap, RoutesRecognized} from '@angular/router';
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
                // this.contentId = "do_113474564257120256145"//"do_113469567867748352166"//params.questionId;
                this.contentId = params.questionId;
                const questionIds = params.questions ? params.questions.split(',') : [];
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
        window.parent.postMessage(event.result, environment.parentUrl);
        /*this.navigateToFinish(
            res?.data?.insert_quml_response?.returning[0]?.id
        );*/
    }

    getTelemetryEvents(event) {
        // console.log('event is for telemetry', JSON.stringify(event));
    }
}
