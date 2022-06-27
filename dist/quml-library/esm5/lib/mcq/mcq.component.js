/**
 * @fileoverview added by tsickle
 * Generated from: lib/mcq/mcq.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { __awaiter, __generator } from "tslib";
import { Component, Input, SecurityContext, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { UtilService } from '../util-service';
var McqComponent = /** @class */ (function () {
    function McqComponent(domSanitizer, utilService) {
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
    McqComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        return __awaiter(this, void 0, void 0, function () {
            var key;
            return __generator(this, function (_a) {
                if (this.question.solutions) {
                    this.solutions = this.question.solutions;
                }
                key = this.utilService.getKeyValue(Object.keys(this.question.responseDeclaration));
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
                return [2 /*return*/];
            });
        });
    };
    /**
     * @return {?}
     */
    McqComponent.prototype.ngAfterViewInit = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var el = document.getElementsByClassName('mcq-options');
        if (el != null && el.length > 0) {
            el[0].remove();
        }
    };
    /**
     * @return {?}
     */
    McqComponent.prototype.initOptions = /**
     * @return {?}
     */
    function () {
        for (var j = 0; j < this.options.length; j++) {
            /** @type {?} */
            var imageUrl = void 0;
            if (this.options[j].url) {
                imageUrl = this.options[j].url;
            }
            /** @type {?} */
            var option = this.options[j];
            /** @type {?} */
            var optionValue = option.value.body;
            /** @type {?} */
            var optionHtml = this.domSanitizer.sanitize(SecurityContext.HTML, this.domSanitizer.bypassSecurityTrustHtml(optionValue));
            /** @type {?} */
            var selected = false;
            /** @type {?} */
            var optionToBePushed = {};
            optionToBePushed.index = j;
            optionToBePushed.optionHtml = optionHtml;
            optionToBePushed.selected = selected;
            optionToBePushed.url = imageUrl;
            this.mcqOptions.push(optionToBePushed);
        }
    };
    /**
     * @return {?}
     */
    McqComponent.prototype.renderLatex = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var _instance = this;
        setTimeout((/**
         * @return {?}
         */
        function () {
            _instance.replaceLatexText();
            /** @type {?} */
            var images = document.getElementsByTagName('img');
            if (images != null && images.length > 0) {
            }
        }), 100);
    };
    /**
     * @return {?}
     */
    McqComponent.prototype.replaceLatexText = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var questionElement = document.getElementById(this.identifier);
        if (questionElement != null) {
            /** @type {?} */
            var mathTextDivs = questionElement.getElementsByClassName('mathText');
            for (var i = 0; i < mathTextDivs.length; i++) {
                /** @type {?} */
                var mathExp = mathTextDivs[i];
                /** @type {?} */
                var textToRender = mathExp.innerHTML;
                katex.render(textToRender, mathExp, { displayMode: false, output: 'html', throwOnError: true });
            }
        }
    };
    /**
     * @param {?} event
     * @return {?}
     */
    McqComponent.prototype.onOptionSelect = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        /** @type {?} */
        var mcqOption = event.option;
        /** @type {?} */
        var solutions = event.solutions;
        this.mcqOptions.forEach((/**
         * @param {?} mcqOptionElement
         * @return {?}
         */
        function (mcqOptionElement) {
            if (mcqOptionElement.index === event.option.index) {
                mcqOptionElement.selected = true;
            }
            else {
                mcqOptionElement.selected = false;
            }
        }));
        mcqOption.solutions = solutions;
        this.getSelectedOptionAndResult(mcqOption);
    };
    /**
     * @param {?} event
     * @return {?}
     */
    McqComponent.prototype.optionSelectedInImage = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this.onOptionSelect(event);
    };
    /**
     * @param {?} optionObj
     * @return {?}
     */
    McqComponent.prototype.getSelectedOptionAndResult = /**
     * @param {?} optionObj
     * @return {?}
     */
    function (optionObj) {
        this.optionSelected.emit(optionObj);
    };
    /**
     * @return {?}
     */
    McqComponent.prototype.showPopup = /**
     * @return {?}
     */
    function () {
        this.showQumlPopup = true;
    };
    /**
     * @return {?}
     */
    McqComponent.prototype.closePopUp = /**
     * @return {?}
     */
    function () {
        this.showQumlPopup = false;
    };
    McqComponent.decorators = [
        { type: Component, args: [{
                    selector: 'quml-mcq',
                    template: "<!-- Default Layout-->\n<div class=\"quml-mcq layoutDefault\" *ngIf=\"layout=='DEFAULT'\">\n    <div class=\"quml-mcq--question mb-16\">\n        <quml-mcq-question [mcqQuestion]=\"mcqQuestion\" [layout]=\"layout\" (showPopup)=\"showPopup()\"></quml-mcq-question>\n    </div>\n    <div class=\"quml-mcq--option\">\n        <quml-mcq-option [mcqOptions]=\"options\" [replayed]=\"replayed\" [cardinality]=\"cardinality\"\n            [solutions]=\"solutions\" [layout]=\"layout\" (optionSelected)=\"getSelectedOptionAndResult($event)\"\n            (showPopup)=\"showPopup()\" [tryAgain]=\"tryAgain\"></quml-mcq-option>\n    </div>\n</div>\n<!-- End of Default Layout-->\n<!--Image Grid Layout-->\n<div class=\"quml-mcq layoutImageGrid-mcq-horizontal\" *ngIf=\"layout=='IMAGEGRID'\">\n    <div class=\"quml-mcq--question mb-16\">\n        <quml-mcq-question [mcqQuestion]=\"mcqQuestion\" [layout]=\"layout\"></quml-mcq-question>\n    </div>\n    <div class=\"quml-mcq--option\">\n        <quml-mcq-option [mcqOptions]=\"options\" [replayed]=\"replayed\" [cardinality]=\"cardinality\" [layout]=\"layout\"\n            [solutions]=\"solutions\" (optionSelected)=\"getSelectedOptionAndResult($event)\" [tryAgain]=\"tryAgain\">\n        </quml-mcq-option>\n    </div>\n</div>\n<!--End of Grid Layout-->\n<!--Image Multi Grid Layout-->\n<div class=\"quml-mcq layoutMultiImageGrid\" *ngIf=\"layout==='MULTIIMAGEGRID'\">\n    <div class=\"imageqa-wrapper image-grid\">\n        <div class=\"quml-mcq--question mb-16\">\n            <quml-mcq-question [mcqQuestion]=\"mcqQuestion\" [layout]=\"layout\"></quml-mcq-question>\n        </div>\n        <div class=\"quml-mcq--option\">\n            <quml-mcq-option [mcqOptions]=\"options\" [replayed]=\"replayed\" [cardinality]=\"cardinality\"\n                [solutions]=\"solutions\" (optionSelected)=\"getSelectedOptionAndResult($event)\" [layout]=\"layout\" [tryAgain]=\"tryAgain\">\n            </quml-mcq-option>\n        </div>\n    </div>\n</div>\n<!--End of Image Multi Grid Layout-->\n<!--Image QA Grid Layout-->\n<div class=\"quml-mcq layoutImageQAGridMCQ-vSplit\" *ngIf=\"layout=='IMAGEQAGRID'\">\n    <div class=\"imageqa-wrapper\">\n        <div class=\"quml-mcq--question mb-16\">\n            <quml-mcq-question [mcqQuestion]=\"mcqQuestion\" [layout]=\"layout\"></quml-mcq-question>\n        </div>\n        <div class=\"quml-mcq--option\">\n            <quml-mcq-option [mcqOptions]=\"options\" [replayed]=\"replayed\" [cardinality]=\"cardinality\"\n                [solutions]=\"solutions\" (optionSelected)=\"getSelectedOptionAndResult($event)\" [layout]=\"layout\" [tryAgain]=\"tryAgain\">\n            </quml-mcq-option>\n        </div>\n    </div>\n</div>\n<!--End of Image QA Grid Layout-->\n<!--Image QOption Layout-->\n<div class=\"quml-mcq layoutImageOption\" *ngIf=\"layout=='IMAGEQOPTION'\">\n    <div class=\"columnBlock questionBlock quml-mcq--question mb-16\">\n        <quml-mcq-question [mcqQuestion]=\"mcqQuestion\" [layout]=\"layout\"></quml-mcq-question>\n    </div>\n    <div class=\"columnBlock quml-mcq--option\">\n        <quml-mcq-option [mcqOptions]=\"options\" [replayed]=\"replayed\" [cardinality]=\"cardinality\"\n            [solutions]=\"solutions\" [layout]=\"layout\" (optionSelected)=\"getSelectedOptionAndResult($event)\" [tryAgain]=\"tryAgain\">\n        </quml-mcq-option>\n    </div>\n</div>\n\n<!--End of Image QOption Layout-->\n<quml-quml-popup *ngIf=\"showQumlPopup\" (popUpClose)=\"closePopUp()\"></quml-quml-popup>",
                    styles: [".quml-mcq{padding:0}.quml-mcq .columnBlock{display:inline-block;min-width:12.5rem;padding:.25rem;min-height:12.5rem;vertical-align:top}.quml-mcq .questionBlock{max-width:17.1875rem;width:30%}.quml-mcq .image-grid{display:flex}.quml-mcq .image-grid .quml-mcq--question{flex-basis:25%}.quml-mcq .image-grid .quml-mcq--option{flex:1 1 75%}::ng-deep .layoutImageGrid-mcq-horizontal .quml-mcq--option .qumlImageOption .wrapper{-ms-grid-columns:(1fr)[4];grid-template-columns:repeat(4,1fr)}@media only screen and (min-width:360px) and (max-width:640px){::ng-deep .layoutImageGrid-mcq-horizontal .quml-mcq--option .qumlImageOption .wrapper{-ms-grid-columns:(1fr)[2];grid-template-columns:repeat(2,1fr)}}", ".answer{border:1px solid;padding:.2em;margin:.5em}.icon{width:15%;max-width:70px;min-width:50px;display:inline-block;vertical-align:top}.mcqText{display:inline-block;word-break:break-word}.mcq-option{background:var(--white);border-radius:5px;margin:8px 16px;padding:8px}.options{word-break:break-all;padding:15px 5px}.even,.odd{width:47%;display:inline-block;vertical-align:middle}.column-block{display:inline-block;width:48%;vertical-align:middle}.selected{background:var(--primary-color);color:var(--white);box-shadow:1px 2px 1px 3px var(--black)}.mathText{display:inline!important}.padding-top{padding-top:16px}@media only screen and (min-width:100px) and (max-width:481px){.mcqText{width:75%}.even,.odd{width:38%;display:inline-block;vertical-align:middle}.column-block{display:inline-block;width:42%;vertical-align:middle}}@media only screen and (min-width:481px) and (max-width:800px){.mcqText{width:85%}.even,.odd{width:43%;display:inline-block;vertical-align:middle}.column-block{display:inline-block;width:45%;vertical-align:middle}}@media only screen and (min-width:801px) and (max-width:1200px){.even,.odd{width:45%}.column-block{display:inline-block;width:45%;vertical-align:middle}}"]
                }] }
    ];
    /** @nocollapse */
    McqComponent.ctorParameters = function () { return [
        { type: DomSanitizer },
        { type: UtilService }
    ]; };
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
    return McqComponent;
}());
export { McqComponent };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWNxLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bwcm9qZWN0LXN1bmJpcmQvc3VuYmlyZC1xdW1sLXBsYXllci12OS8iLCJzb3VyY2VzIjpbImxpYi9tY3EvbWNxLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFVLEtBQUssRUFBRSxlQUFlLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBaUIsTUFBTSxlQUFlLENBQUM7QUFDL0csT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBRXpELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUk5QztJQTBCRSxzQkFDUyxZQUEwQixFQUMxQixXQUF3QjtRQUR4QixpQkFBWSxHQUFaLFlBQVksQ0FBYztRQUMxQixnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQWhCdkIsb0JBQWUsR0FBRyxJQUFJLFlBQVksRUFBTyxDQUFDO1FBQzFDLGtCQUFhLEdBQUcsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUN4QyxtQkFBYyxHQUFHLElBQUksWUFBWSxFQUFVLENBQUM7UUFJdEQsZUFBVSxHQUFVLEVBQUUsQ0FBQztRQUV2QixrQkFBYSxHQUFHLEtBQUssQ0FBQztJQVN0QixDQUFDOzs7O0lBRUssK0JBQVE7OztJQUFkOzs7O2dCQUVFLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUU7b0JBQzNCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUM7aUJBQzFDO2dCQUNJLEdBQUcsR0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsbUJBQW1CLENBQUMsQ0FBQztnQkFDM0YsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLG1CQUFtQixDQUFDLEdBQUcsQ0FB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aEMsSUFBSSxDQUFDLDBCQUEwQixDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBRTdDLENBQUM7Ozs7O0lBQ0QsNENBQXFCOzs7O0lBQXJCLFVBQXNCLEtBQUs7UUFDekIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM3QixDQUFDOzs7OztJQUVELGlEQUEwQjs7OztJQUExQixVQUEyQixTQUFTO1FBQ2xDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3RDLENBQUM7Ozs7SUFFRCxnQ0FBUzs7O0lBQVQ7UUFDRSxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztJQUM1QixDQUFDOzs7O0lBRUQsaUNBQVU7OztJQUFWO1FBQ0UsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7SUFDN0IsQ0FBQzs7Z0JBcElGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsVUFBVTtvQkFDcEIsbThHQUFtQzs7aUJBR3BDOzs7O2dCQVhRLFlBQVk7Z0JBRVosV0FBVzs7OzJCQVdqQixLQUFLOzZCQUNMLEtBQUs7eUJBQ0wsS0FBSzsyQkFDTCxLQUFLOzJCQUNMLEtBQUs7a0NBQ0wsTUFBTTtnQ0FDTixNQUFNO2lDQUNOLE1BQU07O0lBd0hULG1CQUFDO0NBQUEsQUF0SUQsSUFzSUM7U0FoSVksWUFBWTs7O0lBQ3ZCLGdDQUErQjs7SUFDL0Isa0NBQXlCOztJQUN6Qiw4QkFBZ0M7O0lBQ2hDLGdDQUE0Qjs7SUFDNUIsZ0NBQTRCOztJQUM1Qix1Q0FBb0Q7O0lBQ3BELHFDQUFrRDs7SUFDbEQsc0NBQXNEOztJQUV0RCxtQ0FBaUI7O0lBQ2pCLCtCQUFhOztJQUNiLGtDQUF1Qjs7SUFDdkIsNENBQTBCOztJQUMxQixxQ0FBc0I7O0lBQ3RCLGlDQUFxQjs7SUFDckIsbUNBQW9COztJQUtsQixvQ0FBaUM7O0lBQ2pDLG1DQUErQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBJbnB1dCwgU2VjdXJpdHlDb250ZXh0LCBPdXRwdXQsIEV2ZW50RW1pdHRlciwgQWZ0ZXJWaWV3SW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRG9tU2FuaXRpemVyIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XG5pbXBvcnQgeyBrYXRleCB9IGZyb20gJ2thdGV4JztcbmltcG9ydCB7IFV0aWxTZXJ2aWNlIH0gZnJvbSAnLi4vdXRpbC1zZXJ2aWNlJztcblxuZGVjbGFyZSB2YXIga2F0ZXg6IGFueTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAncXVtbC1tY3EnLFxuICB0ZW1wbGF0ZVVybDogJy4vbWNxLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vbWNxLmNvbXBvbmVudC5zY3NzJywgJy4uL3F1bWwtbGlicmFyeS5jb21wb25lbnQuc2NzcyddLFxuXG59KVxuZXhwb3J0IGNsYXNzIE1jcUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCB7XG4gIEBJbnB1dCgpIHB1YmxpYyBxdWVzdGlvbj86IGFueTtcbiAgQElucHV0KCkgaWRlbnRpZmllcjogYW55O1xuICBASW5wdXQoKSBwdWJsaWMgbGF5b3V0Pzogc3RyaW5nO1xuICBASW5wdXQoKSByZXBsYXllZCA6IGJvb2xlYW47XG4gIEBJbnB1dCgpIHRyeUFnYWluPzogYm9vbGVhbjtcbiAgQE91dHB1dCgpIGNvbXBvbmVudExvYWRlZCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCkgYW5zd2VyQ2hhbmdlZCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCkgb3B0aW9uU2VsZWN0ZWQgPSBuZXcgRXZlbnRFbWl0dGVyPG51bWJlcj4oKTtcblxuICBtY3FRdWVzdGlvbjogYW55O1xuICBvcHRpb25zOiBhbnk7XG4gIG1jcU9wdGlvbnM6IGFueVtdID0gW107XG4gIHNlbGVjdGVkT3B0aW9uVGFyZ2V0OiBhbnk7XG4gIHNob3dRdW1sUG9wdXAgPSBmYWxzZTtcbiAgc29sdXRpb25zOiBBcnJheTxbXT47XG4gIGNhcmRpbmFsaXR5OiBzdHJpbmc7XG5cblxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBkb21TYW5pdGl6ZXI6IERvbVNhbml0aXplciAsIFxuICAgIHB1YmxpYyB1dGlsU2VydmljZTogVXRpbFNlcnZpY2UpIHtcbiAgfVxuXG4gIGFzeW5jIG5nT25Jbml0KCkge1xuXG4gICAgaWYgKHRoaXMucXVlc3Rpb24uc29sdXRpb25zKSB7XG4gICAgICB0aGlzLnNvbHV0aW9ucyA9IHRoaXMucXVlc3Rpb24uc29sdXRpb25zO1xuICAgIH1cbiAgICBsZXQgIGtleTphbnkgPSB0aGlzLnV0aWxTZXJ2aWNlLmdldEtleVZhbHVlKE9iamVjdC5rZXlzKHRoaXMucXVlc3Rpb24ucmVzcG9uc2VEZWNsYXJhdGlvbikpO1xuICAgIHRoaXMuY2FyZGluYWxpdHkgPSB0aGlzLnF1ZXN0aW9uLnJlc3BvbnNlRGVjbGFyYXRpb25ba2V5XVsnY2FyZGluYWxpdHknXTtcbiAgICBpZiAodGhpcy5xdWVzdGlvbi50ZW1wbGF0ZUlkID09PSBcIm1jcS12ZXJ0aWNhbFwiKSB7XG4gICAgICB0aGlzLmxheW91dCA9ICdERUZBVUxUJztcbiAgICB9IGVsc2UgaWYgKHRoaXMucXVlc3Rpb24udGVtcGxhdGVJZCA9PT0gXCJtY3EtaG9yaXpvbnRhbFwiKSB7XG4gICAgICB0aGlzLmxheW91dCA9ICdJTUFHRUdSSUQnO1xuICAgIH0gZWxzZSBpZiAodGhpcy5xdWVzdGlvbi50ZW1wbGF0ZUlkID09PSBcIm1jcS12ZXJ0aWNhbC1zcGxpdFwiKSB7XG4gICAgICB0aGlzLmxheW91dCA9ICdJTUFHRVFBR1JJRCc7XG4gICAgfSBlbHNlIGlmICh0aGlzLnF1ZXN0aW9uLnRlbXBsYXRlSWQgPT09IFwibWNxLWdyaWQtc3BsaXRcIikge1xuICAgICAgdGhpcy5sYXlvdXQgPSAnTVVMVElJTUFHRUdSSUQnO1xuICAgIH1cbiAgICB0aGlzLnJlbmRlckxhdGV4KCk7XG4gICAgdGhpcy5tY3FRdWVzdGlvbiA9IHRoaXMuZG9tU2FuaXRpemVyLnNhbml0aXplKFNlY3VyaXR5Q29udGV4dC5IVE1MLFxuICAgICAgdGhpcy5kb21TYW5pdGl6ZXIuYnlwYXNzU2VjdXJpdHlUcnVzdEh0bWwodGhpcy5xdWVzdGlvbi5ib2R5KSk7XG4gICAgdGhpcy5vcHRpb25zID0gdGhpcy5xdWVzdGlvbi5pbnRlcmFjdGlvbnNba2V5XS5vcHRpb25zO1xuICAgIHRoaXMuaW5pdE9wdGlvbnMoKTtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICBjb25zdCBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ21jcS1vcHRpb25zJyk7XG4gICAgaWYgKGVsICE9IG51bGwgJiYgZWwubGVuZ3RoID4gMCkge1xuICAgICAgZWxbMF0ucmVtb3ZlKCk7XG4gICAgfVxuICB9XG5cbiAgaW5pdE9wdGlvbnMoKSB7XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLm9wdGlvbnMubGVuZ3RoOyBqKyspIHtcbiAgICAgIGxldCBpbWFnZVVybDtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnNbal0udXJsKSB7XG4gICAgICAgIGltYWdlVXJsID0gdGhpcy5vcHRpb25zW2pdLnVybDtcbiAgICAgIH1cbiAgICAgIGNvbnN0IG9wdGlvbiA9IHRoaXMub3B0aW9uc1tqXTtcbiAgICAgIGNvbnN0IG9wdGlvblZhbHVlID0gb3B0aW9uLnZhbHVlLmJvZHk7XG4gICAgICBjb25zdCBvcHRpb25IdG1sID0gdGhpcy5kb21TYW5pdGl6ZXIuc2FuaXRpemUoU2VjdXJpdHlDb250ZXh0LkhUTUwsIHRoaXMuZG9tU2FuaXRpemVyLmJ5cGFzc1NlY3VyaXR5VHJ1c3RIdG1sKG9wdGlvblZhbHVlKSk7XG4gICAgICBjb25zdCBzZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgY29uc3Qgb3B0aW9uVG9CZVB1c2hlZDogYW55ID0ge307XG4gICAgICBvcHRpb25Ub0JlUHVzaGVkLmluZGV4ID0gajtcbiAgICAgIG9wdGlvblRvQmVQdXNoZWQub3B0aW9uSHRtbCA9IG9wdGlvbkh0bWw7XG4gICAgICBvcHRpb25Ub0JlUHVzaGVkLnNlbGVjdGVkID0gc2VsZWN0ZWQ7XG4gICAgICBvcHRpb25Ub0JlUHVzaGVkLnVybCA9IGltYWdlVXJsO1xuICAgICAgdGhpcy5tY3FPcHRpb25zLnB1c2gob3B0aW9uVG9CZVB1c2hlZCk7XG4gICAgfVxuICB9XG5cblxuXG4gIHJlbmRlckxhdGV4KCkge1xuICAgIGNvbnN0IF9pbnN0YW5jZSA9IHRoaXM7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICBfaW5zdGFuY2UucmVwbGFjZUxhdGV4VGV4dCgpO1xuICAgICAgY29uc3QgaW1hZ2VzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2ltZycpO1xuICAgICAgaWYgKGltYWdlcyAhPSBudWxsICYmIGltYWdlcy5sZW5ndGggPiAwKSB7XG4gICAgICB9XG4gICAgfSwgMTAwKTtcbiAgfVxuXG4gIHJlcGxhY2VMYXRleFRleHQoKSB7XG4gICAgY29uc3QgcXVlc3Rpb25FbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZGVudGlmaWVyKTtcbiAgICBpZiAocXVlc3Rpb25FbGVtZW50ICE9IG51bGwpIHtcbiAgICAgIGNvbnN0IG1hdGhUZXh0RGl2cyA9IHF1ZXN0aW9uRWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdtYXRoVGV4dCcpO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXRoVGV4dERpdnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgbWF0aEV4cCA9IG1hdGhUZXh0RGl2c1tpXTtcbiAgICAgICAgY29uc3QgdGV4dFRvUmVuZGVyID0gbWF0aEV4cC5pbm5lckhUTUw7XG4gICAgICAgIGthdGV4LnJlbmRlcih0ZXh0VG9SZW5kZXIsIG1hdGhFeHAsIHsgZGlzcGxheU1vZGU6IGZhbHNlLCBvdXRwdXQ6ICdodG1sJywgdGhyb3dPbkVycm9yOiB0cnVlIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG9uT3B0aW9uU2VsZWN0KGV2ZW50KSB7XG4gICAgY29uc3QgbWNxT3B0aW9uID0gZXZlbnQub3B0aW9uO1xuICAgIGNvbnN0IHNvbHV0aW9ucyA9IGV2ZW50LnNvbHV0aW9ucztcbiAgICB0aGlzLm1jcU9wdGlvbnMuZm9yRWFjaChtY3FPcHRpb25FbGVtZW50ID0+IHtcbiAgICAgIGlmIChtY3FPcHRpb25FbGVtZW50LmluZGV4ID09PSBldmVudC5vcHRpb24uaW5kZXgpIHtcbiAgICAgICAgbWNxT3B0aW9uRWxlbWVudC5zZWxlY3RlZCA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtY3FPcHRpb25FbGVtZW50LnNlbGVjdGVkID0gZmFsc2U7XG4gICAgICB9XG4gICAgfSk7XG4gICAgbWNxT3B0aW9uLnNvbHV0aW9ucyA9IHNvbHV0aW9ucztcbiAgICB0aGlzLmdldFNlbGVjdGVkT3B0aW9uQW5kUmVzdWx0KG1jcU9wdGlvbik7XG5cbiAgfVxuICBvcHRpb25TZWxlY3RlZEluSW1hZ2UoZXZlbnQpIHtcbiAgICB0aGlzLm9uT3B0aW9uU2VsZWN0KGV2ZW50KTtcbiAgfVxuXG4gIGdldFNlbGVjdGVkT3B0aW9uQW5kUmVzdWx0KG9wdGlvbk9iaikge1xuICAgIHRoaXMub3B0aW9uU2VsZWN0ZWQuZW1pdChvcHRpb25PYmopO1xuICB9XG5cbiAgc2hvd1BvcHVwKCkge1xuICAgIHRoaXMuc2hvd1F1bWxQb3B1cCA9IHRydWU7XG4gIH1cblxuICBjbG9zZVBvcFVwKCkge1xuICAgIHRoaXMuc2hvd1F1bWxQb3B1cCA9IGZhbHNlO1xuICB9XG5cbn1cbiJdfQ==