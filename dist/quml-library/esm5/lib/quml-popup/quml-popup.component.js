/**
 * @fileoverview added by tsickle
 * Generated from: lib/quml-popup/quml-popup.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input, Output, EventEmitter } from '@angular/core';
var QumlPopupComponent = /** @class */ (function () {
    function QumlPopupComponent() {
        this.image = 'https://via.placeholder.com/65';
        this.popUpClose = new EventEmitter();
    }
    /**
     * @return {?}
     */
    QumlPopupComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
    };
    /**
     * @return {?}
     */
    QumlPopupComponent.prototype.ngAfterViewInit = /**
     * @return {?}
     */
    function () {
        document.getElementById('htmlTag').getElementsByTagName('img')[0].style.width = '70%';
    };
    /**
     * @return {?}
     */
    QumlPopupComponent.prototype.closePopup = /**
     * @return {?}
     */
    function () {
        this.popUpClose.emit();
    };
    QumlPopupComponent.decorators = [
        { type: Component, args: [{
                    selector: 'quml-quml-popup',
                    template: "<div class=\"quml-popup\">\n  <div class=\"quml-popup-icon\" (click)=\"closePopup()\">&#10005;</div>\n  <img *ngIf=\"!htmlTag\" src={{image}}>\n</div>\n\n<div *ngIf=\"htmlTag\" class=\"htmlTag\" id=\"htmlTag\" [innerHtml]=\"htmlTag | safeHtml\"></div>\n\n",
                    styles: [".quml-popup{position:absolute;left:0;bottom:0;right:0;background:rgba(0,0,0,.4);top:0;padding:1rem;display:flex;align-items:center;justify-content:center;z-index:2}.quml-popup .quml-popup-icon{font-size:1.25rem;right:10%;position:absolute;cursor:pointer;z-index:2;color:var(--white);top:8%}.quml-popup img{box-shadow:0 .25rem .5rem 0 rgba(0,0,0,.2);height:90%;border-radius:.5rem;position:absolute;z-index:2}.htmlTag{position:absolute;top:15%;left:27%;z-index:10}@media only screen and (max-width:640px){.htmlTag{position:absolute;top:10%;left:27%;z-index:10}}"]
                }] }
    ];
    /** @nocollapse */
    QumlPopupComponent.ctorParameters = function () { return []; };
    QumlPopupComponent.propDecorators = {
        image: [{ type: Input }],
        htmlTag: [{ type: Input }],
        popUpClose: [{ type: Output }]
    };
    return QumlPopupComponent;
}());
export { QumlPopupComponent };
if (false) {
    /** @type {?} */
    QumlPopupComponent.prototype.image;
    /** @type {?} */
    QumlPopupComponent.prototype.htmlTag;
    /** @type {?} */
    QumlPopupComponent.prototype.popUpClose;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVtbC1wb3B1cC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AcHJvamVjdC1zdW5iaXJkL3N1bmJpcmQtcXVtbC1wbGF5ZXItdjkvIiwic291cmNlcyI6WyJsaWIvcXVtbC1wb3B1cC9xdW1sLXBvcHVwLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQVUsS0FBSyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQWlCLE1BQU0sZUFBZSxDQUFDO0FBRTlGO0lBU0U7UUFIUyxVQUFLLEdBQUcsZ0NBQWdDLENBQUM7UUFFeEMsZUFBVSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7SUFDMUIsQ0FBQzs7OztJQUVqQixxQ0FBUTs7O0lBQVI7SUFDQSxDQUFDOzs7O0lBRUQsNENBQWU7OztJQUFmO1FBQ0UsUUFBUSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztJQUN4RixDQUFDOzs7O0lBRUQsdUNBQVU7OztJQUFWO1FBQ0UsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUN6QixDQUFDOztnQkFwQkYsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxpQkFBaUI7b0JBQzNCLDJRQUEwQzs7aUJBRTNDOzs7Ozt3QkFFRSxLQUFLOzBCQUNMLEtBQUs7NkJBQ0wsTUFBTTs7SUFjVCx5QkFBQztDQUFBLEFBdEJELElBc0JDO1NBakJZLGtCQUFrQjs7O0lBQzdCLG1DQUFrRDs7SUFDbEQscUNBQXNCOztJQUN0Qix3Q0FBMEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyLCBBZnRlclZpZXdJbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3F1bWwtcXVtbC1wb3B1cCcsXG4gIHRlbXBsYXRlVXJsOiAnLi9xdW1sLXBvcHVwLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vcXVtbC1wb3B1cC5jb21wb25lbnQuc2NzcyddXG59KVxuZXhwb3J0IGNsYXNzIFF1bWxQb3B1cENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCB7XG4gIEBJbnB1dCgpIGltYWdlID0gJ2h0dHBzOi8vdmlhLnBsYWNlaG9sZGVyLmNvbS82NSc7XG4gIEBJbnB1dCgpIGh0bWxUYWc6IGFueTtcbiAgQE91dHB1dCgpIHBvcFVwQ2xvc2UgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIGNvbnN0cnVjdG9yKCkgeyB9XG5cbiAgbmdPbkluaXQoKSB7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2h0bWxUYWcnKS5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaW1nJylbMF0uc3R5bGUud2lkdGggPSAnNzAlJztcbiAgfVxuXG4gIGNsb3NlUG9wdXAoKSB7XG4gICAgdGhpcy5wb3BVcENsb3NlLmVtaXQoKTtcbiAgfVxuXG59XG4iXX0=