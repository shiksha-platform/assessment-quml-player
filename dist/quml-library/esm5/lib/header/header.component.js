/**
 * @fileoverview added by tsickle
 * Generated from: lib/header/header.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Output, EventEmitter, Input } from '@angular/core';
var HeaderComponent = /** @class */ (function () {
    function HeaderComponent() {
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
    HeaderComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        if (this.duration && this.showTimer) {
            this.minutes = Math.floor(this.duration / 60);
            this.seconds = this.duration - this.minutes * 60 < 10 ? "0" + (this.duration - this.minutes * 60) : this.duration - this.minutes * 60;
        }
    };
    /**
     * @return {?}
     */
    HeaderComponent.prototype.ngOnChanges = /**
     * @return {?}
     */
    function () {
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
    };
    /**
     * @return {?}
     */
    HeaderComponent.prototype.ngAfterViewInit = /**
     * @return {?}
     */
    function () {
        this.isMobilePortrait = window.matchMedia("(max-width: 480px)").matches;
        ;
    };
    /**
     * @return {?}
     */
    HeaderComponent.prototype.ngOnDestroy = /**
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
    HeaderComponent.prototype.nextSlide = /**
     * @return {?}
     */
    function () {
        if (!this.disableNext) {
            this.nextSlideClicked.emit({ type: 'next' });
        }
    };
    /**
     * @return {?}
     */
    HeaderComponent.prototype.prevSlide = /**
     * @return {?}
     */
    function () {
        if (!this.showStartPage && this.currentSlideIndex === 1) {
            return;
        }
        if (!this.disablePreviousNavigation) {
            this.prevSlideClicked.emit({ event: 'previous clicked' });
        }
    };
    /**
     * @return {?}
     */
    HeaderComponent.prototype.openNav = /**
     * @return {?}
     */
    function () {
        document.getElementById('mySidenav').style.width = '100%';
        document.body.style.backgroundColor = 'rgba(0,0,0,0.4)';
    };
    /**
     * @return {?}
     */
    HeaderComponent.prototype.closeNav = /**
     * @return {?}
     */
    function () {
        document.getElementById('mySidenav').style.width = '0';
        document.body.style.backgroundColor = 'white';
    };
    /**
     * @return {?}
     */
    HeaderComponent.prototype.timer = /**
     * @return {?}
     */
    function () {
        var _this = this;
        if (this.duration > 0) {
            /** @type {?} */
            var durationInSec_1 = this.duration;
            this.intervalRef = setInterval((/**
             * @return {?}
             */
            function () {
                /** @type {?} */
                var min = ~~(durationInSec_1 / 60);
                /** @type {?} */
                var sec = (durationInSec_1 % 60);
                if (sec < 10) {
                    _this.time = min + ':' + '0' + sec;
                }
                else {
                    _this.time = min + ':' + sec;
                }
                if (durationInSec_1 === 0) {
                    clearInterval(_this.intervalRef);
                    _this.durationEnds.emit(true);
                    return false;
                }
                if (parseInt(durationInSec_1) <= parseInt(_this.warningTime)) {
                    _this.showWarning = true;
                }
                durationInSec_1--;
            }), 1000);
        }
    };
    /**
     * @return {?}
     */
    HeaderComponent.prototype.showCountUp = /**
     * @return {?}
     */
    function () {
        var _this = this;
        /** @type {?} */
        var min = 0;
        /** @type {?} */
        var sec = 0;
        this.intervalRef = setInterval((/**
         * @return {?}
         */
        function () {
            if (sec === 59) {
                sec = 0;
                min = min + 1;
            }
            if (sec < 10) {
                _this.time = min + ':' + '0' + sec++;
            }
            else {
                _this.time = min + ':' + sec++;
            }
        }), 1000);
    };
    HeaderComponent.decorators = [
        { type: Component, args: [{
                    selector: 'quml-header',
                    template: "<div class=\"quml-header__container\">\n  <div>\n    <!-- <quml-menu class=\"quml-menu\"></quml-menu> -->\n    <div *ngIf=\"attempts?.max && attempts?.current\" class=\"attempts sb-color-primary fnormal font-weight-bold pl-64\">Attempt no {{attempts.current}}/{{attempts.max}}</div>\n  </div>\n\n  <div class=\"quml-header__metadata\">\n    <ng-container *ngIf=\"duration\">\n      <div class=\"duration mr-16\" title=\"{{minutes}}:{{seconds}}\" *ngIf=\"duration && showTimer && !initializeTimer\">\n        <quml-durationtimer></quml-durationtimer>\n        <span>{{minutes}}:{{seconds}}</span>\n      </div>\n      <div class=\"duration mr-16\" title=\"{{minutes}}:{{seconds}}\" *ngIf=\"duration && showTimer && initializeTimer && time\">\n        <quml-durationtimer></quml-durationtimer>\n        <span [ngClass]=\"{'blink': showWarning}\">{{time}}</span> \n      </div>\n    </ng-container>\n    <ng-container *ngIf=\"!duration && showTimer && initializeTimer\">\n      <div class=\"duration mr-16\" title=\"{{minutes}}:{{seconds}}\">\n        <quml-durationtimer></quml-durationtimer>\n        <span>{{time}}</span>\n      </div>\n    </ng-container>\n\n    <!-- <div class=\"star-container\">\n      <span div class=\"star\">\n        <quml-star></quml-star>\n      </span>\n      <span class=\"score\">\n        47\n      </span>\n    </div> -->\n    <div class=\"quml-navigation\" *ngIf=\"!disableNext && !isMobilePortrait\">\n      <div class=\"quml-navigation__previous\" (click)=\"prevSlide()\" aria-label=\"preview slide\" title=\"preview slide\" role=\"navigation\"\n        [ngClass]=\"(startPageInstruction && currentSlideIndex === 0) || (!showStartPage && currentSlideIndex === 1) ? 'navigation-icon-disabled': '' \" \n        [attr.tabindex]=\"(startPageInstruction && currentSlideIndex === 0) || (!showStartPage && currentSlideIndex === 1) ? -1 : 0\"></div>\n      <div class=\"quml-navigation__next ml-8\" (click)=\"nextSlide()\" (keydown.enter)=\"nextSlide()\" aria-label=\"next slide\" title=\"next slide\" *ngIf=\"!active\" role=\"navigation\"\n        [ngClass]=\"disableNext ? 'navigation-icon-disabled': '' \" tabindex=\"0\"></div>\n      <div class=\"quml-navigation__next quml-navigation__next--active ml-8\" (click)=\"nextSlide()\" (keydown.enter)=\"nextSlide()\" aria-label=\"next slide\" title=\"next slide\" *ngIf=\"active\" role=\"navigation\"\n        [ngClass]=\"disableNext ? 'navigation-icon-disabled': '' \" tabindex=\"0\"></div>\n    </div>\n\n  </div>\n</div>\n\n<div class=\"quml-header__metadata quml-header__metadata--portrait\" *ngIf=\"!loadScoreBoard && !endPageReached\">\n  <div class=\"current-slide fnormal\">{{currentSlideIndex}}/{{totalNoOfQuestions}}</div>\n  <div class=\"ml-16\" *ngIf=\"currentSolutions && showFeedBack\">\n    <quml-ans (click)=\"showSolution.emit()\"></quml-ans>\n  </div>\n  <div class=\"quml-navigation ml-auto\">\n    <div class=\"quml-navigation__previous\" tabindex=\"0\" (click)=\"prevSlide()\" (keydown.enter)=\"prevSlide()\" aria-label=\"preview slide\"></div>\n    <div class=\"quml-navigation__next ml-8\" tabindex=\"0\" (click)=\"nextSlide()\" (keydown.enter)=\"nextSlide()\" *ngIf=\"!active\" aria-label=\"next slide\"></div>\n    <div class=\"quml-navigation__next quml-navigation__next--active ml-8\" tabindex=\"0\" (click)=\"nextSlide()\" (keydown.enter)=\"nextSlide()\" *ngIf=\"active\" aria-label=\"next slide\"></div>\n  </div>\n\n</div>",
                    styles: ["::ng-deep :root{--quml-color-primary:#FFD555;--quml-color-primary-contrast:#333;--quml-color-warning:#ff0000;--quml-btn-border:#ccc;--quml-color-gray:#666;--quml-main-bg:#fff;--quml-navigation-btns:#333;--quml-header-metadata:#fff}.quml-header__container,.quml-header__metadata{display:flex;align-items:center}.quml-header__container{justify-content:space-between;position:absolute;top:0;background:var(--quml-main-bg);min-height:3.5rem;width:100%;padding:.5rem 1rem .5rem 0;z-index:9}.quml-header__metadata--portrait{display:none}.quml-navigation{display:flex;align-items:center}@media only screen and (max-width:480px){.quml-header__metadata--portrait{display:flex;position:fixed;bottom:0;width:100%;padding:.5rem 1rem;background-color:var(--white);z-index:5;min-height:3rem}.quml-header__metadata--portrait .quml-navigation{display:flex}.quml-navigation{display:none}}.quml-navigation__next,.quml-navigation__previous{position:relative;width:3.75rem;height:2.25rem;background:var(--quml-header-metadata);border:.03125rem solid var(--quml-btn-border);border-radius:1rem;box-shadow:inset 0 -.09375rem .0625rem 0 rgba(0,0,0,.2);cursor:pointer}.quml-navigation__next::after,.quml-navigation__previous::after{content:\"\";display:inline-block;padding:.21875rem;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);border:solid var(--quml-navigation-btns);border-width:0 .125rem .125rem 0}.quml-navigation__next--active,.quml-navigation__next:focus,.quml-navigation__next:hover,.quml-navigation__previous--active,.quml-navigation__previous:focus,.quml-navigation__previous:hover{background-color:var(--quml-color-primary)}.quml-navigation__next::after{transform:translate(-50%,-50%) rotate(-45deg);-webkit-transform:translate(-50%,-50%) rotate(-45deg)}.quml-navigation__previous::after{transform:translate(-50%,-50%) rotate(135deg);-webkit-transform:translate(-50%,-50%) rotate(135deg)}.blink{-webkit-animation:1s steps(1,end) infinite blink;animation:1s steps(1,end) infinite blink;color:var(--quml-color-warning)}.duration,quml-durationtimer{display:flex;align-items:center}.duration{color:var(--quml-color-primary-contrast);font-weight:700}quml-durationtimer{margin-right:.5rem}.current-slide{color:var(--white);font-weight:700}.navigation-icon-disabled{opacity:.6;cursor:not-allowed}@-webkit-keyframes blink{0%,100%{opacity:1}50%{opacity:0}}@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}"]
                }] }
    ];
    /** @nocollapse */
    HeaderComponent.ctorParameters = function () { return []; };
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
    return HeaderComponent;
}());
export { HeaderComponent };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhZGVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bwcm9qZWN0LXN1bmJpcmQvc3VuYmlyZC1xdW1sLXBsYXllci12OS8iLCJzb3VyY2VzIjpbImxpYi9oZWFkZXIvaGVhZGVyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQVUsTUFBTSxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQXVDLE1BQU0sZUFBZSxDQUFDO0FBR3BIO0lBb0NFO1FBZlUscUJBQWdCLEdBQUcsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUMzQyxxQkFBZ0IsR0FBRyxJQUFJLFlBQVksRUFBTyxDQUFDO1FBQzNDLGlCQUFZLEdBQUcsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUN2QyxpQkFBWSxHQUFHLElBQUksWUFBWSxFQUFPLENBQUM7UUFRakQsZ0JBQVcsR0FBRyxLQUFLLENBQUM7UUFDcEIscUJBQWdCLEdBQUcsS0FBSyxDQUFDO0lBSXpCLENBQUM7Ozs7SUFHRCxrQ0FBUTs7O0lBQVI7UUFDRSxJQUFJLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNuQyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUMsQ0FBQztZQUM5QyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLEdBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFJLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUUsQ0FBRSxDQUFDLENBQUUsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztTQUN4STtJQUNILENBQUM7Ozs7SUFFRCxxQ0FBVzs7O0lBQVg7UUFDRSxJQUFJLElBQUksQ0FBQyxR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OztnQkF4SUYsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxhQUFhO29CQUN2QixnM0dBQXNDOztpQkFFdkM7Ozs7OzRCQUdFLEtBQUs7MkJBQ0wsS0FBSzs4QkFDTCxLQUFLOzRDQUNMLEtBQUs7NEJBQ0wsS0FBSztxQ0FDTCxLQUFLO29DQUNMLEtBQUs7eUJBQ0wsS0FBSztrQ0FDTCxLQUFLO2lDQUNMLEtBQUs7aUNBQ0wsS0FBSzsyQkFDTCxLQUFLO21DQUNMLEtBQUs7K0JBQ0wsS0FBSzttQ0FDTCxNQUFNO21DQUNOLE1BQU07K0JBQ04sTUFBTTsrQkFDTixNQUFNOzhCQUNOLEtBQUs7dUNBQ0wsS0FBSztnQ0FDTCxLQUFLOzJCQUNMLEtBQUs7O0lBNkdSLHNCQUFDO0NBQUEsQUF6SUQsSUF5SUM7U0FwSVksZUFBZTs7O0lBRTFCLG9DQUF5Qjs7SUFDekIsbUNBQXdCOztJQUN4QixzQ0FBOEI7O0lBQzlCLG9EQUE0Qzs7SUFDNUMsb0NBQTRCOztJQUM1Qiw2Q0FBaUM7O0lBQ2pDLDRDQUFnQzs7SUFDaEMsaUNBQXlCOztJQUN6QiwwQ0FBa0M7O0lBQ2xDLHlDQUFpQzs7SUFDakMseUNBQWlDOztJQUNqQyxtQ0FBMkI7O0lBQzNCLDJDQUErQjs7SUFDL0IsdUNBQStCOztJQUMvQiwyQ0FBcUQ7O0lBQ3JELDJDQUFxRDs7SUFDckQsdUNBQWlEOztJQUNqRCx1Q0FBaUQ7O0lBQ2pELHNDQUErQjs7SUFDL0IsK0NBQXVDOztJQUN2Qyx3Q0FBaUM7O0lBQ2pDLG1DQUFxRDs7SUFDckQsa0NBQWdCOztJQUNoQixrQ0FBeUI7Ozs7O0lBQ3pCLHNDQUFxQjs7SUFDckIsc0NBQW9COztJQUNwQiwyQ0FBeUI7O0lBRXpCLCtCQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3ksIEFmdGVyVmlld0luaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdxdW1sLWhlYWRlcicsXG4gIHRlbXBsYXRlVXJsOiAnLi9oZWFkZXIuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9oZWFkZXIuY29tcG9uZW50LnNjc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBIZWFkZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcywgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95IHtcblxuICBASW5wdXQoKSBxdWVzdGlvbnM/OiBhbnk7XG4gIEBJbnB1dCgpIGR1cmF0aW9uPzogYW55O1xuICBASW5wdXQoKSB3YXJuaW5nVGltZT86IHN0cmluZztcbiAgQElucHV0KCkgZGlzYWJsZVByZXZpb3VzTmF2aWdhdGlvbjogYm9vbGVhbjtcbiAgQElucHV0KCkgc2hvd1RpbWVyOiBib29sZWFuO1xuICBASW5wdXQoKSB0b3RhbE5vT2ZRdWVzdGlvbnM6IGFueTtcbiAgQElucHV0KCkgY3VycmVudFNsaWRlSW5kZXg6IGFueTtcbiAgQElucHV0KCkgYWN0aXZlOiBib29sZWFuO1xuICBASW5wdXQoKSBpbml0aWFsaXplVGltZXI6IGJvb2xlYW47XG4gIEBJbnB1dCgpIGVuZFBhZ2VSZWFjaGVkOiBib29sZWFuO1xuICBASW5wdXQoKSBsb2FkU2NvcmVCb2FyZDogYm9vbGVhbjtcbiAgQElucHV0KCkgcmVwbGF5ZWQ6IGJvb2xlYW47XG4gIEBJbnB1dCgpIGN1cnJlbnRTb2x1dGlvbnM6IGFueTtcbiAgQElucHV0KCkgc2hvd0ZlZWRCYWNrOiBib29sZWFuO1xuICBAT3V0cHV0KCkgbmV4dFNsaWRlQ2xpY2tlZCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCkgcHJldlNsaWRlQ2xpY2tlZCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCkgZHVyYXRpb25FbmRzID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBPdXRwdXQoKSBzaG93U29sdXRpb24gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQElucHV0KCkgZGlzYWJsZU5leHQ/OiBib29sZWFuO1xuICBASW5wdXQoKSBzdGFydFBhZ2VJbnN0cnVjdGlvbj86IHN0cmluZztcbiAgQElucHV0KCkgc2hvd1N0YXJ0UGFnZT86IGJvb2xlYW47XG4gIEBJbnB1dCgpIGF0dGVtcHRzPzogeyBtYXg6IG51bWJlciwgY3VycmVudDogbnVtYmVyIH07XG4gIG1pbnV0ZXM6IG51bWJlcjtcbiAgc2Vjb25kczogc3RyaW5nIHwgbnVtYmVyO1xuICBwcml2YXRlIGludGVydmFsUmVmPztcbiAgc2hvd1dhcm5pbmcgPSBmYWxzZTtcbiAgaXNNb2JpbGVQb3J0cmFpdCA9IGZhbHNlO1xuXG4gIHRpbWU6IGFueTtcbiAgY29uc3RydWN0b3IoKSB7XG4gIH1cblxuXG4gIG5nT25Jbml0KCkge1xuICAgIGlmICh0aGlzLmR1cmF0aW9uICYmIHRoaXMuc2hvd1RpbWVyKSB7XG4gICAgICB0aGlzLm1pbnV0ZXMgPSBNYXRoLmZsb29yKHRoaXMuZHVyYXRpb24gLyA2MCk7XG4gICAgICB0aGlzLnNlY29uZHMgPSB0aGlzLmR1cmF0aW9uIC0gdGhpcy5taW51dGVzICogNjAgPCAgMTAgPyBgMCR7dGhpcy5kdXJhdGlvbiAtIHRoaXMubWludXRlcyAqIDYwfWAgIDogIHRoaXMuZHVyYXRpb24gLSB0aGlzLm1pbnV0ZXMgKiA2MDtcbiAgICB9XG4gIH1cblxuICBuZ09uQ2hhbmdlcygpIHtcbiAgICBpZiAodGhpcy5kdXJhdGlvbiAmJiB0aGlzLnNob3dUaW1lciAmJiB0aGlzLmluaXRpYWxpemVUaW1lciAmJiAhdGhpcy5pbnRlcnZhbFJlZikge1xuICAgICAgdGhpcy50aW1lcigpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5kdXJhdGlvbiA9PT0gMCAmJiB0aGlzLnNob3dUaW1lciAmJiB0aGlzLmluaXRpYWxpemVUaW1lciAmJiAhdGhpcy5pbnRlcnZhbFJlZikge1xuICAgICAgdGhpcy5zaG93Q291bnRVcCgpO1xuICAgIH1cbiAgICBpZiAodGhpcy5yZXBsYXllZCAmJiB0aGlzLmR1cmF0aW9uICYmIHRoaXMuc2hvd1RpbWVyKSB7XG4gICAgICB0aGlzLnNob3dXYXJuaW5nID0gZmFsc2U7XG4gICAgICBjbGVhckludGVydmFsKHRoaXMuaW50ZXJ2YWxSZWYpXG4gICAgICB0aGlzLnRpbWVyKCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnJlcGxheWVkICYmIHRoaXMuZHVyYXRpb24gPT09IDAgJiYgdGhpcy5zaG93VGltZXIpIHtcbiAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5pbnRlcnZhbFJlZilcbiAgICAgIHRoaXMuc2hvd0NvdW50VXAoKTtcbiAgICB9XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgdGhpcy5pc01vYmlsZVBvcnRyYWl0ID0gd2luZG93Lm1hdGNoTWVkaWEoXCIobWF4LXdpZHRoOiA0ODBweClcIikubWF0Y2hlczs7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy5pbnRlcnZhbFJlZikge1xuICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLmludGVydmFsUmVmKTtcbiAgICB9XG4gIH1cblxuICBuZXh0U2xpZGUoKSB7XG4gICAgaWYgKCF0aGlzLmRpc2FibGVOZXh0KSB7XG4gICAgICB0aGlzLm5leHRTbGlkZUNsaWNrZWQuZW1pdCh7IHR5cGU6ICduZXh0JyB9KTtcbiAgICB9XG4gIH1cblxuICBwcmV2U2xpZGUoKSB7XG4gICAgaWYoIXRoaXMuc2hvd1N0YXJ0UGFnZSAmJiB0aGlzLmN1cnJlbnRTbGlkZUluZGV4ID09PSAxKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgaWYgKCF0aGlzLmRpc2FibGVQcmV2aW91c05hdmlnYXRpb24pIHtcbiAgICAgIHRoaXMucHJldlNsaWRlQ2xpY2tlZC5lbWl0KHsgZXZlbnQ6ICdwcmV2aW91cyBjbGlja2VkJyB9KTtcbiAgICB9XG4gIH1cblxuICBvcGVuTmF2KCkge1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdteVNpZGVuYXYnKS5zdHlsZS53aWR0aCA9ICcxMDAlJztcbiAgICBkb2N1bWVudC5ib2R5LnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICdyZ2JhKDAsMCwwLDAuNCknO1xuICB9XG5cbiAgY2xvc2VOYXYoKSB7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ215U2lkZW5hdicpLnN0eWxlLndpZHRoID0gJzAnO1xuICAgIGRvY3VtZW50LmJvZHkuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJ3doaXRlJztcbiAgfVxuXG4gIHRpbWVyKCkge1xuICAgIGlmICh0aGlzLmR1cmF0aW9uID4gMCkge1xuICAgICAgbGV0IGR1cmF0aW9uSW5TZWMgPSB0aGlzLmR1cmF0aW9uO1xuICAgICAgdGhpcy5pbnRlcnZhbFJlZiA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgbGV0IG1pbiA9IH5+KGR1cmF0aW9uSW5TZWMgLyA2MCk7XG4gICAgICAgIGxldCBzZWMgPSAoZHVyYXRpb25JblNlYyAlIDYwKTtcbiAgICAgICAgaWYgKHNlYyA8IDEwKSB7XG4gICAgICAgICAgdGhpcy50aW1lID0gbWluICsgJzonICsgJzAnICsgc2VjO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMudGltZSA9IG1pbiArICc6JyArIHNlYztcbiAgICAgICAgfVxuICAgICAgICBpZiAoZHVyYXRpb25JblNlYyA9PT0gMCkge1xuICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5pbnRlcnZhbFJlZik7XG4gICAgICAgICAgdGhpcy5kdXJhdGlvbkVuZHMuZW1pdCh0cnVlKTtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBhcnNlSW50KGR1cmF0aW9uSW5TZWMpIDw9IHBhcnNlSW50KHRoaXMud2FybmluZ1RpbWUpKSB7XG4gICAgICAgICAgdGhpcy5zaG93V2FybmluZyA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZHVyYXRpb25JblNlYy0tO1xuICAgICAgfSwgMTAwMCk7XG4gICAgfVxuICB9XG5cbiAgc2hvd0NvdW50VXAoKSB7XG4gICAgbGV0IG1pbiA9IDA7XG4gICAgbGV0IHNlYyA9IDA7XG4gICAgdGhpcy5pbnRlcnZhbFJlZiA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgIGlmIChzZWMgPT09IDU5KSB7XG4gICAgICAgIHNlYyA9IDA7XG4gICAgICAgIG1pbiA9IG1pbiArIDE7XG4gICAgICB9XG4gICAgICBpZiAoc2VjIDwgMTApIHtcbiAgICAgICAgdGhpcy50aW1lID0gbWluICsgJzonICsgJzAnICsgc2VjKys7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnRpbWUgPSBtaW4gKyAnOicgKyBzZWMrKztcbiAgICAgIH1cbiAgICB9LCAxMDAwKTtcbiAgfVxufVxuIl19