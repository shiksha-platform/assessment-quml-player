/**
 * @fileoverview added by tsickle
 * Generated from: lib/sa/sa.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
export class SaComponent {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2EuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHByb2plY3Qtc3VuYmlyZC9zdW5iaXJkLXF1bWwtcGxheWVyLXY5LyIsInNvdXJjZXMiOlsibGliL3NhL3NhLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBaUIsU0FBUyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQXFCLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6RyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFPekQsTUFBTSxPQUFPLFdBQVc7Ozs7SUFZdEIsWUFBb0IsWUFBMEI7UUFBMUIsaUJBQVksR0FBWixZQUFZLENBQWM7UUFQcEMsb0JBQWUsR0FBRyxJQUFJLFlBQVksRUFBTyxDQUFDO1FBQzFDLHNCQUFpQixHQUFHLElBQUksWUFBWSxFQUFPLENBQUM7UUFFdEQsZUFBVSxHQUFHLEtBQUssQ0FBQztJQUlnQyxDQUFDOzs7O0lBRXBELFdBQVc7O1FBQ1QsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2pCLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO1NBQ3pCO2FBQU0sVUFBSSxJQUFJLENBQUMsU0FBUywwQ0FBRSxhQUFhLEVBQUU7WUFDeEMsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7U0FDeEI7SUFDSCxDQUFDOzs7O0lBRUQsZ0JBQWdCO1FBQ2QsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7UUFDdkIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQztZQUMxQixVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVU7U0FDNUIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQzs7Ozs7SUFFRCxPQUFPLENBQUMsS0FBSztRQUNYLElBQUksS0FBSyxDQUFDLE9BQU8sS0FBSyxFQUFFLEVBQUU7WUFDeEIsS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO1lBQ3hCLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1NBQ3pCO0lBQ0gsQ0FBQzs7OztJQUVELDJCQUEyQjs7Y0FDbkIsUUFBUSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsbUJBQUEsUUFBUSxDQUFDLHNCQUFzQixDQUFDLGFBQWEsQ0FBQyxFQUE2QixDQUFDO1FBQ3hHLFFBQVEsQ0FBQyxPQUFPOzs7O1FBQUMsQ0FBQyxPQUFvQixFQUFFLEVBQUU7WUFDeEMsSUFBSSxPQUFPLENBQUMsWUFBWSxFQUFFOztzQkFDbEIsUUFBUSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUMxRCxRQUFRLENBQUMsT0FBTzs7OztnQkFBQyxDQUFDLEtBQWtCLEVBQUUsRUFBRTtvQkFDcEMsS0FBSyxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ3pDLENBQUMsRUFBQyxDQUFDO2FBQ0o7UUFDSCxDQUFDLEVBQUMsQ0FBQztJQUNMLENBQUM7Ozs7SUFFRCxRQUFRO1FBQ04sSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQztRQUNwQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDO1FBQ3BDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUM7UUFDMUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsT0FBTzs7OztRQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ3JDLElBQUksR0FBRyxDQUFDLElBQUksS0FBSyxPQUFPLElBQUksR0FBRyxDQUFDLElBQUksS0FBSyxPQUFPLEVBQUU7Z0JBQ2hELElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLE9BQU87Ozs7Z0JBQUMsQ0FBQyxDQUFDLEVBQUU7b0JBQy9CLElBQUksR0FBRyxDQUFDLEtBQUssS0FBSyxDQUFDLENBQUMsRUFBRSxFQUFFO3dCQUN0QixJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7NEJBQ2hCLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQzt5QkFDbkU7NkJBQU07NEJBQ0wsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7eUJBQ2pEO3dCQUVELElBQUksQ0FBQyxDQUFDLFNBQVMsRUFBRTs0QkFDZixHQUFHLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUM7eUJBQzdCO3FCQUNGO2dCQUNILENBQUMsRUFBQyxDQUFDO2FBQ0o7UUFDSCxDQUFDLEVBQUMsQ0FBQztJQUNMLENBQUM7Ozs7SUFFRCxlQUFlO1FBQ2IsSUFBSSxDQUFDLDJCQUEyQixFQUFFLENBQUE7SUFDcEMsQ0FBQzs7O1lBOUVGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsU0FBUztnQkFDbkIsdXJEQUFrQzs7YUFFbkM7Ozs7WUFOUSxZQUFZOzs7d0JBU2xCLEtBQUs7dUJBQ0wsS0FBSztzQkFDTCxLQUFLOzhCQUNMLE1BQU07Z0NBQ04sTUFBTTs7OztJQUpQLGdDQUF5Qjs7SUFDekIsK0JBQTRCOztJQUM1Qiw4QkFBeUI7O0lBQ3pCLHNDQUFvRDs7SUFDcEQsd0NBQXNEOztJQUV0RCxpQ0FBbUI7O0lBQ25CLGdDQUFlOztJQUNmLCtCQUFjOztJQUNkLDZCQUFZOztJQUNDLG1DQUFpQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFmdGVyVmlld0luaXQsIENvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT25DaGFuZ2VzLCBPbkluaXQsIE91dHB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRG9tU2FuaXRpemVyIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3F1bWwtc2EnLFxuICB0ZW1wbGF0ZVVybDogJy4vc2EuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9zYS5jb21wb25lbnQuc2NzcycsICcuLi9xdW1sLWxpYnJhcnkuY29tcG9uZW50LnNjc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBTYUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBBZnRlclZpZXdJbml0IHtcblxuICBASW5wdXQoKSBxdWVzdGlvbnM/OiBhbnk7XG4gIEBJbnB1dCgpIHJlcGxheWVkPzogYm9vbGVhbjtcbiAgQElucHV0KCkgYmFzZVVybDogc3RyaW5nO1xuICBAT3V0cHV0KCkgY29tcG9uZW50TG9hZGVkID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBPdXRwdXQoKSBzaG93QW5zd2VyQ2xpY2tlZCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIHNob3dBbnN3ZXIgPSBmYWxzZTtcbiAgc29sdXRpb25zOiBhbnk7XG4gIHF1ZXN0aW9uOiBhbnk7XG4gIGFuc3dlcjogYW55O1xuICBjb25zdHJ1Y3RvciggcHVibGljIGRvbVNhbml0aXplcjogRG9tU2FuaXRpemVyICkgeyB9XG5cbiAgbmdPbkNoYW5nZXMoKSB7XG4gICAgaWYgKHRoaXMucmVwbGF5ZWQpIHtcbiAgICAgIHRoaXMuc2hvd0Fuc3dlciA9IGZhbHNlO1xuICAgIH0gZWxzZSBpZiAodGhpcy5xdWVzdGlvbnM/LmlzQW5zd2VyU2hvd24pIHtcbiAgICAgIHRoaXMuc2hvd0Fuc3dlciA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgc2hvd0Fuc3dlclRvVXNlcigpIHtcbiAgICB0aGlzLnNob3dBbnN3ZXIgPSB0cnVlO1xuICAgIHRoaXMuc2hvd0Fuc3dlckNsaWNrZWQuZW1pdCh7XG4gICAgICBzaG93QW5zd2VyOiB0aGlzLnNob3dBbnN3ZXJcbiAgICB9KTtcbiAgfVxuXG4gIG9uRW50ZXIoZXZlbnQpIHtcbiAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gMTMpIHtcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgdGhpcy5zaG93QW5zd2VyVG9Vc2VyKCk7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlS2V5Ym9hcmRBY2Nlc3NpYmlsaXR5KCkge1xuICAgIGNvbnN0IGVsZW1lbnRzID0gQXJyYXkuZnJvbShkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdvcHRpb24tYm9keScpIGFzIEhUTUxDb2xsZWN0aW9uT2Y8RWxlbWVudD4pO1xuICAgIGVsZW1lbnRzLmZvckVhY2goKGVsZW1lbnQ6IEhUTUxFbGVtZW50KSA9PiB7XG4gICAgICBpZiAoZWxlbWVudC5vZmZzZXRIZWlnaHQpIHtcbiAgICAgICAgY29uc3QgY2hpbGRyZW4gPSBBcnJheS5mcm9tKGVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChcImFcIikpO1xuICAgICAgICBjaGlsZHJlbi5mb3JFYWNoKChjaGlsZDogSFRNTEVsZW1lbnQpID0+IHtcbiAgICAgICAgICAgIGNoaWxkLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnLTEnKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLnF1ZXN0aW9uID0gdGhpcy5xdWVzdGlvbnMuYm9keTtcbiAgICB0aGlzLmFuc3dlciA9IHRoaXMucXVlc3Rpb25zLmFuc3dlcjtcbiAgICB0aGlzLnNvbHV0aW9ucyA9IHRoaXMucXVlc3Rpb25zLnNvbHV0aW9ucztcbiAgICB0aGlzLnF1ZXN0aW9ucy5zb2x1dGlvbnMuZm9yRWFjaChlbGUgPT4ge1xuICAgICAgaWYgKGVsZS50eXBlID09PSAndmlkZW8nIHx8IGVsZS50eXBlID09PSAnaW1hZ2UnKSB7XG4gICAgICAgIHRoaXMucXVlc3Rpb25zLm1lZGlhLmZvckVhY2goZSA9PiB7XG4gICAgICAgICAgaWYgKGVsZS52YWx1ZSA9PT0gZS5pZCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuYmFzZVVybCkge1xuICAgICAgICAgICAgICBlbGUuc3JjID0gYCR7dGhpcy5iYXNlVXJsfS8ke3RoaXMucXVlc3Rpb25zLmlkZW50aWZpZXJ9LyR7ZS5zcmN9YDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGVsZS5zcmMgPSBlLmJhc2VVcmwgPyBlLmJhc2VVcmwgKyBlLnNyYyA6IGUuc3JjO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZS50aHVtYm5haWwpIHtcbiAgICAgICAgICAgICAgZWxlLnRodW1ibmFpbCA9IGUudGh1bWJuYWlsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IFxuICAgIH0pO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHRoaXMuaGFuZGxlS2V5Ym9hcmRBY2Nlc3NpYmlsaXR5KClcbiAgfVxufVxuIl19