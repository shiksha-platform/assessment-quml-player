/**
 * @fileoverview added by tsickle
 * Generated from: lib/services/viewer-service/viewer-service.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { EventEmitter, Injectable } from '@angular/core';
import { QumlLibraryService } from '../../quml-library.service';
import { UtilService } from '../../util-service';
import { TelemetryType } from '../../telemetry-constants';
import { QuestionCursor } from '../../quml-question-cursor.service';
import * as _ from 'lodash-es';
import { forkJoin } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "../../quml-library.service";
import * as i2 from "../../util-service";
import * as i3 from "../../quml-question-cursor.service";
export class ViewerService {
    /**
     * @param {?} qumlLibraryService
     * @param {?} utilService
     * @param {?} questionCursor
     */
    constructor(qumlLibraryService, utilService, questionCursor) {
        this.qumlLibraryService = qumlLibraryService;
        this.utilService = utilService;
        this.questionCursor = questionCursor;
        this.qumlPlayerEvent = new EventEmitter();
        this.qumlQuestionEvent = new EventEmitter();
        this.version = '1.0';
        this.timeSpent = '0:0';
        this.isAvailableLocally = false;
        this.isSectionsAvailable = false;
        this.sectionQuestions = [];
    }
    /**
     * @param {?} config
     * @param {?} threshold
     * @param {?} questionIds
     * @param {?} parentConfig
     * @return {?}
     */
    initialize(config, threshold, questionIds, parentConfig) {
        var _a;
        this.qumlLibraryService.initializeTelemetry(config, parentConfig);
        this.identifiers = _.cloneDeep(questionIds);
        this.parentIdentifier = config.metadata.identifier;
        this.threshold = threshold;
        this.rotation = 0;
        this.totalNumberOfQuestions = config.metadata.childNodes.length || 0;
        this.qumlPlayerStartTime = this.qumlPlayerLastPageTime = new Date().getTime();
        this.currentQuestionIndex = 1;
        this.contentName = config.metadata.name;
        this.isAvailableLocally = config.metadata.isAvailableLocally;
        this.isSectionsAvailable = (_a = parentConfig) === null || _a === void 0 ? void 0 : _a.isSectionsAvailable;
        this.src = config.metadata.artifactUrl || '';
        this.questionSetId = config.metadata.identifier;
        if (config.context.userData) {
            this.userName = config.context.userData.firstName + ' ' + config.context.userData.lastName;
        }
        this.metaData = {
            pagesHistory: [],
            totalPages: 0,
            duration: 0,
            rotation: [],
            progressBar: [],
            questions: [],
            questionIds: [],
            lastQuestionId: '',
        };
        this.loadingProgress = 0;
        this.endPageSeen = false;
    }
    /**
     * @param {?} currentQuestionIndex
     * @return {?}
     */
    raiseStartEvent(currentQuestionIndex) {
        this.currentQuestionIndex = currentQuestionIndex;
        /** @type {?} */
        const duration = new Date().getTime() - this.qumlPlayerStartTime;
        /** @type {?} */
        const startEvent = {
            eid: 'START',
            ver: this.version,
            edata: {
                type: 'START',
                currentIndex: this.currentQuestionIndex,
                duration
            },
            metaData: this.metaData
        };
        this.qumlPlayerEvent.emit(startEvent);
        this.qumlPlayerLastPageTime = this.qumlPlayerStartTime = new Date().getTime();
        this.qumlLibraryService.start(duration);
    }
    /**
     * @param {?} currentQuestionIndex
     * @param {?} endPageSeen
     * @param {?} score
     * @return {?}
     */
    raiseEndEvent(currentQuestionIndex, endPageSeen, score) {
        this.metaData.questions = this.sectionQuestions;
        /** @type {?} */
        const duration = new Date().getTime() - this.qumlPlayerStartTime;
        /** @type {?} */
        const endEvent = {
            eid: 'END',
            ver: this.version,
            edata: {
                type: 'END',
                currentPage: currentQuestionIndex,
                totalPages: this.totalNumberOfQuestions,
                duration
            },
            metaData: this.metaData
        };
        this.qumlPlayerEvent.emit(endEvent);
        /** @type {?} */
        const visitedlength = (this.metaData.pagesHistory.filter((/**
         * @param {?} v
         * @param {?} i
         * @param {?} a
         * @return {?}
         */
        (v, i, a) => a.indexOf(v) === i))).length;
        this.timeSpent = this.utilService.getTimeSpentText(this.qumlPlayerStartTime);
        this.qumlLibraryService.end(duration, currentQuestionIndex, this.totalNumberOfQuestions, this.totalNumberOfQuestions, endPageSeen, score);
    }
    /**
     * @param {?} type
     * @param {?} telemetryType
     * @param {?} pageId
     * @return {?}
     */
    raiseHeartBeatEvent(type, telemetryType, pageId) {
        /** @type {?} */
        const hearBeatEvent = {
            eid: 'HEARTBEAT',
            ver: this.version,
            edata: {
                type,
                questionIndex: this.currentQuestionIndex,
            },
            metaData: this.metaData
        };
        if (this.isSectionsAvailable) {
            hearBeatEvent.edata.sectionId = this.questionSetId;
        }
        this.qumlPlayerEvent.emit(hearBeatEvent);
        if (TelemetryType.interact === telemetryType) {
            this.qumlLibraryService.interact(type.toLowerCase(), pageId);
        }
        else if (TelemetryType.impression === telemetryType) {
            this.qumlLibraryService.impression(pageId);
        }
    }
    /**
     * @param {?} questionData
     * @param {?} index
     * @param {?} pass
     * @param {?} score
     * @param {?} resValues
     * @param {?} duration
     * @return {?}
     */
    raiseAssesEvent(questionData, index, pass, score, resValues, duration) {
        /** @type {?} */
        const assessEvent = {
            item: questionData,
            index: index,
            pass: pass,
            score: score,
            resvalues: resValues,
            duration: duration
        };
        this.qumlPlayerEvent.emit(assessEvent);
        this.qumlLibraryService.startAssesEvent(assessEvent);
    }
    /**
     * @param {?} identifier
     * @param {?} qType
     * @param {?} optionSelected
     * @return {?}
     */
    raiseResponseEvent(identifier, qType, optionSelected) {
        /** @type {?} */
        const responseEvent = {
            target: {
                id: identifier,
                ver: this.version,
                type: qType
            },
            values: [{
                    optionSelected
                }]
        };
        this.qumlPlayerEvent.emit(responseEvent);
        this.qumlLibraryService.response(identifier, this.version, qType, optionSelected);
    }
    /**
     * @param {?} currentQuestionIndex
     * @param {?} endpageseen
     * @param {?} score
     * @param {?} summaryObj
     * @return {?}
     */
    raiseSummaryEvent(currentQuestionIndex, endpageseen, score, summaryObj) {
        /** @type {?} */
        let timespent = new Date().getTime() - this.qumlPlayerStartTime;
        timespent = Number(((timespent % 60000) / 1000).toFixed(2));
        /** @type {?} */
        const eData = {
            type: "content",
            mode: "play",
            starttime: this.qumlPlayerStartTime,
            endtime: new Date().getTime(),
            timespent,
            pageviews: this.totalNumberOfQuestions,
            interactions: summaryObj.correct + summaryObj.wrong + summaryObj.partial,
            extra: [{
                    id: "progress",
                    value: ((currentQuestionIndex / this.totalNumberOfQuestions) * 100).toFixed(0).toString()
                }, {
                    id: "endpageseen",
                    value: endpageseen.toString()
                }, {
                    id: "score",
                    value: score.toString()
                }, {
                    id: "correct",
                    value: summaryObj.correct.toString()
                }, {
                    id: "incorrect",
                    value: summaryObj.wrong.toString()
                }, {
                    id: "partial",
                    value: summaryObj.partial.toString()
                }, {
                    id: "skipped",
                    value: summaryObj.skipped.toString()
                }]
        };
        /** @type {?} */
        const summaryEvent = {
            eid: 'QUML_SUMMARY',
            ver: this.version,
            edata: eData,
            metaData: this.metaData
        };
        this.qumlPlayerEvent.emit(summaryEvent);
        this.qumlLibraryService.summary(eData);
    }
    /**
     * @param {?} errorCode
     * @param {?} errorType
     * @param {?} stacktrace
     * @param {?} traceId
     * @return {?}
     */
    raiseExceptionLog(errorCode, errorType, stacktrace, traceId) {
        /** @type {?} */
        const exceptionLogEvent = {
            eid: "ERROR",
            edata: {
                err: errorCode,
                errtype: errorType,
                requestid: traceId || '',
                stacktrace: stacktrace || '',
            }
        };
        this.qumlPlayerEvent.emit(exceptionLogEvent);
        this.qumlLibraryService.error(stacktrace, { err: errorCode, errtype: errorType });
    }
    /**
     * @param {?=} currentIndex
     * @param {?=} index
     * @return {?}
     */
    getQuestions(currentIndex, index) {
        /** @type {?} */
        let indentifersForQuestions;
        if (currentIndex !== undefined && index) {
            indentifersForQuestions = this.identifiers.splice(currentIndex, index);
        }
        else if (!currentIndex && !index) {
            indentifersForQuestions = this.identifiers.splice(0, this.threshold);
        }
        if (!_.isEmpty(indentifersForQuestions)) {
            /** @type {?} */
            const requests = [];
            /** @type {?} */
            const chunkArray = _.chunk(indentifersForQuestions, 10);
            _.forEach(chunkArray, (/**
             * @param {?} value
             * @return {?}
             */
            (value) => {
                requests.push(this.questionCursor.getQuestions(value, this.parentIdentifier));
            }));
            forkJoin(requests).subscribe((/**
             * @param {?} questions
             * @return {?}
             */
            questions => {
                _.forEach(questions, (/**
                 * @param {?} value
                 * @return {?}
                 */
                (value) => {
                    this.qumlQuestionEvent.emit(value);
                }));
            }), (/**
             * @param {?} error
             * @return {?}
             */
            (error) => {
                this.qumlQuestionEvent.emit({
                    error: error
                });
            }));
        }
    }
    /**
     * @return {?}
     */
    getQuestion() {
        /** @type {?} */
        let indentiferForQuestion = this.identifiers.splice(0, this.threshold);
        this.questionCursor.getQuestion(indentiferForQuestion).subscribe((/**
         * @param {?} question
         * @return {?}
         */
        (question) => {
            this.qumlQuestionEvent.emit(question);
        }), (/**
         * @param {?} error
         * @return {?}
         */
        (error) => {
            this.qumlQuestionEvent.emit({
                error: error
            });
        }));
    }
    /**
     * @param {?} currentattempt
     * @param {?} maxLimitExceeded
     * @param {?} isLastAttempt
     * @return {?}
     */
    generateMaxAttemptEvents(currentattempt, maxLimitExceeded, isLastAttempt) {
        return {
            eid: 'exdata',
            ver: this.version,
            edata: {
                type: 'exdata',
                currentattempt,
                maxLimitExceeded,
                isLastAttempt
            },
            metaData: this.metaData
        };
    }
    /**
     * @param {?} id
     * @param {?} questions
     * @return {?}
     */
    updateSectionQuestions(id, questions) {
        /** @type {?} */
        const index = this.sectionQuestions.findIndex((/**
         * @param {?} section
         * @return {?}
         */
        section => section.id === id));
        if (index > -1) {
            this.sectionQuestions[index].questions = questions;
        }
        else {
            this.sectionQuestions.push({ id, questions });
        }
    }
    /**
     * @param {?} id
     * @return {?}
     */
    getSectionQuestions(id) {
        var _a;
        return ((_a = this.sectionQuestions.find((/**
         * @param {?} section
         * @return {?}
         */
        section => section.id === id))) === null || _a === void 0 ? void 0 : _a.questions) || [];
    }
}
ViewerService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
/** @nocollapse */
ViewerService.ctorParameters = () => [
    { type: QumlLibraryService },
    { type: UtilService },
    { type: QuestionCursor }
];
/** @nocollapse */ ViewerService.ɵprov = i0.ɵɵdefineInjectable({ factory: function ViewerService_Factory() { return new ViewerService(i0.ɵɵinject(i1.QumlLibraryService), i0.ɵɵinject(i2.UtilService), i0.ɵɵinject(i3.QuestionCursor)); }, token: ViewerService, providedIn: "root" });
if (false) {
    /** @type {?} */
    ViewerService.prototype.qumlPlayerEvent;
    /** @type {?} */
    ViewerService.prototype.qumlQuestionEvent;
    /** @type {?} */
    ViewerService.prototype.zoom;
    /** @type {?} */
    ViewerService.prototype.rotation;
    /** @type {?} */
    ViewerService.prototype.qumlPlayerStartTime;
    /** @type {?} */
    ViewerService.prototype.qumlPlayerLastPageTime;
    /** @type {?} */
    ViewerService.prototype.totalNumberOfQuestions;
    /** @type {?} */
    ViewerService.prototype.currentQuestionIndex;
    /** @type {?} */
    ViewerService.prototype.contentName;
    /** @type {?} */
    ViewerService.prototype.src;
    /** @type {?} */
    ViewerService.prototype.userName;
    /** @type {?} */
    ViewerService.prototype.version;
    /** @type {?} */
    ViewerService.prototype.timeSpent;
    /** @type {?} */
    ViewerService.prototype.metaData;
    /** @type {?} */
    ViewerService.prototype.loadingProgress;
    /** @type {?} */
    ViewerService.prototype.endPageSeen;
    /** @type {?} */
    ViewerService.prototype.identifiers;
    /** @type {?} */
    ViewerService.prototype.threshold;
    /** @type {?} */
    ViewerService.prototype.isAvailableLocally;
    /** @type {?} */
    ViewerService.prototype.isSectionsAvailable;
    /** @type {?} */
    ViewerService.prototype.questionSetId;
    /** @type {?} */
    ViewerService.prototype.parentIdentifier;
    /** @type {?} */
    ViewerService.prototype.sectionQuestions;
    /** @type {?} */
    ViewerService.prototype.qumlLibraryService;
    /** @type {?} */
    ViewerService.prototype.utilService;
    /** @type {?} */
    ViewerService.prototype.questionCursor;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlld2VyLXNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AcHJvamVjdC1zdW5iaXJkL3N1bmJpcmQtcXVtbC1wbGF5ZXItdjkvIiwic291cmNlcyI6WyJsaWIvc2VydmljZXMvdmlld2VyLXNlcnZpY2Uvdmlld2VyLXNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUV6RCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUNoRSxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDakQsT0FBTyxFQUFhLGFBQWEsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQ3JFLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQUNwRSxPQUFPLEtBQUssQ0FBQyxNQUFNLFdBQVcsQ0FBQztBQUMvQixPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sTUFBTSxDQUFDOzs7OztBQUtoQyxNQUFNLE9BQU8sYUFBYTs7Ozs7O0lBeUJ4QixZQUNTLGtCQUFzQyxFQUN0QyxXQUF3QixFQUN4QixjQUE4QjtRQUY5Qix1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW9CO1FBQ3RDLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBQ3hCLG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQTNCaEMsb0JBQWUsR0FBRyxJQUFJLFlBQVksRUFBTyxDQUFDO1FBQzFDLHNCQUFpQixHQUFHLElBQUksWUFBWSxFQUFPLENBQUM7UUFVbkQsWUFBTyxHQUFHLEtBQUssQ0FBQztRQUNoQixjQUFTLEdBQUcsS0FBSyxDQUFDO1FBTWxCLHVCQUFrQixHQUFHLEtBQUssQ0FBQztRQUMzQix3QkFBbUIsR0FBRyxLQUFLLENBQUM7UUFHNUIscUJBQWdCLEdBQUcsRUFBRSxDQUFDO0lBTWxCLENBQUM7Ozs7Ozs7O0lBRUwsVUFBVSxDQUFDLE1BQXdC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Q0FBc0I7O0lBR3BCLDJDQUE2Qzs7SUFDN0Msb0NBQStCOztJQUMvQix1Q0FBcUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFdmVudEVtaXR0ZXIsIEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IElQYXJlbnRDb25maWcsIFF1bWxQbGF5ZXJDb25maWcgfSBmcm9tICcuLi8uLi9xdW1sLWxpYnJhcnktaW50ZXJmYWNlJztcbmltcG9ydCB7IFF1bWxMaWJyYXJ5U2VydmljZSB9IGZyb20gJy4uLy4uL3F1bWwtbGlicmFyeS5zZXJ2aWNlJztcbmltcG9ydCB7IFV0aWxTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vdXRpbC1zZXJ2aWNlJztcbmltcG9ydCB7IGV2ZW50TmFtZSwgVGVsZW1ldHJ5VHlwZSB9IGZyb20gJy4uLy4uL3RlbGVtZXRyeS1jb25zdGFudHMnO1xuaW1wb3J0IHsgUXVlc3Rpb25DdXJzb3IgfSBmcm9tICcuLi8uLi9xdW1sLXF1ZXN0aW9uLWN1cnNvci5zZXJ2aWNlJztcbmltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoLWVzJztcbmltcG9ydCB7IGZvcmtKb2luIH0gZnJvbSAncnhqcyc7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIFZpZXdlclNlcnZpY2Uge1xuICBwdWJsaWMgcXVtbFBsYXllckV2ZW50ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIHB1YmxpYyBxdW1sUXVlc3Rpb25FdmVudCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICB6b29tOiBzdHJpbmc7XG4gIHJvdGF0aW9uOiBudW1iZXI7XG4gIHF1bWxQbGF5ZXJTdGFydFRpbWU6IG51bWJlcjtcbiAgcXVtbFBsYXllckxhc3RQYWdlVGltZTogbnVtYmVyO1xuICB0b3RhbE51bWJlck9mUXVlc3Rpb25zOiBudW1iZXI7XG4gIGN1cnJlbnRRdWVzdGlvbkluZGV4OiBudW1iZXI7XG4gIGNvbnRlbnROYW1lOiBzdHJpbmc7XG4gIHNyYzogc3RyaW5nO1xuICB1c2VyTmFtZTogc3RyaW5nO1xuICB2ZXJzaW9uID0gJzEuMCc7XG4gIHRpbWVTcGVudCA9ICcwOjAnO1xuICBtZXRhRGF0YTogYW55O1xuICBsb2FkaW5nUHJvZ3Jlc3M6IG51bWJlcjtcbiAgZW5kUGFnZVNlZW46IGJvb2xlYW47XG4gIGlkZW50aWZpZXJzOiBhbnk7XG4gIHRocmVzaG9sZDogbnVtYmVyO1xuICBpc0F2YWlsYWJsZUxvY2FsbHkgPSBmYWxzZTtcbiAgaXNTZWN0aW9uc0F2YWlsYWJsZSA9IGZhbHNlO1xuICBxdWVzdGlvblNldElkOiBzdHJpbmc7XG4gIHBhcmVudElkZW50aWZpZXI6IHN0cmluZztcbiAgc2VjdGlvblF1ZXN0aW9ucyA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBxdW1sTGlicmFyeVNlcnZpY2U6IFF1bWxMaWJyYXJ5U2VydmljZSxcbiAgICBwdWJsaWMgdXRpbFNlcnZpY2U6IFV0aWxTZXJ2aWNlLFxuICAgIHB1YmxpYyBxdWVzdGlvbkN1cnNvcjogUXVlc3Rpb25DdXJzb3JcbiAgKSB7IH1cblxuICBpbml0aWFsaXplKGNvbmZpZzogUXVtbFBsYXllckNvbmZpZyAsIHRocmVzaG9sZDogbnVtYmVyLCBxdWVzdGlvbklkczogc3RyaW5nW10sIHBhcmVudENvbmZpZzogSVBhcmVudENvbmZpZykge1xuICAgIHRoaXMucXVtbExpYnJhcnlTZXJ2aWNlLmluaXRpYWxpemVUZWxlbWV0cnkoY29uZmlnLCBwYXJlbnRDb25maWcpO1xuICAgIHRoaXMuaWRlbnRpZmllcnMgPSBfLmNsb25lRGVlcChxdWVzdGlvbklkcyk7XG4gICAgdGhpcy5wYXJlbnRJZGVudGlmaWVyID0gY29uZmlnLm1ldGFkYXRhLmlkZW50aWZpZXI7XG4gICAgdGhpcy50aHJlc2hvbGQgPSB0aHJlc2hvbGQ7XG4gICAgdGhpcy5yb3RhdGlvbiA9IDA7XG4gICAgdGhpcy50b3RhbE51bWJlck9mUXVlc3Rpb25zID0gY29uZmlnLm1ldGFkYXRhLmNoaWxkTm9kZXMubGVuZ3RoIHx8IDA7XG4gICAgdGhpcy5xdW1sUGxheWVyU3RhcnRUaW1lID0gdGhpcy5xdW1sUGxheWVyTGFzdFBhZ2VUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgdGhpcy5jdXJyZW50UXVlc3Rpb25JbmRleCA9IDE7XG4gICAgdGhpcy5jb250ZW50TmFtZSA9IGNvbmZpZy5tZXRhZGF0YS5uYW1lO1xuICAgIHRoaXMuaXNBdmFpbGFibGVMb2NhbGx5ID0gY29uZmlnLm1ldGFkYXRhLmlzQXZhaWxhYmxlTG9jYWxseTtcbiAgICB0aGlzLmlzU2VjdGlvbnNBdmFpbGFibGUgPSBwYXJlbnRDb25maWc/LmlzU2VjdGlvbnNBdmFpbGFibGU7XG4gICAgdGhpcy5zcmMgPSBjb25maWcubWV0YWRhdGEuYXJ0aWZhY3RVcmwgfHwgJyc7XG4gICAgdGhpcy5xdWVzdGlvblNldElkID0gY29uZmlnLm1ldGFkYXRhLmlkZW50aWZpZXI7XG5cbiAgICBpZiAoY29uZmlnLmNvbnRleHQudXNlckRhdGEpIHtcbiAgICAgIHRoaXMudXNlck5hbWUgPSBjb25maWcuY29udGV4dC51c2VyRGF0YS5maXJzdE5hbWUgKyAnICcgKyBjb25maWcuY29udGV4dC51c2VyRGF0YS5sYXN0TmFtZTtcbiAgICB9XG4gICAgdGhpcy5tZXRhRGF0YSA9IHtcbiAgICAgIHBhZ2VzSGlzdG9yeTogW10sXG4gICAgICB0b3RhbFBhZ2VzOiAwLFxuICAgICAgZHVyYXRpb246IDAsXG4gICAgICByb3RhdGlvbjogW10sXG4gICAgICBwcm9ncmVzc0JhcjogW10sXG4gICAgICBxdWVzdGlvbnM6IFtdLFxuICAgICAgcXVlc3Rpb25JZHM6IFtdLFxuICAgICAgbGFzdFF1ZXN0aW9uSWQ6ICcnLFxuICAgIH07XG4gICAgdGhpcy5sb2FkaW5nUHJvZ3Jlc3MgPSAwO1xuICAgIHRoaXMuZW5kUGFnZVNlZW4gPSBmYWxzZTtcbiAgfVxuXG4gIHJhaXNlU3RhcnRFdmVudChjdXJyZW50UXVlc3Rpb25JbmRleCkge1xuICAgIHRoaXMuY3VycmVudFF1ZXN0aW9uSW5kZXggPSBjdXJyZW50UXVlc3Rpb25JbmRleDtcbiAgICBjb25zdCBkdXJhdGlvbiA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gdGhpcy5xdW1sUGxheWVyU3RhcnRUaW1lO1xuICAgIGNvbnN0IHN0YXJ0RXZlbnQ6IGFueSA9IHtcbiAgICAgIGVpZDogJ1NUQVJUJyxcbiAgICAgIHZlcjogdGhpcy52ZXJzaW9uLFxuICAgICAgZWRhdGE6IHtcbiAgICAgICAgdHlwZTogJ1NUQVJUJyxcbiAgICAgICAgY3VycmVudEluZGV4OiB0aGlzLmN1cnJlbnRRdWVzdGlvbkluZGV4LFxuICAgICAgICBkdXJhdGlvblxuICAgICAgfSxcbiAgICAgIG1ldGFEYXRhOiB0aGlzLm1ldGFEYXRhXG4gICAgfTtcblxuICAgIHRoaXMucXVtbFBsYXllckV2ZW50LmVtaXQoc3RhcnRFdmVudCk7XG4gICAgdGhpcy5xdW1sUGxheWVyTGFzdFBhZ2VUaW1lID0gdGhpcy5xdW1sUGxheWVyU3RhcnRUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgdGhpcy5xdW1sTGlicmFyeVNlcnZpY2Uuc3RhcnQoZHVyYXRpb24pO1xuICB9XG5cbiAgcmFpc2VFbmRFdmVudChjdXJyZW50UXVlc3Rpb25JbmRleCwgIGVuZFBhZ2VTZWVuICwgc2NvcmUpIHtcbiAgICB0aGlzLm1ldGFEYXRhLnF1ZXN0aW9ucyA9IHRoaXMuc2VjdGlvblF1ZXN0aW9ucztcbiAgICBjb25zdCBkdXJhdGlvbiA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gdGhpcy5xdW1sUGxheWVyU3RhcnRUaW1lO1xuICAgIGNvbnN0IGVuZEV2ZW50OiBhbnkgPSB7XG4gICAgICBlaWQ6ICdFTkQnLFxuICAgICAgdmVyOiB0aGlzLnZlcnNpb24sXG4gICAgICBlZGF0YToge1xuICAgICAgICB0eXBlOiAnRU5EJyxcbiAgICAgICAgY3VycmVudFBhZ2U6IGN1cnJlbnRRdWVzdGlvbkluZGV4LFxuICAgICAgICB0b3RhbFBhZ2VzOiB0aGlzLnRvdGFsTnVtYmVyT2ZRdWVzdGlvbnMsXG4gICAgICAgIGR1cmF0aW9uXG4gICAgICB9LFxuICAgICAgbWV0YURhdGE6IHRoaXMubWV0YURhdGFcbiAgICB9O1xuXG4gICAgdGhpcy5xdW1sUGxheWVyRXZlbnQuZW1pdChlbmRFdmVudCk7XG4gICAgY29uc3QgdmlzaXRlZGxlbmd0aCA9ICh0aGlzLm1ldGFEYXRhLnBhZ2VzSGlzdG9yeS5maWx0ZXIoKHYsIGksIGEpID0+IGEuaW5kZXhPZih2KSA9PT0gaSkpLmxlbmd0aDtcbiAgICB0aGlzLnRpbWVTcGVudCA9IHRoaXMudXRpbFNlcnZpY2UuZ2V0VGltZVNwZW50VGV4dCh0aGlzLnF1bWxQbGF5ZXJTdGFydFRpbWUpO1xuICAgIHRoaXMucXVtbExpYnJhcnlTZXJ2aWNlLmVuZChkdXJhdGlvbiwgY3VycmVudFF1ZXN0aW9uSW5kZXgsIHRoaXMudG90YWxOdW1iZXJPZlF1ZXN0aW9ucywgdGhpcy50b3RhbE51bWJlck9mUXVlc3Rpb25zLCBlbmRQYWdlU2VlbiAsIHNjb3JlKTtcbiAgfVxuXG4gIHJhaXNlSGVhcnRCZWF0RXZlbnQodHlwZTogc3RyaW5nLCB0ZWxlbWV0cnlUeXBlOiBzdHJpbmcsIHBhZ2VJZDogYW55KSB7XG4gICAgY29uc3QgaGVhckJlYXRFdmVudDogYW55ID0ge1xuICAgICAgZWlkOiAnSEVBUlRCRUFUJyxcbiAgICAgIHZlcjogdGhpcy52ZXJzaW9uLFxuICAgICAgZWRhdGE6IHtcbiAgICAgICAgdHlwZSxcbiAgICAgICAgcXVlc3Rpb25JbmRleDogdGhpcy5jdXJyZW50UXVlc3Rpb25JbmRleCxcbiAgICAgIH0sXG4gICAgICBtZXRhRGF0YTogdGhpcy5tZXRhRGF0YVxuICAgIH07XG5cbiAgICBpZiAodGhpcy5pc1NlY3Rpb25zQXZhaWxhYmxlKSB7XG4gICAgICBoZWFyQmVhdEV2ZW50LmVkYXRhLnNlY3Rpb25JZCA9IHRoaXMucXVlc3Rpb25TZXRJZDtcbiAgICB9XG5cbiAgICB0aGlzLnF1bWxQbGF5ZXJFdmVudC5lbWl0KGhlYXJCZWF0RXZlbnQpO1xuICAgIGlmIChUZWxlbWV0cnlUeXBlLmludGVyYWN0ID09PSB0ZWxlbWV0cnlUeXBlKSB7XG4gICAgICB0aGlzLnF1bWxMaWJyYXJ5U2VydmljZS5pbnRlcmFjdCh0eXBlLnRvTG93ZXJDYXNlKCksIHBhZ2VJZCk7XG4gICAgfSBlbHNlIGlmIChUZWxlbWV0cnlUeXBlLmltcHJlc3Npb24gPT09IHRlbGVtZXRyeVR5cGUpIHtcbiAgICAgIHRoaXMucXVtbExpYnJhcnlTZXJ2aWNlLmltcHJlc3Npb24ocGFnZUlkKTtcbiAgICB9XG5cbiAgfVxuXG4gIHJhaXNlQXNzZXNFdmVudChxdWVzdGlvbkRhdGEgLCBpbmRleCAsIHBhc3MgLCBzY29yZSAsIHJlc1ZhbHVlcyAsIGR1cmF0aW9uKXtcbiAgICBjb25zdCBhc3Nlc3NFdmVudCA9IHtcbiAgICAgICAgICBpdGVtOiBxdWVzdGlvbkRhdGEsXG4gICAgICAgICAgaW5kZXg6IGluZGV4LFxuICAgICAgICAgIHBhc3M6IHBhc3MsIFxuICAgICAgICAgIHNjb3JlOiBzY29yZSwgXG4gICAgICAgICAgcmVzdmFsdWVzOiByZXNWYWx1ZXMsIFxuICAgICAgICAgIGR1cmF0aW9uOiBkdXJhdGlvbiBcbiAgICB9XG4gICAgdGhpcy5xdW1sUGxheWVyRXZlbnQuZW1pdChhc3Nlc3NFdmVudCk7XG4gICAgdGhpcy5xdW1sTGlicmFyeVNlcnZpY2Uuc3RhcnRBc3Nlc0V2ZW50KGFzc2Vzc0V2ZW50KTtcbiAgfVxuXG4gIHJhaXNlUmVzcG9uc2VFdmVudChpZGVudGlmaWVyICwgcVR5cGUgLCBvcHRpb25TZWxlY3RlZCl7XG4gICAgY29uc3QgcmVzcG9uc2VFdmVudCA9IHtcbiAgICAgICAgdGFyZ2V0OiB7XG4gICAgICAgICAgaWQ6IGlkZW50aWZpZXIsXG4gICAgICAgICAgdmVyOiB0aGlzLnZlcnNpb24sXG4gICAgICAgICAgdHlwZTogcVR5cGVcbiAgICAgICAgfSxcbiAgICAgICAgdmFsdWVzOiBbe1xuICAgICAgICAgIG9wdGlvblNlbGVjdGVkXG4gICAgICAgIH1dXG4gICAgfVxuICAgIHRoaXMucXVtbFBsYXllckV2ZW50LmVtaXQocmVzcG9uc2VFdmVudCk7XG4gICAgdGhpcy5xdW1sTGlicmFyeVNlcnZpY2UucmVzcG9uc2UoaWRlbnRpZmllciwgdGhpcy52ZXJzaW9uICwgcVR5cGUgLCBvcHRpb25TZWxlY3RlZCk7XG4gIH1cblxuICByYWlzZVN1bW1hcnlFdmVudChjdXJyZW50UXVlc3Rpb25JbmRleCwgZW5kcGFnZXNlZW4sIHNjb3JlLCBzdW1tYXJ5T2JqKSB7XG4gICAgbGV0IHRpbWVzcGVudCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gdGhpcy5xdW1sUGxheWVyU3RhcnRUaW1lO1xuICAgIHRpbWVzcGVudCA9IE51bWJlcigoKHRpbWVzcGVudCAlIDYwMDAwKSAvIDEwMDApLnRvRml4ZWQoMikpXG4gICAgY29uc3QgZURhdGEgPSB7XG4gICAgICB0eXBlOiBcImNvbnRlbnRcIixcbiAgICAgIG1vZGU6IFwicGxheVwiLFxuICAgICAgc3RhcnR0aW1lOiB0aGlzLnF1bWxQbGF5ZXJTdGFydFRpbWUsXG4gICAgICBlbmR0aW1lOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSxcbiAgICAgIHRpbWVzcGVudCxcbiAgICAgIHBhZ2V2aWV3czogdGhpcy50b3RhbE51bWJlck9mUXVlc3Rpb25zLFxuICAgICAgaW50ZXJhY3Rpb25zOiBzdW1tYXJ5T2JqLmNvcnJlY3QgKyBzdW1tYXJ5T2JqLndyb25nICsgc3VtbWFyeU9iai5wYXJ0aWFsLFxuICAgICAgZXh0cmE6IFt7XG4gICAgICAgIGlkOiBcInByb2dyZXNzXCIsXG4gICAgICAgIHZhbHVlOiAoKGN1cnJlbnRRdWVzdGlvbkluZGV4IC8gdGhpcy50b3RhbE51bWJlck9mUXVlc3Rpb25zKSAqIDEwMCkudG9GaXhlZCgwKS50b1N0cmluZygpXG4gICAgICB9LCB7XG4gICAgICAgIGlkOiBcImVuZHBhZ2VzZWVuXCIsXG4gICAgICAgIHZhbHVlOiBlbmRwYWdlc2Vlbi50b1N0cmluZygpXG4gICAgICB9LCB7XG4gICAgICAgIGlkOiBcInNjb3JlXCIsXG4gICAgICAgIHZhbHVlOiBzY29yZS50b1N0cmluZygpXG4gICAgICB9LCB7XG4gICAgICAgIGlkOiBcImNvcnJlY3RcIixcbiAgICAgICAgdmFsdWU6IHN1bW1hcnlPYmouY29ycmVjdC50b1N0cmluZygpXG4gICAgICB9LCB7XG4gICAgICAgIGlkOiBcImluY29ycmVjdFwiLFxuICAgICAgICB2YWx1ZTogc3VtbWFyeU9iai53cm9uZy50b1N0cmluZygpXG4gICAgICB9LCB7XG4gICAgICAgIGlkOiBcInBhcnRpYWxcIixcbiAgICAgICAgdmFsdWU6IHN1bW1hcnlPYmoucGFydGlhbC50b1N0cmluZygpXG4gICAgICB9LCB7XG4gICAgICAgIGlkOiBcInNraXBwZWRcIixcbiAgICAgICAgdmFsdWU6IHN1bW1hcnlPYmouc2tpcHBlZC50b1N0cmluZygpXG4gICAgICB9XVxuICAgIH07XG4gICAgY29uc3Qgc3VtbWFyeUV2ZW50ID0ge1xuICAgICAgZWlkOiAnUVVNTF9TVU1NQVJZJyxcbiAgICAgIHZlcjogdGhpcy52ZXJzaW9uLFxuICAgICAgZWRhdGE6IGVEYXRhLFxuICAgICAgbWV0YURhdGE6IHRoaXMubWV0YURhdGFcbiAgICB9O1xuICAgIHRoaXMucXVtbFBsYXllckV2ZW50LmVtaXQoc3VtbWFyeUV2ZW50KTtcbiAgICB0aGlzLnF1bWxMaWJyYXJ5U2VydmljZS5zdW1tYXJ5KGVEYXRhKTtcbiAgfVxuXG4gIHJhaXNlRXhjZXB0aW9uTG9nKGVycm9yQ29kZTogc3RyaW5nICwgZXJyb3JUeXBlOiBzdHJpbmcgLCBzdGFja3RyYWNlICwgdHJhY2VJZCApIHtcbiAgICBjb25zdCBleGNlcHRpb25Mb2dFdmVudCA9IHtcbiAgICAgIGVpZDogXCJFUlJPUlwiLFxuICAgICAgZWRhdGE6IHtcbiAgICAgICAgICBlcnI6IGVycm9yQ29kZSxcbiAgICAgICAgICBlcnJ0eXBlOiBlcnJvclR5cGUsXG4gICAgICAgICAgcmVxdWVzdGlkOiB0cmFjZUlkIHx8ICcnLFxuICAgICAgICAgIHN0YWNrdHJhY2U6IHN0YWNrdHJhY2UgfHwgJycsXG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMucXVtbFBsYXllckV2ZW50LmVtaXQoZXhjZXB0aW9uTG9nRXZlbnQpXG4gICAgdGhpcy5xdW1sTGlicmFyeVNlcnZpY2UuZXJyb3Ioc3RhY2t0cmFjZSwgeyBlcnI6IGVycm9yQ29kZSwgZXJydHlwZTogZXJyb3JUeXBlIH0pO1xuICB9XG5cblxuICBnZXRRdWVzdGlvbnMoY3VycmVudEluZGV4PzogbnVtYmVyICAsIGluZGV4PzogbnVtYmVyKSB7XG4gICAgbGV0IGluZGVudGlmZXJzRm9yUXVlc3Rpb25zO1xuICAgIGlmKGN1cnJlbnRJbmRleCAhPT0gdW5kZWZpbmVkICYmIGluZGV4KSB7XG4gICAgICBpbmRlbnRpZmVyc0ZvclF1ZXN0aW9ucyA9IHRoaXMuaWRlbnRpZmllcnMuc3BsaWNlKGN1cnJlbnRJbmRleCwgaW5kZXgpO1xuICAgIH1lbHNlIGlmKCFjdXJyZW50SW5kZXggJiYgIWluZGV4KXtcbiAgICAgIGluZGVudGlmZXJzRm9yUXVlc3Rpb25zID0gdGhpcy5pZGVudGlmaWVycy5zcGxpY2UoMCwgdGhpcy50aHJlc2hvbGQpO1xuICAgIH1cbiAgICBpZighXy5pc0VtcHR5KGluZGVudGlmZXJzRm9yUXVlc3Rpb25zKSkge1xuICAgICAgY29uc3QgcmVxdWVzdHMgPSBbXTtcbiAgICAgIGNvbnN0IGNodW5rQXJyYXkgPSBfLmNodW5rKGluZGVudGlmZXJzRm9yUXVlc3Rpb25zLCAxMCk7XG4gICAgICBfLmZvckVhY2goY2h1bmtBcnJheSwgKHZhbHVlKSA9PiB7XG4gICAgICAgIHJlcXVlc3RzLnB1c2godGhpcy5xdWVzdGlvbkN1cnNvci5nZXRRdWVzdGlvbnModmFsdWUsIHRoaXMucGFyZW50SWRlbnRpZmllcikpO1xuICAgICAgfSk7XG4gICAgICBmb3JrSm9pbihyZXF1ZXN0cykuc3Vic2NyaWJlKHF1ZXN0aW9ucyA9PiB7XG4gICAgICAgIF8uZm9yRWFjaChxdWVzdGlvbnMsICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIHRoaXMucXVtbFF1ZXN0aW9uRXZlbnQuZW1pdCh2YWx1ZSk7XG4gICAgICAgIH0pO1xuICAgICAgfSwoZXJyb3IpPT57XG4gICAgICAgICAgdGhpcy5xdW1sUXVlc3Rpb25FdmVudC5lbWl0KHtcbiAgICAgICAgICAgIGVycm9yOiBlcnJvclxuICAgICAgICAgIH0pXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBnZXRRdWVzdGlvbigpIHtcbiAgICBsZXQgaW5kZW50aWZlckZvclF1ZXN0aW9uID0gdGhpcy5pZGVudGlmaWVycy5zcGxpY2UoMCwgdGhpcy50aHJlc2hvbGQpO1xuICAgICAgdGhpcy5xdWVzdGlvbkN1cnNvci5nZXRRdWVzdGlvbihpbmRlbnRpZmVyRm9yUXVlc3Rpb24pLnN1YnNjcmliZSgocXVlc3Rpb24pID0+IHtcbiAgICAgICAgdGhpcy5xdW1sUXVlc3Rpb25FdmVudC5lbWl0KHF1ZXN0aW9uKTtcbiAgICAgIH0sKGVycm9yKT0+e1xuICAgICAgICB0aGlzLnF1bWxRdWVzdGlvbkV2ZW50LmVtaXQoe1xuICAgICAgICAgIGVycm9yOiBlcnJvclxuICAgICAgICB9KVxuICAgIH0pXG4gIH1cblxuICBnZW5lcmF0ZU1heEF0dGVtcHRFdmVudHMoY3VycmVudGF0dGVtcHQ6IG51bWJlciwgbWF4TGltaXRFeGNlZWRlZDogYm9vbGVhbiwgaXNMYXN0QXR0ZW1wdDogYm9vbGVhbikge1xuICAgIHJldHVybiB7XG4gICAgICBlaWQ6ICdleGRhdGEnLFxuICAgICAgdmVyOiB0aGlzLnZlcnNpb24sXG4gICAgICBlZGF0YToge1xuICAgICAgICB0eXBlOiAnZXhkYXRhJyxcbiAgICAgICAgY3VycmVudGF0dGVtcHQsXG4gICAgICAgIG1heExpbWl0RXhjZWVkZWQsXG4gICAgICAgIGlzTGFzdEF0dGVtcHRcbiAgICAgIH0sXG4gICAgICBtZXRhRGF0YTogdGhpcy5tZXRhRGF0YVxuICAgIH07XG4gIH1cblxuICB1cGRhdGVTZWN0aW9uUXVlc3Rpb25zKGlkOiBzdHJpbmcsIHF1ZXN0aW9ucykge1xuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5zZWN0aW9uUXVlc3Rpb25zLmZpbmRJbmRleChzZWN0aW9uID0+IHNlY3Rpb24uaWQgPT09IGlkKTtcbiAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgdGhpcy5zZWN0aW9uUXVlc3Rpb25zW2luZGV4XS5xdWVzdGlvbnMgPSBxdWVzdGlvbnM7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2VjdGlvblF1ZXN0aW9ucy5wdXNoKHsgaWQsIHF1ZXN0aW9ucyB9KTtcbiAgICB9XG4gIH1cblxuICBnZXRTZWN0aW9uUXVlc3Rpb25zKGlkOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdGhpcy5zZWN0aW9uUXVlc3Rpb25zLmZpbmQoc2VjdGlvbiA9PiBzZWN0aW9uLmlkID09PSBpZCk/LnF1ZXN0aW9ucyB8fCBbXTtcbiAgfVxufVxuIl19