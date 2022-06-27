/**
 * @fileoverview added by tsickle
 * Generated from: lib/sa/sa.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
var SaComponent = /** @class */ (function () {
    function SaComponent(domSanitizer) {
        this.domSanitizer = domSanitizer;
        this.componentLoaded = new EventEmitter();
        this.showAnswerClicked = new EventEmitter();
        this.showAnswer = false;
    }
    /**
     * @return {?}
     */
    SaComponent.prototype.ngOnChanges = /**
     * @return {?}
     */
    function () {
        var _a;
        if (this.replayed) {
            this.showAnswer = false;
        }
        else if ((_a = this.questions) === null || _a === void 0 ? void 0 : _a.isAnswerShown) {
            this.showAnswer = true;
        }
    };
    /**
     * @return {?}
     */
    SaComponent.prototype.showAnswerToUser = /**
     * @return {?}
     */
    function () {
        this.showAnswer = true;
        this.showAnswerClicked.emit({
            showAnswer: this.showAnswer
        });
    };
    /**
     * @param {?} event
     * @return {?}
     */
    SaComponent.prototype.onEnter = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        if (event.keyCode === 13) {
            event.stopPropagation();
            this.showAnswerToUser();
        }
    };
    /**
     * @return {?}
     */
    SaComponent.prototype.handleKeyboardAccessibility = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var elements = Array.from((/** @type {?} */ (document.getElementsByClassName('option-body'))));
        elements.forEach((/**
         * @param {?} element
         * @return {?}
         */
        function (element) {
            if (element.offsetHeight) {
                /** @type {?} */
                var children = Array.from(element.querySelectorAll("a"));
                children.forEach((/**
                 * @param {?} child
                 * @return {?}
                 */
                function (child) {
                    child.setAttribute('tabindex', '-1');
                }));
            }
        }));
    };
    /**
     * @return {?}
     */
    SaComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.question = this.questions.body;
        this.answer = this.questions.answer;
        this.solutions = this.questions.solutions;
        this.questions.solutions.forEach((/**
         * @param {?} ele
         * @return {?}
         */
        function (ele) {
            if (ele.type === 'video' || ele.type === 'image') {
                _this.questions.media.forEach((/**
                 * @param {?} e
                 * @return {?}
                 */
                function (e) {
                    if (ele.value === e.id) {
                        if (_this.baseUrl) {
                            ele.src = _this.baseUrl + "/" + _this.questions.identifier + "/" + e.src;
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
    };
    /**
     * @return {?}
     */
    SaComponent.prototype.ngAfterViewInit = /**
     * @return {?}
     */
    function () {
        this.handleKeyboardAccessibility();
    };
    SaComponent.decorators = [
        { type: Component, args: [{
                    selector: 'quml-sa',
                    template: "<div class=\"quml-sa\">\n  <div class=\"question-container\" tabindex=\"0\">\n    <div class=\"sa-title\">Question</div>\n    <div class=\"question\" [innerHTML]=\"question | safeHtml\"></div>\n  </div>\n  <div class=\"sa-button-container\">\n    <div *ngIf=\"!showAnswer\" id=\"submit-answer\" tabindex=\"0\" class=\"sb-btn sb-btn-primary sb-btn-normal sb-btn-radius\"\n      (click)=\"showAnswerToUser()\" (keydown)=\"onEnter($event)\">{{'show_answer' | translate}}</div>\n  </div>\n  <div id=\"answer-container\" [ngClass]=\"showAnswer ? 'option-container-blurred-out': 'option-container-blurred'\">\n    <div class=\"sa-title\" [attr.aria-hidden]=\"showAnswer ? null : true\">Answer</div>\n    <div class=\"option-body\" [innerHTML]=\"answer | safeHtml\" [attr.aria-hidden]=\"showAnswer ? null : true\"></div>\n    <ng-container *ngIf=\"solutions?.length\" [attr.aria-hidden]=\"showAnswer ? null : true\">\n      <div class=\"sa-title\">Solution</div>\n      <div class=\"solutions\" *ngFor=\"let solution of solutions\">\n        <ng-container [ngSwitch]=\"solution.type\">\n          <div *ngSwitchCase=\"'html'\" [innerHTML]=\"solution.value | safeHtml\" tabindex=\"-1\"></div>\n          <div *ngSwitchCase=\"'video'\">\n            <video width=\"400\" controls [poster]=\"solution.thumbnail\">\n              <source [src]=\"solution.src\" type=\"video/mp4\">\n              <source [src]=\"solution.src\" type=\"video/webm\">\n            </video>\n          </div>\n          <div *ngSwitchCase=\"'image'\">\n            <img [src]=\"solution.src\" alt=\"Subjective question solution with image\">\n          </div>\n        </ng-container>\n      </div>\n    </ng-container>\n  </div>\n</div>\n",
                    styles: [".sa-title{color:var(--primary-color);font-size:.875rem;font-weight:500;margin:16px 0;clear:both}.question-container{margin-top:2.5rem}.sa-button-container{text-align:center;margin-bottom:1rem;margin-top:1rem;clear:both}.option-container-blurred{filter:blur(.25rem);pointer-events:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;clear:both}.option-container-blurred-out{filter:unset;transition:.4s;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text;user-select:text;pointer-events:auto}.solutions{clear:both}", ".answer{border:1px solid;padding:.2em;margin:.5em}.icon{width:15%;max-width:70px;min-width:50px;display:inline-block;vertical-align:top}.mcqText{display:inline-block;word-break:break-word}.mcq-option{background:var(--white);border-radius:5px;margin:8px 16px;padding:8px}.options{word-break:break-all;padding:15px 5px}.even,.odd{width:47%;display:inline-block;vertical-align:middle}.column-block{display:inline-block;width:48%;vertical-align:middle}.selected{background:var(--primary-color);color:var(--white);box-shadow:1px 2px 1px 3px var(--black)}.mathText{display:inline!important}.padding-top{padding-top:16px}@media only screen and (min-width:100px) and (max-width:481px){.mcqText{width:75%}.even,.odd{width:38%;display:inline-block;vertical-align:middle}.column-block{display:inline-block;width:42%;vertical-align:middle}}@media only screen and (min-width:481px) and (max-width:800px){.mcqText{width:85%}.even,.odd{width:43%;display:inline-block;vertical-align:middle}.column-block{display:inline-block;width:45%;vertical-align:middle}}@media only screen and (min-width:801px) and (max-width:1200px){.even,.odd{width:45%}.column-block{display:inline-block;width:45%;vertical-align:middle}}"]
                }] }
    ];
    /** @nocollapse */
    SaComponent.ctorParameters = function () { return [
        { type: DomSanitizer }
    ]; };
    SaComponent.propDecorators = {
        questions: [{ type: Input }],
        replayed: [{ type: Input }],
        baseUrl: [{ type: Input }],
        componentLoaded: [{ type: Output }],
        showAnswerClicked: [{ type: Output }]
    };
    return SaComponent;
}());
export { SaComponent };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2EuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHByb2plY3Qtc3VuYmlyZC9zdW5iaXJkLXF1bWwtcGxheWVyLXY5LyIsInNvdXJjZXMiOlsibGliL3NhL3NhLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBaUIsU0FBUyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQXFCLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6RyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFFekQ7SUFpQkUscUJBQW9CLFlBQTBCO1FBQTFCLGlCQUFZLEdBQVosWUFBWSxDQUFjO1FBUHBDLG9CQUFlLEdBQUcsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUMxQyxzQkFBaUIsR0FBRyxJQUFJLFlBQVksRUFBTyxDQUFDO1FBRXRELGVBQVUsR0FBRyxLQUFLLENBQUM7SUFJZ0MsQ0FBQzs7OztJQUVwRCxpQ0FBVzs7O0lBQVg7O1FBQ0UsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2pCLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO1NBQ3pCO2FBQU0sVUFBSSxJQUFJLENBQUMsU0FBUywwQ0FBRSxhQUFhLEVBQUU7WUFDeEMsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7U0FDeEI7SUFDSCxDQUFDOzs7O0lBRUQsc0NBQWdCOzs7SUFBaEI7UUFDRSxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztRQUN2QixJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDO1lBQzFCLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVTtTQUM1QixDQUFDLENBQUM7SUFDTCxDQUFDOzs7OztJQUVELDZCQUFPOzs7O0lBQVAsVUFBUSxLQUFLO1FBQ1gsSUFBSSxLQUFLLENBQUMsT0FBTyxLQUFLLEVBQUUsRUFBRTtZQUN4QixLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7WUFDeEIsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7U0FDekI7SUFDSCxDQUFDOzs7O0lBRUQsaURBQTJCOzs7SUFBM0I7O1lBQ1EsUUFBUSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsbUJBQUEsUUFBUSxDQUFDLHNCQUFzQixDQUFDLGFBQWEsQ0FBQyxFQUE2QixDQUFDO1FBQ3hHLFFBQVEsQ0FBQyxPQUFPOzs7O1FBQUMsVUFBQyxPQUFvQjtZQUNwQyxJQUFJLE9BQU8sQ0FBQyxZQUFZLEVBQUU7O29CQUNsQixRQUFRLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQzFELFFBQVEsQ0FBQyxPQUFPOzs7O2dCQUFDLFVBQUMsS0FBa0I7b0JBQ2hDLEtBQUssQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUN6QyxDQUFDLEVBQUMsQ0FBQzthQUNKO1FBQ0gsQ0FBQyxFQUFDLENBQUM7SUFDTCxDQUFDOzs7O0lBRUQsOEJBQVE7OztJQUFSO1FBQUEsaUJBcUJDO1FBcEJDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUM7UUFDcEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQztRQUNwQyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDO1FBQzFDLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLE9BQU87Ozs7UUFBQyxVQUFBLEdBQUc7WUFDbEMsSUFBSSxHQUFHLENBQUMsSUFBSSxLQUFLLE9BQU8sSUFBSSxHQUFHLENBQUMsSUFBSSxLQUFLLE9BQU8sRUFBRTtnQkFDaEQsS0FBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsT0FBTzs7OztnQkFBQyxVQUFBLENBQUM7b0JBQzVCLElBQUksR0FBRyxDQUFDLEtBQUssS0FBSyxDQUFDLENBQUMsRUFBRSxFQUFFO3dCQUN0QixJQUFJLEtBQUksQ0FBQyxPQUFPLEVBQUU7NEJBQ2hCLEdBQUcsQ0FBQyxHQUFHLEdBQU0sS0FBSSxDQUFDLE9BQU8sU0FBSSxLQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsU0FBSSxDQUFDLENBQUMsR0FBSyxDQUFDO3lCQUNuRTs2QkFBTTs0QkFDTCxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQzt5QkFDakQ7d0JBRUQsSUFBSSxDQUFDLENBQUMsU0FBUyxFQUFFOzRCQUNmLEdBQUcsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQzt5QkFDN0I7cUJBQ0Y7Z0JBQ0gsQ0FBQyxFQUFDLENBQUM7YUFDSjtRQUNILENBQUMsRUFBQyxDQUFDO0lBQ0wsQ0FBQzs7OztJQUVELHFDQUFlOzs7SUFBZjtRQUNFLElBQUksQ0FBQywyQkFBMkIsRUFBRSxDQUFBO0lBQ3BDLENBQUM7O2dCQTlFRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLFNBQVM7b0JBQ25CLHVyREFBa0M7O2lCQUVuQzs7OztnQkFOUSxZQUFZOzs7NEJBU2xCLEtBQUs7MkJBQ0wsS0FBSzswQkFDTCxLQUFLO2tDQUNMLE1BQU07b0NBQ04sTUFBTTs7SUFvRVQsa0JBQUM7Q0FBQSxBQS9FRCxJQStFQztTQTFFWSxXQUFXOzs7SUFFdEIsZ0NBQXlCOztJQUN6QiwrQkFBNEI7O0lBQzVCLDhCQUF5Qjs7SUFDekIsc0NBQW9EOztJQUNwRCx3Q0FBc0Q7O0lBRXRELGlDQUFtQjs7SUFDbkIsZ0NBQWU7O0lBQ2YsK0JBQWM7O0lBQ2QsNkJBQVk7O0lBQ0MsbUNBQWlDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWZ0ZXJWaWV3SW5pdCwgQ29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIElucHV0LCBPbkNoYW5nZXMsIE9uSW5pdCwgT3V0cHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBEb21TYW5pdGl6ZXIgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAncXVtbC1zYScsXG4gIHRlbXBsYXRlVXJsOiAnLi9zYS5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3NhLmNvbXBvbmVudC5zY3NzJywgJy4uL3F1bWwtbGlicmFyeS5jb21wb25lbnQuc2NzcyddXG59KVxuZXhwb3J0IGNsYXNzIFNhQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIEFmdGVyVmlld0luaXQge1xuXG4gIEBJbnB1dCgpIHF1ZXN0aW9ucz86IGFueTtcbiAgQElucHV0KCkgcmVwbGF5ZWQ/OiBib29sZWFuO1xuICBASW5wdXQoKSBiYXNlVXJsOiBzdHJpbmc7XG4gIEBPdXRwdXQoKSBjb21wb25lbnRMb2FkZWQgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgpIHNob3dBbnN3ZXJDbGlja2VkID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgc2hvd0Fuc3dlciA9IGZhbHNlO1xuICBzb2x1dGlvbnM6IGFueTtcbiAgcXVlc3Rpb246IGFueTtcbiAgYW5zd2VyOiBhbnk7XG4gIGNvbnN0cnVjdG9yKCBwdWJsaWMgZG9tU2FuaXRpemVyOiBEb21TYW5pdGl6ZXIgKSB7IH1cblxuICBuZ09uQ2hhbmdlcygpIHtcbiAgICBpZiAodGhpcy5yZXBsYXllZCkge1xuICAgICAgdGhpcy5zaG93QW5zd2VyID0gZmFsc2U7XG4gICAgfSBlbHNlIGlmICh0aGlzLnF1ZXN0aW9ucz8uaXNBbnN3ZXJTaG93bikge1xuICAgICAgdGhpcy5zaG93QW5zd2VyID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBzaG93QW5zd2VyVG9Vc2VyKCkge1xuICAgIHRoaXMuc2hvd0Fuc3dlciA9IHRydWU7XG4gICAgdGhpcy5zaG93QW5zd2VyQ2xpY2tlZC5lbWl0KHtcbiAgICAgIHNob3dBbnN3ZXI6IHRoaXMuc2hvd0Fuc3dlclxuICAgIH0pO1xuICB9XG5cbiAgb25FbnRlcihldmVudCkge1xuICAgIGlmIChldmVudC5rZXlDb2RlID09PSAxMykge1xuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICB0aGlzLnNob3dBbnN3ZXJUb1VzZXIoKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVLZXlib2FyZEFjY2Vzc2liaWxpdHkoKSB7XG4gICAgY29uc3QgZWxlbWVudHMgPSBBcnJheS5mcm9tKGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ29wdGlvbi1ib2R5JykgYXMgSFRNTENvbGxlY3Rpb25PZjxFbGVtZW50Pik7XG4gICAgZWxlbWVudHMuZm9yRWFjaCgoZWxlbWVudDogSFRNTEVsZW1lbnQpID0+IHtcbiAgICAgIGlmIChlbGVtZW50Lm9mZnNldEhlaWdodCkge1xuICAgICAgICBjb25zdCBjaGlsZHJlbiA9IEFycmF5LmZyb20oZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiYVwiKSk7XG4gICAgICAgIGNoaWxkcmVuLmZvckVhY2goKGNoaWxkOiBIVE1MRWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgY2hpbGQuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICctMScpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMucXVlc3Rpb24gPSB0aGlzLnF1ZXN0aW9ucy5ib2R5O1xuICAgIHRoaXMuYW5zd2VyID0gdGhpcy5xdWVzdGlvbnMuYW5zd2VyO1xuICAgIHRoaXMuc29sdXRpb25zID0gdGhpcy5xdWVzdGlvbnMuc29sdXRpb25zO1xuICAgIHRoaXMucXVlc3Rpb25zLnNvbHV0aW9ucy5mb3JFYWNoKGVsZSA9PiB7XG4gICAgICBpZiAoZWxlLnR5cGUgPT09ICd2aWRlbycgfHwgZWxlLnR5cGUgPT09ICdpbWFnZScpIHtcbiAgICAgICAgdGhpcy5xdWVzdGlvbnMubWVkaWEuZm9yRWFjaChlID0+IHtcbiAgICAgICAgICBpZiAoZWxlLnZhbHVlID09PSBlLmlkKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5iYXNlVXJsKSB7XG4gICAgICAgICAgICAgIGVsZS5zcmMgPSBgJHt0aGlzLmJhc2VVcmx9LyR7dGhpcy5xdWVzdGlvbnMuaWRlbnRpZmllcn0vJHtlLnNyY31gO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZWxlLnNyYyA9IGUuYmFzZVVybCA/IGUuYmFzZVVybCArIGUuc3JjIDogZS5zcmM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChlLnRodW1ibmFpbCkge1xuICAgICAgICAgICAgICBlbGUudGh1bWJuYWlsID0gZS50aHVtYm5haWw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gXG4gICAgfSk7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgdGhpcy5oYW5kbGVLZXlib2FyZEFjY2Vzc2liaWxpdHkoKVxuICB9XG59XG4iXX0=