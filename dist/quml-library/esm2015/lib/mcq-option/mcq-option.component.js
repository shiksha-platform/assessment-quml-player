/**
 * @fileoverview added by tsickle
 * Generated from: lib/mcq-option/mcq-option.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UtilService } from '../util-service';
export class McqOptionComponent {
    /**
     * @param {?} utilService
     */
    constructor(utilService) {
        this.utilService = utilService;
        this.showPopup = new EventEmitter();
        this.optionSelected = new EventEmitter();
        this.selectedOption = [];
    }
    /**
     * @return {?}
     */
    ngOnChanges() {
        if (this.replayed) {
            this.mcqOptions.forEach((/**
             * @param {?} ele
             * @return {?}
             */
            (ele) => {
                ele.selected = false;
            }));
        }
        if (this.tryAgain) {
            this.unselectOption();
        }
    }
    /**
     * @return {?}
     */
    unselectOption() {
        this.mcqOptions.forEach((/**
         * @param {?} ele
         * @return {?}
         */
        (ele) => {
            ele.selected = false;
        }));
        this.selectedOption = [];
        this.optionSelected.emit({
            name: 'optionSelect',
            option: this.selectedOption,
            cardinality: this.cardinality,
            solutions: this.solutions
        });
    }
    /**
     * @param {?} event
     * @param {?} mcqOption
     * @return {?}
     */
    onOptionSelect(event, mcqOption) {
        this.mcqOptions.forEach((/**
         * @param {?} ele
         * @return {?}
         */
        (ele) => {
            if (this.cardinality === 'single') {
                if (ele.label === mcqOption.label) {
                    ele.selected = true;
                }
                else {
                    ele.selected = false;
                }
            }
            else if (this.cardinality === 'multiple') {
                if (ele.label === mcqOption.label && !this.utilService.hasDuplicates(this.selectedOption, mcqOption)) {
                    ele.selected = true;
                    this.selectedOption.push(mcqOption);
                }
            }
        }));
        this.optionSelected.emit({
            name: 'optionSelect',
            option: this.cardinality === 'single' ? mcqOption : this.selectedOption,
            cardinality: this.cardinality,
            solutions: this.solutions
        });
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onImageOptionSelected(event) {
        this.onOptionSelect(event, event.option);
    }
    /**
     * @return {?}
     */
    showQumlPopup() {
        this.showPopup.emit();
    }
    /**
     * @param {?} event
     * @param {?} mcqOption
     * @return {?}
     */
    onEnter(event, mcqOption) {
        if (event.keyCode === 13) {
            event.stopPropagation();
            this.onOptionSelect(event, mcqOption);
        }
    }
}
McqOptionComponent.decorators = [
    { type: Component, args: [{
                selector: 'quml-mcq-option',
                template: "<div class=\"quml-mcq-options\" role=\"radiogroup\"  *ngIf=\"layout=='DEFAULT' || layout=='IMAGEQOPTION'\">\n    <div class=\"quml-option-card\" tabindex=\"0\" role=\"checkbox\" [attr.aria-checked]=\"mcqOption.selected\" aria-labelledby=\"option-checkbox\"  *ngFor=\"let mcqOption of mcqOptions\" \n    (keydown)=\"onEnter($event, mcqOption)\" (click)=\"onOptionSelect($event,mcqOption)\">\n        <div class=\"quml-option\"\n        [ngClass]=\"(mcqOption.selected==true)?'quml-option quml-option--selected':'quml-option'\">\n            <div class=\"option\" tabindex=\"0\" [innerHTML]=\"mcqOption.label | safeHtml\"></div>\n            <label class=\"container\">\n                <input type=\"radio\" name=\"radio\" [checked]=\"mcqOption.selected\" id=\"option-checkbox\" tabindex=\"-1\">\n                <span class=\"checkmark\"></span>\n            </label>\n        </div>\n    </div>\n</div>\n<div *ngIf=\"layout=='IMAGEGRID'\">\n    <div class=\"qumlImageOption\">\n        <div class=\"wrapper\">\n            <div *ngFor=\"let mcqOption of mcqOptions\">\n                <quml-mcq-image-option (imgOptionSelected)=\"onImageOptionSelected($event)\" [mcqOption]='mcqOption'></quml-mcq-image-option>\n            </div>\n        </div>\n    </div>\n\n</div>\n<div *ngIf=\"layout == 'IMAGEQAGRID'\">\n    <div class=\"qumlOption-imageQaGrid\">\n        <div class=\"wrapper\">\n            <div *ngFor=\"let mcqOption of mcqOptions\">\n                <quml-mcq-image-option (imgOptionSelected)=\"onImageOptionSelected($event)\" [mcqOption]='mcqOption'></quml-mcq-image-option>\n            </div>\n        </div>\n    </div>\n</div>\n<div class=\"\" *ngIf=\"layout=='MULTIIMAGEGRID'\">\n    <div class=\"qumlImageOption\">\n        <div class=\"wrapper\">\n            <div *ngFor=\"let mcqOption of mcqOptions\">\n                <quml-mcq-image-option (imgOptionSelected)=\"onImageOptionSelected($event)\"  [mcqOption]='mcqOption'></quml-mcq-image-option>\n            </div>\n        </div>\n    </div>\n\n</div>",
                styles: ["@charset \"UTF-8\";::ng-deep :root{--quml-btn-border:#ccc;--quml-color-gray:#666;--quml-checkmark:#cdcdcd;--quml-color-primary-shade:rgba(0, 0, 0, .1);--quml-color-success:#08BC82;--quml-color-danger:#F1635D;--quml-option-card-bg:#fff;--quml-option-selected-checkmark:#fff;--quml-option-selected-checkmark-icon:#fff}.quml-mcq-options{align-items:center;margin-bottom:.5rem}.quml-option-card .option{color:var(--quml-active-slide);color:var(--quml-color-gray);font-size:.875rem}::ng-deep .quml-option-card .option p{margin-bottom:0;font-size:19px}.quml-option label.container{margin:0 auto}.quml-option-card{margin-bottom:1rem}.quml-option{position:relative;background-color:var(--quml-option-card-bg);padding:1rem;border-radius:.25rem;border:.0625rem solid var(--quml-btn-border);box-shadow:0 .125rem .75rem 0 var(--quml-color-primary-shade);display:flex;align-items:center;justify-content:space-between;height:100%;gap:.5rem}.quml-option .option{flex:1}.quml-option--selected{border:.125rem solid var(--primary-color)}.quml-option--correct{border:.125rem solid var(--quml-color-success)}.quml-option--wrong{border:.125rem solid var(--quml-color-danger)}.selected-option{border:.125rem solid var(--primary-color)}.selected-option-text{color:var(--primary-color)!important}.container{padding-right:0!important}.checkmark{display:block;height:1.25rem;width:1.25rem;border-radius:50%;border:.125rem solid var(--quml-checkmark)}.container input{position:absolute;opacity:0;cursor:pointer}.container input:checked~.checkmark,.quml-option--selected .checkmark{position:relative;background-color:var(--quml-option-selected-checkmark);border:.125rem solid var(--primary-color)}.quml-option--selected .checkmark:after,input:checked~.checkmark:after{content:\"\";opacity:1}.container .checkmark:after,.quml-option--selected .container .checkmark:after{margin:0;width:.75rem;height:.75rem;border-radius:50%;background:var(--primary-color);position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);opacity:0}.quml-option--selected .container .checkmark:after{opacity:1}.quml-option--correct .container input:checked~.checkmark{border-color:var(--quml-color-success);background-color:var(--quml-color-success)}.quml-option--correct .container input:checked~.checkmark:after{content:\"\u2714\";color:var(--quml-option-selected-checkmark-icon)}.quml-option--wrong .container input:checked~.checkmark{border-color:var(--quml-color-danger)}.quml-option--wrong .container input:checked~.checkmark:after{content:\"\u2716\";color:var(--quml-color-danger)}.quml-option--correct .container input:checked~.checkmark:after,.quml-option--wrong .container input:checked~.checkmark:after{width:auto;height:auto;background-color:transparent;font-size:.75rem}img{width:100%!important}.option-img{position:relative}.option-img img{width:100%}.icon-zommin{position:absolute;bottom:0;right:0;content:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTlweCIgaGVpZ2h0PSIxOXB4IiB2aWV3Qm94PSIwIDAgMTkgMTkiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDYyICg5MTM5MCkgLSBodHRwczovL3NrZXRjaC5jb20gLS0+CiAgICA8dGl0bGU+em9vbTwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxnIGlkPSJkZXZzIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iem9vbSI+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik05LjUsMCBMMTgsMCBDMTguNTUyMjg0NywtMS4wMTQ1MzA2M2UtMTYgMTksMC40NDc3MTUyNSAxOSwxIEwxOSwxMyBDMTksMTYuMzEzNzA4NSAxNi4zMTM3MDg1LDE5IDEzLDE5IEwxLDE5IEMwLjQ0NzcxNTI1LDE5IDYuNzYzNTM3NTFlLTE3LDE4LjU1MjI4NDcgMCwxOCBMMCw5LjUgQy02LjQyNTM2MDY0ZS0xNiw0LjI1MzI5NDg4IDQuMjUzMjk0ODgsOS42MzgwNDA5NWUtMTYgOS41LDAgWiIgaWQ9IlJlY3RhbmdsZSIgZmlsbC1vcGFjaXR5PSIwLjUiIGZpbGw9IiM0MzQzNDMiIGZpbGwtcnVsZT0ibm9uemVybyI+PC9wYXRoPgogICAgICAgICAgICA8ZyBpZD0iR3JvdXAiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDUuMDAwMDAwLCA0LjAwMDAwMCkiIGZpbGw9IiNGRkZGRkYiPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTQuNTgzMzMzMzMsMC43NSBDNi45NzY2NjY2NywwLjc1IDguOTE2NjY2NjcsMi42OSA4LjkxNjY2NjY3LDUuMDgzMzMzMzMgQzguOTE2NjY2NjcsNi4xNTY2NjY2NyA4LjUyMzMzMzMzLDcuMTQzMzMzMzMgNy44Nyw3LjkwMzMzMzMzIEw3Ljg3LDcuOTAzMzMzMzMgTDguMDU2NjY2NjcsOC4wODMzMzMzMyBMOC41ODMzMzMzMyw4LjA4MzMzMzMzIEwxMS45MSwxMS40MTY2NjY3IEwxMC45MTY2NjY3LDEyLjQxIEw3LjU4MzMzMzMzLDkuMDgzMzMzMzMgTDcuNTgzMzMzMzMsOC41NTY2NjY2NyBMNy40MDMzMzMzMyw4LjM3IEM2LjY0MzMzMzMzLDkuMDIzMzMzMzMgNS42NTY2NjY2Nyw5LjQxNjY2NjY3IDQuNTgzMzMzMzMsOS40MTY2NjY2NyBDMi4xOSw5LjQxNjY2NjY3IDAuMjUsNy40NzY2NjY2NyAwLjI1LDUuMDgzMzMzMzMgQzAuMjUsMi42OSAyLjE5LDAuNzUgNC41ODMzMzMzMywwLjc1IFogTTQuNTgzMzMzMzMsMi4wODMzMzMzMyBDMi45MjMzMzMzMywyLjA4MzMzMzMzIDEuNTgzMzMzMzMsMy40MjMzMzMzMyAxLjU4MzMzMzMzLDUuMDgzMzMzMzMgQzEuNTgzMzMzMzMsNi43NDMzMzMzMyAyLjkyMzMzMzMzLDguMDgzMzMzMzMgNC41ODMzMzMzMyw4LjA4MzMzMzMzIEM2LjI0MzMzMzMzLDguMDgzMzMzMzMgNy41ODMzMzMzMyw2Ljc0MzMzMzMzIDcuNTgzMzMzMzMsNS4wODMzMzMzMyBDNy41ODMzMzMzMywzLjQyMzMzMzMzIDYuMjQzMzMzMzMsMi4wODMzMzMzMyA0LjU4MzMzMzMzLDIuMDgzMzMzMzMgWiBNNC45MTY2NjY2NywzLjQxNjY2NjY3IEw0LjkxNjY2NjY3LDQuNzUgTDYuMjUsNC43NSBMNi4yNSw1LjQxNjY2NjY3IEw0LjkxNjY2NjY3LDUuNDE2NjY2NjcgTDQuOTE2NjY2NjcsNi43NSBMNC4yNSw2Ljc1IEw0LjI1LDUuNDE2NjY2NjcgTDIuOTE2NjY2NjcsNS40MTY2NjY2NyBMMi45MTY2NjY2Nyw0Ljc1IEw0LjI1LDQuNzUgTDQuMjUsMy40MTY2NjY2NyBMNC45MTY2NjY2NywzLjQxNjY2NjY3IFoiIGlkPSJDb21iaW5lZC1TaGFwZSI+PC9wYXRoPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=)}.qumlImageOption .wrapper{margin-top:2rem;display:-ms-grid;display:grid;gap:1rem}.qumlOption-imageQaGrid .wrapper{display:-ms-grid;display:grid;-ms-grid-columns:(1fr)[2];grid-template-columns:repeat(2,1fr);grid-gap:1rem}@media only screen and (max-width:640px){.qumlOption-imageQaGrid .wrapper{-ms-grid-columns:(1fr)[1];grid-template-columns:repeat(1,1fr)}}@media only screen and (max-width:840px){.qumlImageOption .wrapper{-ms-grid-columns:(1fr)[2];grid-template-columns:repeat(2,1fr)}}@media only screen and (max-width:640px){.qumlImageOption .wrapper{-ms-grid-columns:(1fr)[1];grid-template-columns:repeat(1,1fr)}}"]
            }] }
];
/** @nocollapse */
McqOptionComponent.ctorParameters = () => [
    { type: UtilService }
];
McqOptionComponent.propDecorators = {
    mcqOptions: [{ type: Input }],
    solutions: [{ type: Input }],
    layout: [{ type: Input }],
    cardinality: [{ type: Input }],
    showPopup: [{ type: Output }],
    optionSelected: [{ type: Output }],
    replayed: [{ type: Input }],
    tryAgain: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    McqOptionComponent.prototype.mcqOptions;
    /** @type {?} */
    McqOptionComponent.prototype.solutions;
    /** @type {?} */
    McqOptionComponent.prototype.layout;
    /** @type {?} */
    McqOptionComponent.prototype.cardinality;
    /** @type {?} */
    McqOptionComponent.prototype.showPopup;
    /** @type {?} */
    McqOptionComponent.prototype.optionSelected;
    /** @type {?} */
    McqOptionComponent.prototype.selectedOption;
    /** @type {?} */
    McqOptionComponent.prototype.replayed;
    /** @type {?} */
    McqOptionComponent.prototype.tryAgain;
    /** @type {?} */
    McqOptionComponent.prototype.utilService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWNxLW9wdGlvbi5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AcHJvamVjdC1zdW5iaXJkL3N1bmJpcmQtcXVtbC1wbGF5ZXItdjkvIiwic291cmNlcyI6WyJsaWIvbWNxLW9wdGlvbi9tY3Etb3B0aW9uLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQWEsTUFBTSxlQUFlLENBQUM7QUFDbEYsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBTzlDLE1BQU0sT0FBTyxrQkFBa0I7Ozs7SUFZN0IsWUFDUyxXQUF5QjtRQUF6QixnQkFBVyxHQUFYLFdBQVcsQ0FBYztRQVB4QixjQUFTLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUMvQixtQkFBYyxHQUFHLElBQUksWUFBWSxFQUFPLENBQUM7UUFDbkQsbUJBQWMsR0FBRyxFQUFFLENBQUM7SUFNaEIsQ0FBQzs7OztJQUVMLFdBQVc7UUFDVCxJQUFHLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDaEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPOzs7O1lBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtnQkFDN0IsR0FBRyxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7WUFDeEIsQ0FBQyxFQUFDLENBQUE7U0FDSDtRQUNELElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNqQixJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7U0FDdkI7SUFDSCxDQUFDOzs7O0lBRUQsY0FBYztRQUNaLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTzs7OztRQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7WUFDOUIsR0FBRyxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7UUFDdkIsQ0FBQyxFQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsY0FBYyxHQUFHLEVBQUUsQ0FBQztRQUN6QixJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FDdEI7WUFDRSxJQUFJLEVBQUUsY0FBYztZQUNwQixNQUFNLEVBQUUsSUFBSSxDQUFDLGNBQWM7WUFDM0IsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXO1lBQzdCLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUztTQUMxQixDQUNGLENBQUM7SUFDSixDQUFDOzs7Ozs7SUFFRCxjQUFjLENBQUMsS0FBSyxFQUFFLFNBQVM7UUFDN0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPOzs7O1FBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtZQUM5QixJQUFJLElBQUksQ0FBQyxXQUFXLEtBQUssUUFBUSxFQUFFO2dCQUNqQyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEtBQUssU0FBUyxDQUFDLEtBQUssRUFBRTtvQkFDakMsR0FBRyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7aUJBQ3JCO3FCQUFNO29CQUNMLEdBQUcsQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO2lCQUN0QjthQUNGO2lCQUFNLElBQUcsSUFBSSxDQUFDLFdBQVcsS0FBSyxVQUFVLEVBQUU7Z0JBQ3pDLElBQUksR0FBRyxDQUFDLEtBQUssS0FBSyxTQUFTLENBQUMsS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRyxTQUFTLENBQUMsRUFBRTtvQkFDckcsR0FBRyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7b0JBQ3BCLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFBO2lCQUNwQzthQUNGO1FBQ0gsQ0FBQyxFQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FDdEI7WUFDRSxJQUFJLEVBQUUsY0FBYztZQUNwQixNQUFNLEVBQUUsSUFBSSxDQUFDLFdBQVcsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWM7WUFDdkUsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXO1lBQzdCLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUztTQUMxQixDQUNGLENBQUM7SUFDSixDQUFDOzs7OztJQUVELHFCQUFxQixDQUFDLEtBQUs7UUFDekIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzNDLENBQUM7Ozs7SUFFRCxhQUFhO1FBQ1gsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUN4QixDQUFDOzs7Ozs7SUFFRCxPQUFPLENBQUMsS0FBb0IsRUFBRSxTQUFTO1FBQ3JDLElBQUksS0FBSyxDQUFDLE9BQU8sS0FBSyxFQUFFLEVBQUU7WUFDeEIsS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO1lBQ3hCLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1NBQ3ZDO0lBQ0gsQ0FBQzs7O1lBckZGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsaUJBQWlCO2dCQUMzQix1L0RBQTBDOzthQUUzQzs7OztZQU5RLFdBQVc7Ozt5QkFTakIsS0FBSzt3QkFDTCxLQUFLO3FCQUNMLEtBQUs7MEJBQ0wsS0FBSzt3QkFDTCxNQUFNOzZCQUNOLE1BQU07dUJBRU4sS0FBSzt1QkFDTCxLQUFLOzs7O0lBUk4sd0NBQXlCOztJQUN6Qix1Q0FBd0I7O0lBQ3hCLG9DQUFxQjs7SUFDckIseUNBQTZCOztJQUM3Qix1Q0FBeUM7O0lBQ3pDLDRDQUFtRDs7SUFDbkQsNENBQW9COztJQUNwQixzQ0FBNEI7O0lBQzVCLHNDQUE2Qjs7SUFHM0IseUNBQWdDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIsIE9uQ2hhbmdlcyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgVXRpbFNlcnZpY2UgfSBmcm9tICcuLi91dGlsLXNlcnZpY2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdxdW1sLW1jcS1vcHRpb24nLFxuICB0ZW1wbGF0ZVVybDogJy4vbWNxLW9wdGlvbi5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL21jcS1vcHRpb24uY29tcG9uZW50LnNjc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBNY3FPcHRpb25Db21wb25lbnQgaW1wbGVtZW50cyBPbkNoYW5nZXMge1xuXG4gIEBJbnB1dCgpIG1jcU9wdGlvbnM6IGFueTtcbiAgQElucHV0KCkgc29sdXRpb25zOiBhbnk7XG4gIEBJbnB1dCgpIGxheW91dDogYW55O1xuICBASW5wdXQoKSBjYXJkaW5hbGl0eTogc3RyaW5nO1xuICBAT3V0cHV0KCkgc2hvd1BvcHVwID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgb3B0aW9uU2VsZWN0ZWQgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgc2VsZWN0ZWRPcHRpb24gPSBbXTsgXG4gIEBJbnB1dCgpIHJlcGxheWVkIDogYm9vbGVhbjtcbiAgQElucHV0KCkgdHJ5QWdhaW4/IDogYm9vbGVhbjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgdXRpbFNlcnZpY2UgOiBVdGlsU2VydmljZVxuICApIHsgfVxuXG4gIG5nT25DaGFuZ2VzKCkge1xuICAgIGlmKHRoaXMucmVwbGF5ZWQpIHtcbiAgICAgIHRoaXMubWNxT3B0aW9ucy5mb3JFYWNoKChlbGUpID0+IHtcbiAgICAgICAgIGVsZS5zZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgfSlcbiAgICB9XG4gICAgaWYgKHRoaXMudHJ5QWdhaW4pIHtcbiAgICAgIHRoaXMudW5zZWxlY3RPcHRpb24oKTtcbiAgICB9XG4gIH1cblxuICB1bnNlbGVjdE9wdGlvbigpe1xuICAgIHRoaXMubWNxT3B0aW9ucy5mb3JFYWNoKChlbGUpID0+IHtcbiAgICAgIGVsZS5zZWxlY3RlZCA9IGZhbHNlO1xuICAgIH0pO1xuICAgIHRoaXMuc2VsZWN0ZWRPcHRpb24gPSBbXTtcbiAgICB0aGlzLm9wdGlvblNlbGVjdGVkLmVtaXQoXG4gICAgICB7XG4gICAgICAgIG5hbWU6ICdvcHRpb25TZWxlY3QnLFxuICAgICAgICBvcHRpb246IHRoaXMuc2VsZWN0ZWRPcHRpb24sXG4gICAgICAgIGNhcmRpbmFsaXR5OiB0aGlzLmNhcmRpbmFsaXR5LFxuICAgICAgICBzb2x1dGlvbnM6IHRoaXMuc29sdXRpb25zXG4gICAgICB9XG4gICAgKTtcbiAgfVxuXG4gIG9uT3B0aW9uU2VsZWN0KGV2ZW50LCBtY3FPcHRpb24pIHtcbiAgICB0aGlzLm1jcU9wdGlvbnMuZm9yRWFjaCgoZWxlKSA9PiB7XG4gICAgICBpZiAodGhpcy5jYXJkaW5hbGl0eSA9PT0gJ3NpbmdsZScpIHtcbiAgICAgICAgaWYgKGVsZS5sYWJlbCA9PT0gbWNxT3B0aW9uLmxhYmVsKSB7XG4gICAgICAgICAgZWxlLnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlbGUuc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmKHRoaXMuY2FyZGluYWxpdHkgPT09ICdtdWx0aXBsZScpIHtcbiAgICAgICAgaWYgKGVsZS5sYWJlbCA9PT0gbWNxT3B0aW9uLmxhYmVsICYmICF0aGlzLnV0aWxTZXJ2aWNlLmhhc0R1cGxpY2F0ZXModGhpcy5zZWxlY3RlZE9wdGlvbiAsIG1jcU9wdGlvbikpIHtcbiAgICAgICAgICBlbGUuc2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgICAgIHRoaXMuc2VsZWN0ZWRPcHRpb24ucHVzaChtY3FPcHRpb24pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLm9wdGlvblNlbGVjdGVkLmVtaXQoXG4gICAgICB7XG4gICAgICAgIG5hbWU6ICdvcHRpb25TZWxlY3QnLFxuICAgICAgICBvcHRpb246IHRoaXMuY2FyZGluYWxpdHkgPT09ICdzaW5nbGUnID8gbWNxT3B0aW9uIDogdGhpcy5zZWxlY3RlZE9wdGlvbixcbiAgICAgICAgY2FyZGluYWxpdHk6IHRoaXMuY2FyZGluYWxpdHksXG4gICAgICAgIHNvbHV0aW9uczogdGhpcy5zb2x1dGlvbnNcbiAgICAgIH1cbiAgICApO1xuICB9XG5cbiAgb25JbWFnZU9wdGlvblNlbGVjdGVkKGV2ZW50KSB7XG4gICAgdGhpcy5vbk9wdGlvblNlbGVjdChldmVudCwgZXZlbnQub3B0aW9uKTtcbiAgfVxuXG4gIHNob3dRdW1sUG9wdXAoKSB7XG4gICAgdGhpcy5zaG93UG9wdXAuZW1pdCgpO1xuICB9XG5cbiAgb25FbnRlcihldmVudDogS2V5Ym9hcmRFdmVudCwgbWNxT3B0aW9uKSB7XG4gICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IDEzKSB7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIHRoaXMub25PcHRpb25TZWxlY3QoZXZlbnQsIG1jcU9wdGlvbik7XG4gICAgfVxuICB9XG59XG4iXX0=