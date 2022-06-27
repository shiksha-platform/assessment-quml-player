/**
 * @fileoverview added by tsickle
 * Generated from: lib/alert/alert.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Output, EventEmitter, Input, HostListener } from '@angular/core';
import { fromEvent } from 'rxjs';
export class AlertComponent {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWxlcnQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHByb2plY3Qtc3VuYmlyZC9zdW5iaXJkLXF1bWwtcGxheWVyLXY5LyIsInNvdXJjZXMiOlsibGliL2FsZXJ0L2FsZXJ0LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQ0osWUFBWSxFQUMvQyxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsU0FBUyxFQUFnQixNQUFNLE1BQU0sQ0FBQztBQU8vQyxNQUFNLE9BQU8sY0FBYztJQUwzQjtRQVNZLGVBQVUsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ2hDLGlCQUFZLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUNsQyxhQUFRLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUd4QyxlQUFVLEdBQUcsS0FBSyxDQUFDO0lBcUVyQixDQUFDOzs7OztJQWxFc0QsZ0JBQWdCLENBQUMsS0FBb0I7UUFDeEYsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN0QixDQUFDOzs7O0lBS0QsUUFBUTtRQUNOLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO1FBQ3hCLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxtQkFBQSxRQUFRLENBQUMsYUFBYSxFQUFlLENBQUM7UUFDbkUsSUFBSSxDQUFDLFlBQVksR0FBRyxTQUFTLENBQUMsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDLFNBQVM7Ozs7UUFBQyxDQUFDLENBQWdCLEVBQUUsRUFBRTtZQUNoRixJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxLQUFLLEVBQUU7Z0JBQ3RCLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUM7O3NCQUVyQixPQUFPLEdBQUcsbUJBQUEsUUFBUSxDQUFDLGFBQWEsQ0FBQyw0QkFBNEIsQ0FBQyxFQUFlO2dCQUNuRixJQUFJLE9BQU8sRUFBRTtvQkFDWCxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUNwQixPQUFPLENBQUMsS0FBSyxFQUFFLENBQUM7b0JBQ2hCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO29CQUN2QixDQUFDLENBQUMsZUFBZSxFQUFFLENBQUM7aUJBQ3JCO2FBQ0Y7UUFDSCxDQUFDLEVBQUMsQ0FBQztJQUNMLENBQUM7Ozs7SUFFRCxlQUFlOztjQUNQLFNBQVMsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLG1CQUFtQixDQUFDO1FBRTdELFVBQVU7OztRQUFDLEdBQUcsRUFBRTs7a0JBQ1IsV0FBVyxHQUFHLG1CQUFBLFFBQVEsQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLEVBQWU7O2tCQUNuRSxhQUFhLEdBQUcsbUJBQUEsUUFBUSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFlOztrQkFDdkUsVUFBVSxHQUFHLG1CQUFBLFFBQVEsQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLEVBQWU7WUFFdkUsSUFBSSxJQUFJLENBQUMsU0FBUyxLQUFLLE9BQU8sRUFBRTtnQkFDOUIsV0FBVyxDQUFDLEtBQUssRUFBRSxDQUFDO2FBQ3JCO2lCQUFNLElBQUksSUFBSSxDQUFDLFNBQVMsS0FBSyxTQUFTLElBQUksSUFBSSxDQUFDLGtCQUFrQixFQUFFO2dCQUNsRSxhQUFhLENBQUMsS0FBSyxFQUFFLENBQUM7YUFDdkI7UUFDSCxDQUFDLEdBQUUsR0FBRyxDQUFDLENBQUM7SUFDVixDQUFDOzs7O0lBRUQsUUFBUTtRQUNOLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO1lBQ2pCLElBQUksRUFBRSxJQUFJO1NBQ1gsQ0FBQyxDQUFDO0lBQ0wsQ0FBQzs7OztJQUVELFlBQVk7UUFDVixJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQztZQUNyQixRQUFRLEVBQUUsSUFBSTtTQUNmLENBQUMsQ0FBQztJQUNMLENBQUM7Ozs7O0lBRUQsS0FBSyxDQUFDLElBQUk7UUFDUixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7SUFDakMsQ0FBQzs7OztJQUVELFdBQVc7UUFDVCxJQUFJLElBQUksQ0FBQyxxQkFBcUIsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDbEQsSUFBSSxDQUFDLHFCQUFxQixDQUFDLEtBQUssRUFBRSxDQUFDO1NBQ3BDO1FBRUQsSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQ3JCLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDakM7SUFDSCxDQUFDOzs7WUFsRkYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxZQUFZO2dCQUN0QixtL0RBQXFDOzthQUV0Qzs7O3dCQUVFLEtBQUs7OEJBQ0wsS0FBSztpQ0FDTCxLQUFLO3lCQUNMLE1BQU07MkJBQ04sTUFBTTt1QkFDTixNQUFNOytCQU1OLFlBQVksU0FBQyx5QkFBeUIsRUFBRSxDQUFDLFFBQVEsQ0FBQzs7OztJQVhuRCxtQ0FBd0I7O0lBQ3hCLHlDQUFrQzs7SUFDbEMsNENBQXFDOztJQUNyQyxvQ0FBMEM7O0lBQzFDLHNDQUE0Qzs7SUFDNUMsa0NBQXdDOztJQUV4QyxzQ0FBMkI7O0lBQzNCLG9DQUFtQjs7SUFRbkIsK0NBQW1DIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcG9uZW50LCBPdXRwdXQsIEV2ZW50RW1pdHRlciwgSW5wdXQsXG4gIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSwgT25Jbml0LCBIb3N0TGlzdGVuZXJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBmcm9tRXZlbnQsIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdxdW1sLWFsZXJ0JyxcbiAgdGVtcGxhdGVVcmw6ICcuL2FsZXJ0LmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vYWxlcnQuY29tcG9uZW50LnNjc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBBbGVydENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95IHtcbiAgQElucHV0KCkgYWxlcnRUeXBlOiBhbnk7XG4gIEBJbnB1dCgpIGlzSGludEF2YWlsYWJsZTogYm9vbGVhbjtcbiAgQElucHV0KCkgc2hvd1NvbHV0aW9uQnV0dG9uOiBib29sZWFuO1xuICBAT3V0cHV0KCkgY2xvc2VBbGVydCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIHNob3dTb2x1dGlvbiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIHNob3dIaW50ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIHN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuICBpc0ZvY3VzU2V0ID0gZmFsc2U7XG5cblxuICBASG9zdExpc3RlbmVyKCdkb2N1bWVudDprZXlkb3duLmVzY2FwZScsIFsnJGV2ZW50J10pIG9uS2V5ZG93bkhhbmRsZXIoZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICB0aGlzLmNsb3NlKCdjbG9zZScpO1xuICB9XG5cblxuICBwcmV2aW91c0FjdGl2ZUVsZW1lbnQ6IEhUTUxFbGVtZW50O1xuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuaXNGb2N1c1NldCA9IGZhbHNlO1xuICAgIHRoaXMucHJldmlvdXNBY3RpdmVFbGVtZW50ID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudCBhcyBIVE1MRWxlbWVudDtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbiA9IGZyb21FdmVudChkb2N1bWVudCwgJ2tleWRvd24nKS5zdWJzY3JpYmUoKGU6IEtleWJvYXJkRXZlbnQpID0+IHtcbiAgICAgIGlmIChlWydrZXknXSA9PT0gJ1RhYicpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ1RhYiBwcmVzc2VkJyk7XG4gICAgICAgIFxuICAgICAgICBjb25zdCBuZXh0QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnF1bWwtbmF2aWdhdGlvbl9fcHJldmlvdXMnKSBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgaWYgKG5leHRCdG4pIHtcbiAgICAgICAgICB0aGlzLmNsb3NlKCdjbG9zZScpO1xuICAgICAgICAgIG5leHRCdG4uZm9jdXMoKTtcbiAgICAgICAgICB0aGlzLmlzRm9jdXNTZXQgPSB0cnVlO1xuICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICBjb25zdCBhbGVydEJvZHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucXVtbC1hbGVydF9fYm9keScpO1xuXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBjb25zdCB3cm9uZ0J1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN3cm9uZ0J1dHRvbicpIGFzIEhUTUxFbGVtZW50O1xuICAgICAgY29uc3QgY29ycmVjdEJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjb3JyZWN0QnV0dG9uJykgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICBjb25zdCBoaW50QnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2hpbnRCdXR0b24nKSBhcyBIVE1MRWxlbWVudDtcblxuICAgICAgaWYgKHRoaXMuYWxlcnRUeXBlID09PSAnd3JvbmcnKSB7XG4gICAgICAgIHdyb25nQnV0dG9uLmZvY3VzKCk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuYWxlcnRUeXBlID09PSAnY29ycmVjdCcgJiYgdGhpcy5zaG93U29sdXRpb25CdXR0b24pIHtcbiAgICAgICAgY29ycmVjdEJ1dHRvbi5mb2N1cygpO1xuICAgICAgfVxuICAgIH0sIDEwMCk7XG4gIH1cblxuICB2aWV3SGludCgpIHtcbiAgICB0aGlzLnNob3dIaW50LmVtaXQoe1xuICAgICAgaGludDogdHJ1ZSxcbiAgICB9KTtcbiAgfVxuXG4gIHZpZXdTb2x1dGlvbigpIHtcbiAgICB0aGlzLnNob3dTb2x1dGlvbi5lbWl0KHtcbiAgICAgIHNvbHV0aW9uOiB0cnVlLFxuICAgIH0pO1xuICB9XG5cbiAgY2xvc2UodHlwZSkge1xuICAgIHRoaXMuY2xvc2VBbGVydC5lbWl0KHsgdHlwZSB9KTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIGlmICh0aGlzLnByZXZpb3VzQWN0aXZlRWxlbWVudCAmJiAhdGhpcy5pc0ZvY3VzU2V0KSB7XG4gICAgICB0aGlzLnByZXZpb3VzQWN0aXZlRWxlbWVudC5mb2N1cygpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==