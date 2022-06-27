/**
 * @fileoverview added by tsickle
 * Generated from: lib/section-player/section-player.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { ChangeDetectorRef, Component, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { errorCode, errorMessage, ErrorService } from '@project-sunbird/sunbird-player-sdk-v9';
import * as _ from 'lodash-es';
import { CarouselComponent } from 'ngx-bootstrap/carousel';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { QuestionCursor } from '../quml-question-cursor.service';
import { ViewerService } from '../services/viewer-service/viewer-service';
import { eventName, pageId, TelemetryType } from '../telemetry-constants';
import { UtilService } from '../util-service';
import maintain from 'ally.js/esm/maintain/_maintain';
export class SectionPlayerComponent {
    /**
     * @param {?} viewerService
     * @param {?} utilService
     * @param {?} questionCursor
     * @param {?} cdRef
     * @param {?} errorService
     */
    constructor(viewerService, utilService, questionCursor, cdRef, errorService) {
        this.viewerService = viewerService;
        this.utilService = utilService;
        this.questionCursor = questionCursor;
        this.cdRef = cdRef;
        this.errorService = errorService;
        this.isFirstSection = false;
        this.sectionIndex = 0;
        this.playerEvent = new EventEmitter();
        this.telemetryEvent = new EventEmitter();
        this.sectionEnd = new EventEmitter();
        this.score = new EventEmitter();
        this.summary = new EventEmitter();
        this.showScoreBoard = new EventEmitter();
        this.destroy$ = new Subject();
        this.loadView = false;
        this.showContentError = false;
        this.noOfTimesApiCalled = 0;
        this.currentSlideIndex = 0;
        this.showStartPage = true;
        this.sideMenuConfig = {
            enable: true,
            showShare: true,
            showDownload: true,
            showReplay: false,
            showExit: true,
        };
        this.questions = [];
        this.progressBarClass = [];
        this.tryAgainClicked = false;
        this.carouselConfig = {
            NEXT: 1,
            PREV: 2
        };
        this.active = false;
        this.showQuestions = false;
        this.showZoomModal = false;
        this.imageZoomCount = 100;
        this.replayed = false;
        this.showRootInstruction = true;
        this.slideDuration = 0;
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        this.subscribeToEvents();
        this.setConfig();
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        this.viewerService.raiseStartEvent(0);
        this.viewerService.raiseHeartBeatEvent(eventName.startPageLoaded, 'impression', 0);
    }
    /**
     * @private
     * @return {?}
     */
    subscribeToEvents() {
        this.viewerService.qumlPlayerEvent.asObservable()
            .pipe(takeUntil(this.destroy$))
            .subscribe((/**
         * @param {?} res
         * @return {?}
         */
        (res) => {
            this.playerEvent.emit(res);
        }));
        this.viewerService.qumlQuestionEvent
            .pipe(takeUntil(this.destroy$))
            .subscribe((/**
         * @param {?} res
         * @return {?}
         */
        (res) => {
            var _a, _b, _c, _d;
            if ((_a = res) === null || _a === void 0 ? void 0 : _a.error) {
                const { traceId } = (_b = this.sectionConfig) === null || _b === void 0 ? void 0 : _b.config;
                if (navigator.onLine && this.viewerService.isAvailableLocally) {
                    this.viewerService.raiseExceptionLog(errorCode.contentLoadFails, errorMessage.contentLoadFails, new Error(errorMessage.contentLoadFails), traceId);
                }
                else {
                    this.viewerService.raiseExceptionLog(errorCode.internetConnectivity, errorMessage.internetConnectivity, new Error(errorMessage.internetConnectivity), traceId);
                }
                this.showContentError = true;
                return;
            }
            if (!((_c = res) === null || _c === void 0 ? void 0 : _c.questions)) {
                return;
            }
            /** @type {?} */
            const unCommonQuestions = _.xorBy(this.questions, res.questions, 'identifier');
            this.questions = _.uniqBy(this.questions.concat(unCommonQuestions), 'identifier');
            this.sortQuestions();
            this.viewerService.updateSectionQuestions(this.sectionConfig.metadata.identifier, this.questions);
            this.cdRef.detectChanges();
            this.noOfTimesApiCalled++;
            this.loadView = true;
            if (this.currentSlideIndex > 0 && this.myCarousel) {
                this.myCarousel.selectSlide(this.currentSlideIndex);
                if (this.questions[this.currentSlideIndex - 1]) {
                    this.currentQuestionsMedia = (_d = this.questions[this.currentSlideIndex - 1]) === null || _d === void 0 ? void 0 : _d.media;
                    this.setImageZoom();
                    this.highlightQuestion();
                }
            }
            if (this.currentSlideIndex === 0) {
                if (this.showStartPage) {
                    this.active = this.sectionIndex === 0;
                }
                else {
                    setTimeout((/**
                     * @return {?}
                     */
                    () => { this.nextSlide(); }));
                }
            }
            this.removeAttribute();
        }));
    }
    /**
     * @private
     * @return {?}
     */
    setConfig() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1;
        this.noOfTimesApiCalled = 0;
        this.currentSlideIndex = 0;
        this.active = this.currentSlideIndex === 0 && this.sectionIndex === 0 && this.showStartPage;
        if (this.myCarousel) {
            this.myCarousel.selectSlide(this.currentSlideIndex);
        }
        this.sideMenuConfig = Object.assign(Object.assign({}, this.sideMenuConfig), (_b = (_a = this.sectionConfig) === null || _a === void 0 ? void 0 : _a.config) === null || _b === void 0 ? void 0 : _b.sideMenu);
        this.threshold = ((_c = this.sectionConfig.context) === null || _c === void 0 ? void 0 : _c.threshold) || 3;
        this.questionIds = _.cloneDeep(this.sectionConfig.metadata.childNodes);
        if (this.parentConfig.isReplayed) {
            this.replayed = true;
            this.initializeTimer = true;
            this.viewerService.raiseStartEvent(0);
            this.viewerService.raiseHeartBeatEvent(eventName.startPageLoaded, 'impression', 0);
            this.disableNext = false;
            this.currentSlideIndex = 1;
            this.myCarousel.selectSlide(1);
            this.currentQuestionsMedia = _.get(this.questions[0], 'media');
            this.setImageZoom();
            this.loadView = true;
            this.removeAttribute();
            setTimeout((/**
             * @return {?}
             */
            () => {
                /** @type {?} */
                const menuBtn = (/** @type {?} */ (document.querySelector('#overlay-button')));
                if (menuBtn) {
                    menuBtn.focus();
                }
            }), 100);
        }
        this.questionIdsCopy = _.cloneDeep(this.sectionConfig.metadata.childNodes);
        /** @type {?} */
        const maxQuestions = this.sectionConfig.metadata.maxQuestions;
        if (maxQuestions) {
            this.questionIds = this.questionIds.slice(0, maxQuestions);
            this.questionIdsCopy = this.questionIdsCopy.slice(0, maxQuestions);
        }
        this.noOfQuestions = this.questionIds.length;
        this.viewerService.initialize(this.sectionConfig, this.threshold, this.questionIds, this.parentConfig);
        this.checkCompatibilityLevel(this.sectionConfig.metadata.compatibilityLevel);
        this.initialTime = this.initialSlideDuration = new Date().getTime();
        this.timeLimit = ((_e = (_d = this.sectionConfig.metadata) === null || _d === void 0 ? void 0 : _d.timeLimits) === null || _e === void 0 ? void 0 : _e.maxTime) || 0;
        this.warningTime = ((_g = (_f = this.sectionConfig.metadata) === null || _f === void 0 ? void 0 : _f.timeLimits) === null || _g === void 0 ? void 0 : _g.warningTime) || 0;
        this.showTimer = ((_j = (_h = this.sectionConfig.metadata) === null || _h === void 0 ? void 0 : _h.showTimer) === null || _j === void 0 ? void 0 : _j.toLowerCase()) !== 'no';
        this.showFeedBack = ((_l = (_k = this.sectionConfig.metadata) === null || _k === void 0 ? void 0 : _k.showFeedback) === null || _l === void 0 ? void 0 : _l.toLowerCase()) !== 'no';
        this.showUserSolution = ((_o = (_m = this.sectionConfig.metadata) === null || _m === void 0 ? void 0 : _m.showSolutions) === null || _o === void 0 ? void 0 : _o.toLowerCase()) !== 'no';
        this.startPageInstruction = ((_q = (_p = this.sectionConfig.metadata) === null || _p === void 0 ? void 0 : _p.instructions) === null || _q === void 0 ? void 0 : _q.default) || this.parentConfig.instructions;
        this.linearNavigation = this.sectionConfig.metadata.navigationMode === 'non-linear' ? false : true;
        this.showHints = ((_s = (_r = this.sectionConfig.metadata) === null || _r === void 0 ? void 0 : _r.showHints) === null || _s === void 0 ? void 0 : _s.toLowerCase()) !== 'no';
        this.points = (_t = this.sectionConfig.metadata) === null || _t === void 0 ? void 0 : _t.points;
        this.allowSkip = ((_v = (_u = this.sectionConfig.metadata) === null || _u === void 0 ? void 0 : _u.allowSkip) === null || _v === void 0 ? void 0 : _v.toLowerCase()) !== 'no';
        this.showStartPage = ((_x = (_w = this.sectionConfig.metadata) === null || _w === void 0 ? void 0 : _w.showStartPage) === null || _x === void 0 ? void 0 : _x.toLowerCase()) !== 'no';
        this.totalScore = (_y = this.sectionConfig.metadata) === null || _y === void 0 ? void 0 : _y.maxScore;
        this.progressBarClass = this.parentConfig.isSectionsAvailable ? (_z = this.mainProgressBar.find((/**
         * @param {?} item
         * @return {?}
         */
        item => item.isActive))) === null || _z === void 0 ? void 0 : _z.children :
            this.mainProgressBar;
        this.questions = this.viewerService.getSectionQuestions(this.sectionConfig.metadata.identifier);
        this.sortQuestions();
        this.viewerService.updateSectionQuestions(this.sectionConfig.metadata.identifier, this.questions);
        this.resetQuestionState();
        if (this.jumpToQuestion) {
            this.goToQuestion(this.jumpToQuestion);
        }
        else if (this.threshold === 1) {
            this.viewerService.getQuestion();
        }
        else if (this.threshold > 1) {
            this.viewerService.getQuestions();
        }
        if (!((_1 = (_0 = this.sectionConfig.metadata) === null || _0 === void 0 ? void 0 : _0.children) === null || _1 === void 0 ? void 0 : _1.length)) {
            this.loadView = true;
            this.disableNext = true;
        }
    }
    /**
     * @return {?}
     */
    removeAttribute() {
        setTimeout((/**
         * @return {?}
         */
        () => {
            /** @type {?} */
            const firstSlide = (/** @type {?} */ (document.querySelector('.carousel.slide')));
            if (firstSlide) {
                firstSlide.removeAttribute("tabindex");
            }
        }), 100);
    }
    /**
     * @return {?}
     */
    sortQuestions() {
        if (this.questions.length && this.questionIds.length) {
            /** @type {?} */
            const ques = [];
            this.questionIds.forEach((/**
             * @param {?} questionId
             * @return {?}
             */
            (questionId) => {
                /** @type {?} */
                const que = this.questions.find((/**
                 * @param {?} question
                 * @return {?}
                 */
                question => question.identifier === questionId));
                if (que) {
                    ques.push(que);
                }
            }));
            this.questions = ques;
        }
    }
    /**
     * @return {?}
     */
    createSummaryObj() {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        /** @type {?} */
        const classObj = _.groupBy(this.progressBarClass, 'class');
        return {
            skipped: ((_b = (_a = classObj) === null || _a === void 0 ? void 0 : _a.skipped) === null || _b === void 0 ? void 0 : _b.length) || 0,
            correct: ((_d = (_c = classObj) === null || _c === void 0 ? void 0 : _c.correct) === null || _d === void 0 ? void 0 : _d.length) || 0,
            wrong: ((_f = (_e = classObj) === null || _e === void 0 ? void 0 : _e.wrong) === null || _f === void 0 ? void 0 : _f.length) || 0,
            partial: ((_h = (_g = classObj) === null || _g === void 0 ? void 0 : _g.partial) === null || _h === void 0 ? void 0 : _h.length) || 0
        };
    }
    /**
     * @return {?}
     */
    nextSlide() {
        this.currentQuestionsMedia = _.get(this.questions[this.currentSlideIndex], 'media');
        this.getQuestion();
        this.viewerService.raiseHeartBeatEvent(eventName.nextClicked, TelemetryType.interact, this.myCarousel.getCurrentSlideIndex() + 1);
        this.viewerService.raiseHeartBeatEvent(eventName.nextClicked, TelemetryType.impression, this.myCarousel.getCurrentSlideIndex() + 1);
        if (this.currentSlideIndex !== this.questions.length) {
            this.currentSlideIndex = this.currentSlideIndex + 1;
        }
        if (!this.initializeTimer) {
            this.initializeTimer = true;
        }
        if (this.myCarousel.getCurrentSlideIndex() === this.noOfQuestions) {
            this.emitSectionEnd();
            return;
        }
        if (this.myCarousel.isLast(this.myCarousel.getCurrentSlideIndex()) || this.noOfQuestions === this.myCarousel.getCurrentSlideIndex()) {
            this.calculateScore();
        }
        if (this.myCarousel.getCurrentSlideIndex() > 0 &&
            this.questions[this.myCarousel.getCurrentSlideIndex() - 1].qType === 'MCQ' && this.currentOptionSelected) {
            /** @type {?} */
            const option = this.currentOptionSelected && this.currentOptionSelected['option'] ? this.currentOptionSelected['option'] : undefined;
            /** @type {?} */
            const identifier = this.questions[this.myCarousel.getCurrentSlideIndex() - 1].identifier;
            /** @type {?} */
            const qType = this.questions[this.myCarousel.getCurrentSlideIndex() - 1].qType;
            this.viewerService.raiseResponseEvent(identifier, qType, option);
        }
        if (this.questions[this.myCarousel.getCurrentSlideIndex()]) {
            this.setSkippedClass(this.myCarousel.getCurrentSlideIndex());
        }
        this.myCarousel.move(this.carouselConfig.NEXT);
        this.setImageZoom();
        this.resetQuestionState();
        this.clearTimeInterval();
    }
    /**
     * @return {?}
     */
    prevSlide() {
        this.disableNext = false;
        this.currentSolutions = undefined;
        this.viewerService.raiseHeartBeatEvent(eventName.prevClicked, TelemetryType.interact, this.myCarousel.getCurrentSlideIndex() - 1);
        this.showAlert = false;
        if (this.currentSlideIndex !== this.questions.length) {
            this.currentSlideIndex = this.currentSlideIndex + 1;
        }
        if (this.myCarousel.getCurrentSlideIndex() + 1 === this.noOfQuestions && this.endPageReached) {
            this.endPageReached = false;
        }
        else {
            this.myCarousel.move(this.carouselConfig.PREV);
        }
        this.currentSlideIndex = this.myCarousel.getCurrentSlideIndex();
        this.active = this.currentSlideIndex === 0 && this.sectionIndex === 0 && this.showStartPage;
        this.currentQuestionsMedia = _.get(this.questions[this.myCarousel.getCurrentSlideIndex() - 1], 'media');
        this.setImageZoom();
        this.setSkippedClass(this.myCarousel.getCurrentSlideIndex() - 1);
    }
    /**
     * @return {?}
     */
    getQuestion() {
        if (this.myCarousel.getCurrentSlideIndex() > 0
            && ((this.threshold * this.noOfTimesApiCalled) - 1) === this.myCarousel.getCurrentSlideIndex()
            && this.threshold * this.noOfTimesApiCalled >= this.questions.length && this.threshold > 1) {
            this.viewerService.getQuestions();
        }
        if (this.myCarousel.getCurrentSlideIndex() > 0
            && this.questions[this.myCarousel.getCurrentSlideIndex()] === undefined && this.threshold > 1) {
            this.viewerService.getQuestions();
        }
        if (this.threshold === 1 && this.myCarousel.getCurrentSlideIndex() >= 0) {
            this.viewerService.getQuestion();
        }
    }
    /**
     * @return {?}
     */
    resetQuestionState() {
        this.active = false;
        this.showAlert = false;
        this.optionSelectedObj = undefined;
        this.currentOptionSelected = undefined;
        this.currentQuestion = undefined;
        this.currentOptions = undefined;
        this.currentSolutions = undefined;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    activeSlideChange(event) {
        this.initialSlideDuration = new Date().getTime();
    }
    /**
     * @param {?} event
     * @return {?}
     */
    nextSlideClicked(event) {
        var _a;
        if (this.showRootInstruction && this.parentConfig.isSectionsAvailable) {
            this.showRootInstruction = false;
            return;
        }
        if (this.myCarousel.getCurrentSlideIndex() === 0) {
            return this.nextSlide();
        }
        if (((_a = event) === null || _a === void 0 ? void 0 : _a.type) === 'next') {
            this.validateSelectedOption(this.optionSelectedObj, 'next');
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    previousSlideClicked(event) {
        if (event.event === 'previous clicked') {
            if (this.optionSelectedObj && this.showFeedBack) {
                this.stopAutoNavigation = false;
                this.validateSelectedOption(this.optionSelectedObj, 'previous');
            }
            else {
                this.stopAutoNavigation = true;
                if (this.currentSlideIndex === 0 && this.parentConfig.isSectionsAvailable && this.getCurrentSectionIndex() > 0) {
                    /** @type {?} */
                    const previousSectionId = this.mainProgressBar[this.getCurrentSectionIndex() - 1].identifier;
                    this.jumpToSection(previousSectionId);
                    return;
                }
                this.prevSlide();
            }
        }
    }
    /**
     * @return {?}
     */
    getCurrentSectionIndex() {
        /** @type {?} */
        const currentSectionId = this.sectionConfig.metadata.identifier;
        return this.mainProgressBar.findIndex((/**
         * @param {?} section
         * @return {?}
         */
        section => section.identifier === currentSectionId));
    }
    /**
     * @param {?} event
     * @param {?} index
     * @return {?}
     */
    goToSlideClicked(event, index) {
        var _a;
        if (!((_a = this.progressBarClass) === null || _a === void 0 ? void 0 : _a.length)) {
            if (index === 0) {
                this.jumpSlideIndex = 0;
                this.goToSlide(this.jumpSlideIndex);
            }
            return;
        }
        event.stopPropagation();
        this.active = false;
        this.jumpSlideIndex = index;
        if (this.optionSelectedObj && this.showFeedBack) {
            this.stopAutoNavigation = false;
            this.validateSelectedOption(this.optionSelectedObj, 'jump');
        }
        else {
            this.stopAutoNavigation = true;
            this.goToSlide(this.jumpSlideIndex);
        }
    }
    /**
     * @param {?} event
     * @param {?} index
     * @return {?}
     */
    onEnter(event, index) {
        if (event.keyCode === 13) {
            event.stopPropagation();
            this.goToSlideClicked(event, index);
        }
    }
    /**
     * @param {?} identifier
     * @return {?}
     */
    jumpToSection(identifier) {
        this.showRootInstruction = false;
        this.emitSectionEnd(false, identifier);
    }
    /**
     * @param {?} event
     * @param {?} identifier
     * @return {?}
     */
    onSectionEnter(event, identifier) {
        if (event.keyCode === 13) {
            event.stopPropagation();
            if (this.optionSelectedObj) {
                this.validateSelectedOption(this.optionSelectedObj, 'jump');
            }
            this.jumpToSection(identifier);
        }
    }
    /**
     * @return {?}
     */
    onScoreBoardClicked() {
        this.viewerService.updateSectionQuestions(this.sectionConfig.metadata.identifier, this.questions);
        this.showScoreBoard.emit();
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onScoreBoardEnter(event) {
        event.stopPropagation();
        if (event.keyCode === 13) {
            this.onScoreBoardClicked();
        }
    }
    /**
     * @return {?}
     */
    focusOnNextButton() {
        setTimeout((/**
         * @return {?}
         */
        () => {
            /** @type {?} */
            const nextBtn = (/** @type {?} */ (document.querySelector('.quml-navigation__next')));
            if (nextBtn) {
                nextBtn.focus();
            }
        }), 100);
    }
    /**
     * @param {?} optionSelected
     * @return {?}
     */
    getOptionSelected(optionSelected) {
        var _a;
        this.focusOnNextButton();
        this.active = true;
        this.currentOptionSelected = optionSelected;
        /** @type {?} */
        const currentIndex = this.myCarousel.getCurrentSlideIndex() - 1;
        this.viewerService.raiseHeartBeatEvent(eventName.optionClicked, TelemetryType.interact, this.myCarousel.getCurrentSlideIndex());
        // This optionSelected comes empty whenever the try again is clicked on feedback popup
        if (_.isEmpty((_a = optionSelected) === null || _a === void 0 ? void 0 : _a.option)) {
            this.optionSelectedObj = undefined;
            this.currentSolutions = undefined;
            this.updateScoreBoard(currentIndex, 'skipped');
        }
        else {
            this.optionSelectedObj = optionSelected;
            this.currentSolutions = !_.isEmpty(optionSelected.solutions) ? optionSelected.solutions : undefined;
        }
        this.media = this.questions[this.myCarousel.getCurrentSlideIndex() - 1].media;
        if (this.currentSolutions) {
            this.currentSolutions.forEach((/**
             * @param {?} ele
             * @param {?} index
             * @return {?}
             */
            (ele, index) => {
                if (ele.type === 'video') {
                    this.media.forEach((/**
                     * @param {?} e
                     * @return {?}
                     */
                    (e) => {
                        if (e.id === this.currentSolutions[index].value) {
                            this.currentSolutions[index].type = 'video';
                            this.currentSolutions[index].src = e.src;
                            this.currentSolutions[index].thumbnail = e.thumbnail;
                        }
                    }));
                }
            }));
        }
        if (!this.showFeedBack) {
            this.validateSelectedOption(this.optionSelectedObj);
        }
    }
    /**
     * @return {?}
     */
    durationEnds() {
        this.showSolution = false;
        this.showAlert = false;
        this.emitSectionEnd(true);
    }
    /**
     * @private
     * @param {?} compatibilityLevel
     * @return {?}
     */
    checkCompatibilityLevel(compatibilityLevel) {
        var _a, _b;
        if (compatibilityLevel) {
            /** @type {?} */
            const checkContentCompatible = this.errorService.checkContentCompatibility(compatibilityLevel);
            if (!checkContentCompatible.isCompitable) {
                this.viewerService.raiseExceptionLog(errorCode.contentCompatibility, errorMessage.contentCompatibility, checkContentCompatible.error, (_b = (_a = this.sectionConfig) === null || _a === void 0 ? void 0 : _a.config) === null || _b === void 0 ? void 0 : _b.traceId);
            }
        }
    }
    /**
     * @param {?=} isDurationEnded
     * @param {?=} jumpToSection
     * @return {?}
     */
    emitSectionEnd(isDurationEnded = false, jumpToSection) {
        /** @type {?} */
        const eventObj = {
            summary: this.createSummaryObj(),
            score: this.calculateScore(),
            durationSpent: this.utilService.getTimeSpentText(this.initialTime),
            slideIndex: this.myCarousel.getCurrentSlideIndex(),
            isDurationEnded,
        };
        if (jumpToSection) {
            eventObj.jumpToSection = jumpToSection;
        }
        this.viewerService.updateSectionQuestions(this.sectionConfig.metadata.identifier, this.questions);
        this.sectionEnd.emit(eventObj);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    closeAlertBox(event) {
        var _a, _b;
        if (((_a = event) === null || _a === void 0 ? void 0 : _a.type) === 'close') {
            this.viewerService.raiseHeartBeatEvent(eventName.closedFeedBack, TelemetryType.interact, this.myCarousel.getCurrentSlideIndex());
        }
        else if (((_b = event) === null || _b === void 0 ? void 0 : _b.type) === 'tryAgain') {
            this.tryAgainClicked = true;
            setTimeout((/**
             * @return {?}
             */
            () => {
                this.tryAgainClicked = false;
            }), 2000);
            this.viewerService.raiseHeartBeatEvent(eventName.tryAgain, TelemetryType.interact, this.myCarousel.getCurrentSlideIndex());
        }
        this.showAlert = false;
    }
    /**
     * @param {?} index
     * @return {?}
     */
    setSkippedClass(index) {
        if (this.progressBarClass && _.get(this.progressBarClass[index], 'class') === 'unattempted') {
            this.progressBarClass[index].class = 'skipped';
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    sideBarEvents(event) {
        if (event.type === 'OPEN_MENU' || event.type === 'CLOSE_MENU') {
            this.handleSideBarAccessibility(event);
        }
        this.viewerService.raiseHeartBeatEvent(event.type, TelemetryType.interact, this.myCarousel.getCurrentSlideIndex() + 1);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    handleSideBarAccessibility(event) {
        var _a, _b;
        /** @type {?} */
        const navBlock = (/** @type {?} */ (document.querySelector('.navBlock')));
        /** @type {?} */
        const overlayInput = (/** @type {?} */ (document.querySelector('#overlay-input')));
        /** @type {?} */
        const overlayButton = (/** @type {?} */ (document.querySelector('#overlay-button')));
        /** @type {?} */
        const sideBarList = (/** @type {?} */ (document.querySelector('#sidebar-list')));
        if (event.type === 'OPEN_MENU') {
            /** @type {?} */
            const isMobile = (_b = (_a = this.sectionConfig.config) === null || _a === void 0 ? void 0 : _a.sideMenu) === null || _b === void 0 ? void 0 : _b.showExit;
            this.disabledHandle = isMobile ? maintain.hidden({ filter: [sideBarList, overlayButton, overlayInput] }) : maintain.tabFocus({ context: navBlock });
            this.subscription = fromEvent(document, 'keydown').subscribe((/**
             * @param {?} e
             * @return {?}
             */
            (e) => {
                if (e['key'] === 'Escape') {
                    /** @type {?} */
                    const inputChecked = (/** @type {?} */ (document.getElementById('overlay-input')));
                    inputChecked.checked = false;
                    document.getElementById('playerSideMenu').style.visibility = 'hidden';
                    document.querySelector('.navBlock').style.marginLeft = '-100%';
                    this.viewerService.raiseHeartBeatEvent('CLOSE_MENU', TelemetryType.interact, this.myCarousel.getCurrentSlideIndex() + 1);
                    this.disabledHandle.disengage();
                    this.subscription.unsubscribe();
                    this.disabledHandle = null;
                    this.subscription = null;
                }
            }));
        }
        else if (event.type === 'CLOSE_MENU' && this.disabledHandle) {
            this.disabledHandle.disengage();
            this.disabledHandle = null;
            if (this.subscription) {
                this.subscription.unsubscribe();
                this.subscription = null;
            }
        }
    }
    /**
     * @param {?} option
     * @param {?=} type
     * @return {?}
     */
    validateSelectedOption(option, type) {
        var _a, _b, _c;
        /** @type {?} */
        const selectedOptionValue = (_b = (_a = option) === null || _a === void 0 ? void 0 : _a.option) === null || _b === void 0 ? void 0 : _b.value;
        /** @type {?} */
        const currentIndex = this.myCarousel.getCurrentSlideIndex() - 1;
        /** @type {?} */
        const isQuestionSkipAllowed = !this.optionSelectedObj &&
            this.allowSkip && this.utilService.getQuestionType(this.questions, currentIndex) === 'MCQ';
        /** @type {?} */
        const isSubjectiveQuestion = this.utilService.getQuestionType(this.questions, currentIndex) === 'SA';
        /** @type {?} */
        const onStartPage = this.startPageInstruction && this.myCarousel.getCurrentSlideIndex() === 0;
        /** @type {?} */
        const isActive = !this.optionSelectedObj && this.active;
        /** @type {?} */
        const selectedQuestion = this.questions[currentIndex];
        if (this.optionSelectedObj) {
            /** @type {?} */
            const key = this.utilService.getKeyValue(Object.keys(selectedQuestion.responseDeclaration));
            this.currentQuestion = selectedQuestion.body;
            this.currentOptions = selectedQuestion.interactions[key].options;
            /** @type {?} */
            const getParams = (/**
             * @return {?}
             */
            () => {
                var _a, _b, _c, _d;
                if (selectedQuestion.qType.toUpperCase() === 'MCQ' && ((_b = (_a = selectedQuestion) === null || _a === void 0 ? void 0 : _a.editorState) === null || _b === void 0 ? void 0 : _b.options)) {
                    return selectedQuestion.editorState.options;
                }
                else if (selectedQuestion.qType.toUpperCase() === 'MCQ' && !_.isEmpty((_c = selectedQuestion) === null || _c === void 0 ? void 0 : _c.editorState)) {
                    return [(_d = selectedQuestion) === null || _d === void 0 ? void 0 : _d.editorState];
                }
                else {
                    return [];
                }
            });
            if (option.cardinality === 'single') {
                /** @type {?} */
                const correctOptionValue = Number(selectedQuestion.responseDeclaration[key].correctResponse.value);
                this.slideDuration = Math.round((new Date().getTime() - this.initialSlideDuration) / 1000);
                /** @type {?} */
                const edataItem = {
                    'id': selectedQuestion.identifier,
                    'title': selectedQuestion.name,
                    'desc': selectedQuestion.description,
                    'type': selectedQuestion.qType.toLowerCase(),
                    'maxscore': selectedQuestion.responseDeclaration[key].maxScore || 0,
                    'params': getParams()
                };
                if (edataItem && this.parentConfig.isSectionsAvailable) {
                    edataItem.sectionId = this.sectionConfig.metadata.identifier;
                }
                this.showAlert = true;
                if (((_c = option.option) === null || _c === void 0 ? void 0 : _c.value) === correctOptionValue) {
                    /** @type {?} */
                    const currentScore = this.getScore(currentIndex, key, true);
                    this.viewerService.raiseAssesEvent(edataItem, currentIndex + 1, 'Yes', currentScore, [option.option], this.slideDuration);
                    this.alertType = 'correct';
                    if (this.showFeedBack)
                        this.correctFeedBackTimeOut(type);
                    this.updateScoreBoard(currentIndex, 'correct', undefined, currentScore);
                }
                else {
                    /** @type {?} */
                    const currentScore = this.getScore(currentIndex, key, false, option);
                    this.alertType = 'wrong';
                    /** @type {?} */
                    const classType = this.progressBarClass[currentIndex].class === 'partial' ? 'partial' : 'wrong';
                    this.updateScoreBoard(currentIndex, classType, selectedOptionValue, currentScore);
                }
            }
            if (option.cardinality === 'multiple') {
                /** @type {?} */
                const responseDeclaration = this.questions[currentIndex].responseDeclaration;
                /** @type {?} */
                const currentScore = this.utilService.getMultiselectScore(option.option, responseDeclaration);
                this.showAlert = true;
                if (currentScore === 0) {
                    this.alertType = 'wrong';
                    this.updateScoreBoard((currentIndex + 1), 'wrong');
                }
                else {
                    this.updateScoreBoard(((currentIndex + 1)), 'correct', undefined, currentScore);
                    if (this.showFeedBack)
                        this.correctFeedBackTimeOut(type);
                    this.alertType = 'correct';
                }
            }
            this.progressBarClass[currentIndex].cardinality = _.get(this.optionSelectedObj, 'cardinality');
            this.progressBarClass[currentIndex].option = _.get(this.optionSelectedObj, 'option');
            this.optionSelectedObj = undefined;
        }
        else if ((isQuestionSkipAllowed) || isSubjectiveQuestion || onStartPage || isActive) {
            this.nextSlide();
        }
        else if (this.startPageInstruction && !this.optionSelectedObj && !this.active && !this.allowSkip &&
            this.myCarousel.getCurrentSlideIndex() > 0 && this.utilService.getQuestionType(this.questions, currentIndex) === 'MCQ'
            && this.utilService.canGo(this.progressBarClass[this.myCarousel.getCurrentSlideIndex()])) {
            this.infoPopupTimeOut();
        }
        else if (!this.optionSelectedObj && !this.active && !this.allowSkip && this.myCarousel.getCurrentSlideIndex() >= 0
            && this.utilService.getQuestionType(this.questions, currentIndex) === 'MCQ'
            && this.utilService.canGo(this.progressBarClass[this.myCarousel.getCurrentSlideIndex()])) {
            this.infoPopupTimeOut();
        }
    }
    /**
     * @return {?}
     */
    infoPopupTimeOut() {
        this.infoPopup = true;
        setTimeout((/**
         * @return {?}
         */
        () => {
            this.infoPopup = false;
        }), 2000);
    }
    /**
     * @param {?=} type
     * @return {?}
     */
    correctFeedBackTimeOut(type) {
        this.intervalRef = setTimeout((/**
         * @return {?}
         */
        () => {
            this.showAlert = false;
            if (!this.myCarousel.isLast(this.myCarousel.getCurrentSlideIndex()) && type === 'next') {
                this.nextSlide();
            }
            else if (type === 'previous' && !this.stopAutoNavigation) {
                this.prevSlide();
            }
            else if (type === 'jump' && !this.stopAutoNavigation) {
                this.goToSlide(this.jumpSlideIndex);
            }
            else if (this.myCarousel.isLast(this.myCarousel.getCurrentSlideIndex())) {
                this.endPageReached = true;
                this.emitSectionEnd();
            }
        }), 4000);
    }
    /**
     * @param {?} index
     * @return {?}
     */
    goToSlide(index) {
        var _a, _b;
        this.viewerService.raiseHeartBeatEvent(eventName.goToQuestion, TelemetryType.interact, this.myCarousel.getCurrentSlideIndex());
        this.disableNext = false;
        this.currentSlideIndex = index;
        this.showRootInstruction = false;
        if (index === 0) {
            this.optionSelectedObj = undefined;
            this.myCarousel.selectSlide(0);
            this.active = this.currentSlideIndex === 0 && this.sectionIndex === 0 && this.showStartPage;
            this.showRootInstruction = true;
            if (!((_b = (_a = this.sectionConfig.metadata) === null || _a === void 0 ? void 0 : _a.children) === null || _b === void 0 ? void 0 : _b.length)) {
                this.disableNext = true;
            }
            return;
        }
        this.currentQuestionsMedia = _.get(this.questions[this.currentSlideIndex - 1], 'media');
        this.setSkippedClass(this.currentSlideIndex - 1);
        if (!this.initializeTimer) {
            this.initializeTimer = true;
        }
        if (this.questions[index - 1] === undefined) {
            this.showQuestions = false;
            this.viewerService.getQuestions(0, index);
            this.currentSlideIndex = index;
        }
        else if (this.questions[index - 1] !== undefined) {
            this.myCarousel.selectSlide(index);
        }
        this.setImageZoom();
        this.currentSolutions = undefined;
        this.highlightQuestion();
    }
    /**
     * @param {?} event
     * @return {?}
     */
    goToQuestion(event) {
        this.active = false;
        this.showRootInstruction = false;
        this.disableNext = false;
        this.initializeTimer = true;
        /** @type {?} */
        const index = event.questionNo;
        this.viewerService.getQuestions(0, index);
        this.currentSlideIndex = index;
        this.myCarousel.selectSlide(index);
        this.highlightQuestion();
    }
    /**
     * @return {?}
     */
    highlightQuestion() {
        var _a, _b, _c;
        /** @type {?} */
        const currentQuestion = this.questions[this.currentSlideIndex - 1];
        /** @type {?} */
        const questionType = (_b = (_a = currentQuestion) === null || _a === void 0 ? void 0 : _a.qType) === null || _b === void 0 ? void 0 : _b.toUpperCase();
        /** @type {?} */
        const element = (/** @type {?} */ (document.getElementById((_c = currentQuestion) === null || _c === void 0 ? void 0 : _c.identifier)));
        if (element && questionType) {
            /** @type {?} */
            let questionTitleElement;
            switch (questionType) {
                case 'MCQ':
                    questionTitleElement = (/** @type {?} */ (element.querySelector('.mcq-title')));
                    break;
                default:
                    questionTitleElement = (/** @type {?} */ (element.querySelector('.question-container')));
            }
            if (questionTitleElement) {
                setTimeout((/**
                 * @return {?}
                 */
                () => {
                    questionTitleElement.focus();
                }), 0);
            }
        }
    }
    /**
     * @return {?}
     */
    getSolutions() {
        this.showAlert = false;
        this.viewerService.raiseHeartBeatEvent(eventName.showAnswer, TelemetryType.interact, this.myCarousel.getCurrentSlideIndex());
        this.viewerService.raiseHeartBeatEvent(eventName.showAnswer, TelemetryType.impression, this.myCarousel.getCurrentSlideIndex());
        /** @type {?} */
        const currentIndex = this.myCarousel.getCurrentSlideIndex() - 1;
        this.currentQuestion = this.questions[currentIndex].body;
        this.currentOptions = this.questions[currentIndex].interactions.response1.options;
        this.currentQuestionsMedia = _.get(this.questions[currentIndex], 'media');
        setTimeout((/**
         * @return {?}
         */
        () => {
            this.setImageZoom();
        }));
        setTimeout((/**
         * @return {?}
         */
        () => {
            this.setImageHeightWidthClass();
        }), 100);
        if (this.currentSolutions) {
            this.showSolution = true;
        }
        this.clearTimeInterval();
    }
    /**
     * @return {?}
     */
    viewSolution() {
        this.viewerService.raiseHeartBeatEvent(eventName.viewSolutionClicked, TelemetryType.interact, this.myCarousel.getCurrentSlideIndex());
        this.showSolution = true;
        this.showAlert = false;
        this.currentQuestionsMedia = _.get(this.questions[this.myCarousel.getCurrentSlideIndex() - 1], 'media');
        setTimeout((/**
         * @return {?}
         */
        () => {
            this.setImageZoom();
            this.setImageHeightWidthClass();
        }));
        clearTimeout(this.intervalRef);
    }
    /**
     * @return {?}
     */
    closeSolution() {
        this.setImageZoom();
        this.viewerService.raiseHeartBeatEvent(eventName.solutionClosed, TelemetryType.interact, this.myCarousel.getCurrentSlideIndex());
        this.showSolution = false;
        this.myCarousel.selectSlide(this.currentSlideIndex);
        this.focusOnNextButton();
    }
    /**
     * @return {?}
     */
    viewHint() {
        this.viewerService.raiseHeartBeatEvent(eventName.viewHint, TelemetryType.interact, this.myCarousel.getCurrentSlideIndex());
    }
    /**
     * @param {?} event
     * @param {?=} question
     * @return {?}
     */
    showAnswerClicked(event, question) {
        var _a;
        if ((_a = event) === null || _a === void 0 ? void 0 : _a.showAnswer) {
            this.focusOnNextButton();
            this.active = true;
            this.progressBarClass[this.myCarousel.getCurrentSlideIndex() - 1].class = 'correct';
            if (question) {
                /** @type {?} */
                const index = this.questions.findIndex((/**
                 * @param {?} que
                 * @return {?}
                 */
                que => que.identifier === question.identifier));
                if (index > -1) {
                    this.questions[index].isAnswerShown = true;
                    this.viewerService.updateSectionQuestions(this.sectionConfig.metadata.identifier, this.questions);
                }
            }
            this.viewerService.raiseHeartBeatEvent(eventName.showAnswer, TelemetryType.interact, pageId.shortAnswer);
            this.viewerService.raiseHeartBeatEvent(eventName.pageScrolled, TelemetryType.impression, this.myCarousel.getCurrentSlideIndex() - 1);
        }
    }
    /**
     * @param {?} currentIndex
     * @param {?} key
     * @param {?} isCorrectAnswer
     * @param {?=} selectedOption
     * @return {?}
     */
    getScore(currentIndex, key, isCorrectAnswer, selectedOption) {
        if (isCorrectAnswer) {
            return this.questions[currentIndex].responseDeclaration[key].correctResponse.outcomes.SCORE ?
                this.questions[currentIndex].responseDeclaration[key].correctResponse.outcomes.SCORE :
                this.questions[currentIndex].responseDeclaration[key].maxScore || 1;
        }
        else {
            /** @type {?} */
            const selectedOptionValue = selectedOption.option.value;
            /** @type {?} */
            const mapping = this.questions[currentIndex].responseDeclaration.mapping;
            /** @type {?} */
            let score = 0;
            if (mapping) {
                mapping.forEach((/**
                 * @param {?} val
                 * @return {?}
                 */
                (val) => {
                    if (selectedOptionValue === val.response) {
                        score = val.outcomes.SCORE || 0;
                        if (val.outcomes.SCORE) {
                            this.progressBarClass[currentIndex].class = 'partial';
                        }
                    }
                }));
            }
            return score;
        }
    }
    /**
     * @return {?}
     */
    calculateScore() {
        return this.progressBarClass.reduce((/**
         * @param {?} accumulator
         * @param {?} element
         * @return {?}
         */
        (accumulator, element) => accumulator + element.score), 0);
    }
    /**
     * @param {?} index
     * @param {?} classToBeUpdated
     * @param {?=} optionValue
     * @param {?=} score
     * @return {?}
     */
    updateScoreBoard(index, classToBeUpdated, optionValue, score) {
        this.progressBarClass.forEach((/**
         * @param {?} ele
         * @return {?}
         */
        (ele) => {
            if (ele.index - 1 === index) {
                ele.class = classToBeUpdated;
                ele.score = score ? score : 0;
                if (!this.showFeedBack) {
                    ele.value = optionValue;
                }
            }
        }));
    }
    /* End of score methods  */
    /* Start of Image zoom related */
    /**
     * @return {?}
     */
    setImageHeightWidthClass() {
        document.querySelectorAll('[data-asset-variable]').forEach((/**
         * @param {?} image
         * @return {?}
         */
        image => {
            image.removeAttribute('class');
            if (image.clientHeight > image.clientWidth) {
                image.setAttribute('class', 'portrait');
            }
            else if (image.clientHeight < image.clientWidth) {
                image.setAttribute('class', 'landscape');
            }
            else {
                image.setAttribute('class', 'neutral');
            }
        }));
    }
    /**
     * @return {?}
     */
    setImageZoom() {
        var _a;
        /** @type {?} */
        const index = this.myCarousel.getCurrentSlideIndex() - 1;
        /** @type {?} */
        const currentQuestionId = (_a = this.questions[index]) === null || _a === void 0 ? void 0 : _a.identifier;
        document.querySelectorAll('[data-asset-variable]').forEach((/**
         * @param {?} image
         * @return {?}
         */
        image => {
            /** @type {?} */
            const imageId = image.getAttribute('data-asset-variable');
            image.setAttribute('class', 'option-image');
            image.setAttribute('id', imageId);
            _.forEach(this.currentQuestionsMedia, (/**
             * @param {?} val
             * @return {?}
             */
            (val) => {
                if (imageId === val.id) {
                    if (this.sectionConfig.metadata.isAvailableLocally && this.parentConfig.baseUrl) {
                        if (currentQuestionId) {
                            image['src'] = `${this.parentConfig.baseUrl}/${currentQuestionId}/${val.src}`;
                        }
                    }
                    else if (val.baseUrl) {
                        image['src'] = val.baseUrl + val.src;
                    }
                }
            }));
            /** @type {?} */
            const divElement = document.createElement('div');
            divElement.setAttribute('class', 'magnify-icon');
            divElement.onclick = (/**
             * @param {?} event
             * @return {?}
             */
            (event) => {
                this.viewerService.raiseHeartBeatEvent(eventName.zoomClicked, TelemetryType.interact, this.myCarousel.getCurrentSlideIndex());
                this.zoomImgSrc = image['src'];
                this.showZoomModal = true;
                /** @type {?} */
                const zoomImage = document.getElementById('imageModal');
                if (zoomImage.clientHeight > image.clientWidth) {
                    zoomImage.setAttribute('class', 'portrait');
                }
                else if (image.clientHeight < image.clientWidth) {
                    zoomImage.setAttribute('class', 'landscape');
                }
                else {
                    zoomImage.setAttribute('class', 'neutral');
                }
                event.stopPropagation();
            });
            image.parentNode.insertBefore(divElement, image.nextSibling);
        }));
    }
    // Method Name changed
    /**
     * @return {?}
     */
    zoomIn() {
        this.viewerService.raiseHeartBeatEvent(eventName.zoomInClicked, TelemetryType.interact, this.myCarousel.getCurrentSlideIndex());
        this.imageZoomCount = this.imageZoomCount + 10;
        this.setImageModalHeightWidth();
    }
    // Method Name changed
    /**
     * @return {?}
     */
    zoomOut() {
        this.viewerService.raiseHeartBeatEvent(eventName.zoomOutClicked, TelemetryType.interact, this.myCarousel.getCurrentSlideIndex());
        if (this.imageZoomCount > 100) {
            this.imageZoomCount = this.imageZoomCount - 10;
            this.setImageModalHeightWidth();
        }
    }
    /**
     * @return {?}
     */
    setImageModalHeightWidth() {
        this.imageModal.nativeElement.style.width = `${this.imageZoomCount}%`;
        this.imageModal.nativeElement.style.height = `${this.imageZoomCount}%`;
    }
    /**
     * @return {?}
     */
    closeZoom() {
        this.viewerService.raiseHeartBeatEvent(eventName.zoomCloseClicked, TelemetryType.interact, this.myCarousel.getCurrentSlideIndex());
        document.getElementById('imageModal').removeAttribute('style');
        this.showZoomModal = false;
    }
    /* End of Image zoom related */
    /**
     * @return {?}
     */
    clearTimeInterval() {
        if (this.intervalRef) {
            clearInterval(this.intervalRef);
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
        this.errorService.getInternetConnectivityError.unsubscribe();
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
SectionPlayerComponent.decorators = [
    { type: Component, args: [{
                selector: 'quml-section-player',
                template: "<div class=\"quml-container\" *ngIf=\"loadView\" [hidden]=\"showZoomModal\">\n  <div [hidden]=\"showSolution\" class=\"quml-landscape\">\n    <sb-player-side-menu-icon class=\"notVisible\" *ngIf=\"sideMenuConfig.enable\" (sidebarMenuEvent)=\"sideBarEvents($event)\"></sb-player-side-menu-icon>\n    <quml-header class=\"main-header\" (durationEnds)=\"durationEnds()\" [disablePreviousNavigation]=\"linearNavigation\"\n      [duration]=\"timeLimit\" [warningTime]=\"warningTime\" [showTimer]=\"showTimer\"\n      (nextSlideClicked)=\"nextSlideClicked($event)\" (prevSlideClicked)=\"previousSlideClicked($event)\"\n      [currentSlideIndex]=\"currentSlideIndex\" [totalNoOfQuestions]=\"noOfQuestions\" [active]=\"active\"\n      [showFeedBack]=\"showFeedBack\" [currentSolutions]=\"currentSolutions\" (showSolution)=\"viewSolution()\"\n      [initializeTimer]=\"initializeTimer\" [replayed]=\"parentConfig?.isReplayed\" [disableNext]=\"disableNext\"\n      [startPageInstruction]=\"startPageInstruction\" [attempts]=\"attempts\" [showStartPage]=\"showStartPage\">\n    </quml-header>\n\n    <sb-player-sidebar [title]=\"parentConfig?.contentName\" (sidebarEvent)=\"sideBarEvents($event)\"\n      [config]=\"sideMenuConfig\">\n    </sb-player-sidebar>\n    <div class=\"landscape-mode\">\n      <div class=\"lanscape-mode-left\">\n        <div class=\"current-slide\" *ngIf=\"!showRootInstruction\">\n          {{myCarousel.getCurrentSlideIndex()}}/{{noOfQuestions}}\n        </div>\n        <div *ngIf=\"currentSolutions && showUserSolution\">\n          <quml-ans (click)=\"getSolutions()\"></quml-ans>\n        </div>\n      </div>\n      <div class=\"landscape-content\">\n        <carousel class=\"landscape-center\" [interval]=\"0\" [showIndicators]=\"false\" [noWrap]=\"true\" #myCarousel (activeSlideChange)=\"activeSlideChange($event)\">\n          <slide>\n            <quml-startpage [instructions]=\"showRootInstruction ? parentConfig?.instructions : sectionConfig.metadata?.instructions?.default || parentConfig?.instructions\"  [points]=\"points\"\n              [time]=\"showRootInstruction ? timeLimit : null\" [showTimer]=\"showTimer\" [totalNoOfQuestions]=\"showRootInstruction ? parentConfig?.questionCount : noOfQuestions\"\n              [contentName]=\"showRootInstruction ? parentConfig?.contentName : parentConfig?.isSectionsAvailable ? sectionConfig?.metadata?.name : parentConfig?.contentName\">\n            </quml-startpage>\n          </slide>\n          <slide *ngFor=\"let question of questions; let i= index\" #questionSlide>\n            <div [id]=\"question.identifier\">\n              <div *ngIf=\"question?.primaryCategory.toLowerCase() === 'multiple choice question'\">\n                <quml-mcq [question]='question' [replayed]=\"parentConfig?.isReplayed\"\n                  (optionSelected)=\"getOptionSelected($event)\" [identifier]=\"question.id\" [tryAgain]=\"tryAgainClicked\">\n                </quml-mcq>\n              </div>\n              <div *ngIf=\"question?.primaryCategory.toLowerCase() === 'subjective question'\">\n                <quml-sa [questions]='question' [replayed]=\"parentConfig?.isReplayed\" [baseUrl]=\"parentConfig?.baseUrl\"\n                  (showAnswerClicked)=\"showAnswerClicked($event, question)\">\n                </quml-sa>\n              </div>\n            </div>\n          </slide>\n        </carousel>\n      </div>\n      <div class=\"lanscape-mode-right\">\n        <ul>\n          <ng-container>\n            <li class=\"showFeedBack-progressBar info-page hover-effect\" tabindex=\"0\"\n            [ngClass]=\"(currentSlideIndex === 0) ? 'att-color progressBar-border': 'att-color' \"\n            (keydown)=\"onEnter($event, 0)\" (click)=\"goToSlideClicked($event, 0)\">i\n            </li>\n            <li>\n              <ul *ngIf=\"parentConfig?.isSectionsAvailable\" class=\"scoreboard-sections\">\n                <li class=\"section relative\" *ngFor=\"let section of mainProgressBar; let i=index;\" attr.aria-label=\"section {{section?.index}}\"\n                  (click)=\"jumpToSection(section?.identifier)\" (keydown)=\"onSectionEnter($event, section?.identifier)\"\n                  [ngClass]=\"{'attempted' : section.class === 'attempted', 'partial': section.class === 'partial'}\">\n                  <label for=\"list-item-{{i}}\" class=\"progressBar-border\" [ngClass] = \"{'active' : section?.isActive && !showRootInstruction && section.class !== 'attempted'}\" tabindex=\"0\">{{section?.index}}</label>\n                  <ul *ngIf=\"section?.isActive && showFeedBack\">\n                    <li *ngFor=\"let question of progressBarClass; let j=index\" tabindex=\"0\" attr.aria-label=\"question number {{question?.index}}\"\n                      (click)=\"goToSlideClicked($event, question?.index)\" (keydown)=\"onEnter($event, question?.index)\" class=\"showFeedBack-progressBar\"\n                      [ngClass]=\"(j+1) === myCarousel.getCurrentSlideIndex() ? (question.class === 'skipped' ? 'progressBar-border' : 'progressBar-border ' + question.class) : question.class\">\n                      {{question?.index}}\n                    </li>\n                  </ul>\n                  <ul class=\"nonFeedback\" *ngIf=\"section?.isActive && !showFeedBack\">\n                    <li *ngFor=\"let question of progressBarClass; let j=index\" tabindex=\"0\" attr.aria-label=\"question number {{question?.index}}\"\n                      (click)=\"goToSlideClicked($event, question?.index)\" (keydown)=\"onEnter($event, question?.index)\" class=\"showFeedBack-progressBar\"\n                      [ngClass]=\"(j+1) === myCarousel.getCurrentSlideIndex() ? (question.class === 'skipped' ? 'progressBar-border' : 'att-color progressBar-border') : question.class === 'skipped' ? question.class: question.class === 'unattempted' ? '' : 'att-color'\">\n                      {{question?.index}}\n                    </li>\n                  </ul>\n                </li>\n              </ul>\n            </li>\n           <li>\n            <ul class=\"singleContent\" *ngIf=\"!parentConfig?.isSectionsAvailable && showFeedBack\">\n              <li *ngFor=\"let question of progressBarClass; let j=index\" tabindex=\"0\" attr.aria-label=\"question number {{question?.index}}\"\n                (click)=\"goToSlideClicked($event, question?.index)\" (keydown)=\"onEnter($event, question?.index)\" class=\"showFeedBack-progressBar hover-effect\"\n                [ngClass]=\"(j+1) === myCarousel.getCurrentSlideIndex() ? (question.class === 'skipped' ? 'progressBar-border' : 'progressBar-border ' + question.class) : question.class\">\n                {{question?.index}}\n              </li>\n            </ul>\n           </li>\n          <li>\n            <ul class=\"singleContent nonFeedback\" *ngIf=\"!parentConfig?.isSectionsAvailable && !showFeedBack\">\n              <li *ngFor=\"let question of progressBarClass; let j=index\" tabindex=\"0\" attr.aria-label=\"question number {{question?.index}}\"\n                (click)=\"goToSlideClicked($event, question?.index)\" (keydown)=\"onEnter($event, question?.index)\" class=\"showFeedBack-progressBar hover-effect\"\n                [ngClass]=\"(j+1) === myCarousel.getCurrentSlideIndex() ? (question.class === 'skipped' ? 'progressBar-border' : 'att-color progressBar-border') : question.class === 'skipped' ? question.class: question.class === 'unattempted' ? '' : 'att-color'\">\n                {{question?.index}}\n              </li>\n            </ul>\n          </li>\n            <li class=\"requiresSubmit cursor-pointer showFeedBack-progressBar hover-effect\" tabindex=\"0\" aria-label=\"scoreboard\" *ngIf=\"parentConfig.requiresSubmit && progressBarClass?.length\"\n              (click)=\"disableNext = true; onScoreBoardClicked()\" (keydown)=\"onScoreBoardEnter($event)\">\n              <img src=\"./assets/flag_inactive.svg\" alt=\"Flag logo: Show scoreboard\">\n            </li>\n            <!-- <li class=\"requiresSubmit\" *ngIf=\"loadScoreBoard && parentConfig.requiresSubmit\">\n              <img src=\"./assets/flag_active.svg\" alt=\"\">\n            </li> -->\n          </ng-container>\n        </ul>\n      </div>\n    </div>\n  </div>\n\n  <quml-alert *ngIf=\"showAlert && showFeedBack\" [alertType]=\"alertType\" [isHintAvailable]=\"showHints\"\n    [showSolutionButton]=\"showUserSolution\" (showSolution)=\"viewSolution()\" (showHint)=\"viewHint()\"\n    (closeAlert)=\"closeAlertBox($event)\"></quml-alert>\n\n  <quml-mcq-solutions *ngIf=\"showSolution\" [question]=\"currentQuestion\" [options]=\"currentOptions\"\n    [solutions]=\"currentSolutions\" (close)=\"closeSolution()\"></quml-mcq-solutions>\n</div>\n\n<div class=\"info-popup\" *ngIf=\"infoPopup\">\n  Please attempt the question\n</div>\n\n<sb-player-contenterror *ngIf=\"showContentError\"></sb-player-contenterror>\n\n\n<!-- Zoom -->\n<div class=\"image-viewer__overlay\" [hidden]=\"!showZoomModal\">\n  <div class=\"image-viewer__close\" (click)=\"closeZoom()\">\n  </div>\n  <div class=\"image-viewer__container\">\n    <img #imageModal id=\"imageModal\" class=\"image-viewer__img\" [src]=\"zoomImgSrc\" alt=\"Zoomed image\">\n  </div>\n  <div class=\"image-viewer__zoom\">\n    <div class=\"image-viewer__zoomin\" (click)=\"zoomIn()\"></div>\n    <div class=\"image-viewer__zoomout\" (click)=\"zoomOut()\"></div>\n  </div>\n</div>",
                styles: ["@charset \"UTF-8\";::ng-deep :root{--quml-scoreboard-sub-title:#6D7278;--quml-scoreboard-skipped:#969696;--quml-scoreboard-unattempted:#575757;--quml-color-success:#08BC82;--quml-color-danger:#F1635D;--quml-color-primary-contrast:#333;--quml-btn-border:#ccc;--quml-heder-text-color:#6250f5;--quml-header-bg-color:#c2c2c2;--quml-mcq-title-txt:#131415;--quml-zoom-btn-txt:#eee;--quml-zoom-btn-hover:#f2f2f2;--quml-main-bg:#fff;--quml-btn-color:#fff;--quml-question-bg:#fff}.quml-header{background:var(--quml-header-bg-color);display:flow-root;height:2.25rem;position:fixed}.quml-container{overflow:hidden;width:100%;height:100%;position:relative}.quml-landscape{width:100%;height:100%}::ng-deep .carousel{outline:0}.col{padding-left:0;padding-right:0}.quml-button-container{margin-right:1.5rem;float:right}.quml-button{background-color:var(--primary-color);border:none;color:var(--quml-btn-color);padding:.25rem;text-align:center;text-decoration:none;font-size:1rem;margin:.125rem .5rem .125rem .125rem;cursor:pointer;width:3rem;height:2.5rem;border-radius:10%}.landscape-mode{height:100%;width:100%;position:relative;background-color:var(--quml-main-bg)}.landscape-content{padding:2.5rem 4rem 0;overflow:auto;height:100%;width:100%}@media only screen and (max-width:480px){.landscape-content{padding:5rem 1rem 0;height:calc(100% - 3rem)}}.lanscape-mode-left{position:absolute;left:0;top:3.5rem;text-align:center;z-index:1;width:4rem}.lanscape-mode-left div{padding-bottom:1.5rem}.landscape-center{width:100%}.lanscape-mode-right{-ms-overflow-style:none;scrollbar-width:none;position:absolute;padding-right:1rem;right:.5rem;color:var(--quml-scoreboard-unattempted);font-size:.75rem;height:calc(100% - 4rem);overflow-y:auto;top:3.5rem;padding-left:1rem}.lanscape-mode-right ul{list-style:none;margin-top:.5rem;padding:0;text-align:center;position:relative}.lanscape-mode-right ul::before{content:\"\";width:.0625rem;height:100%;position:absolute;left:0;right:0;background-color:rgba(204,204,204,.5);z-index:1;margin:0 auto}.lanscape-mode-right ul li{position:relative;z-index:2}.lanscape-mode-right ul li.requiresSubmit{color:var(--quml-scoreboard-unattempted);border:.03125rem solid var(--quml-scoreboard-unattempted);border-radius:50%;width:1.25rem;height:1.25rem;background:var(--white)}.lanscape-mode-right ul li.requiresSubmit:hover{border:.0625rem solid var(--primary-color)}.lanscape-mode-right ul .singleContent.nonFeedback li:hover{border:1px solid var(--primary-color);color:var(--primary-color)}.lanscape-mode-right ul .singleContent.nonFeedback li.att-color{color:var(--white);background:var(--primary-color)}.lanscape-mode-right ul .section ul.nonFeedback li:hover{border:1px solid var(--primary-color);color:var(--primary-color)}.lanscape-mode-right ul .section ul.nonFeedback li.att-color{color:var(--white);background:var(--primary-color)}.lanscape-mode-right ul .section ul li.progressBar-border::after,.lanscape-mode-right ul .section ul li:focus::after,.lanscape-mode-right ul .section ul li:hover::after{border:1px solid var(--primary-color);content:\"\";width:1.65rem;height:1.65rem;border-radius:50%;padding:.25rem;position:absolute}.lanscape-mode-right ul .section.attempted::after{content:\"\";display:inline-block;transform:rotate(45deg);height:.6rem;width:.3rem;border-bottom:.12rem solid var(--primary-color);border-right:.12rem solid var(--primary-color);position:absolute;top:.25rem;right:-.7rem}.lanscape-mode-right ul .section.correct::after,.lanscape-mode-right ul .section.partial::after,.lanscape-mode-right ul .section.wrong::after{content:\"\";position:absolute;top:.525rem;right:-.7rem;height:.375rem;width:.375rem;border-radius:.375rem}.lanscape-mode-right ul .section.correct::after{--correct-bg:var(--quml-color-success);background:var(--correct-bg)}.lanscape-mode-right ul .section.wrong::after{--wrong-bg:var(--quml-color-danger);background:var(--wrong-bg)}.lanscape-mode-right ul .section.partial::after{--partial-bg:linear-gradient(\n    180deg,\n    rgba(71, 164, 128, 1) 0%,\n    rgba(71, 164, 128, 1) 50%,\n    rgba(249, 122, 116, 1) 50%,\n    rgba(249, 122, 116, 1) 100%\n    );background:var(--partial-bg)}.lanscape-mode-right ul .section.attempted label,.lanscape-mode-right ul .section.partial label{color:var(--white)!important;background:var(--primary-color);border:.03125rem solid var(--primary-color)}.lanscape-mode-right ul .section label{background-color:var(--quml-question-bg);border-radius:.25rem;width:1.25rem;padding:.25rem;height:1.25rem;display:flex;align-items:center;justify-content:center;color:var(--quml-scoreboard-unattempted);border:.03125rem solid var(--quml-scoreboard-unattempted);margin-bottom:2.25rem;cursor:pointer}.lanscape-mode-right ul .section label.requiresSubmit{color:var(--quml-scoreboard-unattempted);border:.03125rem solid var(--quml-scoreboard-unattempted);border-radius:50%;background:var(--white)}.lanscape-mode-right ul .section label.requiresSubmit:hover{border:.0625rem solid var(--primary-color)}.lanscape-mode-right ul .section label.active,.lanscape-mode-right ul .section label:focus,.lanscape-mode-right ul .section label:hover{color:var(--primary-color);border:.0625rem solid var(--primary-color)}.lanscape-mode-right ul .section label.active::after,.lanscape-mode-right ul .section label:focus::after,.lanscape-mode-right ul .section label:hover::after{border:1px solid var(--primary-color);content:\"\";height:1.65rem;border-radius:.25rem;position:absolute;width:1.65rem;background:var(--quml-question-bg);z-index:-1}.lanscape-mode-right ul .section label.skipped{color:var(--white);background:var(--quml-scoreboard-skipped);border:.0625rem solid var(--quml-scoreboard-skipped)}.lanscape-mode-right ul .section label.unattempted{color:var(--quml-scoreboard-unattempted);border:.03125rem solid var(--quml-scoreboard-unattempted)}.lanscape-mode-right ul .section label.unattempted:hover{border:.0625rem solid var(--primary-color);color:var(--primary-color)}.lanscape-mode-right ul input[type=checkbox]{display:none}.lanscape-mode-right ul input[type=checkbox]~ul{height:0;transform:scaleY(0)}.lanscape-mode-right ul input[type=checkbox]:checked~ul{height:100%;transform-origin:top;transition:transform .2s ease-out;transform:scaleY(1)}.lanscape-mode-right ul .section input[type=checkbox]:checked~label{border:.0625rem solid var(--primary-color);color:var(--primary-color)}.lanscape-mode-right ul .showFeedBack-progressBar{background-color:var(--quml-question-bg);border-radius:50%;width:1.25rem;padding:.25rem;height:1.25rem;display:flex;align-items:center;justify-content:center;border:.0625rem solid #ccc;margin-bottom:2.25rem;cursor:pointer}.lanscape-mode-right ul .showFeedBack-progressBar.requiresSubmit:hover{border:.0625rem solid var(--primary-color)}.lanscape-mode-right ul .showFeedBack-progressBar .active,.lanscape-mode-right ul .showFeedBack-progressBar.att-color,.lanscape-mode-right ul .showFeedBack-progressBar.progressBar-border{color:var(--primary-color);border:.0625rem solid var(--primary-color)}.lanscape-mode-right ul .showFeedBack-progressBar.info-page{color:var(--white);background:var(--primary-color);border:.0625rem solid var(--primary-color)}.lanscape-mode-right ul .showFeedBack-progressBar.skipped{color:var(--white);background:var(--quml-scoreboard-skipped);border:.0625rem solid var(--quml-scoreboard-skipped)}.lanscape-mode-right ul .showFeedBack-progressBar.skipped:hover{color:var(--white)!important}.lanscape-mode-right ul .showFeedBack-progressBar.correct,.lanscape-mode-right ul .showFeedBack-progressBar.partial,.lanscape-mode-right ul .showFeedBack-progressBar.wrong{color:var(--white);border:0 solid transparent}.lanscape-mode-right ul .showFeedBack-progressBar.correct{--correct-bg:var(--quml-color-success);background:var(--correct-bg)}.lanscape-mode-right ul .showFeedBack-progressBar.wrong{--wrong-bg:var(--quml-color-danger);background:var(--wrong-bg)}.lanscape-mode-right ul .showFeedBack-progressBar.partial{--partial-bg:linear-gradient(\n    180deg,\n    rgba(71, 164, 128, 1) 0%,\n    rgba(71, 164, 128, 1) 50%,\n    rgba(249, 122, 116, 1) 50%,\n    rgba(249, 122, 116, 1) 100%\n  );background:var(--partial-bg)}.lanscape-mode-right ul .showFeedBack-progressBar.unattempted{color:var(--quml-scoreboard-unattempted);border:.03125rem solid var(--quml-scoreboard-unattempted)}.lanscape-mode-right ul .showFeedBack-progressBar.unattempted:hover{border:.0625rem solid var(--primary-color);color:var(--primary-color)}.current-slide{color:var(--quml-scoreboard-sub-title);font-size:.875rem;font-weight:900;letter-spacing:0}@media only screen and (max-width:480px){.lanscape-mode-right{background:var(--white);display:flex;align-items:center;overflow-x:auto;overflow-y:hidden;width:90%;height:2.5rem;padding:1rem 0 0;margin:auto;left:0}.lanscape-mode-right ul{list-style:none;padding:0;text-align:center;position:relative;display:flex;height:1.5rem;margin-top:0}.lanscape-mode-right ul .showFeedBack-progressBar{margin-right:2.25rem;z-index:1}.lanscape-mode-right ul .showFeedBack-progressBar:last-child{margin-right:0}.lanscape-mode-right ul .singleContent{display:flex}.lanscape-mode-right ul .singleContent .showFeedBack-progressBar:last-child{margin-right:2.25rem}.lanscape-mode-right ul .section ul{top:-1.75rem;position:inherit;margin:.5rem 2.25rem;padding-left:1.25rem}.lanscape-mode-right ul .section ul::before{background:0 0}.lanscape-mode-right ul .section.attempted::after{content:\"\";top:-.8125rem;right:auto;left:.625rem}.lanscape-mode-right ul .section.correct::after,.lanscape-mode-right ul .section.partial::after,.lanscape-mode-right ul .section.wrong::after{content:\"\";top:-.525rem;left:.5rem;right:auto}.lanscape-mode-right ul .section label{margin-right:2.25rem;margin-bottom:0}.lanscape-mode-right ul::before{content:\"\";width:100%;height:.0625rem;position:absolute;left:0;top:50%;transform:translate(0,-50%);right:0;background-color:rgba(204,204,204,.5);z-index:0;margin:0 auto}.lanscape-mode-right ul input[type=checkbox]~ul{width:0;transform:scaleX(0);margin:0}.lanscape-mode-right ul input[type=checkbox]:checked~ul{width:calc(100% - 4rem);transform-origin:left;transition:transform .2s ease-out;transform:scaleX(1);margin:-1.25rem 3rem 0 4rem}.landscape-center{margin-top:2rem}.lanscape-mode-left{display:none}.landscape-mode{grid-template-areas:\"right right right\" \"center center center\" \"left left left\"}::ng-deep .quml-mcq .mcq-title,::ng-deep .quml-sa .mcq-title,::ng-deep quml-mcq-solutions .mcq-title,::ng-deep quml-sa .mcq-title{margin-top:1rem}}.quml-timer{padding:.5rem}.quml-header-text{margin:.5rem;text-align:center;text-overflow:ellipsis;overflow:hidden;white-space:nowrap}.quml-arrow-button{border-radius:28%;font-size:0;outline:0;background-color:var(--primary-color);padding:.5rem}.info-popup{position:absolute;top:18%;right:10%;font-size:.875rem;font-family:noto-sans;box-shadow:0 .125rem .875rem 0 rgba(0,0,0,.1);padding:.75rem}.quml-menu{width:1.5rem;height:1.5rem}.quml-card{background-color:var(--white);padding:1.25rem;box-shadow:0 .25rem .5rem 0 rgba(0,0,0,.2);width:25%;position:absolute;left:37%;text-align:center;top:25%;z-index:2}.quml-card-title{font-size:1.25rem;text-align:center}.quml-card-body .wrong{color:red}.quml-card-body .right{color:green}.quml-card-button-section .button-container button{color:var(--white);background-color:var(--primary-color);border-color:var(--primary-color);outline:0;font-size:.875rem;padding:.25rem 1.5rem}.quml-card-button-section .button-container{width:40%;display:inline;padding-right:.75rem}::ng-deep .carousel.slide .carousel-control.carousel-control-next,::ng-deep .carousel.slide a.left.carousel-control.carousel-control-prev{display:none}::ng-deep .carousel-item{perspective:unset}.potrait-header-top{visibility:hidden;margin-top:-2.5rem}.potrait-header-top .wrapper{display:-ms-grid;display:grid;-ms-grid-columns:1fr 15fr;grid-template-columns:1fr 15fr}.potrait-header-top .quml-menu{color:var(--quml-heder-text-color);font-size:1.5rem;padding-left:1.25rem;margin-top:.25rem}.potrait-header-top .quml-header-text{font-size:.875rem;color:var(--quml-heder-text-color)}.row{margin-right:0;margin-left:0}.portrait-header{visibility:hidden}.image-viewer__close,.image-viewer__container,.image-viewer__overlay,.image-viewer__zoom{position:absolute}.image-viewer__overlay{width:100%;height:100%;background:var(--quml-color-primary-contrast);z-index:11111}.image-viewer__container{background-color:var(--quml-color-primary-contrast);top:50%;left:50%;transform:translate(-50%,-50%);z-index:11111;width:80%;height:80%}.image-viewer__img{width:100%;height:100%}.image-viewer__close{top:1rem;right:1rem;text-align:center;cursor:pointer;z-index:999999;background:rgba(0,0,0,.5);border-radius:100%;width:3rem;height:3rem;position:fixed}.image-viewer__close::after{content:\"\u2715\";color:var(--white);font-size:2rem}.image-viewer__close:hover{background:#000}.image-viewer__zoom{bottom:1rem;right:1rem;width:2.5rem;height:auto;border-radius:.5rem;background:var(--white);display:flex;flex-direction:column;align-items:center;overflow:hidden;z-index:99999;position:fixed;border:.0625rem solid var(--quml-zoom-btn-txt)}.image-viewer__zoomin,.image-viewer__zoomout{text-align:center;height:2.5rem;position:relative;width:2.5rem;cursor:pointer}.image-viewer__zoomin:hover,.image-viewer__zoomout:hover{background-color:var(--quml-zoom-btn-hover)}.image-viewer__zoomin::after,.image-viewer__zoomout::after{font-size:1.5rem;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)}.image-viewer__zoomin{border-bottom:.0625rem solid var(--quml-btn-border)}.image-viewer__zoomin::after{content:\"+\"}.image-viewer__zoomout::after{content:\"\u2212\"}::ng-deep quml-ans{cursor:pointer}::ng-deep quml-ans svg circle{fill:var(--quml-zoom-btn-txt)}::ng-deep .magnify-icon{position:absolute;right:0;width:1.5rem;height:1.5rem;border-top-left-radius:.5rem;cursor:pointer;background-color:var(--quml-color-primary-contrast)}::ng-deep .magnify-icon::after{content:\"\";position:absolute;bottom:.125rem;right:.125rem;z-index:1;width:1rem;height:1rem;background-image:url(\"data:image/svg+xml,%3C%3Fxml version='1.0'%3F%3E%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svgjs='http://svgjs.com/svgjs' version='1.1' width='512' height='512' x='0' y='0' viewBox='0 0 37.166 37.166' style='enable-background:new 0 0 512 512' xml:space='preserve' class=''%3E%3Cg%3E%3Cg xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M35.829,32.045l-6.833-6.833c-0.513-0.513-1.167-0.788-1.836-0.853c2.06-2.567,3.298-5.819,3.298-9.359 c0-8.271-6.729-15-15-15c-8.271,0-15,6.729-15,15c0,8.271,6.729,15,15,15c3.121,0,6.021-0.96,8.424-2.598 c0.018,0.744,0.305,1.482,0.872,2.052l6.833,6.833c0.585,0.586,1.354,0.879,2.121,0.879s1.536-0.293,2.121-0.879 C37.001,35.116,37.001,33.217,35.829,32.045z M15.458,25c-5.514,0-10-4.484-10-10c0-5.514,4.486-10,10-10c5.514,0,10,4.486,10,10 C25.458,20.516,20.972,25,15.458,25z M22.334,15c0,1.104-0.896,2-2,2h-2.75v2.75c0,1.104-0.896,2-2,2s-2-0.896-2-2V17h-2.75 c-1.104,0-2-0.896-2-2s0.896-2,2-2h2.75v-2.75c0-1.104,0.896-2,2-2s2,0.896,2,2V13h2.75C21.438,13,22.334,13.895,22.334,15z' fill='%23ffffff' data-original='%23000000' style='' class=''/%3E%3C/g%3E%3Cg xmlns='http://www.w3.org/2000/svg'%3E%3C/g%3E%3Cg xmlns='http://www.w3.org/2000/svg'%3E%3C/g%3E%3Cg xmlns='http://www.w3.org/2000/svg'%3E%3C/g%3E%3Cg xmlns='http://www.w3.org/2000/svg'%3E%3C/g%3E%3Cg xmlns='http://www.w3.org/2000/svg'%3E%3C/g%3E%3Cg xmlns='http://www.w3.org/2000/svg'%3E%3C/g%3E%3Cg xmlns='http://www.w3.org/2000/svg'%3E%3C/g%3E%3Cg xmlns='http://www.w3.org/2000/svg'%3E%3C/g%3E%3Cg xmlns='http://www.w3.org/2000/svg'%3E%3C/g%3E%3Cg xmlns='http://www.w3.org/2000/svg'%3E%3C/g%3E%3Cg xmlns='http://www.w3.org/2000/svg'%3E%3C/g%3E%3Cg xmlns='http://www.w3.org/2000/svg'%3E%3C/g%3E%3Cg xmlns='http://www.w3.org/2000/svg'%3E%3C/g%3E%3Cg xmlns='http://www.w3.org/2000/svg'%3E%3C/g%3E%3Cg xmlns='http://www.w3.org/2000/svg'%3E%3C/g%3E%3C/g%3E%3C/svg%3E%0A\");background-size:cover;background-repeat:no-repeat;background-position:center}::ng-deep .solution-options figure.image{border:.0625rem solid var(--quml-btn-border);overflow:hidden;border-radius:.25rem;position:relative;width:7.5rem;height:7.5rem}::ng-deep .image-viewer__overlay .image-viewer__container,::ng-deep .solutions .solution-options figure.image{display:flex;align-items:center;justify-content:center}::ng-deep .image-viewer__overlay .image-viewer__container .portrait,::ng-deep .solutions .solution-options figure.image .portrait{width:auto;height:100%}::ng-deep .image-viewer__overlay .image-viewer__container .neutral,::ng-deep .solutions .solution-options figure.image .neutral{width:auto;height:auto}@media only screen and (max-width:768px){::ng-deep .image-viewer__overlay .image-viewer__container .neutral,::ng-deep .solutions .solution-options figure.image .neutral{width:100%}}@media only screen and (min-width:768px){::ng-deep .image-viewer__overlay .image-viewer__container .neutral,::ng-deep .solutions .solution-options figure.image .neutral{height:100%}}::ng-deep .image-viewer__overlay .image-viewer__container .landscape,::ng-deep .solutions .solution-options figure.image .landscape{width:100%;height:auto}::ng-deep .quml-mcq .mcq-title,::ng-deep .quml-sa .mcq-title,::ng-deep quml-mcq-solutions .mcq-title,::ng-deep quml-sa .mcq-title{color:var(--quml-mcq-title-txt)}::ng-deep .quml-mcq .quml-mcq--question p,::ng-deep .quml-sa .quml-mcq--question p,::ng-deep quml-mcq-solutions .quml-mcq--question p,::ng-deep quml-sa .quml-mcq--question p{line-height:normal}::ng-deep .quml-mcq .quml-mcq--option .quml-mcq-option-card p:first-child,::ng-deep .quml-mcq .quml-mcq--option .quml-mcq-option-card p:last-child,::ng-deep .quml-sa .quml-mcq--option .quml-mcq-option-card p:first-child,::ng-deep .quml-sa .quml-mcq--option .quml-mcq-option-card p:last-child,::ng-deep quml-mcq-solutions .quml-mcq--option .quml-mcq-option-card p:first-child,::ng-deep quml-mcq-solutions .quml-mcq--option .quml-mcq-option-card p:last-child,::ng-deep quml-sa .quml-mcq--option .quml-mcq-option-card p:first-child,::ng-deep quml-sa .quml-mcq--option .quml-mcq-option-card p:last-child{margin-bottom:0}::ng-deep quml-mcq-solutions .mcq-title p,::ng-deep quml-mcq-solutions .text-center,::ng-deep quml-mcq-solutions .text-left,::ng-deep quml-mcq-solutions .text-right,::ng-deep quml-mcq-solutions h1,::ng-deep quml-mcq-solutions h2,::ng-deep quml-mcq-solutions h3,::ng-deep quml-mcq-solutions h4,::ng-deep quml-mcq-solutions h5,::ng-deep quml-mcq-solutions h6,::ng-deep quml-mcq-solutions p{text-align:center!important}::ng-deep quml-mcq-solutions .solutions .solution-options-container{align-items:center}::ng-deep quml-mcq-solutions .image-style-align-left,::ng-deep quml-mcq-solutions .image-style-align-right{float:none!important;text-align:center!important;margin:0 auto!important}::ng-deep quml-mcq-solutions figure.image,::ng-deep quml-mcq-solutions figure.image.resize-100,::ng-deep quml-mcq-solutions figure.image.resize-25,::ng-deep quml-mcq-solutions figure.image.resize-50,::ng-deep quml-mcq-solutions figure.image.resize-75,::ng-deep quml-mcq-solutions figure.image.resize-original{width:25%;height:auto}::ng-deep quml-mcq-solutions .solution-options p{margin-bottom:1rem}.endPage-container-height{height:100%}.scoreboard-sections{display:contents}.scoreboard-sections li{position:relative;z-index:2}.hover-effect.progressBar-border::after,.hover-effect:focus::after,.hover-effect:hover::after{border:1px solid var(--primary-color);content:\"\";width:1.65rem;height:1.65rem;border-radius:50%;padding:.25rem;position:absolute}", "::ng-deep :root{--quml-mcq-title-txt:#131415}::ng-deep .quml-mcq .mcq-title,::ng-deep .quml-sa .mcq-title,::ng-deep .startpage__instr-desc .mcq-title,::ng-deep quml-mcq-solutions .mcq-title,::ng-deep quml-sa .mcq-title{color:var(--quml-mcq-title-txt)}::ng-deep .quml-mcq .fs-10,::ng-deep .quml-mcq .fs-11,::ng-deep .quml-mcq .fs-12,::ng-deep .quml-mcq .fs-13,::ng-deep .quml-mcq .fs-14,::ng-deep .quml-mcq .fs-15,::ng-deep .quml-mcq .fs-16,::ng-deep .quml-mcq .fs-17,::ng-deep .quml-mcq .fs-18,::ng-deep .quml-mcq .fs-19,::ng-deep .quml-mcq .fs-20,::ng-deep .quml-mcq .fs-21,::ng-deep .quml-mcq .fs-22,::ng-deep .quml-mcq .fs-23,::ng-deep .quml-mcq .fs-24,::ng-deep .quml-mcq .fs-25,::ng-deep .quml-mcq .fs-26,::ng-deep .quml-mcq .fs-27,::ng-deep .quml-mcq .fs-28,::ng-deep .quml-mcq .fs-29,::ng-deep .quml-mcq .fs-30,::ng-deep .quml-mcq .fs-36,::ng-deep .quml-mcq .fs-8,::ng-deep .quml-mcq .fs-9,::ng-deep .quml-sa .fs-10,::ng-deep .quml-sa .fs-11,::ng-deep .quml-sa .fs-12,::ng-deep .quml-sa .fs-13,::ng-deep .quml-sa .fs-14,::ng-deep .quml-sa .fs-15,::ng-deep .quml-sa .fs-16,::ng-deep .quml-sa .fs-17,::ng-deep .quml-sa .fs-18,::ng-deep .quml-sa .fs-19,::ng-deep .quml-sa .fs-20,::ng-deep .quml-sa .fs-21,::ng-deep .quml-sa .fs-22,::ng-deep .quml-sa .fs-23,::ng-deep .quml-sa .fs-24,::ng-deep .quml-sa .fs-25,::ng-deep .quml-sa .fs-26,::ng-deep .quml-sa .fs-27,::ng-deep .quml-sa .fs-28,::ng-deep .quml-sa .fs-29,::ng-deep .quml-sa .fs-30,::ng-deep .quml-sa .fs-36,::ng-deep .quml-sa .fs-8,::ng-deep .quml-sa .fs-9,::ng-deep .startpage__instr-desc .fs-10,::ng-deep .startpage__instr-desc .fs-11,::ng-deep .startpage__instr-desc .fs-12,::ng-deep .startpage__instr-desc .fs-13,::ng-deep .startpage__instr-desc .fs-14,::ng-deep .startpage__instr-desc .fs-15,::ng-deep .startpage__instr-desc .fs-16,::ng-deep .startpage__instr-desc .fs-17,::ng-deep .startpage__instr-desc .fs-18,::ng-deep .startpage__instr-desc .fs-19,::ng-deep .startpage__instr-desc .fs-20,::ng-deep .startpage__instr-desc .fs-21,::ng-deep .startpage__instr-desc .fs-22,::ng-deep .startpage__instr-desc .fs-23,::ng-deep .startpage__instr-desc .fs-24,::ng-deep .startpage__instr-desc .fs-25,::ng-deep .startpage__instr-desc .fs-26,::ng-deep .startpage__instr-desc .fs-27,::ng-deep .startpage__instr-desc .fs-28,::ng-deep .startpage__instr-desc .fs-29,::ng-deep .startpage__instr-desc .fs-30,::ng-deep .startpage__instr-desc .fs-36,::ng-deep .startpage__instr-desc .fs-8,::ng-deep .startpage__instr-desc .fs-9,::ng-deep quml-mcq-solutions .fs-10,::ng-deep quml-mcq-solutions .fs-11,::ng-deep quml-mcq-solutions .fs-12,::ng-deep quml-mcq-solutions .fs-13,::ng-deep quml-mcq-solutions .fs-14,::ng-deep quml-mcq-solutions .fs-15,::ng-deep quml-mcq-solutions .fs-16,::ng-deep quml-mcq-solutions .fs-17,::ng-deep quml-mcq-solutions .fs-18,::ng-deep quml-mcq-solutions .fs-19,::ng-deep quml-mcq-solutions .fs-20,::ng-deep quml-mcq-solutions .fs-21,::ng-deep quml-mcq-solutions .fs-22,::ng-deep quml-mcq-solutions .fs-23,::ng-deep quml-mcq-solutions .fs-24,::ng-deep quml-mcq-solutions .fs-25,::ng-deep quml-mcq-solutions .fs-26,::ng-deep quml-mcq-solutions .fs-27,::ng-deep quml-mcq-solutions .fs-28,::ng-deep quml-mcq-solutions .fs-29,::ng-deep quml-mcq-solutions .fs-30,::ng-deep quml-mcq-solutions .fs-36,::ng-deep quml-mcq-solutions .fs-8,::ng-deep quml-mcq-solutions .fs-9,::ng-deep quml-sa .fs-10,::ng-deep quml-sa .fs-11,::ng-deep quml-sa .fs-12,::ng-deep quml-sa .fs-13,::ng-deep quml-sa .fs-14,::ng-deep quml-sa .fs-15,::ng-deep quml-sa .fs-16,::ng-deep quml-sa .fs-17,::ng-deep quml-sa .fs-18,::ng-deep quml-sa .fs-19,::ng-deep quml-sa .fs-20,::ng-deep quml-sa .fs-21,::ng-deep quml-sa .fs-22,::ng-deep quml-sa .fs-23,::ng-deep quml-sa .fs-24,::ng-deep quml-sa .fs-25,::ng-deep quml-sa .fs-26,::ng-deep quml-sa .fs-27,::ng-deep quml-sa .fs-28,::ng-deep quml-sa .fs-29,::ng-deep quml-sa .fs-30,::ng-deep quml-sa .fs-36,::ng-deep quml-sa .fs-8,::ng-deep quml-sa .fs-9{line-height:normal}::ng-deep .quml-mcq .fs-8,::ng-deep .quml-sa .fs-8,::ng-deep .startpage__instr-desc .fs-8,::ng-deep quml-mcq-solutions .fs-8,::ng-deep quml-sa .fs-8{font-size:.5rem}::ng-deep .quml-mcq .fs-9,::ng-deep .quml-sa .fs-9,::ng-deep .startpage__instr-desc .fs-9,::ng-deep quml-mcq-solutions .fs-9,::ng-deep quml-sa .fs-9{font-size:.563rem}::ng-deep .quml-mcq .fs-10,::ng-deep .quml-sa .fs-10,::ng-deep .startpage__instr-desc .fs-10,::ng-deep quml-mcq-solutions .fs-10,::ng-deep quml-sa .fs-10{font-size:.625rem}::ng-deep .quml-mcq .fs-11,::ng-deep .quml-sa .fs-11,::ng-deep .startpage__instr-desc .fs-11,::ng-deep quml-mcq-solutions .fs-11,::ng-deep quml-sa .fs-11{font-size:.688rem}::ng-deep .quml-mcq .fs-12,::ng-deep .quml-sa .fs-12,::ng-deep .startpage__instr-desc .fs-12,::ng-deep quml-mcq-solutions .fs-12,::ng-deep quml-sa .fs-12{font-size:.75rem}::ng-deep .quml-mcq .fs-13,::ng-deep .quml-sa .fs-13,::ng-deep .startpage__instr-desc .fs-13,::ng-deep quml-mcq-solutions .fs-13,::ng-deep quml-sa .fs-13{font-size:.813rem}::ng-deep .quml-mcq .fs-14,::ng-deep .quml-sa .fs-14,::ng-deep .startpage__instr-desc .fs-14,::ng-deep quml-mcq-solutions .fs-14,::ng-deep quml-sa .fs-14{font-size:.875rem}::ng-deep .quml-mcq .fs-15,::ng-deep .quml-sa .fs-15,::ng-deep .startpage__instr-desc .fs-15,::ng-deep quml-mcq-solutions .fs-15,::ng-deep quml-sa .fs-15{font-size:.938rem}::ng-deep .quml-mcq .fs-16,::ng-deep .quml-sa .fs-16,::ng-deep .startpage__instr-desc .fs-16,::ng-deep quml-mcq-solutions .fs-16,::ng-deep quml-sa .fs-16{font-size:1rem}::ng-deep .quml-mcq .fs-17,::ng-deep .quml-sa .fs-17,::ng-deep .startpage__instr-desc .fs-17,::ng-deep quml-mcq-solutions .fs-17,::ng-deep quml-sa .fs-17{font-size:1.063rem}::ng-deep .quml-mcq .fs-18,::ng-deep .quml-sa .fs-18,::ng-deep .startpage__instr-desc .fs-18,::ng-deep quml-mcq-solutions .fs-18,::ng-deep quml-sa .fs-18{font-size:1.125rem}::ng-deep .quml-mcq .fs-19,::ng-deep .quml-sa .fs-19,::ng-deep .startpage__instr-desc .fs-19,::ng-deep quml-mcq-solutions .fs-19,::ng-deep quml-sa .fs-19{font-size:1.188rem}::ng-deep .quml-mcq .fs-20,::ng-deep .quml-sa .fs-20,::ng-deep .startpage__instr-desc .fs-20,::ng-deep quml-mcq-solutions .fs-20,::ng-deep quml-sa .fs-20{font-size:1.25rem}::ng-deep .quml-mcq .fs-21,::ng-deep .quml-sa .fs-21,::ng-deep .startpage__instr-desc .fs-21,::ng-deep quml-mcq-solutions .fs-21,::ng-deep quml-sa .fs-21{font-size:1.313rem}::ng-deep .quml-mcq .fs-22,::ng-deep .quml-sa .fs-22,::ng-deep .startpage__instr-desc .fs-22,::ng-deep quml-mcq-solutions .fs-22,::ng-deep quml-sa .fs-22{font-size:1.375rem}::ng-deep .quml-mcq .fs-23,::ng-deep .quml-sa .fs-23,::ng-deep .startpage__instr-desc .fs-23,::ng-deep quml-mcq-solutions .fs-23,::ng-deep quml-sa .fs-23{font-size:1.438rem}::ng-deep .quml-mcq .fs-24,::ng-deep .quml-sa .fs-24,::ng-deep .startpage__instr-desc .fs-24,::ng-deep quml-mcq-solutions .fs-24,::ng-deep quml-sa .fs-24{font-size:1.5rem}::ng-deep .quml-mcq .fs-25,::ng-deep .quml-sa .fs-25,::ng-deep .startpage__instr-desc .fs-25,::ng-deep quml-mcq-solutions .fs-25,::ng-deep quml-sa .fs-25{font-size:1.563rem}::ng-deep .quml-mcq .fs-26,::ng-deep .quml-sa .fs-26,::ng-deep .startpage__instr-desc .fs-26,::ng-deep quml-mcq-solutions .fs-26,::ng-deep quml-sa .fs-26{font-size:1.625rem}::ng-deep .quml-mcq .fs-27,::ng-deep .quml-sa .fs-27,::ng-deep .startpage__instr-desc .fs-27,::ng-deep quml-mcq-solutions .fs-27,::ng-deep quml-sa .fs-27{font-size:1.688rem}::ng-deep .quml-mcq .fs-28,::ng-deep .quml-sa .fs-28,::ng-deep .startpage__instr-desc .fs-28,::ng-deep quml-mcq-solutions .fs-28,::ng-deep quml-sa .fs-28{font-size:1.75rem}::ng-deep .quml-mcq .fs-29,::ng-deep .quml-sa .fs-29,::ng-deep .startpage__instr-desc .fs-29,::ng-deep quml-mcq-solutions .fs-29,::ng-deep quml-sa .fs-29{font-size:1.813rem}::ng-deep .quml-mcq .fs-30,::ng-deep .quml-sa .fs-30,::ng-deep .startpage__instr-desc .fs-30,::ng-deep quml-mcq-solutions .fs-30,::ng-deep quml-sa .fs-30{font-size:1.875rem}::ng-deep .quml-mcq .fs-36,::ng-deep .quml-sa .fs-36,::ng-deep .startpage__instr-desc .fs-36,::ng-deep quml-mcq-solutions .fs-36,::ng-deep quml-sa .fs-36{font-size:2.25rem}::ng-deep .quml-mcq .text-left,::ng-deep .quml-sa .text-left,::ng-deep .startpage__instr-desc .text-left,::ng-deep quml-mcq-solutions .text-left,::ng-deep quml-sa .text-left{text-align:left}::ng-deep .quml-mcq .text-center,::ng-deep .quml-sa .text-center,::ng-deep .startpage__instr-desc .text-center,::ng-deep quml-mcq-solutions .text-center,::ng-deep quml-sa .text-center{text-align:center}::ng-deep .quml-mcq .text-right,::ng-deep .quml-sa .text-right,::ng-deep .startpage__instr-desc .text-right,::ng-deep quml-mcq-solutions .text-right,::ng-deep quml-sa .text-right{text-align:right}::ng-deep .quml-mcq .image-style-align-right,::ng-deep .quml-sa .image-style-align-right,::ng-deep .startpage__instr-desc .image-style-align-right,::ng-deep quml-mcq-solutions .image-style-align-right,::ng-deep quml-sa .image-style-align-right{float:right;text-align:right;margin-left:.5rem}::ng-deep .quml-mcq .image-style-align-left,::ng-deep .quml-sa .image-style-align-left,::ng-deep .startpage__instr-desc .image-style-align-left,::ng-deep quml-mcq-solutions .image-style-align-left,::ng-deep quml-sa .image-style-align-left{float:left;text-align:left;margin-right:.5rem}::ng-deep .quml-mcq .image,::ng-deep .quml-mcq figure.image,::ng-deep .quml-sa .image,::ng-deep .quml-sa figure.image,::ng-deep .startpage__instr-desc .image,::ng-deep .startpage__instr-desc figure.image,::ng-deep quml-mcq-solutions .image,::ng-deep quml-mcq-solutions figure.image,::ng-deep quml-sa .image,::ng-deep quml-sa figure.image{display:table;clear:both;text-align:center;margin:.5rem auto;position:relative}::ng-deep .quml-mcq figure.image,::ng-deep .quml-mcq figure.image.resize-original,::ng-deep .quml-sa figure.image,::ng-deep .quml-sa figure.image.resize-original,::ng-deep .startpage__instr-desc figure.image,::ng-deep .startpage__instr-desc figure.image.resize-original,::ng-deep quml-mcq-solutions figure.image,::ng-deep quml-mcq-solutions figure.image.resize-original,::ng-deep quml-sa figure.image,::ng-deep quml-sa figure.image.resize-original{width:auto;height:auto;overflow:visible}::ng-deep .quml-mcq figure.image img,::ng-deep .quml-sa figure.image img,::ng-deep .startpage__instr-desc figure.image img,::ng-deep quml-mcq-solutions figure.image img,::ng-deep quml-sa figure.image img{width:100%}::ng-deep .quml-mcq figure.image.resize-original img,::ng-deep .quml-sa figure.image.resize-original img,::ng-deep .startpage__instr-desc figure.image.resize-original img,::ng-deep quml-mcq-solutions figure.image.resize-original img,::ng-deep quml-sa figure.image.resize-original img{width:auto;height:auto}::ng-deep .quml-mcq .image img,::ng-deep .quml-sa .image img,::ng-deep .startpage__instr-desc .image img,::ng-deep quml-mcq-solutions .image img,::ng-deep quml-sa .image img{display:block;margin:0 auto;max-width:100%;min-width:50px}::ng-deep .quml-mcq figure.image.resize-25,::ng-deep .quml-sa figure.image.resize-25,::ng-deep .startpage__instr-desc figure.image.resize-25,::ng-deep quml-mcq-solutions figure.image.resize-25,::ng-deep quml-sa figure.image.resize-25{width:25%;height:auto}::ng-deep .quml-mcq figure.image.resize-50,::ng-deep .quml-sa figure.image.resize-50,::ng-deep .startpage__instr-desc figure.image.resize-50,::ng-deep quml-mcq-solutions figure.image.resize-50,::ng-deep quml-sa figure.image.resize-50{width:50%;height:auto}::ng-deep .quml-mcq figure.image.resize-75,::ng-deep .quml-sa figure.image.resize-75,::ng-deep .startpage__instr-desc figure.image.resize-75,::ng-deep quml-mcq-solutions figure.image.resize-75,::ng-deep quml-sa figure.image.resize-75{width:75%;height:auto}::ng-deep .quml-mcq figure.image.resize-100,::ng-deep .quml-sa figure.image.resize-100,::ng-deep .startpage__instr-desc figure.image.resize-100,::ng-deep quml-mcq-solutions figure.image.resize-100,::ng-deep quml-sa figure.image.resize-100{width:100%;height:auto}::ng-deep .quml-mcq .solution-options figure.image,::ng-deep .quml-sa .solution-options figure.image,::ng-deep .startpage__instr-desc .solution-options figure.image,::ng-deep quml-mcq-solutions .solution-options figure.image,::ng-deep quml-sa .solution-options figure.image{width:7.5rem!important;height:7.5rem!important}::ng-deep .quml-mcq figure.table table,::ng-deep .quml-sa figure.table table,::ng-deep .startpage__instr-desc figure.table table,::ng-deep quml-mcq-solutions figure.table table,::ng-deep quml-sa figure.table table{border-right:.0625rem solid var(--gray-100)}::ng-deep .quml-mcq figure.table table,::ng-deep .quml-mcq figure.table table tr td,::ng-deep .quml-mcq figure.table table tr th,::ng-deep .quml-sa figure.table table,::ng-deep .quml-sa figure.table table tr td,::ng-deep .quml-sa figure.table table tr th,::ng-deep .startpage__instr-desc figure.table table,::ng-deep .startpage__instr-desc figure.table table tr td,::ng-deep .startpage__instr-desc figure.table table tr th,::ng-deep quml-mcq-solutions figure.table table,::ng-deep quml-mcq-solutions figure.table table tr td,::ng-deep quml-mcq-solutions figure.table table tr th,::ng-deep quml-sa figure.table table,::ng-deep quml-sa figure.table table tr td,::ng-deep quml-sa figure.table table tr th{border:.0625rem solid var(--black);border-collapse:collapse}::ng-deep .quml-mcq figure.table table,::ng-deep .quml-sa figure.table table,::ng-deep .startpage__instr-desc figure.table table,::ng-deep quml-mcq-solutions figure.table table,::ng-deep quml-sa figure.table table{width:100%;background:var(--white);border:.0625rem solid var(--gray-100);box-shadow:none;border-radius:.25rem .25rem 0 0;text-align:left;color:var(--gray);border-collapse:separate;border-spacing:0;table-layout:fixed}::ng-deep .quml-mcq figure.table table thead tr th,::ng-deep .quml-sa figure.table table thead tr th,::ng-deep .startpage__instr-desc figure.table table thead tr th,::ng-deep quml-mcq-solutions figure.table table thead tr th,::ng-deep quml-sa figure.table table thead tr th{border-right:.0625rem solid var(--gray-100);font-size:.875rem;padding:1rem;background-color:var(--primary-100);color:var(--gray);position:relative;height:2.5rem;border:0;border-bottom:.0625rem solid var(--gray-100);border-right:.0625rem solid var(--gray-100);font-weight:700;color:var(--primary-color);text-transform:uppercase}::ng-deep .quml-mcq figure.table table thead tr th:first-child,::ng-deep .quml-sa figure.table table thead tr th:first-child,::ng-deep .startpage__instr-desc figure.table table thead tr th:first-child,::ng-deep quml-mcq-solutions figure.table table thead tr th:first-child,::ng-deep quml-sa figure.table table thead tr th:first-child{border-top-left-radius:.25rem}::ng-deep .quml-mcq figure.table table thead tr th:last-child,::ng-deep .quml-sa figure.table table thead tr th:last-child,::ng-deep .startpage__instr-desc figure.table table thead tr th:last-child,::ng-deep quml-mcq-solutions figure.table table thead tr th:last-child,::ng-deep quml-sa figure.table table thead tr th:last-child{border-top-right-radius:.25rem;border-right:0 solid var(--gray-100)}::ng-deep .quml-mcq figure.table table tbody tr:nth-child(2n),::ng-deep .quml-sa figure.table table tbody tr:nth-child(2n),::ng-deep .startpage__instr-desc figure.table table tbody tr:nth-child(2n),::ng-deep quml-mcq-solutions figure.table table tbody tr:nth-child(2n),::ng-deep quml-sa figure.table table tbody tr:nth-child(2n){background-color:var(--gray-0)}::ng-deep .quml-mcq figure.table table tbody tr:hover,::ng-deep .quml-sa figure.table table tbody tr:hover,::ng-deep .startpage__instr-desc figure.table table tbody tr:hover,::ng-deep quml-mcq-solutions figure.table table tbody tr:hover,::ng-deep quml-sa figure.table table tbody tr:hover{background:var(--primary-0);color:rgba(var(--rc-rgba-gray),.95);cursor:pointer}::ng-deep .quml-mcq figure.table table tbody tr td,::ng-deep .quml-sa figure.table table tbody tr td,::ng-deep .startpage__instr-desc figure.table table tbody tr td,::ng-deep quml-mcq-solutions figure.table table tbody tr td,::ng-deep quml-sa figure.table table tbody tr td{font-size:.875rem;padding:1rem;color:var(--gray);height:3.5rem;border:0;border-bottom:.0625rem solid var(--gray-100);border-right:.0625rem solid var(--gray-100);word-break:break-word;line-height:normal}::ng-deep .quml-mcq figure.table table tbody tr td:last-child,::ng-deep .quml-sa figure.table table tbody tr td:last-child,::ng-deep .startpage__instr-desc figure.table table tbody tr td:last-child,::ng-deep quml-mcq-solutions figure.table table tbody tr td:last-child,::ng-deep quml-sa figure.table table tbody tr td:last-child{border-right:0 solid var(--gray-100)}::ng-deep .quml-mcq figure.table table tbody tr td p,::ng-deep .quml-sa figure.table table tbody tr td p,::ng-deep .startpage__instr-desc figure.table table tbody tr td p,::ng-deep quml-mcq-solutions figure.table table tbody tr td p,::ng-deep quml-sa figure.table table tbody tr td p{margin-bottom:0!important}::ng-deep .quml-mcq figure.table table tbody tr:last-child td,::ng-deep .quml-sa figure.table table tbody tr:last-child td,::ng-deep .startpage__instr-desc figure.table table tbody tr:last-child td,::ng-deep quml-mcq-solutions figure.table table tbody tr:last-child td,::ng-deep quml-sa figure.table table tbody tr:last-child td{border-bottom:none}::ng-deep .quml-mcq figure.table table tbody tr:last-child td:first-child,::ng-deep .quml-sa figure.table table tbody tr:last-child td:first-child,::ng-deep .startpage__instr-desc figure.table table tbody tr:last-child td:first-child,::ng-deep quml-mcq-solutions figure.table table tbody tr:last-child td:first-child,::ng-deep quml-sa figure.table table tbody tr:last-child td:first-child{border-bottom-left-radius:.25rem}::ng-deep .quml-mcq figure.table table tbody tr:last-child td:last-child,::ng-deep .quml-sa figure.table table tbody tr:last-child td:last-child,::ng-deep .startpage__instr-desc figure.table table tbody tr:last-child td:last-child,::ng-deep quml-mcq-solutions figure.table table tbody tr:last-child td:last-child,::ng-deep quml-sa figure.table table tbody tr:last-child td:last-child{border-bottom-right-radius:.25rem}::ng-deep .quml-mcq ol,::ng-deep .quml-mcq ul,::ng-deep .quml-sa ol,::ng-deep .quml-sa ul,::ng-deep .startpage__instr-desc ol,::ng-deep .startpage__instr-desc ul,::ng-deep quml-mcq-solutions ol,::ng-deep quml-mcq-solutions ul,::ng-deep quml-sa ol,::ng-deep quml-sa ul{margin-top:.5rem}::ng-deep .quml-mcq ol li,::ng-deep .quml-mcq ul li,::ng-deep .quml-sa ol li,::ng-deep .quml-sa ul li,::ng-deep .startpage__instr-desc ol li,::ng-deep .startpage__instr-desc ul li,::ng-deep quml-mcq-solutions ol li,::ng-deep quml-mcq-solutions ul li,::ng-deep quml-sa ol li,::ng-deep quml-sa ul li{margin:.5rem;font-weight:400;line-height:normal}::ng-deep .quml-mcq ul,::ng-deep .quml-sa ul,::ng-deep .startpage__instr-desc ul,::ng-deep quml-mcq-solutions ul,::ng-deep quml-sa ul{list-style-type:disc}::ng-deep .quml-mcq h1,::ng-deep .quml-mcq h2,::ng-deep .quml-mcq h3,::ng-deep .quml-mcq h4,::ng-deep .quml-mcq h5,::ng-deep .quml-mcq h6,::ng-deep .quml-sa h1,::ng-deep .quml-sa h2,::ng-deep .quml-sa h3,::ng-deep .quml-sa h4,::ng-deep .quml-sa h5,::ng-deep .quml-sa h6,::ng-deep .startpage__instr-desc h1,::ng-deep .startpage__instr-desc h2,::ng-deep .startpage__instr-desc h3,::ng-deep .startpage__instr-desc h4,::ng-deep .startpage__instr-desc h5,::ng-deep .startpage__instr-desc h6,::ng-deep quml-mcq-solutions h1,::ng-deep quml-mcq-solutions h2,::ng-deep quml-mcq-solutions h3,::ng-deep quml-mcq-solutions h4,::ng-deep quml-mcq-solutions h5,::ng-deep quml-mcq-solutions h6,::ng-deep quml-sa h1,::ng-deep quml-sa h2,::ng-deep quml-sa h3,::ng-deep quml-sa h4,::ng-deep quml-sa h5,::ng-deep quml-sa h6{color:var(--primary-color);line-height:normal;margin-bottom:1rem}::ng-deep .quml-mcq p,::ng-deep .quml-mcq span,::ng-deep .quml-sa p,::ng-deep .quml-sa span,::ng-deep .startpage__instr-desc p,::ng-deep .startpage__instr-desc span,::ng-deep quml-mcq-solutions p,::ng-deep quml-mcq-solutions span,::ng-deep quml-sa p,::ng-deep quml-sa span{color:var(--quml-mcq-title-txt)}::ng-deep .quml-mcq p span strong,::ng-deep .quml-mcq p strong,::ng-deep .quml-sa p span strong,::ng-deep .quml-sa p strong,::ng-deep .startpage__instr-desc p span strong,::ng-deep .startpage__instr-desc p strong,::ng-deep quml-mcq-solutions p span strong,::ng-deep quml-mcq-solutions p strong,::ng-deep quml-sa p span strong,::ng-deep quml-sa p strong{font-weight:700}::ng-deep .quml-mcq p span u,::ng-deep .quml-mcq p u,::ng-deep .quml-sa p span u,::ng-deep .quml-sa p u,::ng-deep .startpage__instr-desc p span u,::ng-deep .startpage__instr-desc p u,::ng-deep quml-mcq-solutions p span u,::ng-deep quml-mcq-solutions p u,::ng-deep quml-sa p span u,::ng-deep quml-sa p u{text-decoration:underline}::ng-deep .quml-mcq p i,::ng-deep .quml-mcq p span i,::ng-deep .quml-sa p i,::ng-deep .quml-sa p span i,::ng-deep .startpage__instr-desc p i,::ng-deep .startpage__instr-desc p span i,::ng-deep quml-mcq-solutions p i,::ng-deep quml-mcq-solutions p span i,::ng-deep quml-sa p i,::ng-deep quml-sa p span i{font-style:italic}::ng-deep .quml-mcq p,::ng-deep .quml-sa p,::ng-deep .startpage__instr-desc p,::ng-deep quml-mcq-solutions p,::ng-deep quml-sa p{line-height:normal}"]
            }] }
];
/** @nocollapse */
SectionPlayerComponent.ctorParameters = () => [
    { type: ViewerService },
    { type: UtilService },
    { type: QuestionCursor },
    { type: ChangeDetectorRef },
    { type: ErrorService }
];
SectionPlayerComponent.propDecorators = {
    sectionConfig: [{ type: Input }],
    attempts: [{ type: Input }],
    isFirstSection: [{ type: Input }],
    jumpToQuestion: [{ type: Input }],
    mainProgressBar: [{ type: Input }],
    sectionIndex: [{ type: Input }],
    parentConfig: [{ type: Input }],
    playerEvent: [{ type: Output }],
    telemetryEvent: [{ type: Output }],
    sectionEnd: [{ type: Output }],
    score: [{ type: Output }],
    summary: [{ type: Output }],
    showScoreBoard: [{ type: Output }],
    myCarousel: [{ type: ViewChild, args: ['myCarousel', { static: false },] }],
    imageModal: [{ type: ViewChild, args: ['imageModal', { static: true },] }],
    questionSlide: [{ type: ViewChild, args: ['questionSlide', { static: false },] }],
    ngOnDestroy: [{ type: HostListener, args: ['window:beforeunload',] }]
};
if (false) {
    /** @type {?} */
    SectionPlayerComponent.prototype.sectionConfig;
    /** @type {?} */
    SectionPlayerComponent.prototype.attempts;
    /** @type {?} */
    SectionPlayerComponent.prototype.isFirstSection;
    /** @type {?} */
    SectionPlayerComponent.prototype.jumpToQuestion;
    /** @type {?} */
    SectionPlayerComponent.prototype.mainProgressBar;
    /** @type {?} */
    SectionPlayerComponent.prototype.sectionIndex;
    /** @type {?} */
    SectionPlayerComponent.prototype.parentConfig;
    /** @type {?} */
    SectionPlayerComponent.prototype.playerEvent;
    /** @type {?} */
    SectionPlayerComponent.prototype.telemetryEvent;
    /** @type {?} */
    SectionPlayerComponent.prototype.sectionEnd;
    /** @type {?} */
    SectionPlayerComponent.prototype.score;
    /** @type {?} */
    SectionPlayerComponent.prototype.summary;
    /** @type {?} */
    SectionPlayerComponent.prototype.showScoreBoard;
    /** @type {?} */
    SectionPlayerComponent.prototype.myCarousel;
    /** @type {?} */
    SectionPlayerComponent.prototype.imageModal;
    /** @type {?} */
    SectionPlayerComponent.prototype.questionSlide;
    /** @type {?} */
    SectionPlayerComponent.prototype.destroy$;
    /** @type {?} */
    SectionPlayerComponent.prototype.loadView;
    /** @type {?} */
    SectionPlayerComponent.prototype.showContentError;
    /** @type {?} */
    SectionPlayerComponent.prototype.noOfTimesApiCalled;
    /** @type {?} */
    SectionPlayerComponent.prototype.currentSlideIndex;
    /** @type {?} */
    SectionPlayerComponent.prototype.showStartPage;
    /** @type {?} */
    SectionPlayerComponent.prototype.sideMenuConfig;
    /** @type {?} */
    SectionPlayerComponent.prototype.threshold;
    /** @type {?} */
    SectionPlayerComponent.prototype.questions;
    /** @type {?} */
    SectionPlayerComponent.prototype.questionIds;
    /** @type {?} */
    SectionPlayerComponent.prototype.questionIdsCopy;
    /** @type {?} */
    SectionPlayerComponent.prototype.noOfQuestions;
    /** @type {?} */
    SectionPlayerComponent.prototype.initialTime;
    /** @type {?} */
    SectionPlayerComponent.prototype.timeLimit;
    /** @type {?} */
    SectionPlayerComponent.prototype.warningTime;
    /** @type {?} */
    SectionPlayerComponent.prototype.showTimer;
    /** @type {?} */
    SectionPlayerComponent.prototype.showFeedBack;
    /** @type {?} */
    SectionPlayerComponent.prototype.showUserSolution;
    /** @type {?} */
    SectionPlayerComponent.prototype.startPageInstruction;
    /** @type {?} */
    SectionPlayerComponent.prototype.maxScore;
    /** @type {?} */
    SectionPlayerComponent.prototype.points;
    /** @type {?} */
    SectionPlayerComponent.prototype.initializeTimer;
    /** @type {?} */
    SectionPlayerComponent.prototype.totalScore;
    /** @type {?} */
    SectionPlayerComponent.prototype.linearNavigation;
    /** @type {?} */
    SectionPlayerComponent.prototype.showHints;
    /** @type {?} */
    SectionPlayerComponent.prototype.allowSkip;
    /** @type {?} */
    SectionPlayerComponent.prototype.progressBarClass;
    /** @type {?} */
    SectionPlayerComponent.prototype.currentQuestionsMedia;
    /** @type {?} */
    SectionPlayerComponent.prototype.disableNext;
    /** @type {?} */
    SectionPlayerComponent.prototype.endPageReached;
    /** @type {?} */
    SectionPlayerComponent.prototype.tryAgainClicked;
    /** @type {?} */
    SectionPlayerComponent.prototype.currentOptionSelected;
    /** @type {?} */
    SectionPlayerComponent.prototype.carouselConfig;
    /** @type {?} */
    SectionPlayerComponent.prototype.active;
    /** @type {?} */
    SectionPlayerComponent.prototype.showAlert;
    /** @type {?} */
    SectionPlayerComponent.prototype.currentOptions;
    /** @type {?} */
    SectionPlayerComponent.prototype.currentQuestion;
    /** @type {?} */
    SectionPlayerComponent.prototype.media;
    /** @type {?} */
    SectionPlayerComponent.prototype.currentSolutions;
    /** @type {?} */
    SectionPlayerComponent.prototype.showSolution;
    /** @type {?} */
    SectionPlayerComponent.prototype.optionSelectedObj;
    /** @type {?} */
    SectionPlayerComponent.prototype.intervalRef;
    /** @type {?} */
    SectionPlayerComponent.prototype.alertType;
    /** @type {?} */
    SectionPlayerComponent.prototype.infoPopup;
    /** @type {?} */
    SectionPlayerComponent.prototype.outcomeLabel;
    /** @type {?} */
    SectionPlayerComponent.prototype.stopAutoNavigation;
    /** @type {?} */
    SectionPlayerComponent.prototype.jumpSlideIndex;
    /** @type {?} */
    SectionPlayerComponent.prototype.showQuestions;
    /** @type {?} */
    SectionPlayerComponent.prototype.showZoomModal;
    /** @type {?} */
    SectionPlayerComponent.prototype.zoomImgSrc;
    /** @type {?} */
    SectionPlayerComponent.prototype.imageZoomCount;
    /** @type {?} */
    SectionPlayerComponent.prototype.replayed;
    /** @type {?} */
    SectionPlayerComponent.prototype.sectionId;
    /** @type {?} */
    SectionPlayerComponent.prototype.showRootInstruction;
    /** @type {?} */
    SectionPlayerComponent.prototype.slideDuration;
    /** @type {?} */
    SectionPlayerComponent.prototype.initialSlideDuration;
    /** @type {?} */
    SectionPlayerComponent.prototype.disabledHandle;
    /** @type {?} */
    SectionPlayerComponent.prototype.subscription;
    /** @type {?} */
    SectionPlayerComponent.prototype.viewerService;
    /** @type {?} */
    SectionPlayerComponent.prototype.utilService;
    /** @type {?} */
    SectionPlayerComponent.prototype.questionCursor;
    /**
     * @type {?}
     * @private
     */
    SectionPlayerComponent.prototype.cdRef;
    /** @type {?} */
    SectionPlayerComponent.prototype.errorService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VjdGlvbi1wbGF5ZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHByb2plY3Qtc3VuYmlyZC9zdW5iaXJkLXF1bWwtcGxheWVyLXY5LyIsInNvdXJjZXMiOlsibGliL3NlY3Rpb24tcGxheWVyL3NlY3Rpb24tcGxheWVyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBaUIsaUJBQWlCLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFhLE1BQU0sRUFBRSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDN0ksT0FBTyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFFLE1BQU0sd0NBQXdDLENBQUM7QUFDL0YsT0FBTyxLQUFLLENBQUMsTUFBTSxXQUFXLENBQUM7QUFDL0IsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDM0QsT0FBTyxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQWdCLE1BQU0sTUFBTSxDQUFDO0FBQ3hELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUUzQyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFDakUsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDJDQUEyQyxDQUFDO0FBQzFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLGFBQWEsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQzFFLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUM5QyxPQUFPLFFBQVEsTUFBTSxnQ0FBZ0MsQ0FBQztBQVF0RCxNQUFNLE9BQU8sc0JBQXNCOzs7Ozs7OztJQXdGakMsWUFDUyxhQUE0QixFQUM1QixXQUF3QixFQUN4QixjQUE4QixFQUM3QixLQUF3QixFQUN6QixZQUEwQjtRQUoxQixrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUM1QixnQkFB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QUFtQjs7SUFDbkIsa0RBQTBCOztJQUMxQiwyQ0FBZTs7SUFDZiwyQ0FBbUI7O0lBQ25CLGtEQUFzQjs7SUFDdEIsdURBQTJCOztJQUMzQiw2Q0FBcUI7O0lBQ3JCLGdEQUF3Qjs7SUFDeEIsaURBQXdCOztJQUN4Qix1REFBOEI7O0lBQzlCLGdEQUdFOztJQUNGLHdDQUFlOztJQUNmLDJDQUFtQjs7SUFDbkIsZ0RBQW9COztJQUNwQixpREFBcUI7O0lBQ3JCLHVDQUFXOztJQUNYLGtEQUFzQjs7SUFDdEIsOENBQWtCOztJQUNsQixtREFBdUI7O0lBQ3ZCLDZDQUFpQjs7SUFDakIsMkNBQWtCOztJQUNsQiwyQ0FBbUI7O0lBQ25CLDhDQUFxQjs7SUFDckIsb0RBQTRCOztJQUM1QixnREFBb0I7O0lBQ3BCLCtDQUFzQjs7SUFDdEIsK0NBQXNCOztJQUN0Qiw0Q0FBbUI7O0lBQ25CLGdEQUFxQjs7SUFDckIsMENBQWlCOztJQUNqQiwyQ0FBa0I7O0lBQ2xCLHFEQUEyQjs7SUFDM0IsK0NBQWtCOztJQUNsQixzREFBNkI7O0lBQzdCLGdEQUFvQjs7SUFDcEIsOENBQTJCOztJQUV6QiwrQ0FBbUM7O0lBQ25DLDZDQUErQjs7SUFDL0IsZ0RBQXFDOzs7OztJQUNyQyx1Q0FBZ0M7O0lBQ2hDLDhDQUFpQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFmdGVyVmlld0luaXQsIENoYW5nZURldGVjdG9yUmVmLCBDb21wb25lbnQsIEV2ZW50RW1pdHRlciwgSG9zdExpc3RlbmVyLCBJbnB1dCwgT25DaGFuZ2VzLCBPdXRwdXQsIFZpZXdDaGlsZCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgZXJyb3JDb2RlLCBlcnJvck1lc3NhZ2UsIEVycm9yU2VydmljZSB9IGZyb20gJ0Bwcm9qZWN0LXN1bmJpcmQvc3VuYmlyZC1wbGF5ZXItc2RrLXY5JztcbmltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoLWVzJztcbmltcG9ydCB7IENhcm91c2VsQ29tcG9uZW50IH0gZnJvbSAnbmd4LWJvb3RzdHJhcC9jYXJvdXNlbCc7XG5pbXBvcnQgeyBmcm9tRXZlbnQsIFN1YmplY3QsIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgdGFrZVVudGlsIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgUXVtbFBsYXllckNvbmZpZywgSVBhcmVudENvbmZpZyB9IGZyb20gJy4uL3F1bWwtbGlicmFyeS1pbnRlcmZhY2UnO1xuaW1wb3J0IHsgUXVlc3Rpb25DdXJzb3IgfSBmcm9tICcuLi9xdW1sLXF1ZXN0aW9uLWN1cnNvci5zZXJ2aWNlJztcbmltcG9ydCB7IFZpZXdlclNlcnZpY2UgfSBmcm9tICcuLi9zZXJ2aWNlcy92aWV3ZXItc2VydmljZS92aWV3ZXItc2VydmljZSc7XG5pbXBvcnQgeyBldmVudE5hbWUsIHBhZ2VJZCwgVGVsZW1ldHJ5VHlwZSB9IGZyb20gJy4uL3RlbGVtZXRyeS1jb25zdGFudHMnO1xuaW1wb3J0IHsgVXRpbFNlcnZpY2UgfSBmcm9tICcuLi91dGlsLXNlcnZpY2UnO1xuaW1wb3J0IG1haW50YWluIGZyb20gJ2FsbHkuanMvZXNtL21haW50YWluL19tYWludGFpbic7XG5pbXBvcnQgeyBJU2lkZUJhckV2ZW50IH0gZnJvbSAnQHByb2plY3Qtc3VuYmlyZC9zdW5iaXJkLXBsYXllci1zZGstdjkvc3VuYmlyZC1wbGF5ZXItc2RrLmludGVyZmFjZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3F1bWwtc2VjdGlvbi1wbGF5ZXInLFxuICB0ZW1wbGF0ZVVybDogJy4vc2VjdGlvbi1wbGF5ZXIuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9zZWN0aW9uLXBsYXllci5jb21wb25lbnQuc2NzcycsICcuLy4uL3N0YXJ0cGFnZS9zYi1ja2VkaXRvci1zdHlsZXMuc2NzcyddXG59KVxuZXhwb3J0IGNsYXNzIFNlY3Rpb25QbGF5ZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkNoYW5nZXMsIEFmdGVyVmlld0luaXQge1xuXG4gIEBJbnB1dCgpIHNlY3Rpb25Db25maWc6IFF1bWxQbGF5ZXJDb25maWc7XG4gIEBJbnB1dCgpIGF0dGVtcHRzOiB7IG1heDogbnVtYmVyLCBjdXJyZW50OiBudW1iZXIgfTtcbiAgQElucHV0KCkgaXNGaXJzdFNlY3Rpb24gPSBmYWxzZTtcbiAgQElucHV0KCkganVtcFRvUXVlc3Rpb247XG4gIEBJbnB1dCgpIG1haW5Qcm9ncmVzc0JhcjtcbiAgQElucHV0KCkgc2VjdGlvbkluZGV4ID0gMDtcbiAgQElucHV0KCkgcGFyZW50Q29uZmlnOiBJUGFyZW50Q29uZmlnO1xuICBAT3V0cHV0KCkgcGxheWVyRXZlbnQgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgpIHRlbGVtZXRyeUV2ZW50ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBPdXRwdXQoKSBzZWN0aW9uRW5kID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBPdXRwdXQoKSBzY29yZSA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCkgc3VtbWFyeSA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCkgc2hvd1Njb3JlQm9hcmQgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBAVmlld0NoaWxkKCdteUNhcm91c2VsJywgeyBzdGF0aWM6IGZhbHNlIH0pIG15Q2Fyb3VzZWw6IENhcm91c2VsQ29tcG9uZW50O1xuICBAVmlld0NoaWxkKCdpbWFnZU1vZGFsJywgeyBzdGF0aWM6IHRydWUgfSkgaW1hZ2VNb2RhbDtcbiAgQFZpZXdDaGlsZCgncXVlc3Rpb25TbGlkZScsIHsgc3RhdGljOiBmYWxzZSB9KSBxdWVzdGlvblNsaWRlO1xuXG4gIGRlc3Ryb3kkOiBTdWJqZWN0PGJvb2xlYW4+ID0gbmV3IFN1YmplY3Q8Ym9vbGVhbj4oKTtcbiAgbG9hZFZpZXcgPSBmYWxzZTtcbiAgc2hvd0NvbnRlbnRFcnJvciA9IGZhbHNlO1xuICBub09mVGltZXNBcGlDYWxsZWQgPSAwO1xuICBjdXJyZW50U2xpZGVJbmRleCA9IDA7XG4gIHNob3dTdGFydFBhZ2UgPSB0cnVlO1xuICBzaWRlTWVudUNvbmZpZyA9IHtcbiAgICBlbmFibGU6IHRydWUsXG4gICAgc2hvd1NoYXJlOiB0cnVlLFxuICAgIHNob3dEb3dubG9hZDogdHJ1ZSxcbiAgICBzaG93UmVwbGF5OiBmYWxzZSxcbiAgICBzaG93RXhpdDogdHJ1ZSxcbiAgfTtcbiAgdGhyZXNob2xkOiBudW1iZXI7XG4gIHF1ZXN0aW9ucyA9IFtdO1xuICBxdWVzdGlvbklkczogc3RyaW5nW107XG4gIHF1ZXN0aW9uSWRzQ29weTogc3RyaW5nW107XG4gIG5vT2ZRdWVzdGlvbnM6IG51bWJlcjtcbiAgaW5pdGlhbFRpbWU6IG51bWJlcjtcbiAgdGltZUxpbWl0OiBhbnk7XG4gIHdhcm5pbmdUaW1lOiBudW1iZXI7XG4gIHNob3dUaW1lcjogYW55O1xuICBzaG93RmVlZEJhY2s6IGJvb2xlYW47XG4gIHNob3dVc2VyU29sdXRpb246IGJvb2xlYW47XG4gIHN0YXJ0UGFnZUluc3RydWN0aW9uOiBzdHJpbmc7XG4gIG1heFNjb3JlOiBudW1iZXI7XG4gIHBvaW50czogbnVtYmVyO1xuICBpbml0aWFsaXplVGltZXI6IGJvb2xlYW47XG5cbiAgdG90YWxTY29yZTogbnVtYmVyO1xuICBsaW5lYXJOYXZpZ2F0aW9uOiBib29sZWFuO1xuICBzaG93SGludHM6IGFueTtcbiAgYWxsb3dTa2lwOiBib29sZWFuO1xuICBwcm9ncmVzc0JhckNsYXNzID0gW107XG4gIGN1cnJlbnRRdWVzdGlvbnNNZWRpYTogYW55O1xuICBkaXNhYmxlTmV4dDogYm9vbGVhbjtcbiAgZW5kUGFnZVJlYWNoZWQ6IGJvb2xlYW47XG4gIHRyeUFnYWluQ2xpY2tlZCA9IGZhbHNlO1xuICBjdXJyZW50T3B0aW9uU2VsZWN0ZWQ6IHN0cmluZztcbiAgY2Fyb3VzZWxDb25maWcgPSB7XG4gICAgTkVYVDogMSxcbiAgICBQUkVWOiAyXG4gIH07XG4gIGFjdGl2ZSA9IGZhbHNlO1xuICBzaG93QWxlcnQ6IGJvb2xlYW47XG4gIGN1cnJlbnRPcHRpb25zOiBhbnk7XG4gIGN1cnJlbnRRdWVzdGlvbjogYW55O1xuICBtZWRpYTogYW55O1xuICBjdXJyZW50U29sdXRpb25zOiBhbnk7XG4gIHNob3dTb2x1dGlvbjogYW55O1xuICBvcHRpb25TZWxlY3RlZE9iajogYW55O1xuICBpbnRlcnZhbFJlZjogYW55O1xuICBhbGVydFR5cGU6IHN0cmluZztcbiAgaW5mb1BvcHVwOiBib29sZWFuO1xuICBvdXRjb21lTGFiZWw6IHN0cmluZztcbiAgc3RvcEF1dG9OYXZpZ2F0aW9uOiBib29sZWFuO1xuICBqdW1wU2xpZGVJbmRleDogYW55O1xuICBzaG93UXVlc3Rpb25zID0gZmFsc2U7XG4gIHNob3dab29tTW9kYWwgPSBmYWxzZTtcbiAgem9vbUltZ1NyYzogc3RyaW5nO1xuICBpbWFnZVpvb21Db3VudCA9IDEwMDtcbiAgcmVwbGF5ZWQgPSBmYWxzZTtcbiAgc2VjdGlvbklkOiBzdHJpbmc7XG4gIHNob3dSb290SW5zdHJ1Y3Rpb24gPSB0cnVlO1xuICBzbGlkZUR1cmF0aW9uID0gMDtcbiAgaW5pdGlhbFNsaWRlRHVyYXRpb246IG51bWJlcjtcbiAgZGlzYWJsZWRIYW5kbGU6IGFueTtcbiAgc3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyB2aWV3ZXJTZXJ2aWNlOiBWaWV3ZXJTZXJ2aWNlLFxuICAgIHB1YmxpYyB1dGlsU2VydmljZTogVXRpbFNlcnZpY2UsXG4gICAgcHVibGljIHF1ZXN0aW9uQ3Vyc29yOiBRdWVzdGlvbkN1cnNvcixcbiAgICBwcml2YXRlIGNkUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBwdWJsaWMgZXJyb3JTZXJ2aWNlOiBFcnJvclNlcnZpY2VcbiAgKSB7IH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzKTogdm9pZCB7XG4gICAgdGhpcy5zdWJzY3JpYmVUb0V2ZW50cygpO1xuICAgIHRoaXMuc2V0Q29uZmlnKCk7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgdGhpcy52aWV3ZXJTZXJ2aWNlLnJhaXNlU3RhcnRFdmVudCgwKTtcbiAgICB0aGlzLnZpZXdlclNlcnZpY2UucmFpc2VIZWFydEJlYXRFdmVudChldmVudE5hbWUuc3RhcnRQYWdlTG9hZGVkLCAnaW1wcmVzc2lvbicsIDApO1xuICB9XG5cbiAgcHJpdmF0ZSBzdWJzY3JpYmVUb0V2ZW50cygpOiB2b2lkIHtcbiAgICB0aGlzLnZpZXdlclNlcnZpY2UucXVtbFBsYXllckV2ZW50LmFzT2JzZXJ2YWJsZSgpXG4gICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5kZXN0cm95JCkpXG4gICAgICAuc3Vic2NyaWJlKChyZXMpID0+IHtcbiAgICAgICAgdGhpcy5wbGF5ZXJFdmVudC5lbWl0KHJlcyk7XG4gICAgICB9KTtcblxuICAgIHRoaXMudmlld2VyU2VydmljZS5xdW1sUXVlc3Rpb25FdmVudFxuICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveSQpKVxuICAgICAgLnN1YnNjcmliZSgocmVzKSA9PiB7XG5cbiAgICAgICAgaWYgKHJlcz8uZXJyb3IpIHtcbiAgICAgICAgICBjb25zdCB7IHRyYWNlSWQgfSA9IHRoaXMuc2VjdGlvbkNvbmZpZz8uY29uZmlnO1xuICAgICAgICAgIGlmIChuYXZpZ2F0b3Iub25MaW5lICYmIHRoaXMudmlld2VyU2VydmljZS5pc0F2YWlsYWJsZUxvY2FsbHkpIHtcbiAgICAgICAgICAgIHRoaXMudmlld2VyU2VydmljZS5yYWlzZUV4Y2VwdGlvbkxvZyhlcnJvckNvZGUuY29udGVudExvYWRGYWlscywgZXJyb3JNZXNzYWdlLmNvbnRlbnRMb2FkRmFpbHMsXG4gICAgICAgICAgICAgIG5ldyBFcnJvcihlcnJvck1lc3NhZ2UuY29udGVudExvYWRGYWlscyksIHRyYWNlSWQpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnZpZXdlclNlcnZpY2UucmFpc2VFeGNlcHRpb25Mb2coZXJyb3JDb2RlLmludGVybmV0Q29ubmVjdGl2aXR5LCBlcnJvck1lc3NhZ2UuaW50ZXJuZXRDb25uZWN0aXZpdHksXG4gICAgICAgICAgICAgIG5ldyBFcnJvcihlcnJvck1lc3NhZ2UuaW50ZXJuZXRDb25uZWN0aXZpdHkpLCB0cmFjZUlkKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5zaG93Q29udGVudEVycm9yID0gdHJ1ZTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXJlcz8ucXVlc3Rpb25zKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHVuQ29tbW9uUXVlc3Rpb25zID0gXy54b3JCeSh0aGlzLnF1ZXN0aW9ucywgcmVzLnF1ZXN0aW9ucywgJ2lkZW50aWZpZXInKTtcbiAgICAgICAgdGhpcy5xdWVzdGlvbnMgPSBfLnVuaXFCeSh0aGlzLnF1ZXN0aW9ucy5jb25jYXQodW5Db21tb25RdWVzdGlvbnMpLCAnaWRlbnRpZmllcicpO1xuICAgICAgICB0aGlzLnNvcnRRdWVzdGlvbnMoKTtcbiAgICAgICAgdGhpcy52aWV3ZXJTZXJ2aWNlLnVwZGF0ZVNlY3Rpb25RdWVzdGlvbnModGhpcy5zZWN0aW9uQ29uZmlnLm1ldGFkYXRhLmlkZW50aWZpZXIsIHRoaXMucXVlc3Rpb25zKTtcbiAgICAgICAgdGhpcy5jZFJlZi5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICAgIHRoaXMubm9PZlRpbWVzQXBpQ2FsbGVkKys7XG4gICAgICAgIHRoaXMubG9hZFZpZXcgPSB0cnVlO1xuICAgICAgICBpZiAodGhpcy5jdXJyZW50U2xpZGVJbmRleCA+IDAgJiYgdGhpcy5teUNhcm91c2VsKSB7XG4gICAgICAgICAgdGhpcy5teUNhcm91c2VsLnNlbGVjdFNsaWRlKHRoaXMuY3VycmVudFNsaWRlSW5kZXgpO1xuICAgICAgICAgIGlmICh0aGlzLnF1ZXN0aW9uc1t0aGlzLmN1cnJlbnRTbGlkZUluZGV4IC0gMV0pIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFF1ZXN0aW9uc01lZGlhID0gdGhpcy5xdWVzdGlvbnNbdGhpcy5jdXJyZW50U2xpZGVJbmRleCAtIDFdPy5tZWRpYTtcbiAgICAgICAgICAgIHRoaXMuc2V0SW1hZ2Vab29tKCk7XG4gICAgICAgICAgICB0aGlzLmhpZ2hsaWdodFF1ZXN0aW9uKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFNsaWRlSW5kZXggPT09IDApIHtcbiAgICAgICAgICBpZiAodGhpcy5zaG93U3RhcnRQYWdlKSB7XG4gICAgICAgICAgICB0aGlzLmFjdGl2ZSA9IHRoaXMuc2VjdGlvbkluZGV4ID09PSAwO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHsgdGhpcy5uZXh0U2xpZGUoKTsgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKCk7XG4gICAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgc2V0Q29uZmlnKCkge1xuICAgIHRoaXMubm9PZlRpbWVzQXBpQ2FsbGVkID0gMDtcbiAgICB0aGlzLmN1cnJlbnRTbGlkZUluZGV4ID0gMDtcbiAgICB0aGlzLmFjdGl2ZSA9IHRoaXMuY3VycmVudFNsaWRlSW5kZXggPT09IDAgJiYgdGhpcy5zZWN0aW9uSW5kZXggPT09IDAgJiYgdGhpcy5zaG93U3RhcnRQYWdlO1xuXG4gICAgaWYgKHRoaXMubXlDYXJvdXNlbCkge1xuICAgICAgdGhpcy5teUNhcm91c2VsLnNlbGVjdFNsaWRlKHRoaXMuY3VycmVudFNsaWRlSW5kZXgpO1xuICAgIH1cbiAgICB0aGlzLnNpZGVNZW51Q29uZmlnID0geyAuLi50aGlzLnNpZGVNZW51Q29uZmlnLCAuLi50aGlzLnNlY3Rpb25Db25maWc/LmNvbmZpZz8uc2lkZU1lbnUgfTtcbiAgICB0aGlzLnRocmVzaG9sZCA9IHRoaXMuc2VjdGlvbkNvbmZpZy5jb250ZXh0Py50aHJlc2hvbGQgfHwgMztcbiAgICB0aGlzLnF1ZXN0aW9uSWRzID0gXy5jbG9uZURlZXAodGhpcy5zZWN0aW9uQ29uZmlnLm1ldGFkYXRhLmNoaWxkTm9kZXMpO1xuXG4gICAgaWYgKHRoaXMucGFyZW50Q29uZmlnLmlzUmVwbGF5ZWQpIHtcbiAgICAgIHRoaXMucmVwbGF5ZWQgPSB0cnVlO1xuICAgICAgdGhpcy5pbml0aWFsaXplVGltZXIgPSB0cnVlO1xuICAgICAgdGhpcy52aWV3ZXJTZXJ2aWNlLnJhaXNlU3RhcnRFdmVudCgwKTtcbiAgICAgIHRoaXMudmlld2VyU2VydmljZS5yYWlzZUhlYXJ0QmVhdEV2ZW50KGV2ZW50TmFtZS5zdGFydFBhZ2VMb2FkZWQsICdpbXByZXNzaW9uJywgMCk7XG4gICAgICB0aGlzLmRpc2FibGVOZXh0ID0gZmFsc2U7XG4gICAgICB0aGlzLmN1cnJlbnRTbGlkZUluZGV4ID0gMTtcbiAgICAgIHRoaXMubXlDYXJvdXNlbC5zZWxlY3RTbGlkZSgxKTtcbiAgICAgIHRoaXMuY3VycmVudFF1ZXN0aW9uc01lZGlhID0gXy5nZXQodGhpcy5xdWVzdGlvbnNbMF0sICdtZWRpYScpO1xuICAgICAgdGhpcy5zZXRJbWFnZVpvb20oKTtcbiAgICAgIHRoaXMubG9hZFZpZXcgPSB0cnVlO1xuICAgICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGUoKTtcblxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGNvbnN0IG1lbnVCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjb3ZlcmxheS1idXR0b24nKSBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgaWYgKG1lbnVCdG4pIHtcbiAgICAgICAgICBtZW51QnRuLmZvY3VzKCk7XG4gICAgICAgIH1cbiAgICAgIH0sIDEwMCk7XG4gICAgfVxuXG4gICAgdGhpcy5xdWVzdGlvbklkc0NvcHkgPSBfLmNsb25lRGVlcCh0aGlzLnNlY3Rpb25Db25maWcubWV0YWRhdGEuY2hpbGROb2Rlcyk7XG4gICAgY29uc3QgbWF4UXVlc3Rpb25zID0gdGhpcy5zZWN0aW9uQ29uZmlnLm1ldGFkYXRhLm1heFF1ZXN0aW9ucztcbiAgICBpZiAobWF4UXVlc3Rpb25zKSB7XG4gICAgICB0aGlzLnF1ZXN0aW9uSWRzID0gdGhpcy5xdWVzdGlvbklkcy5zbGljZSgwLCBtYXhRdWVzdGlvbnMpO1xuICAgICAgdGhpcy5xdWVzdGlvbklkc0NvcHkgPSB0aGlzLnF1ZXN0aW9uSWRzQ29weS5zbGljZSgwLCBtYXhRdWVzdGlvbnMpO1xuICAgIH1cblxuICAgIHRoaXMubm9PZlF1ZXN0aW9ucyA9IHRoaXMucXVlc3Rpb25JZHMubGVuZ3RoO1xuICAgIHRoaXMudmlld2VyU2VydmljZS5pbml0aWFsaXplKHRoaXMuc2VjdGlvbkNvbmZpZywgdGhpcy50aHJlc2hvbGQsIHRoaXMucXVlc3Rpb25JZHMsIHRoaXMucGFyZW50Q29uZmlnKTtcbiAgICB0aGlzLmNoZWNrQ29tcGF0aWJpbGl0eUxldmVsKHRoaXMuc2VjdGlvbkNvbmZpZy5tZXRhZGF0YS5jb21wYXRpYmlsaXR5TGV2ZWwpO1xuICAgIHRoaXMuaW5pdGlhbFRpbWUgPSB0aGlzLmluaXRpYWxTbGlkZUR1cmF0aW9uID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgdGhpcy50aW1lTGltaXQgPSB0aGlzLnNlY3Rpb25Db25maWcubWV0YWRhdGE/LnRpbWVMaW1pdHM/Lm1heFRpbWUgfHwgMDtcbiAgICB0aGlzLndhcm5pbmdUaW1lID0gdGhpcy5zZWN0aW9uQ29uZmlnLm1ldGFkYXRhPy50aW1lTGltaXRzPy53YXJuaW5nVGltZSB8fCAwO1xuICAgIHRoaXMuc2hvd1RpbWVyID0gdGhpcy5zZWN0aW9uQ29uZmlnLm1ldGFkYXRhPy5zaG93VGltZXI/LnRvTG93ZXJDYXNlKCkgIT09ICdubyc7XG4gICAgdGhpcy5zaG93RmVlZEJhY2sgPSB0aGlzLnNlY3Rpb25Db25maWcubWV0YWRhdGE/LnNob3dGZWVkYmFjaz8udG9Mb3dlckNhc2UoKSAhPT0gJ25vJztcbiAgICB0aGlzLnNob3dVc2VyU29sdXRpb24gPSB0aGlzLnNlY3Rpb25Db25maWcubWV0YWRhdGE/LnNob3dTb2x1dGlvbnM/LnRvTG93ZXJDYXNlKCkgIT09ICdubyc7XG4gICAgdGhpcy5zdGFydFBhZ2VJbnN0cnVjdGlvbiA9IHRoaXMuc2VjdGlvbkNvbmZpZy5tZXRhZGF0YT8uaW5zdHJ1Y3Rpb25zPy5kZWZhdWx0IHx8IHRoaXMucGFyZW50Q29uZmlnLmluc3RydWN0aW9ucztcbiAgICB0aGlzLmxpbmVhck5hdmlnYXRpb24gPSB0aGlzLnNlY3Rpb25Db25maWcubWV0YWRhdGEubmF2aWdhdGlvbk1vZGUgPT09ICdub24tbGluZWFyJyA/IGZhbHNlIDogdHJ1ZTtcbiAgICB0aGlzLnNob3dIaW50cyA9IHRoaXMuc2VjdGlvbkNvbmZpZy5tZXRhZGF0YT8uc2hvd0hpbnRzPy50b0xvd2VyQ2FzZSgpICE9PSAnbm8nO1xuICAgIHRoaXMucG9pbnRzID0gdGhpcy5zZWN0aW9uQ29uZmlnLm1ldGFkYXRhPy5wb2ludHM7XG5cbiAgICB0aGlzLmFsbG93U2tpcCA9IHRoaXMuc2VjdGlvbkNvbmZpZy5tZXRhZGF0YT8uYWxsb3dTa2lwPy50b0xvd2VyQ2FzZSgpICE9PSAnbm8nO1xuICAgIHRoaXMuc2hvd1N0YXJ0UGFnZSA9IHRoaXMuc2VjdGlvbkNvbmZpZy5tZXRhZGF0YT8uc2hvd1N0YXJ0UGFnZT8udG9Mb3dlckNhc2UoKSAhPT0gJ25vJztcbiAgICB0aGlzLnRvdGFsU2NvcmUgPSB0aGlzLnNlY3Rpb25Db25maWcubWV0YWRhdGE/Lm1heFNjb3JlO1xuICAgIHRoaXMucHJvZ3Jlc3NCYXJDbGFzcyA9IHRoaXMucGFyZW50Q29uZmlnLmlzU2VjdGlvbnNBdmFpbGFibGUgPyB0aGlzLm1haW5Qcm9ncmVzc0Jhci5maW5kKGl0ZW0gPT4gaXRlbS5pc0FjdGl2ZSk/LmNoaWxkcmVuIDpcbiAgICAgIHRoaXMubWFpblByb2dyZXNzQmFyO1xuXG4gICAgdGhpcy5xdWVzdGlvbnMgPSB0aGlzLnZpZXdlclNlcnZpY2UuZ2V0U2VjdGlvblF1ZXN0aW9ucyh0aGlzLnNlY3Rpb25Db25maWcubWV0YWRhdGEuaWRlbnRpZmllcik7XG4gICAgdGhpcy5zb3J0UXVlc3Rpb25zKCk7XG4gICAgdGhpcy52aWV3ZXJTZXJ2aWNlLnVwZGF0ZVNlY3Rpb25RdWVzdGlvbnModGhpcy5zZWN0aW9uQ29uZmlnLm1ldGFkYXRhLmlkZW50aWZpZXIsIHRoaXMucXVlc3Rpb25zKTtcbiAgICB0aGlzLnJlc2V0UXVlc3Rpb25TdGF0ZSgpO1xuICAgIGlmICh0aGlzLmp1bXBUb1F1ZXN0aW9uKSB7XG4gICAgICB0aGlzLmdvVG9RdWVzdGlvbih0aGlzLmp1bXBUb1F1ZXN0aW9uKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMudGhyZXNob2xkID09PSAxKSB7XG4gICAgICB0aGlzLnZpZXdlclNlcnZpY2UuZ2V0UXVlc3Rpb24oKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMudGhyZXNob2xkID4gMSkge1xuICAgICAgdGhpcy52aWV3ZXJTZXJ2aWNlLmdldFF1ZXN0aW9ucygpO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5zZWN0aW9uQ29uZmlnLm1ldGFkYXRhPy5jaGlsZHJlbj8ubGVuZ3RoKSB7XG4gICAgICB0aGlzLmxvYWRWaWV3ID0gdHJ1ZTtcbiAgICAgIHRoaXMuZGlzYWJsZU5leHQgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHJlbW92ZUF0dHJpYnV0ZSgpIHtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGNvbnN0IGZpcnN0U2xpZGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2Fyb3VzZWwuc2xpZGUnKSBhcyBIVE1MRWxlbWVudDtcbiAgICAgIGlmIChmaXJzdFNsaWRlKSB7XG4gICAgICAgIGZpcnN0U2xpZGUucmVtb3ZlQXR0cmlidXRlKFwidGFiaW5kZXhcIik7XG4gICAgICB9XG4gICAgfSwgMTAwKTtcbiAgfVxuXG4gIHNvcnRRdWVzdGlvbnMoKSB7XG4gICAgaWYgKHRoaXMucXVlc3Rpb25zLmxlbmd0aCAmJiB0aGlzLnF1ZXN0aW9uSWRzLmxlbmd0aCkge1xuICAgICAgY29uc3QgcXVlcyA9IFtdO1xuICAgICAgdGhpcy5xdWVzdGlvbklkcy5mb3JFYWNoKChxdWVzdGlvbklkKSA9PiB7XG4gICAgICAgIGNvbnN0IHF1ZSA9IHRoaXMucXVlc3Rpb25zLmZpbmQocXVlc3Rpb24gPT4gcXVlc3Rpb24uaWRlbnRpZmllciA9PT0gcXVlc3Rpb25JZCk7XG4gICAgICAgIGlmIChxdWUpIHtcbiAgICAgICAgICBxdWVzLnB1c2gocXVlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB0aGlzLnF1ZXN0aW9ucyA9IHF1ZXM7XG4gICAgfVxuICB9XG5cbiAgY3JlYXRlU3VtbWFyeU9iaigpIHtcbiAgICBjb25zdCBjbGFzc09iaiA9IF8uZ3JvdXBCeSh0aGlzLnByb2dyZXNzQmFyQ2xhc3MsICdjbGFzcycpO1xuICAgIHJldHVybiB7XG4gICAgICBza2lwcGVkOiBjbGFzc09iaj8uc2tpcHBlZD8ubGVuZ3RoIHx8IDAsXG4gICAgICBjb3JyZWN0OiBjbGFzc09iaj8uY29ycmVjdD8ubGVuZ3RoIHx8IDAsXG4gICAgICB3cm9uZzogY2xhc3NPYmo/Lndyb25nPy5sZW5ndGggfHwgMCxcbiAgICAgIHBhcnRpYWw6IGNsYXNzT2JqPy5wYXJ0aWFsPy5sZW5ndGggfHwgMFxuICAgIH07XG4gIH1cblxuICBuZXh0U2xpZGUoKSB7XG4gICAgdGhpcy5jdXJyZW50UXVlc3Rpb25zTWVkaWEgPSBfLmdldCh0aGlzLnF1ZXN0aW9uc1t0aGlzLmN1cnJlbnRTbGlkZUluZGV4XSwgJ21lZGlhJyk7XG5cbiAgICB0aGlzLmdldFF1ZXN0aW9uKCk7XG4gICAgdGhpcy52aWV3ZXJTZXJ2aWNlLnJhaXNlSGVhcnRCZWF0RXZlbnQoZXZlbnROYW1lLm5leHRDbGlja2VkLCBUZWxlbWV0cnlUeXBlLmludGVyYWN0LCB0aGlzLm15Q2Fyb3VzZWwuZ2V0Q3VycmVudFNsaWRlSW5kZXgoKSArIDEpO1xuICAgIHRoaXMudmlld2VyU2VydmljZS5yYWlzZUhlYXJ0QmVhdEV2ZW50KGV2ZW50TmFtZS5uZXh0Q2xpY2tlZCwgVGVsZW1ldHJ5VHlwZS5pbXByZXNzaW9uLCB0aGlzLm15Q2Fyb3VzZWwuZ2V0Q3VycmVudFNsaWRlSW5kZXgoKSArIDEpO1xuXG4gICAgaWYgKHRoaXMuY3VycmVudFNsaWRlSW5kZXggIT09IHRoaXMucXVlc3Rpb25zLmxlbmd0aCkge1xuICAgICAgdGhpcy5jdXJyZW50U2xpZGVJbmRleCA9IHRoaXMuY3VycmVudFNsaWRlSW5kZXggKyAxO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5pbml0aWFsaXplVGltZXIpIHtcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZVRpbWVyID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5teUNhcm91c2VsLmdldEN1cnJlbnRTbGlkZUluZGV4KCkgPT09IHRoaXMubm9PZlF1ZXN0aW9ucykge1xuICAgICAgdGhpcy5lbWl0U2VjdGlvbkVuZCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm15Q2Fyb3VzZWwuaXNMYXN0KHRoaXMubXlDYXJvdXNlbC5nZXRDdXJyZW50U2xpZGVJbmRleCgpKSB8fCB0aGlzLm5vT2ZRdWVzdGlvbnMgPT09IHRoaXMubXlDYXJvdXNlbC5nZXRDdXJyZW50U2xpZGVJbmRleCgpKSB7XG4gICAgICB0aGlzLmNhbGN1bGF0ZVNjb3JlKCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMubXlDYXJvdXNlbC5nZXRDdXJyZW50U2xpZGVJbmRleCgpID4gMCAmJlxuICAgICAgdGhpcy5xdWVzdGlvbnNbdGhpcy5teUNhcm91c2VsLmdldEN1cnJlbnRTbGlkZUluZGV4KCkgLSAxXS5xVHlwZSA9PT0gJ01DUScgJiYgdGhpcy5jdXJyZW50T3B0aW9uU2VsZWN0ZWQpIHtcbiAgICAgIGNvbnN0IG9wdGlvbiA9IHRoaXMuY3VycmVudE9wdGlvblNlbGVjdGVkICYmIHRoaXMuY3VycmVudE9wdGlvblNlbGVjdGVkWydvcHRpb24nXSA/IHRoaXMuY3VycmVudE9wdGlvblNlbGVjdGVkWydvcHRpb24nXSA6IHVuZGVmaW5lZDtcbiAgICAgIGNvbnN0IGlkZW50aWZpZXIgPSB0aGlzLnF1ZXN0aW9uc1t0aGlzLm15Q2Fyb3VzZWwuZ2V0Q3VycmVudFNsaWRlSW5kZXgoKSAtIDFdLmlkZW50aWZpZXI7XG4gICAgICBjb25zdCBxVHlwZSA9IHRoaXMucXVlc3Rpb25zW3RoaXMubXlDYXJvdXNlbC5nZXRDdXJyZW50U2xpZGVJbmRleCgpIC0gMV0ucVR5cGU7XG4gICAgICB0aGlzLnZpZXdlclNlcnZpY2UucmFpc2VSZXNwb25zZUV2ZW50KGlkZW50aWZpZXIsIHFUeXBlLCBvcHRpb24pO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnF1ZXN0aW9uc1t0aGlzLm15Q2Fyb3VzZWwuZ2V0Q3VycmVudFNsaWRlSW5kZXgoKV0pIHtcbiAgICAgIHRoaXMuc2V0U2tpcHBlZENsYXNzKHRoaXMubXlDYXJvdXNlbC5nZXRDdXJyZW50U2xpZGVJbmRleCgpKTtcbiAgICB9XG4gICAgdGhpcy5teUNhcm91c2VsLm1vdmUodGhpcy5jYXJvdXNlbENvbmZpZy5ORVhUKTtcbiAgICB0aGlzLnNldEltYWdlWm9vbSgpO1xuICAgIHRoaXMucmVzZXRRdWVzdGlvblN0YXRlKCk7XG4gICAgdGhpcy5jbGVhclRpbWVJbnRlcnZhbCgpO1xuICB9XG5cbiAgcHJldlNsaWRlKCkge1xuICAgIHRoaXMuZGlzYWJsZU5leHQgPSBmYWxzZTtcbiAgICB0aGlzLmN1cnJlbnRTb2x1dGlvbnMgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy52aWV3ZXJTZXJ2aWNlLnJhaXNlSGVhcnRCZWF0RXZlbnQoZXZlbnROYW1lLnByZXZDbGlja2VkLCBUZWxlbWV0cnlUeXBlLmludGVyYWN0LCB0aGlzLm15Q2Fyb3VzZWwuZ2V0Q3VycmVudFNsaWRlSW5kZXgoKSAtIDEpO1xuICAgIHRoaXMuc2hvd0FsZXJ0ID0gZmFsc2U7XG5cbiAgICBpZiAodGhpcy5jdXJyZW50U2xpZGVJbmRleCAhPT0gdGhpcy5xdWVzdGlvbnMubGVuZ3RoKSB7XG4gICAgICB0aGlzLmN1cnJlbnRTbGlkZUluZGV4ID0gdGhpcy5jdXJyZW50U2xpZGVJbmRleCArIDE7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMubXlDYXJvdXNlbC5nZXRDdXJyZW50U2xpZGVJbmRleCgpICsgMSA9PT0gdGhpcy5ub09mUXVlc3Rpb25zICYmIHRoaXMuZW5kUGFnZVJlYWNoZWQpIHtcbiAgICAgIHRoaXMuZW5kUGFnZVJlYWNoZWQgPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5teUNhcm91c2VsLm1vdmUodGhpcy5jYXJvdXNlbENvbmZpZy5QUkVWKTtcbiAgICB9XG4gICAgdGhpcy5jdXJyZW50U2xpZGVJbmRleCA9IHRoaXMubXlDYXJvdXNlbC5nZXRDdXJyZW50U2xpZGVJbmRleCgpO1xuICAgIHRoaXMuYWN0aXZlID0gdGhpcy5jdXJyZW50U2xpZGVJbmRleCA9PT0gMCAmJiB0aGlzLnNlY3Rpb25JbmRleCA9PT0gMCAmJiB0aGlzLnNob3dTdGFydFBhZ2U7XG4gICAgdGhpcy5jdXJyZW50UXVlc3Rpb25zTWVkaWEgPSBfLmdldCh0aGlzLnF1ZXN0aW9uc1t0aGlzLm15Q2Fyb3VzZWwuZ2V0Q3VycmVudFNsaWRlSW5kZXgoKSAtIDFdLCAnbWVkaWEnKTtcbiAgICB0aGlzLnNldEltYWdlWm9vbSgpO1xuICAgIHRoaXMuc2V0U2tpcHBlZENsYXNzKHRoaXMubXlDYXJvdXNlbC5nZXRDdXJyZW50U2xpZGVJbmRleCgpIC0gMSk7XG4gIH1cblxuICBnZXRRdWVzdGlvbigpIHtcbiAgICBpZiAodGhpcy5teUNhcm91c2VsLmdldEN1cnJlbnRTbGlkZUluZGV4KCkgPiAwXG4gICAgICAmJiAoKHRoaXMudGhyZXNob2xkICogdGhpcy5ub09mVGltZXNBcGlDYWxsZWQpIC0gMSkgPT09IHRoaXMubXlDYXJvdXNlbC5nZXRDdXJyZW50U2xpZGVJbmRleCgpXG4gICAgICAmJiB0aGlzLnRocmVzaG9sZCAqIHRoaXMubm9PZlRpbWVzQXBpQ2FsbGVkID49IHRoaXMucXVlc3Rpb25zLmxlbmd0aCAmJiB0aGlzLnRocmVzaG9sZCA+IDEpIHtcbiAgICAgIHRoaXMudmlld2VyU2VydmljZS5nZXRRdWVzdGlvbnMoKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5teUNhcm91c2VsLmdldEN1cnJlbnRTbGlkZUluZGV4KCkgPiAwXG4gICAgICAmJiB0aGlzLnF1ZXN0aW9uc1t0aGlzLm15Q2Fyb3VzZWwuZ2V0Q3VycmVudFNsaWRlSW5kZXgoKV0gPT09IHVuZGVmaW5lZCAmJiB0aGlzLnRocmVzaG9sZCA+IDEpIHtcbiAgICAgIHRoaXMudmlld2VyU2VydmljZS5nZXRRdWVzdGlvbnMoKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy50aHJlc2hvbGQgPT09IDEgJiYgdGhpcy5teUNhcm91c2VsLmdldEN1cnJlbnRTbGlkZUluZGV4KCkgPj0gMCkge1xuICAgICAgdGhpcy52aWV3ZXJTZXJ2aWNlLmdldFF1ZXN0aW9uKCk7XG4gICAgfVxuICB9XG5cbiAgcmVzZXRRdWVzdGlvblN0YXRlKCkge1xuICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XG4gICAgdGhpcy5zaG93QWxlcnQgPSBmYWxzZTtcbiAgICB0aGlzLm9wdGlvblNlbGVjdGVkT2JqID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuY3VycmVudE9wdGlvblNlbGVjdGVkID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuY3VycmVudFF1ZXN0aW9uID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuY3VycmVudE9wdGlvbnMgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5jdXJyZW50U29sdXRpb25zID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgYWN0aXZlU2xpZGVDaGFuZ2UoZXZlbnQpIHtcbiAgICAgIHRoaXMuaW5pdGlhbFNsaWRlRHVyYXRpb24gPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgfVxuXG4gIG5leHRTbGlkZUNsaWNrZWQoZXZlbnQpIHtcbiAgICBpZiAodGhpcy5zaG93Um9vdEluc3RydWN0aW9uICYmIHRoaXMucGFyZW50Q29uZmlnLmlzU2VjdGlvbnNBdmFpbGFibGUpIHtcbiAgICAgIHRoaXMuc2hvd1Jvb3RJbnN0cnVjdGlvbiA9IGZhbHNlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy5teUNhcm91c2VsLmdldEN1cnJlbnRTbGlkZUluZGV4KCkgPT09IDApIHtcbiAgICAgIHJldHVybiB0aGlzLm5leHRTbGlkZSgpO1xuICAgIH1cbiAgICBpZiAoZXZlbnQ/LnR5cGUgPT09ICduZXh0Jykge1xuICAgICAgdGhpcy52YWxpZGF0ZVNlbGVjdGVkT3B0aW9uKHRoaXMub3B0aW9uU2VsZWN0ZWRPYmosICduZXh0Jyk7XG4gICAgfVxuICB9XG5cbiAgcHJldmlvdXNTbGlkZUNsaWNrZWQoZXZlbnQpIHtcbiAgICBpZiAoZXZlbnQuZXZlbnQgPT09ICdwcmV2aW91cyBjbGlja2VkJykge1xuICAgICAgaWYgKHRoaXMub3B0aW9uU2VsZWN0ZWRPYmogJiYgdGhpcy5zaG93RmVlZEJhY2spIHtcbiAgICAgICAgdGhpcy5zdG9wQXV0b05hdmlnYXRpb24gPSBmYWxzZTtcbiAgICAgICAgdGhpcy52YWxpZGF0ZVNlbGVjdGVkT3B0aW9uKHRoaXMub3B0aW9uU2VsZWN0ZWRPYmosICdwcmV2aW91cycpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zdG9wQXV0b05hdmlnYXRpb24gPSB0cnVlO1xuICAgICAgICBpZiAodGhpcy5jdXJyZW50U2xpZGVJbmRleCA9PT0gMCAmJiB0aGlzLnBhcmVudENvbmZpZy5pc1NlY3Rpb25zQXZhaWxhYmxlICYmIHRoaXMuZ2V0Q3VycmVudFNlY3Rpb25JbmRleCgpID4gMCkge1xuICAgICAgICAgIGNvbnN0IHByZXZpb3VzU2VjdGlvbklkID0gdGhpcy5tYWluUHJvZ3Jlc3NCYXJbdGhpcy5nZXRDdXJyZW50U2VjdGlvbkluZGV4KCkgLSAxXS5pZGVudGlmaWVyO1xuICAgICAgICAgIHRoaXMuanVtcFRvU2VjdGlvbihwcmV2aW91c1NlY3Rpb25JZCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucHJldlNsaWRlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZ2V0Q3VycmVudFNlY3Rpb25JbmRleCgpOiBudW1iZXIge1xuICAgIGNvbnN0IGN1cnJlbnRTZWN0aW9uSWQgPSB0aGlzLnNlY3Rpb25Db25maWcubWV0YWRhdGEuaWRlbnRpZmllcjtcbiAgICByZXR1cm4gdGhpcy5tYWluUHJvZ3Jlc3NCYXIuZmluZEluZGV4KHNlY3Rpb24gPT4gc2VjdGlvbi5pZGVudGlmaWVyID09PSBjdXJyZW50U2VjdGlvbklkKTtcbiAgfVxuXG4gIGdvVG9TbGlkZUNsaWNrZWQoZXZlbnQsIGluZGV4KSB7XG4gICAgaWYgKCF0aGlzLnByb2dyZXNzQmFyQ2xhc3M/Lmxlbmd0aCkge1xuICAgICAgaWYgKGluZGV4ID09PSAwKSB7XG4gICAgICAgIHRoaXMuanVtcFNsaWRlSW5kZXggPSAwO1xuICAgICAgICB0aGlzLmdvVG9TbGlkZSh0aGlzLmp1bXBTbGlkZUluZGV4KTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcbiAgICB0aGlzLmp1bXBTbGlkZUluZGV4ID0gaW5kZXg7XG4gICAgaWYgKHRoaXMub3B0aW9uU2VsZWN0ZWRPYmogJiYgdGhpcy5zaG93RmVlZEJhY2spIHtcbiAgICAgIHRoaXMuc3RvcEF1dG9OYXZpZ2F0aW9uID0gZmFsc2U7XG4gICAgICB0aGlzLnZhbGlkYXRlU2VsZWN0ZWRPcHRpb24odGhpcy5vcHRpb25TZWxlY3RlZE9iaiwgJ2p1bXAnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zdG9wQXV0b05hdmlnYXRpb24gPSB0cnVlO1xuICAgICAgdGhpcy5nb1RvU2xpZGUodGhpcy5qdW1wU2xpZGVJbmRleCk7XG4gICAgfVxuICB9XG5cbiAgb25FbnRlcihldmVudCwgaW5kZXgpIHtcbiAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gMTMpIHtcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgdGhpcy5nb1RvU2xpZGVDbGlja2VkKGV2ZW50LCBpbmRleCk7XG4gICAgfVxuICB9XG5cbiAganVtcFRvU2VjdGlvbihpZGVudGlmaWVyOiBzdHJpbmcpIHtcbiAgICB0aGlzLnNob3dSb290SW5zdHJ1Y3Rpb24gPSBmYWxzZTtcbiAgICB0aGlzLmVtaXRTZWN0aW9uRW5kKGZhbHNlLCBpZGVudGlmaWVyKTtcbiAgfVxuXG4gIG9uU2VjdGlvbkVudGVyKGV2ZW50LCBpZGVudGlmaWVyOiBzdHJpbmcpIHtcbiAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gMTMpIHtcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgaWYgKHRoaXMub3B0aW9uU2VsZWN0ZWRPYmopIHtcbiAgICAgICAgdGhpcy52YWxpZGF0ZVNlbGVjdGVkT3B0aW9uKHRoaXMub3B0aW9uU2VsZWN0ZWRPYmosICdqdW1wJyk7XG4gICAgICB9XG4gICAgICB0aGlzLmp1bXBUb1NlY3Rpb24oaWRlbnRpZmllcik7XG4gICAgfVxuICB9XG5cbiAgb25TY29yZUJvYXJkQ2xpY2tlZCgpIHtcbiAgICB0aGlzLnZpZXdlclNlcnZpY2UudXBkYXRlU2VjdGlvblF1ZXN0aW9ucyh0aGlzLnNlY3Rpb25Db25maWcubWV0YWRhdGEuaWRlbnRpZmllciwgdGhpcy5xdWVzdGlvbnMpO1xuICAgIHRoaXMuc2hvd1Njb3JlQm9hcmQuZW1pdCgpO1xuICB9XG5cbiAgb25TY29yZUJvYXJkRW50ZXIoZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gMTMpIHtcbiAgICAgIHRoaXMub25TY29yZUJvYXJkQ2xpY2tlZCgpO1xuICAgIH1cbiAgfVxuXG4gIGZvY3VzT25OZXh0QnV0dG9uKCkge1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgY29uc3QgbmV4dEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5xdW1sLW5hdmlnYXRpb25fX25leHQnKSBhcyBIVE1MRWxlbWVudDtcbiAgICAgIGlmIChuZXh0QnRuKSB7XG4gICAgICAgIG5leHRCdG4uZm9jdXMoKTtcbiAgICAgIH1cbiAgICB9LCAxMDApO1xuICB9XG5cbiAgZ2V0T3B0aW9uU2VsZWN0ZWQob3B0aW9uU2VsZWN0ZWQpIHtcbiAgICB0aGlzLmZvY3VzT25OZXh0QnV0dG9uKCk7XG4gICAgdGhpcy5hY3RpdmUgPSB0cnVlO1xuICAgIHRoaXMuY3VycmVudE9wdGlvblNlbGVjdGVkID0gb3B0aW9uU2VsZWN0ZWQ7XG4gICAgY29uc3QgY3VycmVudEluZGV4ID0gdGhpcy5teUNhcm91c2VsLmdldEN1cnJlbnRTbGlkZUluZGV4KCkgLSAxO1xuICAgIHRoaXMudmlld2VyU2VydmljZS5yYWlzZUhlYXJ0QmVhdEV2ZW50KGV2ZW50TmFtZS5vcHRpb25DbGlja2VkLCBUZWxlbWV0cnlUeXBlLmludGVyYWN0LCB0aGlzLm15Q2Fyb3VzZWwuZ2V0Q3VycmVudFNsaWRlSW5kZXgoKSk7XG5cbiAgICAvLyBUaGlzIG9wdGlvblNlbGVjdGVkIGNvbWVzIGVtcHR5IHdoZW5ldmVyIHRoZSB0cnkgYWdhaW4gaXMgY2xpY2tlZCBvbiBmZWVkYmFjayBwb3B1cFxuICAgIGlmIChfLmlzRW1wdHkob3B0aW9uU2VsZWN0ZWQ/Lm9wdGlvbikpIHtcbiAgICAgIHRoaXMub3B0aW9uU2VsZWN0ZWRPYmogPSB1bmRlZmluZWQ7XG4gICAgICB0aGlzLmN1cnJlbnRTb2x1dGlvbnMgPSB1bmRlZmluZWQ7XG4gICAgICB0aGlzLnVwZGF0ZVNjb3JlQm9hcmQoY3VycmVudEluZGV4LCAnc2tpcHBlZCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm9wdGlvblNlbGVjdGVkT2JqID0gb3B0aW9uU2VsZWN0ZWQ7XG4gICAgICB0aGlzLmN1cnJlbnRTb2x1dGlvbnMgPSAhXy5pc0VtcHR5KG9wdGlvblNlbGVjdGVkLnNvbHV0aW9ucykgPyBvcHRpb25TZWxlY3RlZC5zb2x1dGlvbnMgOiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHRoaXMubWVkaWEgPSB0aGlzLnF1ZXN0aW9uc1t0aGlzLm15Q2Fyb3VzZWwuZ2V0Q3VycmVudFNsaWRlSW5kZXgoKSAtIDFdLm1lZGlhO1xuXG4gICAgaWYgKHRoaXMuY3VycmVudFNvbHV0aW9ucykge1xuICAgICAgdGhpcy5jdXJyZW50U29sdXRpb25zLmZvckVhY2goKGVsZSwgaW5kZXgpID0+IHtcbiAgICAgICAgaWYgKGVsZS50eXBlID09PSAndmlkZW8nKSB7XG4gICAgICAgICAgdGhpcy5tZWRpYS5mb3JFYWNoKChlKSA9PiB7XG4gICAgICAgICAgICBpZiAoZS5pZCA9PT0gdGhpcy5jdXJyZW50U29sdXRpb25zW2luZGV4XS52YWx1ZSkge1xuICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRTb2x1dGlvbnNbaW5kZXhdLnR5cGUgPSAndmlkZW8nO1xuICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRTb2x1dGlvbnNbaW5kZXhdLnNyYyA9IGUuc3JjO1xuICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRTb2x1dGlvbnNbaW5kZXhdLnRodW1ibmFpbCA9IGUudGh1bWJuYWlsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLnNob3dGZWVkQmFjaykge1xuICAgICAgdGhpcy52YWxpZGF0ZVNlbGVjdGVkT3B0aW9uKHRoaXMub3B0aW9uU2VsZWN0ZWRPYmopO1xuICAgIH1cbiAgfVxuXG4gIGR1cmF0aW9uRW5kcygpIHtcbiAgICB0aGlzLnNob3dTb2x1dGlvbiA9IGZhbHNlO1xuICAgIHRoaXMuc2hvd0FsZXJ0ID0gZmFsc2U7XG4gICAgdGhpcy5lbWl0U2VjdGlvbkVuZCh0cnVlKTtcbiAgfVxuXG4gIHByaXZhdGUgY2hlY2tDb21wYXRpYmlsaXR5TGV2ZWwoY29tcGF0aWJpbGl0eUxldmVsKSB7XG4gICAgaWYgKGNvbXBhdGliaWxpdHlMZXZlbCkge1xuICAgICAgY29uc3QgY2hlY2tDb250ZW50Q29tcGF0aWJsZSA9IHRoaXMuZXJyb3JTZXJ2aWNlLmNoZWNrQ29udGVudENvbXBhdGliaWxpdHkoY29tcGF0aWJpbGl0eUxldmVsKTtcblxuICAgICAgaWYgKCFjaGVja0NvbnRlbnRDb21wYXRpYmxlLmlzQ29tcGl0YWJsZSkge1xuICAgICAgICB0aGlzLnZpZXdlclNlcnZpY2UucmFpc2VFeGNlcHRpb25Mb2coZXJyb3JDb2RlLmNvbnRlbnRDb21wYXRpYmlsaXR5LCBlcnJvck1lc3NhZ2UuY29udGVudENvbXBhdGliaWxpdHksXG4gICAgICAgICAgY2hlY2tDb250ZW50Q29tcGF0aWJsZS5lcnJvciwgdGhpcy5zZWN0aW9uQ29uZmlnPy5jb25maWc/LnRyYWNlSWQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGVtaXRTZWN0aW9uRW5kKGlzRHVyYXRpb25FbmRlZDogYm9vbGVhbiA9IGZhbHNlLCBqdW1wVG9TZWN0aW9uPzogc3RyaW5nKSB7XG4gICAgY29uc3QgZXZlbnRPYmo6IGFueSA9IHtcbiAgICAgIHN1bW1hcnk6IHRoaXMuY3JlYXRlU3VtbWFyeU9iaigpLFxuICAgICAgc2NvcmU6IHRoaXMuY2FsY3VsYXRlU2NvcmUoKSxcbiAgICAgIGR1cmF0aW9uU3BlbnQ6IHRoaXMudXRpbFNlcnZpY2UuZ2V0VGltZVNwZW50VGV4dCh0aGlzLmluaXRpYWxUaW1lKSxcbiAgICAgIHNsaWRlSW5kZXg6IHRoaXMubXlDYXJvdXNlbC5nZXRDdXJyZW50U2xpZGVJbmRleCgpLFxuICAgICAgaXNEdXJhdGlvbkVuZGVkLFxuICAgIH07XG4gICAgaWYgKGp1bXBUb1NlY3Rpb24pIHtcbiAgICAgIGV2ZW50T2JqLmp1bXBUb1NlY3Rpb24gPSBqdW1wVG9TZWN0aW9uO1xuICAgIH1cbiAgICB0aGlzLnZpZXdlclNlcnZpY2UudXBkYXRlU2VjdGlvblF1ZXN0aW9ucyh0aGlzLnNlY3Rpb25Db25maWcubWV0YWRhdGEuaWRlbnRpZmllciwgdGhpcy5xdWVzdGlvbnMpO1xuICAgIHRoaXMuc2VjdGlvbkVuZC5lbWl0KGV2ZW50T2JqKTtcbiAgfVxuXG4gIGNsb3NlQWxlcnRCb3goZXZlbnQpIHtcbiAgICBpZiAoZXZlbnQ/LnR5cGUgPT09ICdjbG9zZScpIHtcbiAgICAgIHRoaXMudmlld2VyU2VydmljZS5yYWlzZUhlYXJ0QmVhdEV2ZW50KGV2ZW50TmFtZS5jbG9zZWRGZWVkQmFjaywgVGVsZW1ldHJ5VHlwZS5pbnRlcmFjdCwgdGhpcy5teUNhcm91c2VsLmdldEN1cnJlbnRTbGlkZUluZGV4KCkpO1xuICAgIH0gZWxzZSBpZiAoZXZlbnQ/LnR5cGUgPT09ICd0cnlBZ2FpbicpIHtcbiAgICAgIHRoaXMudHJ5QWdhaW5DbGlja2VkID0gdHJ1ZTtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLnRyeUFnYWluQ2xpY2tlZCA9IGZhbHNlO1xuICAgICAgfSwgMjAwMCk7XG4gICAgICB0aGlzLnZpZXdlclNlcnZpY2UucmFpc2VIZWFydEJlYXRFdmVudChldmVudE5hbWUudHJ5QWdhaW4sIFRlbGVtZXRyeVR5cGUuaW50ZXJhY3QsIHRoaXMubXlDYXJvdXNlbC5nZXRDdXJyZW50U2xpZGVJbmRleCgpKTtcbiAgICB9XG4gICAgdGhpcy5zaG93QWxlcnQgPSBmYWxzZTtcbiAgfVxuXG4gIHNldFNraXBwZWRDbGFzcyhpbmRleCkge1xuICAgIGlmICh0aGlzLnByb2dyZXNzQmFyQ2xhc3MgJiYgXy5nZXQodGhpcy5wcm9ncmVzc0JhckNsYXNzW2luZGV4XSwgJ2NsYXNzJykgPT09ICd1bmF0dGVtcHRlZCcpIHtcbiAgICAgIHRoaXMucHJvZ3Jlc3NCYXJDbGFzc1tpbmRleF0uY2xhc3MgPSAnc2tpcHBlZCc7XG4gICAgfVxuICB9XG5cbiAgc2lkZUJhckV2ZW50cyhldmVudDogSVNpZGVCYXJFdmVudCkge1xuICAgIGlmIChldmVudC50eXBlID09PSAnT1BFTl9NRU5VJyB8fCBldmVudC50eXBlID09PSAnQ0xPU0VfTUVOVScpIHtcbiAgICAgIHRoaXMuaGFuZGxlU2lkZUJhckFjY2Vzc2liaWxpdHkoZXZlbnQpO1xuICAgIH1cbiAgICB0aGlzLnZpZXdlclNlcnZpY2UucmFpc2VIZWFydEJlYXRFdmVudChldmVudC50eXBlLCBUZWxlbWV0cnlUeXBlLmludGVyYWN0LCB0aGlzLm15Q2Fyb3VzZWwuZ2V0Q3VycmVudFNsaWRlSW5kZXgoKSArIDEpO1xuICB9XG5cbiAgaGFuZGxlU2lkZUJhckFjY2Vzc2liaWxpdHkoZXZlbnQpIHtcbiAgICBjb25zdCBuYXZCbG9jayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5uYXZCbG9jaycpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgY29uc3Qgb3ZlcmxheUlucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI292ZXJsYXktaW5wdXQnKSBhcyBIVE1MRWxlbWVudDtcbiAgICBjb25zdCBvdmVybGF5QnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI292ZXJsYXktYnV0dG9uJykgYXMgSFRNTEVsZW1lbnQ7XG4gICAgY29uc3Qgc2lkZUJhckxpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc2lkZWJhci1saXN0JykgYXMgSFRNTEVsZW1lbnQ7XG5cbiAgICBpZiAoZXZlbnQudHlwZSA9PT0gJ09QRU5fTUVOVScpIHtcbiAgICAgIGNvbnN0IGlzTW9iaWxlID0gdGhpcy5zZWN0aW9uQ29uZmlnLmNvbmZpZz8uc2lkZU1lbnU/LnNob3dFeGl0O1xuICAgICAgdGhpcy5kaXNhYmxlZEhhbmRsZSA9IGlzTW9iaWxlID8gbWFpbnRhaW4uaGlkZGVuKHsgZmlsdGVyOiBbIHNpZGVCYXJMaXN0LCBvdmVybGF5QnV0dG9uLCBvdmVybGF5SW5wdXQgXSB9KSA6IG1haW50YWluLnRhYkZvY3VzKHsgY29udGV4dDogbmF2QmxvY2sgfSk7XG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbiA9IGZyb21FdmVudChkb2N1bWVudCwgJ2tleWRvd24nKS5zdWJzY3JpYmUoKGU6IEtleWJvYXJkRXZlbnQpID0+IHtcbiAgICAgICAgaWYgKGVbJ2tleSddID09PSAnRXNjYXBlJykge1xuICAgICAgICAgIGNvbnN0IGlucHV0Q2hlY2tlZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdvdmVybGF5LWlucHV0JykgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICAgICAgICBpbnB1dENoZWNrZWQuY2hlY2tlZCA9IGZhbHNlO1xuICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwbGF5ZXJTaWRlTWVudScpLnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJztcbiAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignLm5hdkJsb2NrJykuc3R5bGUubWFyZ2luTGVmdCA9ICctMTAwJSc7XG4gICAgICAgICAgdGhpcy52aWV3ZXJTZXJ2aWNlLnJhaXNlSGVhcnRCZWF0RXZlbnQoJ0NMT1NFX01FTlUnLCBUZWxlbWV0cnlUeXBlLmludGVyYWN0LCB0aGlzLm15Q2Fyb3VzZWwuZ2V0Q3VycmVudFNsaWRlSW5kZXgoKSArIDEpO1xuICAgICAgICAgIHRoaXMuZGlzYWJsZWRIYW5kbGUuZGlzZW5nYWdlKCk7XG4gICAgICAgICAgdGhpcy5zdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICB0aGlzLmRpc2FibGVkSGFuZGxlID0gbnVsbDtcbiAgICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbiA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAoZXZlbnQudHlwZSA9PT0gJ0NMT1NFX01FTlUnICYmIHRoaXMuZGlzYWJsZWRIYW5kbGUpIHtcbiAgICAgIHRoaXMuZGlzYWJsZWRIYW5kbGUuZGlzZW5nYWdlKCk7XG4gICAgICB0aGlzLmRpc2FibGVkSGFuZGxlID0gbnVsbDtcbiAgICAgIGlmICh0aGlzLnN1YnNjcmlwdGlvbikge1xuICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbiA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdmFsaWRhdGVTZWxlY3RlZE9wdGlvbihvcHRpb24sIHR5cGU/OiBzdHJpbmcpIHtcbiAgICBjb25zdCBzZWxlY3RlZE9wdGlvblZhbHVlID0gb3B0aW9uPy5vcHRpb24/LnZhbHVlO1xuICAgIGNvbnN0IGN1cnJlbnRJbmRleCA9IHRoaXMubXlDYXJvdXNlbC5nZXRDdXJyZW50U2xpZGVJbmRleCgpIC0gMTtcbiAgICBjb25zdCBpc1F1ZXN0aW9uU2tpcEFsbG93ZWQgPSAhdGhpcy5vcHRpb25TZWxlY3RlZE9iaiAmJlxuICAgICAgdGhpcy5hbGxvd1NraXAgJiYgdGhpcy51dGlsU2VydmljZS5nZXRRdWVzdGlvblR5cGUodGhpcy5xdWVzdGlvbnMsIGN1cnJlbnRJbmRleCkgPT09ICdNQ1EnO1xuICAgIGNvbnN0IGlzU3ViamVjdGl2ZVF1ZXN0aW9uID0gdGhpcy51dGlsU2VydmljZS5nZXRRdWVzdGlvblR5cGUodGhpcy5xdWVzdGlvbnMsIGN1cnJlbnRJbmRleCkgPT09ICdTQSc7XG4gICAgY29uc3Qgb25TdGFydFBhZ2UgPSB0aGlzLnN0YXJ0UGFnZUluc3RydWN0aW9uICYmIHRoaXMubXlDYXJvdXNlbC5nZXRDdXJyZW50U2xpZGVJbmRleCgpID09PSAwO1xuICAgIGNvbnN0IGlzQWN0aXZlID0gIXRoaXMub3B0aW9uU2VsZWN0ZWRPYmogJiYgdGhpcy5hY3RpdmU7XG4gICAgY29uc3Qgc2VsZWN0ZWRRdWVzdGlvbiA9IHRoaXMucXVlc3Rpb25zW2N1cnJlbnRJbmRleF07XG5cbiAgICBpZiAodGhpcy5vcHRpb25TZWxlY3RlZE9iaikge1xuICAgICAgY29uc3Qga2V5ID0gdGhpcy51dGlsU2VydmljZS5nZXRLZXlWYWx1ZShPYmplY3Qua2V5cyhzZWxlY3RlZFF1ZXN0aW9uLnJlc3BvbnNlRGVjbGFyYXRpb24pKTtcbiAgICAgIHRoaXMuY3VycmVudFF1ZXN0aW9uID0gc2VsZWN0ZWRRdWVzdGlvbi5ib2R5O1xuICAgICAgdGhpcy5jdXJyZW50T3B0aW9ucyA9IHNlbGVjdGVkUXVlc3Rpb24uaW50ZXJhY3Rpb25zW2tleV0ub3B0aW9ucztcblxuICAgICAgY29uc3QgZ2V0UGFyYW1zID0gKCkgPT4ge1xuICAgICAgICBpZiAoc2VsZWN0ZWRRdWVzdGlvbi5xVHlwZS50b1VwcGVyQ2FzZSgpID09PSAnTUNRJyAmJiBzZWxlY3RlZFF1ZXN0aW9uPy5lZGl0b3JTdGF0ZT8ub3B0aW9ucykge1xuICAgICAgICAgIHJldHVybiBzZWxlY3RlZFF1ZXN0aW9uLmVkaXRvclN0YXRlLm9wdGlvbnM7XG4gICAgICAgIH0gZWxzZSBpZiAoc2VsZWN0ZWRRdWVzdGlvbi5xVHlwZS50b1VwcGVyQ2FzZSgpID09PSAnTUNRJyAmJiAhXy5pc0VtcHR5KHNlbGVjdGVkUXVlc3Rpb24/LmVkaXRvclN0YXRlKSkge1xuICAgICAgICAgIHJldHVybiBbc2VsZWN0ZWRRdWVzdGlvbj8uZWRpdG9yU3RhdGVdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIGlmIChvcHRpb24uY2FyZGluYWxpdHkgPT09ICdzaW5nbGUnKSB7XG4gICAgICAgIGNvbnN0IGNvcnJlY3RPcHRpb25WYWx1ZSA9IE51bWJlcihzZWxlY3RlZFF1ZXN0aW9uLnJlc3BvbnNlRGVjbGFyYXRpb25ba2V5XS5jb3JyZWN0UmVzcG9uc2UudmFsdWUpO1xuICAgICAgICB0aGlzLnNsaWRlRHVyYXRpb24gPSBNYXRoLnJvdW5kKChuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIHRoaXMuaW5pdGlhbFNsaWRlRHVyYXRpb24pIC8gMTAwMCk7XG4gICAgICAgIGNvbnN0IGVkYXRhSXRlbTogYW55ID0ge1xuICAgICAgICAgICdpZCc6IHNlbGVjdGVkUXVlc3Rpb24uaWRlbnRpZmllcixcbiAgICAgICAgICAndGl0bGUnOiBzZWxlY3RlZFF1ZXN0aW9uLm5hbWUsXG4gICAgICAgICAgJ2Rlc2MnOiBzZWxlY3RlZFF1ZXN0aW9uLmRlc2NyaXB0aW9uLFxuICAgICAgICAgICd0eXBlJzogc2VsZWN0ZWRRdWVzdGlvbi5xVHlwZS50b0xvd2VyQ2FzZSgpLFxuICAgICAgICAgICdtYXhzY29yZSc6IHNlbGVjdGVkUXVlc3Rpb24ucmVzcG9uc2VEZWNsYXJhdGlvbltrZXldLm1heFNjb3JlIHx8IDAsXG4gICAgICAgICAgJ3BhcmFtcyc6IGdldFBhcmFtcygpXG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKGVkYXRhSXRlbSAmJiB0aGlzLnBhcmVudENvbmZpZy5pc1NlY3Rpb25zQXZhaWxhYmxlKSB7XG4gICAgICAgICAgZWRhdGFJdGVtLnNlY3Rpb25JZCA9IHRoaXMuc2VjdGlvbkNvbmZpZy5tZXRhZGF0YS5pZGVudGlmaWVyO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zaG93QWxlcnQgPSB0cnVlO1xuICAgICAgICBpZiAob3B0aW9uLm9wdGlvbj8udmFsdWUgPT09IGNvcnJlY3RPcHRpb25WYWx1ZSkge1xuICAgICAgICAgIGNvbnN0IGN1cnJlbnRTY29yZSA9IHRoaXMuZ2V0U2NvcmUoY3VycmVudEluZGV4LCBrZXksIHRydWUpO1xuICAgICAgICAgIHRoaXMudmlld2VyU2VydmljZS5yYWlzZUFzc2VzRXZlbnQoZWRhdGFJdGVtLCBjdXJyZW50SW5kZXggKyAxLCAnWWVzJywgY3VycmVudFNjb3JlLCBbb3B0aW9uLm9wdGlvbl0sIHRoaXMuc2xpZGVEdXJhdGlvbik7XG4gICAgICAgICAgdGhpcy5hbGVydFR5cGUgPSAnY29ycmVjdCc7XG4gICAgICAgICAgaWYgKHRoaXMuc2hvd0ZlZWRCYWNrKVxuICAgICAgICAgICAgdGhpcy5jb3JyZWN0RmVlZEJhY2tUaW1lT3V0KHR5cGUpO1xuICAgICAgICAgIHRoaXMudXBkYXRlU2NvcmVCb2FyZChjdXJyZW50SW5kZXgsICdjb3JyZWN0JywgdW5kZWZpbmVkLCBjdXJyZW50U2NvcmUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IGN1cnJlbnRTY29yZSA9IHRoaXMuZ2V0U2NvcmUoY3VycmVudEluZGV4LCBrZXksIGZhbHNlLCBvcHRpb24pO1xuICAgICAgICAgIHRoaXMuYWxlcnRUeXBlID0gJ3dyb25nJztcbiAgICAgICAgICBjb25zdCBjbGFzc1R5cGUgPSB0aGlzLnByb2dyZXNzQmFyQ2xhc3NbY3VycmVudEluZGV4XS5jbGFzcyA9PT0gJ3BhcnRpYWwnID8gJ3BhcnRpYWwnIDogJ3dyb25nJztcbiAgICAgICAgICB0aGlzLnVwZGF0ZVNjb3JlQm9hcmQoY3VycmVudEluZGV4LCBjbGFzc1R5cGUsIHNlbGVjdGVkT3B0aW9uVmFsdWUsIGN1cnJlbnRTY29yZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChvcHRpb24uY2FyZGluYWxpdHkgPT09ICdtdWx0aXBsZScpIHtcbiAgICAgICAgY29uc3QgcmVzcG9uc2VEZWNsYXJhdGlvbiA9IHRoaXMucXVlc3Rpb25zW2N1cnJlbnRJbmRleF0ucmVzcG9uc2VEZWNsYXJhdGlvbjtcbiAgICAgICAgY29uc3QgY3VycmVudFNjb3JlID0gdGhpcy51dGlsU2VydmljZS5nZXRNdWx0aXNlbGVjdFNjb3JlKG9wdGlvbi5vcHRpb24sIHJlc3BvbnNlRGVjbGFyYXRpb24pO1xuICAgICAgICB0aGlzLnNob3dBbGVydCA9IHRydWU7XG4gICAgICAgIGlmIChjdXJyZW50U2NvcmUgPT09IDApIHtcbiAgICAgICAgICB0aGlzLmFsZXJ0VHlwZSA9ICd3cm9uZyc7XG4gICAgICAgICAgdGhpcy51cGRhdGVTY29yZUJvYXJkKChjdXJyZW50SW5kZXggKyAxKSwgJ3dyb25nJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy51cGRhdGVTY29yZUJvYXJkKCgoY3VycmVudEluZGV4ICsgMSkpLCAnY29ycmVjdCcsIHVuZGVmaW5lZCwgY3VycmVudFNjb3JlKTtcbiAgICAgICAgICBpZiAodGhpcy5zaG93RmVlZEJhY2spXG4gICAgICAgICAgICB0aGlzLmNvcnJlY3RGZWVkQmFja1RpbWVPdXQodHlwZSk7XG4gICAgICAgICAgdGhpcy5hbGVydFR5cGUgPSAnY29ycmVjdCc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMucHJvZ3Jlc3NCYXJDbGFzc1tjdXJyZW50SW5kZXhdLmNhcmRpbmFsaXR5ID0gXy5nZXQodGhpcy5vcHRpb25TZWxlY3RlZE9iaiwgJ2NhcmRpbmFsaXR5Jyk7XG4gICAgICB0aGlzLnByb2dyZXNzQmFyQ2xhc3NbY3VycmVudEluZGV4XS5vcHRpb24gPSBfLmdldCh0aGlzLm9wdGlvblNlbGVjdGVkT2JqLCAnb3B0aW9uJyk7XG4gICAgICB0aGlzLm9wdGlvblNlbGVjdGVkT2JqID0gdW5kZWZpbmVkO1xuICAgIH0gZWxzZSBpZiAoKGlzUXVlc3Rpb25Ta2lwQWxsb3dlZCkgfHwgaXNTdWJqZWN0aXZlUXVlc3Rpb24gfHwgb25TdGFydFBhZ2UgfHwgaXNBY3RpdmUpIHtcbiAgICAgIHRoaXMubmV4dFNsaWRlKCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXJ0UGFnZUluc3RydWN0aW9uICYmICF0aGlzLm9wdGlvblNlbGVjdGVkT2JqICYmICF0aGlzLmFjdGl2ZSAmJiAhdGhpcy5hbGxvd1NraXAgJiZcbiAgICAgIHRoaXMubXlDYXJvdXNlbC5nZXRDdXJyZW50U2xpZGVJbmRleCgpID4gMCAmJiB0aGlzLnV0aWxTZXJ2aWNlLmdldFF1ZXN0aW9uVHlwZSh0aGlzLnF1ZXN0aW9ucywgY3VycmVudEluZGV4KSA9PT0gJ01DUSdcbiAgICAgICYmIHRoaXMudXRpbFNlcnZpY2UuY2FuR28odGhpcy5wcm9ncmVzc0JhckNsYXNzW3RoaXMubXlDYXJvdXNlbC5nZXRDdXJyZW50U2xpZGVJbmRleCgpXSkpIHtcbiAgICAgIHRoaXMuaW5mb1BvcHVwVGltZU91dCgpO1xuICAgIH0gZWxzZSBpZiAoIXRoaXMub3B0aW9uU2VsZWN0ZWRPYmogJiYgIXRoaXMuYWN0aXZlICYmICF0aGlzLmFsbG93U2tpcCAmJiB0aGlzLm15Q2Fyb3VzZWwuZ2V0Q3VycmVudFNsaWRlSW5kZXgoKSA+PSAwXG4gICAgICAmJiB0aGlzLnV0aWxTZXJ2aWNlLmdldFF1ZXN0aW9uVHlwZSh0aGlzLnF1ZXN0aW9ucywgY3VycmVudEluZGV4KSA9PT0gJ01DUSdcbiAgICAgICYmIHRoaXMudXRpbFNlcnZpY2UuY2FuR28odGhpcy5wcm9ncmVzc0JhckNsYXNzW3RoaXMubXlDYXJvdXNlbC5nZXRDdXJyZW50U2xpZGVJbmRleCgpXSkpIHtcbiAgICAgIHRoaXMuaW5mb1BvcHVwVGltZU91dCgpO1xuICAgIH1cbiAgfVxuXG4gIGluZm9Qb3B1cFRpbWVPdXQoKSB7XG4gICAgdGhpcy5pbmZvUG9wdXAgPSB0cnVlO1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5pbmZvUG9wdXAgPSBmYWxzZTtcbiAgICB9LCAyMDAwKTtcbiAgfVxuXG4gIGNvcnJlY3RGZWVkQmFja1RpbWVPdXQodHlwZT86IHN0cmluZykge1xuICAgIHRoaXMuaW50ZXJ2YWxSZWYgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuc2hvd0FsZXJ0ID0gZmFsc2U7XG4gICAgICBpZiAoIXRoaXMubXlDYXJvdXNlbC5pc0xhc3QodGhpcy5teUNhcm91c2VsLmdldEN1cnJlbnRTbGlkZUluZGV4KCkpICYmIHR5cGUgPT09ICduZXh0Jykge1xuICAgICAgICB0aGlzLm5leHRTbGlkZSgpO1xuICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAncHJldmlvdXMnICYmICF0aGlzLnN0b3BBdXRvTmF2aWdhdGlvbikge1xuICAgICAgICB0aGlzLnByZXZTbGlkZSgpO1xuICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAnanVtcCcgJiYgIXRoaXMuc3RvcEF1dG9OYXZpZ2F0aW9uKSB7XG4gICAgICAgIHRoaXMuZ29Ub1NsaWRlKHRoaXMuanVtcFNsaWRlSW5kZXgpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLm15Q2Fyb3VzZWwuaXNMYXN0KHRoaXMubXlDYXJvdXNlbC5nZXRDdXJyZW50U2xpZGVJbmRleCgpKSkge1xuICAgICAgICB0aGlzLmVuZFBhZ2VSZWFjaGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5lbWl0U2VjdGlvbkVuZCgpO1xuICAgICAgfVxuICAgIH0sIDQwMDApO1xuICB9XG5cbiAgZ29Ub1NsaWRlKGluZGV4KSB7XG4gICAgdGhpcy52aWV3ZXJTZXJ2aWNlLnJhaXNlSGVhcnRCZWF0RXZlbnQoZXZlbnROYW1lLmdvVG9RdWVzdGlvbiwgVGVsZW1ldHJ5VHlwZS5pbnRlcmFjdCwgdGhpcy5teUNhcm91c2VsLmdldEN1cnJlbnRTbGlkZUluZGV4KCkpO1xuICAgIHRoaXMuZGlzYWJsZU5leHQgPSBmYWxzZTtcbiAgICB0aGlzLmN1cnJlbnRTbGlkZUluZGV4ID0gaW5kZXg7XG4gICAgdGhpcy5zaG93Um9vdEluc3RydWN0aW9uID0gZmFsc2U7XG4gICAgaWYgKGluZGV4ID09PSAwKSB7XG4gICAgICB0aGlzLm9wdGlvblNlbGVjdGVkT2JqID0gdW5kZWZpbmVkO1xuICAgICAgdGhpcy5teUNhcm91c2VsLnNlbGVjdFNsaWRlKDApO1xuICAgICAgdGhpcy5hY3RpdmUgPSB0aGlzLmN1cnJlbnRTbGlkZUluZGV4ID09PSAwICYmIHRoaXMuc2VjdGlvbkluZGV4ID09PSAwICYmIHRoaXMuc2hvd1N0YXJ0UGFnZTtcbiAgICAgIHRoaXMuc2hvd1Jvb3RJbnN0cnVjdGlvbiA9IHRydWU7XG4gICAgICBpZiAoIXRoaXMuc2VjdGlvbkNvbmZpZy5tZXRhZGF0YT8uY2hpbGRyZW4/Lmxlbmd0aCkge1xuICAgICAgICB0aGlzLmRpc2FibGVOZXh0ID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5jdXJyZW50UXVlc3Rpb25zTWVkaWEgPSBfLmdldCh0aGlzLnF1ZXN0aW9uc1t0aGlzLmN1cnJlbnRTbGlkZUluZGV4IC0gMV0sICdtZWRpYScpO1xuICAgIHRoaXMuc2V0U2tpcHBlZENsYXNzKHRoaXMuY3VycmVudFNsaWRlSW5kZXggLSAxKTtcbiAgICBpZiAoIXRoaXMuaW5pdGlhbGl6ZVRpbWVyKSB7XG4gICAgICB0aGlzLmluaXRpYWxpemVUaW1lciA9IHRydWU7XG4gICAgfVxuICAgIGlmICh0aGlzLnF1ZXN0aW9uc1tpbmRleCAtIDFdID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuc2hvd1F1ZXN0aW9ucyA9IGZhbHNlO1xuICAgICAgdGhpcy52aWV3ZXJTZXJ2aWNlLmdldFF1ZXN0aW9ucygwLCBpbmRleCk7XG4gICAgICB0aGlzLmN1cnJlbnRTbGlkZUluZGV4ID0gaW5kZXg7XG4gICAgfSBlbHNlIGlmICh0aGlzLnF1ZXN0aW9uc1tpbmRleCAtIDFdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMubXlDYXJvdXNlbC5zZWxlY3RTbGlkZShpbmRleCk7XG4gICAgfVxuICAgIHRoaXMuc2V0SW1hZ2Vab29tKCk7XG4gICAgdGhpcy5jdXJyZW50U29sdXRpb25zID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuaGlnaGxpZ2h0UXVlc3Rpb24oKTtcbiAgfVxuXG4gIGdvVG9RdWVzdGlvbihldmVudCkge1xuICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XG4gICAgdGhpcy5zaG93Um9vdEluc3RydWN0aW9uID0gZmFsc2U7XG4gICAgdGhpcy5kaXNhYmxlTmV4dCA9IGZhbHNlO1xuICAgIHRoaXMuaW5pdGlhbGl6ZVRpbWVyID0gdHJ1ZTtcbiAgICBjb25zdCBpbmRleCA9IGV2ZW50LnF1ZXN0aW9uTm87XG4gICAgdGhpcy52aWV3ZXJTZXJ2aWNlLmdldFF1ZXN0aW9ucygwLCBpbmRleCk7XG4gICAgdGhpcy5jdXJyZW50U2xpZGVJbmRleCA9IGluZGV4O1xuICAgIHRoaXMubXlDYXJvdXNlbC5zZWxlY3RTbGlkZShpbmRleCk7XG4gICAgdGhpcy5oaWdobGlnaHRRdWVzdGlvbigpO1xuICB9XG5cbiAgaGlnaGxpZ2h0UXVlc3Rpb24oKSB7XG4gICAgY29uc3QgY3VycmVudFF1ZXN0aW9uID0gdGhpcy5xdWVzdGlvbnNbdGhpcy5jdXJyZW50U2xpZGVJbmRleCAtIDFdO1xuICAgIGNvbnN0IHF1ZXN0aW9uVHlwZSA9IGN1cnJlbnRRdWVzdGlvbj8ucVR5cGU/LnRvVXBwZXJDYXNlKCk7XG4gICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGN1cnJlbnRRdWVzdGlvbj8uaWRlbnRpZmllcikgYXMgSFRNTEVsZW1lbnQ7XG4gICAgaWYgKGVsZW1lbnQgJiYgcXVlc3Rpb25UeXBlKSB7XG4gICAgICBsZXQgcXVlc3Rpb25UaXRsZUVsZW1lbnQ7XG5cbiAgICAgIHN3aXRjaCAocXVlc3Rpb25UeXBlKSB7XG4gICAgICAgIGNhc2UgJ01DUSc6XG4gICAgICAgICAgcXVlc3Rpb25UaXRsZUVsZW1lbnQgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tY3EtdGl0bGUnKSBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBxdWVzdGlvblRpdGxlRWxlbWVudCA9IGVsZW1lbnQucXVlcnlTZWxlY3RvcignLnF1ZXN0aW9uLWNvbnRhaW5lcicpIGFzIEhUTUxFbGVtZW50O1xuICAgICAgfVxuXG4gICAgICBpZiAocXVlc3Rpb25UaXRsZUVsZW1lbnQpIHtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgcXVlc3Rpb25UaXRsZUVsZW1lbnQuZm9jdXMoKTtcbiAgICAgICAgfSwgMCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZ2V0U29sdXRpb25zKCkge1xuICAgIHRoaXMuc2hvd0FsZXJ0ID0gZmFsc2U7XG4gICAgdGhpcy52aWV3ZXJTZXJ2aWNlLnJhaXNlSGVhcnRCZWF0RXZlbnQoZXZlbnROYW1lLnNob3dBbnN3ZXIsIFRlbGVtZXRyeVR5cGUuaW50ZXJhY3QsIHRoaXMubXlDYXJvdXNlbC5nZXRDdXJyZW50U2xpZGVJbmRleCgpKTtcbiAgICB0aGlzLnZpZXdlclNlcnZpY2UucmFpc2VIZWFydEJlYXRFdmVudChldmVudE5hbWUuc2hvd0Fuc3dlciwgVGVsZW1ldHJ5VHlwZS5pbXByZXNzaW9uLCB0aGlzLm15Q2Fyb3VzZWwuZ2V0Q3VycmVudFNsaWRlSW5kZXgoKSk7XG4gICAgY29uc3QgY3VycmVudEluZGV4ID0gdGhpcy5teUNhcm91c2VsLmdldEN1cnJlbnRTbGlkZUluZGV4KCkgLSAxO1xuICAgIHRoaXMuY3VycmVudFF1ZXN0aW9uID0gdGhpcy5xdWVzdGlvbnNbY3VycmVudEluZGV4XS5ib2R5O1xuICAgIHRoaXMuY3VycmVudE9wdGlvbnMgPSB0aGlzLnF1ZXN0aW9uc1tjdXJyZW50SW5kZXhdLmludGVyYWN0aW9ucy5yZXNwb25zZTEub3B0aW9ucztcbiAgICB0aGlzLmN1cnJlbnRRdWVzdGlvbnNNZWRpYSA9IF8uZ2V0KHRoaXMucXVlc3Rpb25zW2N1cnJlbnRJbmRleF0sICdtZWRpYScpO1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5zZXRJbWFnZVpvb20oKTtcbiAgICB9KTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuc2V0SW1hZ2VIZWlnaHRXaWR0aENsYXNzKCk7XG4gICAgfSwgMTAwKTtcbiAgICBpZiAodGhpcy5jdXJyZW50U29sdXRpb25zKSB7XG4gICAgICB0aGlzLnNob3dTb2x1dGlvbiA9IHRydWU7XG4gICAgfVxuICAgIHRoaXMuY2xlYXJUaW1lSW50ZXJ2YWwoKTtcbiAgfVxuXG4gIHZpZXdTb2x1dGlvbigpIHtcbiAgICB0aGlzLnZpZXdlclNlcnZpY2UucmFpc2VIZWFydEJlYXRFdmVudChldmVudE5hbWUudmlld1NvbHV0aW9uQ2xpY2tlZCwgVGVsZW1ldHJ5VHlwZS5pbnRlcmFjdCwgdGhpcy5teUNhcm91c2VsLmdldEN1cnJlbnRTbGlkZUluZGV4KCkpO1xuICAgIHRoaXMuc2hvd1NvbHV0aW9uID0gdHJ1ZTtcbiAgICB0aGlzLnNob3dBbGVydCA9IGZhbHNlO1xuICAgIHRoaXMuY3VycmVudFF1ZXN0aW9uc01lZGlhID0gXy5nZXQodGhpcy5xdWVzdGlvbnNbdGhpcy5teUNhcm91c2VsLmdldEN1cnJlbnRTbGlkZUluZGV4KCkgLSAxXSwgJ21lZGlhJyk7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLnNldEltYWdlWm9vbSgpO1xuICAgICAgdGhpcy5zZXRJbWFnZUhlaWdodFdpZHRoQ2xhc3MoKTtcbiAgICB9KTtcbiAgICBjbGVhclRpbWVvdXQodGhpcy5pbnRlcnZhbFJlZik7XG4gIH1cblxuICBjbG9zZVNvbHV0aW9uKCkge1xuICAgIHRoaXMuc2V0SW1hZ2Vab29tKCk7XG4gICAgdGhpcy52aWV3ZXJTZXJ2aWNlLnJhaXNlSGVhcnRCZWF0RXZlbnQoZXZlbnROYW1lLnNvbHV0aW9uQ2xvc2VkLCBUZWxlbWV0cnlUeXBlLmludGVyYWN0LCB0aGlzLm15Q2Fyb3VzZWwuZ2V0Q3VycmVudFNsaWRlSW5kZXgoKSk7XG4gICAgdGhpcy5zaG93U29sdXRpb24gPSBmYWxzZTtcbiAgICB0aGlzLm15Q2Fyb3VzZWwuc2VsZWN0U2xpZGUodGhpcy5jdXJyZW50U2xpZGVJbmRleCk7XG4gICAgdGhpcy5mb2N1c09uTmV4dEJ1dHRvbigpO1xuICB9XG5cbiAgdmlld0hpbnQoKSB7XG4gICAgdGhpcy52aWV3ZXJTZXJ2aWNlLnJhaXNlSGVhcnRCZWF0RXZlbnQoZXZlbnROYW1lLnZpZXdIaW50LCBUZWxlbWV0cnlUeXBlLmludGVyYWN0LCB0aGlzLm15Q2Fyb3VzZWwuZ2V0Q3VycmVudFNsaWRlSW5kZXgoKSk7XG4gIH1cblxuICBzaG93QW5zd2VyQ2xpY2tlZChldmVudCwgcXVlc3Rpb24/KSB7XG4gICAgaWYgKGV2ZW50Py5zaG93QW5zd2VyKSB7XG4gICAgICB0aGlzLmZvY3VzT25OZXh0QnV0dG9uKCk7XG4gICAgICB0aGlzLmFjdGl2ZSA9IHRydWU7XG4gICAgICB0aGlzLnByb2dyZXNzQmFyQ2xhc3NbdGhpcy5teUNhcm91c2VsLmdldEN1cnJlbnRTbGlkZUluZGV4KCkgLSAxXS5jbGFzcyA9ICdjb3JyZWN0JztcbiAgICAgIGlmIChxdWVzdGlvbikge1xuICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMucXVlc3Rpb25zLmZpbmRJbmRleChxdWUgPT4gcXVlLmlkZW50aWZpZXIgPT09IHF1ZXN0aW9uLmlkZW50aWZpZXIpO1xuICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICAgIHRoaXMucXVlc3Rpb25zW2luZGV4XS5pc0Fuc3dlclNob3duID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLnZpZXdlclNlcnZpY2UudXBkYXRlU2VjdGlvblF1ZXN0aW9ucyh0aGlzLnNlY3Rpb25Db25maWcubWV0YWRhdGEuaWRlbnRpZmllciwgdGhpcy5xdWVzdGlvbnMpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLnZpZXdlclNlcnZpY2UucmFpc2VIZWFydEJlYXRFdmVudChldmVudE5hbWUuc2hvd0Fuc3dlciwgVGVsZW1ldHJ5VHlwZS5pbnRlcmFjdCwgcGFnZUlkLnNob3J0QW5zd2VyKTtcbiAgICAgIHRoaXMudmlld2VyU2VydmljZS5yYWlzZUhlYXJ0QmVhdEV2ZW50KGV2ZW50TmFtZS5wYWdlU2Nyb2xsZWQsIFRlbGVtZXRyeVR5cGUuaW1wcmVzc2lvbiwgdGhpcy5teUNhcm91c2VsLmdldEN1cnJlbnRTbGlkZUluZGV4KCkgLSAxKTtcbiAgICB9XG4gIH1cblxuICBnZXRTY29yZShjdXJyZW50SW5kZXgsIGtleSwgaXNDb3JyZWN0QW5zd2VyLCBzZWxlY3RlZE9wdGlvbj8pIHtcbiAgICBpZiAoaXNDb3JyZWN0QW5zd2VyKSB7XG4gICAgICByZXR1cm4gdGhpcy5xdWVzdGlvbnNbY3VycmVudEluZGV4XS5yZXNwb25zZURlY2xhcmF0aW9uW2tleV0uY29ycmVjdFJlc3BvbnNlLm91dGNvbWVzLlNDT1JFID9cbiAgICAgICAgdGhpcy5xdWVzdGlvbnNbY3VycmVudEluZGV4XS5yZXNwb25zZURlY2xhcmF0aW9uW2tleV0uY29ycmVjdFJlc3BvbnNlLm91dGNvbWVzLlNDT1JFIDpcbiAgICAgICAgdGhpcy5xdWVzdGlvbnNbY3VycmVudEluZGV4XS5yZXNwb25zZURlY2xhcmF0aW9uW2tleV0ubWF4U2NvcmUgfHwgMTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3Qgc2VsZWN0ZWRPcHRpb25WYWx1ZSA9IHNlbGVjdGVkT3B0aW9uLm9wdGlvbi52YWx1ZTtcbiAgICAgIGNvbnN0IG1hcHBpbmcgPSB0aGlzLnF1ZXN0aW9uc1tjdXJyZW50SW5kZXhdLnJlc3BvbnNlRGVjbGFyYXRpb24ubWFwcGluZztcbiAgICAgIGxldCBzY29yZSA9IDA7XG5cbiAgICAgIGlmIChtYXBwaW5nKSB7XG4gICAgICAgIG1hcHBpbmcuZm9yRWFjaCgodmFsKSA9PiB7XG4gICAgICAgICAgaWYgKHNlbGVjdGVkT3B0aW9uVmFsdWUgPT09IHZhbC5yZXNwb25zZSkge1xuICAgICAgICAgICAgc2NvcmUgPSB2YWwub3V0Y29tZXMuU0NPUkUgfHwgMDtcbiAgICAgICAgICAgIGlmICh2YWwub3V0Y29tZXMuU0NPUkUpIHtcbiAgICAgICAgICAgICAgdGhpcy5wcm9ncmVzc0JhckNsYXNzW2N1cnJlbnRJbmRleF0uY2xhc3MgPSAncGFydGlhbCc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzY29yZTtcbiAgICB9XG4gIH1cblxuICBjYWxjdWxhdGVTY29yZSgpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9ncmVzc0JhckNsYXNzLnJlZHVjZSgoYWNjdW11bGF0b3IsIGVsZW1lbnQpID0+IGFjY3VtdWxhdG9yICsgZWxlbWVudC5zY29yZSwgMCk7XG4gIH1cblxuICB1cGRhdGVTY29yZUJvYXJkKGluZGV4LCBjbGFzc1RvQmVVcGRhdGVkLCBvcHRpb25WYWx1ZT8sIHNjb3JlPykge1xuICAgIHRoaXMucHJvZ3Jlc3NCYXJDbGFzcy5mb3JFYWNoKChlbGUpID0+IHtcbiAgICAgIGlmIChlbGUuaW5kZXggLSAxID09PSBpbmRleCkge1xuICAgICAgICBlbGUuY2xhc3MgPSBjbGFzc1RvQmVVcGRhdGVkO1xuICAgICAgICBlbGUuc2NvcmUgPSBzY29yZSA/IHNjb3JlIDogMDtcblxuICAgICAgICBpZiAoIXRoaXMuc2hvd0ZlZWRCYWNrKSB7XG4gICAgICAgICAgZWxlLnZhbHVlID0gb3B0aW9uVmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qIEVuZCBvZiBzY29yZSBtZXRob2RzICAqL1xuXG4gIC8qIFN0YXJ0IG9mIEltYWdlIHpvb20gcmVsYXRlZCAqL1xuICBzZXRJbWFnZUhlaWdodFdpZHRoQ2xhc3MoKSB7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtYXNzZXQtdmFyaWFibGVdJykuZm9yRWFjaChpbWFnZSA9PiB7XG4gICAgICBpbWFnZS5yZW1vdmVBdHRyaWJ1dGUoJ2NsYXNzJyk7XG4gICAgICBpZiAoaW1hZ2UuY2xpZW50SGVpZ2h0ID4gaW1hZ2UuY2xpZW50V2lkdGgpIHtcbiAgICAgICAgaW1hZ2Uuc2V0QXR0cmlidXRlKCdjbGFzcycsICdwb3J0cmFpdCcpO1xuICAgICAgfSBlbHNlIGlmIChpbWFnZS5jbGllbnRIZWlnaHQgPCBpbWFnZS5jbGllbnRXaWR0aCkge1xuICAgICAgICBpbWFnZS5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ2xhbmRzY2FwZScpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW1hZ2Uuc2V0QXR0cmlidXRlKCdjbGFzcycsICduZXV0cmFsJyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBzZXRJbWFnZVpvb20oKSB7XG4gICAgY29uc3QgaW5kZXggPSB0aGlzLm15Q2Fyb3VzZWwuZ2V0Q3VycmVudFNsaWRlSW5kZXgoKSAtIDE7XG4gICAgY29uc3QgY3VycmVudFF1ZXN0aW9uSWQgPSB0aGlzLnF1ZXN0aW9uc1tpbmRleF0/LmlkZW50aWZpZXI7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtYXNzZXQtdmFyaWFibGVdJykuZm9yRWFjaChpbWFnZSA9PiB7XG4gICAgICBjb25zdCBpbWFnZUlkID0gaW1hZ2UuZ2V0QXR0cmlidXRlKCdkYXRhLWFzc2V0LXZhcmlhYmxlJyk7XG4gICAgICBpbWFnZS5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ29wdGlvbi1pbWFnZScpO1xuICAgICAgaW1hZ2Uuc2V0QXR0cmlidXRlKCdpZCcsIGltYWdlSWQpO1xuICAgICAgXy5mb3JFYWNoKHRoaXMuY3VycmVudFF1ZXN0aW9uc01lZGlhLCAodmFsKSA9PiB7XG4gICAgICAgIGlmIChpbWFnZUlkID09PSB2YWwuaWQpIHtcbiAgICAgICAgICBpZiAodGhpcy5zZWN0aW9uQ29uZmlnLm1ldGFkYXRhLmlzQXZhaWxhYmxlTG9jYWxseSAmJiB0aGlzLnBhcmVudENvbmZpZy5iYXNlVXJsKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXN0aW9uSWQpIHtcbiAgICAgICAgICAgICAgaW1hZ2VbJ3NyYyddID0gYCR7dGhpcy5wYXJlbnRDb25maWcuYmFzZVVybH0vJHtjdXJyZW50UXVlc3Rpb25JZH0vJHt2YWwuc3JjfWA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmICh2YWwuYmFzZVVybCkge1xuICAgICAgICAgICAgaW1hZ2VbJ3NyYyddID0gdmFsLmJhc2VVcmwgKyB2YWwuc3JjO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBjb25zdCBkaXZFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBkaXZFbGVtZW50LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnbWFnbmlmeS1pY29uJyk7XG4gICAgICBkaXZFbGVtZW50Lm9uY2xpY2sgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy52aWV3ZXJTZXJ2aWNlLnJhaXNlSGVhcnRCZWF0RXZlbnQoZXZlbnROYW1lLnpvb21DbGlja2VkLCBUZWxlbWV0cnlUeXBlLmludGVyYWN0LCB0aGlzLm15Q2Fyb3VzZWwuZ2V0Q3VycmVudFNsaWRlSW5kZXgoKSk7XG4gICAgICAgIHRoaXMuem9vbUltZ1NyYyA9IGltYWdlWydzcmMnXTtcbiAgICAgICAgdGhpcy5zaG93Wm9vbU1vZGFsID0gdHJ1ZTtcbiAgICAgICAgY29uc3Qgem9vbUltYWdlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ltYWdlTW9kYWwnKTtcbiAgICAgICAgaWYgKHpvb21JbWFnZS5jbGllbnRIZWlnaHQgPiBpbWFnZS5jbGllbnRXaWR0aCkge1xuICAgICAgICAgIHpvb21JbWFnZS5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3BvcnRyYWl0Jyk7XG4gICAgICAgIH0gZWxzZSBpZiAoaW1hZ2UuY2xpZW50SGVpZ2h0IDwgaW1hZ2UuY2xpZW50V2lkdGgpIHtcbiAgICAgICAgICB6b29tSW1hZ2Uuc2V0QXR0cmlidXRlKCdjbGFzcycsICdsYW5kc2NhcGUnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB6b29tSW1hZ2Uuc2V0QXR0cmlidXRlKCdjbGFzcycsICduZXV0cmFsJyk7XG4gICAgICAgIH1cbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICB9O1xuICAgICAgaW1hZ2UucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoZGl2RWxlbWVudCwgaW1hZ2UubmV4dFNpYmxpbmcpO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gTWV0aG9kIE5hbWUgY2hhbmdlZFxuICB6b29tSW4oKSB7XG4gICAgdGhpcy52aWV3ZXJTZXJ2aWNlLnJhaXNlSGVhcnRCZWF0RXZlbnQoZXZlbnROYW1lLnpvb21JbkNsaWNrZWQsIFRlbGVtZXRyeVR5cGUuaW50ZXJhY3QsIHRoaXMubXlDYXJvdXNlbC5nZXRDdXJyZW50U2xpZGVJbmRleCgpKTtcbiAgICB0aGlzLmltYWdlWm9vbUNvdW50ID0gdGhpcy5pbWFnZVpvb21Db3VudCArIDEwO1xuICAgIHRoaXMuc2V0SW1hZ2VNb2RhbEhlaWdodFdpZHRoKCk7XG4gIH1cblxuICAvLyBNZXRob2QgTmFtZSBjaGFuZ2VkXG4gIHpvb21PdXQoKSB7XG4gICAgdGhpcy52aWV3ZXJTZXJ2aWNlLnJhaXNlSGVhcnRCZWF0RXZlbnQoZXZlbnROYW1lLnpvb21PdXRDbGlja2VkLCBUZWxlbWV0cnlUeXBlLmludGVyYWN0LCB0aGlzLm15Q2Fyb3VzZWwuZ2V0Q3VycmVudFNsaWRlSW5kZXgoKSk7XG4gICAgaWYgKHRoaXMuaW1hZ2Vab29tQ291bnQgPiAxMDApIHtcbiAgICAgIHRoaXMuaW1hZ2Vab29tQ291bnQgPSB0aGlzLmltYWdlWm9vbUNvdW50IC0gMTA7XG4gICAgICB0aGlzLnNldEltYWdlTW9kYWxIZWlnaHRXaWR0aCgpO1xuICAgIH1cbiAgfVxuXG4gIHNldEltYWdlTW9kYWxIZWlnaHRXaWR0aCgpIHtcbiAgICB0aGlzLmltYWdlTW9kYWwubmF0aXZlRWxlbWVudC5zdHlsZS53aWR0aCA9IGAke3RoaXMuaW1hZ2Vab29tQ291bnR9JWA7XG4gICAgdGhpcy5pbWFnZU1vZGFsLm5hdGl2ZUVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gYCR7dGhpcy5pbWFnZVpvb21Db3VudH0lYDtcbiAgfVxuXG4gIGNsb3NlWm9vbSgpIHtcbiAgICB0aGlzLnZpZXdlclNlcnZpY2UucmFpc2VIZWFydEJlYXRFdmVudChldmVudE5hbWUuem9vbUNsb3NlQ2xpY2tlZCwgVGVsZW1ldHJ5VHlwZS5pbnRlcmFjdCwgdGhpcy5teUNhcm91c2VsLmdldEN1cnJlbnRTbGlkZUluZGV4KCkpO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbWFnZU1vZGFsJykucmVtb3ZlQXR0cmlidXRlKCdzdHlsZScpO1xuICAgIHRoaXMuc2hvd1pvb21Nb2RhbCA9IGZhbHNlO1xuICB9XG4gIC8qIEVuZCBvZiBJbWFnZSB6b29tIHJlbGF0ZWQgKi9cblxuICBjbGVhclRpbWVJbnRlcnZhbCgpIHtcbiAgICBpZiAodGhpcy5pbnRlcnZhbFJlZikge1xuICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLmludGVydmFsUmVmKTtcbiAgICB9XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCd3aW5kb3c6YmVmb3JldW5sb2FkJylcbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5kZXN0cm95JC5uZXh0KHRydWUpO1xuICAgIHRoaXMuZGVzdHJveSQudW5zdWJzY3JpYmUoKTtcbiAgICB0aGlzLmVycm9yU2VydmljZS5nZXRJbnRlcm5ldENvbm5lY3Rpdml0eUVycm9yLnVuc3Vic2NyaWJlKCk7XG4gICAgaWYgKHRoaXMuc3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgfVxufVxuIl19