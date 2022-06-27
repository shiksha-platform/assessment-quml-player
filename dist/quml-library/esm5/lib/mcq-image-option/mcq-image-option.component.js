/**
 * @fileoverview added by tsickle
 * Generated from: lib/mcq-image-option/mcq-image-option.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Output, EventEmitter, Input } from '@angular/core';
var McqImageOptionComponent = /** @class */ (function () {
    function McqImageOptionComponent() {
        this.showQumlPopup = false;
        this.imgOptionSelected = new EventEmitter();
    }
    /**
     * @return {?}
     */
    McqImageOptionComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
    };
    /**
     * @param {?} image
     * @return {?}
     */
    McqImageOptionComponent.prototype.showPopup = /**
     * @param {?} image
     * @return {?}
     */
    function (image) {
        this.showQumlPopup = true;
        this.qumlPopupImage = image;
    };
    /**
     * @param {?} mcqOption
     * @return {?}
     */
    McqImageOptionComponent.prototype.optionClicked = /**
     * @param {?} mcqOption
     * @return {?}
     */
    function (mcqOption) {
        this.imgOptionSelected.emit({
            name: 'optionSelect',
            option: mcqOption,
            solutions: this.solutions
        });
    };
    /**
     * @param {?} event
     * @param {?} mcqOption
     * @return {?}
     */
    McqImageOptionComponent.prototype.onEnter = /**
     * @param {?} event
     * @param {?} mcqOption
     * @return {?}
     */
    function (event, mcqOption) {
        if (event.keyCode === 13) {
            event.stopPropagation();
            this.optionClicked(mcqOption);
        }
    };
    /**
     * @param {?} optionHtml
     * @return {?}
     */
    McqImageOptionComponent.prototype.openPopup = /**
     * @param {?} optionHtml
     * @return {?}
     */
    function (optionHtml) {
        this.showQumlPopup = true;
        this.qumlPopupImage = optionHtml;
    };
    /**
     * @return {?}
     */
    McqImageOptionComponent.prototype.closePopUp = /**
     * @return {?}
     */
    function () {
        this.showQumlPopup = false;
    };
    McqImageOptionComponent.decorators = [
        { type: Component, args: [{
                    selector: 'quml-mcq-image-option',
                    template: "<div class=\"quml-mcq-option-card\" (click)=\"optionClicked(mcqOption)\" tabindex=\"0\" (keydown)=\"onEnter($event, mcqOption)\"\n  [ngClass]=\"mcqOption?.selected ? 'quml-mcq-option-card quml-option--selected' : 'quml-mcq-option-card'\">\n  <div class=\"option\" *ngIf=\"mcqOption\"\n    [innerHTML]=\"mcqOption.label | safeHtml\"></div>\n    <label class=\"container\">\n      <input type=\"radio\" name=\"radio\" role=\"radio\" [checked]=\"mcqOption.selected\" >\n      <span class=\"checkmark\"></span>\n  </label>\n</div>",
                    styles: ["::ng-deep :root{--quml-btn-border:#ccc;--quml-color-gray:#666;--quml-checkmark:#cdcdcd;--quml-color-primary-shade:rgba(0, 0, 0, .1);--quml-option-card-bg:#fff;--quml-option-selected-checkmark:#ffff}.quml-mcq-option-card{position:relative;background-color:var(--quml-option-card-bg);padding:1rem;border-radius:.25rem;border:.0625rem solid var(--quml-btn-border);box-shadow:0 .125rem .75rem 0 var(--quml-color-primary-shade);display:flex;align-items:center;justify-content:space-between;height:100%;gap:.5rem}.quml-mcq-option-card .option-image{position:relative}.quml-mcq-option-card .option-image img{min-width:100%;vertical-align:bottom;width:100%!important}.quml-mcq-option-card .option{color:var(--quml-color-gray);font-size:.75rem;font-weight:700;flex:1}.quml-mcq-option-card label{margin-bottom:0}.zoom-in-icon{position:absolute;right:.5rem;bottom:0}::ng-deep .quml-mcq-option-card .option img{max-width:100%}::ng-deep .quml-mcq-option-card .option label{margin-bottom:0}.selected-option-text{color:var(--primary-color)!important}.icon-zommin{position:absolute;bottom:2px;right:-1px;content:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTlweCIgaGVpZ2h0PSIxOXB4IiB2aWV3Qm94PSIwIDAgMTkgMTkiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDYyICg5MTM5MCkgLSBodHRwczovL3NrZXRjaC5jb20gLS0+CiAgICA8dGl0bGU+em9vbTwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxnIGlkPSJkZXZzIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iem9vbSI+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik05LjUsMCBMMTgsMCBDMTguNTUyMjg0NywtMS4wMTQ1MzA2M2UtMTYgMTksMC40NDc3MTUyNSAxOSwxIEwxOSwxMyBDMTksMTYuMzEzNzA4NSAxNi4zMTM3MDg1LDE5IDEzLDE5IEwxLDE5IEMwLjQ0NzcxNTI1LDE5IDYuNzYzNTM3NTFlLTE3LDE4LjU1MjI4NDcgMCwxOCBMMCw5LjUgQy02LjQyNTM2MDY0ZS0xNiw0LjI1MzI5NDg4IDQuMjUzMjk0ODgsOS42MzgwNDA5NWUtMTYgOS41LDAgWiIgaWQ9IlJlY3RhbmdsZSIgZmlsbC1vcGFjaXR5PSIwLjUiIGZpbGw9IiM0MzQzNDMiIGZpbGwtcnVsZT0ibm9uemVybyI+PC9wYXRoPgogICAgICAgICAgICA8ZyBpZD0iR3JvdXAiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDUuMDAwMDAwLCA0LjAwMDAwMCkiIGZpbGw9IiNGRkZGRkYiPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTQuNTgzMzMzMzMsMC43NSBDNi45NzY2NjY2NywwLjc1IDguOTE2NjY2NjcsMi42OSA4LjkxNjY2NjY3LDUuMDgzMzMzMzMgQzguOTE2NjY2NjcsNi4xNTY2NjY2NyA4LjUyMzMzMzMzLDcuMTQzMzMzMzMgNy44Nyw3LjkwMzMzMzMzIEw3Ljg3LDcuOTAzMzMzMzMgTDguMDU2NjY2NjcsOC4wODMzMzMzMyBMOC41ODMzMzMzMyw4LjA4MzMzMzMzIEwxMS45MSwxMS40MTY2NjY3IEwxMC45MTY2NjY3LDEyLjQxIEw3LjU4MzMzMzMzLDkuMDgzMzMzMzMgTDcuNTgzMzMzMzMsOC41NTY2NjY2NyBMNy40MDMzMzMzMyw4LjM3IEM2LjY0MzMzMzMzLDkuMDIzMzMzMzMgNS42NTY2NjY2Nyw5LjQxNjY2NjY3IDQuNTgzMzMzMzMsOS40MTY2NjY2NyBDMi4xOSw5LjQxNjY2NjY3IDAuMjUsNy40NzY2NjY2NyAwLjI1LDUuMDgzMzMzMzMgQzAuMjUsMi42OSAyLjE5LDAuNzUgNC41ODMzMzMzMywwLjc1IFogTTQuNTgzMzMzMzMsMi4wODMzMzMzMyBDMi45MjMzMzMzMywyLjA4MzMzMzMzIDEuNTgzMzMzMzMsMy40MjMzMzMzMyAxLjU4MzMzMzMzLDUuMDgzMzMzMzMgQzEuNTgzMzMzMzMsNi43NDMzMzMzMyAyLjkyMzMzMzMzLDguMDgzMzMzMzMgNC41ODMzMzMzMyw4LjA4MzMzMzMzIEM2LjI0MzMzMzMzLDguMDgzMzMzMzMgNy41ODMzMzMzMyw2Ljc0MzMzMzMzIDcuNTgzMzMzMzMsNS4wODMzMzMzMyBDNy41ODMzMzMzMywzLjQyMzMzMzMzIDYuMjQzMzMzMzMsMi4wODMzMzMzMyA0LjU4MzMzMzMzLDIuMDgzMzMzMzMgWiBNNC45MTY2NjY2NywzLjQxNjY2NjY3IEw0LjkxNjY2NjY3LDQuNzUgTDYuMjUsNC43NSBMNi4yNSw1LjQxNjY2NjY3IEw0LjkxNjY2NjY3LDUuNDE2NjY2NjcgTDQuOTE2NjY2NjcsNi43NSBMNC4yNSw2Ljc1IEw0LjI1LDUuNDE2NjY2NjcgTDIuOTE2NjY2NjcsNS40MTY2NjY2NyBMMi45MTY2NjY2Nyw0Ljc1IEw0LjI1LDQuNzUgTDQuMjUsMy40MTY2NjY2NyBMNC45MTY2NjY2NywzLjQxNjY2NjY3IFoiIGlkPSJDb21iaW5lZC1TaGFwZSI+PC9wYXRoPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=)}.image-option-selected{border:.125rem solid var(--primary-color)}.checkmark{display:block;height:1.25rem;width:1.25rem;border-radius:50%;border:.125rem solid var(--quml-checkmark)}.container input{position:absolute;opacity:0;cursor:pointer}.container input:checked~.checkmark,.quml-option--selected .checkmark{position:relative;background-color:var(--quml-option-selected-checkmark);border:.125rem solid var(--primary-color)}.quml-option--selected .checkmark:after,input:checked~.checkmark:after{content:\"\";opacity:1}.container .checkmark:after,.quml-option--selected .container .checkmark:after{margin:0;width:.75rem;height:.75rem;border-radius:50%;background:var(--primary-color);position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);opacity:0}.quml-option--selected .container .checkmark:after{opacity:1}.quml-option--selected{border:.125rem solid var(--primary-color)}"]
                }] }
    ];
    /** @nocollapse */
    McqImageOptionComponent.ctorParameters = function () { return []; };
    McqImageOptionComponent.propDecorators = {
        mcqQuestion: [{ type: Input }],
        solutions: [{ type: Input }],
        mcqOption: [{ type: Input }],
        imgOptionSelected: [{ type: Output }]
    };
    return McqImageOptionComponent;
}());
export { McqImageOptionComponent };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWNxLWltYWdlLW9wdGlvbi5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AcHJvamVjdC1zdW5iaXJkL3N1bmJpcmQtcXVtbC1wbGF5ZXItdjkvIiwic291cmNlcyI6WyJsaWIvbWNxLWltYWdlLW9wdGlvbi9tY3EtaW1hZ2Utb3B0aW9uLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQVUsTUFBTSxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQWlCLE1BQU0sZUFBZSxDQUFDO0FBRTlGO0lBWUU7UUFOQSxrQkFBYSxHQUFHLEtBQUssQ0FBQztRQUtaLHNCQUFpQixHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7SUFDakMsQ0FBQzs7OztJQUVqQiwwQ0FBUTs7O0lBQVI7SUFFQSxDQUFDOzs7OztJQUVELDJDQUFTOzs7O0lBQVQsVUFBVSxLQUFLO1FBQ2IsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7UUFDMUIsSUFBSSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUM7SUFFOUIsQ0FBQzs7Ozs7SUFFRCwrQ0FBYTs7OztJQUFiLFVBQWMsU0FBUztRQUNyQixJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUN6QjtZQUNFLElBQUksRUFBRSxjQUFjO1lBQ3BCLE1BQU0sRUFBRSxTQUFTO1lBQ2pCLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUztTQUMxQixDQUNGLENBQUM7SUFDSixDQUFDOzs7Ozs7SUFFRCx5Q0FBTzs7Ozs7SUFBUCxVQUFRLEtBQW9CLEVBQUUsU0FBUztRQUNyQyxJQUFJLEtBQUssQ0FBQyxPQUFPLEtBQUssRUFBRSxFQUFFO1lBQ3hCLEtBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQztZQUN4QixJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQy9CO0lBQ0gsQ0FBQzs7Ozs7SUFFRCwyQ0FBUzs7OztJQUFULFVBQVUsVUFBVTtRQUNsQixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztRQUMxQixJQUFJLENBQUMsY0FBYyxHQUFHLFVBQVUsQ0FBQztJQUNuQyxDQUFDOzs7O0lBRUQsNENBQVU7OztJQUFWO1FBQ0UsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7SUFDN0IsQ0FBQzs7Z0JBaERGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsdUJBQXVCO29CQUNqQywwaEJBQWdEOztpQkFFakQ7Ozs7OzhCQUlFLEtBQUs7NEJBQ0wsS0FBSzs0QkFDTCxLQUFLO29DQUNMLE1BQU07O0lBdUNULDhCQUFDO0NBQUEsQUFsREQsSUFrREM7U0E3Q1ksdUJBQXVCOzs7SUFDbEMsZ0RBQXNCOztJQUN0QixpREFBb0I7O0lBQ3BCLDhDQUEwQjs7SUFDMUIsNENBQXdCOztJQUN4Qiw0Q0FBd0I7O0lBQ3hCLG9EQUFpRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBPdXRwdXQsIEV2ZW50RW1pdHRlciwgSW5wdXQsIEFmdGVyVmlld0luaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAncXVtbC1tY3EtaW1hZ2Utb3B0aW9uJyxcbiAgdGVtcGxhdGVVcmw6ICcuL21jcS1pbWFnZS1vcHRpb24uY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9tY3EtaW1hZ2Utb3B0aW9uLmNvbXBvbmVudC5zY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgTWNxSW1hZ2VPcHRpb25Db21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICBzaG93UXVtbFBvcHVwID0gZmFsc2U7XG4gIHF1bWxQb3B1cEltYWdlOiBhbnk7XG4gIEBJbnB1dCgpIG1jcVF1ZXN0aW9uOiBhbnk7XG4gIEBJbnB1dCgpIHNvbHV0aW9uczogYW55O1xuICBASW5wdXQoKSBtY3FPcHRpb246IGFueTtcbiAgQE91dHB1dCgpIGltZ09wdGlvblNlbGVjdGVkID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBjb25zdHJ1Y3RvcigpIHsgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIFxuICB9XG5cbiAgc2hvd1BvcHVwKGltYWdlKSB7XG4gICAgdGhpcy5zaG93UXVtbFBvcHVwID0gdHJ1ZTtcbiAgICB0aGlzLnF1bWxQb3B1cEltYWdlID0gaW1hZ2U7XG5cbiAgfVxuXG4gIG9wdGlvbkNsaWNrZWQobWNxT3B0aW9uKSB7XG4gICAgdGhpcy5pbWdPcHRpb25TZWxlY3RlZC5lbWl0KFxuICAgICAge1xuICAgICAgICBuYW1lOiAnb3B0aW9uU2VsZWN0JyxcbiAgICAgICAgb3B0aW9uOiBtY3FPcHRpb24sXG4gICAgICAgIHNvbHV0aW9uczogdGhpcy5zb2x1dGlvbnNcbiAgICAgIH1cbiAgICApO1xuICB9XG5cbiAgb25FbnRlcihldmVudDogS2V5Ym9hcmRFdmVudCwgbWNxT3B0aW9uKSB7XG4gICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IDEzKSB7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIHRoaXMub3B0aW9uQ2xpY2tlZChtY3FPcHRpb24pO1xuICAgIH1cbiAgfVxuXG4gIG9wZW5Qb3B1cChvcHRpb25IdG1sKSB7XG4gICAgdGhpcy5zaG93UXVtbFBvcHVwID0gdHJ1ZTtcbiAgICB0aGlzLnF1bWxQb3B1cEltYWdlID0gb3B0aW9uSHRtbDtcbiAgfVxuXG4gIGNsb3NlUG9wVXAoKSB7XG4gICAgdGhpcy5zaG93UXVtbFBvcHVwID0gZmFsc2U7XG4gIH1cblxufVxuIl19