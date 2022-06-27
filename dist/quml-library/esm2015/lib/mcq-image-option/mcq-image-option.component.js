/**
 * @fileoverview added by tsickle
 * Generated from: lib/mcq-image-option/mcq-image-option.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Output, EventEmitter, Input } from '@angular/core';
export class McqImageOptionComponent {
    constructor() {
        this.showQumlPopup = false;
        this.imgOptionSelected = new EventEmitter();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
    }
    /**
     * @param {?} image
     * @return {?}
     */
    showPopup(image) {
        this.showQumlPopup = true;
        this.qumlPopupImage = image;
    }
    /**
     * @param {?} mcqOption
     * @return {?}
     */
    optionClicked(mcqOption) {
        this.imgOptionSelected.emit({
            name: 'optionSelect',
            option: mcqOption,
            solutions: this.solutions
        });
    }
    /**
     * @param {?} event
     * @param {?} mcqOption
     * @return {?}
     */
    onEnter(event, mcqOption) {
        if (event.keyCode === 13) {
            event.stopPropagation();
            this.optionClicked(mcqOption);
        }
    }
    /**
     * @param {?} optionHtml
     * @return {?}
     */
    openPopup(optionHtml) {
        this.showQumlPopup = true;
        this.qumlPopupImage = optionHtml;
    }
    /**
     * @return {?}
     */
    closePopUp() {
        this.showQumlPopup = false;
    }
}
McqImageOptionComponent.decorators = [
    { type: Component, args: [{
                selector: 'quml-mcq-image-option',
                template: "<div class=\"quml-mcq-option-card\" (click)=\"optionClicked(mcqOption)\" tabindex=\"0\" (keydown)=\"onEnter($event, mcqOption)\"\n  [ngClass]=\"mcqOption?.selected ? 'quml-mcq-option-card quml-option--selected' : 'quml-mcq-option-card'\">\n  <div class=\"option\" *ngIf=\"mcqOption\"\n    [innerHTML]=\"mcqOption.label | safeHtml\"></div>\n    <label class=\"container\">\n      <input type=\"radio\" name=\"radio\" role=\"radio\" [checked]=\"mcqOption.selected\" >\n      <span class=\"checkmark\"></span>\n  </label>\n</div>",
                styles: ["::ng-deep :root{--quml-btn-border:#ccc;--quml-color-gray:#666;--quml-checkmark:#cdcdcd;--quml-color-primary-shade:rgba(0, 0, 0, .1);--quml-option-card-bg:#fff;--quml-option-selected-checkmark:#ffff}.quml-mcq-option-card{position:relative;background-color:var(--quml-option-card-bg);padding:1rem;border-radius:.25rem;border:.0625rem solid var(--quml-btn-border);box-shadow:0 .125rem .75rem 0 var(--quml-color-primary-shade);display:flex;align-items:center;justify-content:space-between;height:100%;gap:.5rem}.quml-mcq-option-card .option-image{position:relative}.quml-mcq-option-card .option-image img{min-width:100%;vertical-align:bottom;width:100%!important}.quml-mcq-option-card .option{color:var(--quml-color-gray);font-size:.75rem;font-weight:700;flex:1}.quml-mcq-option-card label{margin-bottom:0}.zoom-in-icon{position:absolute;right:.5rem;bottom:0}::ng-deep .quml-mcq-option-card .option img{max-width:100%}::ng-deep .quml-mcq-option-card .option label{margin-bottom:0}.selected-option-text{color:var(--primary-color)!important}.icon-zommin{position:absolute;bottom:2px;right:-1px;content:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTlweCIgaGVpZ2h0PSIxOXB4IiB2aWV3Qm94PSIwIDAgMTkgMTkiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDYyICg5MTM5MCkgLSBodHRwczovL3NrZXRjaC5jb20gLS0+CiAgICA8dGl0bGU+em9vbTwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxnIGlkPSJkZXZzIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iem9vbSI+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik05LjUsMCBMMTgsMCBDMTguNTUyMjg0NywtMS4wMTQ1MzA2M2UtMTYgMTksMC40NDc3MTUyNSAxOSwxIEwxOSwxMyBDMTksMTYuMzEzNzA4NSAxNi4zMTM3MDg1LDE5IDEzLDE5IEwxLDE5IEMwLjQ0NzcxNTI1LDE5IDYuNzYzNTM3NTFlLTE3LDE4LjU1MjI4NDcgMCwxOCBMMCw5LjUgQy02LjQyNTM2MDY0ZS0xNiw0LjI1MzI5NDg4IDQuMjUzMjk0ODgsOS42MzgwNDA5NWUtMTYgOS41LDAgWiIgaWQ9IlJlY3RhbmdsZSIgZmlsbC1vcGFjaXR5PSIwLjUiIGZpbGw9IiM0MzQzNDMiIGZpbGwtcnVsZT0ibm9uemVybyI+PC9wYXRoPgogICAgICAgICAgICA8ZyBpZD0iR3JvdXAiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDUuMDAwMDAwLCA0LjAwMDAwMCkiIGZpbGw9IiNGRkZGRkYiPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTQuNTgzMzMzMzMsMC43NSBDNi45NzY2NjY2NywwLjc1IDguOTE2NjY2NjcsMi42OSA4LjkxNjY2NjY3LDUuMDgzMzMzMzMgQzguOTE2NjY2NjcsNi4xNTY2NjY2NyA4LjUyMzMzMzMzLDcuMTQzMzMzMzMgNy44Nyw3LjkwMzMzMzMzIEw3Ljg3LDcuOTAzMzMzMzMgTDguMDU2NjY2NjcsOC4wODMzMzMzMyBMOC41ODMzMzMzMyw4LjA4MzMzMzMzIEwxMS45MSwxMS40MTY2NjY3IEwxMC45MTY2NjY3LDEyLjQxIEw3LjU4MzMzMzMzLDkuMDgzMzMzMzMgTDcuNTgzMzMzMzMsOC41NTY2NjY2NyBMNy40MDMzMzMzMyw4LjM3IEM2LjY0MzMzMzMzLDkuMDIzMzMzMzMgNS42NTY2NjY2Nyw5LjQxNjY2NjY3IDQuNTgzMzMzMzMsOS40MTY2NjY2NyBDMi4xOSw5LjQxNjY2NjY3IDAuMjUsNy40NzY2NjY2NyAwLjI1LDUuMDgzMzMzMzMgQzAuMjUsMi42OSAyLjE5LDAuNzUgNC41ODMzMzMzMywwLjc1IFogTTQuNTgzMzMzMzMsMi4wODMzMzMzMyBDMi45MjMzMzMzMywyLjA4MzMzMzMzIDEuNTgzMzMzMzMsMy40MjMzMzMzMyAxLjU4MzMzMzMzLDUuMDgzMzMzMzMgQzEuNTgzMzMzMzMsNi43NDMzMzMzMyAyLjkyMzMzMzMzLDguMDgzMzMzMzMgNC41ODMzMzMzMyw4LjA4MzMzMzMzIEM2LjI0MzMzMzMzLDguMDgzMzMzMzMgNy41ODMzMzMzMyw2Ljc0MzMzMzMzIDcuNTgzMzMzMzMsNS4wODMzMzMzMyBDNy41ODMzMzMzMywzLjQyMzMzMzMzIDYuMjQzMzMzMzMsMi4wODMzMzMzMyA0LjU4MzMzMzMzLDIuMDgzMzMzMzMgWiBNNC45MTY2NjY2NywzLjQxNjY2NjY3IEw0LjkxNjY2NjY3LDQuNzUgTDYuMjUsNC43NSBMNi4yNSw1LjQxNjY2NjY3IEw0LjkxNjY2NjY3LDUuNDE2NjY2NjcgTDQuOTE2NjY2NjcsNi43NSBMNC4yNSw2Ljc1IEw0LjI1LDUuNDE2NjY2NjcgTDIuOTE2NjY2NjcsNS40MTY2NjY2NyBMMi45MTY2NjY2Nyw0Ljc1IEw0LjI1LDQuNzUgTDQuMjUsMy40MTY2NjY2NyBMNC45MTY2NjY2NywzLjQxNjY2NjY3IFoiIGlkPSJDb21iaW5lZC1TaGFwZSI+PC9wYXRoPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=)}.image-option-selected{border:.125rem solid var(--primary-color)}.checkmark{display:block;height:1.25rem;width:1.25rem;border-radius:50%;border:.125rem solid var(--quml-checkmark)}.container input{position:absolute;opacity:0;cursor:pointer}.container input:checked~.checkmark,.quml-option--selected .checkmark{position:relative;background-color:var(--quml-option-selected-checkmark);border:.125rem solid var(--primary-color)}.quml-option--selected .checkmark:after,input:checked~.checkmark:after{content:\"\";opacity:1}.container .checkmark:after,.quml-option--selected .container .checkmark:after{margin:0;width:.75rem;height:.75rem;border-radius:50%;background:var(--primary-color);position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);opacity:0}.quml-option--selected .container .checkmark:after{opacity:1}.quml-option--selected{border:.125rem solid var(--primary-color)}"]
            }] }
];
/** @nocollapse */
McqImageOptionComponent.ctorParameters = () => [];
McqImageOptionComponent.propDecorators = {
    mcqQuestion: [{ type: Input }],
    solutions: [{ type: Input }],
    mcqOption: [{ type: Input }],
    imgOptionSelected: [{ type: Output }]
};
if (false) {
    /** @type {?} */
    McqImageOptionComponent.prototype.showQumlPopup;
    /** @type {?} */
    McqImageOptionComponent.prototype.qumlPopupImage;
    /** @type {?} */
    McqImageOptionComponent.prototype.mcqQuestion;
    /** @type {?} */
    McqImageOptionComponent.prototype.solutions;
    /** @type {?} */
    McqImageOptionComponent.prototype.mcqOption;
    /** @type {?} */
    McqImageOptionComponent.prototype.imgOptionSelected;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWNxLWltYWdlLW9wdGlvbi5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AcHJvamVjdC1zdW5iaXJkL3N1bmJpcmQtcXVtbC1wbGF5ZXItdjkvIiwic291cmNlcyI6WyJsaWIvbWNxLWltYWdlLW9wdGlvbi9tY3EtaW1hZ2Utb3B0aW9uLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQVUsTUFBTSxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQWlCLE1BQU0sZUFBZSxDQUFDO0FBTzlGLE1BQU0sT0FBTyx1QkFBdUI7SUFPbEM7UUFOQSxrQkFBYSxHQUFHLEtBQUssQ0FBQztRQUtaLHNCQUFpQixHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7SUFDakMsQ0FBQzs7OztJQUVqQixRQUFRO0lBRVIsQ0FBQzs7Ozs7SUFFRCxTQUFTLENBQUMsS0FBSztRQUNiLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO1FBQzFCLElBQUksQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFDO0lBRTlCLENBQUM7Ozs7O0lBRUQsYUFBYSxDQUFDLFNBQVM7UUFDckIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FDekI7WUFDRSxJQUFJLEVBQUUsY0FBYztZQUNwQixNQUFNLEVBQUUsU0FBUztZQUNqQixTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVM7U0FDMUIsQ0FDRixDQUFDO0lBQ0osQ0FBQzs7Ozs7O0lBRUQsT0FBTyxDQUFDLEtBQW9CLEVBQUUsU0FBUztRQUNyQyxJQUFJLEtBQUssQ0FBQyxPQUFPLEtBQUssRUFBRSxFQUFFO1lBQ3hCLEtBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQztZQUN4QixJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQy9CO0lBQ0gsQ0FBQzs7Ozs7SUFFRCxTQUFTLENBQUMsVUFBVTtRQUNsQixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztRQUMxQixJQUFJLENBQUMsY0FBYyxHQUFHLFVBQVUsQ0FBQztJQUNuQyxDQUFDOzs7O0lBRUQsVUFBVTtRQUNSLElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDO0lBQzdCLENBQUM7OztZQWhERixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLHVCQUF1QjtnQkFDakMsMGhCQUFnRDs7YUFFakQ7Ozs7OzBCQUlFLEtBQUs7d0JBQ0wsS0FBSzt3QkFDTCxLQUFLO2dDQUNMLE1BQU07Ozs7SUFMUCxnREFBc0I7O0lBQ3RCLGlEQUFvQjs7SUFDcEIsOENBQTBCOztJQUMxQiw0Q0FBd0I7O0lBQ3hCLDRDQUF3Qjs7SUFDeEIsb0RBQWlEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgQWZ0ZXJWaWV3SW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdxdW1sLW1jcS1pbWFnZS1vcHRpb24nLFxuICB0ZW1wbGF0ZVVybDogJy4vbWNxLWltYWdlLW9wdGlvbi5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL21jcS1pbWFnZS1vcHRpb24uY29tcG9uZW50LnNjc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBNY3FJbWFnZU9wdGlvbkNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIHNob3dRdW1sUG9wdXAgPSBmYWxzZTtcbiAgcXVtbFBvcHVwSW1hZ2U6IGFueTtcbiAgQElucHV0KCkgbWNxUXVlc3Rpb246IGFueTtcbiAgQElucHV0KCkgc29sdXRpb25zOiBhbnk7XG4gIEBJbnB1dCgpIG1jcU9wdGlvbjogYW55O1xuICBAT3V0cHV0KCkgaW1nT3B0aW9uU2VsZWN0ZWQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIGNvbnN0cnVjdG9yKCkgeyB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgXG4gIH1cblxuICBzaG93UG9wdXAoaW1hZ2UpIHtcbiAgICB0aGlzLnNob3dRdW1sUG9wdXAgPSB0cnVlO1xuICAgIHRoaXMucXVtbFBvcHVwSW1hZ2UgPSBpbWFnZTtcblxuICB9XG5cbiAgb3B0aW9uQ2xpY2tlZChtY3FPcHRpb24pIHtcbiAgICB0aGlzLmltZ09wdGlvblNlbGVjdGVkLmVtaXQoXG4gICAgICB7XG4gICAgICAgIG5hbWU6ICdvcHRpb25TZWxlY3QnLFxuICAgICAgICBvcHRpb246IG1jcU9wdGlvbixcbiAgICAgICAgc29sdXRpb25zOiB0aGlzLnNvbHV0aW9uc1xuICAgICAgfVxuICAgICk7XG4gIH1cblxuICBvbkVudGVyKGV2ZW50OiBLZXlib2FyZEV2ZW50LCBtY3FPcHRpb24pIHtcbiAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gMTMpIHtcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgdGhpcy5vcHRpb25DbGlja2VkKG1jcU9wdGlvbik7XG4gICAgfVxuICB9XG5cbiAgb3BlblBvcHVwKG9wdGlvbkh0bWwpIHtcbiAgICB0aGlzLnNob3dRdW1sUG9wdXAgPSB0cnVlO1xuICAgIHRoaXMucXVtbFBvcHVwSW1hZ2UgPSBvcHRpb25IdG1sO1xuICB9XG5cbiAgY2xvc2VQb3BVcCgpIHtcbiAgICB0aGlzLnNob3dRdW1sUG9wdXAgPSBmYWxzZTtcbiAgfVxuXG59XG4iXX0=