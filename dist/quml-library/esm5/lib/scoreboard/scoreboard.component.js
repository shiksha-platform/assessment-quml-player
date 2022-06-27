/**
 * @fileoverview added by tsickle
 * Generated from: lib/scoreboard/scoreboard.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { fromEvent } from 'rxjs';
var ScoreboardComponent = /** @class */ (function () {
    function ScoreboardComponent() {
        this.submitClicked = new EventEmitter();
        this.emitQuestionNo = new EventEmitter();
        this.scoreBoardLoaded = new EventEmitter();
    }
    /**
     * @return {?}
     */
    ScoreboardComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this.scoreBoardLoaded.emit({
            scoreBoardLoaded: true
        });
        this.subscription = fromEvent(document, 'keydown').subscribe((/**
         * @param {?} e
         * @return {?}
         */
        function (e) {
            if (e['key'] === 'Enter') {
                e.stopPropagation();
                ((/** @type {?} */ (document.activeElement))).click();
            }
        }));
    };
    /**
     * @param {?} index
     * @param {?=} identifier
     * @return {?}
     */
    ScoreboardComponent.prototype.goToQuestion = /**
     * @param {?} index
     * @param {?=} identifier
     * @return {?}
     */
    function (index, identifier) {
        this.emitQuestionNo.emit({ questionNo: index, identifier: identifier });
    };
    /**
     * @return {?}
     */
    ScoreboardComponent.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this.subscription.unsubscribe();
    };
    ScoreboardComponent.decorators = [
        { type: Component, args: [{
                    selector: 'quml-scoreboard',
                    template: "<div class=\"scoreboard\">\n  <div class=\"scoreboard__header\">\n    <div class=\"scoreboard__title\">\n      {{'submit_message' | translate}}\n    </div>\n    <!-- <div class=\"scoreboard__subtitle\">\n      {{contentName}}\n    </div> -->\n  </div>\n\n  <div class=\"scoreboard__points\" *ngIf=\"!isSections && showFeedBack\">\n    <div *ngFor=\"let score of scores; let i = index\" class=\"scoreboard__index\" (click)=\"goToQuestion(i+1)\" tabindex=\"0\" attr.aria-label=\"question number {{score.index}}\"\n      [ngClass]=\"score.class\">\n      {{score.index}}\n    </div>\n  </div>\n\n  <div class=\"scoreboard__points\" *ngIf=\"!isSections && !showFeedBack\">\n    <div *ngFor=\"let score of scores; let i = index\" class=\"scoreboard__index\" (click)=\"goToQuestion(i+1)\" tabindex=\"0\" attr.aria-label=\"question number {{score.index}}\"\n      [ngClass]=\"score.class === 'skipped' ? score.class : score.class === 'unattempted' ? score.class : 'attempted'\">\n      {{score.index}}\n    </div>\n  </div>\n\n  <div class=\"sections-score-card\" *ngIf=\"isSections\">\n    <div *ngFor=\"let section of scores\">\n      <div class=\"sections-score-card__title\">{{section?.index}}</div>\n      <div class=\"sections-score-card__points\" *ngIf=\"showFeedBack\">\n        <div *ngFor=\"let score of section?.children; let i = index\" class=\"scoreboard__index\" tabindex=\"0\" attr.aria-label=\"question number {{score.index}}\"\n          (click)=\"goToQuestion(i+1, section.identifier)\" [ngClass]=\"score.class\">\n          {{score.index}}\n        </div>\n      </div>\n      <div class=\"sections-score-card__points\" *ngIf=\"!showFeedBack\">\n        <div *ngFor=\"let score of section?.children; let i = index\" class=\"scoreboard__index\" tabindex=\"0\" attr.aria-label=\"question number {{score.index}}\"\n          (click)=\"goToQuestion(i+1, section.identifier)\" [ngClass]=\"score.class\">\n          {{score.index}}\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <div class=\"scoreboard__btn-container\">\n    <button type=\"submit\" class=\"sb-btn action-button sb-btn-normal sb-btn-radius px-20 mx-20\" *ngIf=\"!isDurationExpired\"\n      (click)=\"submitClicked.emit({type:'back-clicked'})\">{{'back' | translate}}</button>\n    <button type=\"submit\" class=\"sb-btn action-button sb-btn-normal sb-btn-radius px-20\"\n      (click)=\"submitClicked.emit({type:'submit-clicked'})\">{{'submit' | translate}}</button>\n  </div>\n</div>\n",
                    styles: ["::ng-deep :root{--quml-scoreboard-sub-title:#6D7278;--quml-scoreboard-skipped:#969696;--quml-scoreboard-unattempted:#575757;--quml-color-success:#08BC82;--quml-color-danger:#F1635D;--quml-color-primary-contrast:#333}.scoreboard{display:flex;flex-direction:column;align-items:center;justify-content:center;width:100%;position:absolute;top:3.5rem;height:calc(100% - 56px);left:0;right:0}@media (max-width:767px){.scoreboard{top:0;height:calc(100% - 0px)}}.scoreboard__header{font-weight:700;text-align:center;line-height:normal}.scoreboard__title{color:var(--primary-color);font-size:1.25rem}.scoreboard__subtitle{color:var(--quml-scoreboard-sub-title);font-size:.875rem;margin-top:.5rem}.scoreboard__points{display:flex;flex-wrap:wrap;margin:1rem auto 0;width:100%;max-height:calc(100vh - 12rem);align-items:center;overflow-y:auto;justify-content:center}.scoreboard__index{font-size:.625rem;font-weight:500;border-radius:50%;width:1.5rem;height:1.5rem;display:flex;align-items:center;justify-content:center;margin:1rem 2rem;cursor:pointer}.scoreboard__index.skipped{color:var(--white);background:var(--quml-scoreboard-skipped);border:.0625rem solid var(--quml-scoreboard-skipped)}.scoreboard__index.correct,.scoreboard__index.partial,.scoreboard__index.wrong{color:var(--white);border:0 solid transparent}.scoreboard__index.correct{--correct-bg:var(--quml-color-success);background:var(--correct-bg)}.scoreboard__index.wrong{--wrong-bg:var( --quml-color-danger);background:var(--wrong-bg)}.scoreboard__index.partial{--partial-bg:linear-gradient(180deg, rgba(71,164,128,1) 0%, rgba(71,164,128,1) 50%, rgba(249,122,116,1) 50%, rgba(249,122,116,1) 100%);background:var(--partial-bg)}.scoreboard__index.unattempted{color:var(--quml-scoreboard-unattempted);border:.03125rem solid var(--quml-scoreboard-unattempted)}.scoreboard__index.unattempted:hover{border:.0625rem solid var(--primary-color);color:var(--primary-color)}.sections-score-card{width:100%;max-height:calc(100% - 20rem);overflow-y:auto;display:none}@media (max-width:767px){.sections-score-card{max-height:calc(100% - 8.125rem)}}.sections-score-card__title{width:100%;color:var(--quml-color-primary-contrast);font-size:.875rem;font-weight:700;text-align:center;margin-top:2rem;margin-bottom:.5rem}.sections-score-card__points{display:flex;flex-wrap:wrap;margin:1rem auto 0;width:100%;max-height:100%;align-items:center;overflow-y:auto;justify-content:center}.sections-score-card .action-button{background-color:#e5e5e5}"]
                }] }
    ];
    /** @nocollapse */
    ScoreboardComponent.ctorParameters = function () { return []; };
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
    return ScoreboardComponent;
}());
export { ScoreboardComponent };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NvcmVib2FyZC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AcHJvamVjdC1zdW5iaXJkL3N1bmJpcmQtcXVtbC1wbGF5ZXItdjkvIiwic291cmNlcyI6WyJsaWIvc2NvcmVib2FyZC9zY29yZWJvYXJkLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBcUIsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzFGLE9BQU8sRUFBRSxTQUFTLEVBQWdCLE1BQU0sTUFBTSxDQUFDO0FBRS9DO0lBaUJFO1FBTFUsa0JBQWEsR0FBRyxJQUFJLFlBQVksRUFBTyxDQUFDO1FBQ3hDLG1CQUFjLEdBQUcsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUN6QyxxQkFBZ0IsR0FBRyxJQUFJLFlBQVksRUFBTyxDQUFDO0lBR3JDLENBQUM7Ozs7SUFFakIsc0NBQVE7OztJQUFSO1FBQ0UsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQztZQUN6QixnQkFBZ0IsRUFBRSxJQUFJO1NBQ3ZCLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxZQUFZLEdBQUcsU0FBUyxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQyxTQUFTOzs7O1FBQUMsVUFBQyxDQUFnQjtZQUM1RSxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxPQUFPLEVBQUU7Z0JBQ3hCLENBQUMsQ0FBQyxlQUFlLEVBQUUsQ0FBQztnQkFDcEIsQ0FBQyxtQkFBQSxRQUFRLENBQUMsYUFBYSxFQUFnQixDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7YUFDbEQ7UUFDSCxDQUFDLEVBQUMsQ0FBQztJQUNMLENBQUM7Ozs7OztJQUVELDBDQUFZOzs7OztJQUFaLFVBQWEsS0FBYSxFQUFFLFVBQW1CO1FBQzdDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxVQUFVLFlBQUEsRUFBRSxDQUFDLENBQUM7SUFDOUQsQ0FBQzs7OztJQUVELHlDQUFXOzs7SUFBWDtRQUNFLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDbEMsQ0FBQzs7Z0JBdENGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsaUJBQWlCO29CQUMzQixpN0VBQTBDOztpQkFFM0M7Ozs7O3lCQUVFLEtBQUs7cUNBQ0wsS0FBSzs4QkFDTCxLQUFLOytCQUNMLEtBQUs7NkJBQ0wsS0FBSztvQ0FDTCxLQUFLO2dDQUNMLE1BQU07aUNBQ04sTUFBTTttQ0FDTixNQUFNOztJQXlCVCwwQkFBQztDQUFBLEFBdkNELElBdUNDO1NBbENZLG1CQUFtQjs7O0lBQzlCLHFDQUFxQjs7SUFDckIsaURBQW9DOztJQUNwQywwQ0FBNkI7O0lBQzdCLDJDQUErQjs7SUFDL0IseUNBQTZCOztJQUM3QixnREFBb0M7O0lBQ3BDLDRDQUFrRDs7SUFDbEQsNkNBQW1EOztJQUNuRCwrQ0FBcUQ7O0lBRXJELDJDQUEyQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT25EZXN0cm95LCBPbkluaXQsIE91dHB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgZnJvbUV2ZW50LCBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAncXVtbC1zY29yZWJvYXJkJyxcbiAgdGVtcGxhdGVVcmw6ICcuL3Njb3JlYm9hcmQuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9zY29yZWJvYXJkLmNvbXBvbmVudC5zY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgU2NvcmVib2FyZENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgQElucHV0KCkgc2NvcmVzOiBhbnk7XG4gIEBJbnB1dCgpIHRvdGFsTm9PZlF1ZXN0aW9uczogbnVtYmVyO1xuICBASW5wdXQoKSBjb250ZW50TmFtZTogc3RyaW5nO1xuICBASW5wdXQoKSBzaG93RmVlZEJhY2s6IGJvb2xlYW47XG4gIEBJbnB1dCgpIGlzU2VjdGlvbnM6IGJvb2xlYW47XG4gIEBJbnB1dCgpIGlzRHVyYXRpb25FeHBpcmVkOiBib29sZWFuO1xuICBAT3V0cHV0KCkgc3VibWl0Q2xpY2tlZCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCkgZW1pdFF1ZXN0aW9uTm8gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgpIHNjb3JlQm9hcmRMb2FkZWQgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBzdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcbiAgY29uc3RydWN0b3IoKSB7IH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLnNjb3JlQm9hcmRMb2FkZWQuZW1pdCh7XG4gICAgICBzY29yZUJvYXJkTG9hZGVkOiB0cnVlXG4gICAgfSk7XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbiA9IGZyb21FdmVudChkb2N1bWVudCwgJ2tleWRvd24nKS5zdWJzY3JpYmUoKGU6IEtleWJvYXJkRXZlbnQpID0+IHtcbiAgICAgIGlmIChlWydrZXknXSA9PT0gJ0VudGVyJykge1xuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAgYXMgSFRNTEVsZW1lbnQpLmNsaWNrKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBnb1RvUXVlc3Rpb24oaW5kZXg6IG51bWJlciwgaWRlbnRpZmllcj86IHN0cmluZykge1xuICAgIHRoaXMuZW1pdFF1ZXN0aW9uTm8uZW1pdCh7IHF1ZXN0aW9uTm86IGluZGV4LCBpZGVudGlmaWVyIH0pO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgfVxufVxuIl19