/**
 * @fileoverview added by tsickle
 * Generated from: lib/main-player/main-player.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import * as _ from 'lodash-es';
import { ViewerService } from '../services/viewer-service/viewer-service';
import { eventName, pageId, TelemetryType } from '../telemetry-constants';
import { UtilService } from '../util-service';
import { QuestionCursor } from '../quml-question-cursor.service';
export class MainPlayerComponent {
    /**
     * @param {?} viewerService
     * @param {?} utilService
     * @param {?} questionCursor
     */
    constructor(viewerService, utilService, questionCursor) {
        this.viewerService = viewerService;
        this.utilService = utilService;
        this.questionCursor = questionCursor;
        this.playerEvent = new EventEmitter();
        this.submitEvent = new EventEmitter();
        this.telemetryEvent = new EventEmitter();
        this.isLoading = false;
        this.isSectionsAvailable = false;
        this.isMultiLevelSection = false;
        this.sections = [];
        this.isFirstSection = false;
        this.sectionIndex = 0;
        this.parentConfig = {
            loadScoreBoard: false,
            requiresSubmit: false,
            isFirstSection: false,
            isSectionsAvailable: false,
            isReplayed: false,
            identifier: '',
            contentName: '',
            baseUrl: '',
            instructions: {},
            questionCount: 0,
        };
        this.showEndPage = true;
        this.endPageReached = false;
        this.isEndEventRaised = false;
        this.isSummaryEventRaised = false;
        this.showReplay = true;
        this.mainProgressBar = [];
        this.loadScoreBoard = false;
        this.isDurationExpired = false;
        this.finalScore = 0;
        this.totalNoOfQuestions = 0;
        this.sideMenuConfig = {
            enable: true,
            showShare: true,
            showDownload: true,
            showReplay: false,
            showExit: true,
        };
        this.totalVisitedQuestion = 0;
        this.showInstructions = 'No';
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onTelemetryEvent(event) {
        this.telemetryEvent.emit(event.detail);
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        if (typeof this.playerConfig === 'string') {
            try {
                this.playerConfig = JSON.parse(this.playerConfig);
            }
            catch (error) {
                console.error('Invalid playerConfig: ', error);
            }
        }
        this.isLoading = true;
        this.setConfig();
        this.initializeSections();
        /*this.questionCursor.getQuestionSet(this.contentId).subscribe((data) => {
            this.playerConfig['metadata'] = _.get(data, 'result.questionSet');
            this.playerConfig['metadata'].requiresSubmit = 'Yes';

            this.setConfig();
            this.initializeSections();
        }, (error) => {
            console.log(error);
        });*/
    }
    /**
     * @return {?}
     */
    initializeSections() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        /** @type {?} */
        const childMimeType = _.map(this.playerConfig.metadata.children, 'mimeType');
        this.parentConfig.isSectionsAvailable = this.isSectionsAvailable = childMimeType[0] === 'application/vnd.sunbird.questionset';
        this.viewerService.sectionQuestions = [];
        if (this.isSectionsAvailable) {
            this.isMultiLevelSection = this.getMultilevelSection(this.playerConfig.metadata);
            if (this.isMultiLevelSection) {
                this.contentError = {
                    messageHeader: 'Unable to load content',
                    messageTitle: 'Multi level sections are not supported as of now'
                };
            }
            else {
                /** @type {?} */
                let children = this.playerConfig.metadata.children;
                this.sections = _.map(children, (/**
                 * @param {?} child
                 * @return {?}
                 */
                (child) => {
                    var _a, _b, _c, _d, _e, _f;
                    /** @type {?} */
                    let childNodes = ((_b = (_a = child) === null || _a === void 0 ? void 0 : _a.children) === null || _b === void 0 ? void 0 : _b.map((/**
                     * @param {?} item
                     * @return {?}
                     */
                    item => item.identifier))) || [];
                    /** @type {?} */
                    const maxQuestions = (_c = child) === null || _c === void 0 ? void 0 : _c.maxQuestions;
                    if (((_d = child) === null || _d === void 0 ? void 0 : _d.shuffle) && !((_f = (_e = this.playerConfig.config) === null || _e === void 0 ? void 0 : _e.progressBar) === null || _f === void 0 ? void 0 : _f.length)) {
                        childNodes = _.shuffle(childNodes);
                    }
                    if (maxQuestions) {
                        childNodes = childNodes.slice(0, maxQuestions);
                    }
                    if (this.playerConfig.metadata.timeLimits) {
                        child = Object.assign(Object.assign({}, child), { timeLimits: this.playerConfig.metadata.timeLimits, showTimer: this.playerConfig.metadata.showTimer });
                    }
                    return Object.assign(Object.assign({}, this.playerConfig), { metadata: Object.assign(Object.assign({}, child), { childNodes, showStartPage: this.showInstructions }) });
                }));
                this.setInitialScores();
                this.activeSection = _.cloneDeep(this.sections[0]);
                this.isFirstSection = true;
                this.isLoading = false;
            }
        }
        else {
            /** @type {?} */
            let childNodes = [];
            if ((_b = (_a = this.playerConfig.metadata) === null || _a === void 0 ? void 0 : _a.children) === null || _b === void 0 ? void 0 : _b.length) {
                childNodes = this.playerConfig.metadata.children.map((/**
                 * @param {?} item
                 * @return {?}
                 */
                item => item.identifier));
            }
            else {
                childNodes = this.playerConfig.metadata.childNodes;
            }
            /** @type {?} */
            const maxQuestions = this.playerConfig.metadata.maxQuestions;
            if (maxQuestions) {
                childNodes = childNodes.slice(0, maxQuestions);
            }
            if (((_c = this.playerConfig.metadata) === null || _c === void 0 ? void 0 : _c.shuffle) && !((_e = (_d = this.playerConfig.config) === null || _d === void 0 ? void 0 : _d.progressBar) === null || _e === void 0 ? void 0 : _e.length)) {
                childNodes = _.shuffle(childNodes);
            }
            childNodes.forEach((/**
             * @param {?} element
             * @param {?} index
             * @return {?}
             */
            (element, index) => {
                this.totalNoOfQuestions++;
                this.mainProgressBar.push({
                    index: (index + 1), class: 'unattempted', value: undefined,
                    score: 0,
                });
            }));
            this.playerConfig.metadata.childNodes = childNodes;
            if ((_g = (_f = this.playerConfig.config) === null || _f === void 0 ? void 0 : _f.progressBar) === null || _g === void 0 ? void 0 : _g.length) {
                this.mainProgressBar = _.cloneDeep(this.playerConfig.config.progressBar);
            }
            if ((_j = (_h = this.playerConfig.config) === null || _h === void 0 ? void 0 : _h.questions) === null || _j === void 0 ? void 0 : _j.length) {
                /** @type {?} */
                const questionsObj = this.playerConfig.config.questions.find((/**
                 * @param {?} item
                 * @return {?}
                 */
                item => item.id === this.playerConfig.metadata.identifier));
                if ((_k = questionsObj) === null || _k === void 0 ? void 0 : _k.questions) {
                    this.viewerService.updateSectionQuestions(this.playerConfig.metadata.identifier, questionsObj.questions);
                }
            }
            this.activeSection = _.cloneDeep(this.playerConfig);
            this.isLoading = false;
            this.isFirstSection = true;
            this.parentConfig.questionCount = this.totalNoOfQuestions;
        }
    }
    /**
     * @return {?}
     */
    setConfig() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        this.parentConfig.contentName = (_a = this.playerConfig.metadata) === null || _a === void 0 ? void 0 : _a.name;
        this.parentConfig.identifier = (_b = this.playerConfig.metadata) === null || _b === void 0 ? void 0 : _b.identifier;
        this.parentConfig.requiresSubmit = ((_d = (_c = this.playerConfig.metadata) === null || _c === void 0 ? void 0 : _c.requiresSubmit) === null || _d === void 0 ? void 0 : _d.toLowerCase()) !== 'no';
        this.parentConfig.instructions = (_f = (_e = this.playerConfig.metadata) === null || _e === void 0 ? void 0 : _e.instructions) === null || _f === void 0 ? void 0 : _f.default;
        this.showEndPage = ((_h = (_g = this.playerConfig.metadata) === null || _g === void 0 ? void 0 : _g.showEndPage) === null || _h === void 0 ? void 0 : _h.toLowerCase()) !== 'no';
        this.showFeedBack = ((_k = (_j = this.playerConfig.metadata) === null || _j === void 0 ? void 0 : _j.showFeedback) === null || _k === void 0 ? void 0 : _k.toLowerCase()) !== 'no';
        this.sideMenuConfig = Object.assign(Object.assign({}, this.sideMenuConfig), this.playerConfig.config.sideMenu);
        this.userName = this.playerConfig.context.userData.firstName + ' ' + this.playerConfig.context.userData.lastName;
        if (this.playerConfig.metadata.isAvailableLocally && this.playerConfig.metadata.basePath) {
            this.parentConfig.baseUrl = this.playerConfig.metadata.basePath;
        }
        this.attempts = {
            max: (_l = this.playerConfig.metadata) === null || _l === void 0 ? void 0 : _l.maxAttempt,
            current: ((_m = this.playerConfig.metadata) === null || _m === void 0 ? void 0 : _m.currentAttempt) ? this.playerConfig.metadata.currentAttempt + 1 : 1
        };
        this.totalScore = this.playerConfig.metadata.maxScore;
        this.showReplay = ((_o = this.attempts) === null || _o === void 0 ? void 0 : _o.max) && ((_p = this.attempts) === null || _p === void 0 ? void 0 : _p.current) >= this.attempts.max ? false : true;
        if (typeof ((_q = this.playerConfig.metadata) === null || _q === void 0 ? void 0 : _q.timeLimits) === 'string') {
            this.playerConfig.metadata.timeLimits = JSON.parse(this.playerConfig.metadata.timeLimits);
        }
        this.initialTime = new Date().getTime();
        this.emitMaxAttemptEvents();
    }
    /**
     * @private
     * @param {?} obj
     * @return {?}
     */
    getMultilevelSection(obj) {
        /** @type {?} */
        let isMultiLevel;
        obj.children.forEach((/**
         * @param {?} item
         * @return {?}
         */
        item => {
            if (item.children && !isMultiLevel) {
                isMultiLevel = this.hasChildren(item.children);
            }
        }));
        return isMultiLevel;
    }
    /**
     * @private
     * @param {?} arr
     * @return {?}
     */
    hasChildren(arr) {
        return arr.some((/**
         * @param {?} item
         * @return {?}
         */
        item => item.children));
    }
    /**
     * @return {?}
     */
    emitMaxAttemptEvents() {
        var _a, _b, _c, _d, _e, _f;
        if ((((_a = this.playerConfig.metadata) === null || _a === void 0 ? void 0 : _a.maxAttempt) - 1) === ((_b = this.playerConfig.metadata) === null || _b === void 0 ? void 0 : _b.currentAttempt)) {
            this.playerEvent.emit(this.viewerService.generateMaxAttemptEvents((_c = this.attempts) === null || _c === void 0 ? void 0 : _c.current, false, true));
        }
        else if (((_d = this.playerConfig.metadata) === null || _d === void 0 ? void 0 : _d.currentAttempt) >= ((_e = this.playerConfig.metadata) === null || _e === void 0 ? void 0 : _e.maxAttempt)) {
            this.playerEvent.emit(this.viewerService.generateMaxAttemptEvents((_f = this.attempts) === null || _f === void 0 ? void 0 : _f.current, true, false));
        }
    }
    /**
     * @return {?}
     */
    getActiveSectionIndex() {
        return this.sections.findIndex((/**
         * @param {?} sec
         * @return {?}
         */
        sec => { var _a, _b; return ((_a = sec.metadata) === null || _a === void 0 ? void 0 : _a.identifier) === ((_b = this.activeSection.metadata) === null || _b === void 0 ? void 0 : _b.identifier); }));
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onShowScoreBoard(event) {
        if (this.parentConfig.isSectionsAvailable) {
            /** @type {?} */
            const activeSectionIndex = this.getActiveSectionIndex();
            this.updateSectionScore(activeSectionIndex);
        }
        this.loadScoreBoard = true;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onSectionEnd(event) {
        if (this.parentConfig.isSectionsAvailable) {
            this.isFirstSection = false;
            /** @type {?} */
            const activeSectionIndex = this.getActiveSectionIndex();
            this.updateSectionScore(activeSectionIndex);
            this.setNextSection(event, activeSectionIndex);
        }
        else {
            this.prepareEnd(event);
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onPlayerEvent(event) {
        this.playerEvent.emit(event);
    }
    /**
     * @return {?}
     */
    getSummaryObject() {
        /** @type {?} */
        const progressBar = this.isSectionsAvailable ? _.flattenDeep(this.mainProgressBar.map((/**
         * @param {?} item
         * @return {?}
         */
        item => item.children))) : this.mainProgressBar;
        /** @type {?} */
        const classObj = _.groupBy(progressBar, 'class');
        this.summary = {
            skipped: _.get(classObj, 'skipped.length') || 0,
            correct: _.get(classObj, 'correct.length') || 0,
            wrong: _.get(classObj, 'wrong.length') || 0,
            partial: _.get(classObj, 'partial.length') || 0
        };
        this.totalVisitedQuestion = this.summary.correct + this.summary.wrong + this.summary.partial + this.summary.skipped;
        this.viewerService.totalNumberOfQuestions = this.totalNoOfQuestions;
    }
    /**
     * @param {?} activeSectionIndex
     * @return {?}
     */
    updateSectionScore(activeSectionIndex) {
        this.mainProgressBar[activeSectionIndex].score = this.mainProgressBar[activeSectionIndex].children
            .reduce((/**
         * @param {?} accumulator
         * @param {?} currentValue
         * @return {?}
         */
        (accumulator, currentValue) => accumulator + currentValue.score), 0);
    }
    /**
     * @param {?} event
     * @param {?} activeSectionIndex
     * @return {?}
     */
    setNextSection(event, activeSectionIndex) {
        var _a, _b, _c, _d;
        this.summary = this.utilService.sumObjectsByKey(this.summary, event.summary);
        /** @type {?} */
        const isSectionFullyAttempted = event.summary.skipped === 0 &&
            (((_a = event.summary) === null || _a === void 0 ? void 0 : _a.correct) + ((_b = event.summary) === null || _b === void 0 ? void 0 : _b.wrong)) === ((_d = (_c = this.mainProgressBar[activeSectionIndex]) === null || _c === void 0 ? void 0 : _c.children) === null || _d === void 0 ? void 0 : _d.length);
        /** @type {?} */
        const isSectionPartiallyAttempted = event.summary.skipped > 0;
        if (event.isDurationEnded) {
            this.isDurationExpired = true;
            this.prepareEnd(event);
            return;
        }
        /** @type {?} */
        let nextSectionIndex = activeSectionIndex + 1;
        if (event.jumpToSection) {
            /** @type {?} */
            const sectionIndex = this.sections.findIndex((/**
             * @param {?} sec
             * @return {?}
             */
            sec => { var _a; return ((_a = sec.metadata) === null || _a === void 0 ? void 0 : _a.identifier) === event.jumpToSection; }));
            nextSectionIndex = sectionIndex > -1 ? sectionIndex : nextSectionIndex;
        }
        this.sectionIndex = _.cloneDeep(nextSectionIndex);
        this.mainProgressBar.forEach((/**
         * @param {?} item
         * @param {?} index
         * @return {?}
         */
        (item, index) => {
            item.isActive = index === nextSectionIndex;
            if (index === activeSectionIndex) {
                if (isSectionFullyAttempted) {
                    item.class = 'attempted';
                }
                else if (isSectionPartiallyAttempted) {
                    item.class = 'partial';
                }
            }
        }));
        if (nextSectionIndex < this.sections.length) {
            this.activeSection = _.cloneDeep(this.sections[nextSectionIndex]);
        }
        else {
            this.prepareEnd(event);
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    prepareEnd(event) {
        this.calculateScore();
        this.setDurationSpent();
        if (this.parentConfig.requiresSubmit) {
            this.loadScoreBoard = true;
        }
        else {
            this.endPageReached = true;
            this.getSummaryObject();
            this.viewerService.raiseSummaryEvent(this.totalVisitedQuestion, this.endPageReached, this.finalScore, this.summary);
            this.raiseEndEvent(this.totalVisitedQuestion, this.endPageReached, this.finalScore);
            this.isSummaryEventRaised = true;
            this.isEndEventRaised = true;
        }
    }
    /**
     * @return {?}
     */
    replayContent() {
        var _a, _b, _c, _d;
        this.parentConfig.isReplayed = true;
        this.loadScoreBoard = false;
        this.endPageReached = false;
        this.isDurationExpired = false;
        this.isEndEventRaised = false;
        this.attempts.current = this.attempts.current + 1;
        this.showReplay = ((_a = this.attempts) === null || _a === void 0 ? void 0 : _a.max) && ((_b = this.attempts) === null || _b === void 0 ? void 0 : _b.current) >= this.attempts.max ? false : true;
        this.totalNoOfQuestions = 0;
        this.totalVisitedQuestion = 0;
        this.mainProgressBar = [];
        this.jumpToQuestion = undefined;
        this.summary = {
            correct: 0,
            partial: 0,
            skipped: 0,
            wrong: 0
        };
        this.sections = [];
        this.initialTime = new Date().getTime();
        this.initializeSections();
        this.endPageReached = false;
        this.loadScoreBoard = false;
        this.activeSection = this.isSectionsAvailable ? _.cloneDeep(this.sections[0]) : this.playerConfig;
        if (((_c = this.attempts) === null || _c === void 0 ? void 0 : _c.max) === ((_d = this.attempts) === null || _d === void 0 ? void 0 : _d.current)) {
            this.playerEvent.emit(this.viewerService.generateMaxAttemptEvents(_.get(this.attempts, 'current'), false, true));
        }
        this.viewerService.raiseHeartBeatEvent(eventName.replayClicked, TelemetryType.interact, 1);
        setTimeout((/**
         * @return {?}
         */
        () => {
            this.parentConfig.isReplayed = false;
        }), 200);
    }
    /**
     * @param {?=} activeSectionIndex
     * @return {?}
     */
    setInitialScores(activeSectionIndex = 0) {
        var _a, _b;
        /** @type {?} */
        const alphabets = 'abcdefghijklmnopqrstuvwxyz'.split('');
        this.sections.forEach((/**
         * @param {?} section
         * @param {?} i
         * @return {?}
         */
        (section, i) => {
            var _a, _b, _c, _d;
            this.mainProgressBar.push({
                index: alphabets[i].toLocaleUpperCase(), class: 'unattempted', value: undefined,
                score: 0,
                isActive: i === activeSectionIndex,
                identifier: (_a = section.metadata) === null || _a === void 0 ? void 0 : _a.identifier
            });
            /** @type {?} */
            const children = [];
            section.metadata.childNodes.forEach((/**
             * @param {?} child
             * @param {?} index
             * @return {?}
             */
            (child, index) => {
                children.push({
                    identifier: child,
                    index: (index + 1), class: 'unattempted', value: undefined,
                    option: undefined, cardinality: undefined,
                    score: 0
                });
                this.totalNoOfQuestions++;
            }));
            this.mainProgressBar[this.mainProgressBar.length - 1] = Object.assign(Object.assign({}, _.last(this.mainProgressBar)), { children });
            if ((_c = (_b = this.playerConfig.config) === null || _b === void 0 ? void 0 : _b.questions) === null || _c === void 0 ? void 0 : _c.length) {
                /** @type {?} */
                const questionsObj = this.playerConfig.config.questions.find((/**
                 * @param {?} item
                 * @return {?}
                 */
                item => { var _a; return item.id === ((_a = section.metadata) === null || _a === void 0 ? void 0 : _a.identifier); }));
                if ((_d = questionsObj) === null || _d === void 0 ? void 0 : _d.questions) {
                    this.viewerService.updateSectionQuestions(section.metadata.identifier, questionsObj.questions);
                }
            }
        }));
        if ((_b = (_a = this.playerConfig.config) === null || _a === void 0 ? void 0 : _a.progressBar) === null || _b === void 0 ? void 0 : _b.length) {
            this.mainProgressBar = _.cloneDeep(this.playerConfig.config.progressBar);
            this.mainProgressBar[0].isActive = true;
        }
        this.parentConfig.questionCount = this.totalNoOfQuestions;
    }
    /**
     * @return {?}
     */
    calculateScore() {
        this.finalScore = this.mainProgressBar.reduce((/**
         * @param {?} accumulator
         * @param {?} currentValue
         * @return {?}
         */
        (accumulator, currentValue) => accumulator + currentValue.score), 0);
        this.generateOutComeLabel();
        return this.finalScore;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    exitContent(event) {
        var _a;
        this.calculateScore();
        if (((_a = event) === null || _a === void 0 ? void 0 : _a.type) === 'EXIT') {
            this.viewerService.raiseHeartBeatEvent(eventName.endPageExitClicked, TelemetryType.interact, 'endPage');
            this.getSummaryObject();
            this.viewerService.raiseSummaryEvent(this.totalVisitedQuestion, this.endPageReached, this.finalScore, this.summary);
            this.isSummaryEventRaised = true;
            this.raiseEndEvent(this.totalVisitedQuestion, this.endPageReached, this.finalScore);
        }
    }
    /**
     * @param {?} currentQuestionIndex
     * @param {?} endPageSeen
     * @param {?} score
     * @return {?}
     */
    raiseEndEvent(currentQuestionIndex, endPageSeen, score) {
        if (this.isEndEventRaised) {
            return;
        }
        this.isEndEventRaised = true;
        this.viewerService.metaData.progressBar = this.mainProgressBar;
        this.viewerService.raiseEndEvent(currentQuestionIndex, endPageSeen, score);
        if (_.get(this.attempts, 'current') >= _.get(this.attempts, 'max')) {
            this.playerEvent.emit(this.viewerService.generateMaxAttemptEvents(_.get(this.attempts, 'current'), true, false));
        }
    }
    /**
     * @return {?}
     */
    setDurationSpent() {
        var _a;
        if (((_a = this.playerConfig.metadata) === null || _a === void 0 ? void 0 : _a.summaryType) !== 'Score') {
            this.viewerService.metaData.duration = new Date().getTime() - this.initialTime;
            this.durationSpent = this.utilService.getTimeSpentText(this.initialTime);
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onScoreBoardLoaded(event) {
        var _a;
        if ((_a = event) === null || _a === void 0 ? void 0 : _a.scoreBoardLoaded) {
            this.calculateScore();
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onScoreBoardSubmitted(event) {
        switch (event.type) {
            case 'back-clicked':
                this.loadScoreBoard = false;
                break;
            default:
                this.endPageReached = true;
                this.getSummaryObject();
                this.setDurationSpent();
                this.viewerService.raiseHeartBeatEvent(eventName.scoreBoardSubmitClicked, TelemetryType.interact, pageId.submitPage);
                this.viewerService.raiseSummaryEvent(this.totalVisitedQuestion, this.endPageReached, this.finalScore, this.summary);
                this.raiseEndEvent(this.totalVisitedQuestion, this.endPageReached, this.finalScore);
                this.loadScoreBoard = false;
                this.isSummaryEventRaised = true;
                this.submitEvent.emit({
                    result: this.mainProgressBar
                });
        }
    }
    /**
     * @return {?}
     */
    generateOutComeLabel() {
        this.outcomeLabel = this.finalScore.toString();
        switch (_.get(this.playerConfig, 'metadata.summaryType')) {
            case 'Complete': {
                this.outcomeLabel = this.totalScore ? `${this.finalScore} / ${this.totalScore}` : this.outcomeLabel;
                break;
            }
            case 'Duration': {
                this.outcomeLabel = '';
                break;
            }
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    goToQuestion(event) {
        if (this.parentConfig.isSectionsAvailable && event.identifier) {
            /** @type {?} */
            const sectionIndex = this.sections.findIndex((/**
             * @param {?} sec
             * @return {?}
             */
            sec => { var _a; return ((_a = sec.metadata) === null || _a === void 0 ? void 0 : _a.identifier) === event.identifier; }));
            this.activeSection = _.cloneDeep(this.sections[sectionIndex]);
            this.mainProgressBar.forEach((/**
             * @param {?} item
             * @param {?} index
             * @return {?}
             */
            (item, index) => {
                item.isActive = index === sectionIndex;
            }));
        }
        this.jumpToQuestion = event;
        this.loadScoreBoard = false;
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.calculateScore();
        this.getSummaryObject();
        if (this.isSummaryEventRaised === false) {
            this.viewerService.raiseSummaryEvent(this.totalVisitedQuestion, this.endPageReached, this.finalScore, this.summary);
        }
        this.raiseEndEvent(this.totalVisitedQuestion, this.endPageReached, this.finalScore);
    }
}
MainPlayerComponent.decorators = [
    { type: Component, args: [{
                selector: 'quml-main-player',
                template: "<!-- Need to show loading here -->\n<sb-player-start-page *ngIf=\"isLoading\" [title]=\"parentConfig?.contentName\"></sb-player-start-page>\n\n\n<div *ngIf=\"!isLoading\" class=\"main-container\">\n  <div class=\"main-container\" [hidden]=\"!activeSection || loadScoreBoard || endPageReached\">\n    <quml-section-player [sectionConfig]=\"activeSection\" (sectionEnd)=\"onSectionEnd($event)\" [attempts]=\"attempts\"\n      [isFirstSection]=\"isFirstSection\" [mainProgressBar]=\"mainProgressBar\" [parentConfig]=\"parentConfig\" [sectionIndex]=\"sectionIndex\"\n      [jumpToQuestion]=\"jumpToQuestion\" (showScoreBoard)=\"onShowScoreBoard($event)\" (playerEvent)=\"onPlayerEvent($event)\">\n    </quml-section-player>\n  </div>\n\n  <!-- Show scoreboard -->\n  <quml-scoreboard *ngIf=\"loadScoreBoard && parentConfig?.requiresSubmit && !endPageReached\"\n    (scoreBoardLoaded)=\"onScoreBoardLoaded($event)\" (submitClicked)=\"onScoreBoardSubmitted($event)\" [isDurationExpired]=\"isDurationExpired\"\n    [contentName]=\"parentConfig.contentName\" [scores]=\"mainProgressBar\" [totalNoOfQuestions]=\"totalNoOfQuestions\"\n    [showFeedBack]=\"showFeedBack\" (emitQuestionNo)=\"goToQuestion($event)\" [isSections]=\"parentConfig?.isSectionsAvailable\">\n  </quml-scoreboard>\n\n  <!-- Show player end page -->\n  <div class=\"endPage-container\" *ngIf=\"endPageReached\" [ngClass]=\"endPageReached ? 'endPage-container-height': ''\">\n    <!--sb-player-end-page *ngIf=\"endPageReached && showEndPage\" [contentName]=\"parentConfig.contentName\"\n      [outcome]=\"outcomeLabel\" [outcomeLabel]=\"'Score: '\" [userName]=\"userName\" [timeSpentLabel]=\"durationSpent\"\n      (replayContent)=\"replayContent()\" (exitContent)=\"exitContent($event)\" [showExit]=\"sideMenuConfig.showExit\"\n      [showReplay]=\"showReplay\">\n\n      <span class=\"sb-color-primary mt-8 fnormal font-weight-bold d-block\"\n        *ngIf=\"attempts?.max && attempts?.current && attempts.max !== attempts.current\">Attempt no {{attempts.current}}/{{attempts.max}}\n      </span>\n\n      <span class=\"attempts sb-color-primary mt-8 fnormal font-weight-bold d-block\"\n        *ngIf=\"attempts?.max === attempts?.current\">{{attempts.current}}/{{attempts.max}} attempts completed\n      </span>\n    </sb-player-end-page-->\n  </div>\n\n\n  <!-- Show content error -->\n  <div *ngIf=\"isMultiLevelSection\">\n    <sb-player-contenterror [errorMsg]=\"contentError\"></sb-player-contenterror>\n  </div>\n</div>\n",
                styles: ["::ng-deep :root{--quml-main-bg:#fff}.main-container{width:100%;height:100%;background:var(--quml-main-bg)}.endPage-container-height{height:100%}"]
            }] }
];
/** @nocollapse */
MainPlayerComponent.ctorParameters = () => [
    { type: ViewerService },
    { type: UtilService },
    { type: QuestionCursor }
];
MainPlayerComponent.propDecorators = {
    contentId: [{ type: Input }],
    playerConfig: [{ type: Input }],
    playerEvent: [{ type: Output }],
    submitEvent: [{ type: Output }],
    telemetryEvent: [{ type: Output }],
    onTelemetryEvent: [{ type: HostListener, args: ['document:TelemetryEvent', ['$event'],] }],
    ngOnDestroy: [{ type: HostListener, args: ['window:beforeunload',] }]
};
if (false) {
    /** @type {?} */
    MainPlayerComponent.prototype.contentId;
    /** @type {?} */
    MainPlayerComponent.prototype.playerConfig;
    /** @type {?} */
    MainPlayerComponent.prototype.playerEvent;
    /** @type {?} */
    MainPlayerComponent.prototype.submitEvent;
    /** @type {?} */
    MainPlayerComponent.prototype.telemetryEvent;
    /** @type {?} */
    MainPlayerComponent.prototype.isLoading;
    /** @type {?} */
    MainPlayerComponent.prototype.isSectionsAvailable;
    /** @type {?} */
    MainPlayerComponent.prototype.isMultiLevelSection;
    /** @type {?} */
    MainPlayerComponent.prototype.sections;
    /** @type {?} */
    MainPlayerComponent.prototype.isFirstSection;
    /** @type {?} */
    MainPlayerComponent.prototype.sectionIndex;
    /** @type {?} */
    MainPlayerComponent.prototype.activeSection;
    /** @type {?} */
    MainPlayerComponent.prototype.contentError;
    /** @type {?} */
    MainPlayerComponent.prototype.parentConfig;
    /** @type {?} */
    MainPlayerComponent.prototype.showEndPage;
    /** @type {?} */
    MainPlayerComponent.prototype.showFeedBack;
    /** @type {?} */
    MainPlayerComponent.prototype.endPageReached;
    /** @type {?} */
    MainPlayerComponent.prototype.isEndEventRaised;
    /** @type {?} */
    MainPlayerComponent.prototype.isSummaryEventRaised;
    /** @type {?} */
    MainPlayerComponent.prototype.showReplay;
    /** @type {?} */
    MainPlayerComponent.prototype.attempts;
    /** @type {?} */
    MainPlayerComponent.prototype.mainProgressBar;
    /** @type {?} */
    MainPlayerComponent.prototype.loadScoreBoard;
    /** @type {?} */
    MainPlayerComponent.prototype.summary;
    /** @type {?} */
    MainPlayerComponent.prototype.isDurationExpired;
    /** @type {?} */
    MainPlayerComponent.prototype.finalScore;
    /** @type {?} */
    MainPlayerComponent.prototype.totalNoOfQuestions;
    /** @type {?} */
    MainPlayerComponent.prototype.durationSpent;
    /** @type {?} */
    MainPlayerComponent.prototype.outcomeLabel;
    /** @type {?} */
    MainPlayerComponent.prototype.totalScore;
    /** @type {?} */
    MainPlayerComponent.prototype.initialTime;
    /** @type {?} */
    MainPlayerComponent.prototype.sideMenuConfig;
    /** @type {?} */
    MainPlayerComponent.prototype.userName;
    /** @type {?} */
    MainPlayerComponent.prototype.jumpToQuestion;
    /** @type {?} */
    MainPlayerComponent.prototype.totalVisitedQuestion;
    /** @type {?} */
    MainPlayerComponent.prototype.showInstructions;
    /** @type {?} */
    MainPlayerComponent.prototype.viewerService;
    /**
     * @type {?}
     * @private
     */
    MainPlayerComponent.prototype.utilService;
    /** @type {?} */
    MainPlayerComponent.prototype.questionCursor;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi1wbGF5ZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHByb2plY3Qtc3VuYmlyZC9zdW5iaXJkLXF1bWwtcGxheWVyLXY5LyIsInNvdXJjZXMiOlsibGliL21haW4tcGxheWVyL21haW4tcGxheWVyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBQyxTQUFTLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQVUsTUFBTSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRTNGLE9BQU8sS0FBSyxDQUFDLE1BQU0sV0FBVyxDQUFDO0FBRS9CLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSwyQ0FBMkMsQ0FBQztBQUN4RSxPQUFPLEVBQUMsU0FBUyxFQUFFLE1BQU0sRUFBRSxhQUFhLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUN4RSxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDNUMsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLGlDQUFpQyxDQUFDO0FBTy9ELE1BQU0sT0FBTyxtQkFBbUI7Ozs7OztJQStENUIsWUFDVyxhQUE0QixFQUMzQixXQUF3QixFQUN6QixjQUE4QjtRQUY5QixrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUMzQixnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUN6QixtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7UUEvRC9CLGdCQUFXLEdBQUcsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUN0QyxnQkFBVyxHQUFHLElBQUksWUFBWSxFQUFPLENBQUM7UUFDdEMsbUJBQWMsR0FBRyxJQUFJLFlBQVksRUFBTyxDQUFDO1FBRW5ELGNBQVMsR0FBRyxLQUFLLENBQUM7UUFDbEIsd0JBQW1CLEdBQUcsS0FBSyxDQUFDO1FBQzVCLHdCQUFtQixHQUFHLEtBQUssQ0FBQztRQUM1QixhQUFRLEdBQVUsRUFBRSxDQUFDO1FBQ3JCLG1CQUFjLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLGlCQUFZLEdBQUcsQ0FBQyxDQUFDO1FBR2pCLGlCQUFZLEdBQWtCO1lBQzFCLGNBQWMsRUFBRSxLQUFLO1lBQ3JCLGNBQWMsRUFBRSxLQUFLO1lBQ3JCLGNBQWMsRUFBRSxLQUFLO1lBQ3JCLG1CQUFtQixFQUFFLEtBQUs7WUFDMUIsVUFBVSxFQUFFLEtBQUs7WUFDakIsVUFBVSxFQUFFLEVBQUU7WUFDZCxXQUFXLEVBQUUsRUFBRTtZQUNmLE9BQU8sRUFBRSxFQUFFO1lBQ1gsWUFBWSxFQUFFLEVBQUU7WUFDaEIsYUFBYSxFQUFFLENBQUM7U0FDbkIsQ0FBQztRQUVGLGdCQUFXLEdBQUcsSUFBSSxDQUFDO1FBRW5CLG1CQUFjLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLHFCQUFnQixHQUFHLEtBQUssQ0FBQztRQUN6Qix5QkFBb0IsR0FBRyxLQUFLLENBQUM7UUFDN0IsZUFBVSxHQUFHLElBQUksQ0FBQztRQUdsQixvQkFBZSxHQUFHLEVBQUUsQ0FBQztRQUNyQixtQkFBYyxHQUFHLEtBQUssQ0FBQztRQU92QixzQkFBaUIsR0FBRyxLQUFLLENBQUM7UUFDMUIsZUFBVSxHQUFHLENBQUMsQ0FBQztRQUNmLHVCQUFrQixHQUFHLENBQUMsQ0FBQztRQUt2QixtQkFBYyxHQUFHO1lBQ2IsTUFBTSxFQUFFLElBQUk7WUFDWixTQUFTLEVBQUUsSUFBSTtZQUNmLFlBQVksRUFBRSxJQUFJO1lBQ2xCLFVBQVUsRUFBRSxLQUFLO1lBQ2pCLFFBQVEsRUFBRSxJQUFJO1NBQ2pCLENBQUM7UUFHRix5QkFBb0IsR0FBRyxDQUFDLENBQUM7UUFDekIscUJBQWdCLEdBQUcsSUFBSSxDQUFDO0lBT3hCLENBQUM7Ozs7O0lBR0QsZ0JBQWdCLENBQUMsS0FBSztRQUNsQixJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDM0MsQ0FBQzs7OztJQUVELFFBQVE7UUFDSixJQUFJLE9BQU8sSUFBSSxDQUFDLFlBQVksS0FBSyxRQUFRLEVBQUU7WUFDdkMsSUFBSTtnQkFDQSxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO2FBQ3JEO1lBQUMsT0FBTyxLQUFLLEVBQUU7Z0JBQ1osT0FBTyxDQUFDLEtBQUssQ0FBQyx3QkFBd0IsRUFBRSxLQUFLLENBQUMsQ0FBQzthQUNsRDtTQUNKO1FBQ0QsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7UUFDdEIsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1FBQzFCOzs7Ozs7OzthQVFLO0lBQ1QsQ0FBQzs7OztJQUdELGtCQUFrQjs7O2NBQ1IsYUFBYSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQztRQUM1RSxJQUFJLENBQUMsWUFBWSxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxhQUFhLENBQUMsQ0FBQyxDQUFDLEtBQUsscUNBQXFDLENBQUM7UUFDOUgsSUFBSSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsR0FBRyxFQUFFLENBQUM7UUFDekMsSUFBSSxJQUFJLENBQUMsbUJBQW1CLEVBQUU7WUFDMUIsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBRWpGLElBQUksSUFBSSxDQUFDLG1CQUFtQixFQUFFO2dCQUMxQixJQUFJLENBQUMsWUFBWSxHQUFHO29CQUNoQixhQUFhLEVBQUUsd0JBQXdCO29CQUN2QyxZQUFZLEVBQUUsa0RBQWtEO2lCQUNuRSxDQUFDO2FBQ0w7aUJBQU07O29CQUNDLFFBQVEsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxRQUFRO2dCQUNsRCxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUTs7OztnQkFBRSxDQUFDLEtBQUssRUFBRSxFQUFFOzs7d0JBQ2xDLFVBQVUsR0FBRyxhQUFBLEtBQUssMENBQUUsUUFBUSwwQ0FBRSxHQUFHOzs7O29CQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsT0FBSyxFQUFFOzswQkFDOUQsWUFBWSxTQUFHLEtBQUssMENBQUUsWUFBWTtvQkFDeEMsSUFBSSxPQUFBLEtBQUssMENBQUUsT0FBTyxLQUFJLGNBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLDBDQUFFLFdBQVcsMENBQUUsTUFBTSxDQUFBLEVBQUU7d0JBQ2xFLFVBQVUsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO3FCQUN0QztvQkFFRCxJQUFJLFlBQVksRUFBRTt3QkFDZCxVQUFVLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsWUFBWSxDQUFDLENBQUM7cUJBQ2xEO29CQUVELElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFO3dCQUN2QyxLQUFLLG1DQUNFLEtBQUssS0FDUixVQUFVLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUNqRCxTQUFTLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsU0FBUyxHQUNsRCxDQUFDO3FCQUNMO29CQUNELHVDQUNPLElBQUksQ0FBQyxZQUFZLEtBQUUsUUFBUSxrQ0FBTSxLQUFLLEtBQUUsVUFBVSxFQUFFLGFBQWEsRUFBRSxJQUFJLENBQUMsZ0JBQWdCLE9BQzdGO2dCQUNOLENBQUMsRUFBQyxDQUFDO2dCQUVILElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO2dCQUN4QixJQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNuRCxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztnQkFDM0IsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7YUFDMUI7U0FDSjthQUFNOztnQkFDQyxVQUFVLEdBQUcsRUFBRTtZQUNuQixnQkFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsMENBQUUsUUFBUSwwQ0FBRSxNQUFNLEVBQUU7Z0JBQzlDLFVBQVUsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsR0FBRzs7OztnQkFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUMsQ0FBQzthQUNqRjtpQkFBTTtnQkFDSCxVQUFVLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDO2FBQ3REOztrQkFFSyxZQUFZLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsWUFBWTtZQUM1RCxJQUFJLFlBQVksRUFBRTtnQkFDZCxVQUFVLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsWUFBWSxDQUFDLENBQUM7YUFDbEQ7WUFDRCxJQUFJLE9BQUEsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLDBDQUFFLE9BQU8sS0FBSSxjQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSwwQ0FBRSxXQUFXLDBDQUFFLE1BQU0sQ0FBQSxFQUFFO2dCQUN2RixVQUFVLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQzthQUN0QztZQUNELFVBQVUsQ0FBQyxPQUFPOzs7OztZQUFDLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxFQUFFO2dCQUNsQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztnQkFDMUIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUM7b0JBQ3RCLEtBQUssRUFBRSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsYUFBYSxFQUFFLEtBQUssRUFBRSxTQUFTO29CQUMxRCxLQUFLLEVBQUUsQ0FBQztpQkFDWCxDQUFDLENBQUM7WUFDUCxDQUFDLEVBQUMsQ0FBQztZQUNILElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7WUFDbkQsZ0JBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLDBDQUFFLFdBQVcsMENBQUUsTUFBTSxFQUFFO2dCQUMvQyxJQUFJLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7YUFDNUU7WUFDRCxnQkFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sMENBQUUsU0FBUywwQ0FBRSxNQUFNLEVBQUU7O3NCQUN2QyxZQUFZLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUk7Ozs7Z0JBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBQztnQkFDdkgsVUFBSSxZQUFZLDBDQUFFLFNBQVMsRUFBRTtvQkFDekIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2lCQUM1RzthQUNKO1lBQ0QsSUFBSSxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUNwRCxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztZQUN2QixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztZQUMzQixJQUFJLENBQUMsWUFBWSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUM7U0FDN0Q7SUFDTCxDQUFDOzs7O0lBRUQsU0FBUzs7UUFDTCxJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsU0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsMENBQUUsSUFBSSxDQUFDO1FBQ2pFLElBQUksQ0FBQyxZQUFZLENBQUMsVUFBVSxTQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSwwQ0FBRSxVQUFVLENBQUM7UUFDdEUsSUFBSSxDQUFDLFlBQVksQ0FBQyxjQUFjLEdBQUcsYUFBQSxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsMENBQUUsY0FBYywwQ0FBRSxXQUFXLFFBQU8sSUFBSSxDQUFDO1FBQ3RHLElBQUksQ0FBQyxZQUFZLENBQUMsWUFBWSxlQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSwwQ0FBRSxZQUFZLDBDQUFFLE9BQU8sQ0FBQztRQUNuRixJQUFJLENBQUMsV0FBVyxHQUFHLGFBQUEsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLDBDQUFFLFdBQVcsMENBQUUsV0FBVyxRQUFPLElBQUksQ0FBQztRQUNuRixJQUFJLENBQUMsWUFBWSxHQUFHLGFBQUEsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLDBDQUFFLFlBQVksMENBQUUsV0FBVyxRQUFPLElBQUksQ0FBQztRQUNyRixJQUFJLENBQUMsY0FBYyxtQ0FBTyxJQUFJLENBQUMsY0FBYyxHQUFLLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3JGLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLFNBQVMsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQztRQUVqSCxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLGtCQUFrQixJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRTtZQUN0RixJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUM7U0FDbkU7UUFFRCxJQUFJLENBQUMsUUFBUSxHQUFHO1lBQ1osR0FBRyxRQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSwwQ0FBRSxVQUFVO1lBQzNDLE9BQU8sRUFBRSxPQUFBLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSwwQ0FBRSxjQUFjLEVBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLGNBQWMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDMUcsQ0FBQztRQUNGLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDO1FBQ3RELElBQUksQ0FBQyxVQUFVLEdBQUcsT0FBQSxJQUFJLENBQUMsUUFBUSwwQ0FBRSxHQUFHLEtBQUksT0FBQSxJQUFJLENBQUMsUUFBUSwwQ0FBRSxPQUFPLEtBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1FBQ25HLElBQUksY0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsMENBQUUsVUFBVSxDQUFBLEtBQUssUUFBUSxFQUFFO1lBQzVELElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1NBQzdGO1FBQ0QsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ3hDLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO0lBQ2hDLENBQUM7Ozs7OztJQUVPLG9CQUFvQixDQUFDLEdBQUc7O1lBQ3hCLFlBQVk7UUFDaEIsR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPOzs7O1FBQUMsSUFBSSxDQUFDLEVBQUU7WUFDeEIsSUFBSSxJQUFJLENBQUMsUUFBUSxJQUFJLENBQUMsWUFBWSxFQUFFO2dCQUNoQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7YUFDbEQ7UUFFTCxDQUFDLEVBQUMsQ0FBQztRQUNILE9BQU8sWUFBWSxDQUFDO0lBQ3hCLENBQUM7Ozs7OztJQUVPLFdBQVcsQ0FBQyxHQUFHO1FBQ25CLE9BQU8sR0FBRyxDQUFDLElBQUk7Ozs7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUMsQ0FBQztJQUMzQyxDQUFDOzs7O0lBRUQsb0JBQW9COztRQUNoQixJQUFJLENBQUMsT0FBQSxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsMENBQUUsVUFBVSxJQUFHLENBQUMsQ0FBQyxZQUFLLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSwwQ0FBRSxjQUFjLENBQUEsRUFBRTtZQUM3RixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLHdCQUF3QixPQUFDLElBQUksQ0FBQyxRQUFRLDBDQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztTQUMzRzthQUFNLElBQUksT0FBQSxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsMENBQUUsY0FBYyxZQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSwwQ0FBRSxVQUFVLENBQUEsRUFBRTtZQUM3RixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLHdCQUF3QixPQUFDLElBQUksQ0FBQyxRQUFRLDBDQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztTQUMzRztJQUNMLENBQUM7Ozs7SUFFRCxxQkFBcUI7UUFDakIsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVM7Ozs7UUFBQyxHQUFHLENBQUMsRUFBRSxlQUFDLE9BQUEsT0FBQSxHQUFHLENBQUMsUUFBUSwwQ0FBRSxVQUFVLGFBQUssSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLDBDQUFFLFVBQVUsQ0FBQSxDQUFBLEVBQUEsRUFBQyxDQUFDO0lBQ2hILENBQUM7Ozs7O0lBRUQsZ0JBQWdCLENBQUMsS0FBSztRQUNsQixJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsbUJBQW1CLEVBQUU7O2tCQUNqQyxrQkFBa0IsR0FBRyxJQUFJLENBQUMscUJBQXFCLEVBQUU7WUFDdkQsSUFBSSxDQUFDLGtCQUFrQixDQUFDLGtCQUFrQixDQUFDLENBQUM7U0FDL0M7UUFDRCxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztJQUMvQixDQUFDOzs7OztJQUVELFlBQVksQ0FBQyxLQUFLO1FBQ2QsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLG1CQUFtQixFQUFFO1lBQ3ZDLElBQUksQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFDOztrQkFDdEIsa0JBQWtCLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixFQUFFO1lBQ3ZELElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1lBQzVDLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLGtCQUFrQixDQUFDLENBQUM7U0FDbEQ7YUFBTTtZQUNILElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDMUI7SUFDTCxDQUFDOzs7OztJQUVELGFBQWEsQ0FBQyxLQUFLO1FBQ2YsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDakMsQ0FBQzs7OztJQUVELGdCQUFnQjs7Y0FDTixXQUFXLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRzs7OztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlOztjQUM5SCxRQUFRLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsT0FBTyxDQUFDO1FBQ2hELElBQUksQ0FBQyxPQUFPLEdBQUc7WUFDWCxPQUFPLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsZ0JBQWdCLENBQUMsSUFBSSxDQUFDO1lBQy9DLE9BQU8sRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxnQkFBZ0IsQ0FBQyxJQUFJLENBQUM7WUFDL0MsS0FBSyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLGNBQWMsQ0FBQyxJQUFJLENBQUM7WUFDM0MsT0FBTyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLGdCQUFnQixDQUFDLElBQUksQ0FBQztTQUNsRCxDQUFDO1FBQ0YsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO1FBQ3BILElBQUksQ0FBQyxhQUFhLENBQUMsc0JBQXNCLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDO0lBQ3hFLENBQUM7Ozs7O0lBRUQsa0JBQWtCLENBQUMsa0JBQTBCO1FBQ3pDLElBQUksQ0FBQyxlQUFlLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLFFBQVE7YUFDN0YsTUFBTTs7Ozs7UUFBQyxDQUFDLFdBQVcsRUFBRSxZQUFZLEVBQUUsRUFBRSxDQUFDLFdBQVcsR0FBRyxZQUFZLENBQUMsS0FBSyxHQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3BGLENBQUM7Ozs7OztJQUVELGNBQWMsQ0FBQyxLQUFLLEVBQUUsa0JBQTBCOztRQUM1QyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDOztjQUN2RSx1QkFBdUIsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sS0FBSyxDQUFDO1lBQ3ZELENBQUMsT0FBQSxLQUFLLENBQUMsT0FBTywwQ0FBRSxPQUFPLFdBQUcsS0FBSyxDQUFDLE9BQU8sMENBQUUsS0FBSyxDQUFBLENBQUMsa0JBQUssSUFBSSxDQUFDLGVBQWUsQ0FBQyxrQkFBa0IsQ0FBQywwQ0FBRSxRQUFRLDBDQUFFLE1BQU0sQ0FBQTs7Y0FDNUcsMkJBQTJCLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEdBQUcsQ0FBQztRQUU3RCxJQUFJLEtBQUssQ0FBQyxlQUFlLEVBQUU7WUFDdkIsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQztZQUM5QixJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3ZCLE9BQU87U0FDVjs7WUFFRyxnQkFBZ0IsR0FBRyxrQkFBa0IsR0FBRyxDQUFDO1FBQzdDLElBQUksS0FBSyxDQUFDLGFBQWEsRUFBRTs7a0JBQ2YsWUFBWSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUzs7OztZQUFDLEdBQUcsQ0FBQyxFQUFFLFdBQUMsT0FBQSxPQUFBLEdBQUcsQ0FBQyxRQUFRLDBDQUFFLFVBQVUsTUFBSyxLQUFLLENBQUMsYUFBYSxDQUFBLEVBQUEsRUFBQztZQUNyRyxnQkFBZ0IsR0FBRyxZQUFZLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLENBQUM7U0FDMUU7UUFFRCxJQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUNsRCxJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU87Ozs7O1FBQUMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUU7WUFDekMsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLEtBQUssZ0JBQWdCLENBQUM7WUFFM0MsSUFBSSxLQUFLLEtBQUssa0JBQWtCLEVBQUU7Z0JBQzlCLElBQUksdUJBQXVCLEVBQUU7b0JBQ3pCLElBQUksQ0FBQyxLQUFLLEdBQUcsV0FBVyxDQUFDO2lCQUM1QjtxQkFBTSxJQUFJLDJCQUEyQixFQUFFO29CQUNwQyxJQUFJLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQztpQkFDMUI7YUFDSjtRQUNMLENBQUMsRUFBQyxDQUFDO1FBQ0gsSUFBSSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRTtZQUN6QyxJQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7U0FDckU7YUFBTTtZQUNILElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDMUI7SUFDTCxDQUFDOzs7OztJQUVELFVBQVUsQ0FBQyxLQUFLO1FBQ1osSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1FBQ3hCLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxjQUFjLEVBQUU7WUFDbEMsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7U0FDOUI7YUFBTTtZQUNILElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO1lBQzNCLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1lBQ3hCLElBQUksQ0FBQyxhQUFhLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLG9CQUFvQixFQUFFLElBQUksQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDcEgsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsSUFBSSxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDcEYsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQztZQUNqQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO1NBRWhDO0lBQ0wsQ0FBQzs7OztJQUVELGFBQWE7O1FBQ1QsSUFBSSxDQUFDLFlBQVksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1FBQ3BDLElBQUksQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFDO1FBQzVCLElBQUksQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFDO1FBQzVCLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxLQUFLLENBQUM7UUFDL0IsSUFBSSxDQUFDLGdCQUFnQixHQUFHLEtBQUssQ0FBQztRQUM5QixJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7UUFDbEQsSUFBSSxDQUFDLFVBQVUsR0FBRyxPQUFBLElBQUksQ0FBQyxRQUFRLDBDQUFFLEdBQUcsS0FBSSxPQUFBLElBQUksQ0FBQyxRQUFRLDBDQUFFLE9BQU8sS0FBSSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDbkcsSUFBSSxDQUFDLGtCQUFrQixHQUFHLENBQUMsQ0FBQztRQUM1QixJQUFJLENBQUMsb0JBQW9CLEdBQUcsQ0FBQyxDQUFDO1FBQzlCLElBQUksQ0FBQyxlQUFlLEdBQUcsRUFBRSxDQUFDO1FBQzFCLElBQUksQ0FBQyxjQUFjLEdBQUcsU0FBUyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxPQUFPLEdBQUc7WUFDWCxPQUFPLEVBQUUsQ0FBQztZQUNWLE9BQU8sRUFBRSxDQUFDO1lBQ1YsT0FBTyxFQUFFLENBQUM7WUFDVixLQUFLLEVBQUUsQ0FBQztTQUNYLENBQUM7UUFDRixJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztRQUNuQixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDeEMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7UUFDMUIsSUFBSSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUM7UUFDNUIsSUFBSSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUM7UUFDNUIsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDO1FBQ2xHLElBQUksT0FBQSxJQUFJLENBQUMsUUFBUSwwQ0FBRSxHQUFHLGFBQUssSUFBSSxDQUFDLFFBQVEsMENBQUUsT0FBTyxDQUFBLEVBQUU7WUFDL0MsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7U0FDcEg7UUFDRCxJQUFJLENBQUMsYUFBYSxDQUFDLG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxhQUFhLEVBQUUsYUFBYSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUUzRixVQUFVOzs7UUFBQyxHQUFHLEVBQUU7WUFDWixJQUFJLENBQUMsWUFBWSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7UUFDekMsQ0FBQyxHQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ1osQ0FBQzs7Ozs7SUFFRCxnQkFBZ0IsQ0FBQyxrQkFBa0IsR0FBRyxDQUFDOzs7Y0FDN0IsU0FBUyxHQUFHLDRCQUE0QixDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7UUFDeEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPOzs7OztRQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxFQUFFOztZQUNqQyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQztnQkFDdEIsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxFQUFFLEtBQUssRUFBRSxhQUFhLEVBQUUsS0FBSyxFQUFFLFNBQVM7Z0JBQy9FLEtBQUssRUFBRSxDQUFDO2dCQUNSLFFBQVEsRUFBRSxDQUFDLEtBQUssa0JBQWtCO2dCQUNsQyxVQUFVLFFBQUUsT0FBTyxDQUFDLFFBQVEsMENBQUUsVUFBVTthQUMzQyxDQUFDLENBQUM7O2tCQUNHLFFBQVEsR0FBRyxFQUFFO1lBQ25CLE9BQU8sQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLE9BQU87Ozs7O1lBQUMsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUU7Z0JBQ2pELFFBQVEsQ0FBQyxJQUFJLENBQUM7b0JBQ1YsVUFBVSxFQUFFLEtBQUs7b0JBQ2pCLEtBQUssRUFBRSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsYUFBYSxFQUFFLEtBQUssRUFBRSxTQUFTO29CQUMxRCxNQUFNLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxTQUFTO29CQUN6QyxLQUFLLEVBQUUsQ0FBQztpQkFDWCxDQUFDLENBQUM7Z0JBQ0gsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7WUFDOUIsQ0FBQyxFQUFDLENBQUM7WUFDSCxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxtQ0FDOUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUUsUUFBUSxHQUM1QyxDQUFDO1lBRUYsZ0JBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLDBDQUFFLFNBQVMsMENBQUUsTUFBTSxFQUFFOztzQkFDdkMsWUFBWSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJOzs7O2dCQUFDLElBQUksQ0FBQyxFQUFFLFdBQUMsT0FBQSxJQUFJLENBQUMsRUFBRSxZQUFLLE9BQU8sQ0FBQyxRQUFRLDBDQUFFLFVBQVUsQ0FBQSxDQUFBLEVBQUEsRUFBQztnQkFDOUcsVUFBSSxZQUFZLDBDQUFFLFNBQVMsRUFBRTtvQkFDekIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxzQkFBc0IsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUM7aUJBQ2xHO2FBQ0o7UUFDTCxDQUFDLEVBQUMsQ0FBQztRQUNILGdCQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSwwQ0FBRSxXQUFXLDBDQUFFLE1BQU0sRUFBRTtZQUMvQyxJQUFJLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDekUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1NBQzNDO1FBQ0QsSUFBSSxDQUFDLFlBQVksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDO0lBQzlELENBQUM7Ozs7SUFFRCxjQUFjO1FBQ1YsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU07Ozs7O1FBQUMsQ0FBQyxXQUFXLEVBQUUsWUFBWSxFQUFFLEVBQUUsQ0FBQyxXQUFXLEdBQUcsWUFBWSxDQUFDLEtBQUssR0FBRSxDQUFDLENBQUMsQ0FBQztRQUNsSCxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztRQUM1QixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDM0IsQ0FBQzs7Ozs7SUFFRCxXQUFXLENBQUMsS0FBSzs7UUFDYixJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDdEIsSUFBSSxPQUFBLEtBQUssMENBQUUsSUFBSSxNQUFLLE1BQU0sRUFBRTtZQUN4QixJQUFJLENBQUMsYUFBYSxDQUFDLG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsRUFBRSxhQUFhLENBQUMsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQ3hHLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1lBQ3hCLElBQUksQ0FBQyxhQUFhLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLG9CQUFvQixFQUFFLElBQUksQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDcEgsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQztZQUNqQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxJQUFJLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUN2RjtJQUNMLENBQUM7Ozs7Ozs7SUFHRCxhQUFhLENBQUMsb0JBQW9CLEVBQUUsV0FBVyxFQUFFLEtBQUs7UUFDbEQsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7WUFDdkIsT0FBTztTQUNWO1FBQ0QsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQztRQUM3QixJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQztRQUMvRCxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxvQkFBb0IsRUFBRSxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFM0UsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxFQUFFO1lBQ2hFLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLFNBQVMsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO1NBQ3BIO0lBQ0wsQ0FBQzs7OztJQUVELGdCQUFnQjs7UUFDWixJQUFJLE9BQUEsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLDBDQUFFLFdBQVcsTUFBSyxPQUFPLEVBQUU7WUFDckQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsUUFBUSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztZQUMvRSxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1NBQzVFO0lBQ0wsQ0FBQzs7Ozs7SUFFRCxrQkFBa0IsQ0FBQyxLQUFLOztRQUNwQixVQUFJLEtBQUssMENBQUUsZ0JBQWdCLEVBQUU7WUFDekIsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1NBQ3pCO0lBQ0wsQ0FBQzs7Ozs7SUFFRCxxQkFBcUIsQ0FBQyxLQUFLO1FBQ3ZCLFFBQVEsS0FBSyxDQUFDLElBQUksRUFBRTtZQUNoQixLQUFLLGNBQWM7Z0JBQ2YsSUFBSSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUM7Z0JBQzVCLE1BQU07WUFDVjtnQkFDSSxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztnQkFDM0IsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7Z0JBQ3hCLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO2dCQUN4QixJQUFJLENBQUMsYUFBYSxDQUFDLG1CQUFtQixDQUFDLFNBQVMsQ0FBQyx1QkFBdUIsRUFBRSxhQUFhLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDckgsSUFBSSxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsSUFBSSxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDcEgsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsSUFBSSxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBQ3BGLElBQUksQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFDO2dCQUM1QixJQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxDQUFDO2dCQUNqQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQztvQkFDbEIsTUFBTSxFQUFFLElBQUksQ0FBQyxlQUFlO2lCQUMvQixDQUFDLENBQUM7U0FDVjtJQUNMLENBQUM7Ozs7SUFFRCxvQkFBb0I7UUFDaEIsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQy9DLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLHNCQUFzQixDQUFDLEVBQUU7WUFDdEQsS0FBSyxVQUFVLENBQUMsQ0FBQztnQkFDYixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsTUFBTSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUM7Z0JBQ3BHLE1BQU07YUFDVDtZQUNELEtBQUssVUFBVSxDQUFDLENBQUM7Z0JBQ2IsSUFBSSxDQUFDLFlBQVksR0FBRyxFQUFFLENBQUM7Z0JBQ3ZCLE1BQU07YUFDVDtTQUNKO0lBQ0wsQ0FBQzs7Ozs7SUFFRCxZQUFZLENBQUMsS0FBSztRQUNkLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxtQkFBbUIsSUFBSSxLQUFLLENBQUMsVUFBVSxFQUFFOztrQkFDckQsWUFBWSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUzs7OztZQUFDLEdBQUcsQ0FBQyxFQUFFLFdBQUMsT0FBQSxPQUFBLEdBQUcsQ0FBQyxRQUFRLDBDQUFFLFVBQVUsTUFBSyxLQUFLLENBQUMsVUFBVSxDQUFBLEVBQUEsRUFBQztZQUNsRyxJQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO1lBQzlELElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTzs7Ozs7WUFBQyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRTtnQkFDekMsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLEtBQUssWUFBWSxDQUFDO1lBQzNDLENBQUMsRUFBQyxDQUFDO1NBQ047UUFDRCxJQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQztRQUM1QixJQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQztJQUNoQyxDQUFDOzs7O0lBR0QsV0FBVztRQUNQLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUN0QixJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztRQUN4QixJQUFJLElBQUksQ0FBQyxvQkFBb0IsS0FBSyxLQUFLLEVBQUU7WUFDckMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsSUFBSSxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUN2SDtRQUNELElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLG9CQUFvQixFQUFFLElBQUksQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3hGLENBQUM7OztZQXJmSixTQUFTLFNBQUM7Z0JBQ1AsUUFBUSxFQUFFLGtCQUFrQjtnQkFDNUIsdThFQUEyQzs7YUFFOUM7Ozs7WUFUTyxhQUFhO1lBRWIsV0FBVztZQUNYLGNBQWM7Ozt3QkFRakIsS0FBSzsyQkFDTCxLQUFLOzBCQUNMLE1BQU07MEJBQ04sTUFBTTs2QkFDTixNQUFNOytCQWlFTixZQUFZLFNBQUMseUJBQXlCLEVBQUUsQ0FBQyxRQUFRLENBQUM7MEJBa2FsRCxZQUFZLFNBQUMscUJBQXFCOzs7O0lBdmVuQyx3Q0FBMkI7O0lBQzNCLDJDQUF3Qzs7SUFDeEMsMENBQWdEOztJQUNoRCwwQ0FBZ0Q7O0lBQ2hELDZDQUFtRDs7SUFFbkQsd0NBQWtCOztJQUNsQixrREFBNEI7O0lBQzVCLGtEQUE0Qjs7SUFDNUIsdUNBQXFCOztJQUNyQiw2Q0FBdUI7O0lBQ3ZCLDJDQUFpQjs7SUFDakIsNENBQW1COztJQUNuQiwyQ0FBa0M7O0lBQ2xDLDJDQVdFOztJQUVGLDBDQUFtQjs7SUFDbkIsMkNBQXNCOztJQUN0Qiw2Q0FBdUI7O0lBQ3ZCLCtDQUF5Qjs7SUFDekIsbURBQTZCOztJQUM3Qix5Q0FBa0I7O0lBRWxCLHVDQUEyQzs7SUFDM0MsOENBQXFCOztJQUNyQiw2Q0FBdUI7O0lBQ3ZCLHNDQUtFOztJQUNGLGdEQUEwQjs7SUFDMUIseUNBQWU7O0lBQ2YsaURBQXVCOztJQUN2Qiw0Q0FBc0I7O0lBQ3RCLDJDQUFxQjs7SUFDckIseUNBQW1COztJQUNuQiwwQ0FBb0I7O0lBQ3BCLDZDQU1FOztJQUNGLHVDQUFpQjs7SUFDakIsNkNBQW9COztJQUNwQixtREFBeUI7O0lBQ3pCLCtDQUF3Qjs7SUFHcEIsNENBQW1DOzs7OztJQUNuQywwQ0FBZ0M7O0lBQ2hDLDZDQUFxQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIEhvc3RMaXN0ZW5lciwgSW5wdXQsIE9uSW5pdCwgT3V0cHV0fSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Y29udGVudEVycm9yTWVzc2FnZX0gZnJvbSAnQHByb2plY3Qtc3VuYmlyZC9zdW5iaXJkLXBsYXllci1zZGstdjkvbGliL3BsYXllci11dGlscy9pbnRlcmZhY2VzL2Vycm9yTWVzc2FnZSc7XG5pbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaC1lcyc7XG5pbXBvcnQge0lQYXJlbnRDb25maWcsIFF1bWxQbGF5ZXJDb25maWd9IGZyb20gJy4uL3F1bWwtbGlicmFyeS1pbnRlcmZhY2UnO1xuaW1wb3J0IHtWaWV3ZXJTZXJ2aWNlfSBmcm9tICcuLi9zZXJ2aWNlcy92aWV3ZXItc2VydmljZS92aWV3ZXItc2VydmljZSc7XG5pbXBvcnQge2V2ZW50TmFtZSwgcGFnZUlkLCBUZWxlbWV0cnlUeXBlfSBmcm9tICcuLi90ZWxlbWV0cnktY29uc3RhbnRzJztcbmltcG9ydCB7VXRpbFNlcnZpY2V9IGZyb20gJy4uL3V0aWwtc2VydmljZSc7XG5pbXBvcnQge1F1ZXN0aW9uQ3Vyc29yfSBmcm9tICcuLi9xdW1sLXF1ZXN0aW9uLWN1cnNvci5zZXJ2aWNlJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdxdW1sLW1haW4tcGxheWVyJyxcbiAgICB0ZW1wbGF0ZVVybDogJy4vbWFpbi1wbGF5ZXIuY29tcG9uZW50Lmh0bWwnLFxuICAgIHN0eWxlVXJsczogWycuL21haW4tcGxheWVyLmNvbXBvbmVudC5zY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgTWFpblBsYXllckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gICAgQElucHV0KCkgY29udGVudElkOiBzdHJpbmc7XG4gICAgQElucHV0KCkgcGxheWVyQ29uZmlnOiBRdW1sUGxheWVyQ29uZmlnO1xuICAgIEBPdXRwdXQoKSBwbGF5ZXJFdmVudCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICAgIEBPdXRwdXQoKSBzdWJtaXRFdmVudCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICAgIEBPdXRwdXQoKSB0ZWxlbWV0cnlFdmVudCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gICAgaXNMb2FkaW5nID0gZmFsc2U7XG4gICAgaXNTZWN0aW9uc0F2YWlsYWJsZSA9IGZhbHNlO1xuICAgIGlzTXVsdGlMZXZlbFNlY3Rpb24gPSBmYWxzZTtcbiAgICBzZWN0aW9uczogYW55W10gPSBbXTtcbiAgICBpc0ZpcnN0U2VjdGlvbiA9IGZhbHNlO1xuICAgIHNlY3Rpb25JbmRleCA9IDA7XG4gICAgYWN0aXZlU2VjdGlvbjogYW55O1xuICAgIGNvbnRlbnRFcnJvcjogY29udGVudEVycm9yTWVzc2FnZTtcbiAgICBwYXJlbnRDb25maWc6IElQYXJlbnRDb25maWcgPSB7XG4gICAgICAgIGxvYWRTY29yZUJvYXJkOiBmYWxzZSxcbiAgICAgICAgcmVxdWlyZXNTdWJtaXQ6IGZhbHNlLFxuICAgICAgICBpc0ZpcnN0U2VjdGlvbjogZmFsc2UsXG4gICAgICAgIGlzU2VjdGlvbnNBdmFpbGFibGU6IGZhbHNlLFxuICAgICAgICBpc1JlcGxheWVkOiBmYWxzZSxcbiAgICAgICAgaWRlbnRpZmllcjogJycsXG4gICAgICAgIGNvbnRlbnROYW1lOiAnJyxcbiAgICAgICAgYmFzZVVybDogJycsXG4gICAgICAgIGluc3RydWN0aW9uczoge30sXG4gICAgICAgIHF1ZXN0aW9uQ291bnQ6IDAsXG4gICAgfTtcblxuICAgIHNob3dFbmRQYWdlID0gdHJ1ZTtcbiAgICBzaG93RmVlZEJhY2s6IGJvb2xlYW47XG4gICAgZW5kUGFnZVJlYWNoZWQgPSBmYWxzZTtcbiAgICBpc0VuZEV2ZW50UmFpc2VkID0gZmFsc2U7XG4gICAgaXNTdW1tYXJ5RXZlbnRSYWlzZWQgPSBmYWxzZTtcbiAgICBzaG93UmVwbGF5ID0gdHJ1ZTtcblxuICAgIGF0dGVtcHRzOiB7IG1heDogbnVtYmVyLCBjdXJyZW50OiBudW1iZXIgfTtcbiAgICBtYWluUHJvZ3Jlc3NCYXIgPSBbXTtcbiAgICBsb2FkU2NvcmVCb2FyZCA9IGZhbHNlO1xuICAgIHN1bW1hcnk6IHtcbiAgICAgICAgY29ycmVjdDogMCxcbiAgICAgICAgcGFydGlhbDogMCxcbiAgICAgICAgc2tpcHBlZDogMCxcbiAgICAgICAgd3Jvbmc6IDBcbiAgICB9O1xuICAgIGlzRHVyYXRpb25FeHBpcmVkID0gZmFsc2U7XG4gICAgZmluYWxTY29yZSA9IDA7XG4gICAgdG90YWxOb09mUXVlc3Rpb25zID0gMDtcbiAgICBkdXJhdGlvblNwZW50OiBzdHJpbmc7XG4gICAgb3V0Y29tZUxhYmVsOiBzdHJpbmc7XG4gICAgdG90YWxTY29yZTogbnVtYmVyO1xuICAgIGluaXRpYWxUaW1lOiBudW1iZXI7XG4gICAgc2lkZU1lbnVDb25maWcgPSB7XG4gICAgICAgIGVuYWJsZTogdHJ1ZSxcbiAgICAgICAgc2hvd1NoYXJlOiB0cnVlLFxuICAgICAgICBzaG93RG93bmxvYWQ6IHRydWUsXG4gICAgICAgIHNob3dSZXBsYXk6IGZhbHNlLFxuICAgICAgICBzaG93RXhpdDogdHJ1ZSxcbiAgICB9O1xuICAgIHVzZXJOYW1lOiBzdHJpbmc7XG4gICAganVtcFRvUXVlc3Rpb246IGFueTtcbiAgICB0b3RhbFZpc2l0ZWRRdWVzdGlvbiA9IDA7XG4gICAgc2hvd0luc3RydWN0aW9ucyA9ICdObyc7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHVibGljIHZpZXdlclNlcnZpY2U6IFZpZXdlclNlcnZpY2UsXG4gICAgICAgIHByaXZhdGUgdXRpbFNlcnZpY2U6IFV0aWxTZXJ2aWNlLFxuICAgICAgICBwdWJsaWMgcXVlc3Rpb25DdXJzb3I6IFF1ZXN0aW9uQ3Vyc29yXG4gICAgKSB7XG4gICAgfVxuXG4gICAgQEhvc3RMaXN0ZW5lcignZG9jdW1lbnQ6VGVsZW1ldHJ5RXZlbnQnLCBbJyRldmVudCddKVxuICAgIG9uVGVsZW1ldHJ5RXZlbnQoZXZlbnQpIHtcbiAgICAgICAgdGhpcy50ZWxlbWV0cnlFdmVudC5lbWl0KGV2ZW50LmRldGFpbCk7XG4gICAgfVxuXG4gICAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5wbGF5ZXJDb25maWcgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHRoaXMucGxheWVyQ29uZmlnID0gSlNPTi5wYXJzZSh0aGlzLnBsYXllckNvbmZpZyk7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0ludmFsaWQgcGxheWVyQ29uZmlnOiAnLCBlcnJvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pc0xvYWRpbmcgPSB0cnVlO1xuICAgICAgICB0aGlzLnNldENvbmZpZygpO1xuICAgICAgICB0aGlzLmluaXRpYWxpemVTZWN0aW9ucygpO1xuICAgICAgICAvKnRoaXMucXVlc3Rpb25DdXJzb3IuZ2V0UXVlc3Rpb25TZXQodGhpcy5jb250ZW50SWQpLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbGF5ZXJDb25maWdbJ21ldGFkYXRhJ10gPSBfLmdldChkYXRhLCAncmVzdWx0LnF1ZXN0aW9uU2V0Jyk7XG4gICAgICAgICAgICB0aGlzLnBsYXllckNvbmZpZ1snbWV0YWRhdGEnXS5yZXF1aXJlc1N1Ym1pdCA9ICdZZXMnO1xuXG4gICAgICAgICAgICB0aGlzLnNldENvbmZpZygpO1xuICAgICAgICAgICAgdGhpcy5pbml0aWFsaXplU2VjdGlvbnMoKTtcbiAgICAgICAgfSwgKGVycm9yKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgIH0pOyovXG4gICAgfVxuXG5cbiAgICBpbml0aWFsaXplU2VjdGlvbnMoKSB7XG4gICAgICAgIGNvbnN0IGNoaWxkTWltZVR5cGUgPSBfLm1hcCh0aGlzLnBsYXllckNvbmZpZy5tZXRhZGF0YS5jaGlsZHJlbiwgJ21pbWVUeXBlJyk7XG4gICAgICAgIHRoaXMucGFyZW50Q29uZmlnLmlzU2VjdGlvbnNBdmFpbGFibGUgPSB0aGlzLmlzU2VjdGlvbnNBdmFpbGFibGUgPSBjaGlsZE1pbWVUeXBlWzBdID09PSAnYXBwbGljYXRpb24vdm5kLnN1bmJpcmQucXVlc3Rpb25zZXQnO1xuICAgICAgICB0aGlzLnZpZXdlclNlcnZpY2Uuc2VjdGlvblF1ZXN0aW9ucyA9IFtdO1xuICAgICAgICBpZiAodGhpcy5pc1NlY3Rpb25zQXZhaWxhYmxlKSB7XG4gICAgICAgICAgICB0aGlzLmlzTXVsdGlMZXZlbFNlY3Rpb24gPSB0aGlzLmdldE11bHRpbGV2ZWxTZWN0aW9uKHRoaXMucGxheWVyQ29uZmlnLm1ldGFkYXRhKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuaXNNdWx0aUxldmVsU2VjdGlvbikge1xuICAgICAgICAgICAgICAgIHRoaXMuY29udGVudEVycm9yID0ge1xuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlSGVhZGVyOiAnVW5hYmxlIHRvIGxvYWQgY29udGVudCcsXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2VUaXRsZTogJ011bHRpIGxldmVsIHNlY3Rpb25zIGFyZSBub3Qgc3VwcG9ydGVkIGFzIG9mIG5vdydcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsZXQgY2hpbGRyZW4gPSB0aGlzLnBsYXllckNvbmZpZy5tZXRhZGF0YS5jaGlsZHJlbjtcbiAgICAgICAgICAgICAgICB0aGlzLnNlY3Rpb25zID0gXy5tYXAoY2hpbGRyZW4sIChjaGlsZCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQgY2hpbGROb2RlcyA9IGNoaWxkPy5jaGlsZHJlbj8ubWFwKGl0ZW0gPT4gaXRlbS5pZGVudGlmaWVyKSB8fCBbXTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbWF4UXVlc3Rpb25zID0gY2hpbGQ/Lm1heFF1ZXN0aW9ucztcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoaWxkPy5zaHVmZmxlICYmICF0aGlzLnBsYXllckNvbmZpZy5jb25maWc/LnByb2dyZXNzQmFyPy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkTm9kZXMgPSBfLnNodWZmbGUoY2hpbGROb2Rlcyk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAobWF4UXVlc3Rpb25zKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZE5vZGVzID0gY2hpbGROb2Rlcy5zbGljZSgwLCBtYXhRdWVzdGlvbnMpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucGxheWVyQ29uZmlnLm1ldGFkYXRhLnRpbWVMaW1pdHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLmNoaWxkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVMaW1pdHM6IHRoaXMucGxheWVyQ29uZmlnLm1ldGFkYXRhLnRpbWVMaW1pdHMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvd1RpbWVyOiB0aGlzLnBsYXllckNvbmZpZy5tZXRhZGF0YS5zaG93VGltZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLnRoaXMucGxheWVyQ29uZmlnLCBtZXRhZGF0YTogey4uLmNoaWxkLCBjaGlsZE5vZGVzLCBzaG93U3RhcnRQYWdlOiB0aGlzLnNob3dJbnN0cnVjdGlvbnN9LFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRJbml0aWFsU2NvcmVzKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5hY3RpdmVTZWN0aW9uID0gXy5jbG9uZURlZXAodGhpcy5zZWN0aW9uc1swXSk7XG4gICAgICAgICAgICAgICAgdGhpcy5pc0ZpcnN0U2VjdGlvbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5pc0xvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBjaGlsZE5vZGVzID0gW107XG4gICAgICAgICAgICBpZiAodGhpcy5wbGF5ZXJDb25maWcubWV0YWRhdGE/LmNoaWxkcmVuPy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBjaGlsZE5vZGVzID0gdGhpcy5wbGF5ZXJDb25maWcubWV0YWRhdGEuY2hpbGRyZW4ubWFwKGl0ZW0gPT4gaXRlbS5pZGVudGlmaWVyKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY2hpbGROb2RlcyA9IHRoaXMucGxheWVyQ29uZmlnLm1ldGFkYXRhLmNoaWxkTm9kZXM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IG1heFF1ZXN0aW9ucyA9IHRoaXMucGxheWVyQ29uZmlnLm1ldGFkYXRhLm1heFF1ZXN0aW9ucztcbiAgICAgICAgICAgIGlmIChtYXhRdWVzdGlvbnMpIHtcbiAgICAgICAgICAgICAgICBjaGlsZE5vZGVzID0gY2hpbGROb2Rlcy5zbGljZSgwLCBtYXhRdWVzdGlvbnMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMucGxheWVyQ29uZmlnLm1ldGFkYXRhPy5zaHVmZmxlICYmICF0aGlzLnBsYXllckNvbmZpZy5jb25maWc/LnByb2dyZXNzQmFyPy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBjaGlsZE5vZGVzID0gXy5zaHVmZmxlKGNoaWxkTm9kZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2hpbGROb2Rlcy5mb3JFYWNoKChlbGVtZW50LCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMudG90YWxOb09mUXVlc3Rpb25zKys7XG4gICAgICAgICAgICAgICAgdGhpcy5tYWluUHJvZ3Jlc3NCYXIucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIGluZGV4OiAoaW5kZXggKyAxKSwgY2xhc3M6ICd1bmF0dGVtcHRlZCcsIHZhbHVlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgIHNjb3JlOiAwLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLnBsYXllckNvbmZpZy5tZXRhZGF0YS5jaGlsZE5vZGVzID0gY2hpbGROb2RlcztcbiAgICAgICAgICAgIGlmICh0aGlzLnBsYXllckNvbmZpZy5jb25maWc/LnByb2dyZXNzQmFyPy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm1haW5Qcm9ncmVzc0JhciA9IF8uY2xvbmVEZWVwKHRoaXMucGxheWVyQ29uZmlnLmNvbmZpZy5wcm9ncmVzc0Jhcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5wbGF5ZXJDb25maWcuY29uZmlnPy5xdWVzdGlvbnM/Lmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHF1ZXN0aW9uc09iaiA9IHRoaXMucGxheWVyQ29uZmlnLmNvbmZpZy5xdWVzdGlvbnMuZmluZChpdGVtID0+IGl0ZW0uaWQgPT09IHRoaXMucGxheWVyQ29uZmlnLm1ldGFkYXRhLmlkZW50aWZpZXIpO1xuICAgICAgICAgICAgICAgIGlmIChxdWVzdGlvbnNPYmo/LnF1ZXN0aW9ucykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnZpZXdlclNlcnZpY2UudXBkYXRlU2VjdGlvblF1ZXN0aW9ucyh0aGlzLnBsYXllckNvbmZpZy5tZXRhZGF0YS5pZGVudGlmaWVyLCBxdWVzdGlvbnNPYmoucXVlc3Rpb25zKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmFjdGl2ZVNlY3Rpb24gPSBfLmNsb25lRGVlcCh0aGlzLnBsYXllckNvbmZpZyk7XG4gICAgICAgICAgICB0aGlzLmlzTG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5pc0ZpcnN0U2VjdGlvbiA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLnBhcmVudENvbmZpZy5xdWVzdGlvbkNvdW50ID0gdGhpcy50b3RhbE5vT2ZRdWVzdGlvbnM7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRDb25maWcoKSB7XG4gICAgICAgIHRoaXMucGFyZW50Q29uZmlnLmNvbnRlbnROYW1lID0gdGhpcy5wbGF5ZXJDb25maWcubWV0YWRhdGE/Lm5hbWU7XG4gICAgICAgIHRoaXMucGFyZW50Q29uZmlnLmlkZW50aWZpZXIgPSB0aGlzLnBsYXllckNvbmZpZy5tZXRhZGF0YT8uaWRlbnRpZmllcjtcbiAgICAgICAgdGhpcy5wYXJlbnRDb25maWcucmVxdWlyZXNTdWJtaXQgPSB0aGlzLnBsYXllckNvbmZpZy5tZXRhZGF0YT8ucmVxdWlyZXNTdWJtaXQ/LnRvTG93ZXJDYXNlKCkgIT09ICdubyc7XG4gICAgICAgIHRoaXMucGFyZW50Q29uZmlnLmluc3RydWN0aW9ucyA9IHRoaXMucGxheWVyQ29uZmlnLm1ldGFkYXRhPy5pbnN0cnVjdGlvbnM/LmRlZmF1bHQ7XG4gICAgICAgIHRoaXMuc2hvd0VuZFBhZ2UgPSB0aGlzLnBsYXllckNvbmZpZy5tZXRhZGF0YT8uc2hvd0VuZFBhZ2U/LnRvTG93ZXJDYXNlKCkgIT09ICdubyc7XG4gICAgICAgIHRoaXMuc2hvd0ZlZWRCYWNrID0gdGhpcy5wbGF5ZXJDb25maWcubWV0YWRhdGE/LnNob3dGZWVkYmFjaz8udG9Mb3dlckNhc2UoKSAhPT0gJ25vJztcbiAgICAgICAgdGhpcy5zaWRlTWVudUNvbmZpZyA9IHsuLi50aGlzLnNpZGVNZW51Q29uZmlnLCAuLi50aGlzLnBsYXllckNvbmZpZy5jb25maWcuc2lkZU1lbnV9O1xuICAgICAgICB0aGlzLnVzZXJOYW1lID0gdGhpcy5wbGF5ZXJDb25maWcuY29udGV4dC51c2VyRGF0YS5maXJzdE5hbWUgKyAnICcgKyB0aGlzLnBsYXllckNvbmZpZy5jb250ZXh0LnVzZXJEYXRhLmxhc3ROYW1lO1xuXG4gICAgICAgIGlmICh0aGlzLnBsYXllckNvbmZpZy5tZXRhZGF0YS5pc0F2YWlsYWJsZUxvY2FsbHkgJiYgdGhpcy5wbGF5ZXJDb25maWcubWV0YWRhdGEuYmFzZVBhdGgpIHtcbiAgICAgICAgICAgIHRoaXMucGFyZW50Q29uZmlnLmJhc2VVcmwgPSB0aGlzLnBsYXllckNvbmZpZy5tZXRhZGF0YS5iYXNlUGF0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuYXR0ZW1wdHMgPSB7XG4gICAgICAgICAgICBtYXg6IHRoaXMucGxheWVyQ29uZmlnLm1ldGFkYXRhPy5tYXhBdHRlbXB0LFxuICAgICAgICAgICAgY3VycmVudDogdGhpcy5wbGF5ZXJDb25maWcubWV0YWRhdGE/LmN1cnJlbnRBdHRlbXB0ID8gdGhpcy5wbGF5ZXJDb25maWcubWV0YWRhdGEuY3VycmVudEF0dGVtcHQgKyAxIDogMVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLnRvdGFsU2NvcmUgPSB0aGlzLnBsYXllckNvbmZpZy5tZXRhZGF0YS5tYXhTY29yZTtcbiAgICAgICAgdGhpcy5zaG93UmVwbGF5ID0gdGhpcy5hdHRlbXB0cz8ubWF4ICYmIHRoaXMuYXR0ZW1wdHM/LmN1cnJlbnQgPj0gdGhpcy5hdHRlbXB0cy5tYXggPyBmYWxzZSA6IHRydWU7XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5wbGF5ZXJDb25maWcubWV0YWRhdGE/LnRpbWVMaW1pdHMgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICB0aGlzLnBsYXllckNvbmZpZy5tZXRhZGF0YS50aW1lTGltaXRzID0gSlNPTi5wYXJzZSh0aGlzLnBsYXllckNvbmZpZy5tZXRhZGF0YS50aW1lTGltaXRzKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmluaXRpYWxUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgIHRoaXMuZW1pdE1heEF0dGVtcHRFdmVudHMoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldE11bHRpbGV2ZWxTZWN0aW9uKG9iaikge1xuICAgICAgICBsZXQgaXNNdWx0aUxldmVsO1xuICAgICAgICBvYmouY2hpbGRyZW4uZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgICAgIGlmIChpdGVtLmNoaWxkcmVuICYmICFpc011bHRpTGV2ZWwpIHtcbiAgICAgICAgICAgICAgICBpc011bHRpTGV2ZWwgPSB0aGlzLmhhc0NoaWxkcmVuKGl0ZW0uY2hpbGRyZW4pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gaXNNdWx0aUxldmVsO1xuICAgIH1cblxuICAgIHByaXZhdGUgaGFzQ2hpbGRyZW4oYXJyKSB7XG4gICAgICAgIHJldHVybiBhcnIuc29tZShpdGVtID0+IGl0ZW0uY2hpbGRyZW4pO1xuICAgIH1cblxuICAgIGVtaXRNYXhBdHRlbXB0RXZlbnRzKCkge1xuICAgICAgICBpZiAoKHRoaXMucGxheWVyQ29uZmlnLm1ldGFkYXRhPy5tYXhBdHRlbXB0IC0gMSkgPT09IHRoaXMucGxheWVyQ29uZmlnLm1ldGFkYXRhPy5jdXJyZW50QXR0ZW1wdCkge1xuICAgICAgICAgICAgdGhpcy5wbGF5ZXJFdmVudC5lbWl0KHRoaXMudmlld2VyU2VydmljZS5nZW5lcmF0ZU1heEF0dGVtcHRFdmVudHModGhpcy5hdHRlbXB0cz8uY3VycmVudCwgZmFsc2UsIHRydWUpKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnBsYXllckNvbmZpZy5tZXRhZGF0YT8uY3VycmVudEF0dGVtcHQgPj0gdGhpcy5wbGF5ZXJDb25maWcubWV0YWRhdGE/Lm1heEF0dGVtcHQpIHtcbiAgICAgICAgICAgIHRoaXMucGxheWVyRXZlbnQuZW1pdCh0aGlzLnZpZXdlclNlcnZpY2UuZ2VuZXJhdGVNYXhBdHRlbXB0RXZlbnRzKHRoaXMuYXR0ZW1wdHM/LmN1cnJlbnQsIHRydWUsIGZhbHNlKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRBY3RpdmVTZWN0aW9uSW5kZXgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNlY3Rpb25zLmZpbmRJbmRleChzZWMgPT4gc2VjLm1ldGFkYXRhPy5pZGVudGlmaWVyID09PSB0aGlzLmFjdGl2ZVNlY3Rpb24ubWV0YWRhdGE/LmlkZW50aWZpZXIpO1xuICAgIH1cblxuICAgIG9uU2hvd1Njb3JlQm9hcmQoZXZlbnQpIHtcbiAgICAgICAgaWYgKHRoaXMucGFyZW50Q29uZmlnLmlzU2VjdGlvbnNBdmFpbGFibGUpIHtcbiAgICAgICAgICAgIGNvbnN0IGFjdGl2ZVNlY3Rpb25JbmRleCA9IHRoaXMuZ2V0QWN0aXZlU2VjdGlvbkluZGV4KCk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVNlY3Rpb25TY29yZShhY3RpdmVTZWN0aW9uSW5kZXgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubG9hZFNjb3JlQm9hcmQgPSB0cnVlO1xuICAgIH1cblxuICAgIG9uU2VjdGlvbkVuZChldmVudCkge1xuICAgICAgICBpZiAodGhpcy5wYXJlbnRDb25maWcuaXNTZWN0aW9uc0F2YWlsYWJsZSkge1xuICAgICAgICAgICAgdGhpcy5pc0ZpcnN0U2VjdGlvbiA9IGZhbHNlO1xuICAgICAgICAgICAgY29uc3QgYWN0aXZlU2VjdGlvbkluZGV4ID0gdGhpcy5nZXRBY3RpdmVTZWN0aW9uSW5kZXgoKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlU2VjdGlvblNjb3JlKGFjdGl2ZVNlY3Rpb25JbmRleCk7XG4gICAgICAgICAgICB0aGlzLnNldE5leHRTZWN0aW9uKGV2ZW50LCBhY3RpdmVTZWN0aW9uSW5kZXgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wcmVwYXJlRW5kKGV2ZW50KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uUGxheWVyRXZlbnQoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5wbGF5ZXJFdmVudC5lbWl0KGV2ZW50KTtcbiAgICB9XG5cbiAgICBnZXRTdW1tYXJ5T2JqZWN0KCkge1xuICAgICAgICBjb25zdCBwcm9ncmVzc0JhciA9IHRoaXMuaXNTZWN0aW9uc0F2YWlsYWJsZSA/IF8uZmxhdHRlbkRlZXAodGhpcy5tYWluUHJvZ3Jlc3NCYXIubWFwKGl0ZW0gPT4gaXRlbS5jaGlsZHJlbikpIDogdGhpcy5tYWluUHJvZ3Jlc3NCYXI7XG4gICAgICAgIGNvbnN0IGNsYXNzT2JqID0gXy5ncm91cEJ5KHByb2dyZXNzQmFyLCAnY2xhc3MnKTtcbiAgICAgICAgdGhpcy5zdW1tYXJ5ID0ge1xuICAgICAgICAgICAgc2tpcHBlZDogXy5nZXQoY2xhc3NPYmosICdza2lwcGVkLmxlbmd0aCcpIHx8IDAsXG4gICAgICAgICAgICBjb3JyZWN0OiBfLmdldChjbGFzc09iaiwgJ2NvcnJlY3QubGVuZ3RoJykgfHwgMCxcbiAgICAgICAgICAgIHdyb25nOiBfLmdldChjbGFzc09iaiwgJ3dyb25nLmxlbmd0aCcpIHx8IDAsXG4gICAgICAgICAgICBwYXJ0aWFsOiBfLmdldChjbGFzc09iaiwgJ3BhcnRpYWwubGVuZ3RoJykgfHwgMFxuICAgICAgICB9O1xuICAgICAgICB0aGlzLnRvdGFsVmlzaXRlZFF1ZXN0aW9uID0gdGhpcy5zdW1tYXJ5LmNvcnJlY3QgKyB0aGlzLnN1bW1hcnkud3JvbmcgKyB0aGlzLnN1bW1hcnkucGFydGlhbCArIHRoaXMuc3VtbWFyeS5za2lwcGVkO1xuICAgICAgICB0aGlzLnZpZXdlclNlcnZpY2UudG90YWxOdW1iZXJPZlF1ZXN0aW9ucyA9IHRoaXMudG90YWxOb09mUXVlc3Rpb25zO1xuICAgIH1cblxuICAgIHVwZGF0ZVNlY3Rpb25TY29yZShhY3RpdmVTZWN0aW9uSW5kZXg6IG51bWJlcikge1xuICAgICAgICB0aGlzLm1haW5Qcm9ncmVzc0JhclthY3RpdmVTZWN0aW9uSW5kZXhdLnNjb3JlID0gdGhpcy5tYWluUHJvZ3Jlc3NCYXJbYWN0aXZlU2VjdGlvbkluZGV4XS5jaGlsZHJlblxuICAgICAgICAgICAgLnJlZHVjZSgoYWNjdW11bGF0b3IsIGN1cnJlbnRWYWx1ZSkgPT4gYWNjdW11bGF0b3IgKyBjdXJyZW50VmFsdWUuc2NvcmUsIDApO1xuICAgIH1cblxuICAgIHNldE5leHRTZWN0aW9uKGV2ZW50LCBhY3RpdmVTZWN0aW9uSW5kZXg6IG51bWJlcikge1xuICAgICAgICB0aGlzLnN1bW1hcnkgPSB0aGlzLnV0aWxTZXJ2aWNlLnN1bU9iamVjdHNCeUtleSh0aGlzLnN1bW1hcnksIGV2ZW50LnN1bW1hcnkpO1xuICAgICAgICBjb25zdCBpc1NlY3Rpb25GdWxseUF0dGVtcHRlZCA9IGV2ZW50LnN1bW1hcnkuc2tpcHBlZCA9PT0gMCAmJlxuICAgICAgICAgICAgKGV2ZW50LnN1bW1hcnk/LmNvcnJlY3QgKyBldmVudC5zdW1tYXJ5Py53cm9uZykgPT09IHRoaXMubWFpblByb2dyZXNzQmFyW2FjdGl2ZVNlY3Rpb25JbmRleF0/LmNoaWxkcmVuPy5sZW5ndGg7XG4gICAgICAgIGNvbnN0IGlzU2VjdGlvblBhcnRpYWxseUF0dGVtcHRlZCA9IGV2ZW50LnN1bW1hcnkuc2tpcHBlZCA+IDA7XG5cbiAgICAgICAgaWYgKGV2ZW50LmlzRHVyYXRpb25FbmRlZCkge1xuICAgICAgICAgICAgdGhpcy5pc0R1cmF0aW9uRXhwaXJlZCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLnByZXBhcmVFbmQoZXZlbnQpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IG5leHRTZWN0aW9uSW5kZXggPSBhY3RpdmVTZWN0aW9uSW5kZXggKyAxO1xuICAgICAgICBpZiAoZXZlbnQuanVtcFRvU2VjdGlvbikge1xuICAgICAgICAgICAgY29uc3Qgc2VjdGlvbkluZGV4ID0gdGhpcy5zZWN0aW9ucy5maW5kSW5kZXgoc2VjID0+IHNlYy5tZXRhZGF0YT8uaWRlbnRpZmllciA9PT0gZXZlbnQuanVtcFRvU2VjdGlvbik7XG4gICAgICAgICAgICBuZXh0U2VjdGlvbkluZGV4ID0gc2VjdGlvbkluZGV4ID4gLTEgPyBzZWN0aW9uSW5kZXggOiBuZXh0U2VjdGlvbkluZGV4O1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZWN0aW9uSW5kZXggPSBfLmNsb25lRGVlcChuZXh0U2VjdGlvbkluZGV4KTtcbiAgICAgICAgdGhpcy5tYWluUHJvZ3Jlc3NCYXIuZm9yRWFjaCgoaXRlbSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgIGl0ZW0uaXNBY3RpdmUgPSBpbmRleCA9PT0gbmV4dFNlY3Rpb25JbmRleDtcblxuICAgICAgICAgICAgaWYgKGluZGV4ID09PSBhY3RpdmVTZWN0aW9uSW5kZXgpIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNTZWN0aW9uRnVsbHlBdHRlbXB0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5jbGFzcyA9ICdhdHRlbXB0ZWQnO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaXNTZWN0aW9uUGFydGlhbGx5QXR0ZW1wdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uY2xhc3MgPSAncGFydGlhbCc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKG5leHRTZWN0aW9uSW5kZXggPCB0aGlzLnNlY3Rpb25zLmxlbmd0aCkge1xuICAgICAgICAgICAgdGhpcy5hY3RpdmVTZWN0aW9uID0gXy5jbG9uZURlZXAodGhpcy5zZWN0aW9uc1tuZXh0U2VjdGlvbkluZGV4XSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnByZXBhcmVFbmQoZXZlbnQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJlcGFyZUVuZChldmVudCkge1xuICAgICAgICB0aGlzLmNhbGN1bGF0ZVNjb3JlKCk7XG4gICAgICAgIHRoaXMuc2V0RHVyYXRpb25TcGVudCgpO1xuICAgICAgICBpZiAodGhpcy5wYXJlbnRDb25maWcucmVxdWlyZXNTdWJtaXQpIHtcbiAgICAgICAgICAgIHRoaXMubG9hZFNjb3JlQm9hcmQgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5lbmRQYWdlUmVhY2hlZCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmdldFN1bW1hcnlPYmplY3QoKTtcbiAgICAgICAgICAgIHRoaXMudmlld2VyU2VydmljZS5yYWlzZVN1bW1hcnlFdmVudCh0aGlzLnRvdGFsVmlzaXRlZFF1ZXN0aW9uLCB0aGlzLmVuZFBhZ2VSZWFjaGVkLCB0aGlzLmZpbmFsU2NvcmUsIHRoaXMuc3VtbWFyeSk7XG4gICAgICAgICAgICB0aGlzLnJhaXNlRW5kRXZlbnQodGhpcy50b3RhbFZpc2l0ZWRRdWVzdGlvbiwgdGhpcy5lbmRQYWdlUmVhY2hlZCwgdGhpcy5maW5hbFNjb3JlKTtcbiAgICAgICAgICAgIHRoaXMuaXNTdW1tYXJ5RXZlbnRSYWlzZWQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5pc0VuZEV2ZW50UmFpc2VkID0gdHJ1ZTtcblxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVwbGF5Q29udGVudCgpIHtcbiAgICAgICAgdGhpcy5wYXJlbnRDb25maWcuaXNSZXBsYXllZCA9IHRydWU7XG4gICAgICAgIHRoaXMubG9hZFNjb3JlQm9hcmQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5lbmRQYWdlUmVhY2hlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmlzRHVyYXRpb25FeHBpcmVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuaXNFbmRFdmVudFJhaXNlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmF0dGVtcHRzLmN1cnJlbnQgPSB0aGlzLmF0dGVtcHRzLmN1cnJlbnQgKyAxO1xuICAgICAgICB0aGlzLnNob3dSZXBsYXkgPSB0aGlzLmF0dGVtcHRzPy5tYXggJiYgdGhpcy5hdHRlbXB0cz8uY3VycmVudCA+PSB0aGlzLmF0dGVtcHRzLm1heCA/IGZhbHNlIDogdHJ1ZTtcbiAgICAgICAgdGhpcy50b3RhbE5vT2ZRdWVzdGlvbnMgPSAwO1xuICAgICAgICB0aGlzLnRvdGFsVmlzaXRlZFF1ZXN0aW9uID0gMDtcbiAgICAgICAgdGhpcy5tYWluUHJvZ3Jlc3NCYXIgPSBbXTtcbiAgICAgICAgdGhpcy5qdW1wVG9RdWVzdGlvbiA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5zdW1tYXJ5ID0ge1xuICAgICAgICAgICAgY29ycmVjdDogMCxcbiAgICAgICAgICAgIHBhcnRpYWw6IDAsXG4gICAgICAgICAgICBza2lwcGVkOiAwLFxuICAgICAgICAgICAgd3Jvbmc6IDBcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5zZWN0aW9ucyA9IFtdO1xuICAgICAgICB0aGlzLmluaXRpYWxUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZVNlY3Rpb25zKCk7XG4gICAgICAgIHRoaXMuZW5kUGFnZVJlYWNoZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5sb2FkU2NvcmVCb2FyZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmFjdGl2ZVNlY3Rpb24gPSB0aGlzLmlzU2VjdGlvbnNBdmFpbGFibGUgPyBfLmNsb25lRGVlcCh0aGlzLnNlY3Rpb25zWzBdKSA6IHRoaXMucGxheWVyQ29uZmlnO1xuICAgICAgICBpZiAodGhpcy5hdHRlbXB0cz8ubWF4ID09PSB0aGlzLmF0dGVtcHRzPy5jdXJyZW50KSB7XG4gICAgICAgICAgICB0aGlzLnBsYXllckV2ZW50LmVtaXQodGhpcy52aWV3ZXJTZXJ2aWNlLmdlbmVyYXRlTWF4QXR0ZW1wdEV2ZW50cyhfLmdldCh0aGlzLmF0dGVtcHRzLCAnY3VycmVudCcpLCBmYWxzZSwgdHJ1ZSkpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudmlld2VyU2VydmljZS5yYWlzZUhlYXJ0QmVhdEV2ZW50KGV2ZW50TmFtZS5yZXBsYXlDbGlja2VkLCBUZWxlbWV0cnlUeXBlLmludGVyYWN0LCAxKTtcblxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMucGFyZW50Q29uZmlnLmlzUmVwbGF5ZWQgPSBmYWxzZTtcbiAgICAgICAgfSwgMjAwKTtcbiAgICB9XG5cbiAgICBzZXRJbml0aWFsU2NvcmVzKGFjdGl2ZVNlY3Rpb25JbmRleCA9IDApIHtcbiAgICAgICAgY29uc3QgYWxwaGFiZXRzID0gJ2FiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6Jy5zcGxpdCgnJyk7XG4gICAgICAgIHRoaXMuc2VjdGlvbnMuZm9yRWFjaCgoc2VjdGlvbiwgaSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5tYWluUHJvZ3Jlc3NCYXIucHVzaCh7XG4gICAgICAgICAgICAgICAgaW5kZXg6IGFscGhhYmV0c1tpXS50b0xvY2FsZVVwcGVyQ2FzZSgpLCBjbGFzczogJ3VuYXR0ZW1wdGVkJywgdmFsdWU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBzY29yZTogMCxcbiAgICAgICAgICAgICAgICBpc0FjdGl2ZTogaSA9PT0gYWN0aXZlU2VjdGlvbkluZGV4LFxuICAgICAgICAgICAgICAgIGlkZW50aWZpZXI6IHNlY3Rpb24ubWV0YWRhdGE/LmlkZW50aWZpZXJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uc3QgY2hpbGRyZW4gPSBbXTtcbiAgICAgICAgICAgIHNlY3Rpb24ubWV0YWRhdGEuY2hpbGROb2Rlcy5mb3JFYWNoKChjaGlsZCwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICBjaGlsZHJlbi5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgaWRlbnRpZmllcjogY2hpbGQsXG4gICAgICAgICAgICAgICAgICAgIGluZGV4OiAoaW5kZXggKyAxKSwgY2xhc3M6ICd1bmF0dGVtcHRlZCcsIHZhbHVlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbjogdW5kZWZpbmVkLCBjYXJkaW5hbGl0eTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICBzY29yZTogMFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHRoaXMudG90YWxOb09mUXVlc3Rpb25zKys7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMubWFpblByb2dyZXNzQmFyW3RoaXMubWFpblByb2dyZXNzQmFyLmxlbmd0aCAtIDFdID0ge1xuICAgICAgICAgICAgICAgIC4uLl8ubGFzdCh0aGlzLm1haW5Qcm9ncmVzc0JhciksIGNoaWxkcmVuXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpZiAodGhpcy5wbGF5ZXJDb25maWcuY29uZmlnPy5xdWVzdGlvbnM/Lmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHF1ZXN0aW9uc09iaiA9IHRoaXMucGxheWVyQ29uZmlnLmNvbmZpZy5xdWVzdGlvbnMuZmluZChpdGVtID0+IGl0ZW0uaWQgPT09IHNlY3Rpb24ubWV0YWRhdGE/LmlkZW50aWZpZXIpO1xuICAgICAgICAgICAgICAgIGlmIChxdWVzdGlvbnNPYmo/LnF1ZXN0aW9ucykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnZpZXdlclNlcnZpY2UudXBkYXRlU2VjdGlvblF1ZXN0aW9ucyhzZWN0aW9uLm1ldGFkYXRhLmlkZW50aWZpZXIsIHF1ZXN0aW9uc09iai5xdWVzdGlvbnMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGlmICh0aGlzLnBsYXllckNvbmZpZy5jb25maWc/LnByb2dyZXNzQmFyPy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRoaXMubWFpblByb2dyZXNzQmFyID0gXy5jbG9uZURlZXAodGhpcy5wbGF5ZXJDb25maWcuY29uZmlnLnByb2dyZXNzQmFyKTtcbiAgICAgICAgICAgIHRoaXMubWFpblByb2dyZXNzQmFyWzBdLmlzQWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnBhcmVudENvbmZpZy5xdWVzdGlvbkNvdW50ID0gdGhpcy50b3RhbE5vT2ZRdWVzdGlvbnM7XG4gICAgfVxuXG4gICAgY2FsY3VsYXRlU2NvcmUoKSB7XG4gICAgICAgIHRoaXMuZmluYWxTY29yZSA9IHRoaXMubWFpblByb2dyZXNzQmFyLnJlZHVjZSgoYWNjdW11bGF0b3IsIGN1cnJlbnRWYWx1ZSkgPT4gYWNjdW11bGF0b3IgKyBjdXJyZW50VmFsdWUuc2NvcmUsIDApO1xuICAgICAgICB0aGlzLmdlbmVyYXRlT3V0Q29tZUxhYmVsKCk7XG4gICAgICAgIHJldHVybiB0aGlzLmZpbmFsU2NvcmU7XG4gICAgfVxuXG4gICAgZXhpdENvbnRlbnQoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5jYWxjdWxhdGVTY29yZSgpO1xuICAgICAgICBpZiAoZXZlbnQ/LnR5cGUgPT09ICdFWElUJykge1xuICAgICAgICAgICAgdGhpcy52aWV3ZXJTZXJ2aWNlLnJhaXNlSGVhcnRCZWF0RXZlbnQoZXZlbnROYW1lLmVuZFBhZ2VFeGl0Q2xpY2tlZCwgVGVsZW1ldHJ5VHlwZS5pbnRlcmFjdCwgJ2VuZFBhZ2UnKTtcbiAgICAgICAgICAgIHRoaXMuZ2V0U3VtbWFyeU9iamVjdCgpO1xuICAgICAgICAgICAgdGhpcy52aWV3ZXJTZXJ2aWNlLnJhaXNlU3VtbWFyeUV2ZW50KHRoaXMudG90YWxWaXNpdGVkUXVlc3Rpb24sIHRoaXMuZW5kUGFnZVJlYWNoZWQsIHRoaXMuZmluYWxTY29yZSwgdGhpcy5zdW1tYXJ5KTtcbiAgICAgICAgICAgIHRoaXMuaXNTdW1tYXJ5RXZlbnRSYWlzZWQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5yYWlzZUVuZEV2ZW50KHRoaXMudG90YWxWaXNpdGVkUXVlc3Rpb24sIHRoaXMuZW5kUGFnZVJlYWNoZWQsIHRoaXMuZmluYWxTY29yZSk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIHJhaXNlRW5kRXZlbnQoY3VycmVudFF1ZXN0aW9uSW5kZXgsIGVuZFBhZ2VTZWVuLCBzY29yZSkge1xuICAgICAgICBpZiAodGhpcy5pc0VuZEV2ZW50UmFpc2VkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pc0VuZEV2ZW50UmFpc2VkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy52aWV3ZXJTZXJ2aWNlLm1ldGFEYXRhLnByb2dyZXNzQmFyID0gdGhpcy5tYWluUHJvZ3Jlc3NCYXI7XG4gICAgICAgIHRoaXMudmlld2VyU2VydmljZS5yYWlzZUVuZEV2ZW50KGN1cnJlbnRRdWVzdGlvbkluZGV4LCBlbmRQYWdlU2Vlbiwgc2NvcmUpO1xuXG4gICAgICAgIGlmIChfLmdldCh0aGlzLmF0dGVtcHRzLCAnY3VycmVudCcpID49IF8uZ2V0KHRoaXMuYXR0ZW1wdHMsICdtYXgnKSkge1xuICAgICAgICAgICAgdGhpcy5wbGF5ZXJFdmVudC5lbWl0KHRoaXMudmlld2VyU2VydmljZS5nZW5lcmF0ZU1heEF0dGVtcHRFdmVudHMoXy5nZXQodGhpcy5hdHRlbXB0cywgJ2N1cnJlbnQnKSwgdHJ1ZSwgZmFsc2UpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldER1cmF0aW9uU3BlbnQoKSB7XG4gICAgICAgIGlmICh0aGlzLnBsYXllckNvbmZpZy5tZXRhZGF0YT8uc3VtbWFyeVR5cGUgIT09ICdTY29yZScpIHtcbiAgICAgICAgICAgIHRoaXMudmlld2VyU2VydmljZS5tZXRhRGF0YS5kdXJhdGlvbiA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gdGhpcy5pbml0aWFsVGltZTtcbiAgICAgICAgICAgIHRoaXMuZHVyYXRpb25TcGVudCA9IHRoaXMudXRpbFNlcnZpY2UuZ2V0VGltZVNwZW50VGV4dCh0aGlzLmluaXRpYWxUaW1lKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uU2NvcmVCb2FyZExvYWRlZChldmVudCkge1xuICAgICAgICBpZiAoZXZlbnQ/LnNjb3JlQm9hcmRMb2FkZWQpIHtcbiAgICAgICAgICAgIHRoaXMuY2FsY3VsYXRlU2NvcmUoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uU2NvcmVCb2FyZFN1Ym1pdHRlZChldmVudCkge1xuICAgICAgICBzd2l0Y2ggKGV2ZW50LnR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgJ2JhY2stY2xpY2tlZCc6XG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkU2NvcmVCb2FyZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICB0aGlzLmVuZFBhZ2VSZWFjaGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLmdldFN1bW1hcnlPYmplY3QoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNldER1cmF0aW9uU3BlbnQoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnZpZXdlclNlcnZpY2UucmFpc2VIZWFydEJlYXRFdmVudChldmVudE5hbWUuc2NvcmVCb2FyZFN1Ym1pdENsaWNrZWQsIFRlbGVtZXRyeVR5cGUuaW50ZXJhY3QsIHBhZ2VJZC5zdWJtaXRQYWdlKTtcbiAgICAgICAgICAgICAgICB0aGlzLnZpZXdlclNlcnZpY2UucmFpc2VTdW1tYXJ5RXZlbnQodGhpcy50b3RhbFZpc2l0ZWRRdWVzdGlvbiwgdGhpcy5lbmRQYWdlUmVhY2hlZCwgdGhpcy5maW5hbFNjb3JlLCB0aGlzLnN1bW1hcnkpO1xuICAgICAgICAgICAgICAgIHRoaXMucmFpc2VFbmRFdmVudCh0aGlzLnRvdGFsVmlzaXRlZFF1ZXN0aW9uLCB0aGlzLmVuZFBhZ2VSZWFjaGVkLCB0aGlzLmZpbmFsU2NvcmUpO1xuICAgICAgICAgICAgICAgIHRoaXMubG9hZFNjb3JlQm9hcmQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLmlzU3VtbWFyeUV2ZW50UmFpc2VkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLnN1Ym1pdEV2ZW50LmVtaXQoe1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQ6IHRoaXMubWFpblByb2dyZXNzQmFyXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZW5lcmF0ZU91dENvbWVMYWJlbCgpIHtcbiAgICAgICAgdGhpcy5vdXRjb21lTGFiZWwgPSB0aGlzLmZpbmFsU2NvcmUudG9TdHJpbmcoKTtcbiAgICAgICAgc3dpdGNoIChfLmdldCh0aGlzLnBsYXllckNvbmZpZywgJ21ldGFkYXRhLnN1bW1hcnlUeXBlJykpIHtcbiAgICAgICAgICAgIGNhc2UgJ0NvbXBsZXRlJzoge1xuICAgICAgICAgICAgICAgIHRoaXMub3V0Y29tZUxhYmVsID0gdGhpcy50b3RhbFNjb3JlID8gYCR7dGhpcy5maW5hbFNjb3JlfSAvICR7dGhpcy50b3RhbFNjb3JlfWAgOiB0aGlzLm91dGNvbWVMYWJlbDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhc2UgJ0R1cmF0aW9uJzoge1xuICAgICAgICAgICAgICAgIHRoaXMub3V0Y29tZUxhYmVsID0gJyc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnb1RvUXVlc3Rpb24oZXZlbnQpIHtcbiAgICAgICAgaWYgKHRoaXMucGFyZW50Q29uZmlnLmlzU2VjdGlvbnNBdmFpbGFibGUgJiYgZXZlbnQuaWRlbnRpZmllcikge1xuICAgICAgICAgICAgY29uc3Qgc2VjdGlvbkluZGV4ID0gdGhpcy5zZWN0aW9ucy5maW5kSW5kZXgoc2VjID0+IHNlYy5tZXRhZGF0YT8uaWRlbnRpZmllciA9PT0gZXZlbnQuaWRlbnRpZmllcik7XG4gICAgICAgICAgICB0aGlzLmFjdGl2ZVNlY3Rpb24gPSBfLmNsb25lRGVlcCh0aGlzLnNlY3Rpb25zW3NlY3Rpb25JbmRleF0pO1xuICAgICAgICAgICAgdGhpcy5tYWluUHJvZ3Jlc3NCYXIuZm9yRWFjaCgoaXRlbSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICBpdGVtLmlzQWN0aXZlID0gaW5kZXggPT09IHNlY3Rpb25JbmRleDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuanVtcFRvUXVlc3Rpb24gPSBldmVudDtcbiAgICAgICAgdGhpcy5sb2FkU2NvcmVCb2FyZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIEBIb3N0TGlzdGVuZXIoJ3dpbmRvdzpiZWZvcmV1bmxvYWQnKVxuICAgIG5nT25EZXN0cm95KCkge1xuICAgICAgICB0aGlzLmNhbGN1bGF0ZVNjb3JlKCk7XG4gICAgICAgIHRoaXMuZ2V0U3VtbWFyeU9iamVjdCgpO1xuICAgICAgICBpZiAodGhpcy5pc1N1bW1hcnlFdmVudFJhaXNlZCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHRoaXMudmlld2VyU2VydmljZS5yYWlzZVN1bW1hcnlFdmVudCh0aGlzLnRvdGFsVmlzaXRlZFF1ZXN0aW9uLCB0aGlzLmVuZFBhZ2VSZWFjaGVkLCB0aGlzLmZpbmFsU2NvcmUsIHRoaXMuc3VtbWFyeSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yYWlzZUVuZEV2ZW50KHRoaXMudG90YWxWaXNpdGVkUXVlc3Rpb24sIHRoaXMuZW5kUGFnZVJlYWNoZWQsIHRoaXMuZmluYWxTY29yZSk7XG4gICAgfVxufVxuXG4vKlxuICogU2hvdWxkIFRha2UgY2FyZSBvZiB0aGUgZm9sbG93aW5nXG4gKiAgLSBoYW5kbGUgZW5kIHBhZ2VcbiAqICAtIGhhbmRsZSBzY29yZWJvYXJkXG4gKiAgLSBoYW5kbGUgbWF4IEF0dGVtcHRzXG4gKiAgLSBoYW5kbGUgdGVsZW1ldHJ5IGluaXRpYWxpemF0aW9uXG4gKiAgLSBoYW5kbGUgdGVsZW1ldHJ5IGV2ZW50cyAtIGVuZHBhZ2UgLyBzY29yZWJvYXJkIC8gbWF4YXR0ZW1wdHNcbiAqICAtIGhhbmRsZSBKdW1wIHRvIHF1ZXN0aW9uIG9yIHNlY3Rpb25cbiAqICAtIGhhbmRsZSBzdW1tYXJ5IGV2ZW50XG4gKiAgLSBoYW5kbGUgbmV4dC9wcmV2aW91cyBidXR0b24gb24gc3RhcnQgYW5kIGVuZCBvZiB0aGUgc2VjdGlvblxuICogLSAgaGFuZGxlIHJhaXNpbmcgYWxsIHRoZSBvdXRwdXRzIGJhY2sgdG8gdGhlIGNsaWVudFxuKi9cbiJdfQ==