/**
 * @fileoverview added by tsickle
 * Generated from: lib/section-player/section-player.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { __assign } from "tslib";
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
var SectionPlayerComponent = /** @class */ (function () {
    function SectionPlayerComponent(viewerService, utilService, questionCursor, cdRef, errorService) {
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
    SectionPlayerComponent.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        this.subscribeToEvents();
        this.setConfig();
    };
    /**
     * @return {?}
     */
    SectionPlayerComponent.prototype.ngAfterViewInit = /**
     * @return {?}
     */
    function () {
        this.viewerService.raiseStartEvent(0);
        this.viewerService.raiseHeartBeatEvent(eventName.startPageLoaded, 'impression', 0);
    };
    /**
     * @private
     * @return {?}
     */
    SectionPlayerComponent.prototype.subscribeToEvents = /**
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        this.viewerService.qumlPlayerEvent.asObservable()
            .pipe(takeUntil(this.destroy$))
            .subscribe((/**
         * @param {?} res
         * @return {?}
         */
        function (res) {
            _this.playerEvent.emit(res);
        }));
        this.viewerService.qumlQuestionEvent
            .pipe(takeUntil(this.destroy$))
            .subscribe((/**
         * @param {?} res
         * @return {?}
         */
        function (res) {
            var _a, _b, _c, _d;
            if ((_a = res) === null || _a === void 0 ? void 0 : _a.error) {
                var traceId = ((_b = _this.sectionConfig) === null || _b === void 0 ? void 0 : _b.config).traceId;
                if (navigator.onLine && _this.viewerService.isAvailableLocally) {
                    _this.viewerService.raiseExceptionLog(errorCode.contentLoadFails, errorMessage.contentLoadFails, new Error(errorMessage.contentLoadFails), traceId);
                }
                else {
                    _this.viewerService.raiseExceptionLog(errorCode.internetConnectivity, errorMessage.internetConnectivity, new Error(errorMessage.internetConnectivity), traceId);
                }
                _this.showContentError = true;
                return;
            }
            if (!((_c = res) === null || _c === void 0 ? void 0 : _c.questions)) {
                return;
            }
            /** @type {?} */
            var unCommonQuestions = _.xorBy(_this.questions, res.questions, 'identifier');
            _this.questions = _.uniqBy(_this.questions.concat(unCommonQuestions), 'identifier');
            _this.sortQuestions();
            _this.viewerService.updateSectionQuestions(_this.sectionConfig.metadata.identifier, _this.questions);
            _this.cdRef.detectChanges();
            _this.noOfTimesApiCalled++;
            _this.loadView = true;
            if (_this.currentSlideIndex > 0 && _this.myCarousel) {
                _this.myCarousel.selectSlide(_this.currentSlideIndex);
                if (_this.questions[_this.currentSlideIndex - 1]) {
                    _this.currentQuestionsMedia = (_d = _this.questions[_this.currentSlideIndex - 1]) === null || _d === void 0 ? void 0 : _d.media;
                    _this.setImageZoom();
                    _this.highlightQuestion();
                }
            }
            if (_this.currentSlideIndex === 0) {
                if (_this.showStartPage) {
                    _this.active = _this.sectionIndex === 0;
                }
                else {
                    setTimeout((/**
                     * @return {?}
                     */
                    function () { _this.nextSlide(); }));
                }
            }
            _this.removeAttribute();
        }));
    };
    /**
     * @private
     * @return {?}
     */
    SectionPlayerComponent.prototype.setConfig = /**
     * @private
     * @return {?}
     */
    function () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1;
        this.noOfTimesApiCalled = 0;
        this.currentSlideIndex = 0;
        this.active = this.currentSlideIndex === 0 && this.sectionIndex === 0 && this.showStartPage;
        if (this.myCarousel) {
            this.myCarousel.selectSlide(this.currentSlideIndex);
        }
        this.sideMenuConfig = __assign(__assign({}, this.sideMenuConfig), (_b = (_a = this.sectionConfig) === null || _a === void 0 ? void 0 : _a.config) === null || _b === void 0 ? void 0 : _b.sideMenu);
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
            function () {
                /** @type {?} */
                var menuBtn = (/** @type {?} */ (document.querySelector('#overlay-button')));
                if (menuBtn) {
                    menuBtn.focus();
                }
            }), 100);
        }
        this.questionIdsCopy = _.cloneDeep(this.sectionConfig.metadata.childNodes);
        /** @type {?} */
        var maxQuestions = this.sectionConfig.metadata.maxQuestions;
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
        function (item) { return item.isActive; }))) === null || _z === void 0 ? void 0 : _z.children :
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
    };
    /**
     * @return {?}
     */
    SectionPlayerComponent.prototype.removeAttribute = /**
     * @return {?}
     */
    function () {
        setTimeout((/**
         * @return {?}
         */
        function () {
            /** @type {?} */
            var firstSlide = (/** @type {?} */ (document.querySelector('.carousel.slide')));
            if (firstSlide) {
                firstSlide.removeAttribute("tabindex");
            }
        }), 100);
    };
    /**
     * @return {?}
     */
    SectionPlayerComponent.prototype.sortQuestions = /**
     * @return {?}
     */
    function () {
        var _this = this;
        if (this.questions.length && this.questionIds.length) {
            /** @type {?} */
            var ques_1 = [];
            this.questionIds.forEach((/**
             * @param {?} questionId
             * @return {?}
             */
            function (questionId) {
                /** @type {?} */
                var que = _this.questions.find((/**
                 * @param {?} question
                 * @return {?}
                 */
                function (question) { return question.identifier === questionId; }));
                if (que) {
                    ques_1.push(que);
                }
            }));
            this.questions = ques_1;
        }
    };
    /**
     * @return {?}
     */
    SectionPlayerComponent.prototype.createSummaryObj = /**
     * @return {?}
     */
    function () {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        /** @type {?} */
        var classObj = _.groupBy(this.progressBarClass, 'class');
        return {
            skipped: ((_b = (_a = classObj) === null || _a === void 0 ? void 0 : _a.skipped) === null || _b === void 0 ? void 0 : _b.length) || 0,
            correct: ((_d = (_c = classObj) === null || _c === void 0 ? void 0 : _c.correct) === null || _d === void 0 ? void 0 : _d.length) || 0,
            wrong: ((_f = (_e = classObj) === null || _e === void 0 ? void 0 : _e.wrong) === null || _f === void 0 ? void 0 : _f.length) || 0,
            partial: ((_h = (_g = classObj) === null || _g === void 0 ? void 0 : _g.partial) === null || _h === void 0 ? void 0 : _h.length) || 0
        };
    };
    /**
     * @return {?}
     */
    SectionPlayerComponent.prototype.nextSlide = /**
     * @return {?}
     */
    function () {
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
            var option = this.currentOptionSelected && this.currentOptionSelected['option'] ? this.currentOptionSelected['option'] : undefined;
            /** @type {?} */
            var identifier = this.questions[this.myCarousel.getCurrentSlideIndex() - 1].identifier;
            /** @type {?} */
            var qType = this.questions[this.myCarousel.getCurrentSlideIndex() - 1].qType;
            this.viewerService.raiseResponseEvent(identifier, qType, option);
        }
        if (this.questions[this.myCarousel.getCurrentSlideIndex()]) {
            this.setSkippedClass(this.myCarousel.getCurrentSlideIndex());
        }
        this.myCarousel.move(this.carouselConfig.NEXT);
        this.setImageZoom();
        this.resetQuestionState();
        this.clearTimeInterval();
    };
    /**
     * @return {?}
     */
    SectionPlayerComponent.prototype.prevSlide = /**
     * @return {?}
     */
    function () {
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
    };
    /**
     * @return {?}
     */
    SectionPlayerComponent.prototype.getQuestion = /**
     * @return {?}
     */
    function () {
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
    };
    /**
     * @return {?}
     */
    SectionPlayerComponent.prototype.resetQuestionState = /**
     * @return {?}
     */
    function () {
        this.active = false;
        this.showAlert = false;
        this.optionSelectedObj = undefined;
        this.currentOptionSelected = undefined;
        this.currentQuestion = undefined;
        this.currentOptions = undefined;
        this.currentSolutions = undefined;
    };
    /**
     * @param {?} event
     * @return {?}
     */
    SectionPlayerComponent.prototype.activeSlideChange = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this.initialSlideDuration = new Date().getTime();
    };
    /**
     * @param {?} event
     * @return {?}
     */
    SectionPlayerComponent.prototype.nextSlideClicked = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
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
    };
    /**
     * @param {?} event
     * @return {?}
     */
    SectionPlayerComponent.prototype.previousSlideClicked = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        if (event.event === 'previous clicked') {
            if (this.optionSelectedObj && this.showFeedBack) {
                this.stopAutoNavigation = false;
                this.validateSelectedOption(this.optionSelectedObj, 'previous');
            }
            else {
                this.stopAutoNavigation = true;
                if (this.currentSlideIndex === 0 && this.parentConfig.isSectionsAvailable && this.getCurrentSectionIndex() > 0) {
                    /** @type {?} */
                    var previousSectionId = this.mainProgressBar[this.getCurrentSectionIndex() - 1].identifier;
                    this.jumpToSection(previousSectionId);
                    return;
                }
                this.prevSlide();
            }
        }
    };
    /**
     * @return {?}
     */
    SectionPlayerComponent.prototype.getCurrentSectionIndex = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var currentSectionId = this.sectionConfig.metadata.identifier;
        return this.mainProgressBar.findIndex((/**
         * @param {?} section
         * @return {?}
         */
        function (section) { return section.identifier === currentSectionId; }));
    };
    /**
     * @param {?} event
     * @param {?} index
     * @return {?}
     */
    SectionPlayerComponent.prototype.goToSlideClicked = /**
     * @param {?} event
     * @param {?} index
     * @return {?}
     */
    function (event, index) {
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
    };
    /**
     * @param {?} event
     * @param {?} index
     * @return {?}
     */
    SectionPlayerComponent.prototype.onEnter = /**
     * @param {?} event
     * @param {?} index
     * @return {?}
     */
    function (event, index) {
        if (event.keyCode === 13) {
            event.stopPropagation();
            this.goToSlideClicked(event, index);
        }
    };
    /**
     * @param {?} identifier
     * @return {?}
     */
    SectionPlayerComponent.prototype.jumpToSection = /**
     * @param {?} identifier
     * @return {?}
     */
    function (identifier) {
        this.showRootInstruction = false;
        this.emitSectionEnd(false, identifier);
    };
    /**
     * @param {?} event
     * @param {?} identifier
     * @return {?}
     */
    SectionPlayerComponent.prototype.onSectionEnter = /**
     * @param {?} event
     * @param {?} identifier
     * @return {?}
     */
    function (event, identifier) {
        if (event.keyCode === 13) {
            event.stopPropagation();
            if (this.optionSelectedObj) {
                this.validateSelectedOption(this.optionSelectedObj, 'jump');
            }
            this.jumpToSection(identifier);
        }
    };
    /**
     * @return {?}
     */
    SectionPlayerComponent.prototype.onScoreBoardClicked = /**
     * @return {?}
     */
    function () {
        this.viewerService.updateSectionQuestions(this.sectionConfig.metadata.identifier, this.questions);
        this.showScoreBoard.emit();
    };
    /**
     * @param {?} event
     * @return {?}
     */
    SectionPlayerComponent.prototype.onScoreBoardEnter = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        event.stopPropagation();
        if (event.keyCode === 13) {
            this.onScoreBoardClicked();
        }
    };
    /**
     * @return {?}
     */
    SectionPlayerComponent.prototype.focusOnNextButton = /**
     * @return {?}
     */
    function () {
        setTimeout((/**
         * @return {?}
         */
        function () {
            /** @type {?} */
            var nextBtn = (/** @type {?} */ (document.querySelector('.quml-navigation__next')));
            if (nextBtn) {
                nextBtn.focus();
            }
        }), 100);
    };
    /**
     * @param {?} optionSelected
     * @return {?}
     */
    SectionPlayerComponent.prototype.getOptionSelected = /**
     * @param {?} optionSelected
     * @return {?}
     */
    function (optionSelected) {
        var _this = this;
        var _a;
        this.focusOnNextButton();
        this.active = true;
        this.currentOptionSelected = optionSelected;
        /** @type {?} */
        var currentIndex = this.myCarousel.getCurrentSlideIndex() - 1;
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
            function (ele, index) {
                if (ele.type === 'video') {
                    _this.media.forEach((/**
                     * @param {?} e
                     * @return {?}
                     */
                    function (e) {
                        if (e.id === _this.currentSolutions[index].value) {
                            _this.currentSolutions[index].type = 'video';
                            _this.currentSolutions[index].src = e.src;
                            _this.currentSolutions[index].thumbnail = e.thumbnail;
                        }
                    }));
                }
            }));
        }
        if (!this.showFeedBack) {
            this.validateSelectedOption(this.optionSelectedObj);
        }
    };
    /**
     * @return {?}
     */
    SectionPlayerComponent.prototype.durationEnds = /**
     * @return {?}
     */
    function () {
        this.showSolution = false;
        this.showAlert = false;
        this.emitSectionEnd(true);
    };
    /**
     * @private
     * @param {?} compatibilityLevel
     * @return {?}
     */
    SectionPlayerComponent.prototype.checkCompatibilityLevel = /**
     * @private
     * @param {?} compatibilityLevel
     * @return {?}
     */
    function (compatibilityLevel) {
        var _a, _b;
        if (compatibilityLevel) {
            /** @type {?} */
            var checkContentCompatible = this.errorService.checkContentCompatibility(compatibilityLevel);
            if (!checkContentCompatible.isCompitable) {
                this.viewerService.raiseExceptionLog(errorCode.contentCompatibility, errorMessage.contentCompatibility, checkContentCompatible.error, (_b = (_a = this.sectionConfig) === null || _a === void 0 ? void 0 : _a.config) === null || _b === void 0 ? void 0 : _b.traceId);
            }
        }
    };
    /**
     * @param {?=} isDurationEnded
     * @param {?=} jumpToSection
     * @return {?}
     */
    SectionPlayerComponent.prototype.emitSectionEnd = /**
     * @param {?=} isDurationEnded
     * @param {?=} jumpToSection
     * @return {?}
     */
    function (isDurationEnded, jumpToSection) {
        if (isDurationEnded === void 0) { isDurationEnded = false; }
        /** @type {?} */
        var eventObj = {
            summary: this.createSummaryObj(),
            score: this.calculateScore(),
            durationSpent: this.utilService.getTimeSpentText(this.initialTime),
            slideIndex: this.myCarousel.getCurrentSlideIndex(),
            isDurationEnded: isDurationEnded,
        };
        if (jumpToSection) {
            eventObj.jumpToSection = jumpToSection;
        }
        this.viewerService.updateSectionQuestions(this.sectionConfig.metadata.identifier, this.questions);
        this.sectionEnd.emit(eventObj);
    };
    /**
     * @param {?} event
     * @return {?}
     */
    SectionPlayerComponent.prototype.closeAlertBox = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        var _this = this;
        var _a, _b;
        if (((_a = event) === null || _a === void 0 ? void 0 : _a.type) === 'close') {
            this.viewerService.raiseHeartBeatEvent(eventName.closedFeedBack, TelemetryType.interact, this.myCarousel.getCurrentSlideIndex());
        }
        else if (((_b = event) === null || _b === void 0 ? void 0 : _b.type) === 'tryAgain') {
            this.tryAgainClicked = true;
            setTimeout((/**
             * @return {?}
             */
            function () {
                _this.tryAgainClicked = false;
            }), 2000);
            this.viewerService.raiseHeartBeatEvent(eventName.tryAgain, TelemetryType.interact, this.myCarousel.getCurrentSlideIndex());
        }
        this.showAlert = false;
    };
    /**
     * @param {?} index
     * @return {?}
     */
    SectionPlayerComponent.prototype.setSkippedClass = /**
     * @param {?} index
     * @return {?}
     */
    function (index) {
        if (this.progressBarClass && _.get(this.progressBarClass[index], 'class') === 'unattempted') {
            this.progressBarClass[index].class = 'skipped';
        }
    };
    /**
     * @param {?} event
     * @return {?}
     */
    SectionPlayerComponent.prototype.sideBarEvents = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        if (event.type === 'OPEN_MENU' || event.type === 'CLOSE_MENU') {
            this.handleSideBarAccessibility(event);
        }
        this.viewerService.raiseHeartBeatEvent(event.type, TelemetryType.interact, this.myCarousel.getCurrentSlideIndex() + 1);
    };
    /**
     * @param {?} event
     * @return {?}
     */
    SectionPlayerComponent.prototype.handleSideBarAccessibility = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        var _this = this;
        var _a, _b;
        /** @type {?} */
        var navBlock = (/** @type {?} */ (document.querySelector('.navBlock')));
        /** @type {?} */
        var overlayInput = (/** @type {?} */ (document.querySelector('#overlay-input')));
        /** @type {?} */
        var overlayButton = (/** @type {?} */ (document.querySelector('#overlay-button')));
        /** @type {?} */
        var sideBarList = (/** @type {?} */ (document.querySelector('#sidebar-list')));
        if (event.type === 'OPEN_MENU') {
            /** @type {?} */
            var isMobile = (_b = (_a = this.sectionConfig.config) === null || _a === void 0 ? void 0 : _a.sideMenu) === null || _b === void 0 ? void 0 : _b.showExit;
            this.disabledHandle = isMobile ? maintain.hidden({ filter: [sideBarList, overlayButton, overlayInput] }) : maintain.tabFocus({ context: navBlock });
            this.subscription = fromEvent(document, 'keydown').subscribe((/**
             * @param {?} e
             * @return {?}
             */
            function (e) {
                if (e['key'] === 'Escape') {
                    /** @type {?} */
                    var inputChecked = (/** @type {?} */ (document.getElementById('overlay-input')));
                    inputChecked.checked = false;
                    document.getElementById('playerSideMenu').style.visibility = 'hidden';
                    document.querySelector('.navBlock').style.marginLeft = '-100%';
                    _this.viewerService.raiseHeartBeatEvent('CLOSE_MENU', TelemetryType.interact, _this.myCarousel.getCurrentSlideIndex() + 1);
                    _this.disabledHandle.disengage();
                    _this.subscription.unsubscribe();
                    _this.disabledHandle = null;
                    _this.subscription = null;
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
    };
    /**
     * @param {?} option
     * @param {?=} type
     * @return {?}
     */
    SectionPlayerComponent.prototype.validateSelectedOption = /**
     * @param {?} option
     * @param {?=} type
     * @return {?}
     */
    function (option, type) {
        var _a, _b, _c;
        /** @type {?} */
        var selectedOptionValue = (_b = (_a = option) === null || _a === void 0 ? void 0 : _a.option) === null || _b === void 0 ? void 0 : _b.value;
        /** @type {?} */
        var currentIndex = this.myCarousel.getCurrentSlideIndex() - 1;
        /** @type {?} */
        var isQuestionSkipAllowed = !this.optionSelectedObj &&
            this.allowSkip && this.utilService.getQuestionType(this.questions, currentIndex) === 'MCQ';
        /** @type {?} */
        var isSubjectiveQuestion = this.utilService.getQuestionType(this.questions, currentIndex) === 'SA';
        /** @type {?} */
        var onStartPage = this.startPageInstruction && this.myCarousel.getCurrentSlideIndex() === 0;
        /** @type {?} */
        var isActive = !this.optionSelectedObj && this.active;
        /** @type {?} */
        var selectedQuestion = this.questions[currentIndex];
        if (this.optionSelectedObj) {
            /** @type {?} */
            var key = this.utilService.getKeyValue(Object.keys(selectedQuestion.responseDeclaration));
            this.currentQuestion = selectedQuestion.body;
            this.currentOptions = selectedQuestion.interactions[key].options;
            /** @type {?} */
            var getParams = (/**
             * @return {?}
             */
            function () {
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
                var correctOptionValue = Number(selectedQuestion.responseDeclaration[key].correctResponse.value);
                this.slideDuration = Math.round((new Date().getTime() - this.initialSlideDuration) / 1000);
                /** @type {?} */
                var edataItem = {
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
                    var currentScore = this.getScore(currentIndex, key, true);
                    this.viewerService.raiseAssesEvent(edataItem, currentIndex + 1, 'Yes', currentScore, [option.option], this.slideDuration);
                    this.alertType = 'correct';
                    if (this.showFeedBack)
                        this.correctFeedBackTimeOut(type);
                    this.updateScoreBoard(currentIndex, 'correct', undefined, currentScore);
                }
                else {
                    /** @type {?} */
                    var currentScore = this.getScore(currentIndex, key, false, option);
                    this.alertType = 'wrong';
                    /** @type {?} */
                    var classType = this.progressBarClass[currentIndex].class === 'partial' ? 'partial' : 'wrong';
                    this.updateScoreBoard(currentIndex, classType, selectedOptionValue, currentScore);
                }
            }
            if (option.cardinality === 'multiple') {
                /** @type {?} */
                var responseDeclaration = this.questions[currentIndex].responseDeclaration;
                /** @type {?} */
                var currentScore = this.utilService.getMultiselectScore(option.option, responseDeclaration);
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
    };
    /**
     * @return {?}
     */
    SectionPlayerComponent.prototype.infoPopupTimeOut = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.infoPopup = true;
        setTimeout((/**
         * @return {?}
         */
        function () {
            _this.infoPopup = false;
        }), 2000);
    };
    /**
     * @param {?=} type
     * @return {?}
     */
    SectionPlayerComponent.prototype.correctFeedBackTimeOut = /**
     * @param {?=} type
     * @return {?}
     */
    function (type) {
        var _this = this;
        this.intervalRef = setTimeout((/**
         * @return {?}
         */
        function () {
            _this.showAlert = false;
            if (!_this.myCarousel.isLast(_this.myCarousel.getCurrentSlideIndex()) && type === 'next') {
                _this.nextSlide();
            }
            else if (type === 'previous' && !_this.stopAutoNavigation) {
                _this.prevSlide();
            }
            else if (type === 'jump' && !_this.stopAutoNavigation) {
                _this.goToSlide(_this.jumpSlideIndex);
            }
            else if (_this.myCarousel.isLast(_this.myCarousel.getCurrentSlideIndex())) {
                _this.endPageReached = true;
                _this.emitSectionEnd();
            }
        }), 4000);
    };
    /**
     * @param {?} index
     * @return {?}
     */
    SectionPlayerComponent.prototype.goToSlide = /**
     * @param {?} index
     * @return {?}
     */
    function (index) {
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
    };
    /**
     * @param {?} event
     * @return {?}
     */
    SectionPlayerComponent.prototype.goToQuestion = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this.active = false;
        this.showRootInstruction = false;
        this.disableNext = false;
        this.initializeTimer = true;
        /** @type {?} */
        var index = event.questionNo;
        this.viewerService.getQuestions(0, index);
        this.currentSlideIndex = index;
        this.myCarousel.selectSlide(index);
        this.highlightQuestion();
    };
    /**
     * @return {?}
     */
    SectionPlayerComponent.prototype.highlightQuestion = /**
     * @return {?}
     */
    function () {
        var _a, _b, _c;
        /** @type {?} */
        var currentQuestion = this.questions[this.currentSlideIndex - 1];
        /** @type {?} */
        var questionType = (_b = (_a = currentQuestion) === null || _a === void 0 ? void 0 : _a.qType) === null || _b === void 0 ? void 0 : _b.toUpperCase();
        /** @type {?} */
        var element = (/** @type {?} */ (document.getElementById((_c = currentQuestion) === null || _c === void 0 ? void 0 : _c.identifier)));
        if (element && questionType) {
            /** @type {?} */
            var questionTitleElement_1;
            switch (questionType) {
                case 'MCQ':
                    questionTitleElement_1 = (/** @type {?} */ (element.querySelector('.mcq-title')));
                    break;
                default:
                    questionTitleElement_1 = (/** @type {?} */ (element.querySelector('.question-container')));
            }
            if (questionTitleElement_1) {
                setTimeout((/**
                 * @return {?}
                 */
                function () {
                    questionTitleElement_1.focus();
                }), 0);
            }
        }
    };
    /**
     * @return {?}
     */
    SectionPlayerComponent.prototype.getSolutions = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.showAlert = false;
        this.viewerService.raiseHeartBeatEvent(eventName.showAnswer, TelemetryType.interact, this.myCarousel.getCurrentSlideIndex());
        this.viewerService.raiseHeartBeatEvent(eventName.showAnswer, TelemetryType.impression, this.myCarousel.getCurrentSlideIndex());
        /** @type {?} */
        var currentIndex = this.myCarousel.getCurrentSlideIndex() - 1;
        this.currentQuestion = this.questions[currentIndex].body;
        this.currentOptions = this.questions[currentIndex].interactions.response1.options;
        this.currentQuestionsMedia = _.get(this.questions[currentIndex], 'media');
        setTimeout((/**
         * @return {?}
         */
        function () {
            _this.setImageZoom();
        }));
        setTimeout((/**
         * @return {?}
         */
        function () {
            _this.setImageHeightWidthClass();
        }), 100);
        if (this.currentSolutions) {
            this.showSolution = true;
        }
        this.clearTimeInterval();
    };
    /**
     * @return {?}
     */
    SectionPlayerComponent.prototype.viewSolution = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.viewerService.raiseHeartBeatEvent(eventName.viewSolutionClicked, TelemetryType.interact, this.myCarousel.getCurrentSlideIndex());
        this.showSolution = true;
        this.showAlert = false;
        this.currentQuestionsMedia = _.get(this.questions[this.myCarousel.getCurrentSlideIndex() - 1], 'media');
        setTimeout((/**
         * @return {?}
         */
        function () {
            _this.setImageZoom();
            _this.setImageHeightWidthClass();
        }));
        clearTimeout(this.intervalRef);
    };
    /**
     * @return {?}
     */
    SectionPlayerComponent.prototype.closeSolution = /**
     * @return {?}
     */
    function () {
        this.setImageZoom();
        this.viewerService.raiseHeartBeatEvent(eventName.solutionClosed, TelemetryType.interact, this.myCarousel.getCurrentSlideIndex());
        this.showSolution = false;
        this.myCarousel.selectSlide(this.currentSlideIndex);
        this.focusOnNextButton();
    };
    /**
     * @return {?}
     */
    SectionPlayerComponent.prototype.viewHint = /**
     * @return {?}
     */
    function () {
        this.viewerService.raiseHeartBeatEvent(eventName.viewHint, TelemetryType.interact, this.myCarousel.getCurrentSlideIndex());
    };
    /**
     * @param {?} event
     * @param {?=} question
     * @return {?}
     */
    SectionPlayerComponent.prototype.showAnswerClicked = /**
     * @param {?} event
     * @param {?=} question
     * @return {?}
     */
    function (event, question) {
        var _a;
        if ((_a = event) === null || _a === void 0 ? void 0 : _a.showAnswer) {
            this.focusOnNextButton();
            this.active = true;
            this.progressBarClass[this.myCarousel.getCurrentSlideIndex() - 1].class = 'correct';
            if (question) {
                /** @type {?} */
                var index = this.questions.findIndex((/**
                 * @param {?} que
                 * @return {?}
                 */
                function (que) { return que.identifier === question.identifier; }));
                if (index > -1) {
                    this.questions[index].isAnswerShown = true;
                    this.viewerService.updateSectionQuestions(this.sectionConfig.metadata.identifier, this.questions);
                }
            }
            this.viewerService.raiseHeartBeatEvent(eventName.showAnswer, TelemetryType.interact, pageId.shortAnswer);
            this.viewerService.raiseHeartBeatEvent(eventName.pageScrolled, TelemetryType.impression, this.myCarousel.getCurrentSlideIndex() - 1);
        }
    };
    /**
     * @param {?} currentIndex
     * @param {?} key
     * @param {?} isCorrectAnswer
     * @param {?=} selectedOption
     * @return {?}
     */
    SectionPlayerComponent.prototype.getScore = /**
     * @param {?} currentIndex
     * @param {?} key
     * @param {?} isCorrectAnswer
     * @param {?=} selectedOption
     * @return {?}
     */
    function (currentIndex, key, isCorrectAnswer, selectedOption) {
        var _this = this;
        if (isCorrectAnswer) {
            return this.questions[currentIndex].responseDeclaration[key].correctResponse.outcomes.SCORE ?
                this.questions[currentIndex].responseDeclaration[key].correctResponse.outcomes.SCORE :
                this.questions[currentIndex].responseDeclaration[key].maxScore || 1;
        }
        else {
            /** @type {?} */
            var selectedOptionValue_1 = selectedOption.option.value;
            /** @type {?} */
            var mapping = this.questions[currentIndex].responseDeclaration.mapping;
            /** @type {?} */
            var score_1 = 0;
            if (mapping) {
                mapping.forEach((/**
                 * @param {?} val
                 * @return {?}
                 */
                function (val) {
                    if (selectedOptionValue_1 === val.response) {
                        score_1 = val.outcomes.SCORE || 0;
                        if (val.outcomes.SCORE) {
                            _this.progressBarClass[currentIndex].class = 'partial';
                        }
                    }
                }));
            }
            return score_1;
        }
    };
    /**
     * @return {?}
     */
    SectionPlayerComponent.prototype.calculateScore = /**
     * @return {?}
     */
    function () {
        return this.progressBarClass.reduce((/**
         * @param {?} accumulator
         * @param {?} element
         * @return {?}
         */
        function (accumulator, element) { return accumulator + element.score; }), 0);
    };
    /**
     * @param {?} index
     * @param {?} classToBeUpdated
     * @param {?=} optionValue
     * @param {?=} score
     * @return {?}
     */
    SectionPlayerComponent.prototype.updateScoreBoard = /**
     * @param {?} index
     * @param {?} classToBeUpdated
     * @param {?=} optionValue
     * @param {?=} score
     * @return {?}
     */
    function (index, classToBeUpdated, optionValue, score) {
        var _this = this;
        this.progressBarClass.forEach((/**
         * @param {?} ele
         * @return {?}
         */
        function (ele) {
            if (ele.index - 1 === index) {
                ele.class = classToBeUpdated;
                ele.score = score ? score : 0;
                if (!_this.showFeedBack) {
                    ele.value = optionValue;
                }
            }
        }));
    };
    /* End of score methods  */
    /* Start of Image zoom related */
    /* End of score methods  */
    /* Start of Image zoom related */
    /**
     * @return {?}
     */
    SectionPlayerComponent.prototype.setImageHeightWidthClass = /* End of score methods  */
    /* Start of Image zoom related */
    /**
     * @return {?}
     */
    function () {
        document.querySelectorAll('[data-asset-variable]').forEach((/**
         * @param {?} image
         * @return {?}
         */
        function (image) {
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
    };
    /**
     * @return {?}
     */
    SectionPlayerComponent.prototype.setImageZoom = /**
     * @return {?}
     */
    function () {
        var _this = this;
        var _a;
        /** @type {?} */
        var index = this.myCarousel.getCurrentSlideIndex() - 1;
        /** @type {?} */
        var currentQuestionId = (_a = this.questions[index]) === null || _a === void 0 ? void 0 : _a.identifier;
        document.querySelectorAll('[data-asset-variable]').forEach((/**
         * @param {?} image
         * @return {?}
         */
        function (image) {
            /** @type {?} */
            var imageId = image.getAttribute('data-asset-variable');
            image.setAttribute('class', 'option-image');
            image.setAttribute('id', imageId);
            _.forEach(_this.currentQuestionsMedia, (/**
             * @param {?} val
             * @return {?}
             */
            function (val) {
                if (imageId === val.id) {
                    if (_this.sectionConfig.metadata.isAvailableLocally && _this.parentConfig.baseUrl) {
                        if (currentQuestionId) {
                            image['src'] = _this.parentConfig.baseUrl + "/" + currentQuestionId + "/" + val.src;
                        }
                    }
                    else if (val.baseUrl) {
                        image['src'] = val.baseUrl + val.src;
                    }
                }
            }));
            /** @type {?} */
            var divElement = document.createElement('div');
            divElement.setAttribute('class', 'magnify-icon');
            divElement.onclick = (/**
             * @param {?} event
             * @return {?}
             */
            function (event) {
                _this.viewerService.raiseHeartBeatEvent(eventName.zoomClicked, TelemetryType.interact, _this.myCarousel.getCurrentSlideIndex());
                _this.zoomImgSrc = image['src'];
                _this.showZoomModal = true;
                /** @type {?} */
                var zoomImage = document.getElementById('imageModal');
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
    };
    // Method Name changed
    // Method Name changed
    /**
     * @return {?}
     */
    SectionPlayerComponent.prototype.zoomIn = 
    // Method Name changed
    /**
     * @return {?}
     */
    function () {
        this.viewerService.raiseHeartBeatEvent(eventName.zoomInClicked, TelemetryType.interact, this.myCarousel.getCurrentSlideIndex());
        this.imageZoomCount = this.imageZoomCount + 10;
        this.setImageModalHeightWidth();
    };
    // Method Name changed
    // Method Name changed
    /**
     * @return {?}
     */
    SectionPlayerComponent.prototype.zoomOut = 
    // Method Name changed
    /**
     * @return {?}
     */
    function () {
        this.viewerService.raiseHeartBeatEvent(eventName.zoomOutClicked, TelemetryType.interact, this.myCarousel.getCurrentSlideIndex());
        if (this.imageZoomCount > 100) {
            this.imageZoomCount = this.imageZoomCount - 10;
            this.setImageModalHeightWidth();
        }
    };
    /**
     * @return {?}
     */
    SectionPlayerComponent.prototype.setImageModalHeightWidth = /**
     * @return {?}
     */
    function () {
        this.imageModal.nativeElement.style.width = this.imageZoomCount + "%";
        this.imageModal.nativeElement.style.height = this.imageZoomCount + "%";
    };
    /**
     * @return {?}
     */
    SectionPlayerComponent.prototype.closeZoom = /**
     * @return {?}
     */
    function () {
        this.viewerService.raiseHeartBeatEvent(eventName.zoomCloseClicked, TelemetryType.interact, this.myCarousel.getCurrentSlideIndex());
        document.getElementById('imageModal').removeAttribute('style');
        this.showZoomModal = false;
    };
    /* End of Image zoom related */
    /* End of Image zoom related */
    /**
     * @return {?}
     */
    SectionPlayerComponent.prototype.clearTimeInterval = /* End of Image zoom related */
    /**
     * @return {?}
     */
    function () {
        if (this.intervalRef) {
            clearInterval(this.intervalRef);
        }
    };
    /**
     * @return {?}
     */
    SectionPlayerComponent.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
        this.errorService.getInternetConnectivityError.unsubscribe();
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    };
    SectionPlayerComponent.decorators = [
        { type: Component, args: [{
                    selector: 'quml-section-player',
                    template: "<div class=\"quml-container\" *ngIf=\"loadView\" [hidden]=\"showZoomModal\">\n  <div [hidden]=\"showSolution\" class=\"quml-landscape\">\n    <sb-player-side-menu-icon class=\"notVisible\" *ngIf=\"sideMenuConfig.enable\" (sidebarMenuEvent)=\"sideBarEvents($event)\"></sb-player-side-menu-icon>\n    <quml-header class=\"main-header\" (durationEnds)=\"durationEnds()\" [disablePreviousNavigation]=\"linearNavigation\"\n      [duration]=\"timeLimit\" [warningTime]=\"warningTime\" [showTimer]=\"showTimer\"\n      (nextSlideClicked)=\"nextSlideClicked($event)\" (prevSlideClicked)=\"previousSlideClicked($event)\"\n      [currentSlideIndex]=\"currentSlideIndex\" [totalNoOfQuestions]=\"noOfQuestions\" [active]=\"active\"\n      [showFeedBack]=\"showFeedBack\" [currentSolutions]=\"currentSolutions\" (showSolution)=\"viewSolution()\"\n      [initializeTimer]=\"initializeTimer\" [replayed]=\"parentConfig?.isReplayed\" [disableNext]=\"disableNext\"\n      [startPageInstruction]=\"startPageInstruction\" [attempts]=\"attempts\" [showStartPage]=\"showStartPage\">\n    </quml-header>\n\n    <sb-player-sidebar [title]=\"parentConfig?.contentName\" (sidebarEvent)=\"sideBarEvents($event)\"\n      [config]=\"sideMenuConfig\">\n    </sb-player-sidebar>\n    <div class=\"landscape-mode\">\n      <div class=\"lanscape-mode-left\">\n        <div class=\"current-slide\" *ngIf=\"!showRootInstruction\">\n          {{myCarousel.getCurrentSlideIndex()}}/{{noOfQuestions}}\n        </div>\n        <div *ngIf=\"currentSolutions && showUserSolution\">\n          <quml-ans (click)=\"getSolutions()\"></quml-ans>\n        </div>\n      </div>\n      <div class=\"landscape-content\">\n        <carousel class=\"landscape-center\" [interval]=\"0\" [showIndicators]=\"false\" [noWrap]=\"true\" #myCarousel (activeSlideChange)=\"activeSlideChange($event)\">\n          <slide>\n            <quml-startpage [instructions]=\"showRootInstruction ? parentConfig?.instructions : sectionConfig.metadata?.instructions?.default || parentConfig?.instructions\"  [points]=\"points\"\n              [time]=\"showRootInstruction ? timeLimit : null\" [showTimer]=\"showTimer\" [totalNoOfQuestions]=\"showRootInstruction ? parentConfig?.questionCount : noOfQuestions\"\n              [contentName]=\"showRootInstruction ? parentConfig?.contentName : parentConfig?.isSectionsAvailable ? sectionConfig?.metadata?.name : parentConfig?.contentName\">\n            </quml-startpage>\n          </slide>\n          <slide *ngFor=\"let question of questions; let i= index\" #questionSlide>\n            <div [id]=\"question.identifier\">\n              <div *ngIf=\"question?.primaryCategory.toLowerCase() === 'multiple choice question'\">\n                <quml-mcq [question]='question' [replayed]=\"parentConfig?.isReplayed\"\n                  (optionSelected)=\"getOptionSelected($event)\" [identifier]=\"question.id\" [tryAgain]=\"tryAgainClicked\">\n                </quml-mcq>\n              </div>\n              <div *ngIf=\"question?.primaryCategory.toLowerCase() === 'subjective question'\">\n                <quml-sa [questions]='question' [replayed]=\"parentConfig?.isReplayed\" [baseUrl]=\"parentConfig?.baseUrl\"\n                  (showAnswerClicked)=\"showAnswerClicked($event, question)\">\n                </quml-sa>\n              </div>\n            </div>\n          </slide>\n        </carousel>\n      </div>\n      <div class=\"lanscape-mode-right\">\n        <ul>\n          <ng-container>\n            <li class=\"showFeedBack-progressBar info-page hover-effect\" tabindex=\"0\"\n            [ngClass]=\"(currentSlideIndex === 0) ? 'att-color progressBar-border': 'att-color' \"\n            (keydown)=\"onEnter($event, 0)\" (click)=\"goToSlideClicked($event, 0)\">i\n            </li>\n            <li>\n              <ul *ngIf=\"parentConfig?.isSectionsAvailable\" class=\"scoreboard-sections\">\n                <li class=\"section relative\" *ngFor=\"let section of mainProgressBar; let i=index;\" attr.aria-label=\"section {{section?.index}}\"\n                  (click)=\"jumpToSection(section?.identifier)\" (keydown)=\"onSectionEnter($event, section?.identifier)\"\n                  [ngClass]=\"{'attempted' : section.class === 'attempted', 'partial': section.class === 'partial'}\">\n                  <label for=\"list-item-{{i}}\" class=\"progressBar-border\" [ngClass] = \"{'active' : section?.isActive && !showRootInstruction && section.class !== 'attempted'}\" tabindex=\"0\">{{section?.index}}</label>\n                  <ul *ngIf=\"section?.isActive && showFeedBack\">\n                    <li *ngFor=\"let question of progressBarClass; let j=index\" tabindex=\"0\" attr.aria-label=\"question number {{question?.index}}\"\n                      (click)=\"goToSlideClicked($event, question?.index)\" (keydown)=\"onEnter($event, question?.index)\" class=\"showFeedBack-progressBar\"\n                      [ngClass]=\"(j+1) === myCarousel.getCurrentSlideIndex() ? (question.class === 'skipped' ? 'progressBar-border' : 'progressBar-border ' + question.class) : question.class\">\n                      {{question?.index}}\n                    </li>\n                  </ul>\n                  <ul class=\"nonFeedback\" *ngIf=\"section?.isActive && !showFeedBack\">\n                    <li *ngFor=\"let question of progressBarClass; let j=index\" tabindex=\"0\" attr.aria-label=\"question number {{question?.index}}\"\n                      (click)=\"goToSlideClicked($event, question?.index)\" (keydown)=\"onEnter($event, question?.index)\" class=\"showFeedBack-progressBar\"\n                      [ngClass]=\"(j+1) === myCarousel.getCurrentSlideIndex() ? (question.class === 'skipped' ? 'progressBar-border' : 'att-color progressBar-border') : question.class === 'skipped' ? question.class: question.class === 'unattempted' ? '' : 'att-color'\">\n                      {{question?.index}}\n                    </li>\n                  </ul>\n                </li>\n              </ul>\n            </li>\n           <li>\n            <ul class=\"singleContent\" *ngIf=\"!parentConfig?.isSectionsAvailable && showFeedBack\">\n              <li *ngFor=\"let question of progressBarClass; let j=index\" tabindex=\"0\" attr.aria-label=\"question number {{question?.index}}\"\n                (click)=\"goToSlideClicked($event, question?.index)\" (keydown)=\"onEnter($event, question?.index)\" class=\"showFeedBack-progressBar hover-effect\"\n                [ngClass]=\"(j+1) === myCarousel.getCurrentSlideIndex() ? (question.class === 'skipped' ? 'progressBar-border' : 'progressBar-border ' + question.class) : question.class\">\n                {{question?.index}}\n              </li>\n            </ul>\n           </li>\n          <li>\n            <ul class=\"singleContent nonFeedback\" *ngIf=\"!parentConfig?.isSectionsAvailable && !showFeedBack\">\n              <li *ngFor=\"let question of progressBarClass; let j=index\" tabindex=\"0\" attr.aria-label=\"question number {{question?.index}}\"\n                (click)=\"goToSlideClicked($event, question?.index)\" (keydown)=\"onEnter($event, question?.index)\" class=\"showFeedBack-progressBar hover-effect\"\n                [ngClass]=\"(j+1) === myCarousel.getCurrentSlideIndex() ? (question.class === 'skipped' ? 'progressBar-border' : 'att-color progressBar-border') : question.class === 'skipped' ? question.class: question.class === 'unattempted' ? '' : 'att-color'\">\n                {{question?.index}}\n              </li>\n            </ul>\n          </li>\n            <li class=\"requiresSubmit cursor-pointer showFeedBack-progressBar hover-effect\" tabindex=\"0\" aria-label=\"scoreboard\" *ngIf=\"parentConfig.requiresSubmit && progressBarClass?.length\"\n              (click)=\"disableNext = true; onScoreBoardClicked()\" (keydown)=\"onScoreBoardEnter($event)\">\n              <img src=\"./assets/flag_inactive.svg\" alt=\"Flag logo: Show scoreboard\">\n            </li>\n            <!-- <li class=\"requiresSubmit\" *ngIf=\"loadScoreBoard && parentConfig.requiresSubmit\">\n              <img src=\"./assets/flag_active.svg\" alt=\"\">\n            </li> -->\n          </ng-container>\n        </ul>\n      </div>\n    </div>\n  </div>\n\n  <quml-alert *ngIf=\"showAlert && showFeedBack\" [alertType]=\"alertType\" [isHintAvailable]=\"showHints\"\n    [showSolutionButton]=\"showUserSolution\" (showSolution)=\"viewSolution()\" (showHint)=\"viewHint()\"\n    (closeAlert)=\"closeAlertBox($event)\"></quml-alert>\n\n  <quml-mcq-solutions *ngIf=\"showSolution\" [question]=\"currentQuestion\" [options]=\"currentOptions\"\n    [solutions]=\"currentSolutions\" (close)=\"closeSolution()\"></quml-mcq-solutions>\n</div>\n\n<div class=\"info-popup\" *ngIf=\"infoPopup\">\n  Please attempt the question\n</div>\n\n<sb-player-contenterror *ngIf=\"showContentError\"></sb-player-contenterror>\n\n\n<!-- Zoom -->\n<div class=\"image-viewer__overlay\" [hidden]=\"!showZoomModal\">\n  <div class=\"image-viewer__close\" (click)=\"closeZoom()\">\n  </div>\n  <div class=\"image-viewer__container\">\n    <img #imageModal id=\"imageModal\" class=\"image-viewer__img\" [src]=\"zoomImgSrc\" alt=\"Zoomed image\">\n  </div>\n  <div class=\"image-viewer__zoom\">\n    <div class=\"image-viewer__zoomin\" (click)=\"zoomIn()\"></div>\n    <div class=\"image-viewer__zoomout\" (click)=\"zoomOut()\"></div>\n  </div>\n</div>",
                    styles: ["@charset \"UTF-8\";::ng-deep :root{--quml-scoreboard-sub-title:#6D7278;--quml-scoreboard-skipped:#969696;--quml-scoreboard-unattempted:#575757;--quml-color-success:#08BC82;--quml-color-danger:#F1635D;--quml-color-primary-contrast:#333;--quml-btn-border:#ccc;--quml-heder-text-color:#6250f5;--quml-header-bg-color:#c2c2c2;--quml-mcq-title-txt:#131415;--quml-zoom-btn-txt:#eee;--quml-zoom-btn-hover:#f2f2f2;--quml-main-bg:#fff;--quml-btn-color:#fff;--quml-question-bg:#fff}.quml-header{background:var(--quml-header-bg-color);display:flow-root;height:2.25rem;position:fixed}.quml-container{overflow:hidden;width:100%;height:100%;position:relative}.quml-landscape{width:100%;height:100%}::ng-deep .carousel{outline:0}.col{padding-left:0;padding-right:0}.quml-button-container{margin-right:1.5rem;float:right}.quml-button{background-color:var(--primary-color);border:none;color:var(--quml-btn-color);padding:.25rem;text-align:center;text-decoration:none;font-size:1rem;margin:.125rem .5rem .125rem .125rem;cursor:pointer;width:3rem;height:2.5rem;border-radius:10%}.landscape-mode{height:100%;width:100%;position:relative;background-color:var(--quml-main-bg)}.landscape-content{padding:2.5rem 4rem 0;overflow:auto;height:100%;width:100%}@media only screen and (max-width:480px){.landscape-content{padding:5rem 1rem 0;height:calc(100% - 3rem)}}.lanscape-mode-left{position:absolute;left:0;top:3.5rem;text-align:center;z-index:1;width:4rem}.lanscape-mode-left div{padding-bottom:1.5rem}.landscape-center{width:100%}.lanscape-mode-right{-ms-overflow-style:none;scrollbar-width:none;position:absolute;padding-right:1rem;right:.5rem;color:var(--quml-scoreboard-unattempted);font-size:.75rem;height:calc(100% - 4rem);overflow-y:auto;top:3.5rem;padding-left:1rem}.lanscape-mode-right ul{list-style:none;margin-top:.5rem;padding:0;text-align:center;position:relative}.lanscape-mode-right ul::before{content:\"\";width:.0625rem;height:100%;position:absolute;left:0;right:0;background-color:rgba(204,204,204,.5);z-index:1;margin:0 auto}.lanscape-mode-right ul li{position:relative;z-index:2}.lanscape-mode-right ul li.requiresSubmit{color:var(--quml-scoreboard-unattempted);border:.03125rem solid var(--quml-scoreboard-unattempted);border-radius:50%;width:1.25rem;height:1.25rem;background:var(--white)}.lanscape-mode-right ul li.requiresSubmit:hover{border:.0625rem solid var(--primary-color)}.lanscape-mode-right ul .singleContent.nonFeedback li:hover{border:1px solid var(--primary-color);color:var(--primary-color)}.lanscape-mode-right ul .singleContent.nonFeedback li.att-color{color:var(--white);background:var(--primary-color)}.lanscape-mode-right ul .section ul.nonFeedback li:hover{border:1px solid var(--primary-color);color:var(--primary-color)}.lanscape-mode-right ul .section ul.nonFeedback li.att-color{color:var(--white);background:var(--primary-color)}.lanscape-mode-right ul .section ul li.progressBar-border::after,.lanscape-mode-right ul .section ul li:focus::after,.lanscape-mode-right ul .section ul li:hover::after{border:1px solid var(--primary-color);content:\"\";width:1.65rem;height:1.65rem;border-radius:50%;padding:.25rem;position:absolute}.lanscape-mode-right ul .section.attempted::after{content:\"\";display:inline-block;transform:rotate(45deg);height:.6rem;width:.3rem;border-bottom:.12rem solid var(--primary-color);border-right:.12rem solid var(--primary-color);position:absolute;top:.25rem;right:-.7rem}.lanscape-mode-right ul .section.correct::after,.lanscape-mode-right ul .section.partial::after,.lanscape-mode-right ul .section.wrong::after{content:\"\";position:absolute;top:.525rem;right:-.7rem;height:.375rem;width:.375rem;border-radius:.375rem}.lanscape-mode-right ul .section.correct::after{--correct-bg:var(--quml-color-success);background:var(--correct-bg)}.lanscape-mode-right ul .section.wrong::after{--wrong-bg:var(--quml-color-danger);background:var(--wrong-bg)}.lanscape-mode-right ul .section.partial::after{--partial-bg:linear-gradient(\n    180deg,\n    rgba(71, 164, 128, 1) 0%,\n    rgba(71, 164, 128, 1) 50%,\n    rgba(249, 122, 116, 1) 50%,\n    rgba(249, 122, 116, 1) 100%\n    );background:var(--partial-bg)}.lanscape-mode-right ul .section.attempted label,.lanscape-mode-right ul .section.partial label{color:var(--white)!important;background:var(--primary-color);border:.03125rem solid var(--primary-color)}.lanscape-mode-right ul .section label{background-color:var(--quml-question-bg);border-radius:.25rem;width:1.25rem;padding:.25rem;height:1.25rem;display:flex;align-items:center;justify-content:center;color:var(--quml-scoreboard-unattempted);border:.03125rem solid var(--quml-scoreboard-unattempted);margin-bottom:2.25rem;cursor:pointer}.lanscape-mode-right ul .section label.requiresSubmit{color:var(--quml-scoreboard-unattempted);border:.03125rem solid var(--quml-scoreboard-unattempted);border-radius:50%;background:var(--white)}.lanscape-mode-right ul .section label.requiresSubmit:hover{border:.0625rem solid var(--primary-color)}.lanscape-mode-right ul .section label.active,.lanscape-mode-right ul .section label:focus,.lanscape-mode-right ul .section label:hover{color:var(--primary-color);border:.0625rem solid var(--primary-color)}.lanscape-mode-right ul .section label.active::after,.lanscape-mode-right ul .section label:focus::after,.lanscape-mode-right ul .section label:hover::after{border:1px solid var(--primary-color);content:\"\";height:1.65rem;border-radius:.25rem;position:absolute;width:1.65rem;background:var(--quml-question-bg);z-index:-1}.lanscape-mode-right ul .section label.skipped{color:var(--white);background:var(--quml-scoreboard-skipped);border:.0625rem solid var(--quml-scoreboard-skipped)}.lanscape-mode-right ul .section label.unattempted{color:var(--quml-scoreboard-unattempted);border:.03125rem solid var(--quml-scoreboard-unattempted)}.lanscape-mode-right ul .section label.unattempted:hover{border:.0625rem solid var(--primary-color);color:var(--primary-color)}.lanscape-mode-right ul input[type=checkbox]{display:none}.lanscape-mode-right ul input[type=checkbox]~ul{height:0;transform:scaleY(0)}.lanscape-mode-right ul input[type=checkbox]:checked~ul{height:100%;transform-origin:top;transition:transform .2s ease-out;transform:scaleY(1)}.lanscape-mode-right ul .section input[type=checkbox]:checked~label{border:.0625rem solid var(--primary-color);color:var(--primary-color)}.lanscape-mode-right ul .showFeedBack-progressBar{background-color:var(--quml-question-bg);border-radius:50%;width:1.25rem;padding:.25rem;height:1.25rem;display:flex;align-items:center;justify-content:center;border:.0625rem solid #ccc;margin-bottom:2.25rem;cursor:pointer}.lanscape-mode-right ul .showFeedBack-progressBar.requiresSubmit:hover{border:.0625rem solid var(--primary-color)}.lanscape-mode-right ul .showFeedBack-progressBar .active,.lanscape-mode-right ul .showFeedBack-progressBar.att-color,.lanscape-mode-right ul .showFeedBack-progressBar.progressBar-border{color:var(--primary-color);border:.0625rem solid var(--primary-color)}.lanscape-mode-right ul .showFeedBack-progressBar.info-page{color:var(--white);background:var(--primary-color);border:.0625rem solid var(--primary-color)}.lanscape-mode-right ul .showFeedBack-progressBar.skipped{color:var(--white);background:var(--quml-scoreboard-skipped);border:.0625rem solid var(--quml-scoreboard-skipped)}.lanscape-mode-right ul .showFeedBack-progressBar.skipped:hover{color:var(--white)!important}.lanscape-mode-right ul .showFeedBack-progressBar.correct,.lanscape-mode-right ul .showFeedBack-progressBar.partial,.lanscape-mode-right ul .showFeedBack-progressBar.wrong{color:var(--white);border:0 solid transparent}.lanscape-mode-right ul .showFeedBack-progressBar.correct{--correct-bg:var(--quml-color-success);background:var(--correct-bg)}.lanscape-mode-right ul .showFeedBack-progressBar.wrong{--wrong-bg:var(--quml-color-danger);background:var(--wrong-bg)}.lanscape-mode-right ul .showFeedBack-progressBar.partial{--partial-bg:linear-gradient(\n    180deg,\n    rgba(71, 164, 128, 1) 0%,\n    rgba(71, 164, 128, 1) 50%,\n    rgba(249, 122, 116, 1) 50%,\n    rgba(249, 122, 116, 1) 100%\n  );background:var(--partial-bg)}.lanscape-mode-right ul .showFeedBack-progressBar.unattempted{color:var(--quml-scoreboard-unattempted);border:.03125rem solid var(--quml-scoreboard-unattempted)}.lanscape-mode-right ul .showFeedBack-progressBar.unattempted:hover{border:.0625rem solid var(--primary-color);color:var(--primary-color)}.current-slide{color:var(--quml-scoreboard-sub-title);font-size:.875rem;font-weight:900;letter-spacing:0}@media only screen and (max-width:480px){.lanscape-mode-right{background:var(--white);display:flex;align-items:center;overflow-x:auto;overflow-y:hidden;width:90%;height:2.5rem;padding:1rem 0 0;margin:auto;left:0}.lanscape-mode-right ul{list-style:none;padding:0;text-align:center;position:relative;display:flex;height:1.5rem;margin-top:0}.lanscape-mode-right ul .showFeedBack-progressBar{margin-right:2.25rem;z-index:1}.lanscape-mode-right ul .showFeedBack-progressBar:last-child{margin-right:0}.lanscape-mode-right ul .singleContent{display:flex}.lanscape-mode-right ul .singleContent .showFeedBack-progressBar:last-child{margin-right:2.25rem}.lanscape-mode-right ul .section ul{top:-1.75rem;position:inherit;margin:.5rem 2.25rem;padding-left:1.25rem}.lanscape-mode-right ul .section ul::before{background:0 0}.lanscape-mode-right ul .section.attempted::after{content:\"\";top:-.8125rem;right:auto;left:.625rem}.lanscape-mode-right ul .section.correct::after,.lanscape-mode-right ul .section.partial::after,.lanscape-mode-right ul .section.wrong::after{content:\"\";top:-.525rem;left:.5rem;right:auto}.lanscape-mode-right ul .section label{margin-right:2.25rem;margin-bottom:0}.lanscape-mode-right ul::before{content:\"\";width:100%;height:.0625rem;position:absolute;left:0;top:50%;transform:translate(0,-50%);right:0;background-color:rgba(204,204,204,.5);z-index:0;margin:0 auto}.lanscape-mode-right ul input[type=checkbox]~ul{width:0;transform:scaleX(0);margin:0}.lanscape-mode-right ul input[type=checkbox]:checked~ul{width:calc(100% - 4rem);transform-origin:left;transition:transform .2s ease-out;transform:scaleX(1);margin:-1.25rem 3rem 0 4rem}.landscape-center{margin-top:2rem}.lanscape-mode-left{display:none}.landscape-mode{grid-template-areas:\"right right right\" \"center center center\" \"left left left\"}::ng-deep .quml-mcq .mcq-title,::ng-deep .quml-sa .mcq-title,::ng-deep quml-mcq-solutions .mcq-title,::ng-deep quml-sa .mcq-title{margin-top:1rem}}.quml-timer{padding:.5rem}.quml-header-text{margin:.5rem;text-align:center;text-overflow:ellipsis;overflow:hidden;white-space:nowrap}.quml-arrow-button{border-radius:28%;font-size:0;outline:0;background-color:var(--primary-color);padding:.5rem}.info-popup{position:absolute;top:18%;right:10%;font-size:.875rem;font-family:noto-sans;box-shadow:0 .125rem .875rem 0 rgba(0,0,0,.1);padding:.75rem}.quml-menu{width:1.5rem;height:1.5rem}.quml-card{background-color:var(--white);padding:1.25rem;box-shadow:0 .25rem .5rem 0 rgba(0,0,0,.2);width:25%;position:absolute;left:37%;text-align:center;top:25%;z-index:2}.quml-card-title{font-size:1.25rem;text-align:center}.quml-card-body .wrong{color:red}.quml-card-body .right{color:green}.quml-card-button-section .button-container button{color:var(--white);background-color:var(--primary-color);border-color:var(--primary-color);outline:0;font-size:.875rem;padding:.25rem 1.5rem}.quml-card-button-section .button-container{width:40%;display:inline;padding-right:.75rem}::ng-deep .carousel.slide .carousel-control.carousel-control-next,::ng-deep .carousel.slide a.left.carousel-control.carousel-control-prev{display:none}::ng-deep .carousel-item{perspective:unset}.potrait-header-top{visibility:hidden;margin-top:-2.5rem}.potrait-header-top .wrapper{display:-ms-grid;display:grid;-ms-grid-columns:1fr 15fr;grid-template-columns:1fr 15fr}.potrait-header-top .quml-menu{color:var(--quml-heder-text-color);font-size:1.5rem;padding-left:1.25rem;margin-top:.25rem}.potrait-header-top .quml-header-text{font-size:.875rem;color:var(--quml-heder-text-color)}.row{margin-right:0;margin-left:0}.portrait-header{visibility:hidden}.image-viewer__close,.image-viewer__container,.image-viewer__overlay,.image-viewer__zoom{position:absolute}.image-viewer__overlay{width:100%;height:100%;background:var(--quml-color-primary-contrast);z-index:11111}.image-viewer__container{background-color:var(--quml-color-primary-contrast);top:50%;left:50%;transform:translate(-50%,-50%);z-index:11111;width:80%;height:80%}.image-viewer__img{width:100%;height:100%}.image-viewer__close{top:1rem;right:1rem;text-align:center;cursor:pointer;z-index:999999;background:rgba(0,0,0,.5);border-radius:100%;width:3rem;height:3rem;position:fixed}.image-viewer__close::after{content:\"\u2715\";color:var(--white);font-size:2rem}.image-viewer__close:hover{background:#000}.image-viewer__zoom{bottom:1rem;right:1rem;width:2.5rem;height:auto;border-radius:.5rem;background:var(--white);display:flex;flex-direction:column;align-items:center;overflow:hidden;z-index:99999;position:fixed;border:.0625rem solid var(--quml-zoom-btn-txt)}.image-viewer__zoomin,.image-viewer__zoomout{text-align:center;height:2.5rem;position:relative;width:2.5rem;cursor:pointer}.image-viewer__zoomin:hover,.image-viewer__zoomout:hover{background-color:var(--quml-zoom-btn-hover)}.image-viewer__zoomin::after,.image-viewer__zoomout::after{font-size:1.5rem;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)}.image-viewer__zoomin{border-bottom:.0625rem solid var(--quml-btn-border)}.image-viewer__zoomin::after{content:\"+\"}.image-viewer__zoomout::after{content:\"\u2212\"}::ng-deep quml-ans{cursor:pointer}::ng-deep quml-ans svg circle{fill:var(--quml-zoom-btn-txt)}::ng-deep .magnify-icon{position:absolute;right:0;width:1.5rem;height:1.5rem;border-top-left-radius:.5rem;cursor:pointer;background-color:var(--quml-color-primary-contrast)}::ng-deep .magnify-icon::after{content:\"\";position:absolute;bottom:.125rem;right:.125rem;z-index:1;width:1rem;height:1rem;background-image:url(\"data:image/svg+xml,%3C%3Fxml version='1.0'%3F%3E%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svgjs='http://svgjs.com/svgjs' version='1.1' width='512' height='512' x='0' y='0' viewBox='0 0 37.166 37.166' style='enable-background:new 0 0 512 512' xml:space='preserve' class=''%3E%3Cg%3E%3Cg xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M35.829,32.045l-6.833-6.833c-0.513-0.513-1.167-0.788-1.836-0.853c2.06-2.567,3.298-5.819,3.298-9.359 c0-8.271-6.729-15-15-15c-8.271,0-15,6.729-15,15c0,8.271,6.729,15,15,15c3.121,0,6.021-0.96,8.424-2.598 c0.018,0.744,0.305,1.482,0.872,2.052l6.833,6.833c0.585,0.586,1.354,0.879,2.121,0.879s1.536-0.293,2.121-0.879 C37.001,35.116,37.001,33.217,35.829,32.045z M15.458,25c-5.514,0-10-4.484-10-10c0-5.514,4.486-10,10-10c5.514,0,10,4.486,10,10 C25.458,20.516,20.972,25,15.458,25z M22.334,15c0,1.104-0.896,2-2,2h-2.75v2.75c0,1.104-0.896,2-2,2s-2-0.896-2-2V17h-2.75 c-1.104,0-2-0.896-2-2s0.896-2,2-2h2.75v-2.75c0-1.104,0.896-2,2-2s2,0.896,2,2V13h2.75C21.438,13,22.334,13.895,22.334,15z' fill='%23ffffff' data-original='%23000000' style='' class=''/%3E%3C/g%3E%3Cg xmlns='http://www.w3.org/2000/svg'%3E%3C/g%3E%3Cg xmlns='http://www.w3.org/2000/svg'%3E%3C/g%3E%3Cg xmlns='http://www.w3.org/2000/svg'%3E%3C/g%3E%3Cg xmlns='http://www.w3.org/2000/svg'%3E%3C/g%3E%3Cg xmlns='http://www.w3.org/2000/svg'%3E%3C/g%3E%3Cg xmlns='http://www.w3.org/2000/svg'%3E%3C/g%3E%3Cg xmlns='http://www.w3.org/2000/svg'%3E%3C/g%3E%3Cg xmlns='http://www.w3.org/2000/svg'%3E%3C/g%3E%3Cg xmlns='http://www.w3.org/2000/svg'%3E%3C/g%3E%3Cg xmlns='http://www.w3.org/2000/svg'%3E%3C/g%3E%3Cg xmlns='http://www.w3.org/2000/svg'%3E%3C/g%3E%3Cg xmlns='http://www.w3.org/2000/svg'%3E%3C/g%3E%3Cg xmlns='http://www.w3.org/2000/svg'%3E%3C/g%3E%3Cg xmlns='http://www.w3.org/2000/svg'%3E%3C/g%3E%3Cg xmlns='http://www.w3.org/2000/svg'%3E%3C/g%3E%3C/g%3E%3C/svg%3E%0A\");background-size:cover;background-repeat:no-repeat;background-position:center}::ng-deep .solution-options figure.image{border:.0625rem solid var(--quml-btn-border);overflow:hidden;border-radius:.25rem;position:relative;width:7.5rem;height:7.5rem}::ng-deep .image-viewer__overlay .image-viewer__container,::ng-deep .solutions .solution-options figure.image{display:flex;align-items:center;justify-content:center}::ng-deep .image-viewer__overlay .image-viewer__container .portrait,::ng-deep .solutions .solution-options figure.image .portrait{width:auto;height:100%}::ng-deep .image-viewer__overlay .image-viewer__container .neutral,::ng-deep .solutions .solution-options figure.image .neutral{width:auto;height:auto}@media only screen and (max-width:768px){::ng-deep .image-viewer__overlay .image-viewer__container .neutral,::ng-deep .solutions .solution-options figure.image .neutral{width:100%}}@media only screen and (min-width:768px){::ng-deep .image-viewer__overlay .image-viewer__container .neutral,::ng-deep .solutions .solution-options figure.image .neutral{height:100%}}::ng-deep .image-viewer__overlay .image-viewer__container .landscape,::ng-deep .solutions .solution-options figure.image .landscape{width:100%;height:auto}::ng-deep .quml-mcq .mcq-title,::ng-deep .quml-sa .mcq-title,::ng-deep quml-mcq-solutions .mcq-title,::ng-deep quml-sa .mcq-title{color:var(--quml-mcq-title-txt)}::ng-deep .quml-mcq .quml-mcq--question p,::ng-deep .quml-sa .quml-mcq--question p,::ng-deep quml-mcq-solutions .quml-mcq--question p,::ng-deep quml-sa .quml-mcq--question p{line-height:normal}::ng-deep .quml-mcq .quml-mcq--option .quml-mcq-option-card p:first-child,::ng-deep .quml-mcq .quml-mcq--option .quml-mcq-option-card p:last-child,::ng-deep .quml-sa .quml-mcq--option .quml-mcq-option-card p:first-child,::ng-deep .quml-sa .quml-mcq--option .quml-mcq-option-card p:last-child,::ng-deep quml-mcq-solutions .quml-mcq--option .quml-mcq-option-card p:first-child,::ng-deep quml-mcq-solutions .quml-mcq--option .quml-mcq-option-card p:last-child,::ng-deep quml-sa .quml-mcq--option .quml-mcq-option-card p:first-child,::ng-deep quml-sa .quml-mcq--option .quml-mcq-option-card p:last-child{margin-bottom:0}::ng-deep quml-mcq-solutions .mcq-title p,::ng-deep quml-mcq-solutions .text-center,::ng-deep quml-mcq-solutions .text-left,::ng-deep quml-mcq-solutions .text-right,::ng-deep quml-mcq-solutions h1,::ng-deep quml-mcq-solutions h2,::ng-deep quml-mcq-solutions h3,::ng-deep quml-mcq-solutions h4,::ng-deep quml-mcq-solutions h5,::ng-deep quml-mcq-solutions h6,::ng-deep quml-mcq-solutions p{text-align:center!important}::ng-deep quml-mcq-solutions .solutions .solution-options-container{align-items:center}::ng-deep quml-mcq-solutions .image-style-align-left,::ng-deep quml-mcq-solutions .image-style-align-right{float:none!important;text-align:center!important;margin:0 auto!important}::ng-deep quml-mcq-solutions figure.image,::ng-deep quml-mcq-solutions figure.image.resize-100,::ng-deep quml-mcq-solutions figure.image.resize-25,::ng-deep quml-mcq-solutions figure.image.resize-50,::ng-deep quml-mcq-solutions figure.image.resize-75,::ng-deep quml-mcq-solutions figure.image.resize-original{width:25%;height:auto}::ng-deep quml-mcq-solutions .solution-options p{margin-bottom:1rem}.endPage-container-height{height:100%}.scoreboard-sections{display:contents}.scoreboard-sections li{position:relative;z-index:2}.hover-effect.progressBar-border::after,.hover-effect:focus::after,.hover-effect:hover::after{border:1px solid var(--primary-color);content:\"\";width:1.65rem;height:1.65rem;border-radius:50%;padding:.25rem;position:absolute}", "::ng-deep :root{--quml-mcq-title-txt:#131415}::ng-deep .quml-mcq .mcq-title,::ng-deep .quml-sa .mcq-title,::ng-deep .startpage__instr-desc .mcq-title,::ng-deep quml-mcq-solutions .mcq-title,::ng-deep quml-sa .mcq-title{color:var(--quml-mcq-title-txt)}::ng-deep .quml-mcq .fs-10,::ng-deep .quml-mcq .fs-11,::ng-deep .quml-mcq .fs-12,::ng-deep .quml-mcq .fs-13,::ng-deep .quml-mcq .fs-14,::ng-deep .quml-mcq .fs-15,::ng-deep .quml-mcq .fs-16,::ng-deep .quml-mcq .fs-17,::ng-deep .quml-mcq .fs-18,::ng-deep .quml-mcq .fs-19,::ng-deep .quml-mcq .fs-20,::ng-deep .quml-mcq .fs-21,::ng-deep .quml-mcq .fs-22,::ng-deep .quml-mcq .fs-23,::ng-deep .quml-mcq .fs-24,::ng-deep .quml-mcq .fs-25,::ng-deep .quml-mcq .fs-26,::ng-deep .quml-mcq .fs-27,::ng-deep .quml-mcq .fs-28,::ng-deep .quml-mcq .fs-29,::ng-deep .quml-mcq .fs-30,::ng-deep .quml-mcq .fs-36,::ng-deep .quml-mcq .fs-8,::ng-deep .quml-mcq .fs-9,::ng-deep .quml-sa .fs-10,::ng-deep .quml-sa .fs-11,::ng-deep .quml-sa .fs-12,::ng-deep .quml-sa .fs-13,::ng-deep .quml-sa .fs-14,::ng-deep .quml-sa .fs-15,::ng-deep .quml-sa .fs-16,::ng-deep .quml-sa .fs-17,::ng-deep .quml-sa .fs-18,::ng-deep .quml-sa .fs-19,::ng-deep .quml-sa .fs-20,::ng-deep .quml-sa .fs-21,::ng-deep .quml-sa .fs-22,::ng-deep .quml-sa .fs-23,::ng-deep .quml-sa .fs-24,::ng-deep .quml-sa .fs-25,::ng-deep .quml-sa .fs-26,::ng-deep .quml-sa .fs-27,::ng-deep .quml-sa .fs-28,::ng-deep .quml-sa .fs-29,::ng-deep .quml-sa .fs-30,::ng-deep .quml-sa .fs-36,::ng-deep .quml-sa .fs-8,::ng-deep .quml-sa .fs-9,::ng-deep .startpage__instr-desc .fs-10,::ng-deep .startpage__instr-desc .fs-11,::ng-deep .startpage__instr-desc .fs-12,::ng-deep .startpage__instr-desc .fs-13,::ng-deep .startpage__instr-desc .fs-14,::ng-deep .startpage__instr-desc .fs-15,::ng-deep .startpage__instr-desc .fs-16,::ng-deep .startpage__instr-desc .fs-17,::ng-deep .startpage__instr-desc .fs-18,::ng-deep .startpage__instr-desc .fs-19,::ng-deep .startpage__instr-desc .fs-20,::ng-deep .startpage__instr-desc .fs-21,::ng-deep .startpage__instr-desc .fs-22,::ng-deep .startpage__instr-desc .fs-23,::ng-deep .startpage__instr-desc .fs-24,::ng-deep .startpage__instr-desc .fs-25,::ng-deep .startpage__instr-desc .fs-26,::ng-deep .startpage__instr-desc .fs-27,::ng-deep .startpage__instr-desc .fs-28,::ng-deep .startpage__instr-desc .fs-29,::ng-deep .startpage__instr-desc .fs-30,::ng-deep .startpage__instr-desc .fs-36,::ng-deep .startpage__instr-desc .fs-8,::ng-deep .startpage__instr-desc .fs-9,::ng-deep quml-mcq-solutions .fs-10,::ng-deep quml-mcq-solutions .fs-11,::ng-deep quml-mcq-solutions .fs-12,::ng-deep quml-mcq-solutions .fs-13,::ng-deep quml-mcq-solutions .fs-14,::ng-deep quml-mcq-solutions .fs-15,::ng-deep quml-mcq-solutions .fs-16,::ng-deep quml-mcq-solutions .fs-17,::ng-deep quml-mcq-solutions .fs-18,::ng-deep quml-mcq-solutions .fs-19,::ng-deep quml-mcq-solutions .fs-20,::ng-deep quml-mcq-solutions .fs-21,::ng-deep quml-mcq-solutions .fs-22,::ng-deep quml-mcq-solutions .fs-23,::ng-deep quml-mcq-solutions .fs-24,::ng-deep quml-mcq-solutions .fs-25,::ng-deep quml-mcq-solutions .fs-26,::ng-deep quml-mcq-solutions .fs-27,::ng-deep quml-mcq-solutions .fs-28,::ng-deep quml-mcq-solutions .fs-29,::ng-deep quml-mcq-solutions .fs-30,::ng-deep quml-mcq-solutions .fs-36,::ng-deep quml-mcq-solutions .fs-8,::ng-deep quml-mcq-solutions .fs-9,::ng-deep quml-sa .fs-10,::ng-deep quml-sa .fs-11,::ng-deep quml-sa .fs-12,::ng-deep quml-sa .fs-13,::ng-deep quml-sa .fs-14,::ng-deep quml-sa .fs-15,::ng-deep quml-sa .fs-16,::ng-deep quml-sa .fs-17,::ng-deep quml-sa .fs-18,::ng-deep quml-sa .fs-19,::ng-deep quml-sa .fs-20,::ng-deep quml-sa .fs-21,::ng-deep quml-sa .fs-22,::ng-deep quml-sa .fs-23,::ng-deep quml-sa .fs-24,::ng-deep quml-sa .fs-25,::ng-deep quml-sa .fs-26,::ng-deep quml-sa .fs-27,::ng-deep quml-sa .fs-28,::ng-deep quml-sa .fs-29,::ng-deep quml-sa .fs-30,::ng-deep quml-sa .fs-36,::ng-deep quml-sa .fs-8,::ng-deep quml-sa .fs-9{line-height:normal}::ng-deep .quml-mcq .fs-8,::ng-deep .quml-sa .fs-8,::ng-deep .startpage__instr-desc .fs-8,::ng-deep quml-mcq-solutions .fs-8,::ng-deep quml-sa .fs-8{font-size:.5rem}::ng-deep .quml-mcq .fs-9,::ng-deep .quml-sa .fs-9,::ng-deep .startpage__instr-desc .fs-9,::ng-deep quml-mcq-solutions .fs-9,::ng-deep quml-sa .fs-9{font-size:.563rem}::ng-deep .quml-mcq .fs-10,::ng-deep .quml-sa .fs-10,::ng-deep .startpage__instr-desc .fs-10,::ng-deep quml-mcq-solutions .fs-10,::ng-deep quml-sa .fs-10{font-size:.625rem}::ng-deep .quml-mcq .fs-11,::ng-deep .quml-sa .fs-11,::ng-deep .startpage__instr-desc .fs-11,::ng-deep quml-mcq-solutions .fs-11,::ng-deep quml-sa .fs-11{font-size:.688rem}::ng-deep .quml-mcq .fs-12,::ng-deep .quml-sa .fs-12,::ng-deep .startpage__instr-desc .fs-12,::ng-deep quml-mcq-solutions .fs-12,::ng-deep quml-sa .fs-12{font-size:.75rem}::ng-deep .quml-mcq .fs-13,::ng-deep .quml-sa .fs-13,::ng-deep .startpage__instr-desc .fs-13,::ng-deep quml-mcq-solutions .fs-13,::ng-deep quml-sa .fs-13{font-size:.813rem}::ng-deep .quml-mcq .fs-14,::ng-deep .quml-sa .fs-14,::ng-deep .startpage__instr-desc .fs-14,::ng-deep quml-mcq-solutions .fs-14,::ng-deep quml-sa .fs-14{font-size:.875rem}::ng-deep .quml-mcq .fs-15,::ng-deep .quml-sa .fs-15,::ng-deep .startpage__instr-desc .fs-15,::ng-deep quml-mcq-solutions .fs-15,::ng-deep quml-sa .fs-15{font-size:.938rem}::ng-deep .quml-mcq .fs-16,::ng-deep .quml-sa .fs-16,::ng-deep .startpage__instr-desc .fs-16,::ng-deep quml-mcq-solutions .fs-16,::ng-deep quml-sa .fs-16{font-size:1rem}::ng-deep .quml-mcq .fs-17,::ng-deep .quml-sa .fs-17,::ng-deep .startpage__instr-desc .fs-17,::ng-deep quml-mcq-solutions .fs-17,::ng-deep quml-sa .fs-17{font-size:1.063rem}::ng-deep .quml-mcq .fs-18,::ng-deep .quml-sa .fs-18,::ng-deep .startpage__instr-desc .fs-18,::ng-deep quml-mcq-solutions .fs-18,::ng-deep quml-sa .fs-18{font-size:1.125rem}::ng-deep .quml-mcq .fs-19,::ng-deep .quml-sa .fs-19,::ng-deep .startpage__instr-desc .fs-19,::ng-deep quml-mcq-solutions .fs-19,::ng-deep quml-sa .fs-19{font-size:1.188rem}::ng-deep .quml-mcq .fs-20,::ng-deep .quml-sa .fs-20,::ng-deep .startpage__instr-desc .fs-20,::ng-deep quml-mcq-solutions .fs-20,::ng-deep quml-sa .fs-20{font-size:1.25rem}::ng-deep .quml-mcq .fs-21,::ng-deep .quml-sa .fs-21,::ng-deep .startpage__instr-desc .fs-21,::ng-deep quml-mcq-solutions .fs-21,::ng-deep quml-sa .fs-21{font-size:1.313rem}::ng-deep .quml-mcq .fs-22,::ng-deep .quml-sa .fs-22,::ng-deep .startpage__instr-desc .fs-22,::ng-deep quml-mcq-solutions .fs-22,::ng-deep quml-sa .fs-22{font-size:1.375rem}::ng-deep .quml-mcq .fs-23,::ng-deep .quml-sa .fs-23,::ng-deep .startpage__instr-desc .fs-23,::ng-deep quml-mcq-solutions .fs-23,::ng-deep quml-sa .fs-23{font-size:1.438rem}::ng-deep .quml-mcq .fs-24,::ng-deep .quml-sa .fs-24,::ng-deep .startpage__instr-desc .fs-24,::ng-deep quml-mcq-solutions .fs-24,::ng-deep quml-sa .fs-24{font-size:1.5rem}::ng-deep .quml-mcq .fs-25,::ng-deep .quml-sa .fs-25,::ng-deep .startpage__instr-desc .fs-25,::ng-deep quml-mcq-solutions .fs-25,::ng-deep quml-sa .fs-25{font-size:1.563rem}::ng-deep .quml-mcq .fs-26,::ng-deep .quml-sa .fs-26,::ng-deep .startpage__instr-desc .fs-26,::ng-deep quml-mcq-solutions .fs-26,::ng-deep quml-sa .fs-26{font-size:1.625rem}::ng-deep .quml-mcq .fs-27,::ng-deep .quml-sa .fs-27,::ng-deep .startpage__instr-desc .fs-27,::ng-deep quml-mcq-solutions .fs-27,::ng-deep quml-sa .fs-27{font-size:1.688rem}::ng-deep .quml-mcq .fs-28,::ng-deep .quml-sa .fs-28,::ng-deep .startpage__instr-desc .fs-28,::ng-deep quml-mcq-solutions .fs-28,::ng-deep quml-sa .fs-28{font-size:1.75rem}::ng-deep .quml-mcq .fs-29,::ng-deep .quml-sa .fs-29,::ng-deep .startpage__instr-desc .fs-29,::ng-deep quml-mcq-solutions .fs-29,::ng-deep quml-sa .fs-29{font-size:1.813rem}::ng-deep .quml-mcq .fs-30,::ng-deep .quml-sa .fs-30,::ng-deep .startpage__instr-desc .fs-30,::ng-deep quml-mcq-solutions .fs-30,::ng-deep quml-sa .fs-30{font-size:1.875rem}::ng-deep .quml-mcq .fs-36,::ng-deep .quml-sa .fs-36,::ng-deep .startpage__instr-desc .fs-36,::ng-deep quml-mcq-solutions .fs-36,::ng-deep quml-sa .fs-36{font-size:2.25rem}::ng-deep .quml-mcq .text-left,::ng-deep .quml-sa .text-left,::ng-deep .startpage__instr-desc .text-left,::ng-deep quml-mcq-solutions .text-left,::ng-deep quml-sa .text-left{text-align:left}::ng-deep .quml-mcq .text-center,::ng-deep .quml-sa .text-center,::ng-deep .startpage__instr-desc .text-center,::ng-deep quml-mcq-solutions .text-center,::ng-deep quml-sa .text-center{text-align:center}::ng-deep .quml-mcq .text-right,::ng-deep .quml-sa .text-right,::ng-deep .startpage__instr-desc .text-right,::ng-deep quml-mcq-solutions .text-right,::ng-deep quml-sa .text-right{text-align:right}::ng-deep .quml-mcq .image-style-align-right,::ng-deep .quml-sa .image-style-align-right,::ng-deep .startpage__instr-desc .image-style-align-right,::ng-deep quml-mcq-solutions .image-style-align-right,::ng-deep quml-sa .image-style-align-right{float:right;text-align:right;margin-left:.5rem}::ng-deep .quml-mcq .image-style-align-left,::ng-deep .quml-sa .image-style-align-left,::ng-deep .startpage__instr-desc .image-style-align-left,::ng-deep quml-mcq-solutions .image-style-align-left,::ng-deep quml-sa .image-style-align-left{float:left;text-align:left;margin-right:.5rem}::ng-deep .quml-mcq .image,::ng-deep .quml-mcq figure.image,::ng-deep .quml-sa .image,::ng-deep .quml-sa figure.image,::ng-deep .startpage__instr-desc .image,::ng-deep .startpage__instr-desc figure.image,::ng-deep quml-mcq-solutions .image,::ng-deep quml-mcq-solutions figure.image,::ng-deep quml-sa .image,::ng-deep quml-sa figure.image{display:table;clear:both;text-align:center;margin:.5rem auto;position:relative}::ng-deep .quml-mcq figure.image,::ng-deep .quml-mcq figure.image.resize-original,::ng-deep .quml-sa figure.image,::ng-deep .quml-sa figure.image.resize-original,::ng-deep .startpage__instr-desc figure.image,::ng-deep .startpage__instr-desc figure.image.resize-original,::ng-deep quml-mcq-solutions figure.image,::ng-deep quml-mcq-solutions figure.image.resize-original,::ng-deep quml-sa figure.image,::ng-deep quml-sa figure.image.resize-original{width:auto;height:auto;overflow:visible}::ng-deep .quml-mcq figure.image img,::ng-deep .quml-sa figure.image img,::ng-deep .startpage__instr-desc figure.image img,::ng-deep quml-mcq-solutions figure.image img,::ng-deep quml-sa figure.image img{width:100%}::ng-deep .quml-mcq figure.image.resize-original img,::ng-deep .quml-sa figure.image.resize-original img,::ng-deep .startpage__instr-desc figure.image.resize-original img,::ng-deep quml-mcq-solutions figure.image.resize-original img,::ng-deep quml-sa figure.image.resize-original img{width:auto;height:auto}::ng-deep .quml-mcq .image img,::ng-deep .quml-sa .image img,::ng-deep .startpage__instr-desc .image img,::ng-deep quml-mcq-solutions .image img,::ng-deep quml-sa .image img{display:block;margin:0 auto;max-width:100%;min-width:50px}::ng-deep .quml-mcq figure.image.resize-25,::ng-deep .quml-sa figure.image.resize-25,::ng-deep .startpage__instr-desc figure.image.resize-25,::ng-deep quml-mcq-solutions figure.image.resize-25,::ng-deep quml-sa figure.image.resize-25{width:25%;height:auto}::ng-deep .quml-mcq figure.image.resize-50,::ng-deep .quml-sa figure.image.resize-50,::ng-deep .startpage__instr-desc figure.image.resize-50,::ng-deep quml-mcq-solutions figure.image.resize-50,::ng-deep quml-sa figure.image.resize-50{width:50%;height:auto}::ng-deep .quml-mcq figure.image.resize-75,::ng-deep .quml-sa figure.image.resize-75,::ng-deep .startpage__instr-desc figure.image.resize-75,::ng-deep quml-mcq-solutions figure.image.resize-75,::ng-deep quml-sa figure.image.resize-75{width:75%;height:auto}::ng-deep .quml-mcq figure.image.resize-100,::ng-deep .quml-sa figure.image.resize-100,::ng-deep .startpage__instr-desc figure.image.resize-100,::ng-deep quml-mcq-solutions figure.image.resize-100,::ng-deep quml-sa figure.image.resize-100{width:100%;height:auto}::ng-deep .quml-mcq .solution-options figure.image,::ng-deep .quml-sa .solution-options figure.image,::ng-deep .startpage__instr-desc .solution-options figure.image,::ng-deep quml-mcq-solutions .solution-options figure.image,::ng-deep quml-sa .solution-options figure.image{width:7.5rem!important;height:7.5rem!important}::ng-deep .quml-mcq figure.table table,::ng-deep .quml-sa figure.table table,::ng-deep .startpage__instr-desc figure.table table,::ng-deep quml-mcq-solutions figure.table table,::ng-deep quml-sa figure.table table{border-right:.0625rem solid var(--gray-100)}::ng-deep .quml-mcq figure.table table,::ng-deep .quml-mcq figure.table table tr td,::ng-deep .quml-mcq figure.table table tr th,::ng-deep .quml-sa figure.table table,::ng-deep .quml-sa figure.table table tr td,::ng-deep .quml-sa figure.table table tr th,::ng-deep .startpage__instr-desc figure.table table,::ng-deep .startpage__instr-desc figure.table table tr td,::ng-deep .startpage__instr-desc figure.table table tr th,::ng-deep quml-mcq-solutions figure.table table,::ng-deep quml-mcq-solutions figure.table table tr td,::ng-deep quml-mcq-solutions figure.table table tr th,::ng-deep quml-sa figure.table table,::ng-deep quml-sa figure.table table tr td,::ng-deep quml-sa figure.table table tr th{border:.0625rem solid var(--black);border-collapse:collapse}::ng-deep .quml-mcq figure.table table,::ng-deep .quml-sa figure.table table,::ng-deep .startpage__instr-desc figure.table table,::ng-deep quml-mcq-solutions figure.table table,::ng-deep quml-sa figure.table table{width:100%;background:var(--white);border:.0625rem solid var(--gray-100);box-shadow:none;border-radius:.25rem .25rem 0 0;text-align:left;color:var(--gray);border-collapse:separate;border-spacing:0;table-layout:fixed}::ng-deep .quml-mcq figure.table table thead tr th,::ng-deep .quml-sa figure.table table thead tr th,::ng-deep .startpage__instr-desc figure.table table thead tr th,::ng-deep quml-mcq-solutions figure.table table thead tr th,::ng-deep quml-sa figure.table table thead tr th{border-right:.0625rem solid var(--gray-100);font-size:.875rem;padding:1rem;background-color:var(--primary-100);color:var(--gray);position:relative;height:2.5rem;border:0;border-bottom:.0625rem solid var(--gray-100);border-right:.0625rem solid var(--gray-100);font-weight:700;color:var(--primary-color);text-transform:uppercase}::ng-deep .quml-mcq figure.table table thead tr th:first-child,::ng-deep .quml-sa figure.table table thead tr th:first-child,::ng-deep .startpage__instr-desc figure.table table thead tr th:first-child,::ng-deep quml-mcq-solutions figure.table table thead tr th:first-child,::ng-deep quml-sa figure.table table thead tr th:first-child{border-top-left-radius:.25rem}::ng-deep .quml-mcq figure.table table thead tr th:last-child,::ng-deep .quml-sa figure.table table thead tr th:last-child,::ng-deep .startpage__instr-desc figure.table table thead tr th:last-child,::ng-deep quml-mcq-solutions figure.table table thead tr th:last-child,::ng-deep quml-sa figure.table table thead tr th:last-child{border-top-right-radius:.25rem;border-right:0 solid var(--gray-100)}::ng-deep .quml-mcq figure.table table tbody tr:nth-child(2n),::ng-deep .quml-sa figure.table table tbody tr:nth-child(2n),::ng-deep .startpage__instr-desc figure.table table tbody tr:nth-child(2n),::ng-deep quml-mcq-solutions figure.table table tbody tr:nth-child(2n),::ng-deep quml-sa figure.table table tbody tr:nth-child(2n){background-color:var(--gray-0)}::ng-deep .quml-mcq figure.table table tbody tr:hover,::ng-deep .quml-sa figure.table table tbody tr:hover,::ng-deep .startpage__instr-desc figure.table table tbody tr:hover,::ng-deep quml-mcq-solutions figure.table table tbody tr:hover,::ng-deep quml-sa figure.table table tbody tr:hover{background:var(--primary-0);color:rgba(var(--rc-rgba-gray),.95);cursor:pointer}::ng-deep .quml-mcq figure.table table tbody tr td,::ng-deep .quml-sa figure.table table tbody tr td,::ng-deep .startpage__instr-desc figure.table table tbody tr td,::ng-deep quml-mcq-solutions figure.table table tbody tr td,::ng-deep quml-sa figure.table table tbody tr td{font-size:.875rem;padding:1rem;color:var(--gray);height:3.5rem;border:0;border-bottom:.0625rem solid var(--gray-100);border-right:.0625rem solid var(--gray-100);word-break:break-word;line-height:normal}::ng-deep .quml-mcq figure.table table tbody tr td:last-child,::ng-deep .quml-sa figure.table table tbody tr td:last-child,::ng-deep .startpage__instr-desc figure.table table tbody tr td:last-child,::ng-deep quml-mcq-solutions figure.table table tbody tr td:last-child,::ng-deep quml-sa figure.table table tbody tr td:last-child{border-right:0 solid var(--gray-100)}::ng-deep .quml-mcq figure.table table tbody tr td p,::ng-deep .quml-sa figure.table table tbody tr td p,::ng-deep .startpage__instr-desc figure.table table tbody tr td p,::ng-deep quml-mcq-solutions figure.table table tbody tr td p,::ng-deep quml-sa figure.table table tbody tr td p{margin-bottom:0!important}::ng-deep .quml-mcq figure.table table tbody tr:last-child td,::ng-deep .quml-sa figure.table table tbody tr:last-child td,::ng-deep .startpage__instr-desc figure.table table tbody tr:last-child td,::ng-deep quml-mcq-solutions figure.table table tbody tr:last-child td,::ng-deep quml-sa figure.table table tbody tr:last-child td{border-bottom:none}::ng-deep .quml-mcq figure.table table tbody tr:last-child td:first-child,::ng-deep .quml-sa figure.table table tbody tr:last-child td:first-child,::ng-deep .startpage__instr-desc figure.table table tbody tr:last-child td:first-child,::ng-deep quml-mcq-solutions figure.table table tbody tr:last-child td:first-child,::ng-deep quml-sa figure.table table tbody tr:last-child td:first-child{border-bottom-left-radius:.25rem}::ng-deep .quml-mcq figure.table table tbody tr:last-child td:last-child,::ng-deep .quml-sa figure.table table tbody tr:last-child td:last-child,::ng-deep .startpage__instr-desc figure.table table tbody tr:last-child td:last-child,::ng-deep quml-mcq-solutions figure.table table tbody tr:last-child td:last-child,::ng-deep quml-sa figure.table table tbody tr:last-child td:last-child{border-bottom-right-radius:.25rem}::ng-deep .quml-mcq ol,::ng-deep .quml-mcq ul,::ng-deep .quml-sa ol,::ng-deep .quml-sa ul,::ng-deep .startpage__instr-desc ol,::ng-deep .startpage__instr-desc ul,::ng-deep quml-mcq-solutions ol,::ng-deep quml-mcq-solutions ul,::ng-deep quml-sa ol,::ng-deep quml-sa ul{margin-top:.5rem}::ng-deep .quml-mcq ol li,::ng-deep .quml-mcq ul li,::ng-deep .quml-sa ol li,::ng-deep .quml-sa ul li,::ng-deep .startpage__instr-desc ol li,::ng-deep .startpage__instr-desc ul li,::ng-deep quml-mcq-solutions ol li,::ng-deep quml-mcq-solutions ul li,::ng-deep quml-sa ol li,::ng-deep quml-sa ul li{margin:.5rem;font-weight:400;line-height:normal}::ng-deep .quml-mcq ul,::ng-deep .quml-sa ul,::ng-deep .startpage__instr-desc ul,::ng-deep quml-mcq-solutions ul,::ng-deep quml-sa ul{list-style-type:disc}::ng-deep .quml-mcq h1,::ng-deep .quml-mcq h2,::ng-deep .quml-mcq h3,::ng-deep .quml-mcq h4,::ng-deep .quml-mcq h5,::ng-deep .quml-mcq h6,::ng-deep .quml-sa h1,::ng-deep .quml-sa h2,::ng-deep .quml-sa h3,::ng-deep .quml-sa h4,::ng-deep .quml-sa h5,::ng-deep .quml-sa h6,::ng-deep .startpage__instr-desc h1,::ng-deep .startpage__instr-desc h2,::ng-deep .startpage__instr-desc h3,::ng-deep .startpage__instr-desc h4,::ng-deep .startpage__instr-desc h5,::ng-deep .startpage__instr-desc h6,::ng-deep quml-mcq-solutions h1,::ng-deep quml-mcq-solutions h2,::ng-deep quml-mcq-solutions h3,::ng-deep quml-mcq-solutions h4,::ng-deep quml-mcq-solutions h5,::ng-deep quml-mcq-solutions h6,::ng-deep quml-sa h1,::ng-deep quml-sa h2,::ng-deep quml-sa h3,::ng-deep quml-sa h4,::ng-deep quml-sa h5,::ng-deep quml-sa h6{color:var(--primary-color);line-height:normal;margin-bottom:1rem}::ng-deep .quml-mcq p,::ng-deep .quml-mcq span,::ng-deep .quml-sa p,::ng-deep .quml-sa span,::ng-deep .startpage__instr-desc p,::ng-deep .startpage__instr-desc span,::ng-deep quml-mcq-solutions p,::ng-deep quml-mcq-solutions span,::ng-deep quml-sa p,::ng-deep quml-sa span{color:var(--quml-mcq-title-txt)}::ng-deep .quml-mcq p span strong,::ng-deep .quml-mcq p strong,::ng-deep .quml-sa p span strong,::ng-deep .quml-sa p strong,::ng-deep .startpage__instr-desc p span strong,::ng-deep .startpage__instr-desc p strong,::ng-deep quml-mcq-solutions p span strong,::ng-deep quml-mcq-solutions p strong,::ng-deep quml-sa p span strong,::ng-deep quml-sa p strong{font-weight:700}::ng-deep .quml-mcq p span u,::ng-deep .quml-mcq p u,::ng-deep .quml-sa p span u,::ng-deep .quml-sa p u,::ng-deep .startpage__instr-desc p span u,::ng-deep .startpage__instr-desc p u,::ng-deep quml-mcq-solutions p span u,::ng-deep quml-mcq-solutions p u,::ng-deep quml-sa p span u,::ng-deep quml-sa p u{text-decoration:underline}::ng-deep .quml-mcq p i,::ng-deep .quml-mcq p span i,::ng-deep .quml-sa p i,::ng-deep .quml-sa p span i,::ng-deep .startpage__instr-desc p i,::ng-deep .startpage__instr-desc p span i,::ng-deep quml-mcq-solutions p i,::ng-deep quml-mcq-solutions p span i,::ng-deep quml-sa p i,::ng-deep quml-sa p span i{font-style:italic}::ng-deep .quml-mcq p,::ng-deep .quml-sa p,::ng-deep .startpage__instr-desc p,::ng-deep quml-mcq-solutions p,::ng-deep quml-sa p{line-height:normal}"]
                }] }
    ];
    /** @nocollapse */
    SectionPlayerComponent.ctorParameters = function () { return [
        { type: ViewerService },
        { type: UtilService },
        { type: QuestionCursor },
        { type: ChangeDetectorRef },
        { type: ErrorService }
    ]; };
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
    return SectionPlayerComponent;
}());
export { SectionPlayerComponent };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VjdGlvbi1wbGF5ZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHByb2plY3Qtc3VuYmlyZC9zdW5iaXJkLXF1bWwtcGxheWVyLXY5LyIsInNvdXJjZXMiOlsibGliL3NlY3Rpb24tcGxheWVyL3NlY3Rpb24tcGxheWVyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxPQUFPLEVBQWlCLGlCQUFpQixFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBYSxNQUFNLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzdJLE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxNQUFNLHdDQUF3QyxDQUFDO0FBQy9GLE9BQU8sS0FBSyxDQUFDLE1BQU0sV0FBVyxDQUFDO0FBQy9CLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQzNELE9BQU8sRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFnQixNQUFNLE1BQU0sQ0FBQztBQUN4RCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFM0MsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLGlDQUFpQyxDQUFDO0FBQ2pFLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSwyQ0FBMkMsQ0FBQztBQUMxRSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxhQUFhLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUMxRSxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDOUMsT0FBTyxRQUFRLE1BQU0sZ0NBQWdDLENBQUM7QUFHdEQ7SUE2RkUsZ0NBQ1MsYUFBNEIsRUFDNUIsV0FBd0IsRUFDeEIsY0FBOEIsRUFDN0IsS0FBd0IsRUFDekIsWUFBMEI7UUFKMUIsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFDNUIsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFDeEIs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Q2pCLDJDQUFrQjs7SUFDbEIscURBQTJCOztJQUMzQiwrQ0FBa0I7O0lBQ2xCLHNEQUE2Qjs7SUFDN0IsZ0RBQW9COztJQUNwQiw4Q0FBMkI7O0lBRXpCLCtDQUFtQzs7SUFDbkMsNkNBQStCOztJQUMvQixnREFBcUM7Ozs7O0lBQ3JDLHVDQUFnQzs7SUFDaEMsOENBQWlDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWZ0ZXJWaWV3SW5pdCwgQ2hhbmdlRGV0ZWN0b3JSZWYsIENvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBIb3N0TGlzdGVuZXIsIElucHV0LCBPbkNoYW5nZXMsIE91dHB1dCwgVmlld0NoaWxkIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBlcnJvckNvZGUsIGVycm9yTWVzc2FnZSwgRXJyb3JTZXJ2aWNlIH0gZnJvbSAnQHByb2plY3Qtc3VuYmlyZC9zdW5iaXJkLXBsYXllci1zZGstdjknO1xuaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gtZXMnO1xuaW1wb3J0IHsgQ2Fyb3VzZWxDb21wb25lbnQgfSBmcm9tICduZ3gtYm9vdHN0cmFwL2Nhcm91c2VsJztcbmltcG9ydCB7IGZyb21FdmVudCwgU3ViamVjdCwgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyB0YWtlVW50aWwgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBRdW1sUGxheWVyQ29uZmlnLCBJUGFyZW50Q29uZmlnIH0gZnJvbSAnLi4vcXVtbC1saWJyYXJ5LWludGVyZmFjZSc7XG5pbXBvcnQgeyBRdWVzdGlvbkN1cnNvciB9IGZyb20gJy4uL3F1bWwtcXVlc3Rpb24tY3Vyc29yLnNlcnZpY2UnO1xuaW1wb3J0IHsgVmlld2VyU2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2VzL3ZpZXdlci1zZXJ2aWNlL3ZpZXdlci1zZXJ2aWNlJztcbmltcG9ydCB7IGV2ZW50TmFtZSwgcGFnZUlkLCBUZWxlbWV0cnlUeXBlIH0gZnJvbSAnLi4vdGVsZW1ldHJ5LWNvbnN0YW50cyc7XG5pbXBvcnQgeyBVdGlsU2VydmljZSB9IGZyb20gJy4uL3V0aWwtc2VydmljZSc7XG5pbXBvcnQgbWFpbnRhaW4gZnJvbSAnYWxseS5qcy9lc20vbWFpbnRhaW4vX21haW50YWluJztcbmltcG9ydCB7IElTaWRlQmFyRXZlbnQgfSBmcm9tICdAcHJvamVjdC1zdW5iaXJkL3N1bmJpcmQtcGxheWVyLXNkay12OS9zdW5iaXJkLXBsYXllci1zZGsuaW50ZXJmYWNlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAncXVtbC1zZWN0aW9uLXBsYXllcicsXG4gIHRlbXBsYXRlVXJsOiAnLi9zZWN0aW9uLXBsYXllci5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3NlY3Rpb24tcGxheWVyLmNvbXBvbmVudC5zY3NzJywgJy4vLi4vc3RhcnRwYWdlL3NiLWNrZWRpdG9yLXN0eWxlcy5zY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgU2VjdGlvblBsYXllckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uQ2hhbmdlcywgQWZ0ZXJWaWV3SW5pdCB7XG5cbiAgQElucHV0KCkgc2VjdGlvbkNvbmZpZzogUXVtbFBsYXllckNvbmZpZztcbiAgQElucHV0KCkgYXR0ZW1wdHM6IHsgbWF4OiBudW1iZXIsIGN1cnJlbnQ6IG51bWJlciB9O1xuICBASW5wdXQoKSBpc0ZpcnN0U2VjdGlvbiA9IGZhbHNlO1xuICBASW5wdXQoKSBqdW1wVG9RdWVzdGlvbjtcbiAgQElucHV0KCkgbWFpblByb2dyZXNzQmFyO1xuICBASW5wdXQoKSBzZWN0aW9uSW5kZXggPSAwO1xuICBASW5wdXQoKSBwYXJlbnRDb25maWc6IElQYXJlbnRDb25maWc7XG4gIEBPdXRwdXQoKSBwbGF5ZXJFdmVudCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCkgdGVsZW1ldHJ5RXZlbnQgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgpIHNlY3Rpb25FbmQgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgpIHNjb3JlID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBPdXRwdXQoKSBzdW1tYXJ5ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBPdXRwdXQoKSBzaG93U2NvcmVCb2FyZCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIEBWaWV3Q2hpbGQoJ215Q2Fyb3VzZWwnLCB7IHN0YXRpYzogZmFsc2UgfSkgbXlDYXJvdXNlbDogQ2Fyb3VzZWxDb21wb25lbnQ7XG4gIEBWaWV3Q2hpbGQoJ2ltYWdlTW9kYWwnLCB7IHN0YXRpYzogdHJ1ZSB9KSBpbWFnZU1vZGFsO1xuICBAVmlld0NoaWxkKCdxdWVzdGlvblNsaWRlJywgeyBzdGF0aWM6IGZhbHNlIH0pIHF1ZXN0aW9uU2xpZGU7XG5cbiAgZGVzdHJveSQ6IFN1YmplY3Q8Ym9vbGVhbj4gPSBuZXcgU3ViamVjdDxib29sZWFuPigpO1xuICBsb2FkVmlldyA9IGZhbHNlO1xuICBzaG93Q29udGVudEVycm9yID0gZmFsc2U7XG4gIG5vT2ZUaW1lc0FwaUNhbGxlZCA9IDA7XG4gIGN1cnJlbnRTbGlkZUluZGV4ID0gMDtcbiAgc2hvd1N0YXJ0UGFnZSA9IHRydWU7XG4gIHNpZGVNZW51Q29uZmlnID0ge1xuICAgIGVuYWJsZTogdHJ1ZSxcbiAgICBzaG93U2hhcmU6IHRydWUsXG4gICAgc2hvd0Rvd25sb2FkOiB0cnVlLFxuICAgIHNob3dSZXBsYXk6IGZhbHNlLFxuICAgIHNob3dFeGl0OiB0cnVlLFxuICB9O1xuICB0aHJlc2hvbGQ6IG51bWJlcjtcbiAgcXVlc3Rpb25zID0gW107XG4gIHF1ZXN0aW9uSWRzOiBzdHJpbmdbXTtcbiAgcXVlc3Rpb25JZHNDb3B5OiBzdHJpbmdbXTtcbiAgbm9PZlF1ZXN0aW9uczogbnVtYmVyO1xuICBpbml0aWFsVGltZTogbnVtYmVyO1xuICB0aW1lTGltaXQ6IGFueTtcbiAgd2FybmluZ1RpbWU6IG51bWJlcjtcbiAgc2hvd1RpbWVyOiBhbnk7XG4gIHNob3dGZWVkQmFjazogYm9vbGVhbjtcbiAgc2hvd1VzZXJTb2x1dGlvbjogYm9vbGVhbjtcbiAgc3RhcnRQYWdlSW5zdHJ1Y3Rpb246IHN0cmluZztcbiAgbWF4U2NvcmU6IG51bWJlcjtcbiAgcG9pbnRzOiBudW1iZXI7XG4gIGluaXRpYWxpemVUaW1lcjogYm9vbGVhbjtcblxuICB0b3RhbFNjb3JlOiBudW1iZXI7XG4gIGxpbmVhck5hdmlnYXRpb246IGJvb2xlYW47XG4gIHNob3dIaW50czogYW55O1xuICBhbGxvd1NraXA6IGJvb2xlYW47XG4gIHByb2dyZXNzQmFyQ2xhc3MgPSBbXTtcbiAgY3VycmVudFF1ZXN0aW9uc01lZGlhOiBhbnk7XG4gIGRpc2FibGVOZXh0OiBib29sZWFuO1xuICBlbmRQYWdlUmVhY2hlZDogYm9vbGVhbjtcbiAgdHJ5QWdhaW5DbGlja2VkID0gZmFsc2U7XG4gIGN1cnJlbnRPcHRpb25TZWxlY3RlZDogc3RyaW5nO1xuICBjYXJvdXNlbENvbmZpZyA9IHtcbiAgICBORVhUOiAxLFxuICAgIFBSRVY6IDJcbiAgfTtcbiAgYWN0aXZlID0gZmFsc2U7XG4gIHNob3dBbGVydDogYm9vbGVhbjtcbiAgY3VycmVudE9wdGlvbnM6IGFueTtcbiAgY3VycmVudFF1ZXN0aW9uOiBhbnk7XG4gIG1lZGlhOiBhbnk7XG4gIGN1cnJlbnRTb2x1dGlvbnM6IGFueTtcbiAgc2hvd1NvbHV0aW9uOiBhbnk7XG4gIG9wdGlvblNlbGVjdGVkT2JqOiBhbnk7XG4gIGludGVydmFsUmVmOiBhbnk7XG4gIGFsZXJ0VHlwZTogc3RyaW5nO1xuICBpbmZvUG9wdXA6IGJvb2xlYW47XG4gIG91dGNvbWVMYWJlbDogc3RyaW5nO1xuICBzdG9wQXV0b05hdmlnYXRpb246IGJvb2xlYW47XG4gIGp1bXBTbGlkZUluZGV4OiBhbnk7XG4gIHNob3dRdWVzdGlvbnMgPSBmYWxzZTtcbiAgc2hvd1pvb21Nb2RhbCA9IGZhbHNlO1xuICB6b29tSW1nU3JjOiBzdHJpbmc7XG4gIGltYWdlWm9vbUNvdW50ID0gMTAwO1xuICByZXBsYXllZCA9IGZhbHNlO1xuICBzZWN0aW9uSWQ6IHN0cmluZztcbiAgc2hvd1Jvb3RJbnN0cnVjdGlvbiA9IHRydWU7XG4gIHNsaWRlRHVyYXRpb24gPSAwO1xuICBpbml0aWFsU2xpZGVEdXJhdGlvbjogbnVtYmVyO1xuICBkaXNhYmxlZEhhbmRsZTogYW55O1xuICBzdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIHZpZXdlclNlcnZpY2U6IFZpZXdlclNlcnZpY2UsXG4gICAgcHVibGljIHV0aWxTZXJ2aWNlOiBVdGlsU2VydmljZSxcbiAgICBwdWJsaWMgcXVlc3Rpb25DdXJzb3I6IFF1ZXN0aW9uQ3Vyc29yLFxuICAgIHByaXZhdGUgY2RSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIHB1YmxpYyBlcnJvclNlcnZpY2U6IEVycm9yU2VydmljZVxuICApIHsgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXMpOiB2b2lkIHtcbiAgICB0aGlzLnN1YnNjcmliZVRvRXZlbnRzKCk7XG4gICAgdGhpcy5zZXRDb25maWcoKTtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICB0aGlzLnZpZXdlclNlcnZpY2UucmFpc2VTdGFydEV2ZW50KDApO1xuICAgIHRoaXMudmlld2VyU2VydmljZS5yYWlzZUhlYXJ0QmVhdEV2ZW50KGV2ZW50TmFtZS5zdGFydFBhZ2VMb2FkZWQsICdpbXByZXNzaW9uJywgMCk7XG4gIH1cblxuICBwcml2YXRlIHN1YnNjcmliZVRvRXZlbnRzKCk6IHZvaWQge1xuICAgIHRoaXMudmlld2VyU2VydmljZS5xdW1sUGxheWVyRXZlbnQuYXNPYnNlcnZhYmxlKClcbiAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLmRlc3Ryb3kkKSlcbiAgICAgIC5zdWJzY3JpYmUoKHJlcykgPT4ge1xuICAgICAgICB0aGlzLnBsYXllckV2ZW50LmVtaXQocmVzKTtcbiAgICAgIH0pO1xuXG4gICAgdGhpcy52aWV3ZXJTZXJ2aWNlLnF1bWxRdWVzdGlvbkV2ZW50XG4gICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5kZXN0cm95JCkpXG4gICAgICAuc3Vic2NyaWJlKChyZXMpID0+IHtcblxuICAgICAgICBpZiAocmVzPy5lcnJvcikge1xuICAgICAgICAgIGNvbnN0IHsgdHJhY2VJZCB9ID0gdGhpcy5zZWN0aW9uQ29uZmlnPy5jb25maWc7XG4gICAgICAgICAgaWYgKG5hdmlnYXRvci5vbkxpbmUgJiYgdGhpcy52aWV3ZXJTZXJ2aWNlLmlzQXZhaWxhYmxlTG9jYWxseSkge1xuICAgICAgICAgICAgdGhpcy52aWV3ZXJTZXJ2aWNlLnJhaXNlRXhjZXB0aW9uTG9nKGVycm9yQ29kZS5jb250ZW50TG9hZEZhaWxzLCBlcnJvck1lc3NhZ2UuY29udGVudExvYWRGYWlscyxcbiAgICAgICAgICAgICAgbmV3IEVycm9yKGVycm9yTWVzc2FnZS5jb250ZW50TG9hZEZhaWxzKSwgdHJhY2VJZCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudmlld2VyU2VydmljZS5yYWlzZUV4Y2VwdGlvbkxvZyhlcnJvckNvZGUuaW50ZXJuZXRDb25uZWN0aXZpdHksIGVycm9yTWVzc2FnZS5pbnRlcm5ldENvbm5lY3Rpdml0eSxcbiAgICAgICAgICAgICAgbmV3IEVycm9yKGVycm9yTWVzc2FnZS5pbnRlcm5ldENvbm5lY3Rpdml0eSksIHRyYWNlSWQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLnNob3dDb250ZW50RXJyb3IgPSB0cnVlO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghcmVzPy5xdWVzdGlvbnMpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdW5Db21tb25RdWVzdGlvbnMgPSBfLnhvckJ5KHRoaXMucXVlc3Rpb25zLCByZXMucXVlc3Rpb25zLCAnaWRlbnRpZmllcicpO1xuICAgICAgICB0aGlzLnF1ZXN0aW9ucyA9IF8udW5pcUJ5KHRoaXMucXVlc3Rpb25zLmNvbmNhdCh1bkNvbW1vblF1ZXN0aW9ucyksICdpZGVudGlmaWVyJyk7XG4gICAgICAgIHRoaXMuc29ydFF1ZXN0aW9ucygpO1xuICAgICAgICB0aGlzLnZpZXdlclNlcnZpY2UudXBkYXRlU2VjdGlvblF1ZXN0aW9ucyh0aGlzLnNlY3Rpb25Db25maWcubWV0YWRhdGEuaWRlbnRpZmllciwgdGhpcy5xdWVzdGlvbnMpO1xuICAgICAgICB0aGlzLmNkUmVmLmRldGVjdENoYW5nZXMoKTtcbiAgICAgICAgdGhpcy5ub09mVGltZXNBcGlDYWxsZWQrKztcbiAgICAgICAgdGhpcy5sb2FkVmlldyA9IHRydWU7XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRTbGlkZUluZGV4ID4gMCAmJiB0aGlzLm15Q2Fyb3VzZWwpIHtcbiAgICAgICAgICB0aGlzLm15Q2Fyb3VzZWwuc2VsZWN0U2xpZGUodGhpcy5jdXJyZW50U2xpZGVJbmRleCk7XG4gICAgICAgICAgaWYgKHRoaXMucXVlc3Rpb25zW3RoaXMuY3VycmVudFNsaWRlSW5kZXggLSAxXSkge1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50UXVlc3Rpb25zTWVkaWEgPSB0aGlzLnF1ZXN0aW9uc1t0aGlzLmN1cnJlbnRTbGlkZUluZGV4IC0gMV0/Lm1lZGlhO1xuICAgICAgICAgICAgdGhpcy5zZXRJbWFnZVpvb20oKTtcbiAgICAgICAgICAgIHRoaXMuaGlnaGxpZ2h0UXVlc3Rpb24oKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5jdXJyZW50U2xpZGVJbmRleCA9PT0gMCkge1xuICAgICAgICAgIGlmICh0aGlzLnNob3dTdGFydFBhZ2UpIHtcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlID0gdGhpcy5zZWN0aW9uSW5kZXggPT09IDA7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4geyB0aGlzLm5leHRTbGlkZSgpOyB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGUoKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXRDb25maWcoKSB7XG4gICAgdGhpcy5ub09mVGltZXNBcGlDYWxsZWQgPSAwO1xuICAgIHRoaXMuY3VycmVudFNsaWRlSW5kZXggPSAwO1xuICAgIHRoaXMuYWN0aXZlID0gdGhpcy5jdXJyZW50U2xpZGVJbmRleCA9PT0gMCAmJiB0aGlzLnNlY3Rpb25JbmRleCA9PT0gMCAmJiB0aGlzLnNob3dTdGFydFBhZ2U7XG5cbiAgICBpZiAodGhpcy5teUNhcm91c2VsKSB7XG4gICAgICB0aGlzLm15Q2Fyb3VzZWwuc2VsZWN0U2xpZGUodGhpcy5jdXJyZW50U2xpZGVJbmRleCk7XG4gICAgfVxuICAgIHRoaXMuc2lkZU1lbnVDb25maWcgPSB7IC4uLnRoaXMuc2lkZU1lbnVDb25maWcsIC4uLnRoaXMuc2VjdGlvbkNvbmZpZz8uY29uZmlnPy5zaWRlTWVudSB9O1xuICAgIHRoaXMudGhyZXNob2xkID0gdGhpcy5zZWN0aW9uQ29uZmlnLmNvbnRleHQ/LnRocmVzaG9sZCB8fCAzO1xuICAgIHRoaXMucXVlc3Rpb25JZHMgPSBfLmNsb25lRGVlcCh0aGlzLnNlY3Rpb25Db25maWcubWV0YWRhdGEuY2hpbGROb2Rlcyk7XG5cbiAgICBpZiAodGhpcy5wYXJlbnRDb25maWcuaXNSZXBsYXllZCkge1xuICAgICAgdGhpcy5yZXBsYXllZCA9IHRydWU7XG4gICAgICB0aGlzLmluaXRpYWxpemVUaW1lciA9IHRydWU7XG4gICAgICB0aGlzLnZpZXdlclNlcnZpY2UucmFpc2VTdGFydEV2ZW50KDApO1xuICAgICAgdGhpcy52aWV3ZXJTZXJ2aWNlLnJhaXNlSGVhcnRCZWF0RXZlbnQoZXZlbnROYW1lLnN0YXJ0UGFnZUxvYWRlZCwgJ2ltcHJlc3Npb24nLCAwKTtcbiAgICAgIHRoaXMuZGlzYWJsZU5leHQgPSBmYWxzZTtcbiAgICAgIHRoaXMuY3VycmVudFNsaWRlSW5kZXggPSAxO1xuICAgICAgdGhpcy5teUNhcm91c2VsLnNlbGVjdFNsaWRlKDEpO1xuICAgICAgdGhpcy5jdXJyZW50UXVlc3Rpb25zTWVkaWEgPSBfLmdldCh0aGlzLnF1ZXN0aW9uc1swXSwgJ21lZGlhJyk7XG4gICAgICB0aGlzLnNldEltYWdlWm9vbSgpO1xuICAgICAgdGhpcy5sb2FkVmlldyA9IHRydWU7XG4gICAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZSgpO1xuXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgY29uc3QgbWVudUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNvdmVybGF5LWJ1dHRvbicpIGFzIEhUTUxFbGVtZW50O1xuICAgICAgICBpZiAobWVudUJ0bikge1xuICAgICAgICAgIG1lbnVCdG4uZm9jdXMoKTtcbiAgICAgICAgfVxuICAgICAgfSwgMTAwKTtcbiAgICB9XG5cbiAgICB0aGlzLnF1ZXN0aW9uSWRzQ29weSA9IF8uY2xvbmVEZWVwKHRoaXMuc2VjdGlvbkNvbmZpZy5tZXRhZGF0YS5jaGlsZE5vZGVzKTtcbiAgICBjb25zdCBtYXhRdWVzdGlvbnMgPSB0aGlzLnNlY3Rpb25Db25maWcubWV0YWRhdGEubWF4UXVlc3Rpb25zO1xuICAgIGlmIChtYXhRdWVzdGlvbnMpIHtcbiAgICAgIHRoaXMucXVlc3Rpb25JZHMgPSB0aGlzLnF1ZXN0aW9uSWRzLnNsaWNlKDAsIG1heFF1ZXN0aW9ucyk7XG4gICAgICB0aGlzLnF1ZXN0aW9uSWRzQ29weSA9IHRoaXMucXVlc3Rpb25JZHNDb3B5LnNsaWNlKDAsIG1heFF1ZXN0aW9ucyk7XG4gICAgfVxuXG4gICAgdGhpcy5ub09mUXVlc3Rpb25zID0gdGhpcy5xdWVzdGlvbklkcy5sZW5ndGg7XG4gICAgdGhpcy52aWV3ZXJTZXJ2aWNlLmluaXRpYWxpemUodGhpcy5zZWN0aW9uQ29uZmlnLCB0aGlzLnRocmVzaG9sZCwgdGhpcy5xdWVzdGlvbklkcywgdGhpcy5wYXJlbnRDb25maWcpO1xuICAgIHRoaXMuY2hlY2tDb21wYXRpYmlsaXR5TGV2ZWwodGhpcy5zZWN0aW9uQ29uZmlnLm1ldGFkYXRhLmNvbXBhdGliaWxpdHlMZXZlbCk7XG4gICAgdGhpcy5pbml0aWFsVGltZSA9IHRoaXMuaW5pdGlhbFNsaWRlRHVyYXRpb24gPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICB0aGlzLnRpbWVMaW1pdCA9IHRoaXMuc2VjdGlvbkNvbmZpZy5tZXRhZGF0YT8udGltZUxpbWl0cz8ubWF4VGltZSB8fCAwO1xuICAgIHRoaXMud2FybmluZ1RpbWUgPSB0aGlzLnNlY3Rpb25Db25maWcubWV0YWRhdGE/LnRpbWVMaW1pdHM/Lndhcm5pbmdUaW1lIHx8IDA7XG4gICAgdGhpcy5zaG93VGltZXIgPSB0aGlzLnNlY3Rpb25Db25maWcubWV0YWRhdGE/LnNob3dUaW1lcj8udG9Mb3dlckNhc2UoKSAhPT0gJ25vJztcbiAgICB0aGlzLnNob3dGZWVkQmFjayA9IHRoaXMuc2VjdGlvbkNvbmZpZy5tZXRhZGF0YT8uc2hvd0ZlZWRiYWNrPy50b0xvd2VyQ2FzZSgpICE9PSAnbm8nO1xuICAgIHRoaXMuc2hvd1VzZXJTb2x1dGlvbiA9IHRoaXMuc2VjdGlvbkNvbmZpZy5tZXRhZGF0YT8uc2hvd1NvbHV0aW9ucz8udG9Mb3dlckNhc2UoKSAhPT0gJ25vJztcbiAgICB0aGlzLnN0YXJ0UGFnZUluc3RydWN0aW9uID0gdGhpcy5zZWN0aW9uQ29uZmlnLm1ldGFkYXRhPy5pbnN0cnVjdGlvbnM/LmRlZmF1bHQgfHwgdGhpcy5wYXJlbnRDb25maWcuaW5zdHJ1Y3Rpb25zO1xuICAgIHRoaXMubGluZWFyTmF2aWdhdGlvbiA9IHRoaXMuc2VjdGlvbkNvbmZpZy5tZXRhZGF0YS5uYXZpZ2F0aW9uTW9kZSA9PT0gJ25vbi1saW5lYXInID8gZmFsc2UgOiB0cnVlO1xuICAgIHRoaXMuc2hvd0hpbnRzID0gdGhpcy5zZWN0aW9uQ29uZmlnLm1ldGFkYXRhPy5zaG93SGludHM/LnRvTG93ZXJDYXNlKCkgIT09ICdubyc7XG4gICAgdGhpcy5wb2ludHMgPSB0aGlzLnNlY3Rpb25Db25maWcubWV0YWRhdGE/LnBvaW50cztcblxuICAgIHRoaXMuYWxsb3dTa2lwID0gdGhpcy5zZWN0aW9uQ29uZmlnLm1ldGFkYXRhPy5hbGxvd1NraXA/LnRvTG93ZXJDYXNlKCkgIT09ICdubyc7XG4gICAgdGhpcy5zaG93U3RhcnRQYWdlID0gdGhpcy5zZWN0aW9uQ29uZmlnLm1ldGFkYXRhPy5zaG93U3RhcnRQYWdlPy50b0xvd2VyQ2FzZSgpICE9PSAnbm8nO1xuICAgIHRoaXMudG90YWxTY29yZSA9IHRoaXMuc2VjdGlvbkNvbmZpZy5tZXRhZGF0YT8ubWF4U2NvcmU7XG4gICAgdGhpcy5wcm9ncmVzc0JhckNsYXNzID0gdGhpcy5wYXJlbnRDb25maWcuaXNTZWN0aW9uc0F2YWlsYWJsZSA/IHRoaXMubWFpblByb2dyZXNzQmFyLmZpbmQoaXRlbSA9PiBpdGVtLmlzQWN0aXZlKT8uY2hpbGRyZW4gOlxuICAgICAgdGhpcy5tYWluUHJvZ3Jlc3NCYXI7XG5cbiAgICB0aGlzLnF1ZXN0aW9ucyA9IHRoaXMudmlld2VyU2VydmljZS5nZXRTZWN0aW9uUXVlc3Rpb25zKHRoaXMuc2VjdGlvbkNvbmZpZy5tZXRhZGF0YS5pZGVudGlmaWVyKTtcbiAgICB0aGlzLnNvcnRRdWVzdGlvbnMoKTtcbiAgICB0aGlzLnZpZXdlclNlcnZpY2UudXBkYXRlU2VjdGlvblF1ZXN0aW9ucyh0aGlzLnNlY3Rpb25Db25maWcubWV0YWRhdGEuaWRlbnRpZmllciwgdGhpcy5xdWVzdGlvbnMpO1xuICAgIHRoaXMucmVzZXRRdWVzdGlvblN0YXRlKCk7XG4gICAgaWYgKHRoaXMuanVtcFRvUXVlc3Rpb24pIHtcbiAgICAgIHRoaXMuZ29Ub1F1ZXN0aW9uKHRoaXMuanVtcFRvUXVlc3Rpb24pO1xuICAgIH0gZWxzZSBpZiAodGhpcy50aHJlc2hvbGQgPT09IDEpIHtcbiAgICAgIHRoaXMudmlld2VyU2VydmljZS5nZXRRdWVzdGlvbigpO1xuICAgIH0gZWxzZSBpZiAodGhpcy50aHJlc2hvbGQgPiAxKSB7XG4gICAgICB0aGlzLnZpZXdlclNlcnZpY2UuZ2V0UXVlc3Rpb25zKCk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLnNlY3Rpb25Db25maWcubWV0YWRhdGE/LmNoaWxkcmVuPy5sZW5ndGgpIHtcbiAgICAgIHRoaXMubG9hZFZpZXcgPSB0cnVlO1xuICAgICAgdGhpcy5kaXNhYmxlTmV4dCA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgcmVtb3ZlQXR0cmlidXRlKCkge1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgY29uc3QgZmlyc3RTbGlkZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jYXJvdXNlbC5zbGlkZScpIGFzIEhUTUxFbGVtZW50O1xuICAgICAgaWYgKGZpcnN0U2xpZGUpIHtcbiAgICAgICAgZmlyc3RTbGlkZS5yZW1vdmVBdHRyaWJ1dGUoXCJ0YWJpbmRleFwiKTtcbiAgICAgIH1cbiAgICB9LCAxMDApO1xuICB9XG5cbiAgc29ydFF1ZXN0aW9ucygpIHtcbiAgICBpZiAodGhpcy5xdWVzdGlvbnMubGVuZ3RoICYmIHRoaXMucXVlc3Rpb25JZHMubGVuZ3RoKSB7XG4gICAgICBjb25zdCBxdWVzID0gW107XG4gICAgICB0aGlzLnF1ZXN0aW9uSWRzLmZvckVhY2goKHF1ZXN0aW9uSWQpID0+IHtcbiAgICAgICAgY29uc3QgcXVlID0gdGhpcy5xdWVzdGlvbnMuZmluZChxdWVzdGlvbiA9PiBxdWVzdGlvbi5pZGVudGlmaWVyID09PSBxdWVzdGlvbklkKTtcbiAgICAgICAgaWYgKHF1ZSkge1xuICAgICAgICAgIHF1ZXMucHVzaChxdWUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHRoaXMucXVlc3Rpb25zID0gcXVlcztcbiAgICB9XG4gIH1cblxuICBjcmVhdGVTdW1tYXJ5T2JqKCkge1xuICAgIGNvbnN0IGNsYXNzT2JqID0gXy5ncm91cEJ5KHRoaXMucHJvZ3Jlc3NCYXJDbGFzcywgJ2NsYXNzJyk7XG4gICAgcmV0dXJuIHtcbiAgICAgIHNraXBwZWQ6IGNsYXNzT2JqPy5za2lwcGVkPy5sZW5ndGggfHwgMCxcbiAgICAgIGNvcnJlY3Q6IGNsYXNzT2JqPy5jb3JyZWN0Py5sZW5ndGggfHwgMCxcbiAgICAgIHdyb25nOiBjbGFzc09iaj8ud3Jvbmc/Lmxlbmd0aCB8fCAwLFxuICAgICAgcGFydGlhbDogY2xhc3NPYmo/LnBhcnRpYWw/Lmxlbmd0aCB8fCAwXG4gICAgfTtcbiAgfVxuXG4gIG5leHRTbGlkZSgpIHtcbiAgICB0aGlzLmN1cnJlbnRRdWVzdGlvbnNNZWRpYSA9IF8uZ2V0KHRoaXMucXVlc3Rpb25zW3RoaXMuY3VycmVudFNsaWRlSW5kZXhdLCAnbWVkaWEnKTtcblxuICAgIHRoaXMuZ2V0UXVlc3Rpb24oKTtcbiAgICB0aGlzLnZpZXdlclNlcnZpY2UucmFpc2VIZWFydEJlYXRFdmVudChldmVudE5hbWUubmV4dENsaWNrZWQsIFRlbGVtZXRyeVR5cGUuaW50ZXJhY3QsIHRoaXMubXlDYXJvdXNlbC5nZXRDdXJyZW50U2xpZGVJbmRleCgpICsgMSk7XG4gICAgdGhpcy52aWV3ZXJTZXJ2aWNlLnJhaXNlSGVhcnRCZWF0RXZlbnQoZXZlbnROYW1lLm5leHRDbGlja2VkLCBUZWxlbWV0cnlUeXBlLmltcHJlc3Npb24sIHRoaXMubXlDYXJvdXNlbC5nZXRDdXJyZW50U2xpZGVJbmRleCgpICsgMSk7XG5cbiAgICBpZiAodGhpcy5jdXJyZW50U2xpZGVJbmRleCAhPT0gdGhpcy5xdWVzdGlvbnMubGVuZ3RoKSB7XG4gICAgICB0aGlzLmN1cnJlbnRTbGlkZUluZGV4ID0gdGhpcy5jdXJyZW50U2xpZGVJbmRleCArIDE7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmluaXRpYWxpemVUaW1lcikge1xuICAgICAgdGhpcy5pbml0aWFsaXplVGltZXIgPSB0cnVlO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm15Q2Fyb3VzZWwuZ2V0Q3VycmVudFNsaWRlSW5kZXgoKSA9PT0gdGhpcy5ub09mUXVlc3Rpb25zKSB7XG4gICAgICB0aGlzLmVtaXRTZWN0aW9uRW5kKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMubXlDYXJvdXNlbC5pc0xhc3QodGhpcy5teUNhcm91c2VsLmdldEN1cnJlbnRTbGlkZUluZGV4KCkpIHx8IHRoaXMubm9PZlF1ZXN0aW9ucyA9PT0gdGhpcy5teUNhcm91c2VsLmdldEN1cnJlbnRTbGlkZUluZGV4KCkpIHtcbiAgICAgIHRoaXMuY2FsY3VsYXRlU2NvcmUoKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5teUNhcm91c2VsLmdldEN1cnJlbnRTbGlkZUluZGV4KCkgPiAwICYmXG4gICAgICB0aGlzLnF1ZXN0aW9uc1t0aGlzLm15Q2Fyb3VzZWwuZ2V0Q3VycmVudFNsaWRlSW5kZXgoKSAtIDFdLnFUeXBlID09PSAnTUNRJyAmJiB0aGlzLmN1cnJlbnRPcHRpb25TZWxlY3RlZCkge1xuICAgICAgY29uc3Qgb3B0aW9uID0gdGhpcy5jdXJyZW50T3B0aW9uU2VsZWN0ZWQgJiYgdGhpcy5jdXJyZW50T3B0aW9uU2VsZWN0ZWRbJ29wdGlvbiddID8gdGhpcy5jdXJyZW50T3B0aW9uU2VsZWN0ZWRbJ29wdGlvbiddIDogdW5kZWZpbmVkO1xuICAgICAgY29uc3QgaWRlbnRpZmllciA9IHRoaXMucXVlc3Rpb25zW3RoaXMubXlDYXJvdXNlbC5nZXRDdXJyZW50U2xpZGVJbmRleCgpIC0gMV0uaWRlbnRpZmllcjtcbiAgICAgIGNvbnN0IHFUeXBlID0gdGhpcy5xdWVzdGlvbnNbdGhpcy5teUNhcm91c2VsLmdldEN1cnJlbnRTbGlkZUluZGV4KCkgLSAxXS5xVHlwZTtcbiAgICAgIHRoaXMudmlld2VyU2VydmljZS5yYWlzZVJlc3BvbnNlRXZlbnQoaWRlbnRpZmllciwgcVR5cGUsIG9wdGlvbik7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucXVlc3Rpb25zW3RoaXMubXlDYXJvdXNlbC5nZXRDdXJyZW50U2xpZGVJbmRleCgpXSkge1xuICAgICAgdGhpcy5zZXRTa2lwcGVkQ2xhc3ModGhpcy5teUNhcm91c2VsLmdldEN1cnJlbnRTbGlkZUluZGV4KCkpO1xuICAgIH1cbiAgICB0aGlzLm15Q2Fyb3VzZWwubW92ZSh0aGlzLmNhcm91c2VsQ29uZmlnLk5FWFQpO1xuICAgIHRoaXMuc2V0SW1hZ2Vab29tKCk7XG4gICAgdGhpcy5yZXNldFF1ZXN0aW9uU3RhdGUoKTtcbiAgICB0aGlzLmNsZWFyVGltZUludGVydmFsKCk7XG4gIH1cblxuICBwcmV2U2xpZGUoKSB7XG4gICAgdGhpcy5kaXNhYmxlTmV4dCA9IGZhbHNlO1xuICAgIHRoaXMuY3VycmVudFNvbHV0aW9ucyA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLnZpZXdlclNlcnZpY2UucmFpc2VIZWFydEJlYXRFdmVudChldmVudE5hbWUucHJldkNsaWNrZWQsIFRlbGVtZXRyeVR5cGUuaW50ZXJhY3QsIHRoaXMubXlDYXJvdXNlbC5nZXRDdXJyZW50U2xpZGVJbmRleCgpIC0gMSk7XG4gICAgdGhpcy5zaG93QWxlcnQgPSBmYWxzZTtcblxuICAgIGlmICh0aGlzLmN1cnJlbnRTbGlkZUluZGV4ICE9PSB0aGlzLnF1ZXN0aW9ucy5sZW5ndGgpIHtcbiAgICAgIHRoaXMuY3VycmVudFNsaWRlSW5kZXggPSB0aGlzLmN1cnJlbnRTbGlkZUluZGV4ICsgMTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5teUNhcm91c2VsLmdldEN1cnJlbnRTbGlkZUluZGV4KCkgKyAxID09PSB0aGlzLm5vT2ZRdWVzdGlvbnMgJiYgdGhpcy5lbmRQYWdlUmVhY2hlZCkge1xuICAgICAgdGhpcy5lbmRQYWdlUmVhY2hlZCA9IGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm15Q2Fyb3VzZWwubW92ZSh0aGlzLmNhcm91c2VsQ29uZmlnLlBSRVYpO1xuICAgIH1cbiAgICB0aGlzLmN1cnJlbnRTbGlkZUluZGV4ID0gdGhpcy5teUNhcm91c2VsLmdldEN1cnJlbnRTbGlkZUluZGV4KCk7XG4gICAgdGhpcy5hY3RpdmUgPSB0aGlzLmN1cnJlbnRTbGlkZUluZGV4ID09PSAwICYmIHRoaXMuc2VjdGlvbkluZGV4ID09PSAwICYmIHRoaXMuc2hvd1N0YXJ0UGFnZTtcbiAgICB0aGlzLmN1cnJlbnRRdWVzdGlvbnNNZWRpYSA9IF8uZ2V0KHRoaXMucXVlc3Rpb25zW3RoaXMubXlDYXJvdXNlbC5nZXRDdXJyZW50U2xpZGVJbmRleCgpIC0gMV0sICdtZWRpYScpO1xuICAgIHRoaXMuc2V0SW1hZ2Vab29tKCk7XG4gICAgdGhpcy5zZXRTa2lwcGVkQ2xhc3ModGhpcy5teUNhcm91c2VsLmdldEN1cnJlbnRTbGlkZUluZGV4KCkgLSAxKTtcbiAgfVxuXG4gIGdldFF1ZXN0aW9uKCkge1xuICAgIGlmICh0aGlzLm15Q2Fyb3VzZWwuZ2V0Q3VycmVudFNsaWRlSW5kZXgoKSA+IDBcbiAgICAgICYmICgodGhpcy50aHJlc2hvbGQgKiB0aGlzLm5vT2ZUaW1lc0FwaUNhbGxlZCkgLSAxKSA9PT0gdGhpcy5teUNhcm91c2VsLmdldEN1cnJlbnRTbGlkZUluZGV4KClcbiAgICAgICYmIHRoaXMudGhyZXNob2xkICogdGhpcy5ub09mVGltZXNBcGlDYWxsZWQgPj0gdGhpcy5xdWVzdGlvbnMubGVuZ3RoICYmIHRoaXMudGhyZXNob2xkID4gMSkge1xuICAgICAgdGhpcy52aWV3ZXJTZXJ2aWNlLmdldFF1ZXN0aW9ucygpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm15Q2Fyb3VzZWwuZ2V0Q3VycmVudFNsaWRlSW5kZXgoKSA+IDBcbiAgICAgICYmIHRoaXMucXVlc3Rpb25zW3RoaXMubXlDYXJvdXNlbC5nZXRDdXJyZW50U2xpZGVJbmRleCgpXSA9PT0gdW5kZWZpbmVkICYmIHRoaXMudGhyZXNob2xkID4gMSkge1xuICAgICAgdGhpcy52aWV3ZXJTZXJ2aWNlLmdldFF1ZXN0aW9ucygpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnRocmVzaG9sZCA9PT0gMSAmJiB0aGlzLm15Q2Fyb3VzZWwuZ2V0Q3VycmVudFNsaWRlSW5kZXgoKSA+PSAwKSB7XG4gICAgICB0aGlzLnZpZXdlclNlcnZpY2UuZ2V0UXVlc3Rpb24oKTtcbiAgICB9XG4gIH1cblxuICByZXNldFF1ZXN0aW9uU3RhdGUoKSB7XG4gICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcbiAgICB0aGlzLnNob3dBbGVydCA9IGZhbHNlO1xuICAgIHRoaXMub3B0aW9uU2VsZWN0ZWRPYmogPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5jdXJyZW50T3B0aW9uU2VsZWN0ZWQgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5jdXJyZW50UXVlc3Rpb24gPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5jdXJyZW50T3B0aW9ucyA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLmN1cnJlbnRTb2x1dGlvbnMgPSB1bmRlZmluZWQ7XG4gIH1cblxuICBhY3RpdmVTbGlkZUNoYW5nZShldmVudCkge1xuICAgICAgdGhpcy5pbml0aWFsU2xpZGVEdXJhdGlvbiA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICB9XG5cbiAgbmV4dFNsaWRlQ2xpY2tlZChldmVudCkge1xuICAgIGlmICh0aGlzLnNob3dSb290SW5zdHJ1Y3Rpb24gJiYgdGhpcy5wYXJlbnRDb25maWcuaXNTZWN0aW9uc0F2YWlsYWJsZSkge1xuICAgICAgdGhpcy5zaG93Um9vdEluc3RydWN0aW9uID0gZmFsc2U7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0aGlzLm15Q2Fyb3VzZWwuZ2V0Q3VycmVudFNsaWRlSW5kZXgoKSA9PT0gMCkge1xuICAgICAgcmV0dXJuIHRoaXMubmV4dFNsaWRlKCk7XG4gICAgfVxuICAgIGlmIChldmVudD8udHlwZSA9PT0gJ25leHQnKSB7XG4gICAgICB0aGlzLnZhbGlkYXRlU2VsZWN0ZWRPcHRpb24odGhpcy5vcHRpb25TZWxlY3RlZE9iaiwgJ25leHQnKTtcbiAgICB9XG4gIH1cblxuICBwcmV2aW91c1NsaWRlQ2xpY2tlZChldmVudCkge1xuICAgIGlmIChldmVudC5ldmVudCA9PT0gJ3ByZXZpb3VzIGNsaWNrZWQnKSB7XG4gICAgICBpZiAodGhpcy5vcHRpb25TZWxlY3RlZE9iaiAmJiB0aGlzLnNob3dGZWVkQmFjaykge1xuICAgICAgICB0aGlzLnN0b3BBdXRvTmF2aWdhdGlvbiA9IGZhbHNlO1xuICAgICAgICB0aGlzLnZhbGlkYXRlU2VsZWN0ZWRPcHRpb24odGhpcy5vcHRpb25TZWxlY3RlZE9iaiwgJ3ByZXZpb3VzJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnN0b3BBdXRvTmF2aWdhdGlvbiA9IHRydWU7XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRTbGlkZUluZGV4ID09PSAwICYmIHRoaXMucGFyZW50Q29uZmlnLmlzU2VjdGlvbnNBdmFpbGFibGUgJiYgdGhpcy5nZXRDdXJyZW50U2VjdGlvbkluZGV4KCkgPiAwKSB7XG4gICAgICAgICAgY29uc3QgcHJldmlvdXNTZWN0aW9uSWQgPSB0aGlzLm1haW5Qcm9ncmVzc0Jhclt0aGlzLmdldEN1cnJlbnRTZWN0aW9uSW5kZXgoKSAtIDFdLmlkZW50aWZpZXI7XG4gICAgICAgICAgdGhpcy5qdW1wVG9TZWN0aW9uKHByZXZpb3VzU2VjdGlvbklkKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wcmV2U2xpZGUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBnZXRDdXJyZW50U2VjdGlvbkluZGV4KCk6IG51bWJlciB7XG4gICAgY29uc3QgY3VycmVudFNlY3Rpb25JZCA9IHRoaXMuc2VjdGlvbkNvbmZpZy5tZXRhZGF0YS5pZGVudGlmaWVyO1xuICAgIHJldHVybiB0aGlzLm1haW5Qcm9ncmVzc0Jhci5maW5kSW5kZXgoc2VjdGlvbiA9PiBzZWN0aW9uLmlkZW50aWZpZXIgPT09IGN1cnJlbnRTZWN0aW9uSWQpO1xuICB9XG5cbiAgZ29Ub1NsaWRlQ2xpY2tlZChldmVudCwgaW5kZXgpIHtcbiAgICBpZiAoIXRoaXMucHJvZ3Jlc3NCYXJDbGFzcz8ubGVuZ3RoKSB7XG4gICAgICBpZiAoaW5kZXggPT09IDApIHtcbiAgICAgICAgdGhpcy5qdW1wU2xpZGVJbmRleCA9IDA7XG4gICAgICAgIHRoaXMuZ29Ub1NsaWRlKHRoaXMuanVtcFNsaWRlSW5kZXgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xuICAgIHRoaXMuanVtcFNsaWRlSW5kZXggPSBpbmRleDtcbiAgICBpZiAodGhpcy5vcHRpb25TZWxlY3RlZE9iaiAmJiB0aGlzLnNob3dGZWVkQmFjaykge1xuICAgICAgdGhpcy5zdG9wQXV0b05hdmlnYXRpb24gPSBmYWxzZTtcbiAgICAgIHRoaXMudmFsaWRhdGVTZWxlY3RlZE9wdGlvbih0aGlzLm9wdGlvblNlbGVjdGVkT2JqLCAnanVtcCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnN0b3BBdXRvTmF2aWdhdGlvbiA9IHRydWU7XG4gICAgICB0aGlzLmdvVG9TbGlkZSh0aGlzLmp1bXBTbGlkZUluZGV4KTtcbiAgICB9XG4gIH1cblxuICBvbkVudGVyKGV2ZW50LCBpbmRleCkge1xuICAgIGlmIChldmVudC5rZXlDb2RlID09PSAxMykge1xuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICB0aGlzLmdvVG9TbGlkZUNsaWNrZWQoZXZlbnQsIGluZGV4KTtcbiAgICB9XG4gIH1cblxuICBqdW1wVG9TZWN0aW9uKGlkZW50aWZpZXI6IHN0cmluZykge1xuICAgIHRoaXMuc2hvd1Jvb3RJbnN0cnVjdGlvbiA9IGZhbHNlO1xuICAgIHRoaXMuZW1pdFNlY3Rpb25FbmQoZmFsc2UsIGlkZW50aWZpZXIpO1xuICB9XG5cbiAgb25TZWN0aW9uRW50ZXIoZXZlbnQsIGlkZW50aWZpZXI6IHN0cmluZykge1xuICAgIGlmIChldmVudC5rZXlDb2RlID09PSAxMykge1xuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBpZiAodGhpcy5vcHRpb25TZWxlY3RlZE9iaikge1xuICAgICAgICB0aGlzLnZhbGlkYXRlU2VsZWN0ZWRPcHRpb24odGhpcy5vcHRpb25TZWxlY3RlZE9iaiwgJ2p1bXAnKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuanVtcFRvU2VjdGlvbihpZGVudGlmaWVyKTtcbiAgICB9XG4gIH1cblxuICBvblNjb3JlQm9hcmRDbGlja2VkKCkge1xuICAgIHRoaXMudmlld2VyU2VydmljZS51cGRhdGVTZWN0aW9uUXVlc3Rpb25zKHRoaXMuc2VjdGlvbkNvbmZpZy5tZXRhZGF0YS5pZGVudGlmaWVyLCB0aGlzLnF1ZXN0aW9ucyk7XG4gICAgdGhpcy5zaG93U2NvcmVCb2FyZC5lbWl0KCk7XG4gIH1cblxuICBvblNjb3JlQm9hcmRFbnRlcihldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGlmIChldmVudC5rZXlDb2RlID09PSAxMykge1xuICAgICAgdGhpcy5vblNjb3JlQm9hcmRDbGlja2VkKCk7XG4gICAgfVxuICB9XG5cbiAgZm9jdXNPbk5leHRCdXR0b24oKSB7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBjb25zdCBuZXh0QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnF1bWwtbmF2aWdhdGlvbl9fbmV4dCcpIGFzIEhUTUxFbGVtZW50O1xuICAgICAgaWYgKG5leHRCdG4pIHtcbiAgICAgICAgbmV4dEJ0bi5mb2N1cygpO1xuICAgICAgfVxuICAgIH0sIDEwMCk7XG4gIH1cblxuICBnZXRPcHRpb25TZWxlY3RlZChvcHRpb25TZWxlY3RlZCkge1xuICAgIHRoaXMuZm9jdXNPbk5leHRCdXR0b24oKTtcbiAgICB0aGlzLmFjdGl2ZSA9IHRydWU7XG4gICAgdGhpcy5jdXJyZW50T3B0aW9uU2VsZWN0ZWQgPSBvcHRpb25TZWxlY3RlZDtcbiAgICBjb25zdCBjdXJyZW50SW5kZXggPSB0aGlzLm15Q2Fyb3VzZWwuZ2V0Q3VycmVudFNsaWRlSW5kZXgoKSAtIDE7XG4gICAgdGhpcy52aWV3ZXJTZXJ2aWNlLnJhaXNlSGVhcnRCZWF0RXZlbnQoZXZlbnROYW1lLm9wdGlvbkNsaWNrZWQsIFRlbGVtZXRyeVR5cGUuaW50ZXJhY3QsIHRoaXMubXlDYXJvdXNlbC5nZXRDdXJyZW50U2xpZGVJbmRleCgpKTtcblxuICAgIC8vIFRoaXMgb3B0aW9uU2VsZWN0ZWQgY29tZXMgZW1wdHkgd2hlbmV2ZXIgdGhlIHRyeSBhZ2FpbiBpcyBjbGlja2VkIG9uIGZlZWRiYWNrIHBvcHVwXG4gICAgaWYgKF8uaXNFbXB0eShvcHRpb25TZWxlY3RlZD8ub3B0aW9uKSkge1xuICAgICAgdGhpcy5vcHRpb25TZWxlY3RlZE9iaiA9IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuY3VycmVudFNvbHV0aW9ucyA9IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMudXBkYXRlU2NvcmVCb2FyZChjdXJyZW50SW5kZXgsICdza2lwcGVkJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMub3B0aW9uU2VsZWN0ZWRPYmogPSBvcHRpb25TZWxlY3RlZDtcbiAgICAgIHRoaXMuY3VycmVudFNvbHV0aW9ucyA9ICFfLmlzRW1wdHkob3B0aW9uU2VsZWN0ZWQuc29sdXRpb25zKSA/IG9wdGlvblNlbGVjdGVkLnNvbHV0aW9ucyA6IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgdGhpcy5tZWRpYSA9IHRoaXMucXVlc3Rpb25zW3RoaXMubXlDYXJvdXNlbC5nZXRDdXJyZW50U2xpZGVJbmRleCgpIC0gMV0ubWVkaWE7XG5cbiAgICBpZiAodGhpcy5jdXJyZW50U29sdXRpb25zKSB7XG4gICAgICB0aGlzLmN1cnJlbnRTb2x1dGlvbnMuZm9yRWFjaCgoZWxlLCBpbmRleCkgPT4ge1xuICAgICAgICBpZiAoZWxlLnR5cGUgPT09ICd2aWRlbycpIHtcbiAgICAgICAgICB0aGlzLm1lZGlhLmZvckVhY2goKGUpID0+IHtcbiAgICAgICAgICAgIGlmIChlLmlkID09PSB0aGlzLmN1cnJlbnRTb2x1dGlvbnNbaW5kZXhdLnZhbHVlKSB7XG4gICAgICAgICAgICAgIHRoaXMuY3VycmVudFNvbHV0aW9uc1tpbmRleF0udHlwZSA9ICd2aWRlbyc7XG4gICAgICAgICAgICAgIHRoaXMuY3VycmVudFNvbHV0aW9uc1tpbmRleF0uc3JjID0gZS5zcmM7XG4gICAgICAgICAgICAgIHRoaXMuY3VycmVudFNvbHV0aW9uc1tpbmRleF0udGh1bWJuYWlsID0gZS50aHVtYm5haWw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuc2hvd0ZlZWRCYWNrKSB7XG4gICAgICB0aGlzLnZhbGlkYXRlU2VsZWN0ZWRPcHRpb24odGhpcy5vcHRpb25TZWxlY3RlZE9iaik7XG4gICAgfVxuICB9XG5cbiAgZHVyYXRpb25FbmRzKCkge1xuICAgIHRoaXMuc2hvd1NvbHV0aW9uID0gZmFsc2U7XG4gICAgdGhpcy5zaG93QWxlcnQgPSBmYWxzZTtcbiAgICB0aGlzLmVtaXRTZWN0aW9uRW5kKHRydWUpO1xuICB9XG5cbiAgcHJpdmF0ZSBjaGVja0NvbXBhdGliaWxpdHlMZXZlbChjb21wYXRpYmlsaXR5TGV2ZWwpIHtcbiAgICBpZiAoY29tcGF0aWJpbGl0eUxldmVsKSB7XG4gICAgICBjb25zdCBjaGVja0NvbnRlbnRDb21wYXRpYmxlID0gdGhpcy5lcnJvclNlcnZpY2UuY2hlY2tDb250ZW50Q29tcGF0aWJpbGl0eShjb21wYXRpYmlsaXR5TGV2ZWwpO1xuXG4gICAgICBpZiAoIWNoZWNrQ29udGVudENvbXBhdGlibGUuaXNDb21waXRhYmxlKSB7XG4gICAgICAgIHRoaXMudmlld2VyU2VydmljZS5yYWlzZUV4Y2VwdGlvbkxvZyhlcnJvckNvZGUuY29udGVudENvbXBhdGliaWxpdHksIGVycm9yTWVzc2FnZS5jb250ZW50Q29tcGF0aWJpbGl0eSxcbiAgICAgICAgICBjaGVja0NvbnRlbnRDb21wYXRpYmxlLmVycm9yLCB0aGlzLnNlY3Rpb25Db25maWc/LmNvbmZpZz8udHJhY2VJZCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZW1pdFNlY3Rpb25FbmQoaXNEdXJhdGlvbkVuZGVkOiBib29sZWFuID0gZmFsc2UsIGp1bXBUb1NlY3Rpb24/OiBzdHJpbmcpIHtcbiAgICBjb25zdCBldmVudE9iajogYW55ID0ge1xuICAgICAgc3VtbWFyeTogdGhpcy5jcmVhdGVTdW1tYXJ5T2JqKCksXG4gICAgICBzY29yZTogdGhpcy5jYWxjdWxhdGVTY29yZSgpLFxuICAgICAgZHVyYXRpb25TcGVudDogdGhpcy51dGlsU2VydmljZS5nZXRUaW1lU3BlbnRUZXh0KHRoaXMuaW5pdGlhbFRpbWUpLFxuICAgICAgc2xpZGVJbmRleDogdGhpcy5teUNhcm91c2VsLmdldEN1cnJlbnRTbGlkZUluZGV4KCksXG4gICAgICBpc0R1cmF0aW9uRW5kZWQsXG4gICAgfTtcbiAgICBpZiAoanVtcFRvU2VjdGlvbikge1xuICAgICAgZXZlbnRPYmouanVtcFRvU2VjdGlvbiA9IGp1bXBUb1NlY3Rpb247XG4gICAgfVxuICAgIHRoaXMudmlld2VyU2VydmljZS51cGRhdGVTZWN0aW9uUXVlc3Rpb25zKHRoaXMuc2VjdGlvbkNvbmZpZy5tZXRhZGF0YS5pZGVudGlmaWVyLCB0aGlzLnF1ZXN0aW9ucyk7XG4gICAgdGhpcy5zZWN0aW9uRW5kLmVtaXQoZXZlbnRPYmopO1xuICB9XG5cbiAgY2xvc2VBbGVydEJveChldmVudCkge1xuICAgIGlmIChldmVudD8udHlwZSA9PT0gJ2Nsb3NlJykge1xuICAgICAgdGhpcy52aWV3ZXJTZXJ2aWNlLnJhaXNlSGVhcnRCZWF0RXZlbnQoZXZlbnROYW1lLmNsb3NlZEZlZWRCYWNrLCBUZWxlbWV0cnlUeXBlLmludGVyYWN0LCB0aGlzLm15Q2Fyb3VzZWwuZ2V0Q3VycmVudFNsaWRlSW5kZXgoKSk7XG4gICAgfSBlbHNlIGlmIChldmVudD8udHlwZSA9PT0gJ3RyeUFnYWluJykge1xuICAgICAgdGhpcy50cnlBZ2FpbkNsaWNrZWQgPSB0cnVlO1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMudHJ5QWdhaW5DbGlja2VkID0gZmFsc2U7XG4gICAgICB9LCAyMDAwKTtcbiAgICAgIHRoaXMudmlld2VyU2VydmljZS5yYWlzZUhlYXJ0QmVhdEV2ZW50KGV2ZW50TmFtZS50cnlBZ2FpbiwgVGVsZW1ldHJ5VHlwZS5pbnRlcmFjdCwgdGhpcy5teUNhcm91c2VsLmdldEN1cnJlbnRTbGlkZUluZGV4KCkpO1xuICAgIH1cbiAgICB0aGlzLnNob3dBbGVydCA9IGZhbHNlO1xuICB9XG5cbiAgc2V0U2tpcHBlZENsYXNzKGluZGV4KSB7XG4gICAgaWYgKHRoaXMucHJvZ3Jlc3NCYXJDbGFzcyAmJiBfLmdldCh0aGlzLnByb2dyZXNzQmFyQ2xhc3NbaW5kZXhdLCAnY2xhc3MnKSA9PT0gJ3VuYXR0ZW1wdGVkJykge1xuICAgICAgdGhpcy5wcm9ncmVzc0JhckNsYXNzW2luZGV4XS5jbGFzcyA9ICdza2lwcGVkJztcbiAgICB9XG4gIH1cblxuICBzaWRlQmFyRXZlbnRzKGV2ZW50OiBJU2lkZUJhckV2ZW50KSB7XG4gICAgaWYgKGV2ZW50LnR5cGUgPT09ICdPUEVOX01FTlUnIHx8IGV2ZW50LnR5cGUgPT09ICdDTE9TRV9NRU5VJykge1xuICAgICAgdGhpcy5oYW5kbGVTaWRlQmFyQWNjZXNzaWJpbGl0eShldmVudCk7XG4gICAgfVxuICAgIHRoaXMudmlld2VyU2VydmljZS5yYWlzZUhlYXJ0QmVhdEV2ZW50KGV2ZW50LnR5cGUsIFRlbGVtZXRyeVR5cGUuaW50ZXJhY3QsIHRoaXMubXlDYXJvdXNlbC5nZXRDdXJyZW50U2xpZGVJbmRleCgpICsgMSk7XG4gIH1cblxuICBoYW5kbGVTaWRlQmFyQWNjZXNzaWJpbGl0eShldmVudCkge1xuICAgIGNvbnN0IG5hdkJsb2NrID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5hdkJsb2NrJykgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICBjb25zdCBvdmVybGF5SW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjb3ZlcmxheS1pbnB1dCcpIGFzIEhUTUxFbGVtZW50O1xuICAgIGNvbnN0IG92ZXJsYXlCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjb3ZlcmxheS1idXR0b24nKSBhcyBIVE1MRWxlbWVudDtcbiAgICBjb25zdCBzaWRlQmFyTGlzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzaWRlYmFyLWxpc3QnKSBhcyBIVE1MRWxlbWVudDtcblxuICAgIGlmIChldmVudC50eXBlID09PSAnT1BFTl9NRU5VJykge1xuICAgICAgY29uc3QgaXNNb2JpbGUgPSB0aGlzLnNlY3Rpb25Db25maWcuY29uZmlnPy5zaWRlTWVudT8uc2hvd0V4aXQ7XG4gICAgICB0aGlzLmRpc2FibGVkSGFuZGxlID0gaXNNb2JpbGUgPyBtYWludGFpbi5oaWRkZW4oeyBmaWx0ZXI6IFsgc2lkZUJhckxpc3QsIG92ZXJsYXlCdXR0b24sIG92ZXJsYXlJbnB1dCBdIH0pIDogbWFpbnRhaW4udGFiRm9jdXMoeyBjb250ZXh0OiBuYXZCbG9jayB9KTtcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9uID0gZnJvbUV2ZW50KGRvY3VtZW50LCAna2V5ZG93bicpLnN1YnNjcmliZSgoZTogS2V5Ym9hcmRFdmVudCkgPT4ge1xuICAgICAgICBpZiAoZVsna2V5J10gPT09ICdFc2NhcGUnKSB7XG4gICAgICAgICAgY29uc3QgaW5wdXRDaGVja2VkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ292ZXJsYXktaW5wdXQnKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICAgICAgICAgIGlucHV0Q2hlY2tlZC5jaGVja2VkID0gZmFsc2U7XG4gICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BsYXllclNpZGVNZW51Jykuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCcubmF2QmxvY2snKS5zdHlsZS5tYXJnaW5MZWZ0ID0gJy0xMDAlJztcbiAgICAgICAgICB0aGlzLnZpZXdlclNlcnZpY2UucmFpc2VIZWFydEJlYXRFdmVudCgnQ0xPU0VfTUVOVScsIFRlbGVtZXRyeVR5cGUuaW50ZXJhY3QsIHRoaXMubXlDYXJvdXNlbC5nZXRDdXJyZW50U2xpZGVJbmRleCgpICsgMSk7XG4gICAgICAgICAgdGhpcy5kaXNhYmxlZEhhbmRsZS5kaXNlbmdhZ2UoKTtcbiAgICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgICAgIHRoaXMuZGlzYWJsZWRIYW5kbGUgPSBudWxsO1xuICAgICAgICAgIHRoaXMuc3Vic2NyaXB0aW9uID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChldmVudC50eXBlID09PSAnQ0xPU0VfTUVOVScgJiYgdGhpcy5kaXNhYmxlZEhhbmRsZSkge1xuICAgICAgdGhpcy5kaXNhYmxlZEhhbmRsZS5kaXNlbmdhZ2UoKTtcbiAgICAgIHRoaXMuZGlzYWJsZWRIYW5kbGUgPSBudWxsO1xuICAgICAgaWYgKHRoaXMuc3Vic2NyaXB0aW9uKSB7XG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9uID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB2YWxpZGF0ZVNlbGVjdGVkT3B0aW9uKG9wdGlvbiwgdHlwZT86IHN0cmluZykge1xuICAgIGNvbnN0IHNlbGVjdGVkT3B0aW9uVmFsdWUgPSBvcHRpb24/Lm9wdGlvbj8udmFsdWU7XG4gICAgY29uc3QgY3VycmVudEluZGV4ID0gdGhpcy5teUNhcm91c2VsLmdldEN1cnJlbnRTbGlkZUluZGV4KCkgLSAxO1xuICAgIGNvbnN0IGlzUXVlc3Rpb25Ta2lwQWxsb3dlZCA9ICF0aGlzLm9wdGlvblNlbGVjdGVkT2JqICYmXG4gICAgICB0aGlzLmFsbG93U2tpcCAmJiB0aGlzLnV0aWxTZXJ2aWNlLmdldFF1ZXN0aW9uVHlwZSh0aGlzLnF1ZXN0aW9ucywgY3VycmVudEluZGV4KSA9PT0gJ01DUSc7XG4gICAgY29uc3QgaXNTdWJqZWN0aXZlUXVlc3Rpb24gPSB0aGlzLnV0aWxTZXJ2aWNlLmdldFF1ZXN0aW9uVHlwZSh0aGlzLnF1ZXN0aW9ucywgY3VycmVudEluZGV4KSA9PT0gJ1NBJztcbiAgICBjb25zdCBvblN0YXJ0UGFnZSA9IHRoaXMuc3RhcnRQYWdlSW5zdHJ1Y3Rpb24gJiYgdGhpcy5teUNhcm91c2VsLmdldEN1cnJlbnRTbGlkZUluZGV4KCkgPT09IDA7XG4gICAgY29uc3QgaXNBY3RpdmUgPSAhdGhpcy5vcHRpb25TZWxlY3RlZE9iaiAmJiB0aGlzLmFjdGl2ZTtcbiAgICBjb25zdCBzZWxlY3RlZFF1ZXN0aW9uID0gdGhpcy5xdWVzdGlvbnNbY3VycmVudEluZGV4XTtcblxuICAgIGlmICh0aGlzLm9wdGlvblNlbGVjdGVkT2JqKSB7XG4gICAgICBjb25zdCBrZXkgPSB0aGlzLnV0aWxTZXJ2aWNlLmdldEtleVZhbHVlKE9iamVjdC5rZXlzKHNlbGVjdGVkUXVlc3Rpb24ucmVzcG9uc2VEZWNsYXJhdGlvbikpO1xuICAgICAgdGhpcy5jdXJyZW50UXVlc3Rpb24gPSBzZWxlY3RlZFF1ZXN0aW9uLmJvZHk7XG4gICAgICB0aGlzLmN1cnJlbnRPcHRpb25zID0gc2VsZWN0ZWRRdWVzdGlvbi5pbnRlcmFjdGlvbnNba2V5XS5vcHRpb25zO1xuXG4gICAgICBjb25zdCBnZXRQYXJhbXMgPSAoKSA9PiB7XG4gICAgICAgIGlmIChzZWxlY3RlZFF1ZXN0aW9uLnFUeXBlLnRvVXBwZXJDYXNlKCkgPT09ICdNQ1EnICYmIHNlbGVjdGVkUXVlc3Rpb24/LmVkaXRvclN0YXRlPy5vcHRpb25zKSB7XG4gICAgICAgICAgcmV0dXJuIHNlbGVjdGVkUXVlc3Rpb24uZWRpdG9yU3RhdGUub3B0aW9ucztcbiAgICAgICAgfSBlbHNlIGlmIChzZWxlY3RlZFF1ZXN0aW9uLnFUeXBlLnRvVXBwZXJDYXNlKCkgPT09ICdNQ1EnICYmICFfLmlzRW1wdHkoc2VsZWN0ZWRRdWVzdGlvbj8uZWRpdG9yU3RhdGUpKSB7XG4gICAgICAgICAgcmV0dXJuIFtzZWxlY3RlZFF1ZXN0aW9uPy5lZGl0b3JTdGF0ZV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgaWYgKG9wdGlvbi5jYXJkaW5hbGl0eSA9PT0gJ3NpbmdsZScpIHtcbiAgICAgICAgY29uc3QgY29ycmVjdE9wdGlvblZhbHVlID0gTnVtYmVyKHNlbGVjdGVkUXVlc3Rpb24ucmVzcG9uc2VEZWNsYXJhdGlvbltrZXldLmNvcnJlY3RSZXNwb25zZS52YWx1ZSk7XG4gICAgICAgIHRoaXMuc2xpZGVEdXJhdGlvbiA9IE1hdGgucm91bmQoKG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gdGhpcy5pbml0aWFsU2xpZGVEdXJhdGlvbikgLyAxMDAwKTtcbiAgICAgICAgY29uc3QgZWRhdGFJdGVtOiBhbnkgPSB7XG4gICAgICAgICAgJ2lkJzogc2VsZWN0ZWRRdWVzdGlvbi5pZGVudGlmaWVyLFxuICAgICAgICAgICd0aXRsZSc6IHNlbGVjdGVkUXVlc3Rpb24ubmFtZSxcbiAgICAgICAgICAnZGVzYyc6IHNlbGVjdGVkUXVlc3Rpb24uZGVzY3JpcHRpb24sXG4gICAgICAgICAgJ3R5cGUnOiBzZWxlY3RlZFF1ZXN0aW9uLnFUeXBlLnRvTG93ZXJDYXNlKCksXG4gICAgICAgICAgJ21heHNjb3JlJzogc2VsZWN0ZWRRdWVzdGlvbi5yZXNwb25zZURlY2xhcmF0aW9uW2tleV0ubWF4U2NvcmUgfHwgMCxcbiAgICAgICAgICAncGFyYW1zJzogZ2V0UGFyYW1zKClcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoZWRhdGFJdGVtICYmIHRoaXMucGFyZW50Q29uZmlnLmlzU2VjdGlvbnNBdmFpbGFibGUpIHtcbiAgICAgICAgICBlZGF0YUl0ZW0uc2VjdGlvbklkID0gdGhpcy5zZWN0aW9uQ29uZmlnLm1ldGFkYXRhLmlkZW50aWZpZXI7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNob3dBbGVydCA9IHRydWU7XG4gICAgICAgIGlmIChvcHRpb24ub3B0aW9uPy52YWx1ZSA9PT0gY29ycmVjdE9wdGlvblZhbHVlKSB7XG4gICAgICAgICAgY29uc3QgY3VycmVudFNjb3JlID0gdGhpcy5nZXRTY29yZShjdXJyZW50SW5kZXgsIGtleSwgdHJ1ZSk7XG4gICAgICAgICAgdGhpcy52aWV3ZXJTZXJ2aWNlLnJhaXNlQXNzZXNFdmVudChlZGF0YUl0ZW0sIGN1cnJlbnRJbmRleCArIDEsICdZZXMnLCBjdXJyZW50U2NvcmUsIFtvcHRpb24ub3B0aW9uXSwgdGhpcy5zbGlkZUR1cmF0aW9uKTtcbiAgICAgICAgICB0aGlzLmFsZXJ0VHlwZSA9ICdjb3JyZWN0JztcbiAgICAgICAgICBpZiAodGhpcy5zaG93RmVlZEJhY2spXG4gICAgICAgICAgICB0aGlzLmNvcnJlY3RGZWVkQmFja1RpbWVPdXQodHlwZSk7XG4gICAgICAgICAgdGhpcy51cGRhdGVTY29yZUJvYXJkKGN1cnJlbnRJbmRleCwgJ2NvcnJlY3QnLCB1bmRlZmluZWQsIGN1cnJlbnRTY29yZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3QgY3VycmVudFNjb3JlID0gdGhpcy5nZXRTY29yZShjdXJyZW50SW5kZXgsIGtleSwgZmFsc2UsIG9wdGlvbik7XG4gICAgICAgICAgdGhpcy5hbGVydFR5cGUgPSAnd3JvbmcnO1xuICAgICAgICAgIGNvbnN0IGNsYXNzVHlwZSA9IHRoaXMucHJvZ3Jlc3NCYXJDbGFzc1tjdXJyZW50SW5kZXhdLmNsYXNzID09PSAncGFydGlhbCcgPyAncGFydGlhbCcgOiAnd3JvbmcnO1xuICAgICAgICAgIHRoaXMudXBkYXRlU2NvcmVCb2FyZChjdXJyZW50SW5kZXgsIGNsYXNzVHlwZSwgc2VsZWN0ZWRPcHRpb25WYWx1ZSwgY3VycmVudFNjb3JlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG9wdGlvbi5jYXJkaW5hbGl0eSA9PT0gJ211bHRpcGxlJykge1xuICAgICAgICBjb25zdCByZXNwb25zZURlY2xhcmF0aW9uID0gdGhpcy5xdWVzdGlvbnNbY3VycmVudEluZGV4XS5yZXNwb25zZURlY2xhcmF0aW9uO1xuICAgICAgICBjb25zdCBjdXJyZW50U2NvcmUgPSB0aGlzLnV0aWxTZXJ2aWNlLmdldE11bHRpc2VsZWN0U2NvcmUob3B0aW9uLm9wdGlvbiwgcmVzcG9uc2VEZWNsYXJhdGlvbik7XG4gICAgICAgIHRoaXMuc2hvd0FsZXJ0ID0gdHJ1ZTtcbiAgICAgICAgaWYgKGN1cnJlbnRTY29yZSA9PT0gMCkge1xuICAgICAgICAgIHRoaXMuYWxlcnRUeXBlID0gJ3dyb25nJztcbiAgICAgICAgICB0aGlzLnVwZGF0ZVNjb3JlQm9hcmQoKGN1cnJlbnRJbmRleCArIDEpLCAnd3JvbmcnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnVwZGF0ZVNjb3JlQm9hcmQoKChjdXJyZW50SW5kZXggKyAxKSksICdjb3JyZWN0JywgdW5kZWZpbmVkLCBjdXJyZW50U2NvcmUpO1xuICAgICAgICAgIGlmICh0aGlzLnNob3dGZWVkQmFjaylcbiAgICAgICAgICAgIHRoaXMuY29ycmVjdEZlZWRCYWNrVGltZU91dCh0eXBlKTtcbiAgICAgICAgICB0aGlzLmFsZXJ0VHlwZSA9ICdjb3JyZWN0JztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5wcm9ncmVzc0JhckNsYXNzW2N1cnJlbnRJbmRleF0uY2FyZGluYWxpdHkgPSBfLmdldCh0aGlzLm9wdGlvblNlbGVjdGVkT2JqLCAnY2FyZGluYWxpdHknKTtcbiAgICAgIHRoaXMucHJvZ3Jlc3NCYXJDbGFzc1tjdXJyZW50SW5kZXhdLm9wdGlvbiA9IF8uZ2V0KHRoaXMub3B0aW9uU2VsZWN0ZWRPYmosICdvcHRpb24nKTtcbiAgICAgIHRoaXMub3B0aW9uU2VsZWN0ZWRPYmogPSB1bmRlZmluZWQ7XG4gICAgfSBlbHNlIGlmICgoaXNRdWVzdGlvblNraXBBbGxvd2VkKSB8fCBpc1N1YmplY3RpdmVRdWVzdGlvbiB8fCBvblN0YXJ0UGFnZSB8fCBpc0FjdGl2ZSkge1xuICAgICAgdGhpcy5uZXh0U2xpZGUoKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhcnRQYWdlSW5zdHJ1Y3Rpb24gJiYgIXRoaXMub3B0aW9uU2VsZWN0ZWRPYmogJiYgIXRoaXMuYWN0aXZlICYmICF0aGlzLmFsbG93U2tpcCAmJlxuICAgICAgdGhpcy5teUNhcm91c2VsLmdldEN1cnJlbnRTbGlkZUluZGV4KCkgPiAwICYmIHRoaXMudXRpbFNlcnZpY2UuZ2V0UXVlc3Rpb25UeXBlKHRoaXMucXVlc3Rpb25zLCBjdXJyZW50SW5kZXgpID09PSAnTUNRJ1xuICAgICAgJiYgdGhpcy51dGlsU2VydmljZS5jYW5Hbyh0aGlzLnByb2dyZXNzQmFyQ2xhc3NbdGhpcy5teUNhcm91c2VsLmdldEN1cnJlbnRTbGlkZUluZGV4KCldKSkge1xuICAgICAgdGhpcy5pbmZvUG9wdXBUaW1lT3V0KCk7XG4gICAgfSBlbHNlIGlmICghdGhpcy5vcHRpb25TZWxlY3RlZE9iaiAmJiAhdGhpcy5hY3RpdmUgJiYgIXRoaXMuYWxsb3dTa2lwICYmIHRoaXMubXlDYXJvdXNlbC5nZXRDdXJyZW50U2xpZGVJbmRleCgpID49IDBcbiAgICAgICYmIHRoaXMudXRpbFNlcnZpY2UuZ2V0UXVlc3Rpb25UeXBlKHRoaXMucXVlc3Rpb25zLCBjdXJyZW50SW5kZXgpID09PSAnTUNRJ1xuICAgICAgJiYgdGhpcy51dGlsU2VydmljZS5jYW5Hbyh0aGlzLnByb2dyZXNzQmFyQ2xhc3NbdGhpcy5teUNhcm91c2VsLmdldEN1cnJlbnRTbGlkZUluZGV4KCldKSkge1xuICAgICAgdGhpcy5pbmZvUG9wdXBUaW1lT3V0KCk7XG4gICAgfVxuICB9XG5cbiAgaW5mb1BvcHVwVGltZU91dCgpIHtcbiAgICB0aGlzLmluZm9Qb3B1cCA9IHRydWU7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLmluZm9Qb3B1cCA9IGZhbHNlO1xuICAgIH0sIDIwMDApO1xuICB9XG5cbiAgY29ycmVjdEZlZWRCYWNrVGltZU91dCh0eXBlPzogc3RyaW5nKSB7XG4gICAgdGhpcy5pbnRlcnZhbFJlZiA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5zaG93QWxlcnQgPSBmYWxzZTtcbiAgICAgIGlmICghdGhpcy5teUNhcm91c2VsLmlzTGFzdCh0aGlzLm15Q2Fyb3VzZWwuZ2V0Q3VycmVudFNsaWRlSW5kZXgoKSkgJiYgdHlwZSA9PT0gJ25leHQnKSB7XG4gICAgICAgIHRoaXMubmV4dFNsaWRlKCk7XG4gICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdwcmV2aW91cycgJiYgIXRoaXMuc3RvcEF1dG9OYXZpZ2F0aW9uKSB7XG4gICAgICAgIHRoaXMucHJldlNsaWRlKCk7XG4gICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdqdW1wJyAmJiAhdGhpcy5zdG9wQXV0b05hdmlnYXRpb24pIHtcbiAgICAgICAgdGhpcy5nb1RvU2xpZGUodGhpcy5qdW1wU2xpZGVJbmRleCk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMubXlDYXJvdXNlbC5pc0xhc3QodGhpcy5teUNhcm91c2VsLmdldEN1cnJlbnRTbGlkZUluZGV4KCkpKSB7XG4gICAgICAgIHRoaXMuZW5kUGFnZVJlYWNoZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLmVtaXRTZWN0aW9uRW5kKCk7XG4gICAgICB9XG4gICAgfSwgNDAwMCk7XG4gIH1cblxuICBnb1RvU2xpZGUoaW5kZXgpIHtcbiAgICB0aGlzLnZpZXdlclNlcnZpY2UucmFpc2VIZWFydEJlYXRFdmVudChldmVudE5hbWUuZ29Ub1F1ZXN0aW9uLCBUZWxlbWV0cnlUeXBlLmludGVyYWN0LCB0aGlzLm15Q2Fyb3VzZWwuZ2V0Q3VycmVudFNsaWRlSW5kZXgoKSk7XG4gICAgdGhpcy5kaXNhYmxlTmV4dCA9IGZhbHNlO1xuICAgIHRoaXMuY3VycmVudFNsaWRlSW5kZXggPSBpbmRleDtcbiAgICB0aGlzLnNob3dSb290SW5zdHJ1Y3Rpb24gPSBmYWxzZTtcbiAgICBpZiAoaW5kZXggPT09IDApIHtcbiAgICAgIHRoaXMub3B0aW9uU2VsZWN0ZWRPYmogPSB1bmRlZmluZWQ7XG4gICAgICB0aGlzLm15Q2Fyb3VzZWwuc2VsZWN0U2xpZGUoMCk7XG4gICAgICB0aGlzLmFjdGl2ZSA9IHRoaXMuY3VycmVudFNsaWRlSW5kZXggPT09IDAgJiYgdGhpcy5zZWN0aW9uSW5kZXggPT09IDAgJiYgdGhpcy5zaG93U3RhcnRQYWdlO1xuICAgICAgdGhpcy5zaG93Um9vdEluc3RydWN0aW9uID0gdHJ1ZTtcbiAgICAgIGlmICghdGhpcy5zZWN0aW9uQ29uZmlnLm1ldGFkYXRhPy5jaGlsZHJlbj8ubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuZGlzYWJsZU5leHQgPSB0cnVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmN1cnJlbnRRdWVzdGlvbnNNZWRpYSA9IF8uZ2V0KHRoaXMucXVlc3Rpb25zW3RoaXMuY3VycmVudFNsaWRlSW5kZXggLSAxXSwgJ21lZGlhJyk7XG4gICAgdGhpcy5zZXRTa2lwcGVkQ2xhc3ModGhpcy5jdXJyZW50U2xpZGVJbmRleCAtIDEpO1xuICAgIGlmICghdGhpcy5pbml0aWFsaXplVGltZXIpIHtcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZVRpbWVyID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKHRoaXMucXVlc3Rpb25zW2luZGV4IC0gMV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5zaG93UXVlc3Rpb25zID0gZmFsc2U7XG4gICAgICB0aGlzLnZpZXdlclNlcnZpY2UuZ2V0UXVlc3Rpb25zKDAsIGluZGV4KTtcbiAgICAgIHRoaXMuY3VycmVudFNsaWRlSW5kZXggPSBpbmRleDtcbiAgICB9IGVsc2UgaWYgKHRoaXMucXVlc3Rpb25zW2luZGV4IC0gMV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5teUNhcm91c2VsLnNlbGVjdFNsaWRlKGluZGV4KTtcbiAgICB9XG4gICAgdGhpcy5zZXRJbWFnZVpvb20oKTtcbiAgICB0aGlzLmN1cnJlbnRTb2x1dGlvbnMgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5oaWdobGlnaHRRdWVzdGlvbigpO1xuICB9XG5cbiAgZ29Ub1F1ZXN0aW9uKGV2ZW50KSB7XG4gICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcbiAgICB0aGlzLnNob3dSb290SW5zdHJ1Y3Rpb24gPSBmYWxzZTtcbiAgICB0aGlzLmRpc2FibGVOZXh0ID0gZmFsc2U7XG4gICAgdGhpcy5pbml0aWFsaXplVGltZXIgPSB0cnVlO1xuICAgIGNvbnN0IGluZGV4ID0gZXZlbnQucXVlc3Rpb25ObztcbiAgICB0aGlzLnZpZXdlclNlcnZpY2UuZ2V0UXVlc3Rpb25zKDAsIGluZGV4KTtcbiAgICB0aGlzLmN1cnJlbnRTbGlkZUluZGV4ID0gaW5kZXg7XG4gICAgdGhpcy5teUNhcm91c2VsLnNlbGVjdFNsaWRlKGluZGV4KTtcbiAgICB0aGlzLmhpZ2hsaWdodFF1ZXN0aW9uKCk7XG4gIH1cblxuICBoaWdobGlnaHRRdWVzdGlvbigpIHtcbiAgICBjb25zdCBjdXJyZW50UXVlc3Rpb24gPSB0aGlzLnF1ZXN0aW9uc1t0aGlzLmN1cnJlbnRTbGlkZUluZGV4IC0gMV07XG4gICAgY29uc3QgcXVlc3Rpb25UeXBlID0gY3VycmVudFF1ZXN0aW9uPy5xVHlwZT8udG9VcHBlckNhc2UoKTtcbiAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoY3VycmVudFF1ZXN0aW9uPy5pZGVudGlmaWVyKSBhcyBIVE1MRWxlbWVudDtcbiAgICBpZiAoZWxlbWVudCAmJiBxdWVzdGlvblR5cGUpIHtcbiAgICAgIGxldCBxdWVzdGlvblRpdGxlRWxlbWVudDtcblxuICAgICAgc3dpdGNoIChxdWVzdGlvblR5cGUpIHtcbiAgICAgICAgY2FzZSAnTUNRJzpcbiAgICAgICAgICBxdWVzdGlvblRpdGxlRWxlbWVudCA9IGVsZW1lbnQucXVlcnlTZWxlY3RvcignLm1jcS10aXRsZScpIGFzIEhUTUxFbGVtZW50O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHF1ZXN0aW9uVGl0bGVFbGVtZW50ID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcucXVlc3Rpb24tY29udGFpbmVyJykgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChxdWVzdGlvblRpdGxlRWxlbWVudCkge1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICBxdWVzdGlvblRpdGxlRWxlbWVudC5mb2N1cygpO1xuICAgICAgICB9LCAwKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBnZXRTb2x1dGlvbnMoKSB7XG4gICAgdGhpcy5zaG93QWxlcnQgPSBmYWxzZTtcbiAgICB0aGlzLnZpZXdlclNlcnZpY2UucmFpc2VIZWFydEJlYXRFdmVudChldmVudE5hbWUuc2hvd0Fuc3dlciwgVGVsZW1ldHJ5VHlwZS5pbnRlcmFjdCwgdGhpcy5teUNhcm91c2VsLmdldEN1cnJlbnRTbGlkZUluZGV4KCkpO1xuICAgIHRoaXMudmlld2VyU2VydmljZS5yYWlzZUhlYXJ0QmVhdEV2ZW50KGV2ZW50TmFtZS5zaG93QW5zd2VyLCBUZWxlbWV0cnlUeXBlLmltcHJlc3Npb24sIHRoaXMubXlDYXJvdXNlbC5nZXRDdXJyZW50U2xpZGVJbmRleCgpKTtcbiAgICBjb25zdCBjdXJyZW50SW5kZXggPSB0aGlzLm15Q2Fyb3VzZWwuZ2V0Q3VycmVudFNsaWRlSW5kZXgoKSAtIDE7XG4gICAgdGhpcy5jdXJyZW50UXVlc3Rpb24gPSB0aGlzLnF1ZXN0aW9uc1tjdXJyZW50SW5kZXhdLmJvZHk7XG4gICAgdGhpcy5jdXJyZW50T3B0aW9ucyA9IHRoaXMucXVlc3Rpb25zW2N1cnJlbnRJbmRleF0uaW50ZXJhY3Rpb25zLnJlc3BvbnNlMS5vcHRpb25zO1xuICAgIHRoaXMuY3VycmVudFF1ZXN0aW9uc01lZGlhID0gXy5nZXQodGhpcy5xdWVzdGlvbnNbY3VycmVudEluZGV4XSwgJ21lZGlhJyk7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLnNldEltYWdlWm9vbSgpO1xuICAgIH0pO1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5zZXRJbWFnZUhlaWdodFdpZHRoQ2xhc3MoKTtcbiAgICB9LCAxMDApO1xuICAgIGlmICh0aGlzLmN1cnJlbnRTb2x1dGlvbnMpIHtcbiAgICAgIHRoaXMuc2hvd1NvbHV0aW9uID0gdHJ1ZTtcbiAgICB9XG4gICAgdGhpcy5jbGVhclRpbWVJbnRlcnZhbCgpO1xuICB9XG5cbiAgdmlld1NvbHV0aW9uKCkge1xuICAgIHRoaXMudmlld2VyU2VydmljZS5yYWlzZUhlYXJ0QmVhdEV2ZW50KGV2ZW50TmFtZS52aWV3U29sdXRpb25DbGlja2VkLCBUZWxlbWV0cnlUeXBlLmludGVyYWN0LCB0aGlzLm15Q2Fyb3VzZWwuZ2V0Q3VycmVudFNsaWRlSW5kZXgoKSk7XG4gICAgdGhpcy5zaG93U29sdXRpb24gPSB0cnVlO1xuICAgIHRoaXMuc2hvd0FsZXJ0ID0gZmFsc2U7XG4gICAgdGhpcy5jdXJyZW50UXVlc3Rpb25zTWVkaWEgPSBfLmdldCh0aGlzLnF1ZXN0aW9uc1t0aGlzLm15Q2Fyb3VzZWwuZ2V0Q3VycmVudFNsaWRlSW5kZXgoKSAtIDFdLCAnbWVkaWEnKTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuc2V0SW1hZ2Vab29tKCk7XG4gICAgICB0aGlzLnNldEltYWdlSGVpZ2h0V2lkdGhDbGFzcygpO1xuICAgIH0pO1xuICAgIGNsZWFyVGltZW91dCh0aGlzLmludGVydmFsUmVmKTtcbiAgfVxuXG4gIGNsb3NlU29sdXRpb24oKSB7XG4gICAgdGhpcy5zZXRJbWFnZVpvb20oKTtcbiAgICB0aGlzLnZpZXdlclNlcnZpY2UucmFpc2VIZWFydEJlYXRFdmVudChldmVudE5hbWUuc29sdXRpb25DbG9zZWQsIFRlbGVtZXRyeVR5cGUuaW50ZXJhY3QsIHRoaXMubXlDYXJvdXNlbC5nZXRDdXJyZW50U2xpZGVJbmRleCgpKTtcbiAgICB0aGlzLnNob3dTb2x1dGlvbiA9IGZhbHNlO1xuICAgIHRoaXMubXlDYXJvdXNlbC5zZWxlY3RTbGlkZSh0aGlzLmN1cnJlbnRTbGlkZUluZGV4KTtcbiAgICB0aGlzLmZvY3VzT25OZXh0QnV0dG9uKCk7XG4gIH1cblxuICB2aWV3SGludCgpIHtcbiAgICB0aGlzLnZpZXdlclNlcnZpY2UucmFpc2VIZWFydEJlYXRFdmVudChldmVudE5hbWUudmlld0hpbnQsIFRlbGVtZXRyeVR5cGUuaW50ZXJhY3QsIHRoaXMubXlDYXJvdXNlbC5nZXRDdXJyZW50U2xpZGVJbmRleCgpKTtcbiAgfVxuXG4gIHNob3dBbnN3ZXJDbGlja2VkKGV2ZW50LCBxdWVzdGlvbj8pIHtcbiAgICBpZiAoZXZlbnQ/LnNob3dBbnN3ZXIpIHtcbiAgICAgIHRoaXMuZm9jdXNPbk5leHRCdXR0b24oKTtcbiAgICAgIHRoaXMuYWN0aXZlID0gdHJ1ZTtcbiAgICAgIHRoaXMucHJvZ3Jlc3NCYXJDbGFzc1t0aGlzLm15Q2Fyb3VzZWwuZ2V0Q3VycmVudFNsaWRlSW5kZXgoKSAtIDFdLmNsYXNzID0gJ2NvcnJlY3QnO1xuICAgICAgaWYgKHF1ZXN0aW9uKSB7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5xdWVzdGlvbnMuZmluZEluZGV4KHF1ZSA9PiBxdWUuaWRlbnRpZmllciA9PT0gcXVlc3Rpb24uaWRlbnRpZmllcik7XG4gICAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgdGhpcy5xdWVzdGlvbnNbaW5kZXhdLmlzQW5zd2VyU2hvd24gPSB0cnVlO1xuICAgICAgICAgIHRoaXMudmlld2VyU2VydmljZS51cGRhdGVTZWN0aW9uUXVlc3Rpb25zKHRoaXMuc2VjdGlvbkNvbmZpZy5tZXRhZGF0YS5pZGVudGlmaWVyLCB0aGlzLnF1ZXN0aW9ucyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMudmlld2VyU2VydmljZS5yYWlzZUhlYXJ0QmVhdEV2ZW50KGV2ZW50TmFtZS5zaG93QW5zd2VyLCBUZWxlbWV0cnlUeXBlLmludGVyYWN0LCBwYWdlSWQuc2hvcnRBbnN3ZXIpO1xuICAgICAgdGhpcy52aWV3ZXJTZXJ2aWNlLnJhaXNlSGVhcnRCZWF0RXZlbnQoZXZlbnROYW1lLnBhZ2VTY3JvbGxlZCwgVGVsZW1ldHJ5VHlwZS5pbXByZXNzaW9uLCB0aGlzLm15Q2Fyb3VzZWwuZ2V0Q3VycmVudFNsaWRlSW5kZXgoKSAtIDEpO1xuICAgIH1cbiAgfVxuXG4gIGdldFNjb3JlKGN1cnJlbnRJbmRleCwga2V5LCBpc0NvcnJlY3RBbnN3ZXIsIHNlbGVjdGVkT3B0aW9uPykge1xuICAgIGlmIChpc0NvcnJlY3RBbnN3ZXIpIHtcbiAgICAgIHJldHVybiB0aGlzLnF1ZXN0aW9uc1tjdXJyZW50SW5kZXhdLnJlc3BvbnNlRGVjbGFyYXRpb25ba2V5XS5jb3JyZWN0UmVzcG9uc2Uub3V0Y29tZXMuU0NPUkUgP1xuICAgICAgICB0aGlzLnF1ZXN0aW9uc1tjdXJyZW50SW5kZXhdLnJlc3BvbnNlRGVjbGFyYXRpb25ba2V5XS5jb3JyZWN0UmVzcG9uc2Uub3V0Y29tZXMuU0NPUkUgOlxuICAgICAgICB0aGlzLnF1ZXN0aW9uc1tjdXJyZW50SW5kZXhdLnJlc3BvbnNlRGVjbGFyYXRpb25ba2V5XS5tYXhTY29yZSB8fCAxO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBzZWxlY3RlZE9wdGlvblZhbHVlID0gc2VsZWN0ZWRPcHRpb24ub3B0aW9uLnZhbHVlO1xuICAgICAgY29uc3QgbWFwcGluZyA9IHRoaXMucXVlc3Rpb25zW2N1cnJlbnRJbmRleF0ucmVzcG9uc2VEZWNsYXJhdGlvbi5tYXBwaW5nO1xuICAgICAgbGV0IHNjb3JlID0gMDtcblxuICAgICAgaWYgKG1hcHBpbmcpIHtcbiAgICAgICAgbWFwcGluZy5mb3JFYWNoKCh2YWwpID0+IHtcbiAgICAgICAgICBpZiAoc2VsZWN0ZWRPcHRpb25WYWx1ZSA9PT0gdmFsLnJlc3BvbnNlKSB7XG4gICAgICAgICAgICBzY29yZSA9IHZhbC5vdXRjb21lcy5TQ09SRSB8fCAwO1xuICAgICAgICAgICAgaWYgKHZhbC5vdXRjb21lcy5TQ09SRSkge1xuICAgICAgICAgICAgICB0aGlzLnByb2dyZXNzQmFyQ2xhc3NbY3VycmVudEluZGV4XS5jbGFzcyA9ICdwYXJ0aWFsJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHNjb3JlO1xuICAgIH1cbiAgfVxuXG4gIGNhbGN1bGF0ZVNjb3JlKCkge1xuICAgIHJldHVybiB0aGlzLnByb2dyZXNzQmFyQ2xhc3MucmVkdWNlKChhY2N1bXVsYXRvciwgZWxlbWVudCkgPT4gYWNjdW11bGF0b3IgKyBlbGVtZW50LnNjb3JlLCAwKTtcbiAgfVxuXG4gIHVwZGF0ZVNjb3JlQm9hcmQoaW5kZXgsIGNsYXNzVG9CZVVwZGF0ZWQsIG9wdGlvblZhbHVlPywgc2NvcmU/KSB7XG4gICAgdGhpcy5wcm9ncmVzc0JhckNsYXNzLmZvckVhY2goKGVsZSkgPT4ge1xuICAgICAgaWYgKGVsZS5pbmRleCAtIDEgPT09IGluZGV4KSB7XG4gICAgICAgIGVsZS5jbGFzcyA9IGNsYXNzVG9CZVVwZGF0ZWQ7XG4gICAgICAgIGVsZS5zY29yZSA9IHNjb3JlID8gc2NvcmUgOiAwO1xuXG4gICAgICAgIGlmICghdGhpcy5zaG93RmVlZEJhY2spIHtcbiAgICAgICAgICBlbGUudmFsdWUgPSBvcHRpb25WYWx1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyogRW5kIG9mIHNjb3JlIG1ldGhvZHMgICovXG5cbiAgLyogU3RhcnQgb2YgSW1hZ2Ugem9vbSByZWxhdGVkICovXG4gIHNldEltYWdlSGVpZ2h0V2lkdGhDbGFzcygpIHtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1hc3NldC12YXJpYWJsZV0nKS5mb3JFYWNoKGltYWdlID0+IHtcbiAgICAgIGltYWdlLnJlbW92ZUF0dHJpYnV0ZSgnY2xhc3MnKTtcbiAgICAgIGlmIChpbWFnZS5jbGllbnRIZWlnaHQgPiBpbWFnZS5jbGllbnRXaWR0aCkge1xuICAgICAgICBpbWFnZS5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3BvcnRyYWl0Jyk7XG4gICAgICB9IGVsc2UgaWYgKGltYWdlLmNsaWVudEhlaWdodCA8IGltYWdlLmNsaWVudFdpZHRoKSB7XG4gICAgICAgIGltYWdlLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnbGFuZHNjYXBlJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbWFnZS5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ25ldXRyYWwnKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHNldEltYWdlWm9vbSgpIHtcbiAgICBjb25zdCBpbmRleCA9IHRoaXMubXlDYXJvdXNlbC5nZXRDdXJyZW50U2xpZGVJbmRleCgpIC0gMTtcbiAgICBjb25zdCBjdXJyZW50UXVlc3Rpb25JZCA9IHRoaXMucXVlc3Rpb25zW2luZGV4XT8uaWRlbnRpZmllcjtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1hc3NldC12YXJpYWJsZV0nKS5mb3JFYWNoKGltYWdlID0+IHtcbiAgICAgIGNvbnN0IGltYWdlSWQgPSBpbWFnZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtYXNzZXQtdmFyaWFibGUnKTtcbiAgICAgIGltYWdlLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnb3B0aW9uLWltYWdlJyk7XG4gICAgICBpbWFnZS5zZXRBdHRyaWJ1dGUoJ2lkJywgaW1hZ2VJZCk7XG4gICAgICBfLmZvckVhY2godGhpcy5jdXJyZW50UXVlc3Rpb25zTWVkaWEsICh2YWwpID0+IHtcbiAgICAgICAgaWYgKGltYWdlSWQgPT09IHZhbC5pZCkge1xuICAgICAgICAgIGlmICh0aGlzLnNlY3Rpb25Db25maWcubWV0YWRhdGEuaXNBdmFpbGFibGVMb2NhbGx5ICYmIHRoaXMucGFyZW50Q29uZmlnLmJhc2VVcmwpIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVlc3Rpb25JZCkge1xuICAgICAgICAgICAgICBpbWFnZVsnc3JjJ10gPSBgJHt0aGlzLnBhcmVudENvbmZpZy5iYXNlVXJsfS8ke2N1cnJlbnRRdWVzdGlvbklkfS8ke3ZhbC5zcmN9YDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKHZhbC5iYXNlVXJsKSB7XG4gICAgICAgICAgICBpbWFnZVsnc3JjJ10gPSB2YWwuYmFzZVVybCArIHZhbC5zcmM7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGRpdkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGRpdkVsZW1lbnQuc2V0QXR0cmlidXRlKCdjbGFzcycsICdtYWduaWZ5LWljb24nKTtcbiAgICAgIGRpdkVsZW1lbnQub25jbGljayA9IChldmVudCkgPT4ge1xuICAgICAgICB0aGlzLnZpZXdlclNlcnZpY2UucmFpc2VIZWFydEJlYXRFdmVudChldmVudE5hbWUuem9vbUNsaWNrZWQsIFRlbGVtZXRyeVR5cGUuaW50ZXJhY3QsIHRoaXMubXlDYXJvdXNlbC5nZXRDdXJyZW50U2xpZGVJbmRleCgpKTtcbiAgICAgICAgdGhpcy56b29tSW1nU3JjID0gaW1hZ2VbJ3NyYyddO1xuICAgICAgICB0aGlzLnNob3dab29tTW9kYWwgPSB0cnVlO1xuICAgICAgICBjb25zdCB6b29tSW1hZ2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW1hZ2VNb2RhbCcpO1xuICAgICAgICBpZiAoem9vbUltYWdlLmNsaWVudEhlaWdodCA+IGltYWdlLmNsaWVudFdpZHRoKSB7XG4gICAgICAgICAgem9vbUltYWdlLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAncG9ydHJhaXQnKTtcbiAgICAgICAgfSBlbHNlIGlmIChpbWFnZS5jbGllbnRIZWlnaHQgPCBpbWFnZS5jbGllbnRXaWR0aCkge1xuICAgICAgICAgIHpvb21JbWFnZS5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ2xhbmRzY2FwZScpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHpvb21JbWFnZS5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ25ldXRyYWwnKTtcbiAgICAgICAgfVxuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIH07XG4gICAgICBpbWFnZS5wYXJlbnROb2RlLmluc2VydEJlZm9yZShkaXZFbGVtZW50LCBpbWFnZS5uZXh0U2libGluZyk7XG4gICAgfSk7XG4gIH1cblxuICAvLyBNZXRob2QgTmFtZSBjaGFuZ2VkXG4gIHpvb21JbigpIHtcbiAgICB0aGlzLnZpZXdlclNlcnZpY2UucmFpc2VIZWFydEJlYXRFdmVudChldmVudE5hbWUuem9vbUluQ2xpY2tlZCwgVGVsZW1ldHJ5VHlwZS5pbnRlcmFjdCwgdGhpcy5teUNhcm91c2VsLmdldEN1cnJlbnRTbGlkZUluZGV4KCkpO1xuICAgIHRoaXMuaW1hZ2Vab29tQ291bnQgPSB0aGlzLmltYWdlWm9vbUNvdW50ICsgMTA7XG4gICAgdGhpcy5zZXRJbWFnZU1vZGFsSGVpZ2h0V2lkdGgoKTtcbiAgfVxuXG4gIC8vIE1ldGhvZCBOYW1lIGNoYW5nZWRcbiAgem9vbU91dCgpIHtcbiAgICB0aGlzLnZpZXdlclNlcnZpY2UucmFpc2VIZWFydEJlYXRFdmVudChldmVudE5hbWUuem9vbU91dENsaWNrZWQsIFRlbGVtZXRyeVR5cGUuaW50ZXJhY3QsIHRoaXMubXlDYXJvdXNlbC5nZXRDdXJyZW50U2xpZGVJbmRleCgpKTtcbiAgICBpZiAodGhpcy5pbWFnZVpvb21Db3VudCA+IDEwMCkge1xuICAgICAgdGhpcy5pbWFnZVpvb21Db3VudCA9IHRoaXMuaW1hZ2Vab29tQ291bnQgLSAxMDtcbiAgICAgIHRoaXMuc2V0SW1hZ2VNb2RhbEhlaWdodFdpZHRoKCk7XG4gICAgfVxuICB9XG5cbiAgc2V0SW1hZ2VNb2RhbEhlaWdodFdpZHRoKCkge1xuICAgIHRoaXMuaW1hZ2VNb2RhbC5uYXRpdmVFbGVtZW50LnN0eWxlLndpZHRoID0gYCR7dGhpcy5pbWFnZVpvb21Db3VudH0lYDtcbiAgICB0aGlzLmltYWdlTW9kYWwubmF0aXZlRWxlbWVudC5zdHlsZS5oZWlnaHQgPSBgJHt0aGlzLmltYWdlWm9vbUNvdW50fSVgO1xuICB9XG5cbiAgY2xvc2Vab29tKCkge1xuICAgIHRoaXMudmlld2VyU2VydmljZS5yYWlzZUhlYXJ0QmVhdEV2ZW50KGV2ZW50TmFtZS56b29tQ2xvc2VDbGlja2VkLCBUZWxlbWV0cnlUeXBlLmludGVyYWN0LCB0aGlzLm15Q2Fyb3VzZWwuZ2V0Q3VycmVudFNsaWRlSW5kZXgoKSk7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ltYWdlTW9kYWwnKS5yZW1vdmVBdHRyaWJ1dGUoJ3N0eWxlJyk7XG4gICAgdGhpcy5zaG93Wm9vbU1vZGFsID0gZmFsc2U7XG4gIH1cbiAgLyogRW5kIG9mIEltYWdlIHpvb20gcmVsYXRlZCAqL1xuXG4gIGNsZWFyVGltZUludGVydmFsKCkge1xuICAgIGlmICh0aGlzLmludGVydmFsUmVmKSB7XG4gICAgICBjbGVhckludGVydmFsKHRoaXMuaW50ZXJ2YWxSZWYpO1xuICAgIH1cbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ3dpbmRvdzpiZWZvcmV1bmxvYWQnKVxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLmRlc3Ryb3kkLm5leHQodHJ1ZSk7XG4gICAgdGhpcy5kZXN0cm95JC51bnN1YnNjcmliZSgpO1xuICAgIHRoaXMuZXJyb3JTZXJ2aWNlLmdldEludGVybmV0Q29ubmVjdGl2aXR5RXJyb3IudW5zdWJzY3JpYmUoKTtcbiAgICBpZiAodGhpcy5zdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICB9XG59XG4iXX0=