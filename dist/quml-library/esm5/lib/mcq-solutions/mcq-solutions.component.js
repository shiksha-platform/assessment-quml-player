/**
 * @fileoverview added by tsickle
 * Generated from: lib/mcq-solutions/mcq-solutions.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
var McqSolutionsComponent = /** @class */ (function () {
    function McqSolutionsComponent() {
        this.close = new EventEmitter();
    }
    /**
     * @return {?}
     */
    McqSolutionsComponent.prototype.closeSolution = /**
     * @return {?}
     */
    function () {
        if (this.solutionVideoPlayer) {
            this.solutionVideoPlayer.nativeElement.pause();
        }
        this.close.emit({
            close: true
        });
    };
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
    return McqSolutionsComponent;
}());
export { McqSolutionsComponent };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWNxLXNvbHV0aW9ucy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AcHJvamVjdC1zdW5iaXJkL3N1bmJpcmQtcXVtbC1wbGF5ZXItdjkvIiwic291cmNlcyI6WyJsaWIvbWNxLXNvbHV0aW9ucy9tY3Etc29sdXRpb25zLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUU5RjtJQUFBO1FBU1ksVUFBSyxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7SUFnQnZDLENBQUM7Ozs7SUFUQyw2Q0FBYTs7O0lBQWI7UUFDRSxJQUFJLElBQUksQ0FBQyxtQkFBbUIsRUFBRTtZQUM1QixJQUFJLENBQUMsbUJBQW1CLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxDQUFDO1NBQ2hEO1FBQ0QsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7WUFDZCxLQUFLLEVBQUUsSUFBSTtTQUNaLENBQUMsQ0FBQztJQUNMLENBQUM7O2dCQXZCRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLG9CQUFvQjtvQkFDOUIsaXZEQUE2Qzs7aUJBRTlDOzs7MkJBRUUsS0FBSzswQkFDTCxLQUFLOzRCQUNMLEtBQUs7d0JBQ0wsTUFBTTtzQ0FDTixTQUFTLFNBQUMscUJBQXFCLEVBQUcsRUFBQyxNQUFNLEVBQUUsSUFBSSxFQUFDOztJQWVuRCw0QkFBQztDQUFBLEFBekJELElBeUJDO1NBcEJZLHFCQUFxQjs7O0lBQ2hDLHlDQUF1Qjs7SUFDdkIsd0NBQXNCOztJQUN0QiwwQ0FBd0I7O0lBQ3hCLHNDQUFxQzs7SUFDckMsb0RBQW1GOztJQUVuRixrREFBMkI7O0lBQzNCLHNEQUFtQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyLCBWaWV3Q2hpbGQsIEVsZW1lbnRSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAncXVtbC1tY3Etc29sdXRpb25zJyxcbiAgdGVtcGxhdGVVcmw6ICcuL21jcS1zb2x1dGlvbnMuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9tY3Etc29sdXRpb25zLmNvbXBvbmVudC5zY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgTWNxU29sdXRpb25zQ29tcG9uZW50ICB7XG4gIEBJbnB1dCgpIHF1ZXN0aW9uOiBhbnk7XG4gIEBJbnB1dCgpIG9wdGlvbnM6IGFueTtcbiAgQElucHV0KCkgc29sdXRpb25zOiBhbnk7XG4gIEBPdXRwdXQoKSBjbG9zZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQFZpZXdDaGlsZCgnc29sdXRpb25WaWRlb1BsYXllcicgLCB7c3RhdGljOiB0cnVlfSkgc29sdXRpb25WaWRlb1BsYXllcjogRWxlbWVudFJlZjtcbiAgXG4gIHNob3dWaWRlb1NvbHV0aW9uOiBib29sZWFuO1xuICBwcmV2aW91c0FjdGl2ZUVsZW1lbnQ6IEhUTUxFbGVtZW50O1xuXG5cbiAgY2xvc2VTb2x1dGlvbigpIHtcbiAgICBpZiAodGhpcy5zb2x1dGlvblZpZGVvUGxheWVyKSB7XG4gICAgICB0aGlzLnNvbHV0aW9uVmlkZW9QbGF5ZXIubmF0aXZlRWxlbWVudC5wYXVzZSgpO1xuICAgIH1cbiAgICB0aGlzLmNsb3NlLmVtaXQoe1xuICAgICAgY2xvc2U6IHRydWVcbiAgICB9KTtcbiAgfVxuXG59XG4iXX0=