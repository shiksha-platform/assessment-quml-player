/**
 * @fileoverview added by tsickle
 * Generated from: lib/util-service.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import * as _ from 'lodash-es';
import * as i0 from "@angular/core";
export class UtilService {
    constructor() {
    }
    /**
     * @param {?=} length
     * @return {?}
     */
    uniqueId(length = 32) {
        /** @type {?} */
        let result = '';
        /** @type {?} */
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        /** @type {?} */
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    /**
     * @param {?} pdfPlayerStartTime
     * @return {?}
     */
    getTimeSpentText(pdfPlayerStartTime) {
        /** @type {?} */
        const duration = new Date().getTime() - pdfPlayerStartTime;
        /** @type {?} */
        const minutes = Math.floor(duration / 60000);
        /** @type {?} */
        const seconds = Number(((duration % 60000) / 1000).toFixed(0));
        return (minutes + ':' + (seconds < 10 ? '0' : '') + seconds);
    }
    /**
     * @param {?} keys
     * @return {?}
     */
    getKeyValue(keys) {
        /** @type {?} */
        let key = keys.find((/**
         * @param {?} k
         * @return {?}
         */
        (k) => {
            return k.includes('response');
        }));
        return key;
    }
    /**
     * @param {?} options
     * @param {?} responseDeclaration
     * @return {?}
     */
    getMultiselectScore(options, responseDeclaration) {
        /** @type {?} */
        let key = this.getKeyValue(Object.keys(responseDeclaration));
        /** @type {?} */
        const selectedOptionValue = options.map((/**
         * @param {?} option
         * @return {?}
         */
        option => option.value));
        /** @type {?} */
        let score = responseDeclaration[key].correctResponse.outcomes.score ? responseDeclaration[key].correctResponse.outcomes.score : responseDeclaration.maxScore;
        /** @type {?} */
        let correctValues = responseDeclaration[key].correctResponse.value;
        /** @type {?} */
        let mapping = responseDeclaration[key]['mapping'];
        if (_.isEqual(correctValues, selectedOptionValue)) {
            return score;
        }
        else if (!_.isEqual(correctValues, selectedOptionValue)) {
            return selectedOptionValue.reduce((/**
             * @param {?} sum
             * @param {?} index
             * @return {?}
             */
            (sum, index) => { sum += (mapping[index] ? mapping[index].outcomes.score : 0); return sum; }), 0);
        }
    }
    /**
     * @param {?} selectedOptions
     * @param {?} option
     * @return {?}
     */
    hasDuplicates(selectedOptions, option) {
        /** @type {?} */
        let duplicate = selectedOptions.find((/**
         * @param {?} o
         * @return {?}
         */
        (o) => { return o.value === option.value; }));
        return duplicate;
    }
    /**
     * @param {?} questions
     * @param {?} currentIndex
     * @return {?}
     */
    getQuestionType(questions, currentIndex) {
        /** @type {?} */
        let index = currentIndex - 1 === -1 ? 0 : currentIndex - 1;
        return questions[index]['qType'];
    }
    /**
     * @param {?} progressBarClass
     * @return {?}
     */
    canGo(progressBarClass) {
        /** @type {?} */
        let attemptedParams = ['correct', 'wrong', 'attempted'];
        return attemptedParams.includes(progressBarClass);
    }
    /**
     * @param {...?} objects
     * @return {?}
     */
    sumObjectsByKey(...objects) {
        return objects.reduce((/**
         * @param {?} accumulator
         * @param {?} currentValue
         * @return {?}
         */
        (accumulator, currentValue) => {
            for (const key in currentValue) {
                if (currentValue.hasOwnProperty(key)) {
                    accumulator[key] = (accumulator[key] || 0) + currentValue[key];
                }
            }
            return accumulator;
        }), {});
    }
}
UtilService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
/** @nocollapse */
UtilService.ctorParameters = () => [];
/** @nocollapse */ UtilService.ɵprov = i0.ɵɵdefineInjectable({ factory: function UtilService_Factory() { return new UtilService(); }, token: UtilService, providedIn: "root" });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC1zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHByb2plY3Qtc3VuYmlyZC9zdW5iaXJkLXF1bWwtcGxheWVyLXY5LyIsInNvdXJjZXMiOlsibGliL3V0aWwtc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxLQUFLLENBQUMsTUFBTSxXQUFXLENBQUM7O0FBTS9CLE1BQU0sT0FBTyxXQUFXO0lBRXBCO0lBQWdCLENBQUM7Ozs7O0lBRVYsUUFBUSxDQUFDLE1BQU0sR0FBRyxFQUFFOztZQUNuQixNQUFNLEdBQUcsRUFBRTs7Y0FDVCxVQUFVLEdBQUcsZ0VBQWdFOztjQUM3RSxnQkFBZ0IsR0FBRyxVQUFVLENBQUMsTUFBTTtRQUMxQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzdCLE1BQU0sSUFBSSxVQUFVLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLGdCQUFnQixDQUFDLENBQUMsQ0FBQztTQUM3RTtRQUNELE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7Ozs7O0lBRU0sZ0JBQWdCLENBQUMsa0JBQWtCOztjQUNoQyxRQUFRLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsR0FBRyxrQkFBa0I7O2NBQ3BELE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7O2NBQ3RDLE9BQU8sR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUQsT0FBTyxDQUFDLE9BQU8sR0FBRyxHQUFHLEdBQUcsQ0FBQyxPQUFPLEdBQUcsRUFB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QUFZLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxFQUFFO29CQUNsQyxXQUFXLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2lCQUNsRTthQUNKO1lBQ0QsT0FBTyxXQUFXLENBQUM7UUFDdkIsQ0FBQyxHQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ1gsQ0FBQzs7O1lBckVKLFVBQVUsU0FBQztnQkFDUixVQUFVLEVBQUUsTUFBTTthQUNyQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoLWVzJztcblxuXG5ASW5qZWN0YWJsZSh7XG4gICAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIFV0aWxTZXJ2aWNlIHtcblxuICAgIGNvbnN0cnVjdG9yKCkgeyB9XG5cbiAgICBwdWJsaWMgdW5pcXVlSWQobGVuZ3RoID0gMzIpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9ICcnO1xuICAgICAgICBjb25zdCBjaGFyYWN0ZXJzID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5JztcbiAgICAgICAgY29uc3QgY2hhcmFjdGVyc0xlbmd0aCA9IGNoYXJhY3RlcnMubGVuZ3RoO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICByZXN1bHQgKz0gY2hhcmFjdGVycy5jaGFyQXQoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY2hhcmFjdGVyc0xlbmd0aCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgcHVibGljIGdldFRpbWVTcGVudFRleHQocGRmUGxheWVyU3RhcnRUaW1lKSB7XG4gICAgICAgIGNvbnN0IGR1cmF0aW9uID0gbmV3IERhdGUoKS5nZXRUaW1lKCkgLSBwZGZQbGF5ZXJTdGFydFRpbWU7XG4gICAgICAgIGNvbnN0IG1pbnV0ZXMgPSBNYXRoLmZsb29yKGR1cmF0aW9uIC8gNjAwMDApO1xuICAgICAgICBjb25zdCBzZWNvbmRzID0gTnVtYmVyKCgoZHVyYXRpb24gJSA2MDAwMCkgLyAxMDAwKS50b0ZpeGVkKDApKTtcbiAgICAgICAgcmV0dXJuIChtaW51dGVzICsgJzonICsgKHNlY29uZHMgPCAxMCA/ICcwJyA6ICcnKSArIHNlY29uZHMpO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRLZXlWYWx1ZShrZXlzKSB7XG4gICAgICAgIGxldCBrZXkgPSBrZXlzLmZpbmQoKGspID0+IHtcbiAgICAgICAgICAgIHJldHVybiBrLmluY2x1ZGVzKCdyZXNwb25zZScpO1xuICAgICAgICB9KVxuICAgICAgICByZXR1cm4ga2V5O1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRNdWx0aXNlbGVjdFNjb3JlKG9wdGlvbnMsIHJlc3BvbnNlRGVjbGFyYXRpb24pIHtcbiAgICAgICAgbGV0IGtleTogYW55ID0gdGhpcy5nZXRLZXlWYWx1ZShPYmplY3Qua2V5cyhyZXNwb25zZURlY2xhcmF0aW9uKSk7XG4gICAgICAgIGNvbnN0IHNlbGVjdGVkT3B0aW9uVmFsdWUgPSBvcHRpb25zLm1hcChvcHRpb24gPT4gb3B0aW9uLnZhbHVlKTtcbiAgICAgICAgbGV0IHNjb3JlID0gcmVzcG9uc2VEZWNsYXJhdGlvbltrZXldLmNvcnJlY3RSZXNwb25zZS5vdXRjb21lcy5zY29yZSA/IHJlc3BvbnNlRGVjbGFyYXRpb25ba2V5XS5jb3JyZWN0UmVzcG9uc2Uub3V0Y29tZXMuc2NvcmUgOiByZXNwb25zZURlY2xhcmF0aW9uLm1heFNjb3JlO1xuICAgICAgICBsZXQgY29ycmVjdFZhbHVlcyA9IHJlc3BvbnNlRGVjbGFyYXRpb25ba2V5XS5jb3JyZWN0UmVzcG9uc2UudmFsdWU7XG4gICAgICAgIGxldCBtYXBwaW5nID0gcmVzcG9uc2VEZWNsYXJhdGlvbltrZXldWydtYXBwaW5nJ107XG4gICAgICAgIGlmIChfLmlzRXF1YWwoY29ycmVjdFZhbHVlcywgc2VsZWN0ZWRPcHRpb25WYWx1ZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBzY29yZTtcbiAgICAgICAgfSBlbHNlIGlmICghXy5pc0VxdWFsKGNvcnJlY3RWYWx1ZXMsIHNlbGVjdGVkT3B0aW9uVmFsdWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZWN0ZWRPcHRpb25WYWx1ZS5yZWR1Y2UoKHN1bSwgaW5kZXgpID0+IHsgc3VtICs9IChtYXBwaW5nW2luZGV4XSA/IG1hcHBpbmdbaW5kZXhdLm91dGNvbWVzLnNjb3JlIDogMCk7IHJldHVybiBzdW07IH0sIDApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaGFzRHVwbGljYXRlcyhzZWxlY3RlZE9wdGlvbnMsIG9wdGlvbikge1xuICAgICAgICBsZXQgZHVwbGljYXRlID0gc2VsZWN0ZWRPcHRpb25zLmZpbmQoKG8pID0+IHsgcmV0dXJuIG8udmFsdWUgPT09IG9wdGlvbi52YWx1ZSB9KTtcbiAgICAgICAgcmV0dXJuIGR1cGxpY2F0ZTtcbiAgICB9XG5cbiAgICBnZXRRdWVzdGlvblR5cGUocXVlc3Rpb25zLCBjdXJyZW50SW5kZXgpIHtcbiAgICAgICAgICAgIGxldCBpbmRleCA9IGN1cnJlbnRJbmRleCAtIDEgPT09IC0xID8gMCA6IGN1cnJlbnRJbmRleC0xO1xuICAgICAgICAgICAgcmV0dXJuIHF1ZXN0aW9uc1tpbmRleF1bJ3FUeXBlJ107XG4gICAgICAgIFxuICAgIH1cblxuICAgIGNhbkdvKHByb2dyZXNzQmFyQ2xhc3Mpe1xuICAgIGxldCBhdHRlbXB0ZWRQYXJhbXMgPSBbJ2NvcnJlY3QnLCAnd3JvbmcnLCAnYXR0ZW1wdGVkJ107XG4gICAgIHJldHVybiBhdHRlbXB0ZWRQYXJhbXMuaW5jbHVkZXMocHJvZ3Jlc3NCYXJDbGFzcyk7XG4gICAgfVxuXG4gICAgc3VtT2JqZWN0c0J5S2V5KC4uLm9iamVjdHMpIHtcbiAgICAgICAgcmV0dXJuIG9iamVjdHMucmVkdWNlKChhY2N1bXVsYXRvciwgY3VycmVudFZhbHVlKSA9PiB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBjdXJyZW50VmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudFZhbHVlLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgYWNjdW11bGF0b3Jba2V5XSA9IChhY2N1bXVsYXRvcltrZXldIHx8IDApICsgY3VycmVudFZhbHVlW2tleV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGFjY3VtdWxhdG9yO1xuICAgICAgICB9LCB7fSk7XG4gICAgfVxufVxuIl19