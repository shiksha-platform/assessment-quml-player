/**
 * @fileoverview added by tsickle
 * Generated from: lib/util-service.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import * as _ from 'lodash-es';
import * as i0 from "@angular/core";
var UtilService = /** @class */ (function () {
    function UtilService() {
    }
    /**
     * @param {?=} length
     * @return {?}
     */
    UtilService.prototype.uniqueId = /**
     * @param {?=} length
     * @return {?}
     */
    function (length) {
        if (length === void 0) { length = 32; }
        /** @type {?} */
        var result = '';
        /** @type {?} */
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        /** @type {?} */
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    };
    /**
     * @param {?} pdfPlayerStartTime
     * @return {?}
     */
    UtilService.prototype.getTimeSpentText = /**
     * @param {?} pdfPlayerStartTime
     * @return {?}
     */
    function (pdfPlayerStartTime) {
        /** @type {?} */
        var duration = new Date().getTime() - pdfPlayerStartTime;
        /** @type {?} */
        var minutes = Math.floor(duration / 60000);
        /** @type {?} */
        var seconds = Number(((duration % 60000) / 1000).toFixed(0));
        return (minutes + ':' + (seconds < 10 ? '0' : '') + seconds);
    };
    /**
     * @param {?} keys
     * @return {?}
     */
    UtilService.prototype.getKeyValue = /**
     * @param {?} keys
     * @return {?}
     */
    function (keys) {
        /** @type {?} */
        var key = keys.find((/**
         * @param {?} k
         * @return {?}
         */
        function (k) {
            return k.includes('response');
        }));
        return key;
    };
    /**
     * @param {?} options
     * @param {?} responseDeclaration
     * @return {?}
     */
    UtilService.prototype.getMultiselectScore = /**
     * @param {?} options
     * @param {?} responseDeclaration
     * @return {?}
     */
    function (options, responseDeclaration) {
        /** @type {?} */
        var key = this.getKeyValue(Object.keys(responseDeclaration));
        /** @type {?} */
        var selectedOptionValue = options.map((/**
         * @param {?} option
         * @return {?}
         */
        function (option) { return option.value; }));
        /** @type {?} */
        var score = responseDeclaration[key].correctResponse.outcomes.score ? responseDeclaration[key].correctResponse.outcomes.score : responseDeclaration.maxScore;
        /** @type {?} */
        var correctValues = responseDeclaration[key].correctResponse.value;
        /** @type {?} */
        var mapping = responseDeclaration[key]['mapping'];
        if (_.isEqual(correctValues, selectedOptionValue)) {
            return score;
        }
        else if (!_.isEqual(correctValues, selectedOptionValue)) {
            return selectedOptionValue.reduce((/**
             * @param {?} sum
             * @param {?} index
             * @return {?}
             */
            function (sum, index) { sum += (mapping[index] ? mapping[index].outcomes.score : 0); return sum; }), 0);
        }
    };
    /**
     * @param {?} selectedOptions
     * @param {?} option
     * @return {?}
     */
    UtilService.prototype.hasDuplicates = /**
     * @param {?} selectedOptions
     * @param {?} option
     * @return {?}
     */
    function (selectedOptions, option) {
        /** @type {?} */
        var duplicate = selectedOptions.find((/**
         * @param {?} o
         * @return {?}
         */
        function (o) { return o.value === option.value; }));
        return duplicate;
    };
    /**
     * @param {?} questions
     * @param {?} currentIndex
     * @return {?}
     */
    UtilService.prototype.getQuestionType = /**
     * @param {?} questions
     * @param {?} currentIndex
     * @return {?}
     */
    function (questions, currentIndex) {
        /** @type {?} */
        var index = currentIndex - 1 === -1 ? 0 : currentIndex - 1;
        return questions[index]['qType'];
    };
    /**
     * @param {?} progressBarClass
     * @return {?}
     */
    UtilService.prototype.canGo = /**
     * @param {?} progressBarClass
     * @return {?}
     */
    function (progressBarClass) {
        /** @type {?} */
        var attemptedParams = ['correct', 'wrong', 'attempted'];
        return attemptedParams.includes(progressBarClass);
    };
    /**
     * @param {...?} objects
     * @return {?}
     */
    UtilService.prototype.sumObjectsByKey = /**
     * @param {...?} objects
     * @return {?}
     */
    function () {
        var objects = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            objects[_i] = arguments[_i];
        }
        return objects.reduce((/**
         * @param {?} accumulator
         * @param {?} currentValue
         * @return {?}
         */
        function (accumulator, currentValue) {
            for (var key in currentValue) {
                if (currentValue.hasOwnProperty(key)) {
                    accumulator[key] = (accumulator[key] || 0) + currentValue[key];
                }
            }
            return accumulator;
        }), {});
    };
    UtilService.decorators = [
        { type: Injectable, args: [{
                    providedIn: 'root'
                },] }
    ];
    /** @nocollapse */
    UtilService.ctorParameters = function () { return []; };
    /** @nocollapse */ UtilService.ɵprov = i0.ɵɵdefineInjectable({ factory: function UtilService_Factory() { return new UtilService(); }, token: UtilService, providedIn: "root" });
    return UtilService;
}());
export { UtilService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC1zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHByb2plY3Qtc3VuYmlyZC9zdW5iaXJkLXF1bWwtcGxheWVyLXY5LyIsInNvdXJjZXMiOlsibGliL3V0aWwtc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxLQUFLLENBQUMsTUFBTSxXQUFXLENBQUM7O0FBRy9CO0lBS0k7SUFBZ0IsQ0FBQzs7Ozs7SUFFViw4QkFBUTs7OztJQUFmLFVBQWdCLE1BQVc7UUFBWCx1QkFBQSxFQUFBLFdBQVc7O1lBQ25CLE1BQU0sR0FBRyxFQUFFOztZQUNULFVBQVUsR0FBRyxnRUFBZ0U7O1lBQzdFLGdCQUFnQixHQUFHLFVBQVUsQ0FBQyxNQUFNO1FBQzFDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDN0IsTUFBTSxJQUFJLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO1NBQzdFO1FBQ0QsT0FBTyxNQUFNLENBQUM7SUFDbEIsQ0FBQzs7Ozs7SUFFTSxzQ0FBZ0I7Ozs7SUFBdkIsVUFBd0Isa0JBQWtCOztZQUNoQyxRQUFRLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsR0FBRyxrQkFBa0I7O1lBQ3BELE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7O1lBQ3RDLE9BQU8sR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUQsT0FBTyxDQUFDLE9BQU8sR0FBRyxHQUFHLEdBQUcsQ0FB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QUMsTUFBTTs7Ozs7UUFBQyxVQUFDLFdBQVcsRUFBRSxZQUFZO1lBQzVDLEtBQUssSUFBTSxHQUFHLElBQUksWUFBWSxFQUFFO2dCQUM1QixJQUFJLFlBQVksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLEVBQUU7b0JBQ2xDLFdBQVcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7aUJBQ2xFO2FBQ0o7WUFDRCxPQUFPLFdBQVcsQ0FBQztRQUN2QixDQUFDLEdBQUUsRUFBRSxDQUFDLENBQUM7SUFDWCxDQUFDOztnQkFyRUosVUFBVSxTQUFDO29CQUNSLFVBQVUsRUFBRSxNQUFNO2lCQUNyQjs7Ozs7c0JBTkQ7Q0EwRUMsQUF0RUQsSUFzRUM7U0FuRVksV0FBVyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoLWVzJztcblxuXG5ASW5qZWN0YWJsZSh7XG4gICAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIFV0aWxTZXJ2aWNlIHtcblxuICAgIGNvbnN0cnVjdG9yKCkgeyB9XG5cbiAgICBwdWJsaWMgdW5pcXVlSWQobGVuZ3RoID0gMzIpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9ICcnO1xuICAgICAgICBjb25zdCBjaGFyYWN0ZXJzID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5JztcbiAgICAgICAgY29uc3QgY2hhcmFjdGVyc0xlbmd0aCA9IGNoYXJhY3RlcnMubGVuZ3RoO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICByZXN1bHQgKz0gY2hhcmFjdGVycy5jaGFyQXQoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY2hhcmFjdGVyc0xlbmd0aCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgcHVibGljIGdldFRpbWVTcGVudFRleHQocGRmUGxheWVyU3RhcnRUaW1lKSB7XG4gICAgICAgIGNvbnN0IGR1cmF0aW9uID0gbmV3IERhdGUoKS5nZXRUaW1lKCkgLSBwZGZQbGF5ZXJTdGFydFRpbWU7XG4gICAgICAgIGNvbnN0IG1pbnV0ZXMgPSBNYXRoLmZsb29yKGR1cmF0aW9uIC8gNjAwMDApO1xuICAgICAgICBjb25zdCBzZWNvbmRzID0gTnVtYmVyKCgoZHVyYXRpb24gJSA2MDAwMCkgLyAxMDAwKS50b0ZpeGVkKDApKTtcbiAgICAgICAgcmV0dXJuIChtaW51dGVzICsgJzonICsgKHNlY29uZHMgPCAxMCA/ICcwJyA6ICcnKSArIHNlY29uZHMpO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRLZXlWYWx1ZShrZXlzKSB7XG4gICAgICAgIGxldCBrZXkgPSBrZXlzLmZpbmQoKGspID0+IHtcbiAgICAgICAgICAgIHJldHVybiBrLmluY2x1ZGVzKCdyZXNwb25zZScpO1xuICAgICAgICB9KVxuICAgICAgICByZXR1cm4ga2V5O1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRNdWx0aXNlbGVjdFNjb3JlKG9wdGlvbnMsIHJlc3BvbnNlRGVjbGFyYXRpb24pIHtcbiAgICAgICAgbGV0IGtleTogYW55ID0gdGhpcy5nZXRLZXlWYWx1ZShPYmplY3Qua2V5cyhyZXNwb25zZURlY2xhcmF0aW9uKSk7XG4gICAgICAgIGNvbnN0IHNlbGVjdGVkT3B0aW9uVmFsdWUgPSBvcHRpb25zLm1hcChvcHRpb24gPT4gb3B0aW9uLnZhbHVlKTtcbiAgICAgICAgbGV0IHNjb3JlID0gcmVzcG9uc2VEZWNsYXJhdGlvbltrZXldLmNvcnJlY3RSZXNwb25zZS5vdXRjb21lcy5zY29yZSA/IHJlc3BvbnNlRGVjbGFyYXRpb25ba2V5XS5jb3JyZWN0UmVzcG9uc2Uub3V0Y29tZXMuc2NvcmUgOiByZXNwb25zZURlY2xhcmF0aW9uLm1heFNjb3JlO1xuICAgICAgICBsZXQgY29ycmVjdFZhbHVlcyA9IHJlc3BvbnNlRGVjbGFyYXRpb25ba2V5XS5jb3JyZWN0UmVzcG9uc2UudmFsdWU7XG4gICAgICAgIGxldCBtYXBwaW5nID0gcmVzcG9uc2VEZWNsYXJhdGlvbltrZXldWydtYXBwaW5nJ107XG4gICAgICAgIGlmIChfLmlzRXF1YWwoY29ycmVjdFZhbHVlcywgc2VsZWN0ZWRPcHRpb25WYWx1ZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBzY29yZTtcbiAgICAgICAgfSBlbHNlIGlmICghXy5pc0VxdWFsKGNvcnJlY3RWYWx1ZXMsIHNlbGVjdGVkT3B0aW9uVmFsdWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZWN0ZWRPcHRpb25WYWx1ZS5yZWR1Y2UoKHN1bSwgaW5kZXgpID0+IHsgc3VtICs9IChtYXBwaW5nW2luZGV4XSA/IG1hcHBpbmdbaW5kZXhdLm91dGNvbWVzLnNjb3JlIDogMCk7IHJldHVybiBzdW07IH0sIDApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaGFzRHVwbGljYXRlcyhzZWxlY3RlZE9wdGlvbnMsIG9wdGlvbikge1xuICAgICAgICBsZXQgZHVwbGljYXRlID0gc2VsZWN0ZWRPcHRpb25zLmZpbmQoKG8pID0+IHsgcmV0dXJuIG8udmFsdWUgPT09IG9wdGlvbi52YWx1ZSB9KTtcbiAgICAgICAgcmV0dXJuIGR1cGxpY2F0ZTtcbiAgICB9XG5cbiAgICBnZXRRdWVzdGlvblR5cGUocXVlc3Rpb25zLCBjdXJyZW50SW5kZXgpIHtcbiAgICAgICAgICAgIGxldCBpbmRleCA9IGN1cnJlbnRJbmRleCAtIDEgPT09IC0xID8gMCA6IGN1cnJlbnRJbmRleC0xO1xuICAgICAgICAgICAgcmV0dXJuIHF1ZXN0aW9uc1tpbmRleF1bJ3FUeXBlJ107XG4gICAgICAgIFxuICAgIH1cblxuICAgIGNhbkdvKHByb2dyZXNzQmFyQ2xhc3Mpe1xuICAgIGxldCBhdHRlbXB0ZWRQYXJhbXMgPSBbJ2NvcnJlY3QnLCAnd3JvbmcnLCAnYXR0ZW1wdGVkJ107XG4gICAgIHJldHVybiBhdHRlbXB0ZWRQYXJhbXMuaW5jbHVkZXMocHJvZ3Jlc3NCYXJDbGFzcyk7XG4gICAgfVxuXG4gICAgc3VtT2JqZWN0c0J5S2V5KC4uLm9iamVjdHMpIHtcbiAgICAgICAgcmV0dXJuIG9iamVjdHMucmVkdWNlKChhY2N1bXVsYXRvciwgY3VycmVudFZhbHVlKSA9PiB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBjdXJyZW50VmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudFZhbHVlLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgYWNjdW11bGF0b3Jba2V5XSA9IChhY2N1bXVsYXRvcltrZXldIHx8IDApICsgY3VycmVudFZhbHVlW2tleV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGFjY3VtdWxhdG9yO1xuICAgICAgICB9LCB7fSk7XG4gICAgfVxufVxuIl19