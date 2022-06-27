import { Injectable, ɵɵdefineInjectable, EventEmitter, ɵɵinject, Component, SecurityContext, Input, Output, HostListener, ViewChild, Pipe, ChangeDetectorRef, NgModule } from '@angular/core';
import { CsTelemetryModule } from '@project-sunbird/client-services/telemetry';
import { isEqual, cloneDeep, isEmpty, chunk, forEach, map, shuffle, flattenDeep, groupBy, get, last, xorBy, uniqBy } from 'lodash-es';
import { CommonModule } from '@angular/common';
import { __awaiter } from 'tslib';
import { DomSanitizer } from '@angular/platform-browser';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { fromEvent, forkJoin, Subject } from 'rxjs';
import { errorCode, errorMessage, ErrorService, SunbirdPlayerSdkModule } from '@project-sunbird/sunbird-player-sdk-v9';
import { takeUntil } from 'rxjs/operators';
import maintain from 'ally.js/esm/maintain/_maintain';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

/**
 * @fileoverview added by tsickle
 * Generated from: lib/util-service.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class UtilService {
    constructor() {
    }
    /**
     * @param {?=} length
     * @return {?}
     */
    uniqueId(length = 32) {
        /** @type {?} */
        let result = '';
        /** @type {?} */
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        /** @type {?} */
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    /**
     * @param {?} pdfPlayerStartTime
     * @return {?}
     */
    getTimeSpentText(pdfPlayerStartTime) {
        /** @type {?} */
        const duration = new Date().getTime() - pdfPlayerStartTime;
        /** @type {?} */
        const minutes = Math.floor(duration / 60000);
        /** @type {?} */
        const seconds = Number(((duration % 60000) / 1000).toFixed(0));
        return (minutes + ':' + (seconds < 10 ? '0' : '') + seconds);
    }
    /**
     * @param {?} keys
     * @return {?}
     */
    getKeyValue(keys) {
        /** @type {?} */
        let key = keys.find((/**
         * @param {?} k
         * @return {?}
         */
        (k) => {
            return k.includes('response');
        }));
        return key;
    }
    /**
     * @param {?} options
     * @param {?} responseDeclaration
     * @return {?}
     */
    getMultiselectScore(options, responseDeclaration) {
        /** @type {?} */
        let key = this.getKeyValue(Object.keys(responseDeclaration));
        /** @type {?} */
        const selectedOptionValue = options.map((/**
         * @param {?} option
         * @return {?}
         */
        option => option.value));
        /** @type {?} */
        let score = responseDeclaration[key].correctResponse.outcomes.score ? responseDeclaration[key].correctResponse.outcomes.score : responseDeclaration.maxScore;
        /** @type {?} */
        let correctValues = responseDeclaration[key].correctResponse.value;
        /** @type {?} */
        let mapping = responseDeclaration[key]['mapping'];
        if (isEqual(correctValues, selectedOptionValue)) {
            return score;
        }
        else if (!isEqual(correctValues, selectedOptionValue)) {
            return selectedOptionValue.reduce((/**
             * @param {?} sum
             * @param {?} index
             * @return {?}
             */
            (sum, index) => { sum += (mapping[index] ? mapping[index].outcomes.score : 0); return sum; }), 0);
        }
    }
    /**
     * @param {?} selectedOptions
     * @param {?} option
     * @return {?}
     */
    hasDuplicates(selectedOptions, option) {
        /** @type {?} */
        let duplicate = selectedOptions.find((/**
         * @param {?} o
         * @return {?}
         */
        (o) => { return o.value === option.value; }));
        return duplicate;
    }
    /**
     * @param {?} questions
     * @param {?} currentIndex
     * @return {?}
     */
    getQuestionType(questions, currentIndex) {
        /** @type {?} */
        let index = currentIndex - 1 === -1 ? 0 : currentIndex - 1;
        return questions[index]['qType'];
    }
    /**
     * @param {?} progressBarClass
     * @return {?}
     */
    canGo(progressBarClass) {
        /** @type {?} */
        let attemptedParams = ['correct', 'wrong', 'attempted'];
        return attemptedParams.includes(progressBarClass);
    }
    /**
     * @param {...?} objects
     * @return {?}
     */
    sumObjectsByKey(...objects) {
        return objects.reduce((/**
         * @param {?} accumulator
         * @param {?} currentValue
         * @return {?}
         */
        (accumulator, currentValue) => {
            for (const key in currentValue) {
                if (currentValue.hasOwnProperty(key)) {
                    accumulator[key] = (accumulator[key] || 0) + currentValue[key];
                }
            }
            return accumulator;
        }), {});
    }
}
UtilService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
/** @nocollapse */
UtilService.ctorParameters = () => [];
/** @nocollapse */ UtilService.ɵprov = ɵɵdefineInjectable({ factory: function UtilService_Factory() { return new UtilService(); }, token: UtilService, providedIn: "root" });

/**
 * @fileoverview added by tsickle
 * Generated from: lib/quml-library.service.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class QumlLibraryService {
    /**
     * @param {?} utilService
     */
    constructor(utilService) {
        this.utilService = utilService;
        this.isSectionsAvailable = false;
        this.telemetryEvent = new EventEmitter();
    }
    /**
     * @param {?} config
     * @param {?} parentConfig
     * @return {?}
     */
    initializeTelemetry(config, parentConfig) {
        var _a;
        this.duration = new Date().getTime();
        this.context = config.context;
        this.contentSessionId = this.utilService.uniqueId();
        this.playSessionId = this.utilService.uniqueId();
        this.channel = this.context.channel || '';
        this.pdata = this.context.pdata;
        this.sid = this.context.sid;
        this.uid = this.context.uid;
        this.rollup = this.context.contextRollup;
        this.config = config;
        this.isSectionsAvailable = (_a = parentConfig) === null || _a === void 0 ? void 0 : _a.isSectionsAvailable;
        if (!CsTelemetryModule.instance.isInitialised) {
            /** @type {?} */
            const telemetryConfig = {
                pdata: this.context.pdata,
                env: 'contentplayer',
                channel: this.context.channel,
                did: this.context.did,
                authtoken: this.context.authToken || '',
                uid: this.context.uid || '',
                sid: this.context.sid,
                batchsize: 20,
                mode: this.context.mode,
                host: this.context.host || '',
                endpoint: this.context.endpoint || '/data/v3/telemetry',
                tags: this.context.tags,
                cdata: (this.context.cdata || []).concat([
                    { id: this.contentSessionId, type: 'ContentSession' },
                    { id: this.playSessionId, type: 'PlaySession' },
                    { id: '2.0', type: 'PlayerVersion' }
                ])
            };
            CsTelemetryModule.instance.init({});
            CsTelemetryModule.instance.telemetryService.initTelemetry({
                config: telemetryConfig,
                userOrgDetails: {}
            });
        }
        this.telemetryObject = {
            id: parentConfig.identifier,
            type: 'Content',
            ver: config.metadata.pkgVersion ? config.metadata.pkgVersion.toString() : '',
            rollup: this.context.objectRollup || {}
        };
    }
    /**
     * @param {?} assesEvent
     * @return {?}
     */
    startAssesEvent(assesEvent) {
        CsTelemetryModule.instance.telemetryService.raiseAssesTelemetry(assesEvent, this.getEventOptions());
    }
    /**
     * @param {?} duration
     * @return {?}
     */
    start(duration) {
        CsTelemetryModule.instance.telemetryService.raiseStartTelemetry({
            options: this.getEventOptions(),
            edata: { type: 'content', mode: 'play', pageid: '', duration: Number((duration / 1e3).toFixed(2)) }
        });
    }
    /**
     * @param {?} identifier
     * @param {?} version
     * @param {?} type
     * @param {?} option
     * @return {?}
     */
    response(identifier, version, type, option) {
        /** @type {?} */
        const responseEvent = {
            target: {
                id: identifier,
                ver: version,
                type: type
            },
            type: 'CHOOSE',
            values: [{
                    option
                }]
        };
        CsTelemetryModule.instance.telemetryService.raiseResponseTelemetry(responseEvent, this.getEventOptions());
    }
    /**
     * @param {?} eData
     * @return {?}
     */
    summary(eData) {
        CsTelemetryModule.instance.telemetryService.raiseSummaryTelemetry(eData, this.getEventOptions());
    }
    /**
     * @param {?} duration
     * @param {?} currentQuestionIndex
     * @param {?} totalNoofQuestions
     * @param {?} visitedQuestions
     * @param {?} endpageseen
     * @param {?} score
     * @return {?}
     */
    end(duration, currentQuestionIndex, totalNoofQuestions, visitedQuestions, endpageseen, score) {
        /** @type {?} */
        const durationSec = Number((duration / 1e3).toFixed(2));
        CsTelemetryModule.instance.telemetryService.raiseEndTelemetry({
            edata: {
                type: 'content',
                mode: 'play',
                pageid: 'sunbird-player-Endpage',
                summary: [
                    {
                        progress: Number(((currentQuestionIndex / totalNoofQuestions) * 100).toFixed(0))
                    },
                    {
                        totalNoofQuestions: totalNoofQuestions
                    },
                    {
                        visitedQuestions: visitedQuestions,
                    },
                    {
                        endpageseen
                    },
                    {
                        score
                    },
                ],
                duration: durationSec
            },
            options: this.getEventOptions()
        });
    }
    /**
     * @param {?} id
     * @param {?} currentPage
     * @param {?=} currentQuestionDetails
     * @return {?}
     */
    interact(id, currentPage, currentQuestionDetails) {
        CsTelemetryModule.instance.telemetryService.raiseInteractTelemetry({
            options: this.getEventOptions(),
            edata: { type: 'TOUCH', subtype: '', id, pageid: currentPage + '' }
        });
    }
    /**
     * @param {?} data
     * @return {?}
     */
    heartBeat(data) {
        CsTelemetryModule.instance.playerTelemetryService.onHeartBeatEvent(data, {});
    }
    /**
     * @param {?} currentPage
     * @return {?}
     */
    impression(currentPage) {
        CsTelemetryModule.instance.telemetryService.raiseImpressionTelemetry({
            options: this.getEventOptions(),
            edata: { type: 'workflow', subtype: '', pageid: currentPage + '', uri: '' }
        });
    }
    /**
     * @param {?} error
     * @param {?=} edata
     * @return {?}
     */
    error(error, edata) {
        CsTelemetryModule.instance.telemetryService.raiseErrorTelemetry({
            options: this.getEventOptions(),
            edata: {
                err: 'LOAD',
                errtype: 'content',
                stacktrace: (error && error.toString()) || ''
            }
        });
    }
    /**
     * @return {?}
     */
    getEventOptions() {
        /** @type {?} */
        const options = {
            object: this.telemetryObject,
            context: {
                channel: this.channel || '',
                pdata: this.pdata,
                env: 'contentplayer',
                sid: this.sid,
                uid: this.uid,
                cdata: (this.context.cdata || []).concat([{ id: this.contentSessionId, type: 'ContentSession' },
                    { id: this.playSessionId, type: 'PlaySession' },
                    { id: '2.0', type: 'PlayerVersion' }]),
                rollup: this.rollup || {}
            }
        };
        if (this.isSectionsAvailable) {
            options.context.cdata.push({ id: this.config.metadata.identifier, type: 'SectionId' });
        }
        return options;
    }
}
QumlLibraryService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
/** @nocollapse */
QumlLibraryService.ctorParameters = () => [
    { type: UtilService }
];
/** @nocollapse */ QumlLibraryService.ɵprov = ɵɵdefineInjectable({ factory: function QumlLibraryService_Factory() { return new QumlLibraryService(ɵɵinject(UtilService)); }, token: QumlLibraryService, providedIn: "root" });
if (false) {
    /** @type {?} */
    QumlLibraryService.prototype.duration;
    /** @type {?} */
    QumlLibraryService.prototype.channel;
    /** @type {?} */
    QumlLibraryService.prototype.config;
    /** @type {?} */
    QumlLibraryService.prototype.isSectionsAvailable;
    /** @type {?} */
    QumlLibraryService.prototype.telemetryEvent;
    /**
     * @type {?}
     * @private
     */
    QumlLibraryService.prototype.context;
    /**
     * @type {?}
     * @private
     */
    QumlLibraryService.prototype.telemetryObject;
    /**
     * @type {?}
     * @private
     */
    QumlLibraryService.prototype.contentSessionId;
    /**
     * @type {?}
     * @private
     */
    QumlLibraryService.prototype.playSessionId;
    /**
     * @type {?}
     * @private
     */
    QumlLibraryService.prototype.pdata;
    /**
     * @type {?}
     * @private
     */
    QumlLibraryService.prototype.sid;
    /**
     * @type {?}
     * @private
     */
    QumlLibraryService.prototype.uid;
    /**
     * @type {?}
     * @private
     */
    QumlLibraryService.prototype.rollup;
    /** @type {?} */
    QumlLibraryService.prototype.utilService;
}

