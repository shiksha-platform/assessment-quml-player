/**
 * @fileoverview added by tsickle
 * Generated from: lib/mcq-question/mcq-question.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input, Output, EventEmitter } from '@angular/core';
var McqQuestionComponent = /** @class */ (function () {
    function McqQuestionComponent() {
        this.showPopup = new EventEmitter();
    }
    /**
     * @return {?}
     */
    McqQuestionComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
    };
    /**
     * @return {?}
     */
    McqQuestionComponent.prototype.showQumlPopup = /**
     * @return {?}
     */
    function () {
        this.showPopup.emit();
    };
    McqQuestionComponent.decorators = [
        { type: Component, args: [{
                    selector: 'quml-mcq-question',
                    template: "<div [ngClass]=\"mcqQuestion.includes('img') ? 'quml-mcq-image-questions' : 'quml-mcq-questions'\">\n    <!-- <quml-audio></quml-audio> -->\n    <div class=\"quml-question\" #question [innerHTML]=\"mcqQuestion | safeHtml\">\n    </div>\n</div>",
                    styles: [".quml-mcq-questions{display:flex;gap:1rem}.quml-mcq-image-questions{display:flex;justify-content:start;align-items:flex-start}img{width:100%!important}quml-audio{padding:4px 8px;margin-top:19px}.quml-question-icon{display:inline-block;float:left;padding-right:.5rem;content:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMzZweCIgaGVpZ2h0PSIzNnB4IiB2aWV3Qm94PSIwIDAgMzYgMzYiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogc2tldGNodG9vbCA2MiAoMTAxMDEwKSAtIGh0dHBzOi8vc2tldGNoLmNvbSAtLT4KICAgIDx0aXRsZT40NjI5QzQ3QS1BQzY2LTQwRTEtOEM3OS0xNTIwOENFRUEzQTU8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIHNrZXRjaHRvb2wuPC9kZXNjPgogICAgPGRlZnM+CiAgICAgICAgPHJlY3QgaWQ9InBhdGgtMSIgeD0iMCIgeT0iMCIgd2lkdGg9IjMwIiBoZWlnaHQ9IjMwIiByeD0iMTUiPjwvcmVjdD4KICAgICAgICA8ZmlsdGVyIHg9Ii01LjAlIiB5PSItNS4wJSIgd2lkdGg9IjExMC4wJSIgaGVpZ2h0PSIxMTAuMCUiIGZpbHRlclVuaXRzPSJvYmplY3RCb3VuZGluZ0JveCIgaWQ9ImZpbHRlci0yIj4KICAgICAgICAgICAgPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iMSIgaW49IlNvdXJjZUFscGhhIiByZXN1bHQ9InNoYWRvd0JsdXJJbm5lcjEiPjwvZmVHYXVzc2lhbkJsdXI+CiAgICAgICAgICAgIDxmZU9mZnNldCBkeD0iMCIgZHk9Ii0xIiBpbj0ic2hhZG93Qmx1cklubmVyMSIgcmVzdWx0PSJzaGFkb3dPZmZzZXRJbm5lcjEiPjwvZmVPZmZzZXQ+CiAgICAgICAgICAgIDxmZUNvbXBvc2l0ZSBpbj0ic2hhZG93T2Zmc2V0SW5uZXIxIiBpbjI9IlNvdXJjZUFscGhhIiBvcGVyYXRvcj0iYXJpdGhtZXRpYyIgazI9Ii0xIiBrMz0iMSIgcmVzdWx0PSJzaGFkb3dJbm5lcklubmVyMSI+PC9mZUNvbXBvc2l0ZT4KICAgICAgICAgICAgPGZlQ29sb3JNYXRyaXggdmFsdWVzPSIwIDAgMCAwIDAgICAwIDAgMCAwIDAgICAwIDAgMCAwIDAgIDAgMCAwIDAuNSAwIiB0eXBlPSJtYXRyaXgiIGluPSJzaGFkb3dJbm5lcklubmVyMSI+PC9mZUNvbG9yTWF0cml4PgogICAgICAgIDwvZmlsdGVyPgogICAgPC9kZWZzPgogICAgPGcgaWQ9ImRldnMiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJtY3ExIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNTgwLjAwMDAwMCwgLTYwLjAwMDAwMCkiPgogICAgICAgICAgICA8ZyBpZD0iYXVkaW8tcGxheSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNTgwLjAwMDAwMCwgNjAuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8ZyBpZD0iR3JvdXAtOSI+CiAgICAgICAgICAgICAgICAgICAgPGcgaWQ9Ikdyb3VwIj4KICAgICAgICAgICAgICAgICAgICAgICAgPGcgaWQ9Ikdyb3VwLUNvcHkiPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJlY3QgaWQ9IlJlY3RhbmdsZS01LUNvcHkiIGZpbGw9IiMwMDAwMDAiIGZpbGwtcnVsZT0ibm9uemVybyIgb3BhY2l0eT0iMC4yNzc1Mjk3NjIiIHg9IjAiIHk9IjAiIHdpZHRoPSIzNiIgaGVpZ2h0PSIzNiIgcng9IjE4Ij48L3JlY3Q+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZyBpZD0iR3JvdXAtMiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMy4wMDAwMDAsIDMuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGcgaWQ9IlJlY3RhbmdsZS01LUNvcHktMiIgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHVzZSBmaWxsPSIjRkZGRkZGIiB4bGluazpocmVmPSIjcGF0aC0xIj48L3VzZT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHVzZSBmaWxsPSJibGFjayIgZmlsbC1vcGFjaXR5PSIxIiBmaWx0ZXI9InVybCgjZmlsdGVyLTIpIiB4bGluazpocmVmPSIjcGF0aC0xIj48L3VzZT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJlY3Qgc3Ryb2tlLW9wYWNpdHk9IjAuNDg0MTU2NDY5IiBzdHJva2U9IiNDM0M4REIiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVqb2luPSJzcXVhcmUiIHg9IjEiIHk9IjEiIHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCIgcng9IjE0Ij48L3JlY3Q+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xNSw5IEwxNSwxNi4wMzMzMzMzIEMxNC42MDY2NjY3LDE1LjgwNjY2NjcgMTQuMTUzMzMzMywxNS42NjY2NjY3IDEzLjY2NjY2NjcsMTUuNjY2NjY2NyBDMTIuMTkzMzMzMywxNS42NjY2NjY3IDExLDE2Ljg2IDExLDE4LjMzMzMzMzMgQzExLDE5LjgwNjY2NjcgMTIuMTkzMzMzMywyMSAxMy42NjY2NjY3LDIxIEMxNS4xNCwyMSAxNi4zMzMzMzMzLDE5LjgwNjY2NjcgMTYuMzMzMzMzMywxOC4zMzMzMzMzIEwxNi4zMzMzMzMzLDExLjY2NjY2NjcgTDE5LDExLjY2NjY2NjcgTDE5LDkgTDE1LDkgTDE1LDkgWiIgaWQ9IlNoYXBlIiBmaWxsPSIjMDhCQzgyIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgICAgICAgICAgPGcgaWQ9ImljX2NoZXZyb25fbGVmdCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzAuMDAwMDAwLCAxOC4wMDAwMDApIHNjYWxlKC0xLCAxKSB0cmFuc2xhdGUoLTMwLjAwMDAwMCwgLTE4LjAwMDAwMCkgdHJhbnNsYXRlKDI2LjAwMDAwMCwgMTIuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZyBpZD0iSWNvbi0yNHB4Ij48L2c+CiAgICAgICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==)}.quml-question{font-size:.875rem;color:#131415;padding-top:3rem;width:100%}.question-image{position:relative}.icon-zommin{position:absolute;bottom:0;right:0;content:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTlweCIgaGVpZ2h0PSIxOXB4IiB2aWV3Qm94PSIwIDAgMTkgMTkiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDYyICg5MTM5MCkgLSBodHRwczovL3NrZXRjaC5jb20gLS0+CiAgICA8dGl0bGU+em9vbTwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxnIGlkPSJkZXZzIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iem9vbSI+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik05LjUsMCBMMTgsMCBDMTguNTUyMjg0NywtMS4wMTQ1MzA2M2UtMTYgMTksMC40NDc3MTUyNSAxOSwxIEwxOSwxMyBDMTksMTYuMzEzNzA4NSAxNi4zMTM3MDg1LDE5IDEzLDE5IEwxLDE5IEMwLjQ0NzcxNTI1LDE5IDYuNzYzNTM3NTFlLTE3LDE4LjU1MjI4NDcgMCwxOCBMMCw5LjUgQy02LjQyNTM2MDY0ZS0xNiw0LjI1MzI5NDg4IDQuMjUzMjk0ODgsOS42MzgwNDA5NWUtMTYgOS41LDAgWiIgaWQ9IlJlY3RhbmdsZSIgZmlsbC1vcGFjaXR5PSIwLjUiIGZpbGw9IiM0MzQzNDMiIGZpbGwtcnVsZT0ibm9uemVybyI+PC9wYXRoPgogICAgICAgICAgICA8ZyBpZD0iR3JvdXAiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDUuMDAwMDAwLCA0LjAwMDAwMCkiIGZpbGw9IiNGRkZGRkYiPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTQuNTgzMzMzMzMsMC43NSBDNi45NzY2NjY2NywwLjc1IDguOTE2NjY2NjcsMi42OSA4LjkxNjY2NjY3LDUuMDgzMzMzMzMgQzguOTE2NjY2NjcsNi4xNTY2NjY2NyA4LjUyMzMzMzMzLDcuMTQzMzMzMzMgNy44Nyw3LjkwMzMzMzMzIEw3Ljg3LDcuOTAzMzMzMzMgTDguMDU2NjY2NjcsOC4wODMzMzMzMyBMOC41ODMzMzMzMyw4LjA4MzMzMzMzIEwxMS45MSwxMS40MTY2NjY3IEwxMC45MTY2NjY3LDEyLjQxIEw3LjU4MzMzMzMzLDkuMDgzMzMzMzMgTDcuNTgzMzMzMzMsOC41NTY2NjY2NyBMNy40MDMzMzMzMyw4LjM3IEM2LjY0MzMzMzMzLDkuMDIzMzMzMzMgNS42NTY2NjY2Nyw5LjQxNjY2NjY3IDQuNTgzMzMzMzMsOS40MTY2NjY2NyBDMi4xOSw5LjQxNjY2NjY3IDAuMjUsNy40NzY2NjY2NyAwLjI1LDUuMDgzMzMzMzMgQzAuMjUsMi42OSAyLjE5LDAuNzUgNC41ODMzMzMzMywwLjc1IFogTTQuNTgzMzMzMzMsMi4wODMzMzMzMyBDMi45MjMzMzMzMywyLjA4MzMzMzMzIDEuNTgzMzMzMzMsMy40MjMzMzMzMyAxLjU4MzMzMzMzLDUuMDgzMzMzMzMgQzEuNTgzMzMzMzMsNi43NDMzMzMzMyAyLjkyMzMzMzMzLDguMDgzMzMzMzMgNC41ODMzMzMzMyw4LjA4MzMzMzMzIEM2LjI0MzMzMzMzLDguMDgzMzMzMzMgNy41ODMzMzMzMyw2Ljc0MzMzMzMzIDcuNTgzMzMzMzMsNS4wODMzMzMzMyBDNy41ODMzMzMzMywzLjQyMzMzMzMzIDYuMjQzMzMzMzMsMi4wODMzMzMzMyA0LjU4MzMzMzMzLDIuMDgzMzMzMzMgWiBNNC45MTY2NjY2NywzLjQxNjY2NjY3IEw0LjkxNjY2NjY3LDQuNzUgTDYuMjUsNC43NSBMNi4yNSw1LjQxNjY2NjY3IEw0LjkxNjY2NjY3LDUuNDE2NjY2NjcgTDQuOTE2NjY2NjcsNi43NSBMNC4yNSw2Ljc1IEw0LjI1LDUuNDE2NjY2NjcgTDIuOTE2NjY2NjcsNS40MTY2NjY2NyBMMi45MTY2NjY2Nyw0Ljc1IEw0LjI1LDQuNzUgTDQuMjUsMy40MTY2NjY2NyBMNC45MTY2NjY2NywzLjQxNjY2NjY3IFoiIGlkPSJDb21iaW5lZC1TaGFwZSI+PC9wYXRoPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=)}.question-image img{vertical-align:bottom}"]
                }] }
    ];
    /** @nocollapse */
    McqQuestionComponent.ctorParameters = function () { return []; };
    McqQuestionComponent.propDecorators = {
        mcqQuestion: [{ type: Input }],
        showPopup: [{ type: Output }],
        layout: [{ type: Input }]
    };
    return McqQuestionComponent;
}());
export { McqQuestionComponent };
if (false) {
    /** @type {?} */
    McqQuestionComponent.prototype.mcqQuestion;
    /** @type {?} */
    McqQuestionComponent.prototype.showPopup;
    /** @type {?} */
    McqQuestionComponent.prototype.layout;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWNxLXF1ZXN0aW9uLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bwcm9qZWN0LXN1bmJpcmQvc3VuYmlyZC1xdW1sLXBsYXllci12OS8iLCJzb3VyY2VzIjpbImxpYi9tY3EtcXVlc3Rpb24vbWNxLXF1ZXN0aW9uLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQVUsS0FBSyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFL0U7SUFXRTtRQUhVLGNBQVMsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO0lBR3pCLENBQUM7Ozs7SUFFakIsdUNBQVE7OztJQUFSO0lBQ0EsQ0FBQzs7OztJQUVELDRDQUFhOzs7SUFBYjtRQUNFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDeEIsQ0FBQzs7Z0JBbEJGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsbUJBQW1CO29CQUM3QiwrUEFBNEM7O2lCQUU3Qzs7Ozs7OEJBR0UsS0FBSzs0QkFDTCxNQUFNO3lCQUNOLEtBQUs7O0lBV1IsMkJBQUM7Q0FBQSxBQXBCRCxJQW9CQztTQWZZLG9CQUFvQjs7O0lBRS9CLDJDQUEwQjs7SUFDMUIseUNBQXlDOztJQUN6QyxzQ0FBcUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3F1bWwtbWNxLXF1ZXN0aW9uJyxcbiAgdGVtcGxhdGVVcmw6ICcuL21jcS1xdWVzdGlvbi5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL21jcS1xdWVzdGlvbi5jb21wb25lbnQuc2NzcyddXG59KVxuZXhwb3J0IGNsYXNzIE1jcVF1ZXN0aW9uQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcblxuICBASW5wdXQoKSBtY3FRdWVzdGlvbjogYW55O1xuICBAT3V0cHV0KCkgc2hvd1BvcHVwID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBASW5wdXQoKSBsYXlvdXQ6IGFueTtcblxuICBjb25zdHJ1Y3RvcigpIHsgfVxuXG4gIG5nT25Jbml0KCkge1xuICB9XG5cbiAgc2hvd1F1bWxQb3B1cCgpIHtcbiAgICB0aGlzLnNob3dQb3B1cC5lbWl0KCk7XG4gIH1cblxufVxuIl19