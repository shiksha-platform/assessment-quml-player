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
var ViewerService = /** @class */ (function () {
    function ViewerService(qumlLibraryService, utilService, questionCursor) {
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
    ViewerService.prototype.initialize = /**
     * @param {?} config
     * @param {?} threshold
     * @param {?} questionIds
     * @param {?} parentConfig
     * @return {?}
     */
    function (config, threshold, questionIds, parentConfig) {
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
    };
    /**
     * @param {?} currentQuestionIndex
     * @return {?}
     */
    ViewerService.prototype.raiseStartEvent = /**
     * @param {?} currentQuestionIndex
     * @return {?}
     */
    function (currentQuestionIndex) {
        this.currentQuestionIndex = currentQuestionIndex;
        /** @type {?} */
        var duration = new Date().getTime() - this.qumlPlayerStartTime;
        /** @type {?} */
        var startEvent = {
            eid: 'START',
            ver: this.version,
            edata: {
                type: 'START',
                currentIndex: this.currentQuestionIndex,
                duration: duration
            },
            metaData: this.metaData
        };
        this.qumlPlayerEvent.emit(startEvent);
        this.qumlPlayerLastPageTime = this.qumlPlayerStartTime = new Date().getTime();
        this.qumlLibraryService.start(duration);
    };
    /**
     * @param {?} currentQuestionIndex
     * @param {?} endPageSeen
     * @param {?} score
     * @return {?}
     */
    ViewerService.prototype.raiseEndEvent = /**
     * @param {?} currentQuestionIndex
     * @param {?} endPageSeen
     * @param {?} score
     * @return {?}
     */
    function (currentQuestionIndex, endPageSeen, score) {
        this.metaData.questions = this.sectionQuestions;
        /** @type {?} */
        var duration = new Date().getTime() - this.qumlPlayerStartTime;
        /** @type {?} */
        var endEvent = {
            eid: 'END',
            ver: this.version,
            edata: {
                type: 'END',
                currentPage: currentQuestionIndex,
                totalPages: this.totalNumberOfQuestions,
                duration: duration
            },
            metaData: this.metaData
        };
        this.qumlPlayerEvent.emit(endEvent);
        /** @type {?} */
        var visitedlength = (this.metaData.pagesHistory.filter((/**
         * @param {?} v
         * @param {?} i
         * @param {?} a
         * @return {?}
         */
        function (v, i, a) { return a.indexOf(v) === i; }))).length;
        this.timeSpent = this.utilService.getTimeSpentText(this.qumlPlayerStartTime);
        this.qumlLibraryService.end(duration, currentQuestionIndex, this.totalNumberOfQuestions, this.totalNumberOfQuestions, endPageSeen, score);
    };
    /**
     * @param {?} type
     * @param {?} telemetryType
     * @param {?} pageId
     * @return {?}
     */
    ViewerService.prototype.raiseHeartBeatEvent = /**
     * @param {?} type
     * @param {?} telemetryType
     * @param {?} pageId
     * @return {?}
     */
    function (type, telemetryType, pageId) {
        /** @type {?} */
        var hearBeatEvent = {
            eid: 'HEARTBEAT',
            ver: this.version,
            edata: {
                type: type,
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
    };
    /**
     * @param {?} questionData
     * @param {?} index
     * @param {?} pass
     * @param {?} score
     * @param {?} resValues
     * @param {?} duration
     * @return {?}
     */
    ViewerService.prototype.raiseAssesEvent = /**
     * @param {?} questionData
     * @param {?} index
     * @param {?} pass
     * @param {?} score
     * @param {?} resValues
     * @param {?} duration
     * @return {?}
     */
    function (questionData, index, pass, score, resValues, duration) {
        /** @type {?} */
        var assessEvent = {
            item: questionData,
            index: index,
            pass: pass,
            score: score,
            resvalues: resValues,
            duration: duration
        };
        this.qumlPlayerEvent.emit(assessEvent);
        this.qumlLibraryService.startAssesEvent(assessEvent);
    };
    /**
     * @param {?} identifier
     * @param {?} qType
     * @param {?} optionSelected
     * @return {?}
     */
    ViewerService.prototype.raiseResponseEvent = /**
     * @param {?} identifier
     * @param {?} qType
     * @param {?} optionSelected
     * @return {?}
     */
    function (identifier, qType, optionSelected) {
        /** @type {?} */
        var responseEvent = {
            target: {
                id: identifier,
                ver: this.version,
                type: qType
            },
            values: [{
                    optionSelected: optionSelected
                }]
        };
        this.qumlPlayerEvent.emit(responseEvent);
        this.qumlLibraryService.response(identifier, this.version, qType, optionSelected);
    };
    /**
     * @param {?} currentQuestionIndex
     * @param {?} endpageseen
     * @param {?} score
     * @param {?} summaryObj
     * @return {?}
     */
    ViewerService.prototype.raiseSummaryEvent = /**
     * @param {?} currentQuestionIndex
     * @param {?} endpageseen
     * @param {?} score
     * @param {?} summaryObj
     * @return {?}
     */
    function (currentQuestionIndex, endpageseen, score, summaryObj) {
        /** @type {?} */
        var timespent = new Date().getTime() - this.qumlPlayerStartTime;
        timespent = Number(((timespent % 60000) / 1000).toFixed(2));
        /** @type {?} */
        var eData = {
            type: "content",
            mode: "play",
            starttime: this.qumlPlayerStartTime,
            endtime: new Date().getTime(),
            timespent: timespent,
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
        var summaryEvent = {
            eid: 'QUML_SUMMARY',
            ver: this.version,
            edata: eData,
            metaData: this.metaData
        };
        this.qumlPlayerEvent.emit(summaryEvent);
        this.qumlLibraryService.summary(eData);
    };
    /**
     * @param {?} errorCode
     * @param {?} errorType
     * @param {?} stacktrace
     * @param {?} traceId
     * @return {?}
     */
    ViewerService.prototype.raiseExceptionLog = /**
     * @param {?} errorCode
     * @param {?} errorType
     * @param {?} stacktrace
     * @param {?} traceId
     * @return {?}
     */
    function (errorCode, errorType, stacktrace, traceId) {
        /** @type {?} */
        var exceptionLogEvent = {
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
    };
    /**
     * @param {?=} currentIndex
     * @param {?=} index
     * @return {?}
     */
    ViewerService.prototype.getQuestions = /**
     * @param {?=} currentIndex
     * @param {?=} index
     * @return {?}
     */
    function (currentIndex, index) {
        var _this = this;
        /** @type {?} */
        var indentifersForQuestions;
        if (currentIndex !== undefined && index) {
            indentifersForQuestions = this.identifiers.splice(currentIndex, index);
        }
        else if (!currentIndex && !index) {
            indentifersForQuestions = this.identifiers.splice(0, this.threshold);
        }
        if (!_.isEmpty(indentifersForQuestions)) {
            /** @type {?} */
            var requests_1 = [];
            /** @type {?} */
            var chunkArray = _.chunk(indentifersForQuestions, 10);
            _.forEach(chunkArray, (/**
             * @param {?} value
             * @return {?}
             */
            function (value) {
                requests_1.push(_this.questionCursor.getQuestions(value, _this.parentIdentifier));
            }));
            forkJoin(requests_1).subscribe((/**
             * @param {?} questions
             * @return {?}
             */
            function (questions) {
                _.forEach(questions, (/**
                 * @param {?} value
                 * @return {?}
                 */
                function (value) {
                    _this.qumlQuestionEvent.emit(value);
                }));
            }), (/**
             * @param {?} error
             * @return {?}
             */
            function (error) {
                _this.qumlQuestionEvent.emit({
                    error: error
                });
            }));
        }
    };
    /**
     * @return {?}
     */
    ViewerService.prototype.getQuestion = /**
     * @return {?}
     */
    function () {
        var _this = this;
        /** @type {?} */
        var indentiferForQuestion = this.identifiers.splice(0, this.threshold);
        this.questionCursor.getQuestion(indentiferForQuestion).subscribe((/**
         * @param {?} question
         * @return {?}
         */
        function (question) {
            _this.qumlQuestionEvent.emit(question);
        }), (/**
         * @param {?} error
         * @return {?}
         */
        function (error) {
            _this.qumlQuestionEvent.emit({
                error: error
            });
        }));
    };
    /**
     * @param {?} currentattempt
     * @param {?} maxLimitExceeded
     * @param {?} isLastAttempt
     * @return {?}
     */
    ViewerService.prototype.generateMaxAttemptEvents = /**
     * @param {?} currentattempt
     * @param {?} maxLimitExceeded
     * @param {?} isLastAttempt
     * @return {?}
     */
    function (currentattempt, maxLimitExceeded, isLastAttempt) {
        return {
            eid: 'exdata',
            ver: this.version,
            edata: {
                type: 'exdata',
                currentattempt: currentattempt,
                maxLimitExceeded: maxLimitExceeded,
                isLastAttempt: isLastAttempt
            },
            metaData: this.metaData
        };
    };
    /**
     * @param {?} id
     * @param {?} questions
     * @return {?}
     */
    ViewerService.prototype.updateSectionQuestions = /**
     * @param {?} id
     * @param {?} questions
     * @return {?}
     */
    function (id, questions) {
        /** @type {?} */
        var index = this.sectionQuestions.findIndex((/**
         * @param {?} section
         * @return {?}
         */
        function (section) { return section.id === id; }));
        if (index > -1) {
            this.sectionQuestions[index].questions = questions;
        }
        else {
            this.sectionQuestions.push({ id: id, questions: questions });
        }
    };
    /**
     * @param {?} id
     * @return {?}
     */
    ViewerService.prototype.getSectionQuestions = /**
     * @param {?} id
     * @return {?}
     */
    function (id) {
        var _a;
        return ((_a = this.sectionQuestions.find((/**
         * @param {?} section
         * @return {?}
         */
        function (section) { return section.id === id; }))) === null || _a === void 0 ? void 0 : _a.questions) || [];
    };
    ViewerService.decorators = [
        { type: Injectable, args: [{
                    providedIn: 'root'
                },] }
    ];
    /** @nocollapse */
    ViewerService.ctorParameters = function () { return [
        { type: QumlLibraryService },
        { type: UtilService },
        { type: QuestionCursor }
    ]; };
    /** @nocollapse */ ViewerService.ɵprov = i0.ɵɵdefineInjectable({ factory: function ViewerService_Factory() { return new ViewerService(i0.ɵɵinject(i1.QumlLibraryService), i0.ɵɵinject(i2.UtilService), i0.ɵɵinject(i3.QuestionCursor)); }, token: ViewerService, providedIn: "root" });
    return ViewerService;
}());
export { ViewerService };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlld2VyLXNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AcHJvamVjdC1zdW5iaXJkL3N1bmJpcmQtcXVtbC1wbGF5ZXItdjkvIiwic291cmNlcyI6WyJsaWIvc2VydmljZXMvdmlld2VyLXNlcnZpY2Uvdmlld2VyLXNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUV6RCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUNoRSxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDakQsT0FBTyxFQUFhLGFBQWEsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQ3JFLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQUNwRSxPQUFPLEtBQUssQ0FBQyxNQUFNLFdBQVcsQ0FBQztBQUMvQixPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sTUFBTSxDQUFDOzs7OztBQUVoQztJQTRCRSx1QkFDUyxrQkFBc0MsRUFDdEMsV0FBd0IsRUFDeEIsY0FBOEI7UUFGOUIsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUFvQjtRQUN0QyxnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUN4QixtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7UUEzQmhDLG9CQUFlLEdBQUcsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUMxQyxzQkFBaUIsR0FBRyxJQUFJLFlBQVksRUFBTyxDQUFDO1FBVW5ELFlBQU8sR0FBRyxLQUFLLENBQUM7UUFDaEIsY0FBUyxHQUFHLEtBQUssQ0FBQztRQU1sQix1QkFBa0IsR0FBRyxLQUFLLENBQUM7UUFDM0Isd0JBQW1CLEdBQUcsS0FBSyxDQUFDO1FBRzVCLHFCQUFnQixHQUFHLEVBQUUsQ0FBQztJQU1sQixDQUFDOzs7Ozs7OztJQUVMLGtDQUFVOzs7Ozs7O0lBQVYsVUFBVyxNQUF3QixFQUFHLFNB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LCtDQUErQjs7SUFDL0IsNkNBQTZCOztJQUM3QixvQ0FBb0I7O0lBQ3BCLDRCQUFZOztJQUNaLGlDQUFpQjs7SUFDakIsZ0NBQWdCOztJQUNoQixrQ0FBa0I7O0lBQ2xCLGlDQUFjOztJQUNkLHdDQUF3Qjs7SUFDeEIsb0NBQXFCOztJQUNyQixvQ0FBaUI7O0lBQ2pCLGtDQUFrQjs7SUFDbEIsMkNBQTJCOztJQUMzQiw0Q0FBNEI7O0lBQzVCLHNDQUFzQjs7SUFDdEIseUNBQXlCOztJQUN6Qix5Q0FBc0I7O0lBR3BCLDJDQUE2Qzs7SUFDN0Msb0NBQStCOztJQUMvQix1Q0FBcUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFdmVudEVtaXR0ZXIsIEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IElQYXJlbnRDb25maWcsIFF1bWxQbGF5ZXJDb25maWcgfSBmcm9tICcuLi8uLi9xdW1sLWxpYnJhcnktaW50ZXJmYWNlJztcbmltcG9ydCB7IFF1bWxMaWJyYXJ5U2VydmljZSB9IGZyb20gJy4uLy4uL3F1bWwtbGlicmFyeS5zZXJ2aWNlJztcbmltcG9ydCB7IFV0aWxTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vdXRpbC1zZXJ2aWNlJztcbmltcG9ydCB7IGV2ZW50TmFtZSwgVGVsZW1ldHJ5VHlwZSB9IGZyb20gJy4uLy4uL3RlbGVtZXRyeS1jb25zdGFudHMnO1xuaW1wb3J0IHsgUXVlc3Rpb25DdXJzb3IgfSBmcm9tICcuLi8uLi9xdW1sLXF1ZXN0aW9uLWN1cnNvci5zZXJ2aWNlJztcbmltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoLWVzJztcbmltcG9ydCB7IGZvcmtKb2luIH0gZnJvbSAncnhqcyc7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIFZpZXdlclNlcnZpY2Uge1xuICBwdWJsaWMgcXVtbFBsYXllckV2ZW50ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIHB1YmxpYyBxdW1sUXVlc3Rpb25FdmVudCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICB6b29tOiBzdHJpbmc7XG4gIHJvdGF0aW9uOiBudW1iZXI7XG4gIHF1bWxQbGF5ZXJTdGFydFRpbWU6IG51bWJlcjtcbiAgcXVtbFBsYXllckxhc3RQYWdlVGltZTogbnVtYmVyO1xuICB0b3RhbE51bWJlck9mUXVlc3Rpb25zOiBudW1iZXI7XG4gIGN1cnJlbnRRdWVzdGlvbkluZGV4OiBudW1iZXI7XG4gIGNvbnRlbnROYW1lOiBzdHJpbmc7XG4gIHNyYzogc3RyaW5nO1xuICB1c2VyTmFtZTogc3RyaW5nO1xuICB2ZXJzaW9uID0gJzEuMCc7XG4gIHRpbWVTcGVudCA9ICcwOjAnO1xuICBtZXRhRGF0YTogYW55O1xuICBsb2FkaW5nUHJvZ3Jlc3M6IG51bWJlcjtcbiAgZW5kUGFnZVNlZW46IGJvb2xlYW47XG4gIGlkZW50aWZpZXJzOiBhbnk7XG4gIHRocmVzaG9sZDogbnVtYmVyO1xuICBpc0F2YWlsYWJsZUxvY2FsbHkgPSBmYWxzZTtcbiAgaXNTZWN0aW9uc0F2YWlsYWJsZSA9IGZhbHNlO1xuICBxdWVzdGlvblNldElkOiBzdHJpbmc7XG4gIHBhcmVudElkZW50aWZpZXI6IHN0cmluZztcbiAgc2VjdGlvblF1ZXN0aW9ucyA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBxdW1sTGlicmFyeVNlcnZpY2U6IFF1bWxMaWJyYXJ5U2VydmljZSxcbiAgICBwdWJsaWMgdXRpbFNlcnZpY2U6IFV0aWxTZXJ2aWNlLFxuICAgIHB1YmxpYyBxdWVzdGlvbkN1cnNvcjogUXVlc3Rpb25DdXJzb3JcbiAgKSB7IH1cblxuICBpbml0aWFsaXplKGNvbmZpZzogUXVtbFBsYXllckNvbmZpZyAsIHRocmVzaG9sZDogbnVtYmVyLCBxdWVzdGlvbklkczogc3RyaW5nW10sIHBhcmVudENvbmZpZzogSVBhcmVudENvbmZpZykge1xuICAgIHRoaXMucXVtbExpYnJhcnlTZXJ2aWNlLmluaXRpYWxpemVUZWxlbWV0cnkoY29uZmlnLCBwYXJlbnRDb25maWcpO1xuICAgIHRoaXMuaWRlbnRpZmllcnMgPSBfLmNsb25lRGVlcChxdWVzdGlvbklkcyk7XG4gICAgdGhpcy5wYXJlbnRJZGVudGlmaWVyID0gY29uZmlnLm1ldGFkYXRhLmlkZW50aWZpZXI7XG4gICAgdGhpcy50aHJlc2hvbGQgPSB0aHJlc2hvbGQ7XG4gICAgdGhpcy5yb3RhdGlvbiA9IDA7XG4gICAgdGhpcy50b3RhbE51bWJlck9mUXVlc3Rpb25zID0gY29uZmlnLm1ldGFkYXRhLmNoaWxkTm9kZXMubGVuZ3RoIHx8IDA7XG4gICAgdGhpcy5xdW1sUGxheWVyU3RhcnRUaW1lID0gdGhpcy5xdW1sUGxheWVyTGFzdFBhZ2VUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgdGhpcy5jdXJyZW50UXVlc3Rpb25JbmRleCA9IDE7XG4gICAgdGhpcy5jb250ZW50TmFtZSA9IGNvbmZpZy5tZXRhZGF0YS5uYW1lO1xuICAgIHRoaXMuaXNBdmFpbGFibGVMb2NhbGx5ID0gY29uZmlnLm1ldGFkYXRhLmlzQXZhaWxhYmxlTG9jYWxseTtcbiAgICB0aGlzLmlzU2VjdGlvbnNBdmFpbGFibGUgPSBwYXJlbnRDb25maWc/LmlzU2VjdGlvbnNBdmFpbGFibGU7XG4gICAgdGhpcy5zcmMgPSBjb25maWcubWV0YWRhdGEuYXJ0aWZhY3RVcmwgfHwgJyc7XG4gICAgdGhpcy5xdWVzdGlvblNldElkID0gY29uZmlnLm1ldGFkYXRhLmlkZW50aWZpZXI7XG5cbiAgICBpZiAoY29uZmlnLmNvbnRleHQudXNlckRhdGEpIHtcbiAgICAgIHRoaXMudXNlck5hbWUgPSBjb25maWcuY29udGV4dC51c2VyRGF0YS5maXJzdE5hbWUgKyAnICcgKyBjb25maWcuY29udGV4dC51c2VyRGF0YS5sYXN0TmFtZTtcbiAgICB9XG4gICAgdGhpcy5tZXRhRGF0YSA9IHtcbiAgICAgIHBhZ2VzSGlzdG9yeTogW10sXG4gICAgICB0b3RhbFBhZ2VzOiAwLFxuICAgICAgZHVyYXRpb246IDAsXG4gICAgICByb3RhdGlvbjogW10sXG4gICAgICBwcm9ncmVzc0JhcjogW10sXG4gICAgICBxdWVzdGlvbnM6IFtdLFxuICAgICAgcXVlc3Rpb25JZHM6IFtdLFxuICAgICAgbGFzdFF1ZXN0aW9uSWQ6ICcnLFxuICAgIH07XG4gICAgdGhpcy5sb2FkaW5nUHJvZ3Jlc3MgPSAwO1xuICAgIHRoaXMuZW5kUGFnZVNlZW4gPSBmYWxzZTtcbiAgfVxuXG4gIHJhaXNlU3RhcnRFdmVudChjdXJyZW50UXVlc3Rpb25JbmRleCkge1xuICAgIHRoaXMuY3VycmVudFF1ZXN0aW9uSW5kZXggPSBjdXJyZW50UXVlc3Rpb25JbmRleDtcbiAgICBjb25zdCBkdXJhdGlvbiA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gdGhpcy5xdW1sUGxheWVyU3RhcnRUaW1lO1xuICAgIGNvbnN0IHN0YXJ0RXZlbnQ6IGFueSA9IHtcbiAgICAgIGVpZDogJ1NUQVJUJyxcbiAgICAgIHZlcjogdGhpcy52ZXJzaW9uLFxuICAgICAgZWRhdGE6IHtcbiAgICAgICAgdHlwZTogJ1NUQVJUJyxcbiAgICAgICAgY3VycmVudEluZGV4OiB0aGlzLmN1cnJlbnRRdWVzdGlvbkluZGV4LFxuICAgICAgICBkdXJhdGlvblxuICAgICAgfSxcbiAgICAgIG1ldGFEYXRhOiB0aGlzLm1ldGFEYXRhXG4gICAgfTtcblxuICAgIHRoaXMucXVtbFBsYXllckV2ZW50LmVtaXQoc3RhcnRFdmVudCk7XG4gICAgdGhpcy5xdW1sUGxheWVyTGFzdFBhZ2VUaW1lID0gdGhpcy5xdW1sUGxheWVyU3RhcnRUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgdGhpcy5xdW1sTGlicmFyeVNlcnZpY2Uuc3RhcnQoZHVyYXRpb24pO1xuICB9XG5cbiAgcmFpc2VFbmRFdmVudChjdXJyZW50UXVlc3Rpb25JbmRleCwgIGVuZFBhZ2VTZWVuICwgc2NvcmUpIHtcbiAgICB0aGlzLm1ldGFEYXRhLnF1ZXN0aW9ucyA9IHRoaXMuc2VjdGlvblF1ZXN0aW9ucztcbiAgICBjb25zdCBkdXJhdGlvbiA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gdGhpcy5xdW1sUGxheWVyU3RhcnRUaW1lO1xuICAgIGNvbnN0IGVuZEV2ZW50OiBhbnkgPSB7XG4gICAgICBlaWQ6ICdFTkQnLFxuICAgICAgdmVyOiB0aGlzLnZlcnNpb24sXG4gICAgICBlZGF0YToge1xuICAgICAgICB0eXBlOiAnRU5EJyxcbiAgICAgICAgY3VycmVudFBhZ2U6IGN1cnJlbnRRdWVzdGlvbkluZGV4LFxuICAgICAgICB0b3RhbFBhZ2VzOiB0aGlzLnRvdGFsTnVtYmVyT2ZRdWVzdGlvbnMsXG4gICAgICAgIGR1cmF0aW9uXG4gICAgICB9LFxuICAgICAgbWV0YURhdGE6IHRoaXMubWV0YURhdGFcbiAgICB9O1xuXG4gICAgdGhpcy5xdW1sUGxheWVyRXZlbnQuZW1pdChlbmRFdmVudCk7XG4gICAgY29uc3QgdmlzaXRlZGxlbmd0aCA9ICh0aGlzLm1ldGFEYXRhLnBhZ2VzSGlzdG9yeS5maWx0ZXIoKHYsIGksIGEpID0+IGEuaW5kZXhPZih2KSA9PT0gaSkpLmxlbmd0aDtcbiAgICB0aGlzLnRpbWVTcGVudCA9IHRoaXMudXRpbFNlcnZpY2UuZ2V0VGltZVNwZW50VGV4dCh0aGlzLnF1bWxQbGF5ZXJTdGFydFRpbWUpO1xuICAgIHRoaXMucXVtbExpYnJhcnlTZXJ2aWNlLmVuZChkdXJhdGlvbiwgY3VycmVudFF1ZXN0aW9uSW5kZXgsIHRoaXMudG90YWxOdW1iZXJPZlF1ZXN0aW9ucywgdGhpcy50b3RhbE51bWJlck9mUXVlc3Rpb25zLCBlbmRQYWdlU2VlbiAsIHNjb3JlKTtcbiAgfVxuXG4gIHJhaXNlSGVhcnRCZWF0RXZlbnQodHlwZTogc3RyaW5nLCB0ZWxlbWV0cnlUeXBlOiBzdHJpbmcsIHBhZ2VJZDogYW55KSB7XG4gICAgY29uc3QgaGVhckJlYXRFdmVudDogYW55ID0ge1xuICAgICAgZWlkOiAnSEVBUlRCRUFUJyxcbiAgICAgIHZlcjogdGhpcy52ZXJzaW9uLFxuICAgICAgZWRhdGE6IHtcbiAgICAgICAgdHlwZSxcbiAgICAgICAgcXVlc3Rpb25JbmRleDogdGhpcy5jdXJyZW50UXVlc3Rpb25JbmRleCxcbiAgICAgIH0sXG4gICAgICBtZXRhRGF0YTogdGhpcy5tZXRhRGF0YVxuICAgIH07XG5cbiAgICBpZiAodGhpcy5pc1NlY3Rpb25zQXZhaWxhYmxlKSB7XG4gICAgICBoZWFyQmVhdEV2ZW50LmVkYXRhLnNlY3Rpb25JZCA9IHRoaXMucXVlc3Rpb25TZXRJZDtcbiAgICB9XG5cbiAgICB0aGlzLnF1bWxQbGF5ZXJFdmVudC5lbWl0KGhlYXJCZWF0RXZlbnQpO1xuICAgIGlmIChUZWxlbWV0cnlUeXBlLmludGVyYWN0ID09PSB0ZWxlbWV0cnlUeXBlKSB7XG4gICAgICB0aGlzLnF1bWxMaWJyYXJ5U2VydmljZS5pbnRlcmFjdCh0eXBlLnRvTG93ZXJDYXNlKCksIHBhZ2VJZCk7XG4gICAgfSBlbHNlIGlmIChUZWxlbWV0cnlUeXBlLmltcHJlc3Npb24gPT09IHRlbGVtZXRyeVR5cGUpIHtcbiAgICAgIHRoaXMucXVtbExpYnJhcnlTZXJ2aWNlLmltcHJlc3Npb24ocGFnZUlkKTtcbiAgICB9XG5cbiAgfVxuXG4gIHJhaXNlQXNzZXNFdmVudChxdWVzdGlvbkRhdGEgLCBpbmRleCAsIHBhc3MgLCBzY29yZSAsIHJlc1ZhbHVlcyAsIGR1cmF0aW9uKXtcbiAgICBjb25zdCBhc3Nlc3NFdmVudCA9IHtcbiAgICAgICAgICBpdGVtOiBxdWVzdGlvbkRhdGEsXG4gICAgICAgICAgaW5kZXg6IGluZGV4LFxuICAgICAgICAgIHBhc3M6IHBhc3MsIFxuICAgICAgICAgIHNjb3JlOiBzY29yZSwgXG4gICAgICAgICAgcmVzdmFsdWVzOiByZXNWYWx1ZXMsIFxuICAgICAgICAgIGR1cmF0aW9uOiBkdXJhdGlvbiBcbiAgICB9XG4gICAgdGhpcy5xdW1sUGxheWVyRXZlbnQuZW1pdChhc3Nlc3NFdmVudCk7XG4gICAgdGhpcy5xdW1sTGlicmFyeVNlcnZpY2Uuc3RhcnRBc3Nlc0V2ZW50KGFzc2Vzc0V2ZW50KTtcbiAgfVxuXG4gIHJhaXNlUmVzcG9uc2VFdmVudChpZGVudGlmaWVyICwgcVR5cGUgLCBvcHRpb25TZWxlY3RlZCl7XG4gICAgY29uc3QgcmVzcG9uc2VFdmVudCA9IHtcbiAgICAgICAgdGFyZ2V0OiB7XG4gICAgICAgICAgaWQ6IGlkZW50aWZpZXIsXG4gICAgICAgICAgdmVyOiB0aGlzLnZlcnNpb24sXG4gICAgICAgICAgdHlwZTogcVR5cGVcbiAgICAgICAgfSxcbiAgICAgICAgdmFsdWVzOiBbe1xuICAgICAgICAgIG9wdGlvblNlbGVjdGVkXG4gICAgICAgIH1dXG4gICAgfVxuICAgIHRoaXMucXVtbFBsYXllckV2ZW50LmVtaXQocmVzcG9uc2VFdmVudCk7XG4gICAgdGhpcy5xdW1sTGlicmFyeVNlcnZpY2UucmVzcG9uc2UoaWRlbnRpZmllciwgdGhpcy52ZXJzaW9uICwgcVR5cGUgLCBvcHRpb25TZWxlY3RlZCk7XG4gIH1cblxuICByYWlzZVN1bW1hcnlFdmVudChjdXJyZW50UXVlc3Rpb25JbmRleCwgZW5kcGFnZXNlZW4sIHNjb3JlLCBzdW1tYXJ5T2JqKSB7XG4gICAgbGV0IHRpbWVzcGVudCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gdGhpcy5xdW1sUGxheWVyU3RhcnRUaW1lO1xuICAgIHRpbWVzcGVudCA9IE51bWJlcigoKHRpbWVzcGVudCAlIDYwMDAwKSAvIDEwMDApLnRvRml4ZWQoMikpXG4gICAgY29uc3QgZURhdGEgPSB7XG4gICAgICB0eXBlOiBcImNvbnRlbnRcIixcbiAgICAgIG1vZGU6IFwicGxheVwiLFxuICAgICAgc3RhcnR0aW1lOiB0aGlzLnF1bWxQbGF5ZXJTdGFydFRpbWUsXG4gICAgICBlbmR0aW1lOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSxcbiAgICAgIHRpbWVzcGVudCxcbiAgICAgIHBhZ2V2aWV3czogdGhpcy50b3RhbE51bWJlck9mUXVlc3Rpb25zLFxuICAgICAgaW50ZXJhY3Rpb25zOiBzdW1tYXJ5T2JqLmNvcnJlY3QgKyBzdW1tYXJ5T2JqLndyb25nICsgc3VtbWFyeU9iai5wYXJ0aWFsLFxuICAgICAgZXh0cmE6IFt7XG4gICAgICAgIGlkOiBcInByb2dyZXNzXCIsXG4gICAgICAgIHZhbHVlOiAoKGN1cnJlbnRRdWVzdGlvbkluZGV4IC8gdGhpcy50b3RhbE51bWJlck9mUXVlc3Rpb25zKSAqIDEwMCkudG9GaXhlZCgwKS50b1N0cmluZygpXG4gICAgICB9LCB7XG4gICAgICAgIGlkOiBcImVuZHBhZ2VzZWVuXCIsXG4gICAgICAgIHZhbHVlOiBlbmRwYWdlc2Vlbi50b1N0cmluZygpXG4gICAgICB9LCB7XG4gICAgICAgIGlkOiBcInNjb3JlXCIsXG4gICAgICAgIHZhbHVlOiBzY29yZS50b1N0cmluZygpXG4gICAgICB9LCB7XG4gICAgICAgIGlkOiBcImNvcnJlY3RcIixcbiAgICAgICAgdmFsdWU6IHN1bW1hcnlPYmouY29ycmVjdC50b1N0cmluZygpXG4gICAgICB9LCB7XG4gICAgICAgIGlkOiBcImluY29ycmVjdFwiLFxuICAgICAgICB2YWx1ZTogc3VtbWFyeU9iai53cm9uZy50b1N0cmluZygpXG4gICAgICB9LCB7XG4gICAgICAgIGlkOiBcInBhcnRpYWxcIixcbiAgICAgICAgdmFsdWU6IHN1bW1hcnlPYmoucGFydGlhbC50b1N0cmluZygpXG4gICAgICB9LCB7XG4gICAgICAgIGlkOiBcInNraXBwZWRcIixcbiAgICAgICAgdmFsdWU6IHN1bW1hcnlPYmouc2tpcHBlZC50b1N0cmluZygpXG4gICAgICB9XVxuICAgIH07XG4gICAgY29uc3Qgc3VtbWFyeUV2ZW50ID0ge1xuICAgICAgZWlkOiAnUVVNTF9TVU1NQVJZJyxcbiAgICAgIHZlcjogdGhpcy52ZXJzaW9uLFxuICAgICAgZWRhdGE6IGVEYXRhLFxuICAgICAgbWV0YURhdGE6IHRoaXMubWV0YURhdGFcbiAgICB9O1xuICAgIHRoaXMucXVtbFBsYXllckV2ZW50LmVtaXQoc3VtbWFyeUV2ZW50KTtcbiAgICB0aGlzLnF1bWxMaWJyYXJ5U2VydmljZS5zdW1tYXJ5KGVEYXRhKTtcbiAgfVxuXG4gIHJhaXNlRXhjZXB0aW9uTG9nKGVycm9yQ29kZTogc3RyaW5nICwgZXJyb3JUeXBlOiBzdHJpbmcgLCBzdGFja3RyYWNlICwgdHJhY2VJZCApIHtcbiAgICBjb25zdCBleGNlcHRpb25Mb2dFdmVudCA9IHtcbiAgICAgIGVpZDogXCJFUlJPUlwiLFxuICAgICAgZWRhdGE6IHtcbiAgICAgICAgICBlcnI6IGVycm9yQ29kZSxcbiAgICAgICAgICBlcnJ0eXBlOiBlcnJvclR5cGUsXG4gICAgICAgICAgcmVxdWVzdGlkOiB0cmFjZUlkIHx8ICcnLFxuICAgICAgICAgIHN0YWNrdHJhY2U6IHN0YWNrdHJhY2UgfHwgJycsXG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMucXVtbFBsYXllckV2ZW50LmVtaXQoZXhjZXB0aW9uTG9nRXZlbnQpXG4gICAgdGhpcy5xdW1sTGlicmFyeVNlcnZpY2UuZXJyb3Ioc3RhY2t0cmFjZSwgeyBlcnI6IGVycm9yQ29kZSwgZXJydHlwZTogZXJyb3JUeXBlIH0pO1xuICB9XG5cblxuICBnZXRRdWVzdGlvbnMoY3VycmVudEluZGV4PzogbnVtYmVyICAsIGluZGV4PzogbnVtYmVyKSB7XG4gICAgbGV0IGluZGVudGlmZXJzRm9yUXVlc3Rpb25zO1xuICAgIGlmKGN1cnJlbnRJbmRleCAhPT0gdW5kZWZpbmVkICYmIGluZGV4KSB7XG4gICAgICBpbmRlbnRpZmVyc0ZvclF1ZXN0aW9ucyA9IHRoaXMuaWRlbnRpZmllcnMuc3BsaWNlKGN1cnJlbnRJbmRleCwgaW5kZXgpO1xuICAgIH1lbHNlIGlmKCFjdXJyZW50SW5kZXggJiYgIWluZGV4KXtcbiAgICAgIGluZGVudGlmZXJzRm9yUXVlc3Rpb25zID0gdGhpcy5pZGVudGlmaWVycy5zcGxpY2UoMCwgdGhpcy50aHJlc2hvbGQpO1xuICAgIH1cbiAgICBpZighXy5pc0VtcHR5KGluZGVudGlmZXJzRm9yUXVlc3Rpb25zKSkge1xuICAgICAgY29uc3QgcmVxdWVzdHMgPSBbXTtcbiAgICAgIGNvbnN0IGNodW5rQXJyYXkgPSBfLmNodW5rKGluZGVudGlmZXJzRm9yUXVlc3Rpb25zLCAxMCk7XG4gICAgICBfLmZvckVhY2goY2h1bmtBcnJheSwgKHZhbHVlKSA9PiB7XG4gICAgICAgIHJlcXVlc3RzLnB1c2godGhpcy5xdWVzdGlvbkN1cnNvci5nZXRRdWVzdGlvbnModmFsdWUsIHRoaXMucGFyZW50SWRlbnRpZmllcikpO1xuICAgICAgfSk7XG4gICAgICBmb3JrSm9pbihyZXF1ZXN0cykuc3Vic2NyaWJlKHF1ZXN0aW9ucyA9PiB7XG4gICAgICAgIF8uZm9yRWFjaChxdWVzdGlvbnMsICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIHRoaXMucXVtbFF1ZXN0aW9uRXZlbnQuZW1pdCh2YWx1ZSk7XG4gICAgICAgIH0pO1xuICAgICAgfSwoZXJyb3IpPT57XG4gICAgICAgICAgdGhpcy5xdW1sUXVlc3Rpb25FdmVudC5lbWl0KHtcbiAgICAgICAgICAgIGVycm9yOiBlcnJvclxuICAgICAgICAgIH0pXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBnZXRRdWVzdGlvbigpIHtcbiAgICBsZXQgaW5kZW50aWZlckZvclF1ZXN0aW9uID0gdGhpcy5pZGVudGlmaWVycy5zcGxpY2UoMCwgdGhpcy50aHJlc2hvbGQpO1xuICAgICAgdGhpcy5xdWVzdGlvbkN1cnNvci5nZXRRdWVzdGlvbihpbmRlbnRpZmVyRm9yUXVlc3Rpb24pLnN1YnNjcmliZSgocXVlc3Rpb24pID0+IHtcbiAgICAgICAgdGhpcy5xdW1sUXVlc3Rpb25FdmVudC5lbWl0KHF1ZXN0aW9uKTtcbiAgICAgIH0sKGVycm9yKT0+e1xuICAgICAgICB0aGlzLnF1bWxRdWVzdGlvbkV2ZW50LmVtaXQoe1xuICAgICAgICAgIGVycm9yOiBlcnJvclxuICAgICAgICB9KVxuICAgIH0pXG4gIH1cblxuICBnZW5lcmF0ZU1heEF0dGVtcHRFdmVudHMoY3VycmVudGF0dGVtcHQ6IG51bWJlciwgbWF4TGltaXRFeGNlZWRlZDogYm9vbGVhbiwgaXNMYXN0QXR0ZW1wdDogYm9vbGVhbikge1xuICAgIHJldHVybiB7XG4gICAgICBlaWQ6ICdleGRhdGEnLFxuICAgICAgdmVyOiB0aGlzLnZlcnNpb24sXG4gICAgICBlZGF0YToge1xuICAgICAgICB0eXBlOiAnZXhkYXRhJyxcbiAgICAgICAgY3VycmVudGF0dGVtcHQsXG4gICAgICAgIG1heExpbWl0RXhjZWVkZWQsXG4gICAgICAgIGlzTGFzdEF0dGVtcHRcbiAgICAgIH0sXG4gICAgICBtZXRhRGF0YTogdGhpcy5tZXRhRGF0YVxuICAgIH07XG4gIH1cblxuICB1cGRhdGVTZWN0aW9uUXVlc3Rpb25zKGlkOiBzdHJpbmcsIHF1ZXN0aW9ucykge1xuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5zZWN0aW9uUXVlc3Rpb25zLmZpbmRJbmRleChzZWN0aW9uID0+IHNlY3Rpb24uaWQgPT09IGlkKTtcbiAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgdGhpcy5zZWN0aW9uUXVlc3Rpb25zW2luZGV4XS5xdWVzdGlvbnMgPSBxdWVzdGlvbnM7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2VjdGlvblF1ZXN0aW9ucy5wdXNoKHsgaWQsIHF1ZXN0aW9ucyB9KTtcbiAgICB9XG4gIH1cblxuICBnZXRTZWN0aW9uUXVlc3Rpb25zKGlkOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdGhpcy5zZWN0aW9uUXVlc3Rpb25zLmZpbmQoc2VjdGlvbiA9PiBzZWN0aW9uLmlkID09PSBpZCk/LnF1ZXN0aW9ucyB8fCBbXTtcbiAgfVxufVxuIl19