/**
 * @fileoverview added by tsickle
 * Generated from: lib/mcq/mcq.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { __awaiter } from "tslib";
import { Component, Input, SecurityContext, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { UtilService } from '../util-service';
export class McqComponent {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWNxLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bwcm9qZWN0LXN1bmJpcmQvc3VuYmlyZC1xdW1sLXBsYXllci12OS8iLCJzb3VyY2VzIjpbImxpYi9tY3EvbWNxLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFVLEtBQUssRUFBRSxlQUFlLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBaUIsTUFBTSxlQUFlLENBQUM7QUFDL0csT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBRXpELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQVU5QyxNQUFNLE9BQU8sWUFBWTs7Ozs7SUFvQnZCLFlBQ1MsWUFBMEIsRUFDMUIsV0FBd0I7UUFEeEIsaUJBQVksR0FBWixZQUFZLENBQWM7UUFDMUIsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFoQnZCLG9CQUFlLEdBQUcsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUMxQyxrQkFBYSxHQUFHLElBQUksWUFBWSxFQUFPLENBQUM7UUFDeEMsbUJBQWMsR0FBRyxJQUFJLFlBQVksRUFBVSxDQUFDO1FBSXRELGVBQVUsR0FBVSxFQUFFLENBQUM7UUFFdkIsa0JBQWEsR0FBRyxLQUFLLENBQUM7SUFTdEIsQ0FBQzs7OztJQUVLLFFBQVE7O1lBRVosSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRTtnQkFDM0IsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQzthQUMxQzs7Z0JBQ0ksR0FBRyxHQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1lBQzNGLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxH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QUFDO0lBRTdDLENBQUM7Ozs7O0lBQ0QscUJBQXFCLENBQUMsS0FBSztRQUN6QixJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzdCLENBQUM7Ozs7O0lBRUQsMEJBQTBCLENBQUMsU0FBUztRQUNsQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUN0QyxDQUFDOzs7O0lBRUQsU0FBUztRQUNQLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO0lBQzVCLENBQUM7Ozs7SUFFRCxVQUFVO1FBQ1IsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7SUFDN0IsQ0FBQzs7O1lBcElGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsVUFBVTtnQkFDcEIsbThHQUFtQzs7YUFHcEM7Ozs7WUFYUSxZQUFZO1lBRVosV0FBVzs7O3VCQVdqQixLQUFLO3lCQUNMLEtBQUs7cUJBQ0wsS0FBSzt1QkFDTCxLQUFLO3VCQUNMLEtBQUs7OEJBQ0wsTUFBTTs0QkFDTixNQUFNOzZCQUNOLE1BQU07Ozs7SUFQUCxnQ0FBK0I7O0lBQy9CLGtDQUF5Qjs7SUFDekIsOEJBQWdDOztJQUNoQyxnQ0FBNEI7O0lBQzVCLGdDQUE0Qjs7SUFDNUIsdUNBQW9EOztJQUNwRCxxQ0FBa0Q7O0lBQ2xELHNDQUFzRDs7SUFFdEQsbUNBQWlCOztJQUNqQiwrQkFBYTs7SUFDYixrQ0FBdUI7O0lBQ3ZCLDRDQUEwQjs7SUFDMUIscUNBQXNCOztJQUN0QixpQ0FBcUI7O0lBQ3JCLG1DQUFvQjs7SUFLbEIsb0NBQWlDOztJQUNqQyxtQ0FBK0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgSW5wdXQsIFNlY3VyaXR5Q29udGV4dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIsIEFmdGVyVmlld0luaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IERvbVNhbml0aXplciB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInO1xuaW1wb3J0IHsga2F0ZXggfSBmcm9tICdrYXRleCc7XG5pbXBvcnQgeyBVdGlsU2VydmljZSB9IGZyb20gJy4uL3V0aWwtc2VydmljZSc7XG5cbmRlY2xhcmUgdmFyIGthdGV4OiBhbnk7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3F1bWwtbWNxJyxcbiAgdGVtcGxhdGVVcmw6ICcuL21jcS5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL21jcS5jb21wb25lbnQuc2NzcycsICcuLi9xdW1sLWxpYnJhcnkuY29tcG9uZW50LnNjc3MnXSxcblxufSlcbmV4cG9ydCBjbGFzcyBNY3FDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIEFmdGVyVmlld0luaXQge1xuICBASW5wdXQoKSBwdWJsaWMgcXVlc3Rpb24/OiBhbnk7XG4gIEBJbnB1dCgpIGlkZW50aWZpZXI6IGFueTtcbiAgQElucHV0KCkgcHVibGljIGxheW91dD86IHN0cmluZztcbiAgQElucHV0KCkgcmVwbGF5ZWQgOiBib29sZWFuO1xuICBASW5wdXQoKSB0cnlBZ2Fpbj86IGJvb2xlYW47XG4gIEBPdXRwdXQoKSBjb21wb25lbnRMb2FkZWQgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgpIGFuc3dlckNoYW5nZWQgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgpIG9wdGlvblNlbGVjdGVkID0gbmV3IEV2ZW50RW1pdHRlcjxudW1iZXI+KCk7XG5cbiAgbWNxUXVlc3Rpb246IGFueTtcbiAgb3B0aW9uczogYW55O1xuICBtY3FPcHRpb25zOiBhbnlbXSA9IFtdO1xuICBzZWxlY3RlZE9wdGlvblRhcmdldDogYW55O1xuICBzaG93UXVtbFBvcHVwID0gZmFsc2U7XG4gIHNvbHV0aW9uczogQXJyYXk8W10+O1xuICBjYXJkaW5hbGl0eTogc3RyaW5nO1xuXG5cblxuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgZG9tU2FuaXRpemVyOiBEb21TYW5pdGl6ZXIgLCBcbiAgICBwdWJsaWMgdXRpbFNlcnZpY2U6IFV0aWxTZXJ2aWNlKSB7XG4gIH1cblxuICBhc3luYyBuZ09uSW5pdCgpIHtcblxuICAgIGlmICh0aGlzLnF1ZXN0aW9uLnNvbHV0aW9ucykge1xuICAgICAgdGhpcy5zb2x1dGlvbnMgPSB0aGlzLnF1ZXN0aW9uLnNvbHV0aW9ucztcbiAgICB9XG4gICAgbGV0ICBrZXk6YW55ID0gdGhpcy51dGlsU2VydmljZS5nZXRLZXlWYWx1ZShPYmplY3Qua2V5cyh0aGlzLnF1ZXN0aW9uLnJlc3BvbnNlRGVjbGFyYXRpb24pKTtcbiAgICB0aGlzLmNhcmRpbmFsaXR5ID0gdGhpcy5xdWVzdGlvbi5yZXNwb25zZURlY2xhcmF0aW9uW2tleV1bJ2NhcmRpbmFsaXR5J107XG4gICAgaWYgKHRoaXMucXVlc3Rpb24udGVtcGxhdGVJZCA9PT0gXCJtY3EtdmVydGljYWxcIikge1xuICAgICAgdGhpcy5sYXlvdXQgPSAnREVGQVVMVCc7XG4gICAgfSBlbHNlIGlmICh0aGlzLnF1ZXN0aW9uLnRlbXBsYXRlSWQgPT09IFwibWNxLWhvcml6b250YWxcIikge1xuICAgICAgdGhpcy5sYXlvdXQgPSAnSU1BR0VHUklEJztcbiAgICB9IGVsc2UgaWYgKHRoaXMucXVlc3Rpb24udGVtcGxhdGVJZCA9PT0gXCJtY3EtdmVydGljYWwtc3BsaXRcIikge1xuICAgICAgdGhpcy5sYXlvdXQgPSAnSU1BR0VRQUdSSUQnO1xuICAgIH0gZWxzZSBpZiAodGhpcy5xdWVzdGlvbi50ZW1wbGF0ZUlkID09PSBcIm1jcS1ncmlkLXNwbGl0XCIpIHtcbiAgICAgIHRoaXMubGF5b3V0ID0gJ01VTFRJSU1BR0VHUklEJztcbiAgICB9XG4gICAgdGhpcy5yZW5kZXJMYXRleCgpO1xuICAgIHRoaXMubWNxUXVlc3Rpb24gPSB0aGlzLmRvbVNhbml0aXplci5zYW5pdGl6ZShTZWN1cml0eUNvbnRleHQuSFRNTCxcbiAgICAgIHRoaXMuZG9tU2FuaXRpemVyLmJ5cGFzc1NlY3VyaXR5VHJ1c3RIdG1sKHRoaXMucXVlc3Rpb24uYm9keSkpO1xuICAgIHRoaXMub3B0aW9ucyA9IHRoaXMucXVlc3Rpb24uaW50ZXJhY3Rpb25zW2tleV0ub3B0aW9ucztcbiAgICB0aGlzLmluaXRPcHRpb25zKCk7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgY29uc3QgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdtY3Etb3B0aW9ucycpO1xuICAgIGlmIChlbCAhPSBudWxsICYmIGVsLmxlbmd0aCA+IDApIHtcbiAgICAgIGVsWzBdLnJlbW92ZSgpO1xuICAgIH1cbiAgfVxuXG4gIGluaXRPcHRpb25zKCkge1xuICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5vcHRpb25zLmxlbmd0aDsgaisrKSB7XG4gICAgICBsZXQgaW1hZ2VVcmw7XG4gICAgICBpZiAodGhpcy5vcHRpb25zW2pdLnVybCkge1xuICAgICAgICBpbWFnZVVybCA9IHRoaXMub3B0aW9uc1tqXS51cmw7XG4gICAgICB9XG4gICAgICBjb25zdCBvcHRpb24gPSB0aGlzLm9wdGlvbnNbal07XG4gICAgICBjb25zdCBvcHRpb25WYWx1ZSA9IG9wdGlvbi52YWx1ZS5ib2R5O1xuICAgICAgY29uc3Qgb3B0aW9uSHRtbCA9IHRoaXMuZG9tU2FuaXRpemVyLnNhbml0aXplKFNlY3VyaXR5Q29udGV4dC5IVE1MLCB0aGlzLmRvbVNhbml0aXplci5ieXBhc3NTZWN1cml0eVRydXN0SHRtbChvcHRpb25WYWx1ZSkpO1xuICAgICAgY29uc3Qgc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgIGNvbnN0IG9wdGlvblRvQmVQdXNoZWQ6IGFueSA9IHt9O1xuICAgICAgb3B0aW9uVG9CZVB1c2hlZC5pbmRleCA9IGo7XG4gICAgICBvcHRpb25Ub0JlUHVzaGVkLm9wdGlvbkh0bWwgPSBvcHRpb25IdG1sO1xuICAgICAgb3B0aW9uVG9CZVB1c2hlZC5zZWxlY3RlZCA9IHNlbGVjdGVkO1xuICAgICAgb3B0aW9uVG9CZVB1c2hlZC51cmwgPSBpbWFnZVVybDtcbiAgICAgIHRoaXMubWNxT3B0aW9ucy5wdXNoKG9wdGlvblRvQmVQdXNoZWQpO1xuICAgIH1cbiAgfVxuXG5cblxuICByZW5kZXJMYXRleCgpIHtcbiAgICBjb25zdCBfaW5zdGFuY2UgPSB0aGlzO1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgX2luc3RhbmNlLnJlcGxhY2VMYXRleFRleHQoKTtcbiAgICAgIGNvbnN0IGltYWdlcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdpbWcnKTtcbiAgICAgIGlmIChpbWFnZXMgIT0gbnVsbCAmJiBpbWFnZXMubGVuZ3RoID4gMCkge1xuICAgICAgfVxuICAgIH0sIDEwMCk7XG4gIH1cblxuICByZXBsYWNlTGF0ZXhUZXh0KCkge1xuICAgIGNvbnN0IHF1ZXN0aW9uRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuaWRlbnRpZmllcik7XG4gICAgaWYgKHF1ZXN0aW9uRWxlbWVudCAhPSBudWxsKSB7XG4gICAgICBjb25zdCBtYXRoVGV4dERpdnMgPSBxdWVzdGlvbkVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnbWF0aFRleHQnKTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWF0aFRleHREaXZzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IG1hdGhFeHAgPSBtYXRoVGV4dERpdnNbaV07XG4gICAgICAgIGNvbnN0IHRleHRUb1JlbmRlciA9IG1hdGhFeHAuaW5uZXJIVE1MO1xuICAgICAgICBrYXRleC5yZW5kZXIodGV4dFRvUmVuZGVyLCBtYXRoRXhwLCB7IGRpc3BsYXlNb2RlOiBmYWxzZSwgb3V0cHV0OiAnaHRtbCcsIHRocm93T25FcnJvcjogdHJ1ZSB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBvbk9wdGlvblNlbGVjdChldmVudCkge1xuICAgIGNvbnN0IG1jcU9wdGlvbiA9IGV2ZW50Lm9wdGlvbjtcbiAgICBjb25zdCBzb2x1dGlvbnMgPSBldmVudC5zb2x1dGlvbnM7XG4gICAgdGhpcy5tY3FPcHRpb25zLmZvckVhY2gobWNxT3B0aW9uRWxlbWVudCA9PiB7XG4gICAgICBpZiAobWNxT3B0aW9uRWxlbWVudC5pbmRleCA9PT0gZXZlbnQub3B0aW9uLmluZGV4KSB7XG4gICAgICAgIG1jcU9wdGlvbkVsZW1lbnQuc2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbWNxT3B0aW9uRWxlbWVudC5zZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIG1jcU9wdGlvbi5zb2x1dGlvbnMgPSBzb2x1dGlvbnM7XG4gICAgdGhpcy5nZXRTZWxlY3RlZE9wdGlvbkFuZFJlc3VsdChtY3FPcHRpb24pO1xuXG4gIH1cbiAgb3B0aW9uU2VsZWN0ZWRJbkltYWdlKGV2ZW50KSB7XG4gICAgdGhpcy5vbk9wdGlvblNlbGVjdChldmVudCk7XG4gIH1cblxuICBnZXRTZWxlY3RlZE9wdGlvbkFuZFJlc3VsdChvcHRpb25PYmopIHtcbiAgICB0aGlzLm9wdGlvblNlbGVjdGVkLmVtaXQob3B0aW9uT2JqKTtcbiAgfVxuXG4gIHNob3dQb3B1cCgpIHtcbiAgICB0aGlzLnNob3dRdW1sUG9wdXAgPSB0cnVlO1xuICB9XG5cbiAgY2xvc2VQb3BVcCgpIHtcbiAgICB0aGlzLnNob3dRdW1sUG9wdXAgPSBmYWxzZTtcbiAgfVxuXG59XG4iXX0=