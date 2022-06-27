/**
 * @fileoverview added by tsickle
 * Generated from: lib/header/header.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Output, EventEmitter, Input } from '@angular/core';
export class HeaderComponent {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhZGVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bwcm9qZWN0LXN1bmJpcmQvc3VuYmlyZC1xdW1sLXBsYXllci12OS8iLCJzb3VyY2VzIjpbImxpYi9oZWFkZXIvaGVhZGVyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQVUsTUFBTSxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQXVDLE1BQU0sZUFBZSxDQUFDO0FBUXBILE1BQU0sT0FBTyxlQUFlO0lBK0IxQjtRQWZVLHFCQUFnQixHQUFHLElBQUksWUFBWSxFQUFPLENBQUM7UUFDM0MscUJBQWdCLEdBQUcsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUMzQyxpQkFBWSxHQUFHLElBQUksWUFBWSxFQUFPLENBQUM7UUFDdkMsaUJBQVksR0FBRyxJQUFJLFlBQVksRUFBTyxDQUFDO1FBUWpELGdCQUFXLEdBQUcsS0FBSyxDQUFDO1FBQ3BCLHFCQUFnQixHQUFHLEtBQUssQ0FBQztJQUl6QixDQUFDOzs7O0lBR0QsUUFBUTtRQUNOLElBQUksSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ25DLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBQzlDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsR0FBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsRUFBRSxDQUFFLENBQUMsQ0FBRSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO1NBQ3hJO0lBQ0gsQ0FBQzs7OztJQUVELFdBQVc7UUFDVCxJQUFJLElBQUksQ0FBQyxR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QUdFLEtBQUs7dUJBQ0wsS0FBSzswQkFDTCxLQUFLO3dDQUNMLEtBQUs7d0JBQ0wsS0FBSztpQ0FDTCxLQUFLO2dDQUNMLEtBQUs7cUJBQ0wsS0FBSzs4QkFDTCxLQUFLOzZCQUNMLEtBQUs7NkJBQ0wsS0FBSzt1QkFDTCxLQUFLOytCQUNMLEtBQUs7MkJBQ0wsS0FBSzsrQkFDTCxNQUFNOytCQUNOLE1BQU07MkJBQ04sTUFBTTsyQkFDTixNQUFNOzBCQUNOLEtBQUs7bUNBQ0wsS0FBSzs0QkFDTCxLQUFLO3VCQUNMLEtBQUs7Ozs7SUFyQk4sb0NBQXlCOztJQUN6QixtQ0FBd0I7O0lBQ3hCLHNDQUE4Qjs7SUFDOUIsb0RBQTRDOztJQUM1QyxvQ0FBNEI7O0lBQzVCLDZDQUFpQzs7SUFDakMsNENBQWdDOztJQUNoQyxpQ0FBeUI7O0lBQ3pCLDBDQUFrQzs7SUFDbEMseUNBQWlDOztJQUNqQyx5Q0FBaUM7O0lBQ2pDLG1DQUEyQjs7SUFDM0IsMkNBQStCOztJQUMvQix1Q0FBK0I7O0lBQy9CLDJDQUFxRDs7SUFDckQsMkNBQXFEOztJQUNyRCx1Q0FBaUQ7O0lBQ2pELHVDQUFpRDs7SUFDakQsc0NBQStCOztJQUMvQiwrQ0FBdUM7O0lBQ3ZDLHdDQUFpQzs7SUFDakMsbUNBQXFEOztJQUNyRCxrQ0FBZ0I7O0lBQ2hCLGtDQUF5Qjs7Ozs7SUFDekIsc0NBQXFCOztJQUNyQixzQ0FBb0I7O0lBQ3BCLDJDQUF5Qjs7SUFFekIsK0JBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIsIElucHV0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSwgQWZ0ZXJWaWV3SW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3F1bWwtaGVhZGVyJyxcbiAgdGVtcGxhdGVVcmw6ICcuL2hlYWRlci5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL2hlYWRlci5jb21wb25lbnQuc2NzcyddXG59KVxuZXhwb3J0IGNsYXNzIEhlYWRlckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3kge1xuXG4gIEBJbnB1dCgpIHF1ZXN0aW9ucz86IGFueTtcbiAgQElucHV0KCkgZHVyYXRpb24/OiBhbnk7XG4gIEBJbnB1dCgpIHdhcm5pbmdUaW1lPzogc3RyaW5nO1xuICBASW5wdXQoKSBkaXNhYmxlUHJldmlvdXNOYXZpZ2F0aW9uOiBib29sZWFuO1xuICBASW5wdXQoKSBzaG93VGltZXI6IGJvb2xlYW47XG4gIEBJbnB1dCgpIHRvdGFsTm9PZlF1ZXN0aW9uczogYW55O1xuICBASW5wdXQoKSBjdXJyZW50U2xpZGVJbmRleDogYW55O1xuICBASW5wdXQoKSBhY3RpdmU6IGJvb2xlYW47XG4gIEBJbnB1dCgpIGluaXRpYWxpemVUaW1lcjogYm9vbGVhbjtcbiAgQElucHV0KCkgZW5kUGFnZVJlYWNoZWQ6IGJvb2xlYW47XG4gIEBJbnB1dCgpIGxvYWRTY29yZUJvYXJkOiBib29sZWFuO1xuICBASW5wdXQoKSByZXBsYXllZDogYm9vbGVhbjtcbiAgQElucHV0KCkgY3VycmVudFNvbHV0aW9uczogYW55O1xuICBASW5wdXQoKSBzaG93RmVlZEJhY2s6IGJvb2xlYW47XG4gIEBPdXRwdXQoKSBuZXh0U2xpZGVDbGlja2VkID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBPdXRwdXQoKSBwcmV2U2xpZGVDbGlja2VkID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBPdXRwdXQoKSBkdXJhdGlvbkVuZHMgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgpIHNob3dTb2x1dGlvbiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBASW5wdXQoKSBkaXNhYmxlTmV4dD86IGJvb2xlYW47XG4gIEBJbnB1dCgpIHN0YXJ0UGFnZUluc3RydWN0aW9uPzogc3RyaW5nO1xuICBASW5wdXQoKSBzaG93U3RhcnRQYWdlPzogYm9vbGVhbjtcbiAgQElucHV0KCkgYXR0ZW1wdHM/OiB7IG1heDogbnVtYmVyLCBjdXJyZW50OiBudW1iZXIgfTtcbiAgbWludXRlczogbnVtYmVyO1xuICBzZWNvbmRzOiBzdHJpbmcgfCBudW1iZXI7XG4gIHByaXZhdGUgaW50ZXJ2YWxSZWY/O1xuICBzaG93V2FybmluZyA9IGZhbHNlO1xuICBpc01vYmlsZVBvcnRyYWl0ID0gZmFsc2U7XG5cbiAgdGltZTogYW55O1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgfVxuXG5cbiAgbmdPbkluaXQoKSB7XG4gICAgaWYgKHRoaXMuZHVyYXRpb24gJiYgdGhpcy5zaG93VGltZXIpIHtcbiAgICAgIHRoaXMubWludXRlcyA9IE1hdGguZmxvb3IodGhpcy5kdXJhdGlvbiAvIDYwKTtcbiAgICAgIHRoaXMuc2Vjb25kcyA9IHRoaXMuZHVyYXRpb24gLSB0aGlzLm1pbnV0ZXMgKiA2MCA8ICAxMCA/IGAwJHt0aGlzLmR1cmF0aW9uIC0gdGhpcy5taW51dGVzICogNjB9YCAgOiAgdGhpcy5kdXJhdGlvbiAtIHRoaXMubWludXRlcyAqIDYwO1xuICAgIH1cbiAgfVxuXG4gIG5nT25DaGFuZ2VzKCkge1xuICAgIGlmICh0aGlzLmR1cmF0aW9uICYmIHRoaXMuc2hvd1RpbWVyICYmIHRoaXMuaW5pdGlhbGl6ZVRpbWVyICYmICF0aGlzLmludGVydmFsUmVmKSB7XG4gICAgICB0aGlzLnRpbWVyKCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmR1cmF0aW9uID09PSAwICYmIHRoaXMuc2hvd1RpbWVyICYmIHRoaXMuaW5pdGlhbGl6ZVRpbWVyICYmICF0aGlzLmludGVydmFsUmVmKSB7XG4gICAgICB0aGlzLnNob3dDb3VudFVwKCk7XG4gICAgfVxuICAgIGlmICh0aGlzLnJlcGxheWVkICYmIHRoaXMuZHVyYXRpb24gJiYgdGhpcy5zaG93VGltZXIpIHtcbiAgICAgIHRoaXMuc2hvd1dhcm5pbmcgPSBmYWxzZTtcbiAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5pbnRlcnZhbFJlZilcbiAgICAgIHRoaXMudGltZXIoKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMucmVwbGF5ZWQgJiYgdGhpcy5kdXJhdGlvbiA9PT0gMCAmJiB0aGlzLnNob3dUaW1lcikge1xuICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLmludGVydmFsUmVmKVxuICAgICAgdGhpcy5zaG93Q291bnRVcCgpO1xuICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICB0aGlzLmlzTW9iaWxlUG9ydHJhaXQgPSB3aW5kb3cubWF0Y2hNZWRpYShcIihtYXgtd2lkdGg6IDQ4MHB4KVwiKS5tYXRjaGVzOztcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIGlmICh0aGlzLmludGVydmFsUmVmKSB7XG4gICAgICBjbGVhckludGVydmFsKHRoaXMuaW50ZXJ2YWxSZWYpO1xuICAgIH1cbiAgfVxuXG4gIG5leHRTbGlkZSgpIHtcbiAgICBpZiAoIXRoaXMuZGlzYWJsZU5leHQpIHtcbiAgICAgIHRoaXMubmV4dFNsaWRlQ2xpY2tlZC5lbWl0KHsgdHlwZTogJ25leHQnIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByZXZTbGlkZSgpIHtcbiAgICBpZighdGhpcy5zaG93U3RhcnRQYWdlICYmIHRoaXMuY3VycmVudFNsaWRlSW5kZXggPT09IDEpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBpZiAoIXRoaXMuZGlzYWJsZVByZXZpb3VzTmF2aWdhdGlvbikge1xuICAgICAgdGhpcy5wcmV2U2xpZGVDbGlja2VkLmVtaXQoeyBldmVudDogJ3ByZXZpb3VzIGNsaWNrZWQnIH0pO1xuICAgIH1cbiAgfVxuXG4gIG9wZW5OYXYoKSB7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ215U2lkZW5hdicpLnN0eWxlLndpZHRoID0gJzEwMCUnO1xuICAgIGRvY3VtZW50LmJvZHkuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJ3JnYmEoMCwwLDAsMC40KSc7XG4gIH1cblxuICBjbG9zZU5hdigpIHtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbXlTaWRlbmF2Jykuc3R5bGUud2lkdGggPSAnMCc7XG4gICAgZG9jdW1lbnQuYm9keS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnd2hpdGUnO1xuICB9XG5cbiAgdGltZXIoKSB7XG4gICAgaWYgKHRoaXMuZHVyYXRpb24gPiAwKSB7XG4gICAgICBsZXQgZHVyYXRpb25JblNlYyA9IHRoaXMuZHVyYXRpb247XG4gICAgICB0aGlzLmludGVydmFsUmVmID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICBsZXQgbWluID0gfn4oZHVyYXRpb25JblNlYyAvIDYwKTtcbiAgICAgICAgbGV0IHNlYyA9IChkdXJhdGlvbkluU2VjICUgNjApO1xuICAgICAgICBpZiAoc2VjIDwgMTApIHtcbiAgICAgICAgICB0aGlzLnRpbWUgPSBtaW4gKyAnOicgKyAnMCcgKyBzZWM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy50aW1lID0gbWluICsgJzonICsgc2VjO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkdXJhdGlvbkluU2VjID09PSAwKSB7XG4gICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLmludGVydmFsUmVmKTtcbiAgICAgICAgICB0aGlzLmR1cmF0aW9uRW5kcy5lbWl0KHRydWUpO1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocGFyc2VJbnQoZHVyYXRpb25JblNlYykgPD0gcGFyc2VJbnQodGhpcy53YXJuaW5nVGltZSkpIHtcbiAgICAgICAgICB0aGlzLnNob3dXYXJuaW5nID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBkdXJhdGlvbkluU2VjLS07XG4gICAgICB9LCAxMDAwKTtcbiAgICB9XG4gIH1cblxuICBzaG93Q291bnRVcCgpIHtcbiAgICBsZXQgbWluID0gMDtcbiAgICBsZXQgc2VjID0gMDtcbiAgICB0aGlzLmludGVydmFsUmVmID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgaWYgKHNlYyA9PT0gNTkpIHtcbiAgICAgICAgc2VjID0gMDtcbiAgICAgICAgbWluID0gbWluICsgMTtcbiAgICAgIH1cbiAgICAgIGlmIChzZWMgPCAxMCkge1xuICAgICAgICB0aGlzLnRpbWUgPSBtaW4gKyAnOicgKyAnMCcgKyBzZWMrKztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudGltZSA9IG1pbiArICc6JyArIHNlYysrO1xuICAgICAgfVxuICAgIH0sIDEwMDApO1xuICB9XG59XG4iXX0=