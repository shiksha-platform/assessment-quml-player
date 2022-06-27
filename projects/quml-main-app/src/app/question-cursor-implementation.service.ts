import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {QuestionCursor} from '@project-sunbird/sunbird-quml-player-v9';
import {Observable, of, throwError as observableThrowError} from 'rxjs';
import {map, mergeMap} from 'rxjs/operators';
import {environment} from '../environments/environment';

@Injectable()
export class QuestionCursorImplementationService implements QuestionCursor {
    private baseUrl = environment.url;
    private ApiAuthToken = 'Bearer ' + environment.token;
    private urls = {
        questionSet: `${this.baseUrl}/api/questionset/v1/hierarchy`,
        questionList: `${this.baseUrl}/api/question/v1/list`
    };

    httpOptions = {
        headers: {'Content-Type': 'application/json'}
    };

    listUrl = this.urls.questionList;

    constructor(private http: HttpClient) {
    }

    getQuestions(identifiers: string[]): Observable<any> {
        const option: any = {
            url: this.listUrl,
            data: {
                request: {
                    search: {identifier: identifiers}
                }
            }
        };
        return this.post(option).pipe(map((data) => data.result));
    }

    getQuestion(identifier: string): Observable<any> {
        const option: any = {
            url: this.listUrl,
            data: {
                request: {
                    search: {identifier: [identifier]}
                }
            }
        };
        return this.post(option).pipe(map((data) => data.result));
    }

    getQuestionSet(identifier: string): Observable<any> {
        const headers = {'Authorization': this.ApiAuthToken};
        return this.http.get(`${this.urls.questionSet}/${identifier}?mode=edit`, {...this.httpOptions, headers}).pipe(
            mergeMap((data: any) => {
                console.log('\getQuestionSet:', data, '\n\n');
                if (data) {
                    return of(data);
                } else {
                    return observableThrowError({error: 'Data Missing'});
                }
            })
        );
    }

    private post(requestParam): Observable<any> {
        return this.http.post(requestParam.url, requestParam.data, this.httpOptions).pipe(
            mergeMap((data: any) => {
                if (data.responseCode !== 'OK') {
                    return observableThrowError(data);
                }
                return of(data);
            }));
    }

    getAllQuestionSet(identifiers: string[]) {
        return of({});
    }
}
