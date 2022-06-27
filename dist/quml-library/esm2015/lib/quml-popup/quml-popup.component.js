/**
 * @fileoverview added by tsickle
 * Generated from: lib/quml-popup/quml-popup.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input, Output, EventEmitter } from '@angular/core';
export class QumlPopupComponent {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVtbC1wb3B1cC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AcHJvamVjdC1zdW5iaXJkL3N1bmJpcmQtcXVtbC1wbGF5ZXItdjkvIiwic291cmNlcyI6WyJsaWIvcXVtbC1wb3B1cC9xdW1sLXBvcHVwLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQVUsS0FBSyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQWlCLE1BQU0sZUFBZSxDQUFDO0FBTzlGLE1BQU0sT0FBTyxrQkFBa0I7SUFJN0I7UUFIUyxVQUFLLEdBQUcsZ0NBQWdDLENBQUM7UUFFeEMsZUFBVSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7SUFDMUIsQ0FBQzs7OztJQUVqQixRQUFRO0lBQ1IsQ0FBQzs7OztJQUVELGVBQWU7UUFDYixRQUFRLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0lBQ3hGLENBQUM7Ozs7SUFFRCxVQUFVO1FBQ1IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUN6QixDQUFDOzs7WUFwQkYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxpQkFBaUI7Z0JBQzNCLDJRQUEwQzs7YUFFM0M7Ozs7O29CQUVFLEtBQUs7c0JBQ0wsS0FBSzt5QkFDTCxNQUFNOzs7O0lBRlAsbUNBQWtEOztJQUNsRCxxQ0FBc0I7O0lBQ3RCLHdDQUEwQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIsIEFmdGVyVmlld0luaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAncXVtbC1xdW1sLXBvcHVwJyxcbiAgdGVtcGxhdGVVcmw6ICcuL3F1bWwtcG9wdXAuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9xdW1sLXBvcHVwLmNvbXBvbmVudC5zY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgUXVtbFBvcHVwQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBBZnRlclZpZXdJbml0IHtcbiAgQElucHV0KCkgaW1hZ2UgPSAnaHR0cHM6Ly92aWEucGxhY2Vob2xkZXIuY29tLzY1JztcbiAgQElucHV0KCkgaHRtbFRhZzogYW55O1xuICBAT3V0cHV0KCkgcG9wVXBDbG9zZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgY29uc3RydWN0b3IoKSB7IH1cblxuICBuZ09uSW5pdCgpIHtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaHRtbFRhZycpLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdpbWcnKVswXS5zdHlsZS53aWR0aCA9ICc3MCUnO1xuICB9XG5cbiAgY2xvc2VQb3B1cCgpIHtcbiAgICB0aGlzLnBvcFVwQ2xvc2UuZW1pdCgpO1xuICB9XG5cbn1cbiJdfQ==