/**
 * @fileoverview added by tsickle
 * Generated from: lib/quml-library.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class QumlLibraryComponent {
    constructor() {
    }
    /**
     * @return {?}
     */
    ngOnInit() {
    }
}
QumlLibraryComponent.decorators = [
    { type: Component, args: [{
                selector: 'lib-quml-library',
                template: `
    <p>
      quml-library works!
    </p>
  `
            }] }
];
/** @nocollapse */
QumlLibraryComponent.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * Generated from: lib/mcq/mcq.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class McqComponent {
    /**
     * @param {?} domSanitizer
     * @param {?} utilService
     */
    constructor(domSanitizer, utilService) {
        this.domSanitizer = domSanitizer;
        this.utilService = utilService;
        this.componentLoaded = new EventEmitter();
        this.answerChanged = new EventEmitter();
        this.optionSelected = new EventEmitter();
        this.mcqOptions = [];
        this.showQumlPopup = false;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.question.solutions) {
                this.solutions = this.question.solutions;
            }
            /** @type {?} */
            let key = this.utilService.getKeyValue(Object.keys(this.question.responseDeclaration));
            this.cardinality = this.question.responseDeclaration[key]['cardinality'];
            if (this.question.templateId === "mcq-vertical") {
                this.layout = 'DEFAULT';
            }
            else if (this.question.templateId === "mcq-horizontal") {
                this.layout = 'IMAGEGRID';
            }
            else if (this.question.templateId === "mcq-vertical-split") {
                this.layout = 'IMAGEQAGRID';
            }
            else if (this.question.templateId === "mcq-grid-split") {
                this.layout = 'MULTIIMAGEGRID';
            }
            this.renderLatex();
            this.mcqQuestion = this.domSanitizer.sanitize(SecurityContext.HTML, this.domSanitizer.bypassSecurityTrustHtml(this.question.body));
            this.options = this.question.interactions[key].options;
            this.initOptions();
        });
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        /** @type {?} */
        const el = document.getElementsByClassName('mcq-options');
        if (el != null && el.length > 0) {
            el[0].remove();
        }
    }
    /**
     * @return {?}
     */
    initOptions() {
        for (let j = 0; j < this.options.length; j++) {
            /** @type {?} */
            let imageUrl;
            if (this.options[j].url) {
                imageUrl = this.options[j].url;
            }
            /** @type {?} */
            const option = this.options[j];
            /** @type {?} */
            const optionValue = option.value.body;
            /** @type {?} */
            const optionHtml = this.domSanitizer.sanitize(SecurityContext.HTML, this.domSanitizer.bypassSecurityTrustHtml(optionValue));
            /** @type {?} */
            const selected = false;
            /** @type {?} */
            const optionToBePushed = {};
            optionToBePushed.index = j;
            optionToBePushed.optionHtml = optionHtml;
            optionToBePushed.selected = selected;
            optionToBePushed.url = imageUrl;
            this.mcqOptions.push(optionToBePushed);
        }
    }
    /**
     * @return {?}
     */
    renderLatex() {
        /** @type {?} */
        const _instance = this;
        setTimeout((/**
         * @return {?}
         */
        function () {
            _instance.replaceLatexText();
            /** @type {?} */
            const images = document.getElementsByTagName('img');
            if (images != null && images.length > 0) {
            }
        }), 100);
    }
    /**
     * @return {?}
     */
    replaceLatexText() {
        /** @type {?} */
        const questionElement = document.getElementById(this.identifier);
        if (questionElement != null) {
            /** @type {?} */
            const mathTextDivs = questionElement.getElementsByClassName('mathText');
            for (let i = 0; i < mathTextDivs.length; i++) {
                /** @type {?} */
                const mathExp = mathTextDivs[i];
                /** @type {?} */
                const textToRender = mathExp.innerHTML;
                katex.render(textToRender, mathExp, { displayMode: false, output: 'html', throwOnError: true });
            }
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onOptionSelect(event) {
        /** @type {?} */
        const mcqOption = event.option;
        /** @type {?} */
        const solutions = event.solutions;
        this.mcqOptions.forEach((/**
         * @param {?} mcqOptionElement
         * @return {?}
         */
        mcqOptionElement => {
            if (mcqOptionElement.index === event.option.index) {
                mcqOptionElement.selected = true;
            }
            else {
                mcqOptionElement.selected = false;
            }
        }));
        mcqOption.solutions = solutions;
        this.getSelectedOptionAndResult(mcqOption);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    optionSelectedInImage(event) {
        this.onOptionSelect(event);
    }
    /**
     * @param {?} optionObj
     * @return {?}
     */
    getSelectedOptionAndResult(optionObj) {
        this.optionSelected.emit(optionObj);
    }
    /**
     * @return {?}
     */
    showPopup() {
        this.showQumlPopup = true;
    }
    /**
     * @return {?}
     */
    closePopUp() {
        this.showQumlPopup = false;
    }
}
McqComponent.decorators = [
    { type: Component, args: [{
                selector: 'quml-mcq',
                template: "<!-- Default Layout-->\n<div class=\"quml-mcq layoutDefault\" *ngIf=\"layout=='DEFAULT'\">\n    <div class=\"quml-mcq--question mb-16\">\n        <quml-mcq-question [mcqQuestion]=\"mcqQuestion\" [layout]=\"layout\" (showPopup)=\"showPopup()\"></quml-mcq-question>\n    </div>\n    <div class=\"quml-mcq--option\">\n        <quml-mcq-option [mcqOptions]=\"options\" [replayed]=\"replayed\" [cardinality]=\"cardinality\"\n            [solutions]=\"solutions\" [layout]=\"layout\" (optionSelected)=\"getSelectedOptionAndResult($event)\"\n            (showPopup)=\"showPopup()\" [tryAgain]=\"tryAgain\"></quml-mcq-option>\n    </div>\n</div>\n<!-- End of Default Layout-->\n<!--Image Grid Layout-->\n<div class=\"quml-mcq layoutImageGrid-mcq-horizontal\" *ngIf=\"layout=='IMAGEGRID'\">\n    <div class=\"quml-mcq--question mb-16\">\n        <quml-mcq-question [mcqQuestion]=\"mcqQuestion\" [layout]=\"layout\"></quml-mcq-question>\n    </div>\n    <div class=\"quml-mcq--option\">\n        <quml-mcq-option [mcqOptions]=\"options\" [replayed]=\"replayed\" [cardinality]=\"cardinality\" [layout]=\"layout\"\n            [solutions]=\"solutions\" (optionSelected)=\"getSelectedOptionAndResult($event)\" [tryAgain]=\"tryAgain\">\n        </quml-mcq-option>\n    </div>\n</div>\n<!--End of Grid Layout-->\n<!--Image Multi Grid Layout-->\n<div class=\"quml-mcq layoutMultiImageGrid\" *ngIf=\"layout==='MULTIIMAGEGRID'\">\n    <div class=\"imageqa-wrapper image-grid\">\n        <div class=\"quml-mcq--question mb-16\">\n            <quml-mcq-question [mcqQuestion]=\"mcqQuestion\" [layout]=\"layout\"></quml-mcq-question>\n        </div>\n        <div class=\"quml-mcq--option\">\n            <quml-mcq-option [mcqOptions]=\"options\" [replayed]=\"replayed\" [cardinality]=\"cardinality\"\n                [solutions]=\"solutions\" (optionSelected)=\"getSelectedOptionAndResult($event)\" [layout]=\"layout\" [tryAgain]=\"tryAgain\">\n            </quml-mcq-option>\n        </div>\n    </div>\n</div>\n<!--End of Image Multi Grid Layout-->\n<!--Image QA Grid Layout-->\n<div class=\"quml-mcq layoutImageQAGridMCQ-vSplit\" *ngIf=\"layout=='IMAGEQAGRID'\">\n    <div class=\"imageqa-wrapper\">\n        <div class=\"quml-mcq--question mb-16\">\n            <quml-mcq-question [mcqQuestion]=\"mcqQuestion\" [layout]=\"layout\"></quml-mcq-question>\n        </div>\n        <div class=\"quml-mcq--option\">\n            <quml-mcq-option [mcqOptions]=\"options\" [replayed]=\"replayed\" [cardinality]=\"cardinality\"\n                [solutions]=\"solutions\" (optionSelected)=\"getSelectedOptionAndResult($event)\" [layout]=\"layout\" [tryAgain]=\"tryAgain\">\n            </quml-mcq-option>\n        </div>\n    </div>\n</div>\n<!--End of Image QA Grid Layout-->\n<!--Image QOption Layout-->\n<div class=\"quml-mcq layoutImageOption\" *ngIf=\"layout=='IMAGEQOPTION'\">\n    <div class=\"columnBlock questionBlock quml-mcq--question mb-16\">\n        <quml-mcq-question [mcqQuestion]=\"mcqQuestion\" [layout]=\"layout\"></quml-mcq-question>\n    </div>\n    <div class=\"columnBlock quml-mcq--option\">\n        <quml-mcq-option [mcqOptions]=\"options\" [replayed]=\"replayed\" [cardinality]=\"cardinality\"\n            [solutions]=\"solutions\" [layout]=\"layout\" (optionSelected)=\"getSelectedOptionAndResult($event)\" [tryAgain]=\"tryAgain\">\n        </quml-mcq-option>\n    </div>\n</div>\n\n<!--End of Image QOption Layout-->\n<quml-quml-popup *ngIf=\"showQumlPopup\" (popUpClose)=\"closePopUp()\"></quml-quml-popup>",
                styles: [".quml-mcq{padding:0}.quml-mcq .columnBlock{display:inline-block;min-width:12.5rem;padding:.25rem;min-height:12.5rem;vertical-align:top}.quml-mcq .questionBlock{max-width:17.1875rem;width:30%}.quml-mcq .image-grid{display:flex}.quml-mcq .image-grid .quml-mcq--question{flex-basis:25%}.quml-mcq .image-grid .quml-mcq--option{flex:1 1 75%}::ng-deep .layoutImageGrid-mcq-horizontal .quml-mcq--option .qumlImageOption .wrapper{-ms-grid-columns:(1fr)[4];grid-template-columns:repeat(4,1fr)}@media only screen and (min-width:360px) and (max-width:640px){::ng-deep .layoutImageGrid-mcq-horizontal .quml-mcq--option .qumlImageOption .wrapper{-ms-grid-columns:(1fr)[2];grid-template-columns:repeat(2,1fr)}}", ".answer{border:1px solid;padding:.2em;margin:.5em}.icon{width:15%;max-width:70px;min-width:50px;display:inline-block;vertical-align:top}.mcqText{display:inline-block;word-break:break-word}.mcq-option{background:var(--white);border-radius:5px;margin:8px 16px;padding:8px}.options{word-break:break-all;padding:15px 5px}.even,.odd{width:47%;display:inline-block;vertical-align:middle}.column-block{display:inline-block;width:48%;vertical-align:middle}.selected{background:var(--primary-color);color:var(--white);box-shadow:1px 2px 1px 3px var(--black)}.mathText{display:inline!important}.padding-top{padding-top:16px}@media only screen and (min-width:100px) and (max-width:481px){.mcqText{width:75%}.even,.odd{width:38%;display:inline-block;vertical-align:middle}.column-block{display:inline-block;width:42%;vertical-align:middle}}@media only screen and (min-width:481px) and (max-width:800px){.mcqText{width:85%}.even,.odd{width:43%;display:inline-block;vertical-align:middle}.column-block{display:inline-block;width:45%;vertical-align:middle}}@media only screen and (min-width:801px) and (max-width:1200px){.even,.odd{width:45%}.column-block{display:inline-block;width:45%;vertical-align:middle}}"]
            }] }
];
/** @nocollapse */
McqComponent.ctorParameters = () => [
    { type: DomSanitizer },
    { type: UtilService }
];
McqComponent.propDecorators = {
    question: [{ type: Input }],
    identifier: [{ type: Input }],
    layout: [{ type: Input }],
    replayed: [{ type: Input }],
    tryAgain: [{ type: Input }],
    componentLoaded: [{ type: Output }],
    answerChanged: [{ type: Output }],
    optionSelected: [{ type: Output }]
};
if (false) {
    /** @type {?} */
    McqComponent.prototype.question;
    /** @type {?} */
    McqComponent.prototype.identifier;
    /** @type {?} */
    McqComponent.prototype.layout;
    /** @type {?} */
    McqComponent.prototype.replayed;
    /** @type {?} */
    McqComponent.prototype.tryAgain;
    /** @type {?} */
    McqComponent.prototype.componentLoaded;
    /** @type {?} */
    McqComponent.prototype.answerChanged;
    /** @type {?} */
    McqComponent.prototype.optionSelected;
    /** @type {?} */
    McqComponent.prototype.mcqQuestion;
    /** @type {?} */
    McqComponent.prototype.options;
    /** @type {?} */
    McqComponent.prototype.mcqOptions;
    /** @type {?} */
    McqComponent.prototype.selectedOptionTarget;
    /** @type {?} */
    McqComponent.prototype.showQumlPopup;
    /** @type {?} */
    McqComponent.prototype.solutions;
    /** @type {?} */
    McqComponent.prototype.cardinality;
    /** @type {?} */
    McqComponent.prototype.domSanitizer;
    /** @type {?} */
    McqComponent.prototype.utilService;
}

/**
 * @fileoverview added by tsickle
 * Generated from: lib/sa/sa.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class SaComponent {
    /**
     * @param {?} domSanitizer
     */
    constructor(domSanitizer) {
        this.domSanitizer = domSanitizer;
        this.componentLoaded = new EventEmitter();
        this.showAnswerClicked = new EventEmitter();
        this.showAnswer = false;
    }
    /**
     * @return {?}
     */
    ngOnChanges() {
        var _a;
        if (this.replayed) {
            this.showAnswer = false;
        }
        else if ((_a = this.questions) === null || _a === void 0 ? void 0 : _a.isAnswerShown) {
            this.showAnswer = true;
        }
    }
    /**
     * @return {?}
     */
    showAnswerToUser() {
        this.showAnswer = true;
        this.showAnswerClicked.emit({
            showAnswer: this.showAnswer
        });
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onEnter(event) {
        if (event.keyCode === 13) {
            event.stopPropagation();
            this.showAnswerToUser();
        }
    }
    /**
     * @return {?}
     */
    handleKeyboardAccessibility() {
        /** @type {?} */
        const elements = Array.from((/** @type {?} */ (document.getElementsByClassName('option-body'))));
        elements.forEach((/**
         * @param {?} element
         * @return {?}
         */
        (element) => {
            if (element.offsetHeight) {
                /** @type {?} */
                const children = Array.from(element.querySelectorAll("a"));
                children.forEach((/**
                 * @param {?} child
                 * @return {?}
                 */
                (child) => {
                    child.setAttribute('tabindex', '-1');
                }));
            }
        }));
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.question = this.questions.body;
        this.answer = this.questions.answer;
        this.solutions = this.questions.solutions;
        this.questions.solutions.forEach((/**
         * @param {?} ele
         * @return {?}
         */
        ele => {
            if (ele.type === 'video' || ele.type === 'image') {
                this.questions.media.forEach((/**
                 * @param {?} e
                 * @return {?}
                 */
                e => {
                    if (ele.value === e.id) {
                        if (this.baseUrl) {
                            ele.src = `${this.baseUrl}/${this.questions.identifier}/${e.src}`;
                        }
                        else {
                            ele.src = e.baseUrl ? e.baseUrl + e.src : e.src;
                        }
                        if (e.thumbnail) {
                            ele.thumbnail = e.thumbnail;
                        }
                    }
                }));
            }
        }));
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        this.handleKeyboardAccessibility();
    }
}
SaComponent.decorators = [
    { type: Component, args: [{
                selector: 'quml-sa',
                template: "<div class=\"quml-sa\">\n  <div class=\"question-container\" tabindex=\"0\">\n    <div class=\"sa-title\">Question</div>\n    <div class=\"question\" [innerHTML]=\"question | safeHtml\"></div>\n  </div>\n  <div class=\"sa-button-container\">\n    <div *ngIf=\"!showAnswer\" id=\"submit-answer\" tabindex=\"0\" class=\"sb-btn sb-btn-primary sb-btn-normal sb-btn-radius\"\n      (click)=\"showAnswerToUser()\" (keydown)=\"onEnter($event)\">{{'show_answer' | translate}}</div>\n  </div>\n  <div id=\"answer-container\" [ngClass]=\"showAnswer ? 'option-container-blurred-out': 'option-container-blurred'\">\n    <div class=\"sa-title\" [attr.aria-hidden]=\"showAnswer ? null : true\">Answer</div>\n    <div class=\"option-body\" [innerHTML]=\"answer | safeHtml\" [attr.aria-hidden]=\"showAnswer ? null : true\"></div>\n    <ng-container *ngIf=\"solutions?.length\" [attr.aria-hidden]=\"showAnswer ? null : true\">\n      <div class=\"sa-title\">Solution</div>\n      <div class=\"solutions\" *ngFor=\"let solution of solutions\">\n        <ng-container [ngSwitch]=\"solution.type\">\n          <div *ngSwitchCase=\"'html'\" [innerHTML]=\"solution.value | safeHtml\" tabindex=\"-1\"></div>\n          <div *ngSwitchCase=\"'video'\">\n            <video width=\"400\" controls [poster]=\"solution.thumbnail\">\n              <source [src]=\"solution.src\" type=\"video/mp4\">\n              <source [src]=\"solution.src\" type=\"video/webm\">\n            </video>\n          </div>\n          <div *ngSwitchCase=\"'image'\">\n            <img [src]=\"solution.src\" alt=\"Subjective question solution with image\">\n          </div>\n        </ng-container>\n      </div>\n    </ng-container>\n  </div>\n</div>\n",
                styles: [".sa-title{color:var(--primary-color);font-size:.875rem;font-weight:500;margin:16px 0;clear:both}.question-container{margin-top:2.5rem}.sa-button-container{text-align:center;margin-bottom:1rem;margin-top:1rem;clear:both}.option-container-blurred{filter:blur(.25rem);pointer-events:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;clear:both}.option-container-blurred-out{filter:unset;transition:.4s;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text;user-select:text;pointer-events:auto}.solutions{clear:both}", ".answer{border:1px solid;padding:.2em;margin:.5em}.icon{width:15%;max-width:70px;min-width:50px;display:inline-block;vertical-align:top}.mcqText{display:inline-block;word-break:break-word}.mcq-option{background:var(--white);border-radius:5px;margin:8px 16px;padding:8px}.options{word-break:break-all;padding:15px 5px}.even,.odd{width:47%;display:inline-block;vertical-align:middle}.column-block{display:inline-block;width:48%;vertical-align:middle}.selected{background:var(--primary-color);color:var(--white);box-shadow:1px 2px 1px 3px var(--black)}.mathText{display:inline!important}.padding-top{padding-top:16px}@media only screen and (min-width:100px) and (max-width:481px){.mcqText{width:75%}.even,.odd{width:38%;display:inline-block;vertical-align:middle}.column-block{display:inline-block;width:42%;vertical-align:middle}}@media only screen and (min-width:481px) and (max-width:800px){.mcqText{width:85%}.even,.odd{width:43%;display:inline-block;vertical-align:middle}.column-block{display:inline-block;width:45%;vertical-align:middle}}@media only screen and (min-width:801px) and (max-width:1200px){.even,.odd{width:45%}.column-block{display:inline-block;width:45%;vertical-align:middle}}"]
            }] }
];
/** @nocollapse */
SaComponent.ctorParameters = () => [
    { type: DomSanitizer }
];
SaComponent.propDecorators = {
    questions: [{ type: Input }],
    replayed: [{ type: Input }],
    baseUrl: [{ type: Input }],
    componentLoaded: [{ type: Output }],
    showAnswerClicked: [{ type: Output }]
};
if (false) {
    /** @type {?} */
    SaComponent.prototype.questions;
    /** @type {?} */
    SaComponent.prototype.replayed;
    /** @type {?} */
    SaComponent.prototype.baseUrl;
    /** @type {?} */
    SaComponent.prototype.componentLoaded;
    /** @type {?} */
    SaComponent.prototype.showAnswerClicked;
    /** @type {?} */
    SaComponent.prototype.showAnswer;
    /** @type {?} */
    SaComponent.prototype.solutions;
    /** @type {?} */
    SaComponent.prototype.question;
    /** @type {?} */
    SaComponent.prototype.answer;
    /** @type {?} */
    SaComponent.prototype.domSanitizer;
}

/**
 * @fileoverview added by tsickle
 * Generated from: lib/header/header.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class HeaderComponent {
    constructor() {
        this.nextSlideClicked = new EventEmitter();
        this.prevSlideClicked = new EventEmitter();
        this.durationEnds = new EventEmitter();
        this.showSolution = new EventEmitter();
        this.showWarning = false;
        this.isMobilePortrait = false;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        if (this.duration && this.showTimer) {
            this.minutes = Math.floor(this.duration / 60);
            this.seconds = this.duration - this.minutes * 60 < 10 ? `0${this.duration - this.minutes * 60}` : this.duration - this.minutes * 60;
        }
    }
    /**
     * @return {?}
     */
    ngOnChanges() {
        if (this.duration && this.showTimer && this.initializeTimer && !this.intervalRef) {
            this.timer();
        }
        else if (this.duration === 0 && this.showTimer && this.initializeTimer && !this.intervalRef) {
            this.showCountUp();
        }
        if (this.replayed && this.duration && this.showTimer) {
            this.showWarning = false;
            clearInterval(this.intervalRef);
            this.timer();
        }
        else if (this.replayed && this.duration === 0 && this.showTimer) {
            clearInterval(this.intervalRef);
            this.showCountUp();
        }
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        this.isMobilePortrait = window.matchMedia("(max-width: 480px)").matches;
        ;
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        if (this.intervalRef) {
            clearInterval(this.intervalRef);
        }
    }
    /**
     * @return {?}
     */
    nextSlide() {
        if (!this.disableNext) {
            this.nextSlideClicked.emit({ type: 'next' });
        }
    }
    /**
     * @return {?}
     */
    prevSlide() {
        if (!this.showStartPage && this.currentSlideIndex === 1) {
            return;
        }
        if (!this.disablePreviousNavigation) {
            this.prevSlideClicked.emit({ event: 'previous clicked' });
        }
    }
    /**
     * @return {?}
     */
    openNav() {
        document.getElementById('mySidenav').style.width = '100%';
        document.body.style.backgroundColor = 'rgba(0,0,0,0.4)';
    }
    /**
     * @return {?}
     */
    closeNav() {
        document.getElementById('mySidenav').style.width = '0';
        document.body.style.backgroundColor = 'white';
    }
    /**
     * @return {?}
     */
    timer() {
        if (this.duration > 0) {
            /** @type {?} */
            let durationInSec = this.duration;
            this.intervalRef = setInterval((/**
             * @return {?}
             */
            () => {
                /** @type {?} */
                let min = ~~(durationInSec / 60);
                /** @type {?} */
                let sec = (durationInSec % 60);
                if (sec < 10) {
                    this.time = min + ':' + '0' + sec;
                }
                else {
                    this.time = min + ':' + sec;
                }
                if (durationInSec === 0) {
                    clearInterval(this.intervalRef);
                    this.durationEnds.emit(true);
                    return false;
                }
                if (parseInt(durationInSec) <= parseInt(this.warningTime)) {
                    this.showWarning = true;
                }
                durationInSec--;
            }), 1000);
        }
    }
    /**
     * @return {?}
     */
    showCountUp() {
        /** @type {?} */
        let min = 0;
        /** @type {?} */
        let sec = 0;
        this.intervalRef = setInterval((/**
         * @return {?}
         */
        () => {
            if (sec === 59) {
                sec = 0;
                min = min + 1;
            }
            if (sec < 10) {
                this.time = min + ':' + '0' + sec++;
            }
            else {
                this.time = min + ':' + sec++;
            }
        }), 1000);
    }
}
HeaderComponent.decorators = [
    { type: Component, args: [{
                selector: 'quml-header',
                template: "<div class=\"quml-header__container\">\n  <div>\n    <!-- <quml-menu class=\"quml-menu\"></quml-menu> -->\n    <div *ngIf=\"attempts?.max && attempts?.current\" class=\"attempts sb-color-primary fnormal font-weight-bold pl-64\">Attempt no {{attempts.current}}/{{attempts.max}}</div>\n  </div>\n\n  <div class=\"quml-header__metadata\">\n    <ng-container *ngIf=\"duration\">\n      <div class=\"duration mr-16\" title=\"{{minutes}}:{{seconds}}\" *ngIf=\"duration && showTimer && !initializeTimer\">\n        <quml-durationtimer></quml-durationtimer>\n        <span>{{minutes}}:{{seconds}}</span>\n      </div>\n      <div class=\"duration mr-16\" title=\"{{minutes}}:{{seconds}}\" *ngIf=\"duration && showTimer && initializeTimer && time\">\n        <quml-durationtimer></quml-durationtimer>\n        <span [ngClass]=\"{'blink': showWarning}\">{{time}}</span> \n      </div>\n    </ng-container>\n    <ng-container *ngIf=\"!duration && showTimer && initializeTimer\">\n      <div class=\"duration mr-16\" title=\"{{minutes}}:{{seconds}}\">\n        <quml-durationtimer></quml-durationtimer>\n        <span>{{time}}</span>\n      </div>\n    </ng-container>\n\n    <!-- <div class=\"star-container\">\n      <span div class=\"star\">\n        <quml-star></quml-star>\n      </span>\n      <span class=\"score\">\n        47\n      </span>\n    </div> -->\n    <div class=\"quml-navigation\" *ngIf=\"!disableNext && !isMobilePortrait\">\n      <div class=\"quml-navigation__previous\" (click)=\"prevSlide()\" aria-label=\"preview slide\" title=\"preview slide\" role=\"navigation\"\n        [ngClass]=\"(startPageInstruction && currentSlideIndex === 0) || (!showStartPage && currentSlideIndex === 1) ? 'navigation-icon-disabled': '' \" \n        [attr.tabindex]=\"(startPageInstruction && currentSlideIndex === 0) || (!showStartPage && currentSlideIndex === 1) ? -1 : 0\"></div>\n      <div class=\"quml-navigation__next ml-8\" (click)=\"nextSlide()\" (keydown.enter)=\"nextSlide()\" aria-label=\"next slide\" title=\"next slide\" *ngIf=\"!active\" role=\"navigation\"\n        [ngClass]=\"disableNext ? 'navigation-icon-disabled': '' \" tabindex=\"0\"></div>\n      <div class=\"quml-navigation__next quml-navigation__next--active ml-8\" (click)=\"nextSlide()\" (keydown.enter)=\"nextSlide()\" aria-label=\"next slide\" title=\"next slide\" *ngIf=\"active\" role=\"navigation\"\n        [ngClass]=\"disableNext ? 'navigation-icon-disabled': '' \" tabindex=\"0\"></div>\n    </div>\n\n  </div>\n</div>\n\n<div class=\"quml-header__metadata quml-header__metadata--portrait\" *ngIf=\"!loadScoreBoard && !endPageReached\">\n  <div class=\"current-slide fnormal\">{{currentSlideIndex}}/{{totalNoOfQuestions}}</div>\n  <div class=\"ml-16\" *ngIf=\"currentSolutions && showFeedBack\">\n    <quml-ans (click)=\"showSolution.emit()\"></quml-ans>\n  </div>\n  <div class=\"quml-navigation ml-auto\">\n    <div class=\"quml-navigation__previous\" tabindex=\"0\" (click)=\"prevSlide()\" (keydown.enter)=\"prevSlide()\" aria-label=\"preview slide\"></div>\n    <div class=\"quml-navigation__next ml-8\" tabindex=\"0\" (click)=\"nextSlide()\" (keydown.enter)=\"nextSlide()\" *ngIf=\"!active\" aria-label=\"next slide\"></div>\n    <div class=\"quml-navigation__next quml-navigation__next--active ml-8\" tabindex=\"0\" (click)=\"nextSlide()\" (keydown.enter)=\"nextSlide()\" *ngIf=\"active\" aria-label=\"next slide\"></div>\n  </div>\n\n</div>",
                styles: ["::ng-deep :root{--quml-color-primary:#FFD555;--quml-color-primary-contrast:#333;--quml-color-warning:#ff0000;--quml-btn-border:#ccc;--quml-color-gray:#666;--quml-main-bg:#fff;--quml-navigation-btns:#333;--quml-header-metadata:#fff}.quml-header__container,.quml-header__metadata{display:flex;align-items:center}.quml-header__container{justify-content:space-between;position:absolute;top:0;background:var(--quml-main-bg);min-height:3.5rem;width:100%;padding:.5rem 1rem .5rem 0;z-index:9}.quml-header__metadata--portrait{display:none}.quml-navigation{display:flex;align-items:center}@media only screen and (max-width:480px){.quml-header__metadata--portrait{display:flex;position:fixed;bottom:0;width:100%;padding:.5rem 1rem;background-color:var(--white);z-index:5;min-height:3rem}.quml-header__metadata--portrait .quml-navigation{display:flex}.quml-navigation{display:none}}.quml-navigation__next,.quml-navigation__previous{position:relative;width:3.75rem;height:2.25rem;background:var(--quml-header-metadata);border:.03125rem solid var(--quml-btn-border);border-radius:1rem;box-shadow:inset 0 -.09375rem .0625rem 0 rgba(0,0,0,.2);cursor:pointer}.quml-navigation__next::after,.quml-navigation__previous::after{content:\"\";display:inline-block;padding:.21875rem;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);border:solid var(--quml-navigation-btns);border-width:0 .125rem .125rem 0}.quml-navigation__next--active,.quml-navigation__next:focus,.quml-navigation__next:hover,.quml-navigation__previous--active,.quml-navigation__previous:focus,.quml-navigation__previous:hover{background-color:var(--quml-color-primary)}.quml-navigation__next::after{transform:translate(-50%,-50%) rotate(-45deg);-webkit-transform:translate(-50%,-50%) rotate(-45deg)}.quml-navigation__previous::after{transform:translate(-50%,-50%) rotate(135deg);-webkit-transform:translate(-50%,-50%) rotate(135deg)}.blink{-webkit-animation:1s steps(1,end) infinite blink;animation:1s steps(1,end) infinite blink;color:var(--quml-color-warning)}.duration,quml-durationtimer{display:flex;align-items:center}.duration{color:var(--quml-color-primary-contrast);font-weight:700}quml-durationtimer{margin-right:.5rem}.current-slide{color:var(--white);font-weight:700}.navigation-icon-disabled{opacity:.6;cursor:not-allowed}@-webkit-keyframes blink{0%,100%{opacity:1}50%{opacity:0}}@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}"]
            }] }
];
/** @nocollapse */
HeaderComponent.ctorParameters = () => [];
HeaderComponent.propDecorators = {
    questions: [{ type: Input }],
    duration: [{ type: Input }],
    warningTime: [{ type: Input }],
    disablePreviousNavigation: [{ type: Input }],
    showTimer: [{ type: Input }],
    totalNoOfQuestions: [{ type: Input }],
    currentSlideIndex: [{ type: Input }],
    active: [{ type: Input }],
    initializeTimer: [{ type: Input }],
    endPageReached: [{ type: Input }],
    loadScoreBoard: [{ type: Input }],
    replayed: [{ type: Input }],
    currentSolutions: [{ type: Input }],
    showFeedBack: [{ type: Input }],
    nextSlideClicked: [{ type: Output }],
    prevSlideClicked: [{ type: Output }],
    durationEnds: [{ type: Output }],
    showSolution: [{ type: Output }],
    disableNext: [{ type: Input }],
    startPageInstruction: [{ type: Input }],
    showStartPage: [{ type: Input }],
    attempts: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    HeaderComponent.prototype.questions;
    /** @type {?} */
    HeaderComponent.prototype.duration;
    /** @type {?} */
    HeaderComponent.prototype.warningTime;
    /** @type {?} */
    HeaderComponent.prototype.disablePreviousNavigation;
    /** @type {?} */
    HeaderComponent.prototype.showTimer;
    /** @type {?} */
    HeaderComponent.prototype.totalNoOfQuestions;
    /** @type {?} */
    HeaderComponent.prototype.currentSlideIndex;
    /** @type {?} */
    HeaderComponent.prototype.active;
    /** @type {?} */
    HeaderComponent.prototype.initializeTimer;
    /** @type {?} */
    HeaderComponent.prototype.endPageReached;
    /** @type {?} */
    HeaderComponent.prototype.loadScoreBoard;
    /** @type {?} */
    HeaderComponent.prototype.replayed;
    /** @type {?} */
    HeaderComponent.prototype.currentSolutions;
    /** @type {?} */
    HeaderComponent.prototype.showFeedBack;
    /** @type {?} */
    HeaderComponent.prototype.nextSlideClicked;
    /** @type {?} */
    HeaderComponent.prototype.prevSlideClicked;
    /** @type {?} */
    HeaderComponent.prototype.durationEnds;
    /** @type {?} */
    HeaderComponent.prototype.showSolution;
    /** @type {?} */
    HeaderComponent.prototype.disableNext;
    /** @type {?} */
    HeaderComponent.prototype.startPageInstruction;
    /** @type {?} */
    HeaderComponent.prototype.showStartPage;
    /** @type {?} */
    HeaderComponent.prototype.attempts;
    /** @type {?} */
    HeaderComponent.prototype.minutes;
    /** @type {?} */
    HeaderComponent.prototype.seconds;
    /**
     * @type {?}
     * @private
     */
    HeaderComponent.prototype.intervalRef;
    /** @type {?} */
    HeaderComponent.prototype.showWarning;
    /** @type {?} */
    HeaderComponent.prototype.isMobilePortrait;
    /** @type {?} */
    HeaderComponent.prototype.time;
}

/**
 * @fileoverview added by tsickle
 * Generated from: lib/mcq-question/mcq-question.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class McqQuestionComponent {
    constructor() {
        this.showPopup = new EventEmitter();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
    }
    /**
     * @return {?}
     */
    showQumlPopup() {
        this.showPopup.emit();
    }
}
McqQuestionComponent.decorators = [
    { type: Component, args: [{
                selector: 'quml-mcq-question',
                template: "<div [ngClass]=\"mcqQuestion.includes('img') ? 'quml-mcq-image-questions' : 'quml-mcq-questions'\">\n    <!-- <quml-audio></quml-audio> -->\n    <div class=\"quml-question\" #question [innerHTML]=\"mcqQuestion | safeHtml\">\n    </div>\n</div>",
                styles: [".quml-mcq-questions{display:flex;gap:1rem}.quml-mcq-image-questions{display:flex;justify-content:start;align-items:flex-start}img{width:100%!important}quml-audio{padding:4px 8px;margin-top:19px}.quml-question-icon{display:inline-block;float:left;padding-right:.5rem;content:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMzZweCIgaGVpZ2h0PSIzNnB4IiB2aWV3Qm94PSIwIDAgMzYgMzYiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogc2tldGNodG9vbCA2MiAoMTAxMDEwKSAtIGh0dHBzOi8vc2tldGNoLmNvbSAtLT4KICAgIDx0aXRsZT40NjI5QzQ3QS1BQzY2LTQwRTEtOEM3OS0xNTIwOENFRUEzQTU8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIHNrZXRjaHRvb2wuPC9kZXNjPgogICAgPGRlZnM+CiAgICAgICAgPHJlY3QgaWQ9InBhdGgtMSIgeD0iMCIgeT0iMCIgd2lkdGg9IjMwIiBoZWlnaHQ9IjMwIiByeD0iMTUiPjwvcmVjdD4KICAgICAgICA8ZmlsdGVyIHg9Ii01LjAlIiB5PSItNS4wJSIgd2lkdGg9IjExMC4wJSIgaGVpZ2h0PSIxMTAuMCUiIGZpbHRlclVuaXRzPSJvYmplY3RCb3VuZGluZ0JveCIgaWQ9ImZpbHRlci0yIj4KICAgICAgICAgICAgPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iMSIgaW49IlNvdXJjZUFscGhhIiByZXN1bHQ9InNoYWRvd0JsdXJJbm5lcjEiPjwvZmVHYXVzc2lhbkJsdXI+CiAgICAgICAgICAgIDxmZU9mZnNldCBkeD0iMCIgZHk9Ii0xIiBpbj0ic2hhZG93Qmx1cklubmVyMSIgcmVzdWx0PSJzaGFkb3dPZmZzZXRJbm5lcjEiPjwvZmVPZmZzZXQ+CiAgICAgICAgICAgIDxmZUNvbXBvc2l0ZSBpbj0ic2hhZG93T2Zmc2V0SW5uZXIxIiBpbjI9IlNvdXJjZUFscGhhIiBvcGVyYXRvcj0iYXJpdGhtZXRpYyIgazI9Ii0xIiBrMz0iMSIgcmVzdWx0PSJzaGFkb3dJbm5lcklubmVyMSI+PC9mZUNvbXBvc2l0ZT4KICAgICAgICAgICAgPGZlQ29sb3JNYXRyaXggdmFsdWVzPSIwIDAgMCAwIDAgICAwIDAgMCAwIDAgICAwIDAgMCAwIDAgIDAgMCAwIDAuNSAwIiB0eXBlPSJtYXRyaXgiIGluPSJzaGFkb3dJbm5lcklubmVyMSI+PC9mZUNvbG9yTWF0cml4PgogICAgICAgIDwvZmlsdGVyPgogICAgPC9kZWZzPgogICAgPGcgaWQ9ImRldnMiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJtY3ExIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNTgwLjAwMDAwMCwgLTYwLjAwMDAwMCkiPgogICAgICAgICAgICA8ZyBpZD0iYXVkaW8tcGxheSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNTgwLjAwMDAwMCwgNjAuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8ZyBpZD0iR3JvdXAtOSI+CiAgICAgICAgICAgICAgICAgICAgPGcgaWQ9Ikdyb3VwIj4KICAgICAgICAgICAgICAgICAgICAgICAgPGcgaWQ9Ikdyb3VwLUNvcHkiPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJlY3QgaWQ9IlJlY3RhbmdsZS01LUNvcHkiIGZpbGw9IiMwMDAwMDAiIGZpbGwtcnVsZT0ibm9uemVybyIgb3BhY2l0eT0iMC4yNzc1Mjk3NjIiIHg9IjAiIHk9IjAiIHdpZHRoPSIzNiIgaGVpZ2h0PSIzNiIgcng9IjE4Ij48L3JlY3Q+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZyBpZD0iR3JvdXAtMiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMy4wMDAwMDAsIDMuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGcgaWQ9IlJlY3RhbmdsZS01LUNvcHktMiIgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHVzZSBmaWxsPSIjRkZGRkZGIiB4bGluazpocmVmPSIjcGF0aC0xIj48L3VzZT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHVzZSBmaWxsPSJibGFjayIgZmlsbC1vcGFjaXR5PSIxIiBmaWx0ZXI9InVybCgjZmlsdGVyLTIpIiB4bGluazpocmVmPSIjcGF0aC0xIj48L3VzZT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJlY3Qgc3Ryb2tlLW9wYWNpdHk9IjAuNDg0MTU2NDY5IiBzdHJva2U9IiNDM0M4REIiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVqb2luPSJzcXVhcmUiIHg9IjEiIHk9IjEiIHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCIgcng9IjE0Ij48L3JlY3Q+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xNSw5IEwxNSwxNi4wMzMzMzMzIEMxNC42MDY2NjY3LDE1LjgwNjY2NjcgMTQuMTUzMzMzMywxNS42NjY2NjY3IDEzLjY2NjY2NjcsMTUuNjY2NjY2NyBDMTIuMTkzMzMzMywxNS42NjY2NjY3IDExLDE2Ljg2IDExLDE4LjMzMzMzMzMgQzExLDE5LjgwNjY2NjcgMTIuMTkzMzMzMywyMSAxMy42NjY2NjY3LDIxIEMxNS4xNCwyMSAxNi4zMzMzMzMzLDE5LjgwNjY2NjcgMTYuMzMzMzMzMywxOC4zMzMzMzMzIEwxNi4zMzMzMzMzLDExLjY2NjY2NjcgTDE5LDExLjY2NjY2NjcgTDE5LDkgTDE1LDkgTDE1LDkgWiIgaWQ9IlNoYXBlIiBmaWxsPSIjMDhCQzgyIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgICAgICAgICAgPGcgaWQ9ImljX2NoZXZyb25fbGVmdCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzAuMDAwMDAwLCAxOC4wMDAwMDApIHNjYWxlKC0xLCAxKSB0cmFuc2xhdGUoLTMwLjAwMDAwMCwgLTE4LjAwMDAwMCkgdHJhbnNsYXRlKDI2LjAwMDAwMCwgMTIuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZyBpZD0iSWNvbi0yNHB4Ij48L2c+CiAgICAgICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==)}.quml-question{font-size:.875rem;color:#131415;padding-top:3rem;width:100%}.question-image{position:relative}.icon-zommin{position:absolute;bottom:0;right:0;content:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTlweCIgaGVpZ2h0PSIxOXB4IiB2aWV3Qm94PSIwIDAgMTkgMTkiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDYyICg5MTM5MCkgLSBodHRwczovL3NrZXRjaC5jb20gLS0+CiAgICA8dGl0bGU+em9vbTwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxnIGlkPSJkZXZzIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iem9vbSI+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik05LjUsMCBMMTgsMCBDMTguNTUyMjg0NywtMS4wMTQ1MzA2M2UtMTYgMTksMC40NDc3MTUyNSAxOSwxIEwxOSwxMyBDMTksMTYuMzEzNzA4NSAxNi4zMTM3MDg1LDE5IDEzLDE5IEwxLDE5IEMwLjQ0NzcxNTI1LDE5IDYuNzYzNTM3NTFlLTE3LDE4LjU1MjI4NDcgMCwxOCBMMCw5LjUgQy02LjQyNTM2MDY0ZS0xNiw0LjI1MzI5NDg4IDQuMjUzMjk0ODgsOS42MzgwNDA5NWUtMTYgOS41LDAgWiIgaWQ9IlJlY3RhbmdsZSIgZmlsbC1vcGFjaXR5PSIwLjUiIGZpbGw9IiM0MzQzNDMiIGZpbGwtcnVsZT0ibm9uemVybyI+PC9wYXRoPgogICAgICAgICAgICA8ZyBpZD0iR3JvdXAiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDUuMDAwMDAwLCA0LjAwMDAwMCkiIGZpbGw9IiNGRkZGRkYiPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTQuNTgzMzMzMzMsMC43NSBDNi45NzY2NjY2NywwLjc1IDguOTE2NjY2NjcsMi42OSA4LjkxNjY2NjY3LDUuMDgzMzMzMzMgQzguOTE2NjY2NjcsNi4xNTY2NjY2NyA4LjUyMzMzMzMzLDcuMTQzMzMzMzMgNy44Nyw3LjkwMzMzMzMzIEw3Ljg3LDcuOTAzMzMzMzMgTDguMDU2NjY2NjcsOC4wODMzMzMzMyBMOC41ODMzMzMzMyw4LjA4MzMzMzMzIEwxMS45MSwxMS40MTY2NjY3IEwxMC45MTY2NjY3LDEyLjQxIEw3LjU4MzMzMzMzLDkuMDgzMzMzMzMgTDcuNTgzMzMzMzMsOC41NTY2NjY2NyBMNy40MDMzMzMzMyw4LjM3IEM2LjY0MzMzMzMzLDkuMDIzMzMzMzMgNS42NTY2NjY2Nyw5LjQxNjY2NjY3IDQuNTgzMzMzMzMsOS40MTY2NjY2NyBDMi4xOSw5LjQxNjY2NjY3IDAuMjUsNy40NzY2NjY2NyAwLjI1LDUuMDgzMzMzMzMgQzAuMjUsMi42OSAyLjE5LDAuNzUgNC41ODMzMzMzMywwLjc1IFogTTQuNTgzMzMzMzMsMi4wODMzMzMzMyBDMi45MjMzMzMzMywyLjA4MzMzMzMzIDEuNTgzMzMzMzMsMy40MjMzMzMzMyAxLjU4MzMzMzMzLDUuMDgzMzMzMzMgQzEuNTgzMzMzMzMsNi43NDMzMzMzMyAyLjkyMzMzMzMzLDguMDgzMzMzMzMgNC41ODMzMzMzMyw4LjA4MzMzMzMzIEM2LjI0MzMzMzMzLDguMDgzMzMzMzMgNy41ODMzMzMzMyw2Ljc0MzMzMzMzIDcuNTgzMzMzMzMsNS4wODMzMzMzMyBDNy41ODMzMzMzMywzLjQyMzMzMzMzIDYuMjQzMzMzMzMsMi4wODMzMzMzMyA0LjU4MzMzMzMzLDIuMDgzMzMzMzMgWiBNNC45MTY2NjY2NywzLjQxNjY2NjY3IEw0LjkxNjY2NjY3LDQuNzUgTDYuMjUsNC43NSBMNi4yNSw1LjQxNjY2NjY3IEw0LjkxNjY2NjY3LDUuNDE2NjY2NjcgTDQuOTE2NjY2NjcsNi43NSBMNC4yNSw2Ljc1IEw0LjI1LDUuNDE2NjY2NjcgTDIuOTE2NjY2NjcsNS40MTY2NjY2NyBMMi45MTY2NjY2Nyw0Ljc1IEw0LjI1LDQuNzUgTDQuMjUsMy40MTY2NjY2NyBMNC45MTY2NjY2NywzLjQxNjY2NjY3IFoiIGlkPSJDb21iaW5lZC1TaGFwZSI+PC9wYXRoPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=)}.question-image img{vertical-align:bottom}"]
            }] }
];
/** @nocollapse */
McqQuestionComponent.ctorParameters = () => [];
McqQuestionComponent.propDecorators = {
    mcqQuestion: [{ type: Input }],
    showPopup: [{ type: Output }],
    layout: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    McqQuestionComponent.prototype.mcqQuestion;
    /** @type {?} */
    McqQuestionComponent.prototype.showPopup;
    /** @type {?} */
    McqQuestionComponent.prototype.layout;
}

/**
 * @fileoverview added by tsickle
 * Generated from: lib/mcq-option/mcq-option.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class McqOptionComponent {
    /**
     * @param {?} utilService
     */
    constructor(utilService) {
        this.utilService = utilService;
        this.showPopup = new EventEmitter();
        this.optionSelected = new EventEmitter();
        this.selectedOption = [];
    }
    /**
     * @return {?}
     */
    ngOnChanges() {
        if (this.replayed) {
            this.mcqOptions.forEach((/**
             * @param {?} ele
             * @return {?}
             */
            (ele) => {
                ele.selected = false;
            }));
        }
        if (this.tryAgain) {
            this.unselectOption();
        }
    }
    /**
     * @return {?}
     */
    unselectOption() {
        this.mcqOptions.forEach((/**
         * @param {?} ele
         * @return {?}
         */
        (ele) => {
            ele.selected = false;
        }));
        this.selectedOption = [];
        this.optionSelected.emit({
            name: 'optionSelect',
            option: this.selectedOption,
            cardinality: this.cardinality,
            solutions: this.solutions
        });
    }
    /**
     * @param {?} event
     * @param {?} mcqOption
     * @return {?}
     */
    onOptionSelect(event, mcqOption) {
        this.mcqOptions.forEach((/**
         * @param {?} ele
         * @return {?}
         */
        (ele) => {
            if (this.cardinality === 'single') {
                if (ele.label === mcqOption.label) {
                    ele.selected = true;
                }
                else {
                    ele.selected = false;
                }
            }
            else if (this.cardinality === 'multiple') {
                if (ele.label === mcqOption.label && !this.utilService.hasDuplicates(this.selectedOption, mcqOption)) {
                    ele.selected = true;
                    this.selectedOption.push(mcqOption);
                }
            }
        }));
        this.optionSelected.emit({
            name: 'optionSelect',
            option: this.cardinality === 'single' ? mcqOption : this.selectedOption,
            cardinality: this.cardinality,
            solutions: this.solutions
        });
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onImageOptionSelected(event) {
        this.onOptionSelect(event, event.option);
    }
    /**
     * @return {?}
     */
    showQumlPopup() {
        this.showPopup.emit();
    }
    /**
     * @param {?} event
     * @param {?} mcqOption
     * @return {?}
     */
    onEnter(event, mcqOption) {
        if (event.keyCode === 13) {
            event.stopPropagation();
            this.onOptionSelect(event, mcqOption);
        }
    }
}
McqOptionComponent.decorators = [
    { type: Component, args: [{
                selector: 'quml-mcq-option',
                template: "<div class=\"quml-mcq-options\" role=\"radiogroup\"  *ngIf=\"layout=='DEFAULT' || layout=='IMAGEQOPTION'\">\n    <div class=\"quml-option-card\" tabindex=\"0\" role=\"checkbox\" [attr.aria-checked]=\"mcqOption.selected\" aria-labelledby=\"option-checkbox\"  *ngFor=\"let mcqOption of mcqOptions\" \n    (keydown)=\"onEnter($event, mcqOption)\" (click)=\"onOptionSelect($event,mcqOption)\">\n        <div class=\"quml-option\"\n        [ngClass]=\"(mcqOption.selected==true)?'quml-option quml-option--selected':'quml-option'\">\n            <div class=\"option\" tabindex=\"0\" [innerHTML]=\"mcqOption.label | safeHtml\"></div>\n            <label class=\"container\">\n                <input type=\"radio\" name=\"radio\" [checked]=\"mcqOption.selected\" id=\"option-checkbox\" tabindex=\"-1\">\n                <span class=\"checkmark\"></span>\n            </label>\n        </div>\n    </div>\n</div>\n<div *ngIf=\"layout=='IMAGEGRID'\">\n    <div class=\"qumlImageOption\">\n        <div class=\"wrapper\">\n            <div *ngFor=\"let mcqOption of mcqOptions\">\n                <quml-mcq-image-option (imgOptionSelected)=\"onImageOptionSelected($event)\" [mcqOption]='mcqOption'></quml-mcq-image-option>\n            </div>\n        </div>\n    </div>\n\n</div>\n<div *ngIf=\"layout == 'IMAGEQAGRID'\">\n    <div class=\"qumlOption-imageQaGrid\">\n        <div class=\"wrapper\">\n            <div *ngFor=\"let mcqOption of mcqOptions\">\n                <quml-mcq-image-option (imgOptionSelected)=\"onImageOptionSelected($event)\" [mcqOption]='mcqOption'></quml-mcq-image-option>\n            </div>\n        </div>\n    </div>\n</div>\n<div class=\"\" *ngIf=\"layout=='MULTIIMAGEGRID'\">\n    <div class=\"qumlImageOption\">\n        <div class=\"wrapper\">\n            <div *ngFor=\"let mcqOption of mcqOptions\">\n                <quml-mcq-image-option (imgOptionSelected)=\"onImageOptionSelected($event)\"  [mcqOption]='mcqOption'></quml-mcq-image-option>\n            </div>\n        </div>\n    </div>\n\n</div>",
                styles: ["@charset \"UTF-8\";::ng-deep :root{--quml-btn-border:#ccc;--quml-color-gray:#666;--quml-checkmark:#cdcdcd;--quml-color-primary-shade:rgba(0, 0, 0, .1);--quml-color-success:#08BC82;--quml-color-danger:#F1635D;--quml-option-card-bg:#fff;--quml-option-selected-checkmark:#fff;--quml-option-selected-checkmark-icon:#fff}.quml-mcq-options{align-items:center;margin-bottom:.5rem}.quml-option-card .option{color:var(--quml-active-slide);color:var(--quml-color-gray);font-size:.875rem}::ng-deep .quml-option-card .option p{margin-bottom:0;font-size:19px}.quml-option label.container{margin:0 auto}.quml-option-card{margin-bottom:1rem}.quml-option{position:relative;background-color:var(--quml-option-card-bg);padding:1rem;border-radius:.25rem;border:.0625rem solid var(--quml-btn-border);box-shadow:0 .125rem .75rem 0 var(--quml-color-primary-shade);display:flex;align-items:center;justify-content:space-between;height:100%;gap:.5rem}.quml-option .option{flex:1}.quml-option--selected{border:.125rem solid var(--primary-color)}.quml-option--correct{border:.125rem solid var(--quml-color-success)}.quml-option--wrong{border:.125rem solid var(--quml-color-danger)}.selected-option{border:.125rem solid var(--primary-color)}.selected-option-text{color:var(--primary-color)!important}.container{padding-right:0!important}.checkmark{display:block;height:1.25rem;width:1.25rem;border-radius:50%;border:.125rem solid var(--quml-checkmark)}.container input{position:absolute;opacity:0;cursor:pointer}.container input:checked~.checkmark,.quml-option--selected .checkmark{position:relative;background-color:var(--quml-option-selected-checkmark);border:.125rem solid var(--primary-color)}.quml-option--selected .checkmark:after,input:checked~.checkmark:after{content:\"\";opacity:1}.container .checkmark:after,.quml-option--selected .container .checkmark:after{margin:0;width:.75rem;height:.75rem;border-radius:50%;background:var(--primary-color);position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);opacity:0}.quml-option--selected .container .checkmark:after{opacity:1}.quml-option--correct .container input:checked~.checkmark{border-color:var(--quml-color-success);background-color:var(--quml-color-success)}.quml-option--correct .container input:checked~.checkmark:after{content:\"\u2714\";color:var(--quml-option-selected-checkmark-icon)}.quml-option--wrong .container input:checked~.checkmark{border-color:var(--quml-color-danger)}.quml-option--wrong .container input:checked~.checkmark:after{content:\"\u2716\";color:var(--quml-color-danger)}.quml-option--correct .container input:checked~.checkmark:after,.quml-option--wrong .container input:checked~.checkmark:after{width:auto;height:auto;background-color:transparent;font-size:.75rem}img{width:100%!important}.option-img{position:relative}.option-img img{width:100%}.icon-zommin{position:absolute;bottom:0;right:0;content:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTlweCIgaGVpZ2h0PSIxOXB4IiB2aWV3Qm94PSIwIDAgMTkgMTkiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDYyICg5MTM5MCkgLSBodHRwczovL3NrZXRjaC5jb20gLS0+CiAgICA8dGl0bGU+em9vbTwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxnIGlkPSJkZXZzIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iem9vbSI+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik05LjUsMCBMMTgsMCBDMTguNTUyMjg0NywtMS4wMTQ1MzA2M2UtMTYgMTksMC40NDc3MTUyNSAxOSwxIEwxOSwxMyBDMTksMTYuMzEzNzA4NSAxNi4zMTM3MDg1LDE5IDEzLDE5IEwxLDE5IEMwLjQ0NzcxNTI1LDE5IDYuNzYzNTM3NTFlLTE3LDE4LjU1MjI4NDcgMCwxOCBMMCw5LjUgQy02LjQyNTM2MDY0ZS0xNiw0LjI1MzI5NDg4IDQuMjUzMjk0ODgsOS42MzgwNDA5NWUtMTYgOS41LDAgWiIgaWQ9IlJlY3RhbmdsZSIgZmlsbC1vcGFjaXR5PSIwLjUiIGZpbGw9IiM0MzQzNDMiIGZpbGwtcnVsZT0ibm9uemVybyI+PC9wYXRoPgogICAgICAgICAgICA8ZyBpZD0iR3JvdXAiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDUuMDAwMDAwLCA0LjAwMDAwMCkiIGZpbGw9IiNGRkZGRkYiPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTQuNTgzMzMzMzMsMC43NSBDNi45NzY2NjY2NywwLjc1IDguOTE2NjY2NjcsMi42OSA4LjkxNjY2NjY3LDUuMDgzMzMzMzMgQzguOTE2NjY2NjcsNi4xNTY2NjY2NyA4LjUyMzMzMzMzLDcuMTQzMzMzMzMgNy44Nyw3LjkwMzMzMzMzIEw3Ljg3LDcuOTAzMzMzMzMgTDguMDU2NjY2NjcsOC4wODMzMzMzMyBMOC41ODMzMzMzMyw4LjA4MzMzMzMzIEwxMS45MSwxMS40MTY2NjY3IEwxMC45MTY2NjY3LDEyLjQxIEw3LjU4MzMzMzMzLDkuMDgzMzMzMzMgTDcuNTgzMzMzMzMsOC41NTY2NjY2NyBMNy40MDMzMzMzMyw4LjM3IEM2LjY0MzMzMzMzLDkuMDIzMzMzMzMgNS42NTY2NjY2Nyw5LjQxNjY2NjY3IDQuNTgzMzMzMzMsOS40MTY2NjY2NyBDMi4xOSw5LjQxNjY2NjY3IDAuMjUsNy40NzY2NjY2NyAwLjI1LDUuMDgzMzMzMzMgQzAuMjUsMi42OSAyLjE5LDAuNzUgNC41ODMzMzMzMywwLjc1IFogTTQuNTgzMzMzMzMsMi4wODMzMzMzMyBDMi45MjMzMzMzMywyLjA4MzMzMzMzIDEuNTgzMzMzMzMsMy40MjMzMzMzMyAxLjU4MzMzMzMzLDUuMDgzMzMzMzMgQzEuNTgzMzMzMzMsNi43NDMzMzMzMyAyLjkyMzMzMzMzLDguMDgzMzMzMzMgNC41ODMzMzMzMyw4LjA4MzMzMzMzIEM2LjI0MzMzMzMzLDguMDgzMzMzMzMgNy41ODMzMzMzMyw2Ljc0MzMzMzMzIDcuNTgzMzMzMzMsNS4wODMzMzMzMyBDNy41ODMzMzMzMywzLjQyMzMzMzMzIDYuMjQzMzMzMzMsMi4wODMzMzMzMyA0LjU4MzMzMzMzLDIuMDgzMzMzMzMgWiBNNC45MTY2NjY2NywzLjQxNjY2NjY3IEw0LjkxNjY2NjY3LDQuNzUgTDYuMjUsNC43NSBMNi4yNSw1LjQxNjY2NjY3IEw0LjkxNjY2NjY3LDUuNDE2NjY2NjcgTDQuOTE2NjY2NjcsNi43NSBMNC4yNSw2Ljc1IEw0LjI1LDUuNDE2NjY2NjcgTDIuOTE2NjY2NjcsNS40MTY2NjY2NyBMMi45MTY2NjY2Nyw0Ljc1IEw0LjI1LDQuNzUgTDQuMjUsMy40MTY2NjY2NyBMNC45MTY2NjY2NywzLjQxNjY2NjY3IFoiIGlkPSJDb21iaW5lZC1TaGFwZSI+PC9wYXRoPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=)}.qumlImageOption .wrapper{margin-top:2rem;display:-ms-grid;display:grid;gap:1rem}.qumlOption-imageQaGrid .wrapper{display:-ms-grid;display:grid;-ms-grid-columns:(1fr)[2];grid-template-columns:repeat(2,1fr);grid-gap:1rem}@media only screen and (max-width:640px){.qumlOption-imageQaGrid .wrapper{-ms-grid-columns:(1fr)[1];grid-template-columns:repeat(1,1fr)}}@media only screen and (max-width:840px){.qumlImageOption .wrapper{-ms-grid-columns:(1fr)[2];grid-template-columns:repeat(2,1fr)}}@media only screen and (max-width:640px){.qumlImageOption .wrapper{-ms-grid-columns:(1fr)[1];grid-template-columns:repeat(1,1fr)}}"]
            }] }
];
/** @nocollapse */
McqOptionComponent.ctorParameters = () => [
    { type: UtilService }
];
McqOptionComponent.propDecorators = {
    mcqOptions: [{ type: Input }],
    solutions: [{ type: Input }],
    layout: [{ type: Input }],
    cardinality: [{ type: Input }],
    showPopup: [{ type: Output }],
    optionSelected: [{ type: Output }],
    replayed: [{ type: Input }],
    tryAgain: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    McqOptionComponent.prototype.mcqOptions;
    /** @type {?} */
    McqOptionComponent.prototype.solutions;
    /** @type {?} */
    McqOptionComponent.prototype.layout;
    /** @type {?} */
    McqOptionComponent.prototype.cardinality;
    /** @type {?} */
    McqOptionComponent.prototype.showPopup;
    /** @type {?} */
    McqOptionComponent.prototype.optionSelected;
    /** @type {?} */
    McqOptionComponent.prototype.selectedOption;
    /** @type {?} */
    McqOptionComponent.prototype.replayed;
    /** @type {?} */
    McqOptionComponent.prototype.tryAgain;
    /** @type {?} */
    McqOptionComponent.prototype.utilService;
}

/**
 * @fileoverview added by tsickle
 * Generated from: lib/quml-popup/quml-popup.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class QumlPopupComponent {
    constructor() {
        this.image = 'https://via.placeholder.com/65';
        this.popUpClose = new EventEmitter();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        document.getElementById('htmlTag').getElementsByTagName('img')[0].style.width = '70%';
    }
    /**
     * @return {?}
     */
    closePopup() {
        this.popUpClose.emit();
    }
}
QumlPopupComponent.decorators = [
    { type: Component, args: [{
                selector: 'quml-quml-popup',
                template: "<div class=\"quml-popup\">\n  <div class=\"quml-popup-icon\" (click)=\"closePopup()\">&#10005;</div>\n  <img *ngIf=\"!htmlTag\" src={{image}}>\n</div>\n\n<div *ngIf=\"htmlTag\" class=\"htmlTag\" id=\"htmlTag\" [innerHtml]=\"htmlTag | safeHtml\"></div>\n\n",
                styles: [".quml-popup{position:absolute;left:0;bottom:0;right:0;background:rgba(0,0,0,.4);top:0;padding:1rem;display:flex;align-items:center;justify-content:center;z-index:2}.quml-popup .quml-popup-icon{font-size:1.25rem;right:10%;position:absolute;cursor:pointer;z-index:2;color:var(--white);top:8%}.quml-popup img{box-shadow:0 .25rem .5rem 0 rgba(0,0,0,.2);height:90%;border-radius:.5rem;position:absolute;z-index:2}.htmlTag{position:absolute;top:15%;left:27%;z-index:10}@media only screen and (max-width:640px){.htmlTag{position:absolute;top:10%;left:27%;z-index:10}}"]
            }] }
];
/** @nocollapse */
QumlPopupComponent.ctorParameters = () => [];
QumlPopupComponent.propDecorators = {
    image: [{ type: Input }],
    htmlTag: [{ type: Input }],
    popUpClose: [{ type: Output }]
};
if (false) {
    /** @type {?} */
    QumlPopupComponent.prototype.image;
    /** @type {?} */
    QumlPopupComponent.prototype.htmlTag;
    /** @type {?} */
    QumlPopupComponent.prototype.popUpClose;
}

/**
 * @fileoverview added by tsickle
 * Generated from: lib/mcq-image-option/mcq-image-option.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class McqImageOptionComponent {
    constructor() {
        this.showQumlPopup = false;
        this.imgOptionSelected = new EventEmitter();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
    }
    /**
     * @param {?} image
     * @return {?}
     */
    showPopup(image) {
        this.showQumlPopup = true;
        this.qumlPopupImage = image;
    }
    /**
     * @param {?} mcqOption
     * @return {?}
     */
    optionClicked(mcqOption) {
        this.imgOptionSelected.emit({
            name: 'optionSelect',
            option: mcqOption,
            solutions: this.solutions
        });
    }
    /**
     * @param {?} event
     * @param {?} mcqOption
     * @return {?}
     */
    onEnter(event, mcqOption) {
        if (event.keyCode === 13) {
            event.stopPropagation();
            this.optionClicked(mcqOption);
        }
    }
    /**
     * @param {?} optionHtml
     * @return {?}
     */
    openPopup(optionHtml) {
        this.showQumlPopup = true;
        this.qumlPopupImage = optionHtml;
    }
    /**
     * @return {?}
     */
    closePopUp() {
        this.showQumlPopup = false;
    }
}
McqImageOptionComponent.decorators = [
    { type: Component, args: [{
                selector: 'quml-mcq-image-option',
                template: "<div class=\"quml-mcq-option-card\" (click)=\"optionClicked(mcqOption)\" tabindex=\"0\" (keydown)=\"onEnter($event, mcqOption)\"\n  [ngClass]=\"mcqOption?.selected ? 'quml-mcq-option-card quml-option--selected' : 'quml-mcq-option-card'\">\n  <div class=\"option\" *ngIf=\"mcqOption\"\n    [innerHTML]=\"mcqOption.label | safeHtml\"></div>\n    <label class=\"container\">\n      <input type=\"radio\" name=\"radio\" role=\"radio\" [checked]=\"mcqOption.selected\" >\n      <span class=\"checkmark\"></span>\n  </label>\n</div>",
                styles: ["::ng-deep :root{--quml-btn-border:#ccc;--quml-color-gray:#666;--quml-checkmark:#cdcdcd;--quml-color-primary-shade:rgba(0, 0, 0, .1);--quml-option-card-bg:#fff;--quml-option-selected-checkmark:#ffff}.quml-mcq-option-card{position:relative;background-color:var(--quml-option-card-bg);padding:1rem;border-radius:.25rem;border:.0625rem solid var(--quml-btn-border);box-shadow:0 .125rem .75rem 0 var(--quml-color-primary-shade);display:flex;align-items:center;justify-content:space-between;height:100%;gap:.5rem}.quml-mcq-option-card .option-image{position:relative}.quml-mcq-option-card .option-image img{min-width:100%;vertical-align:bottom;width:100%!important}.quml-mcq-option-card .option{color:var(--quml-color-gray);font-size:.75rem;font-weight:700;flex:1}.quml-mcq-option-card label{margin-bottom:0}.zoom-in-icon{position:absolute;right:.5rem;bottom:0}::ng-deep .quml-mcq-option-card .option img{max-width:100%}::ng-deep .quml-mcq-option-card .option label{margin-bottom:0}.selected-option-text{color:var(--primary-color)!important}.icon-zommin{position:absolute;bottom:2px;right:-1px;content:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTlweCIgaGVpZ2h0PSIxOXB4IiB2aWV3Qm94PSIwIDAgMTkgMTkiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDYyICg5MTM5MCkgLSBodHRwczovL3NrZXRjaC5jb20gLS0+CiAgICA8dGl0bGU+em9vbTwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxnIGlkPSJkZXZzIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iem9vbSI+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik05LjUsMCBMMTgsMCBDMTguNTUyMjg0NywtMS4wMTQ1MzA2M2UtMTYgMTksMC40NDc3MTUyNSAxOSwxIEwxOSwxMyBDMTksMTYuMzEzNzA4NSAxNi4zMTM3MDg1LDE5IDEzLDE5IEwxLDE5IEMwLjQ0NzcxNTI1LDE5IDYuNzYzNTM3NTFlLTE3LDE4LjU1MjI4NDcgMCwxOCBMMCw5LjUgQy02LjQyNTM2MDY0ZS0xNiw0LjI1MzI5NDg4IDQuMjUzMjk0ODgsOS42MzgwNDA5NWUtMTYgOS41LDAgWiIgaWQ9IlJlY3RhbmdsZSIgZmlsbC1vcGFjaXR5PSIwLjUiIGZpbGw9IiM0MzQzNDMiIGZpbGwtcnVsZT0ibm9uemVybyI+PC9wYXRoPgogICAgICAgICAgICA8ZyBpZD0iR3JvdXAiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDUuMDAwMDAwLCA0LjAwMDAwMCkiIGZpbGw9IiNGRkZGRkYiPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTQuNTgzMzMzMzMsMC43NSBDNi45NzY2NjY2NywwLjc1IDguOTE2NjY2NjcsMi42OSA4LjkxNjY2NjY3LDUuMDgzMzMzMzMgQzguOTE2NjY2NjcsNi4xNTY2NjY2NyA4LjUyMzMzMzMzLDcuMTQzMzMzMzMgNy44Nyw3LjkwMzMzMzMzIEw3Ljg3LDcuOTAzMzMzMzMgTDguMDU2NjY2NjcsOC4wODMzMzMzMyBMOC41ODMzMzMzMyw4LjA4MzMzMzMzIEwxMS45MSwxMS40MTY2NjY3IEwxMC45MTY2NjY3LDEyLjQxIEw3LjU4MzMzMzMzLDkuMDgzMzMzMzMgTDcuNTgzMzMzMzMsOC41NTY2NjY2NyBMNy40MDMzMzMzMyw4LjM3IEM2LjY0MzMzMzMzLDkuMDIzMzMzMzMgNS42NTY2NjY2Nyw5LjQxNjY2NjY3IDQuNTgzMzMzMzMsOS40MTY2NjY2NyBDMi4xOSw5LjQxNjY2NjY3IDAuMjUsNy40NzY2NjY2NyAwLjI1LDUuMDgzMzMzMzMgQzAuMjUsMi42OSAyLjE5LDAuNzUgNC41ODMzMzMzMywwLjc1IFogTTQuNTgzMzMzMzMsMi4wODMzMzMzMyBDMi45MjMzMzMzMywyLjA4MzMzMzMzIDEuNTgzMzMzMzMsMy40MjMzMzMzMyAxLjU4MzMzMzMzLDUuMDgzMzMzMzMgQzEuNTgzMzMzMzMsNi43NDMzMzMzMyAyLjkyMzMzMzMzLDguMDgzMzMzMzMgNC41ODMzMzMzMyw4LjA4MzMzMzMzIEM2LjI0MzMzMzMzLDguMDgzMzMzMzMgNy41ODMzMzMzMyw2Ljc0MzMzMzMzIDcuNTgzMzMzMzMsNS4wODMzMzMzMyBDNy41ODMzMzMzMywzLjQyMzMzMzMzIDYuMjQzMzMzMzMsMi4wODMzMzMzMyA0LjU4MzMzMzMzLDIuMDgzMzMzMzMgWiBNNC45MTY2NjY2NywzLjQxNjY2NjY3IEw0LjkxNjY2NjY3LDQuNzUgTDYuMjUsNC43NSBMNi4yNSw1LjQxNjY2NjY3IEw0LjkxNjY2NjY3LDUuNDE2NjY2NjcgTDQuOTE2NjY2NjcsNi43NSBMNC4yNSw2Ljc1IEw0LjI1LDUuNDE2NjY2NjcgTDIuOTE2NjY2NjcsNS40MTY2NjY2NyBMMi45MTY2NjY2Nyw0Ljc1IEw0LjI1LDQuNzUgTDQuMjUsMy40MTY2NjY2NyBMNC45MTY2NjY2NywzLjQxNjY2NjY3IFoiIGlkPSJDb21iaW5lZC1TaGFwZSI+PC9wYXRoPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=)}.image-option-selected{border:.125rem solid var(--primary-color)}.checkmark{display:block;height:1.25rem;width:1.25rem;border-radius:50%;border:.125rem solid var(--quml-checkmark)}.container input{position:absolute;opacity:0;cursor:pointer}.container input:checked~.checkmark,.quml-option--selected .checkmark{position:relative;background-color:var(--quml-option-selected-checkmark);border:.125rem solid var(--primary-color)}.quml-option--selected .checkmark:after,input:checked~.checkmark:after{content:\"\";opacity:1}.container .checkmark:after,.quml-option--selected .container .checkmark:after{margin:0;width:.75rem;height:.75rem;border-radius:50%;background:var(--primary-color);position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);opacity:0}.quml-option--selected .container .checkmark:after{opacity:1}.quml-option--selected{border:.125rem solid var(--primary-color)}"]
            }] }
];
/** @nocollapse */
McqImageOptionComponent.ctorParameters = () => [];
McqImageOptionComponent.propDecorators = {
    mcqQuestion: [{ type: Input }],
    solutions: [{ type: Input }],
    mcqOption: [{ type: Input }],
    imgOptionSelected: [{ type: Output }]
};
if (false) {
    /** @type {?} */
    McqImageOptionComponent.prototype.showQumlPopup;
    /** @type {?} */
    McqImageOptionComponent.prototype.qumlPopupImage;
    /** @type {?} */
    McqImageOptionComponent.prototype.mcqQuestion;
    /** @type {?} */
    McqImageOptionComponent.prototype.solutions;
    /** @type {?} */
    McqImageOptionComponent.prototype.mcqOption;
    /** @type {?} */
    McqImageOptionComponent.prototype.imgOptionSelected;
}

/**
 * @fileoverview added by tsickle
 * Generated from: lib/icon/zoom-in/zoom-in.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class ZoomInComponent {
    constructor() {
    }
    /**
     * @return {?}
     */
    ngOnInit() {
    }
}
ZoomInComponent.decorators = [
    { type: Component, args: [{
                selector: 'quml-zoom-in',
                template: "<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n  width=\"12px\" height=\"12px\" viewBox=\"0 0 512 512\" style=\"enable-background:new 0 0 512 512;\" xml:space=\"preserve\">\n<g>\n\t<g>\n\t\t<path d=\"M506.141,477.851L361.689,333.399c65.814-80.075,61.336-198.944-13.451-273.73c-79.559-79.559-209.01-79.559-288.569,0\n\t\t\ts-79.559,209.01,0,288.569c74.766,74.766,193.62,79.293,273.73,13.451l144.452,144.452c7.812,7.812,20.477,7.812,28.289,0\n\t\t\tC513.953,498.328,513.953,485.663,506.141,477.851z M319.949,319.948c-63.96,63.96-168.03,63.959-231.99,0\n\t\t\tc-63.96-63.96-63.96-168.03,0-231.99c63.958-63.957,168.028-63.962,231.99,0C383.909,151.918,383.909,255.988,319.949,319.948z\"/>\n\t</g>\n</g>\n<g>\n\t<g>\n\t\t<path d=\"M301.897,183.949h-77.94v-77.94c0-11.048-8.956-20.004-20.004-20.004c-11.048,0-20.004,8.956-20.004,20.004v77.94h-77.94\n\t\t\tc-11.048,0-20.004,8.956-20.004,20.004c0,11.048,8.956,20.004,20.004,20.004h77.94v77.94c0,11.048,8.956,20.004,20.004,20.004\n\t\t\tc11.048,0,20.004-8.956,20.004-20.004v-77.94h77.94c11.048,0,20.004-8.956,20.004-20.004\n\t\t\tC321.901,192.905,312.945,183.949,301.897,183.949z\"/>\n\t</g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n</svg>\n",
                styles: [""]
            }] }
];
/** @nocollapse */
ZoomInComponent.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * Generated from: lib/icon/star/star.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class StarComponent {
    constructor() {
    }
    /**
     * @return {?}
     */
    ngOnInit() {
    }
}
StarComponent.decorators = [
    { type: Component, args: [{
                selector: 'quml-star',
                template: "<svg width=\"18px\" height=\"19px\" viewBox=\"0 0 20 19\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\"\n  xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n  <title>Star</title>\n  <defs>\n    <linearGradient x1=\"50%\" y1=\"0%\" x2=\"50%\" y2=\"100%\" id=\"linearGradient-1\">\n      <stop stop-color=\"#FFE500\" offset=\"0%\"></stop>\n      <stop stop-color=\"#E6B302\" offset=\"100%\"></stop>\n    </linearGradient>\n  </defs>\n  <g id=\"Symbols\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\">\n    <path\n      d=\"M9.52906513,1.05447851 C9.88447433,0.933955771 10.2858614,0.949017066 10.6489852,1.12822939 C10.9381809,1.27095597 11.1722611,1.50503624 11.3149877,1.79423187 L11.3149877,1.79423187 L12.3803318,3.95285472 C12.8901488,4.98585688 13.8756284,5.70184969 15.0156139,5.86749929 L15.0156139,5.86749929 L17.3977957,6.21365056 C17.7985266,6.27188017 18.1377182,6.4870255 18.3621696,6.78779616 C18.586621,7.08856682 18.6963323,7.47496281 18.6381027,7.87569375 C18.591728,8.19484007 18.4414393,8.48979843 18.2105028,8.71490584 L18.2105028,8.71490584 L16.4867399,10.3951594 C15.6618386,11.1992394 15.2854189,12.3577401 15.4801517,13.4931194 L15.4801517,13.4931194 L15.8870769,15.8656755 C15.9555299,16.2647872 15.8557305,16.6538611 15.6390399,16.9602703 C15.4223493,17.2666796 15.0887676,17.4904241 14.6896558,17.5588771 C14.3717991,17.6133938 14.0448352,17.5616079 13.7593821,17.4115363 L13.7593821,17.4115363 L11.6286939,16.2913672 C10.6090599,15.7553139 9.39094014,15.7553139 8.37130605,16.2913672 L8.37130605,16.2913672 L6.24061792,17.4115363 C5.88219327,17.5999712 5.48132228,17.6252868 5.12294871,17.5138875 C4.76457514,17.4024881 4.44869898,17.1543739 4.26026399,16.7959492 C4.11019239,16.5104961 4.0584064,16.1835322 4.1129231,15.8656755 L4.1129231,15.8656755 L4.51984832,13.4931194 C4.7145811,12.3577401 4.33816141,11.1992394 3.51326011,10.3951594 L3.51326011,10.3951594 L1.7894972,8.71490584 C1.49952557,8.43225335 1.35157308,8.05882533 1.34677662,7.68356752 C1.34198016,7.3083097 1.48033973,6.93122211 1.76299222,6.64125047 C1.98809962,6.41031402 2.28305798,6.26002523 2.6022043,6.21365056 L2.6022043,6.21365056 L4.98438605,5.86749929 C6.12437162,5.70184969 7.10985117,4.98585688 7.61966822,3.95285472 L7.61966822,3.95285472 L8.68501228,1.79423187 C8.86422461,1.43110804 9.17365593,1.17500126 9.52906513,1.05447851 Z\"\n      id=\"Star\" stroke=\"#EDBA01\" fill=\"url(#linearGradient-1)\"></path>\n  </g>\n</svg>",
                styles: [""]
            }] }
];
/** @nocollapse */
StarComponent.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * Generated from: lib/icon/previous/previous.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class PreviousComponent {
    constructor() {
    }
    /**
     * @return {?}
     */
    ngOnInit() {
    }
}
PreviousComponent.decorators = [
    { type: Component, args: [{
                selector: 'quml-previous',
                template: "<svg width=\"60px\" height=\"36px\" viewBox=\"0 0 60 36\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n    <title>Previous</title>\n    <defs>\n        <rect id=\"path-1\" x=\"0\" y=\"0\" width=\"60\" height=\"36\" rx=\"18\"></rect>\n        <filter x=\"-5.8%\" y=\"-9.7%\" width=\"111.7%\" height=\"119.4%\" filterUnits=\"objectBoundingBox\" id=\"filter-2\">\n            <feGaussianBlur stdDeviation=\"3\" in=\"SourceAlpha\" result=\"shadowBlurInner1\"></feGaussianBlur>\n            <feOffset dx=\"0\" dy=\"1\" in=\"shadowBlurInner1\" result=\"shadowOffsetInner1\"></feOffset>\n            <feComposite in=\"shadowOffsetInner1\" in2=\"SourceAlpha\" operator=\"arithmetic\" k2=\"-1\" k3=\"1\" result=\"shadowInnerInner1\"></feComposite>\n            <feColorMatrix values=\"0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.5 0\" type=\"matrix\" in=\"shadowInnerInner1\"></feColorMatrix>\n        </filter>\n        <rect id=\"path-3\" x=\"0\" y=\"0\" width=\"54\" height=\"30\" rx=\"15\"></rect>\n        <filter x=\"-2.8%\" y=\"-5.0%\" width=\"105.6%\" height=\"110.0%\" filterUnits=\"objectBoundingBox\" id=\"filter-4\">\n            <feGaussianBlur stdDeviation=\"0.5\" in=\"SourceGraphic\"></feGaussianBlur>\n        </filter>\n        <filter x=\"-5.6%\" y=\"-10.0%\" width=\"111.1%\" height=\"120.0%\" filterUnits=\"objectBoundingBox\" id=\"filter-5\">\n            <feGaussianBlur stdDeviation=\"1\" in=\"SourceAlpha\" result=\"shadowBlurInner1\"></feGaussianBlur>\n            <feOffset dx=\"0\" dy=\"-1\" in=\"shadowBlurInner1\" result=\"shadowOffsetInner1\"></feOffset>\n            <feComposite in=\"shadowOffsetInner1\" in2=\"SourceAlpha\" operator=\"arithmetic\" k2=\"-1\" k3=\"1\" result=\"shadowInnerInner1\"></feComposite>\n            <feColorMatrix values=\"0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.5 0\" type=\"matrix\" in=\"shadowInnerInner1\"></feColorMatrix>\n        </filter>\n    </defs>\n    <g id=\"button/previous2\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\">\n        <g id=\"Group\">\n            <g id=\"Group-Copy\">\n                <g id=\"Rectangle-5-Copy\" opacity=\"0.1\" fill-rule=\"nonzero\">\n                    <use fill=\"#CCCCCC\" xlink:href=\"#path-1\"></use>\n                    <use fill=\"black\" fill-opacity=\"1\" filter=\"url(#filter-2)\" xlink:href=\"#path-1\"></use>\n                </g>\n                <g id=\"Group-2\" transform=\"translate(3.000000, 3.000000)\">\n                    <g id=\"Rectangle-5-Copy-2\" fill-rule=\"nonzero\" filter=\"url(#filter-4)\">\n                        <use fill=\"#FFFFFF\" xlink:href=\"#path-3\"></use>\n                        <use fill=\"black\" fill-opacity=\"1\" filter=\"url(#filter-5)\" xlink:href=\"#path-3\"></use>\n                    </g>\n                    <polygon id=\"Shape\" fill=\"#6D7278\" points=\"31 10.41 29.59 9 23.59 15 29.59 21 31 19.59 26.42 15\"></polygon>\n                </g>\n            </g>\n            <g id=\"Icon-24px\" transform=\"translate(30.000000, 18.000000) scale(-1, 1) translate(-30.000000, -18.000000) translate(26.000000, 12.000000)\"></g>\n        </g>\n    </g>\n</svg>",
                styles: [""]
            }] }
];
/** @nocollapse */
PreviousComponent.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * Generated from: lib/icon/next/next.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class NextComponent {
    constructor() {
    }
    /**
     * @return {?}
     */
    ngOnInit() {
    }
}
NextComponent.decorators = [
    { type: Component, args: [{
                selector: 'quml-next',
                template: "<svg width=\"60px\" height=\"36px\" viewBox=\"0 0 60 36\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n    <title>Next</title>\n    <defs>\n        <rect id=\"path-1\" x=\"0\" y=\"0\" width=\"60\" height=\"36\" rx=\"18\"></rect>\n        <filter x=\"-5.8%\" y=\"-9.7%\" width=\"111.7%\" height=\"119.4%\" filterUnits=\"objectBoundingBox\" id=\"filter-2\">\n            <feGaussianBlur stdDeviation=\"3\" in=\"SourceAlpha\" result=\"shadowBlurInner1\"></feGaussianBlur>\n            <feOffset dx=\"0\" dy=\"1\" in=\"shadowBlurInner1\" result=\"shadowOffsetInner1\"></feOffset>\n            <feComposite in=\"shadowOffsetInner1\" in2=\"SourceAlpha\" operator=\"arithmetic\" k2=\"-1\" k3=\"1\" result=\"shadowInnerInner1\"></feComposite>\n            <feColorMatrix values=\"0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.5 0\" type=\"matrix\" in=\"shadowInnerInner1\"></feColorMatrix>\n        </filter>\n        <rect id=\"path-3\" x=\"0\" y=\"0\" width=\"54\" height=\"30\" rx=\"15\"></rect>\n        <filter x=\"-2.8%\" y=\"-5.0%\" width=\"105.6%\" height=\"110.0%\" filterUnits=\"objectBoundingBox\" id=\"filter-4\">\n            <feGaussianBlur stdDeviation=\"0.5\" in=\"SourceGraphic\"></feGaussianBlur>\n        </filter>\n        <filter x=\"-5.6%\" y=\"-10.0%\" width=\"111.1%\" height=\"120.0%\" filterUnits=\"objectBoundingBox\" id=\"filter-5\">\n            <feGaussianBlur stdDeviation=\"1\" in=\"SourceAlpha\" result=\"shadowBlurInner1\"></feGaussianBlur>\n            <feOffset dx=\"0\" dy=\"-1\" in=\"shadowBlurInner1\" result=\"shadowOffsetInner1\"></feOffset>\n            <feComposite in=\"shadowOffsetInner1\" in2=\"SourceAlpha\" operator=\"arithmetic\" k2=\"-1\" k3=\"1\" result=\"shadowInnerInner1\"></feComposite>\n            <feColorMatrix values=\"0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.5 0\" type=\"matrix\" in=\"shadowInnerInner1\"></feColorMatrix>\n        </filter>\n    </defs>\n    <g id=\"button/next2\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\">\n        <g id=\"Group\">\n            <g id=\"Group-Copy\">\n                <g id=\"Rectangle-5-Copy\" opacity=\"0.1\" fill-rule=\"nonzero\">\n                    <use fill=\"#CCCCCC\" xlink:href=\"#path-1\"></use>\n                    <use fill=\"black\" fill-opacity=\"1\" filter=\"url(#filter-2)\" xlink:href=\"#path-1\"></use>\n                </g>\n                <g id=\"Group-2\" transform=\"translate(3.000000, 3.000000)\">\n                    <g id=\"Rectangle-5-Copy-2\" fill-rule=\"nonzero\" filter=\"url(#filter-4)\">\n                        <use fill=\"#FFFFFF\" xlink:href=\"#path-3\"></use>\n                        <use fill=\"black\" fill-opacity=\"1\" filter=\"url(#filter-5)\" xlink:href=\"#path-3\"></use>\n                    </g>\n                    <polygon id=\"Shape\" fill=\"#6D7278\" transform=\"translate(27.295000, 15.000000) scale(-1, 1) translate(-27.295000, -15.000000) \" points=\"31 10.41 29.59 9 23.59 15 29.59 21 31 19.59 26.42 15\"></polygon>\n                </g>\n            </g>\n            <g id=\"Icon-24px\" transform=\"translate(30.000000, 18.000000) scale(-1, 1) translate(-30.000000, -18.000000) translate(26.000000, 12.000000)\"></g>\n        </g>\n    </g>\n</svg>",
                styles: [""]
            }] }
];
/** @nocollapse */
NextComponent.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * Generated from: lib/icon/bookmark/bookmark.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class BookmarkComponent {
    constructor() {
    }
    /**
     * @return {?}
     */
    ngOnInit() {
    }
}
BookmarkComponent.decorators = [
    { type: Component, args: [{
                selector: 'quml-bookmark',
                template: "<svg width=\"14px\" height=\"18px\" viewBox=\"0 0 14 18\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n    <title>bookmark</title>\n    <g id=\"Symbols\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\">\n        <path d=\"M12,0 L2,0 C0.9,0 0.01,0.9 0.01,2 L0,18 L7,15 L14,18 L14,2 C14,0.9 13.1,0 12,0 L12,0 Z M12,15 L7,12.82 L2,15 L2,2 L12,2 L12,15 L12,15 Z\" id=\"bookmark\" fill=\"#6D7278\"></path>\n    </g>\n</svg>",
                styles: [""]
            }] }
];
/** @nocollapse */
BookmarkComponent.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * Generated from: lib/icon/hint/hint.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class HintComponent {
    constructor() {
    }
    /**
     * @return {?}
     */
    ngOnInit() {
    }
}
HintComponent.decorators = [
    { type: Component, args: [{
                selector: 'quml-hint',
                template: "<svg width=\"14px\" height=\"20px\" viewBox=\"0 0 14 20\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n    <title>hint</title>\n    <g id=\"Symbols\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\">\n        <path d=\"M4,19 C4,19.55 4.45,20 5,20 L9,20 C9.55,20 10,19.55 10,19 L10,18 L4,18 L4,19 L4,19 Z M7,0 C3.14,0 0,3.14 0,7 C0,9.38 1.19,11.47 3,12.74 L3,15 C3,15.55 3.45,16 4,16 L10,16 C10.55,16 11,15.55 11,15 L11,12.74 C12.81,11.47 14,9.38 14,7 C14,3.14 10.86,0 7,0 L7,0 Z M9.85,11.1 L9,11.7 L9,14 L5,14 L5,11.7 L4.15,11.1 C2.8,10.16 2,8.63 2,7 C2,4.24 4.24,2 7,2 C9.76,2 12,4.24 12,7 C12,8.63 11.2,10.16 9.85,11.1 L9.85,11.1 Z\" id=\"hint\" fill=\"#6D7278\"></path>\n    </g>\n</svg>",
                styles: [""]
            }] }
];
/** @nocollapse */
HintComponent.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * Generated from: lib/icon/ans/ans.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class AnsComponent {
    constructor() {
    }
    /**
     * @return {?}
     */
    ngOnInit() {
    }
}
AnsComponent.decorators = [
    { type: Component, args: [{
                selector: 'quml-ans',
                template: "<svg width=\"25px\" height=\"25px\" viewBox=\"0 0 25 25\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n    <title>ans</title>\n    <g id=\"Symbols\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\">\n        <g id=\"ans\">\n            <circle id=\"Oval\" stroke=\"#979797\" cx=\"12.0235\" cy=\"12.0235\" r=\"11.5235\"></circle>\n            <path d=\"M5.9515,14.5235 L6.3675,13.1635 L8.4475,13.1635 L8.8635,14.5235 L10.1675,14.5235 L8.1435,8.7875 L6.6635,8.7875 L4.6475,14.5235 L5.9515,14.5235 Z M8.1595,12.1475 L6.6715,12.1475 L7.0795,10.8195 C7.10083333,10.7608333 7.1315,10.6608333 7.1715,10.5195 C7.2115,10.3781667 7.25416667,10.2288333 7.2995,10.0715 C7.34483333,9.91416667 7.38083333,9.78216667 7.4075,9.6755 C7.43416667,9.78216667 7.46883333,9.9075 7.5115,10.0515 C7.55416667,10.1955 7.59683333,10.3368333 7.6395,10.4755 C7.68216667,10.6141667 7.71683333,10.7288333 7.7435,10.8195 L7.7435,10.8195 L8.1595,12.1475 Z M11.9835,14.5235 L11.9835,12.4675 C11.9835,12.0035 12.0501667,11.6475 12.1835,11.3995 C12.3168333,11.1515 12.5648333,11.0275 12.9275,11.0275 C13.1728333,11.0275 13.3515,11.1061667 13.4635,11.2635 C13.5755,11.4208333 13.6315,11.6568333 13.6315,11.9715 L13.6315,11.9715 L13.6315,14.5235 L14.8235,14.5235 L14.8235,11.6755 C14.8235,11.1155 14.6821667,10.7088333 14.3995,10.4555 C14.1168333,10.2021667 13.7408333,10.0755 13.2715,10.0755 C12.9995,10.0755 12.7421667,10.1261667 12.4995,10.2275 C12.2568333,10.3288333 12.0661667,10.4915 11.9275,10.7155 L11.9275,10.7155 L11.8635,10.7155 L11.7035,10.1555 L10.7915,10.1555 L10.7915,14.5235 L11.9835,14.5235 Z M17.2315,14.6035 C17.8501667,14.6035 18.3155,14.4848333 18.6275,14.2475 C18.9395,14.0101667 19.0955,13.6701667 19.0955,13.2275 C19.0955,12.9715 19.0461667,12.7608333 18.9475,12.5955 C18.8488333,12.4301667 18.7088333,12.2928333 18.5275,12.1835 C18.3461667,12.0741667 18.1301667,11.9688333 17.8795,11.8675 C17.6235,11.7608333 17.4301667,11.6755 17.2995,11.6115 C17.1688333,11.5475 17.0808333,11.4875 17.0355,11.4315 C16.9901667,11.3755 16.9675,11.3128333 16.9675,11.2435 C16.9675,11.0515 17.1435,10.9555 17.4955,10.9555 C17.6928333,10.9555 17.8875,10.9861667 18.0795,11.0475 C18.2715,11.1088333 18.4741667,11.1848333 18.6875,11.2755 L18.6875,11.2755 L19.0475,10.4195 C18.7861667,10.2968333 18.5328333,10.2088333 18.2875,10.1555 C18.0421667,10.1021667 17.7835,10.0755 17.5115,10.0755 C16.9888333,10.0755 16.5701667,10.1768333 16.2555,10.3795 C15.9408333,10.5821667 15.7835,10.8861667 15.7835,11.2915 C15.7835,11.5368333 15.8261667,11.7408333 15.9115,11.9035 C15.9968333,12.0661667 16.1261667,12.2048333 16.2995,12.3195 C16.4728333,12.4341667 16.6981667,12.5501667 16.9755,12.6675 C17.2581667,12.7848333 17.4661667,12.8808333 17.5995,12.9555 C17.7328333,13.0301667 17.8195,13.0968333 17.8595,13.1555 C17.8995,13.2141667 17.9195,13.2808333 17.9195,13.3555 C17.9195,13.4675 17.8688333,13.5581667 17.7675,13.6275 C17.6661667,13.6968333 17.5008333,13.7315 17.2715,13.7315 C17.0635,13.7315 16.8235,13.6968333 16.5515,13.6275 C16.2795,13.5581667 16.0261667,13.4701667 15.7915,13.3635 L15.7915,13.3635 L15.7915,14.3475 C16.0101667,14.4381667 16.2288333,14.5035 16.4475,14.5435 C16.6661667,14.5835 16.9275,14.6035 17.2315,14.6035 Z\" id=\"Ans\" fill=\"#6D7278\" fill-rule=\"nonzero\"></path>\n        </g>\n    </g>\n</svg>",
                styles: [""]
            }] }
];
/** @nocollapse */
AnsComponent.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * Generated from: lib/icon/share/share.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class ShareComponent {
    constructor() {
    }
    /**
     * @return {?}
     */
    ngOnInit() {
    }
}
ShareComponent.decorators = [
    { type: Component, args: [{
                selector: 'quml-share',
                template: "<svg width=\"17px\" height=\"18px\" viewBox=\"0 0 17 18\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n    <title>share</title>\n    <g id=\"Symbols\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\">\n        <path d=\"M13.4613333,12.8088889 C12.7857778,12.8088889 12.1813333,13.0755556 11.7191111,13.4933333 L5.38133333,9.80444444 C5.42577778,9.6 5.46133333,9.39555556 5.46133333,9.18222222 C5.46133333,8.96888889 5.42577778,8.76444444 5.38133333,8.56 L11.648,4.90666667 C12.128,5.35111111 12.7591111,5.62666667 13.4613333,5.62666667 C14.9368889,5.62666667 16.128,4.43555556 16.128,2.96 C16.128,1.48444444 14.9368889,0.293333333 13.4613333,0.293333333 C11.9857778,0.293333333 10.7946667,1.48444444 10.7946667,2.96 C10.7946667,3.17333333 10.8302222,3.37777778 10.8746667,3.58222222 L4.608,7.23555556 C4.128,6.79111111 3.49688889,6.51555556 2.79466667,6.51555556 C1.31911111,6.51555556 0.128,7.70666667 0.128,9.18222222 C0.128,10.6577778 1.31911111,11.8488889 2.79466667,11.8488889 C3.49688889,11.8488889 4.128,11.5733333 4.608,11.1288889 L10.9368889,14.8266667 C10.8924444,15.0133333 10.8657778,15.2088889 10.8657778,15.4044444 C10.8657778,16.8355556 12.0302222,18 13.4613333,18 C14.8924444,18 16.0568889,16.8355556 16.0568889,15.4044444 C16.0568889,13.9733333 14.8924444,12.8088889 13.4613333,12.8088889 L13.4613333,12.8088889 Z\" id=\"share\" fill=\"#6D7278\"></path>\n    </g>\n</svg>",
                styles: [""]
            }] }
];
/** @nocollapse */
ShareComponent.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * Generated from: lib/icon/correct/correct.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class CorrectComponent {
    constructor() {
    }
    /**
     * @return {?}
     */
    ngOnInit() {
    }
}
CorrectComponent.decorators = [
    { type: Component, args: [{
                selector: 'quml-correct',
                template: "<svg width=\"48px\" height=\"48px\" viewBox=\"0 0 21 20\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\"\n  xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n  <title>correct option</title>\n  <g id=\"Symbols\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\">\n    <path\n      d=\"M10.5,0 C4.98,0 0.5,4.48 0.5,10 C0.5,15.52 4.98,20 10.5,20 C16.02,20 20.5,15.52 20.5,10 C20.5,4.48 16.02,0 10.5,0 L10.5,0 Z M8.5,15 L3.5,10 L4.91,8.59 L8.5,12.17 L16.09,4.58 L17.5,6 L8.5,15 L8.5,15 Z\"\n      id=\"correct-option\" fill=\"#31A679\"></path>\n  </g>\n</svg>",
                styles: [""]
            }] }
];
/** @nocollapse */
CorrectComponent.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * Generated from: lib/scoreboard/scoreboard.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class ScoreboardComponent {
    constructor() {
        this.submitClicked = new EventEmitter();
        this.emitQuestionNo = new EventEmitter();
        this.scoreBoardLoaded = new EventEmitter();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.scoreBoardLoaded.emit({
            scoreBoardLoaded: true
        });
        this.subscription = fromEvent(document, 'keydown').subscribe((/**
         * @param {?} e
         * @return {?}
         */
        (e) => {
            if (e['key'] === 'Enter') {
                e.stopPropagation();
                ((/** @type {?} */ (document.activeElement))).click();
            }
        }));
    }
    /**
     * @param {?} index
     * @param {?=} identifier
     * @return {?}
     */
    goToQuestion(index, identifier) {
        this.emitQuestionNo.emit({ questionNo: index, identifier });
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
ScoreboardComponent.decorators = [
    { type: Component, args: [{
                selector: 'quml-scoreboard',
                template: "<div class=\"scoreboard\">\n  <div class=\"scoreboard__header\">\n    <div class=\"scoreboard__title\">\n      {{'submit_message' | translate}}\n    </div>\n    <!-- <div class=\"scoreboard__subtitle\">\n      {{contentName}}\n    </div> -->\n  </div>\n\n  <div class=\"scoreboard__points\" *ngIf=\"!isSections && showFeedBack\">\n    <div *ngFor=\"let score of scores; let i = index\" class=\"scoreboard__index\" (click)=\"goToQuestion(i+1)\" tabindex=\"0\" attr.aria-label=\"question number {{score.index}}\"\n      [ngClass]=\"score.class\">\n      {{score.index}}\n    </div>\n  </div>\n\n  <div class=\"scoreboard__points\" *ngIf=\"!isSections && !showFeedBack\">\n    <div *ngFor=\"let score of scores; let i = index\" class=\"scoreboard__index\" (click)=\"goToQuestion(i+1)\" tabindex=\"0\" attr.aria-label=\"question number {{score.index}}\"\n      [ngClass]=\"score.class === 'skipped' ? score.class : score.class === 'unattempted' ? score.class : 'attempted'\">\n      {{score.index}}\n    </div>\n  </div>\n\n  <div class=\"sections-score-card\" *ngIf=\"isSections\">\n    <div *ngFor=\"let section of scores\">\n      <div class=\"sections-score-card__title\">{{section?.index}}</div>\n      <div class=\"sections-score-card__points\" *ngIf=\"showFeedBack\">\n        <div *ngFor=\"let score of section?.children; let i = index\" class=\"scoreboard__index\" tabindex=\"0\" attr.aria-label=\"question number {{score.index}}\"\n          (click)=\"goToQuestion(i+1, section.identifier)\" [ngClass]=\"score.class\">\n          {{score.index}}\n        </div>\n      </div>\n      <div class=\"sections-score-card__points\" *ngIf=\"!showFeedBack\">\n        <div *ngFor=\"let score of section?.children; let i = index\" class=\"scoreboard__index\" tabindex=\"0\" attr.aria-label=\"question number {{score.index}}\"\n          (click)=\"goToQuestion(i+1, section.identifier)\" [ngClass]=\"score.class\">\n          {{score.index}}\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <div class=\"scoreboard__btn-container\">\n    <button type=\"submit\" class=\"sb-btn action-button sb-btn-normal sb-btn-radius px-20 mx-20\" *ngIf=\"!isDurationExpired\"\n      (click)=\"submitClicked.emit({type:'back-clicked'})\">{{'back' | translate}}</button>\n    <button type=\"submit\" class=\"sb-btn action-button sb-btn-normal sb-btn-radius px-20\"\n      (click)=\"submitClicked.emit({type:'submit-clicked'})\">{{'submit' | translate}}</button>\n  </div>\n</div>\n",
                styles: ["::ng-deep :root{--quml-scoreboard-sub-title:#6D7278;--quml-scoreboard-skipped:#969696;--quml-scoreboard-unattempted:#575757;--quml-color-success:#08BC82;--quml-color-danger:#F1635D;--quml-color-primary-contrast:#333}.scoreboard{display:flex;flex-direction:column;align-items:center;justify-content:center;width:100%;position:absolute;top:3.5rem;height:calc(100% - 56px);left:0;right:0}@media (max-width:767px){.scoreboard{top:0;height:calc(100% - 0px)}}.scoreboard__header{font-weight:700;text-align:center;line-height:normal}.scoreboard__title{color:var(--primary-color);font-size:1.25rem}.scoreboard__subtitle{color:var(--quml-scoreboard-sub-title);font-size:.875rem;margin-top:.5rem}.scoreboard__points{display:flex;flex-wrap:wrap;margin:1rem auto 0;width:100%;max-height:calc(100vh - 12rem);align-items:center;overflow-y:auto;justify-content:center}.scoreboard__index{font-size:.625rem;font-weight:500;border-radius:50%;width:1.5rem;height:1.5rem;display:flex;align-items:center;justify-content:center;margin:1rem 2rem;cursor:pointer}.scoreboard__index.skipped{color:var(--white);background:var(--quml-scoreboard-skipped);border:.0625rem solid var(--quml-scoreboard-skipped)}.scoreboard__index.correct,.scoreboard__index.partial,.scoreboard__index.wrong{color:var(--white);border:0 solid transparent}.scoreboard__index.correct{--correct-bg:var(--quml-color-success);background:var(--correct-bg)}.scoreboard__index.wrong{--wrong-bg:var( --quml-color-danger);background:var(--wrong-bg)}.scoreboard__index.partial{--partial-bg:linear-gradient(180deg, rgba(71,164,128,1) 0%, rgba(71,164,128,1) 50%, rgba(249,122,116,1) 50%, rgba(249,122,116,1) 100%);background:var(--partial-bg)}.scoreboard__index.unattempted{color:var(--quml-scoreboard-unattempted);border:.03125rem solid var(--quml-scoreboard-unattempted)}.scoreboard__index.unattempted:hover{border:.0625rem solid var(--primary-color);color:var(--primary-color)}.sections-score-card{width:100%;max-height:calc(100% - 20rem);overflow-y:auto;display:none}@media (max-width:767px){.sections-score-card{max-height:calc(100% - 8.125rem)}}.sections-score-card__title{width:100%;color:var(--quml-color-primary-contrast);font-size:.875rem;font-weight:700;text-align:center;margin-top:2rem;margin-bottom:.5rem}.sections-score-card__points{display:flex;flex-wrap:wrap;margin:1rem auto 0;width:100%;max-height:100%;align-items:center;overflow-y:auto;justify-content:center}.sections-score-card .action-button{background-color:#e5e5e5}"]
            }] }
];
/** @nocollapse */
ScoreboardComponent.ctorParameters = () => [];
ScoreboardComponent.propDecorators = {
    scores: [{ type: Input }],
    totalNoOfQuestions: [{ type: Input }],
    contentName: [{ type: Input }],
    showFeedBack: [{ type: Input }],
    isSections: [{ type: Input }],
    isDurationExpired: [{ type: Input }],
    submitClicked: [{ type: Output }],
    emitQuestionNo: [{ type: Output }],
    scoreBoardLoaded: [{ type: Output }]
};
if (false) {
    /** @type {?} */
    ScoreboardComponent.prototype.scores;
    /** @type {?} */
    ScoreboardComponent.prototype.totalNoOfQuestions;
    /** @type {?} */
    ScoreboardComponent.prototype.contentName;
    /** @type {?} */
    ScoreboardComponent.prototype.showFeedBack;
    /** @type {?} */
    ScoreboardComponent.prototype.isSections;
    /** @type {?} */
    ScoreboardComponent.prototype.isDurationExpired;
    /** @type {?} */
    ScoreboardComponent.prototype.submitClicked;
    /** @type {?} */
    ScoreboardComponent.prototype.emitQuestionNo;
    /** @type {?} */
    ScoreboardComponent.prototype.scoreBoardLoaded;
    /** @type {?} */
    ScoreboardComponent.prototype.subscription;
}

/**
 * @fileoverview added by tsickle
 * Generated from: lib/startpage/startpage.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class StartpageComponent {
    /**
     * @return {?}
     */
    ngOnInit() {
        /** @type {?} */
        const durationInSec = this.time / 1000;
        this.minutes = Math.floor(this.time / 60);
        this.seconds = this.time - this.minutes * 60 < 10 ? `0${this.time - this.minutes * 60}` : this.time - this.minutes * 60;
    }
}
StartpageComponent.decorators = [
    { type: Component, args: [{
                selector: 'quml-startpage',
                template: "<div class=\"startpage\" tabindex=\"0\">\n  <div class=\"startpage__header\" [attr.aria-label]=\"'question set title '+contentName\">\n    {{contentName}}\n  </div>\n  <div class=\"startpage__content\">\n    <div class=\"startpage__metadata\">\n      <div class=\"startpage__md-heading\">Questions</div>\n      <div class=\"startpage__md-scores\">\n        <quml-content class=\"startpage__md-icon\"></quml-content>\n        <span class=\"startpage__md-desc\">{{totalNoOfQuestions}}</span>\n      </div>\n    </div>\n    <div class=\"startpage__metadata\" *ngIf=\"showTimer && time > 0\">\n      <div class=\"startpage__md-heading\">Minutes</div>\n      <div class=\"startpage__md-scores\">\n        <quml-timer class=\"startpage__md-icon\"></quml-timer>\n        <span class=\"startpage__md-desc\">{{minutes}}:{{seconds}}</span>\n      </div>\n    </div>\n    <div class=\"startpage__metadata\" *ngIf=\"points\">\n      <div class=\"startpage__md-heading\">Points</div>\n      <div class=\"startpage__md-scores\">\n        <quml-startpagestaricon class=\"startpage__md-icon\">i</quml-startpagestaricon>\n        <span class=\"startpage__md-desc\">{{points}}</span>\n      </div>\n    </div>\n  </div>\n  <ng-container *ngIf=\"instructions\">\n    <div class=\"startpage__instruction\">\n      <div class=\"startpage__instr-title\">Instructions</div>\n      <div [innerHTML]=\"instructions | safeHtml\" class=\"startpage__instr-desc\"></div>\n    </div>\n  </ng-container>\n</div>",
                styles: ["::ng-deep :root{--quml-scoreboard-sub-title:#6D7278;--quml-color-primary-contrast:#333;--quml-zoom-btn-txt:#eee;--quml-zoom-btn-hover:#f2f2f2}.startpage__header{color:var(--primary-color);font-size:1.125rem;font-weight:700;margin:1rem 0;line-height:normal}.startpage__content{display:flex;border-bottom:.0625rem solid var(--quml-zoom-btn-txt);align-items:center;line-height:normal;margin-bottom:1rem;padding-bottom:1.5rem}.startpage__metadata{margin:0 4rem .5rem 0}.startpage__md-heading{color:var(--quml-scoreboard-sub-title);font-size:.75rem;line-height:normal;margin-bottom:.5rem}.startpage__md-icon,.startpage__md-scores{display:flex;align-items:center}.startpage__md-desc{color:var(--primary-color);font-size:1.125rem;font-weight:700;margin-left:.5rem}.startpage__instr-title{color:var(--quml-scoreboard-sub-title);font-size:.75rem;font-weight:700;letter-spacing:0;line-height:18px}.startpage__instr-desc{padding:1rem 0;color:var(--quml-color-primary-contrast);font-size:.75rem;letter-spacing:0;line-height:17px}::ng-deep .startpage__instr-desc ul{list-style-type:disc}::ng-deep .startpage__instr-desc li{margin-bottom:.5rem;margin-left:.5rem}::ng-deep .startpage__instr-desc table{width:100%}::ng-deep .startpage__instr-desc td,::ng-deep .startpage__instr-desc th{border:.0625rem solid #ddd;padding:.5rem}::ng-deep .startpage__instr-desc tr:nth-child(even){background-color:var(--quml-zoom-btn-hover)}@media only screen and (max-width:480px){.startpage__header{margin-top:4rem}}", "::ng-deep :root{--quml-mcq-title-txt:#131415}::ng-deep .quml-mcq .mcq-title,::ng-deep .quml-sa .mcq-title,::ng-deep .startpage__instr-desc .mcq-title,::ng-deep quml-mcq-solutions .mcq-title,::ng-deep quml-sa .mcq-title{color:var(--quml-mcq-title-txt)}::ng-deep .quml-mcq .fs-10,::ng-deep .quml-mcq .fs-11,::ng-deep .quml-mcq .fs-12,::ng-deep .quml-mcq .fs-13,::ng-deep .quml-mcq .fs-14,::ng-deep .quml-mcq .fs-15,::ng-deep .quml-mcq .fs-16,::ng-deep .quml-mcq .fs-17,::ng-deep .quml-mcq .fs-18,::ng-deep .quml-mcq .fs-19,::ng-deep .quml-mcq .fs-20,::ng-deep .quml-mcq .fs-21,::ng-deep .quml-mcq .fs-22,::ng-deep .quml-mcq .fs-23,::ng-deep .quml-mcq .fs-24,::ng-deep .quml-mcq .fs-25,::ng-deep .quml-mcq .fs-26,::ng-deep .quml-mcq .fs-27,::ng-deep .quml-mcq .fs-28,::ng-deep .quml-mcq .fs-29,::ng-deep .quml-mcq .fs-30,::ng-deep .quml-mcq .fs-36,::ng-deep .quml-mcq .fs-8,::ng-deep .quml-mcq .fs-9,::ng-deep .quml-sa .fs-10,::ng-deep .quml-sa .fs-11,::ng-deep .quml-sa .fs-12,::ng-deep .quml-sa .fs-13,::ng-deep .quml-sa .fs-14,::ng-deep .quml-sa .fs-15,::ng-deep .quml-sa .fs-16,::ng-deep .quml-sa .fs-17,::ng-deep .quml-sa .fs-18,::ng-deep .quml-sa .fs-19,::ng-deep .quml-sa .fs-20,::ng-deep .quml-sa .fs-21,::ng-deep .quml-sa .fs-22,::ng-deep .quml-sa .fs-23,::ng-deep .quml-sa .fs-24,::ng-deep .quml-sa .fs-25,::ng-deep .quml-sa .fs-26,::ng-deep .quml-sa .fs-27,::ng-deep .quml-sa .fs-28,::ng-deep .quml-sa .fs-29,::ng-deep .quml-sa .fs-30,::ng-deep .quml-sa .fs-36,::ng-deep .quml-sa .fs-8,::ng-deep .quml-sa .fs-9,::ng-deep .startpage__instr-desc .fs-10,::ng-deep .startpage__instr-desc .fs-11,::ng-deep .startpage__instr-desc .fs-12,::ng-deep .startpage__instr-desc .fs-13,::ng-deep .startpage__instr-desc .fs-14,::ng-deep .startpage__instr-desc .fs-15,::ng-deep .startpage__instr-desc .fs-16,::ng-deep .startpage__instr-desc .fs-17,::ng-deep .startpage__instr-desc .fs-18,::ng-deep .startpage__instr-desc .fs-19,::ng-deep .startpage__instr-desc .fs-20,::ng-deep .startpage__instr-desc .fs-21,::ng-deep .startpage__instr-desc .fs-22,::ng-deep .startpage__instr-desc .fs-23,::ng-deep .startpage__instr-desc .fs-24,::ng-deep .startpage__instr-desc .fs-25,::ng-deep .startpage__instr-desc .fs-26,::ng-deep .startpage__instr-desc .fs-27,::ng-deep .startpage__instr-desc .fs-28,::ng-deep .startpage__instr-desc .fs-29,::ng-deep .startpage__instr-desc .fs-30,::ng-deep .startpage__instr-desc .fs-36,::ng-deep .startpage__instr-desc .fs-8,::ng-deep .startpage__instr-desc .fs-9,::ng-deep quml-mcq-solutions .fs-10,::ng-deep quml-mcq-solutions .fs-11,::ng-deep quml-mcq-solutions .fs-12,::ng-deep quml-mcq-solutions .fs-13,::ng-deep quml-mcq-solutions .fs-14,::ng-deep quml-mcq-solutions .fs-15,::ng-deep quml-mcq-solutions .fs-16,::ng-deep quml-mcq-solutions .fs-17,::ng-deep quml-mcq-solutions .fs-18,::ng-deep quml-mcq-solutions .fs-19,::ng-deep quml-mcq-solutions .fs-20,::ng-deep quml-mcq-solutions .fs-21,::ng-deep quml-mcq-solutions .fs-22,::ng-deep quml-mcq-solutions .fs-23,::ng-deep quml-mcq-solutions .fs-24,::ng-deep quml-mcq-solutions .fs-25,::ng-deep quml-mcq-solutions .fs-26,::ng-deep quml-mcq-solutions .fs-27,::ng-deep quml-mcq-solutions .fs-28,::ng-deep quml-mcq-solutions .fs-29,::ng-deep quml-mcq-solutions .fs-30,::ng-deep quml-mcq-solutions .fs-36,::ng-deep quml-mcq-solutions .fs-8,::ng-deep quml-mcq-solutions .fs-9,::ng-deep quml-sa .fs-10,::ng-deep quml-sa .fs-11,::ng-deep quml-sa .fs-12,::ng-deep quml-sa .fs-13,::ng-deep quml-sa .fs-14,::ng-deep quml-sa .fs-15,::ng-deep quml-sa .fs-16,::ng-deep quml-sa .fs-17,::ng-deep quml-sa .fs-18,::ng-deep quml-sa .fs-19,::ng-deep quml-sa .fs-20,::ng-deep quml-sa .fs-21,::ng-deep quml-sa .fs-22,::ng-deep quml-sa .fs-23,::ng-deep quml-sa .fs-24,::ng-deep quml-sa .fs-25,::ng-deep quml-sa .fs-26,::ng-deep quml-sa .fs-27,::ng-deep quml-sa .fs-28,::ng-deep quml-sa .fs-29,::ng-deep quml-sa .fs-30,::ng-deep quml-sa .fs-36,::ng-deep quml-sa .fs-8,::ng-deep quml-sa .fs-9{line-height:normal}::ng-deep .quml-mcq .fs-8,::ng-deep .quml-sa .fs-8,::ng-deep .startpage__instr-desc .fs-8,::ng-deep quml-mcq-solutions .fs-8,::ng-deep quml-sa .fs-8{font-size:.5rem}::ng-deep .quml-mcq .fs-9,::ng-deep .quml-sa .fs-9,::ng-deep .startpage__instr-desc .fs-9,::ng-deep quml-mcq-solutions .fs-9,::ng-deep quml-sa .fs-9{font-size:.563rem}::ng-deep .quml-mcq .fs-10,::ng-deep .quml-sa .fs-10,::ng-deep .startpage__instr-desc .fs-10,::ng-deep quml-mcq-solutions .fs-10,::ng-deep quml-sa .fs-10{font-size:.625rem}::ng-deep .quml-mcq .fs-11,::ng-deep .quml-sa .fs-11,::ng-deep .startpage__instr-desc .fs-11,::ng-deep quml-mcq-solutions .fs-11,::ng-deep quml-sa .fs-11{font-size:.688rem}::ng-deep .quml-mcq .fs-12,::ng-deep .quml-sa .fs-12,::ng-deep .startpage__instr-desc .fs-12,::ng-deep quml-mcq-solutions .fs-12,::ng-deep quml-sa .fs-12{font-size:.75rem}::ng-deep .quml-mcq .fs-13,::ng-deep .quml-sa .fs-13,::ng-deep .startpage__instr-desc .fs-13,::ng-deep quml-mcq-solutions .fs-13,::ng-deep quml-sa .fs-13{font-size:.813rem}::ng-deep .quml-mcq .fs-14,::ng-deep .quml-sa .fs-14,::ng-deep .startpage__instr-desc .fs-14,::ng-deep quml-mcq-solutions .fs-14,::ng-deep quml-sa .fs-14{font-size:.875rem}::ng-deep .quml-mcq .fs-15,::ng-deep .quml-sa .fs-15,::ng-deep .startpage__instr-desc .fs-15,::ng-deep quml-mcq-solutions .fs-15,::ng-deep quml-sa .fs-15{font-size:.938rem}::ng-deep .quml-mcq .fs-16,::ng-deep .quml-sa .fs-16,::ng-deep .startpage__instr-desc .fs-16,::ng-deep quml-mcq-solutions .fs-16,::ng-deep quml-sa .fs-16{font-size:1rem}::ng-deep .quml-mcq .fs-17,::ng-deep .quml-sa .fs-17,::ng-deep .startpage__instr-desc .fs-17,::ng-deep quml-mcq-solutions .fs-17,::ng-deep quml-sa .fs-17{font-size:1.063rem}::ng-deep .quml-mcq .fs-18,::ng-deep .quml-sa .fs-18,::ng-deep .startpage__instr-desc .fs-18,::ng-deep quml-mcq-solutions .fs-18,::ng-deep quml-sa .fs-18{font-size:1.125rem}::ng-deep .quml-mcq .fs-19,::ng-deep .quml-sa .fs-19,::ng-deep .startpage__instr-desc .fs-19,::ng-deep quml-mcq-solutions .fs-19,::ng-deep quml-sa .fs-19{font-size:1.188rem}::ng-deep .quml-mcq .fs-20,::ng-deep .quml-sa .fs-20,::ng-deep .startpage__instr-desc .fs-20,::ng-deep quml-mcq-solutions .fs-20,::ng-deep quml-sa .fs-20{font-size:1.25rem}::ng-deep .quml-mcq .fs-21,::ng-deep .quml-sa .fs-21,::ng-deep .startpage__instr-desc .fs-21,::ng-deep quml-mcq-solutions .fs-21,::ng-deep quml-sa .fs-21{font-size:1.313rem}::ng-deep .quml-mcq .fs-22,::ng-deep .quml-sa .fs-22,::ng-deep .startpage__instr-desc .fs-22,::ng-deep quml-mcq-solutions .fs-22,::ng-deep quml-sa .fs-22{font-size:1.375rem}::ng-deep .quml-mcq .fs-23,::ng-deep .quml-sa .fs-23,::ng-deep .startpage__instr-desc .fs-23,::ng-deep quml-mcq-solutions .fs-23,::ng-deep quml-sa .fs-23{font-size:1.438rem}::ng-deep .quml-mcq .fs-24,::ng-deep .quml-sa .fs-24,::ng-deep .startpage__instr-desc .fs-24,::ng-deep quml-mcq-solutions .fs-24,::ng-deep quml-sa .fs-24{font-size:1.5rem}::ng-deep .quml-mcq .fs-25,::ng-deep .quml-sa .fs-25,::ng-deep .startpage__instr-desc .fs-25,::ng-deep quml-mcq-solutions .fs-25,::ng-deep quml-sa .fs-25{font-size:1.563rem}::ng-deep .quml-mcq .fs-26,::ng-deep .quml-sa .fs-26,::ng-deep .startpage__instr-desc .fs-26,::ng-deep quml-mcq-solutions .fs-26,::ng-deep quml-sa .fs-26{font-size:1.625rem}::ng-deep .quml-mcq .fs-27,::ng-deep .quml-sa .fs-27,::ng-deep .startpage__instr-desc .fs-27,::ng-deep quml-mcq-solutions .fs-27,::ng-deep quml-sa .fs-27{font-size:1.688rem}::ng-deep .quml-mcq .fs-28,::ng-deep .quml-sa .fs-28,::ng-deep .startpage__instr-desc .fs-28,::ng-deep quml-mcq-solutions .fs-28,::ng-deep quml-sa .fs-28{font-size:1.75rem}::ng-deep .quml-mcq .fs-29,::ng-deep .quml-sa .fs-29,::ng-deep .startpage__instr-desc .fs-29,::ng-deep quml-mcq-solutions .fs-29,::ng-deep quml-sa .fs-29{font-size:1.813rem}::ng-deep .quml-mcq .fs-30,::ng-deep .quml-sa .fs-30,::ng-deep .startpage__instr-desc .fs-30,::ng-deep quml-mcq-solutions .fs-30,::ng-deep quml-sa .fs-30{font-size:1.875rem}::ng-deep .quml-mcq .fs-36,::ng-deep .quml-sa .fs-36,::ng-deep .startpage__instr-desc .fs-36,::ng-deep quml-mcq-solutions .fs-36,::ng-deep quml-sa .fs-36{font-size:2.25rem}::ng-deep .quml-mcq .text-left,::ng-deep .quml-sa .text-left,::ng-deep .startpage__instr-desc .text-left,::ng-deep quml-mcq-solutions .text-left,::ng-deep quml-sa .text-left{text-align:left}::ng-deep .quml-mcq .text-center,::ng-deep .quml-sa .text-center,::ng-deep .startpage__instr-desc .text-center,::ng-deep quml-mcq-solutions .text-center,::ng-deep quml-sa .text-center{text-align:center}::ng-deep .quml-mcq .text-right,::ng-deep .quml-sa .text-right,::ng-deep .startpage__instr-desc .text-right,::ng-deep quml-mcq-solutions .text-right,::ng-deep quml-sa .text-right{text-align:right}::ng-deep .quml-mcq .image-style-align-right,::ng-deep .quml-sa .image-style-align-right,::ng-deep .startpage__instr-desc .image-style-align-right,::ng-deep quml-mcq-solutions .image-style-align-right,::ng-deep quml-sa .image-style-align-right{float:right;text-align:right;margin-left:.5rem}::ng-deep .quml-mcq .image-style-align-left,::ng-deep .quml-sa .image-style-align-left,::ng-deep .startpage__instr-desc .image-style-align-left,::ng-deep quml-mcq-solutions .image-style-align-left,::ng-deep quml-sa .image-style-align-left{float:left;text-align:left;margin-right:.5rem}::ng-deep .quml-mcq .image,::ng-deep .quml-mcq figure.image,::ng-deep .quml-sa .image,::ng-deep .quml-sa figure.image,::ng-deep .startpage__instr-desc .image,::ng-deep .startpage__instr-desc figure.image,::ng-deep quml-mcq-solutions .image,::ng-deep quml-mcq-solutions figure.image,::ng-deep quml-sa .image,::ng-deep quml-sa figure.image{display:table;clear:both;text-align:center;margin:.5rem auto;position:relative}::ng-deep .quml-mcq figure.image,::ng-deep .quml-mcq figure.image.resize-original,::ng-deep .quml-sa figure.image,::ng-deep .quml-sa figure.image.resize-original,::ng-deep .startpage__instr-desc figure.image,::ng-deep .startpage__instr-desc figure.image.resize-original,::ng-deep quml-mcq-solutions figure.image,::ng-deep quml-mcq-solutions figure.image.resize-original,::ng-deep quml-sa figure.image,::ng-deep quml-sa figure.image.resize-original{width:auto;height:auto;overflow:visible}::ng-deep .quml-mcq figure.image img,::ng-deep .quml-sa figure.image img,::ng-deep .startpage__instr-desc figure.image img,::ng-deep quml-mcq-solutions figure.image img,::ng-deep quml-sa figure.image img{width:100%}::ng-deep .quml-mcq figure.image.resize-original img,::ng-deep .quml-sa figure.image.resize-original img,::ng-deep .startpage__instr-desc figure.image.resize-original img,::ng-deep quml-mcq-solutions figure.image.resize-original img,::ng-deep quml-sa figure.image.resize-original img{width:auto;height:auto}::ng-deep .quml-mcq .image img,::ng-deep .quml-sa .image img,::ng-deep .startpage__instr-desc .image img,::ng-deep quml-mcq-solutions .image img,::ng-deep quml-sa .image img{display:block;margin:0 auto;max-width:100%;min-width:50px}::ng-deep .quml-mcq figure.image.resize-25,::ng-deep .quml-sa figure.image.resize-25,::ng-deep .startpage__instr-desc figure.image.resize-25,::ng-deep quml-mcq-solutions figure.image.resize-25,::ng-deep quml-sa figure.image.resize-25{width:25%;height:auto}::ng-deep .quml-mcq figure.image.resize-50,::ng-deep .quml-sa figure.image.resize-50,::ng-deep .startpage__instr-desc figure.image.resize-50,::ng-deep quml-mcq-solutions figure.image.resize-50,::ng-deep quml-sa figure.image.resize-50{width:50%;height:auto}::ng-deep .quml-mcq figure.image.resize-75,::ng-deep .quml-sa figure.image.resize-75,::ng-deep .startpage__instr-desc figure.image.resize-75,::ng-deep quml-mcq-solutions figure.image.resize-75,::ng-deep quml-sa figure.image.resize-75{width:75%;height:auto}::ng-deep .quml-mcq figure.image.resize-100,::ng-deep .quml-sa figure.image.resize-100,::ng-deep .startpage__instr-desc figure.image.resize-100,::ng-deep quml-mcq-solutions figure.image.resize-100,::ng-deep quml-sa figure.image.resize-100{width:100%;height:auto}::ng-deep .quml-mcq .solution-options figure.image,::ng-deep .quml-sa .solution-options figure.image,::ng-deep .startpage__instr-desc .solution-options figure.image,::ng-deep quml-mcq-solutions .solution-options figure.image,::ng-deep quml-sa .solution-options figure.image{width:7.5rem!important;height:7.5rem!important}::ng-deep .quml-mcq figure.table table,::ng-deep .quml-sa figure.table table,::ng-deep .startpage__instr-desc figure.table table,::ng-deep quml-mcq-solutions figure.table table,::ng-deep quml-sa figure.table table{border-right:.0625rem solid var(--gray-100)}::ng-deep .quml-mcq figure.table table,::ng-deep .quml-mcq figure.table table tr td,::ng-deep .quml-mcq figure.table table tr th,::ng-deep .quml-sa figure.table table,::ng-deep .quml-sa figure.table table tr td,::ng-deep .quml-sa figure.table table tr th,::ng-deep .startpage__instr-desc figure.table table,::ng-deep .startpage__instr-desc figure.table table tr td,::ng-deep .startpage__instr-desc figure.table table tr th,::ng-deep quml-mcq-solutions figure.table table,::ng-deep quml-mcq-solutions figure.table table tr td,::ng-deep quml-mcq-solutions figure.table table tr th,::ng-deep quml-sa figure.table table,::ng-deep quml-sa figure.table table tr td,::ng-deep quml-sa figure.table table tr th{border:.0625rem solid var(--black);border-collapse:collapse}::ng-deep .quml-mcq figure.table table,::ng-deep .quml-sa figure.table table,::ng-deep .startpage__instr-desc figure.table table,::ng-deep quml-mcq-solutions figure.table table,::ng-deep quml-sa figure.table table{width:100%;background:var(--white);border:.0625rem solid var(--gray-100);box-shadow:none;border-radius:.25rem .25rem 0 0;text-align:left;color:var(--gray);border-collapse:separate;border-spacing:0;table-layout:fixed}::ng-deep .quml-mcq figure.table table thead tr th,::ng-deep .quml-sa figure.table table thead tr th,::ng-deep .startpage__instr-desc figure.table table thead tr th,::ng-deep quml-mcq-solutions figure.table table thead tr th,::ng-deep quml-sa figure.table table thead tr th{border-right:.0625rem solid var(--gray-100);font-size:.875rem;padding:1rem;background-color:var(--primary-100);color:var(--gray);position:relative;height:2.5rem;border:0;border-bottom:.0625rem solid var(--gray-100);border-right:.0625rem solid var(--gray-100);font-weight:700;color:var(--primary-color);text-transform:uppercase}::ng-deep .quml-mcq figure.table table thead tr th:first-child,::ng-deep .quml-sa figure.table table thead tr th:first-child,::ng-deep .startpage__instr-desc figure.table table thead tr th:first-child,::ng-deep quml-mcq-solutions figure.table table thead tr th:first-child,::ng-deep quml-sa figure.table table thead tr th:first-child{border-top-left-radius:.25rem}::ng-deep .quml-mcq figure.table table thead tr th:last-child,::ng-deep .quml-sa figure.table table thead tr th:last-child,::ng-deep .startpage__instr-desc figure.table table thead tr th:last-child,::ng-deep quml-mcq-solutions figure.table table thead tr th:last-child,::ng-deep quml-sa figure.table table thead tr th:last-child{border-top-right-radius:.25rem;border-right:0 solid var(--gray-100)}::ng-deep .quml-mcq figure.table table tbody tr:nth-child(2n),::ng-deep .quml-sa figure.table table tbody tr:nth-child(2n),::ng-deep .startpage__instr-desc figure.table table tbody tr:nth-child(2n),::ng-deep quml-mcq-solutions figure.table table tbody tr:nth-child(2n),::ng-deep quml-sa figure.table table tbody tr:nth-child(2n){background-color:var(--gray-0)}::ng-deep .quml-mcq figure.table table tbody tr:hover,::ng-deep .quml-sa figure.table table tbody tr:hover,::ng-deep .startpage__instr-desc figure.table table tbody tr:hover,::ng-deep quml-mcq-solutions figure.table table tbody tr:hover,::ng-deep quml-sa figure.table table tbody tr:hover{background:var(--primary-0);color:rgba(var(--rc-rgba-gray),.95);cursor:pointer}::ng-deep .quml-mcq figure.table table tbody tr td,::ng-deep .quml-sa figure.table table tbody tr td,::ng-deep .startpage__instr-desc figure.table table tbody tr td,::ng-deep quml-mcq-solutions figure.table table tbody tr td,::ng-deep quml-sa figure.table table tbody tr td{font-size:.875rem;padding:1rem;color:var(--gray);height:3.5rem;border:0;border-bottom:.0625rem solid var(--gray-100);border-right:.0625rem solid var(--gray-100);word-break:break-word;line-height:normal}::ng-deep .quml-mcq figure.table table tbody tr td:last-child,::ng-deep .quml-sa figure.table table tbody tr td:last-child,::ng-deep .startpage__instr-desc figure.table table tbody tr td:last-child,::ng-deep quml-mcq-solutions figure.table table tbody tr td:last-child,::ng-deep quml-sa figure.table table tbody tr td:last-child{border-right:0 solid var(--gray-100)}::ng-deep .quml-mcq figure.table table tbody tr td p,::ng-deep .quml-sa figure.table table tbody tr td p,::ng-deep .startpage__instr-desc figure.table table tbody tr td p,::ng-deep quml-mcq-solutions figure.table table tbody tr td p,::ng-deep quml-sa figure.table table tbody tr td p{margin-bottom:0!important}::ng-deep .quml-mcq figure.table table tbody tr:last-child td,::ng-deep .quml-sa figure.table table tbody tr:last-child td,::ng-deep .startpage__instr-desc figure.table table tbody tr:last-child td,::ng-deep quml-mcq-solutions figure.table table tbody tr:last-child td,::ng-deep quml-sa figure.table table tbody tr:last-child td{border-bottom:none}::ng-deep .quml-mcq figure.table table tbody tr:last-child td:first-child,::ng-deep .quml-sa figure.table table tbody tr:last-child td:first-child,::ng-deep .startpage__instr-desc figure.table table tbody tr:last-child td:first-child,::ng-deep quml-mcq-solutions figure.table table tbody tr:last-child td:first-child,::ng-deep quml-sa figure.table table tbody tr:last-child td:first-child{border-bottom-left-radius:.25rem}::ng-deep .quml-mcq figure.table table tbody tr:last-child td:last-child,::ng-deep .quml-sa figure.table table tbody tr:last-child td:last-child,::ng-deep .startpage__instr-desc figure.table table tbody tr:last-child td:last-child,::ng-deep quml-mcq-solutions figure.table table tbody tr:last-child td:last-child,::ng-deep quml-sa figure.table table tbody tr:last-child td:last-child{border-bottom-right-radius:.25rem}::ng-deep .quml-mcq ol,::ng-deep .quml-mcq ul,::ng-deep .quml-sa ol,::ng-deep .quml-sa ul,::ng-deep .startpage__instr-desc ol,::ng-deep .startpage__instr-desc ul,::ng-deep quml-mcq-solutions ol,::ng-deep quml-mcq-solutions ul,::ng-deep quml-sa ol,::ng-deep quml-sa ul{margin-top:.5rem}::ng-deep .quml-mcq ol li,::ng-deep .quml-mcq ul li,::ng-deep .quml-sa ol li,::ng-deep .quml-sa ul li,::ng-deep .startpage__instr-desc ol li,::ng-deep .startpage__instr-desc ul li,::ng-deep quml-mcq-solutions ol li,::ng-deep quml-mcq-solutions ul li,::ng-deep quml-sa ol li,::ng-deep quml-sa ul li{margin:.5rem;font-weight:400;line-height:normal}::ng-deep .quml-mcq ul,::ng-deep .quml-sa ul,::ng-deep .startpage__instr-desc ul,::ng-deep quml-mcq-solutions ul,::ng-deep quml-sa ul{list-style-type:disc}::ng-deep .quml-mcq h1,::ng-deep .quml-mcq h2,::ng-deep .quml-mcq h3,::ng-deep .quml-mcq h4,::ng-deep .quml-mcq h5,::ng-deep .quml-mcq h6,::ng-deep .quml-sa h1,::ng-deep .quml-sa h2,::ng-deep .quml-sa h3,::ng-deep .quml-sa h4,::ng-deep .quml-sa h5,::ng-deep .quml-sa h6,::ng-deep .startpage__instr-desc h1,::ng-deep .startpage__instr-desc h2,::ng-deep .startpage__instr-desc h3,::ng-deep .startpage__instr-desc h4,::ng-deep .startpage__instr-desc h5,::ng-deep .startpage__instr-desc h6,::ng-deep quml-mcq-solutions h1,::ng-deep quml-mcq-solutions h2,::ng-deep quml-mcq-solutions h3,::ng-deep quml-mcq-solutions h4,::ng-deep quml-mcq-solutions h5,::ng-deep quml-mcq-solutions h6,::ng-deep quml-sa h1,::ng-deep quml-sa h2,::ng-deep quml-sa h3,::ng-deep quml-sa h4,::ng-deep quml-sa h5,::ng-deep quml-sa h6{color:var(--primary-color);line-height:normal;margin-bottom:1rem}::ng-deep .quml-mcq p,::ng-deep .quml-mcq span,::ng-deep .quml-sa p,::ng-deep .quml-sa span,::ng-deep .startpage__instr-desc p,::ng-deep .startpage__instr-desc span,::ng-deep quml-mcq-solutions p,::ng-deep quml-mcq-solutions span,::ng-deep quml-sa p,::ng-deep quml-sa span{color:var(--quml-mcq-title-txt)}::ng-deep .quml-mcq p span strong,::ng-deep .quml-mcq p strong,::ng-deep .quml-sa p span strong,::ng-deep .quml-sa p strong,::ng-deep .startpage__instr-desc p span strong,::ng-deep .startpage__instr-desc p strong,::ng-deep quml-mcq-solutions p span strong,::ng-deep quml-mcq-solutions p strong,::ng-deep quml-sa p span strong,::ng-deep quml-sa p strong{font-weight:700}::ng-deep .quml-mcq p span u,::ng-deep .quml-mcq p u,::ng-deep .quml-sa p span u,::ng-deep .quml-sa p u,::ng-deep .startpage__instr-desc p span u,::ng-deep .startpage__instr-desc p u,::ng-deep quml-mcq-solutions p span u,::ng-deep quml-mcq-solutions p u,::ng-deep quml-sa p span u,::ng-deep quml-sa p u{text-decoration:underline}::ng-deep .quml-mcq p i,::ng-deep .quml-mcq p span i,::ng-deep .quml-sa p i,::ng-deep .quml-sa p span i,::ng-deep .startpage__instr-desc p i,::ng-deep .startpage__instr-desc p span i,::ng-deep quml-mcq-solutions p i,::ng-deep quml-mcq-solutions p span i,::ng-deep quml-sa p i,::ng-deep quml-sa p span i{font-style:italic}::ng-deep .quml-mcq p,::ng-deep .quml-sa p,::ng-deep .startpage__instr-desc p,::ng-deep quml-mcq-solutions p,::ng-deep quml-sa p{line-height:normal}"]
            }] }
];
StartpageComponent.propDecorators = {
    instructions: [{ type: Input }],
    totalNoOfQuestions: [{ type: Input }],
    points: [{ type: Input }],
    time: [{ type: Input }],
    contentName: [{ type: Input }],
    showTimer: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    StartpageComponent.prototype.instructions;
    /** @type {?} */
    StartpageComponent.prototype.totalNoOfQuestions;
    /** @type {?} */
    StartpageComponent.prototype.points;
    /** @type {?} */
    StartpageComponent.prototype.time;
    /** @type {?} */
    StartpageComponent.prototype.contentName;
    /** @type {?} */
    StartpageComponent.prototype.showTimer;
    /** @type {?} */
    StartpageComponent.prototype.minutes;
    /** @type {?} */
    StartpageComponent.prototype.seconds;
}

/**
 * @fileoverview added by tsickle
 * Generated from: lib/icon/timer/timer.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class TimerComponent {
    constructor() {
    }
    /**
     * @return {?}
     */
    ngOnInit() {
    }
}
TimerComponent.decorators = [
    { type: Component, args: [{
                selector: 'quml-timer',
                template: "<svg width=\"18px\" height=\"19px\" viewBox=\"0 0 18 19\" version=\"1.1\" tabindex=\"-1\" aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n  <title>ic_timer</title>\n  <defs>\n      <linearGradient x1=\"13.2653061%\" y1=\"0%\" x2=\"87.9981222%\" y2=\"100%\" id=\"linearGradient-1\">\n          <stop stop-color=\"#F1635D\" offset=\"0%\"></stop>\n          <stop stop-color=\"#F97A74\" offset=\"100%\"></stop>\n      </linearGradient>\n  </defs>\n  <g id=\"Content-player\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\">\n      <g id=\"player-intro-page\" transform=\"translate(-446.000000, -159.000000)\">\n          <g id=\"Icon-24px\" transform=\"translate(446.000000, 159.495625)\">\n              <polygon id=\"Shape\" points=\"0 0 18 0 18 18 0 18\"></polygon>\n              <path d=\"M11.25,0.75 L6.75,0.75 L6.75,2.25 L11.25,2.25 L11.25,0.75 L11.25,0.75 Z M8.25,10.5 L9.75,10.5 L9.75,6 L8.25,6 L8.25,10.5 L8.25,10.5 Z M14.2725,5.5425 L15.3375,4.4775 C15.015,4.095 14.6625,3.735 14.28,3.42 L13.215,4.485 C12.0525,3.555 10.59,3 9,3 C5.2725,3 2.25,6.0225 2.25,9.75 C2.25,13.4775 5.265,16.5 9,16.5 C12.735,16.5 15.75,13.4775 15.75,9.75 C15.75,8.16 15.195,6.6975 14.2725,5.5425 L14.2725,5.5425 Z M9,15 C6.0975,15 3.75,12.6525 3.75,9.75 C3.75,6.8475 6.0975,4.5 9,4.5 C11.9025,4.5 14.25,6.8475 14.25,9.75 C14.25,12.6525 11.9025,15 9,15 L9,15 Z\" id=\"Shape\" fill=\"#f8756f\"></path>\n          </g>\n      </g>\n  </g>\n</svg>",
                styles: [""]
            }] }
];
/** @nocollapse */
TimerComponent.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * Generated from: lib/icon/content/content.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class ContentComponent {
    constructor() {
    }
    /**
     * @return {?}
     */
    ngOnInit() {
    }
}
ContentComponent.decorators = [
    { type: Component, args: [{
                selector: 'quml-content',
                template: "<svg width=\"18px\" height=\"19px\" viewBox=\"0 0 18 19\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" tabindex=\"-1\" aria-hidden=\"true\">\n    <title>ic_content_paste</title>\n    <defs>\n        <linearGradient x1=\"16.5289256%\" y1=\"0%\" x2=\"84.622256%\" y2=\"100%\" id=\"linearGradient-1\">\n            <stop stop-color=\"#F1635D\" offset=\"0%\"></stop>\n            <stop stop-color=\"#F97A74\" offset=\"100%\"></stop>\n        </linearGradient>\n    </defs>\n    <g id=\"Content-player\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\">\n        <g id=\"player-intro-page\" transform=\"translate(-447.000000, -95.000000)\">\n            <g id=\"Icon-24px\" transform=\"translate(447.000000, 95.495625)\" >\n                <polygon id=\"Shape\" points=\"0 0 18 0 18 18 0 18\"></polygon>\n                <path d=\"M14.25,1.5 L11.115,1.5 C10.8,0.63 9.975,0 9,0 C8.025,0 7.2,0.63 6.885,1.5 L3.75,1.5 C2.925,1.5 2.25,2.175 2.25,3 L2.25,15 C2.25,15.825 2.925,16.5 3.75,16.5 L14.25,16.5 C15.075,16.5 15.75,15.825 15.75,15 L15.75,3 C15.75,2.175 15.075,1.5 14.25,1.5 L14.25,1.5 Z M9,1.5 C9.4125,1.5 9.75,1.8375 9.75,2.25 C9.75,2.6625 9.4125,3 9,3 C8.5875,3 8.25,2.6625 8.25,2.25 C8.25,1.8375 8.5875,1.5 9,1.5 L9,1.5 Z M14.25,15 L3.75,15 L3.75,3 L5.25,3 L5.25,5.25 L12.75,5.25 L12.75,3 L14.25,3 L14.25,15 L14.25,15 Z\" id=\"Shape\" fill=\"#f8756f\"></path>\n            </g>\n        </g>\n    </g>\n</svg>",
                styles: [""]
            }] }
];
/** @nocollapse */
ContentComponent.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * Generated from: lib/icon/startpagestaricon/startpagestaricon.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class StartpagestariconComponent {
    constructor() {
    }
    /**
     * @return {?}
     */
    ngOnInit() {
    }
}
StartpagestariconComponent.decorators = [
    { type: Component, args: [{
                selector: 'quml-startpagestaricon',
                template: "<svg width=\"14px\" height=\"13px\" viewBox=\"0 0 14 13\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n    <title>Star</title>\n    <defs>\n        <linearGradient x1=\"0%\" y1=\"0%\" x2=\"101.719666%\" y2=\"100%\" id=\"linearGradient-1\">\n            <stop stop-color=\"#F1635D\" offset=\"0%\"></stop>\n            <stop stop-color=\"#F97A74\" offset=\"100%\"></stop>\n        </linearGradient>\n    </defs>\n    <g id=\"Content-player\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\">\n        <g id=\"player-intro-page\" transform=\"translate(-448.000000, -226.000000)\" fill=\"#f8756f\">\n            <path d=\"M454.069318,237.484914 L452.648859,238.231693 C452.008011,238.568607 451.215379,238.322219 450.878466,237.681372 C450.744305,237.426183 450.698009,237.133884 450.746746,236.849727 L451.018029,235.268023 C451.129305,234.619235 450.914208,233.957235 450.442836,233.49776 L449.293661,232.377591 C448.775204,231.872221 448.764596,231.042245 449.269966,230.523788 C449.471207,230.317336 449.734894,230.182981 450.020203,230.141523 L451.608325,229.910756 C452.259745,229.816099 452.822876,229.40696 453.1142,228.816673 L453.824429,227.377591 C454.144853,226.728342 454.930929,226.461776 455.580179,226.782199 C455.838713,226.909794 456.047976,227.119057 456.175571,227.377591 L456.8858,228.816673 C457.177124,229.40696 457.740255,229.816099 458.391675,229.910756 L459.979797,230.141523 C460.696286,230.245635 461.192716,230.910864 461.088604,231.627354 C461.047146,231.912664 460.912791,232.17635 460.706339,232.377591 L459.557164,233.49776 C459.085792,233.957235 458.870695,234.619235 458.981971,235.268023 L459.253254,236.849727 C459.375645,237.563322 458.89638,238.241022 458.182786,238.363413 C457.898629,238.412149 457.60633,238.365854 457.351141,238.231693 L455.930682,237.484914 C455.348034,237.178598 454.651966,237.178598 454.069318,237.484914 Z\" id=\"Star\"></path>\n        </g>\n    </g>\n</svg>",
                styles: [""]
            }] }
];
/** @nocollapse */
StartpagestariconComponent.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * Generated from: lib/icon/previous-active/previous-active.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class PreviousActiveComponent {
    constructor() {
    }
    /**
     * @return {?}
     */
    ngOnInit() {
    }
}
PreviousActiveComponent.decorators = [
    { type: Component, args: [{
                selector: 'quml-previous-active',
                template: "<svg width=\"60px\" height=\"36px\" viewBox=\"0 0 60 36\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n    <title>Previous</title>\n    <defs>\n        <rect id=\"path-1\" x=\"0\" y=\"0\" width=\"56\" height=\"32\" rx=\"16\"></rect>\n        <filter x=\"-2.7%\" y=\"-4.7%\" width=\"105.4%\" height=\"109.4%\" filterUnits=\"objectBoundingBox\" id=\"filter-2\">\n            <feGaussianBlur stdDeviation=\"0.5\" in=\"SourceGraphic\"></feGaussianBlur>\n        </filter>\n        <filter x=\"-5.4%\" y=\"-9.4%\" width=\"110.7%\" height=\"118.8%\" filterUnits=\"objectBoundingBox\" id=\"filter-3\">\n            <feGaussianBlur stdDeviation=\"1\" in=\"SourceAlpha\" result=\"shadowBlurInner1\"></feGaussianBlur>\n            <feOffset dx=\"0\" dy=\"-1\" in=\"shadowBlurInner1\" result=\"shadowOffsetInner1\"></feOffset>\n            <feComposite in=\"shadowOffsetInner1\" in2=\"SourceAlpha\" operator=\"arithmetic\" k2=\"-1\" k3=\"1\" result=\"shadowInnerInner1\"></feComposite>\n            <feColorMatrix values=\"0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.5 0\" type=\"matrix\" in=\"shadowInnerInner1\"></feColorMatrix>\n        </filter>\n    </defs>\n    <g id=\"Symbols\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\">\n        <g id=\"Group\" transform=\"translate(30.000000, 18.000000) scale(-1, 1) translate(-30.000000, -18.000000) translate(2.000000, 2.000000)\">\n            <g id=\"Group-2\">\n                <g id=\"Rectangle-5-Copy-2\" fill-rule=\"nonzero\" filter=\"url(#filter-2)\">\n                    <use fill=\"#FFFFFF\" xlink:href=\"#path-1\"></use>\n                    <use fill=\"black\" fill-opacity=\"1\" filter=\"url(#filter-3)\" xlink:href=\"#path-1\"></use>\n                </g>\n                <polygon id=\"Shape\" fill=\"#6D7278\" transform=\"translate(28.000000, 16.000000) scale(-1, 1) translate(-28.000000, -16.000000) \" points=\"31.705 11.41 30.295 10 24.295 16 30.295 22 31.705 20.59 27.125 16\"></polygon>\n            </g>\n            <g id=\"Icon-24px\" transform=\"translate(27.000000, 15.000000) scale(-1, 1) translate(-27.000000, -15.000000) translate(23.000000, 9.000000)\"></g>\n        </g>\n    </g>\n</svg>",
                styles: [""]
            }] }
];
/** @nocollapse */
PreviousActiveComponent.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * Generated from: lib/icon/next-active/next-active.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class NextActiveComponent {
    constructor() {
    }
    /**
     * @return {?}
     */
    ngOnInit() {
    }
}
NextActiveComponent.decorators = [
    { type: Component, args: [{
                selector: 'quml-next-active',
                template: "<!-- <svg width=\"60px\" height=\"36px\" viewBox=\"0 0 60 36\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\"\n    xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n    <title>button/next2</title>\n    <defs>\n        <rect id=\"path-1\" x=\"0\" y=\"0\" width=\"60\" height=\"36\" rx=\"18\"></rect>\n        <filter x=\"-5.8%\" y=\"-9.7%\" width=\"111.7%\" height=\"119.4%\" filterUnits=\"objectBoundingBox\" id=\"filter-2\">\n            <feGaussianBlur stdDeviation=\"3\" in=\"SourceAlpha\" result=\"shadowBlurInner1\"></feGaussianBlur>\n            <feOffset dx=\"0\" dy=\"1\" in=\"shadowBlurInner1\" result=\"shadowOffsetInner1\"></feOffset>\n            <feComposite in=\"shadowOffsetInner1\" in2=\"SourceAlpha\" operator=\"arithmetic\" k2=\"-1\" k3=\"1\"\n                result=\"shadowInnerInner1\"></feComposite>\n            <feColorMatrix values=\"0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.5 0\" type=\"matrix\" in=\"shadowInnerInner1\">\n            </feColorMatrix>\n        </filter>\n        <rect id=\"path-3\" x=\"0\" y=\"0\" width=\"54\" height=\"30\" rx=\"15\"></rect>\n        <filter x=\"-2.8%\" y=\"-5.0%\" width=\"105.6%\" height=\"110.0%\" filterUnits=\"objectBoundingBox\" id=\"filter-4\">\n            <feGaussianBlur stdDeviation=\"0.5\" in=\"SourceGraphic\"></feGaussianBlur>\n        </filter>\n        <filter x=\"-5.6%\" y=\"-10.0%\" width=\"111.1%\" height=\"120.0%\" filterUnits=\"objectBoundingBox\" id=\"filter-5\">\n            <feGaussianBlur stdDeviation=\"1\" in=\"SourceAlpha\" result=\"shadowBlurInner1\"></feGaussianBlur>\n            <feOffset dx=\"0\" dy=\"-1\" in=\"shadowBlurInner1\" result=\"shadowOffsetInner1\"></feOffset>\n            <feComposite in=\"shadowOffsetInner1\" in2=\"SourceAlpha\" operator=\"arithmetic\" k2=\"-1\" k3=\"1\"\n                result=\"shadowInnerInner1\"></feComposite>\n            <feColorMatrix values=\"0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.5 0\" type=\"matrix\" in=\"shadowInnerInner1\">\n            </feColorMatrix>\n        </filter>\n    </defs>\n    <g id=\"button/next2\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\">\n        <g id=\"Group\">\n            <g id=\"Group-Copy\">\n                <g id=\"Rectangle-5-Copy\" opacity=\"0.1\" fill-rule=\"nonzero\">\n                    <use fill=\"#CCCCCC\" xlink:href=\"#path-1\"></use>\n                    <use fill=\"black\" fill-opacity=\"1\" filter=\"url(#filter-2)\" xlink:href=\"#path-1\"></use>\n                </g>\n                <g id=\"Group-2\" transform=\"translate(3.000000, 3.000000)\">\n                    <g id=\"Rectangle-5-Copy-2\" fill-rule=\"nonzero\" filter=\"url(#filter-4)\">\n                        <use fill=\"#024f9d\" xlink:href=\"#path-3\"></use>\n                        <use fill=\"black\" fill-opacity=\"1\" filter=\"url(#filter-5)\" xlink:href=\"#path-3\"></use>\n                    </g>\n                    <polygon id=\"Shape\" fill=\"#FFFFFF\"\n                        transform=\"translate(27.295000, 15.000000) scale(-1, 1) translate(-27.295000, -15.000000) \"\n                        points=\"31 10.41 29.59 9 23.59 15 29.59 21 31 19.59 26.42 15\"></polygon>\n                </g>\n            </g>\n            <g id=\"Icon-24px\"\n                transform=\"translate(30.000000, 18.000000) scale(-1, 1) translate(-30.000000, -18.000000) translate(26.000000, 12.000000)\">\n            </g>\n        </g>\n    </g>\n</svg> -->\n<!-- New button -->\n <svg width=\"60px\" height=\"36px\" viewBox=\"0 0 60 36\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\"\n    xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n    <title>Next</title>\n    <defs>\n        <rect id=\"path-1\" x=\"0\" y=\"0\" width=\"60\" height=\"36\" rx=\"18\"></rect>\n        <filter x=\"-5.8%\" y=\"-9.7%\" width=\"111.7%\" height=\"119.4%\" filterUnits=\"objectBoundingBox\" id=\"filter-2\">\n            <feGaussianBlur stdDeviation=\"3\" in=\"SourceAlpha\" result=\"shadowBlurInner1\"></feGaussianBlur>\n            <feOffset dx=\"0\" dy=\"1\" in=\"shadowBlurInner1\" result=\"shadowOffsetInner1\"></feOffset>\n            <feComposite in=\"shadowOffsetInner1\" in2=\"SourceAlpha\" operator=\"arithmetic\" k2=\"-1\" k3=\"1\"\n                result=\"shadowInnerInner1\"></feComposite>\n            <feColorMatrix values=\"0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.5 0\" type=\"matrix\" in=\"shadowInnerInner1\">\n            </feColorMatrix>\n        </filter>\n        <rect id=\"path-3\" x=\"0\" y=\"0\" width=\"54\" height=\"30\" rx=\"15\"></rect>\n        <filter x=\"-2.8%\" y=\"-5.0%\" width=\"105.6%\" height=\"110.0%\" filterUnits=\"objectBoundingBox\" id=\"filter-4\">\n            <feGaussianBlur stdDeviation=\"0.5\" in=\"SourceGraphic\"></feGaussianBlur>\n        </filter>\n        <filter x=\"-5.6%\" y=\"-10.0%\" width=\"111.1%\" height=\"120.0%\" filterUnits=\"objectBoundingBox\" id=\"filter-5\">\n            <feGaussianBlur stdDeviation=\"1\" in=\"SourceAlpha\" result=\"shadowBlurInner1\"></feGaussianBlur>\n            <feOffset dx=\"0\" dy=\"-1\" in=\"shadowBlurInner1\" result=\"shadowOffsetInner1\"></feOffset>\n            <feComposite in=\"shadowOffsetInner1\" in2=\"SourceAlpha\" operator=\"arithmetic\" k2=\"-1\" k3=\"1\"\n                result=\"shadowInnerInner1\"></feComposite>\n            <feColorMatrix values=\"0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.5 0\" type=\"matrix\" in=\"shadowInnerInner1\">\n            </feColorMatrix>\n        </filter>\n    </defs>\n    <g id=\"button/next2\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\">\n        <g id=\"Group\">\n            <g id=\"Group-Copy\">\n                <g id=\"Rectangle-5-Copy\" opacity=\"0.1\" fill-rule=\"nonzero\">\n                    <use fill=\"#CCCCCC\" xlink:href=\"#path-1\"></use>\n                    <use fill=\"black\" fill-opacity=\"1\" filter=\"url(#filter-2)\" xlink:href=\"#path-1\"></use>\n                </g>\n                <g id=\"Group-2\" transform=\"translate(3.000000, 3.000000)\">\n                    <g id=\"Rectangle-5-Copy-2\" fill-rule=\"nonzero\" filter=\"url(#filter-4)\">\n                        <use fill=\"#FFD655\" xlink:href=\"#path-3\"></use>\n                        <use fill=\"black\" fill-opacity=\"1\" filter=\"url(#filter-5)\" xlink:href=\"#path-3\"></use>\n                    </g>\n                    <polygon id=\"Shape\" fill=\"#666\"\n                        transform=\"translate(27.295000, 15.000000) scale(-1, 1) translate(-27.295000, -15.000000) \"\n                        points=\"31 10.41 29.59 9 23.59 15 29.59 21 31 19.59 26.42 15\"></polygon>\n                </g>\n            </g>\n            <g id=\"Icon-24px\"\n                transform=\"translate(30.000000, 18.000000) scale(-1, 1) translate(-30.000000, -18.000000) translate(26.000000, 12.000000)\">\n            </g>\n        </g>\n    </g>\n</svg> ",
                styles: [""]
            }] }
];
/** @nocollapse */
NextActiveComponent.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * Generated from: lib/alert/alert.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class AlertComponent {
    constructor() {
        this.closeAlert = new EventEmitter();
        this.showSolution = new EventEmitter();
        this.showHint = new EventEmitter();
        this.isFocusSet = false;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onKeydownHandler(event) {
        this.close('close');
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.isFocusSet = false;
        this.previousActiveElement = (/** @type {?} */ (document.activeElement));
        this.subscription = fromEvent(document, 'keydown').subscribe((/**
         * @param {?} e
         * @return {?}
         */
        (e) => {
            if (e['key'] === 'Tab') {
                console.log('Tab pressed');
                /** @type {?} */
                const nextBtn = (/** @type {?} */ (document.querySelector('.quml-navigation__previous')));
                if (nextBtn) {
                    this.close('close');
                    nextBtn.focus();
                    this.isFocusSet = true;
                    e.stopPropagation();
                }
            }
        }));
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        /** @type {?} */
        const alertBody = document.querySelector('.quml-alert__body');
        setTimeout((/**
         * @return {?}
         */
        () => {
            /** @type {?} */
            const wrongButton = (/** @type {?} */ (document.querySelector('#wrongButton')));
            /** @type {?} */
            const correctButton = (/** @type {?} */ (document.querySelector('#correctButton')));
            /** @type {?} */
            const hintButton = (/** @type {?} */ (document.querySelector('#hintButton')));
            if (this.alertType === 'wrong') {
                wrongButton.focus();
            }
            else if (this.alertType === 'correct' && this.showSolutionButton) {
                correctButton.focus();
            }
        }), 100);
    }
    /**
     * @return {?}
     */
    viewHint() {
        this.showHint.emit({
            hint: true,
        });
    }
    /**
     * @return {?}
     */
    viewSolution() {
        this.showSolution.emit({
            solution: true,
        });
    }
    /**
     * @param {?} type
     * @return {?}
     */
    close(type) {
        this.closeAlert.emit({ type });
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        if (this.previousActiveElement && !this.isFocusSet) {
            this.previousActiveElement.focus();
        }
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
AlertComponent.decorators = [
    { type: Component, args: [{
                selector: 'quml-alert',
                template: "<div class=\"quml-alert\">\n  <div class=\"quml-alert__overlay\" (click)=\"close('close')\" (keyup.enter)=\"close('close')\"></div>\n  <div class=\"quml-alert__container\">\n    <div class=\"quml-alert__body\">\n      <div class=\"quml-alert__image quml-alert__image--correct\" *ngIf=\"alertType === 'correct'\">\n        <div class=\"quml-alert__icon-container\">\n          <img class=\"quml-alert__icon\" src=\"assets/quml-correct.svg\" alt=\"Correct Answer\">\n\n        </div>\n        <div class=\"quml-alert__icon-empty\"></div>\n        <img class=\"quml-alert__banner\" src=\"assets/banner-correct.svg\" alt=\"\" >\n      </div>\n      <div class=\"quml-alert__image quml-alert__image--wrong\" *ngIf=\"alertType === 'wrong'\">\n        <div class=\"quml-alert__icon-container\">\n          <img class=\"quml-alert__icon\" src=\"assets/quml-wrong.svg\" alt=\"Wrong Answer\">\n        </div>\n        <div class=\"quml-alert__icon-empty\"></div>\n        <img class=\"quml-alert__banner\" src=\"assets/banner-wrong.svg\" alt=\"\">\n      </div>\n     \n      \n\n      <div class=\"quml-alert__solution-container\">\n        <div class=\"quml-alert__try-again\" *ngIf=\"alertType === 'wrong' || (alertType === 'correct' && showSolutionButton)\">\n          <span tabindex=\"0\" id=\"wrongButton\" *ngIf=\"alertType === 'wrong'\" (click)=\"close('tryAgain')\" (keyup.enter)=\"close('tryAgain')\"  aria-label=\"Try again\">Try again</span>\n          <span tabindex=\"0\" id=\"correctButton\" *ngIf=\"alertType === 'correct' && showSolutionButton\" (click)=\"viewSolution()\" (keyup.enter)=\"viewSolution()\"  aria-label=\"View Solution\">View Solution</span>\n        </div>\n      </div>\n\n      <div *ngIf=\"isHintAvailable\" class=\"quml-alert__view-hint quml-alert__view-hint--disabled\">\n        <img tabindex=\"0\" id=\"hintButton\"  class=\"view-hint-icon\" (click)=\"viewHint()\" (keyup.enter)=\"viewHint()\" src=\"assets/view-hint.svg\" alt=\"View Hint logo\">\n      </div>\n    </div>\n  </div>\n</div>\n",
                styles: ["::ng-deep :root{--quml-color-primary:#FFD555;--quml-color-primary-rgba:#f6bc42;--quml-color-primary-shade:rgba(0, 0, 0, .1);--quml-color-tertiary:#FA6400;--quml-color-tertiary-rgba:rgba(250, 100, 0, 0.6);--quml-color-rgba:rgba(0, 0, 0, .6)}.quml-alert__overlay{position:absolute;width:100%;height:100%;top:0;left:0}.quml-alert__container{position:absolute;bottom:.75rem;height:5.625rem;left:0;right:0;border-radius:.5rem;box-shadow:0 .125rem .875rem 0 var(-quml-color-primary-shade);padding:.5rem 1.5rem .5rem .5rem;-webkit-animation-name:example;animation-name:example;-webkit-animation-timing-function:ease-in-out;animation-timing-function:ease-in-out;-webkit-animation-duration:.3s;animation-duration:.4s;margin:0 auto .5rem;width:23.25rem;background:linear-gradient(145deg,var(--quml-color-primary),var(--quml-color-primary) 60%,var(--quml-color-primary-rgba) 60%);z-index:1}@media only screen and (max-width:480px){.quml-alert__container{position:absolute;bottom:3.75rem;border-radius:.5rem;background-color:var(--white);box-shadow:0 .125rem .875rem 0 var(-quml-color-primary-shade);width:21.75rem;padding:.5rem}}.quml-alert__body{display:flex;align-items:center;position:relative;height:100%}.quml-alert__image{position:relative;height:100%;width:7.625rem;overflow:hidden}.quml-alert__icon-container{background:var(--white);border-radius:.5rem;position:absolute;width:4.5rem;z-index:1;height:4rem;left:0;right:0;margin:0 auto;bottom:-54px;-webkit-animation:.2s ease-out .3s forwards sign-board-animation;animation:.2s ease-out .3s forwards sign-board-animation}.quml-alert__icon-empty{position:absolute;background:var(--quml-color-primary);width:7.625rem;z-index:2;height:1.25rem;margin:0 auto;bottom:0}.quml-alert__icon{position:absolute;top:15%;left:0;width:1.75rem;height:1.75rem;right:0;margin:0 auto;-webkit-animation:.1s ease-out .7s forwards correct-button-anim;animation:.1s ease-out .7s forwards correct-button-anim}.quml-alert__banner{position:absolute;bottom:0;z-index:3;height:2.1875rem}.quml-alert__solution-container{display:flex;align-items:center;justify-content:center;width:calc(100% - 122px)}.quml-alert__try-again,.quml-alert__view-solution{line-height:normal;cursor:pointer;background:var(--white);padding:.5rem 1rem;border-radius:1rem;font-size:.75rem;color:var(--quml-color-tertiary);box-shadow:0 .125rem .875rem 0 var(--quml-color-tertiary-rgba);margin-left:.5rem}.quml-alert__view-hint{width:2rem;height:2rem;margin-left:auto;background:var(--white);border-radius:50%;box-shadow:0 .375rem 1rem -.4375rem var(--quml-color-rgba);position:relative}.quml-alert__view-hint--disabled{opacity:.6}.quml-alert__try-again,.quml-alert__view-hint{cursor:pointer;text-transform:capitalize}@-webkit-keyframes sign-board-animation{from{visibility:hidden;transform:translateY(0)}to{visibility:visible;transform:translateY(-80%)}}@keyframes sign-board-animation{from{visibility:hidden;transform:translateY(0)}to{visibility:visible;transform:translateY(-100%)}}@-webkit-keyframes correct-button-anim{from{visibility:hidden;transform:scale(.2)}to{visibility:visible;-khtml-transform:scale(1.1);transform:scale(1.1)}}@keyframes correct-button-anim{from{visibility:hidden;transform:scale(.2)}to{visibility:visible;-khtml-transform:scale(1.1);transform:scale(1.1)}}@-webkit-keyframes example{from{margin-bottom:-50px}to{margin-bottom:8px}}@keyframes example{from{margin-bottom:-50px}to{margin-bottom:8px}}"]
            }] }
];
AlertComponent.propDecorators = {
    alertType: [{ type: Input }],
    isHintAvailable: [{ type: Input }],
    showSolutionButton: [{ type: Input }],
    closeAlert: [{ type: Output }],
    showSolution: [{ type: Output }],
    showHint: [{ type: Output }],
    onKeydownHandler: [{ type: HostListener, args: ['document:keydown.escape', ['$event'],] }]
};
if (false) {
    /** @type {?} */
    AlertComponent.prototype.alertType;
    /** @type {?} */
    AlertComponent.prototype.isHintAvailable;
    /** @type {?} */
    AlertComponent.prototype.showSolutionButton;
    /** @type {?} */
    AlertComponent.prototype.closeAlert;
    /** @type {?} */
    AlertComponent.prototype.showSolution;
    /** @type {?} */
    AlertComponent.prototype.showHint;
    /** @type {?} */
    AlertComponent.prototype.subscription;
    /** @type {?} */
    AlertComponent.prototype.isFocusSet;
    /** @type {?} */
    AlertComponent.prototype.previousActiveElement;
}

/**
 * @fileoverview added by tsickle
 * Generated from: lib/icon/close/close.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class CloseComponent {
    constructor() {
    }
    /**
     * @return {?}
     */
    ngOnInit() {
    }
}
CloseComponent.decorators = [
    { type: Component, args: [{
                selector: 'quml-close',
                template: "<svg width=\"100%\" height=\"100%\" viewBox=\"0 0 24 24\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n    <title>Icon 24px</title>\n    <g id=\"PDF-Player\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\">\n        <g id=\"pdf-portrait-pop\" transform=\"translate(-320.000000, -397.000000)\">\n            <g id=\"Group-18-Copy\" transform=\"translate(0.000000, 381.000000)\">\n                <g id=\"Icon-24px\" transform=\"translate(320.000000, 16.000000)\">\n                    <polygon id=\"Shape\" fill=\"#000000\" points=\"19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12\"></polygon>\n                    <polygon id=\"Shape\" points=\"0 0 24 0 24 24 0 24\"></polygon>\n                </g>\n            </g>\n        </g>\n    </g>\n</svg>",
                styles: [""]
            }] }
];
/** @nocollapse */
CloseComponent.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * Generated from: lib/mcq-solutions/mcq-solutions.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class McqSolutionsComponent {
    constructor() {
        this.close = new EventEmitter();
    }
    /**
     * @return {?}
     */
    closeSolution() {
        if (this.solutionVideoPlayer) {
            this.solutionVideoPlayer.nativeElement.pause();
        }
        this.close.emit({
            close: true
        });
    }
}
McqSolutionsComponent.decorators = [
    { type: Component, args: [{
                selector: 'quml-mcq-solutions',
                template: "<div class=\"solutions\">\n    <div class=\"close-icon\" role=\"button\" tabindex=\"0\" aria-label=\"Close\"  (click)=\"closeSolution()\" (keydown.enter)=\"closeSolution()\">\n        <quml-close tabindex=\"-1\"></quml-close>\n    </div>\n    <div class=\"solution-header\">Question</div>\n    <div [innerHtml]=\"question | safeHtml\"></div>\n    <div class=\"solution-header\">Options</div>\n    <div class=\"solution-options-container\">\n    <div class=\"solution-options\" *ngFor=\"let option of options\">\n        <div [innerHtml]=\"option.label | safeHtml\"></div>\n    </div>\n</div>\n    <ng-container *ngIf=\"solutions && solutions.length\">\n    <div class=\"solution-header\">Solution</div>\n    <div *ngIf=\"!showVideoSolution\">\n        <div *ngFor=\"let solution of solutions\">\n            <ng-container [ngSwitch]=\"solution.type\">\n                <div *ngSwitchCase=\"'html'\" [innerHtml]=\"solution.value | safeHtml\"></div>\n                <div *ngSwitchCase=\"'video'\" class=\"video-container\">\n                    <video width=\"400\" #solutionVideoPlayer controls [poster]=\"solution.thumbnail\">\n                        <source [src]=\"solution.src\" type=\"video/mp4\">\n                        <source [src]=\"solution.src\" type=\"video/webm\">\n                    </video>\n                </div>\n                <div *ngSwitchCase=\"'image'\">\n                    <img [src]=\"solution.src\" alt=\"mcq option with image\">\n                </div>\n            </ng-container>\n        </div>\n    </div>\n</ng-container>\n    <div class=\"scoreboard-button-container\">\n        <button type=\"submit\" class=\"sb-btn sb-btn-primary sb-btn-normal sb-btn-radius\" (click)=\"closeSolution()\">Done</button>\n    </div>\n</div>",
                styles: ["::ng-deep :root{--quml-close-icon:#000}.solutions{top:0;left:0;width:100%;height:100%;padding:1rem;overflow:auto}.solution-header{color:var(--gray-800);font-size:.875rem;font-weight:700;margin:1rem 0;clear:both}.close-icon{float:right;cursor:pointer;width:3rem;height:3rem;border-radius:50%;padding:.25rem}.close-icon:hover{background:rgba(0,0,0,.15)}.close-icon:hover quml-close svg polygon#Shape{fill:var(--white)}.close-icon quml-close{display:flex;align-items:center;justify-content:center}.close-icon quml-close svg g polygon:first-child{fill:var(--quml-close-icon)}.video-container{text-align:center;margin:.5rem auto}.scoreboard-button-container{text-align:center;clear:both;margin:1rem 0}.solution-options-container{display:flex;align-items:flex-start;flex-direction:column}.solution-options-container .solution-options{margin-bottom:.5rem}"]
            }] }
];
McqSolutionsComponent.propDecorators = {
    question: [{ type: Input }],
    options: [{ type: Input }],
    solutions: [{ type: Input }],
    close: [{ type: Output }],
    solutionVideoPlayer: [{ type: ViewChild, args: ['solutionVideoPlayer', { static: true },] }]
};
if (false) {
    /** @type {?} */
    McqSolutionsComponent.prototype.question;
    /** @type {?} */
    McqSolutionsComponent.prototype.options;
    /** @type {?} */
    McqSolutionsComponent.prototype.solutions;
    /** @type {?} */
    McqSolutionsComponent.prototype.close;
    /** @type {?} */
    McqSolutionsComponent.prototype.solutionVideoPlayer;
    /** @type {?} */
    McqSolutionsComponent.prototype.showVideoSolution;
    /** @type {?} */
    McqSolutionsComponent.prototype.previousActiveElement;
}

/**
 * @fileoverview added by tsickle
 * Generated from: lib/icon/durationtimer/durationtimer.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class DurationtimerComponent {
    constructor() {
    }
    /**
     * @return {?}
     */
    ngOnInit() {
    }
}
DurationtimerComponent.decorators = [
    { type: Component, args: [{
                selector: 'quml-durationtimer',
                template: "<svg width=\"10px\" height=\"16px\" viewBox=\"0 0 10 16\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n    <title>Shape</title>\n    <g id=\"Symbols\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\">\n        <g id=\"timer/active\" transform=\"translate(-8.000000, -2.000000)\" fill=\"#6D7278\">\n            <path d=\"M8,2 L8,6.8 L8.008,6.8 L8,6.808 L11.2,10 L8,13.2 L8.008,13.208 L8,13.208 L8,18 L17.6,18 L17.6,13.208 L17.592,13.208 L17.6,13.2 L14.4,10 L17.6,6.808 L17.592,6.8 L17.6,6.8 L17.6,2 L8,2 L8,2 Z M16,13.6 L16,16.4 L9.6,16.4 L9.6,13.6 L12.8,10.4 L16,13.6 L16,13.6 Z M12.8,9.6 L9.6,6.4 L9.6,3.6 L16,3.6 L16,6.4 L12.8,9.6 L12.8,9.6 Z\" id=\"Shape\"></path>\n        </g>\n    </g>\n</svg>",
                styles: [""]
            }] }
];
/** @nocollapse */
DurationtimerComponent.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * Generated from: lib/icon/audio/audio.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class AudioComponent {
    constructor() {
    }
    /**
     * @return {?}
     */
    ngOnInit() {
    }
}
AudioComponent.decorators = [
    { type: Component, args: [{
                selector: 'quml-audio',
                template: "<svg width=\"36px\" height=\"36px\" viewBox=\"0 0 36 36\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n    <title>audio play</title>\n    <defs>\n        <rect id=\"path-1\" x=\"0\" y=\"0\" width=\"36\" height=\"36\" rx=\"18\"></rect>\n        <filter x=\"-4.2%\" y=\"-4.2%\" width=\"108.3%\" height=\"108.3%\" filterUnits=\"objectBoundingBox\" id=\"filter-2\">\n            <feGaussianBlur stdDeviation=\"1\" in=\"SourceAlpha\" result=\"shadowBlurInner1\"></feGaussianBlur>\n            <feOffset dx=\"0\" dy=\"-1\" in=\"shadowBlurInner1\" result=\"shadowOffsetInner1\"></feOffset>\n            <feComposite in=\"shadowOffsetInner1\" in2=\"SourceAlpha\" operator=\"arithmetic\" k2=\"-1\" k3=\"1\" result=\"shadowInnerInner1\"></feComposite>\n            <feColorMatrix values=\"0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.5 0\" type=\"matrix\" in=\"shadowInnerInner1\"></feColorMatrix>\n        </filter>\n    </defs>\n    <g id=\"audio-play\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\">\n        <g id=\"Rectangle-5-Copy-2\" fill-rule=\"nonzero\">\n            <use fill=\"#FFFFFF\" xlink:href=\"#path-1\"></use>\n            <use fill-opacity=\"1\" filter=\"url(#filter-2)\" xlink:href=\"#path-1\"></use>\n            <rect stroke-opacity=\"0.484156469\" stroke=\"#C3C8DB\" stroke-width=\"2\" stroke-linejoin=\"square\" x=\"1\" y=\"1\" width=\"34\" height=\"34\" rx=\"17\"></rect>\n        </g>\n        <path d=\"M19.483871,8.64533333 C23.6232258,9.616 26.7096774,13.4346667 26.7096774,18 C26.7096774,22.5653333 23.6232258,26.384 19.483871,27.3546667 L19.483871,27.3546667 L19.483871,25.1573333 C22.4670968,24.24 24.6451613,21.3813333 24.6451613,18 C24.6451613,14.6186667 22.4670968,11.76 19.483871,10.8426667 L19.483871,10.8426667 Z M17.4193548,9.46666667 L17.4193548,26.5333333 L12.2580645,21.2 L8.12903226,21.2 L8.12903226,14.8 L12.2580645,14.8 L17.4193548,9.46666667 Z M19.483871,13.7013333 C21.0116129,14.4906667 22.0645161,16.112 22.0645161,18 C22.0645161,19.888 21.0116129,21.5093333 19.483871,22.288 L19.483871,22.288 Z\" id=\"Combined-Shape\" fill=\"#6D7278\"></path>\n    </g>\n</svg>",
                styles: [""]
            }] }
];
/** @nocollapse */
AudioComponent.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * Generated from: lib/icon/wrong/wrong.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class WrongComponent {
    constructor() {
    }
    /**
     * @return {?}
     */
    ngOnInit() {
    }
}
WrongComponent.decorators = [
    { type: Component, args: [{
                selector: 'quml-wrong',
                template: "<svg width=\"48px\" height=\"48px\" viewBox=\"0 0 48 48\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n    <title>wrong</title>\n    <defs>\n        <linearGradient x1=\"0%\" y1=\"0%\" x2=\"101.719666%\" y2=\"100%\" id=\"linearGradient-1\">\n            <stop stop-color=\"#F1635D\" offset=\"0%\"></stop>\n            <stop stop-color=\"#F97A74\" offset=\"100%\"></stop>\n        </linearGradient>\n    </defs>\n    <g id=\"Symbols\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\">\n        <g id=\"wrong\">\n            <circle id=\"Oval\" fill=\"#f77f79\" fill-rule=\"nonzero\" opacity=\"0.900000036\" cx=\"24\" cy=\"24\" r=\"24\"></circle>\n            <polygon id=\"Shape\" fill=\"#fff\" points=\"36.0349854 14.4171429 33.6107955 12 24 21.5828571 14.3892045 12 11.9650146 14.4171429 21.5758101 24 11.9650146 33.5828571 14.3892045 36 24 26.4171429 33.6107955 36 36.0349854 33.5828571 26.4241899 24\"></polygon>\n        </g>\n    </g>\n</svg>",
                styles: [""]
            }] }
];
/** @nocollapse */
WrongComponent.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * Generated from: lib/icon/menu/menu.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class MenuComponent {
    constructor() {
    }
    /**
     * @return {?}
     */
    ngOnInit() {
    }
}
MenuComponent.decorators = [
    { type: Component, args: [{
                selector: 'quml-menu',
                template: "<svg width=\"18px\" height=\"12px\" viewBox=\"0 0 18 12\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n    <title>Shape</title>\n    <g id=\"Symbols\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\">\n        <g id=\"icon/menu\" fill=\"#333333\">\n            <path d=\"M0,12 L18,12 L18,10 L0,10 L0,12 L0,12 Z M0,7 L18,7 L18,5 L0,5 L0,7 L0,7 Z M0,0 L0,2 L18,2 L18,0 L0,0 L0,0 Z\" id=\"Shape\"></path>\n        </g>\n    </g>\n</svg>",
                styles: [""]
            }] }
];
/** @nocollapse */
MenuComponent.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * Generated from: lib/pipes/safe-html/safe-html.pipe.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class SafeHtmlPipe {
    /**
     * @param {?} sanitized
     */
    constructor(sanitized) {
        this.sanitized = sanitized;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    transform(value) {
        return this.sanitized.bypassSecurityTrustHtml(value);
    }
}
SafeHtmlPipe.decorators = [
    { type: Pipe, args: [{
                name: 'safeHtml'
            },] }
];
/** @nocollapse */
SafeHtmlPipe.ctorParameters = () => [
    { type: DomSanitizer }
];
if (false) {
    /**
     * @type {?}
     * @private
     */
    SafeHtmlPipe.prototype.sanitized;
}

/**
 * @fileoverview added by tsickle
 * Generated from: lib/telemetry-constants.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @enum {string} */
const pageId = {
    startPage: "START_PAGE",
    submitPage: "SUBMIT_PAGE",
    endPage: "END_PAGE",
    shortAnswer: "SHORT_ANSWER",
};
/** @enum {string} */
const eventName = {
    pageScrolled: "PAGE_SCROLLED",
    viewHint: "VIEW_HINT",
    showAnswer: "SHOW_ANSWER_CLICKED",
    nextClicked: "NEXT_CLICKED",
    prevClicked: "PREV_CLICKED",
    progressBar: "PROGRESSBAR_CLICKED",
    replayClicked: "REPLAY_CLICKED",
    startPageLoaded: "START_PAGE_LOADED",
    viewSolutionClicked: "VIEW_SOLUTION_CLICKED",
    solutionClosed: "SOLUTION_CLOSED",
    closedFeedBack: "CLOSED_FEEDBACK",
    tryAgain: "TRY_AGAIN",
    optionClicked: "OPTION_CLICKED",
    scoreBoardSubmitClicked: "SCORE_BOARD_SUBMIT_CLICKED",
    endPageExitClicked: "EXIT",
    zoomClicked: "ZOOM_CLICKED",
    zoomInClicked: "ZOOM_IN_CLICKED",
    zoomOutClicked: "ZOOM_OUT_CLICKED",
    zoomCloseClicked: "ZOOM_CLOSE_CLICKED",
    goToQuestion: "GO_TO_QUESTION",
};
/** @enum {string} */
const TelemetryType = {
    interact: "interact",
    impression: "impression",
};

/**
 * @fileoverview added by tsickle
 * Generated from: lib/quml-question-cursor.service.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @abstract
 */
class QuestionCursor {
}
if (false) {
    /**
     * @abstract
     * @param {?} identifiers
     * @param {?=} parentId
     * @return {?}
     */
    QuestionCursor.prototype.getQuestions = function (identifiers, parentId) { };
    /**
     * @abstract
     * @param {?} identifier
     * @return {?}
     */
    QuestionCursor.prototype.getQuestion = function (identifier) { };
    /**
     * @abstract
     * @param {?} identifier
     * @return {?}
     */
    QuestionCursor.prototype.getQuestionSet = function (identifier) { };
    /**
     * @abstract
     * @param {?} identifiers
     * @return {?}
     */
    QuestionCursor.prototype.getAllQuestionSet = function (identifiers) { };
}

/**
 * @fileoverview added by tsickle
 * Generated from: lib/services/viewer-service/viewer-service.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class ViewerService {
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
        this.identifiers = cloneDeep(questionIds);
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
        if (!isEmpty(indentifersForQuestions)) {
            /** @type {?} */
            const requests = [];
            /** @type {?} */
            const chunkArray = chunk(indentifersForQuestions, 10);
            forEach(chunkArray, (/**
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
                forEach(questions, (/**
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
/** @nocollapse */ ViewerService.ɵprov = ɵɵdefineInjectable({ factory: function ViewerService_Factory() { return new ViewerService(ɵɵinject(QumlLibraryService), ɵɵinject(UtilService), ɵɵinject(QuestionCursor)); }, token: ViewerService, providedIn: "root" });
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

/**
 * @fileoverview added by tsickle
 * Generated from: lib/main-player/main-player.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class MainPlayerComponent {
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
        const childMimeType = map(this.playerConfig.metadata.children, 'mimeType');
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
                this.sections = map(children, (/**
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
                        childNodes = shuffle(childNodes);
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
                this.activeSection = cloneDeep(this.sections[0]);
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
                childNodes = shuffle(childNodes);
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
                this.mainProgressBar = cloneDeep(this.playerConfig.config.progressBar);
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
            this.activeSection = cloneDeep(this.playerConfig);
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
        const progressBar = this.isSectionsAvailable ? flattenDeep(this.mainProgressBar.map((/**
         * @param {?} item
         * @return {?}
         */
        item => item.children))) : this.mainProgressBar;
        /** @type {?} */
        const classObj = groupBy(progressBar, 'class');
        this.summary = {
            skipped: get(classObj, 'skipped.length') || 0,
            correct: get(classObj, 'correct.length') || 0,
            wrong: get(classObj, 'wrong.length') || 0,
            partial: get(classObj, 'partial.length') || 0
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
        this.sectionIndex = cloneDeep(nextSectionIndex);
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
            this.activeSection = cloneDeep(this.sections[nextSectionIndex]);
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
        this.activeSection = this.isSectionsAvailable ? cloneDeep(this.sections[0]) : this.playerConfig;
        if (((_c = this.attempts) === null || _c === void 0 ? void 0 : _c.max) === ((_d = this.attempts) === null || _d === void 0 ? void 0 : _d.current)) {
            this.playerEvent.emit(this.viewerService.generateMaxAttemptEvents(get(this.attempts, 'current'), false, true));
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
            this.mainProgressBar[this.mainProgressBar.length - 1] = Object.assign(Object.assign({}, last(this.mainProgressBar)), { children });
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
            this.mainProgressBar = cloneDeep(this.playerConfig.config.progressBar);
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
        if (get(this.attempts, 'current') >= get(this.attempts, 'max')) {
            this.playerEvent.emit(this.viewerService.generateMaxAttemptEvents(get(this.attempts, 'current'), true, false));
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
        switch (get(this.playerConfig, 'metadata.summaryType')) {
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
            this.activeSection = cloneDeep(this.sections[sectionIndex]);
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

/**
 * @fileoverview added by tsickle
 * Generated from: lib/section-player/section-player.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class SectionPlayerComponent {
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
            const unCommonQuestions = xorBy(this.questions, res.questions, 'identifier');
            this.questions = uniqBy(this.questions.concat(unCommonQuestions), 'identifier');
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
        this.questionIds = cloneDeep(this.sectionConfig.metadata.childNodes);
        if (this.parentConfig.isReplayed) {
            this.replayed = true;
            this.initializeTimer = true;
            this.viewerService.raiseStartEvent(0);
            this.viewerService.raiseHeartBeatEvent(eventName.startPageLoaded, 'impression', 0);
            this.disableNext = false;
            this.currentSlideIndex = 1;
            this.myCarousel.selectSlide(1);
            this.currentQuestionsMedia = get(this.questions[0], 'media');
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
        this.questionIdsCopy = cloneDeep(this.sectionConfig.metadata.childNodes);
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
        const classObj = groupBy(this.progressBarClass, 'class');
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
        this.currentQuestionsMedia = get(this.questions[this.currentSlideIndex], 'media');
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
        this.currentQuestionsMedia = get(this.questions[this.myCarousel.getCurrentSlideIndex() - 1], 'media');
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
        if (isEmpty((_a = optionSelected) === null || _a === void 0 ? void 0 : _a.option)) {
            this.optionSelectedObj = undefined;
            this.currentSolutions = undefined;
            this.updateScoreBoard(currentIndex, 'skipped');
        }
        else {
            this.optionSelectedObj = optionSelected;
            this.currentSolutions = !isEmpty(optionSelected.solutions) ? optionSelected.solutions : undefined;
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
        if (this.progressBarClass && get(this.progressBarClass[index], 'class') === 'unattempted') {
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
                else if (selectedQuestion.qType.toUpperCase() === 'MCQ' && !isEmpty((_c = selectedQuestion) === null || _c === void 0 ? void 0 : _c.editorState)) {
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
            this.progressBarClass[currentIndex].cardinality = get(this.optionSelectedObj, 'cardinality');
            this.progressBarClass[currentIndex].option = get(this.optionSelectedObj, 'option');
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
        this.currentQuestionsMedia = get(this.questions[this.currentSlideIndex - 1], 'media');
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
        this.currentQuestionsMedia = get(this.questions[currentIndex], 'media');
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
        this.currentQuestionsMedia = get(this.questions[this.myCarousel.getCurrentSlideIndex() - 1], 'media');
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
            forEach(this.currentQuestionsMedia, (/**
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

/**
 * @fileoverview added by tsickle
 * Generated from: lib/quml-library.module.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class QumlLibraryModule {
}
QumlLibraryModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    QumlLibraryComponent,
                    McqComponent,
                    HeaderComponent,
                    SaComponent,
                    McqQuestionComponent,
                    McqOptionComponent,
                    QumlPopupComponent,
                    McqImageOptionComponent,
                    ZoomInComponent,
                    StarComponent,
                    PreviousComponent,
                    NextComponent,
                    PreviousActiveComponent,
                    BookmarkComponent,
                    HintComponent,
                    AnsComponent,
                    ShareComponent,
                    CorrectComponent,
                    ScoreboardComponent,
                    StartpageComponent,
                    TimerComponent,
                    ContentComponent,
                    StartpagestariconComponent,
                    NextActiveComponent,
                    AlertComponent,
                    CloseComponent,
                    McqSolutionsComponent,
                    DurationtimerComponent,
                    AudioComponent,
                    WrongComponent,
                    MenuComponent,
                    SafeHtmlPipe,
                    MainPlayerComponent,
                    SectionPlayerComponent,
                ],
                imports: [
                    CommonModule,
                    CarouselModule,
                    SunbirdPlayerSdkModule,
                    TranslateModule.forRoot({
                        defaultLanguage: 'hi',
                        loader: {
                            provide: TranslateLoader,
                            useFactory: HttpLoaderFactory,
                            deps: [HttpClient]
                        }
                    })
                ],
                providers: [
                    QumlLibraryService
                ],
                exports: [MainPlayerComponent]
            },] }
];
/**
 * @param {?} http
 * @return {?}
 */
function HttpLoaderFactory(http) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

/**
 * @fileoverview added by tsickle
 * Generated from: public_api.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: project-sunbird-sunbird-quml-player-v9.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

export { HttpLoaderFactory, QuestionCursor, QumlLibraryComponent, QumlLibraryModule, QumlLibraryService, UtilService as ɵa, McqComponent as ɵb, McqSolutionsComponent as ɵba, DurationtimerComponent as ɵbb, AudioComponent as ɵbc, WrongComponent as ɵbd, MenuComponent as ɵbe, SafeHtmlPipe as ɵbf, MainPlayerComponent as ɵbg, ViewerService as ɵbh, SectionPlayerComponent as ɵbi, HeaderComponent as ɵc, SaComponent as ɵd, McqQuestionComponent as ɵe, McqOptionComponent as ɵf, QumlPopupComponent as ɵg, McqImageOptionComponent as ɵh, ZoomInComponent as ɵi, StarComponent as ɵj, PreviousComponent as ɵk, NextComponent as ɵl, PreviousActiveComponent as ɵm, BookmarkComponent as ɵn, HintComponent as ɵo, AnsComponent as ɵp, ShareComponent as ɵq, CorrectComponent as ɵr, ScoreboardComponent as ɵs, StartpageComponent as ɵt, TimerComponent as ɵu, ContentComponent as ɵv, StartpagestariconComponent as ɵw, NextActiveComponent as ɵx, AlertComponent as ɵy, CloseComponent as ɵz };
//# sourceMappingURL=project-sunbird-sunbird-quml-player-v9.js.map
