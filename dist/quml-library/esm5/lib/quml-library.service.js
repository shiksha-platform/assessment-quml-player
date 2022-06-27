/**
 * @fileoverview added by tsickle
 * Generated from: lib/quml-library.service.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { EventEmitter, Injectable } from '@angular/core';
import { CsTelemetryModule } from '@project-sunbird/client-services/telemetry';
import { UtilService } from './util-service';
import * as i0 from "@angular/core";
import * as i1 from "./util-service";
var QumlLibraryService = /** @class */ (function () {
    function QumlLibraryService(utilService) {
        this.utilService = utilService;
        this.isSectionsAvailable = false;
        this.telemetryEvent = new EventEmitter();
    }
    /**
     * @param {?} config
     * @param {?} parentConfig
     * @return {?}
     */
    QumlLibraryService.prototype.initializeTelemetry = /**
     * @param {?} config
     * @param {?} parentConfig
     * @return {?}
     */
    function (config, parentConfig) {
        var _a;
        this.duration = new Date().getTime();
        this.context = config.context;
        this.contentSessionId = this.utilService.uniqueId();
        this.playSessionId = this.utilService.uniqueId();
        this.channel = this.context.channel || '';
        this.pdata = this.context.pdata;
        this.sid = this.context.sid;
        this.uid = this.context.uid;
        this.rollup = this.context.contextRollup;
        this.config = config;
        this.isSectionsAvailable = (_a = parentConfig) === null || _a === void 0 ? void 0 : _a.isSectionsAvailable;
        if (!CsTelemetryModule.instance.isInitialised) {
            /** @type {?} */
            var telemetryConfig = {
                pdata: this.context.pdata,
                env: 'contentplayer',
                channel: this.context.channel,
                did: this.context.did,
                authtoken: this.context.authToken || '',
                uid: this.context.uid || '',
                sid: this.context.sid,
                batchsize: 20,
                mode: this.context.mode,
                host: this.context.host || '',
                endpoint: this.context.endpoint || '/data/v3/telemetry',
                tags: this.context.tags,
                cdata: (this.context.cdata || []).concat([
                    { id: this.contentSessionId, type: 'ContentSession' },
                    { id: this.playSessionId, type: 'PlaySession' },
                    { id: '2.0', type: 'PlayerVersion' }
                ])
            };
            CsTelemetryModule.instance.init({});
            CsTelemetryModule.instance.telemetryService.initTelemetry({
                config: telemetryConfig,
                userOrgDetails: {}
            });
        }
        this.telemetryObject = {
            id: parentConfig.identifier,
            type: 'Content',
            ver: config.metadata.pkgVersion ? config.metadata.pkgVersion.toString() : '',
            rollup: this.context.objectRollup || {}
        };
    };
    /**
     * @param {?} assesEvent
     * @return {?}
     */
    QumlLibraryService.prototype.startAssesEvent = /**
     * @param {?} assesEvent
     * @return {?}
     */
    function (assesEvent) {
        CsTelemetryModule.instance.telemetryService.raiseAssesTelemetry(assesEvent, this.getEventOptions());
    };
    /**
     * @param {?} duration
     * @return {?}
     */
    QumlLibraryService.prototype.start = /**
     * @param {?} duration
     * @return {?}
     */
    function (duration) {
        CsTelemetryModule.instance.telemetryService.raiseStartTelemetry({
            options: this.getEventOptions(),
            edata: { type: 'content', mode: 'play', pageid: '', duration: Number((duration / 1e3).toFixed(2)) }
        });
    };
    /**
     * @param {?} identifier
     * @param {?} version
     * @param {?} type
     * @param {?} option
     * @return {?}
     */
    QumlLibraryService.prototype.response = /**
     * @param {?} identifier
     * @param {?} version
     * @param {?} type
     * @param {?} option
     * @return {?}
     */
    function (identifier, version, type, option) {
        /** @type {?} */
        var responseEvent = {
            target: {
                id: identifier,
                ver: version,
                type: type
            },
            type: 'CHOOSE',
            values: [{
                    option: option
                }]
        };
        CsTelemetryModule.instance.telemetryService.raiseResponseTelemetry(responseEvent, this.getEventOptions());
    };
    /**
     * @param {?} eData
     * @return {?}
     */
    QumlLibraryService.prototype.summary = /**
     * @param {?} eData
     * @return {?}
     */
    function (eData) {
        CsTelemetryModule.instance.telemetryService.raiseSummaryTelemetry(eData, this.getEventOptions());
    };
    /**
     * @param {?} duration
     * @param {?} currentQuestionIndex
     * @param {?} totalNoofQuestions
     * @param {?} visitedQuestions
     * @param {?} endpageseen
     * @param {?} score
     * @return {?}
     */
    QumlLibraryService.prototype.end = /**
     * @param {?} duration
     * @param {?} currentQuestionIndex
     * @param {?} totalNoofQuestions
     * @param {?} visitedQuestions
     * @param {?} endpageseen
     * @param {?} score
     * @return {?}
     */
    function (duration, currentQuestionIndex, totalNoofQuestions, visitedQuestions, endpageseen, score) {
        /** @type {?} */
        var durationSec = Number((duration / 1e3).toFixed(2));
        CsTelemetryModule.instance.telemetryService.raiseEndTelemetry({
            edata: {
                type: 'content',
                mode: 'play',
                pageid: 'sunbird-player-Endpage',
                summary: [
                    {
                        progress: Number(((currentQuestionIndex / totalNoofQuestions) * 100).toFixed(0))
                    },
                    {
                        totalNoofQuestions: totalNoofQuestions
                    },
                    {
                        visitedQuestions: visitedQuestions,
                    },
                    {
                        endpageseen: endpageseen
                    },
                    {
                        score: score
                    },
                ],
                duration: durationSec
            },
            options: this.getEventOptions()
        });
    };
    /**
     * @param {?} id
     * @param {?} currentPage
     * @param {?=} currentQuestionDetails
     * @return {?}
     */
    QumlLibraryService.prototype.interact = /**
     * @param {?} id
     * @param {?} currentPage
     * @param {?=} currentQuestionDetails
     * @return {?}
     */
    function (id, currentPage, currentQuestionDetails) {
        CsTelemetryModule.instance.telemetryService.raiseInteractTelemetry({
            options: this.getEventOptions(),
            edata: { type: 'TOUCH', subtype: '', id: id, pageid: currentPage + '' }
        });
    };
    /**
     * @param {?} data
     * @return {?}
     */
    QumlLibraryService.prototype.heartBeat = /**
     * @param {?} data
     * @return {?}
     */
    function (data) {
        CsTelemetryModule.instance.playerTelemetryService.onHeartBeatEvent(data, {});
    };
    /**
     * @param {?} currentPage
     * @return {?}
     */
    QumlLibraryService.prototype.impression = /**
     * @param {?} currentPage
     * @return {?}
     */
    function (currentPage) {
        CsTelemetryModule.instance.telemetryService.raiseImpressionTelemetry({
            options: this.getEventOptions(),
            edata: { type: 'workflow', subtype: '', pageid: currentPage + '', uri: '' }
        });
    };
    /**
     * @param {?} error
     * @param {?=} edata
     * @return {?}
     */
    QumlLibraryService.prototype.error = /**
     * @param {?} error
     * @param {?=} edata
     * @return {?}
     */
    function (error, edata) {
        CsTelemetryModule.instance.telemetryService.raiseErrorTelemetry({
            options: this.getEventOptions(),
            edata: {
                err: 'LOAD',
                errtype: 'content',
                stacktrace: (error && error.toString()) || ''
            }
        });
    };
    /**
     * @return {?}
     */
    QumlLibraryService.prototype.getEventOptions = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var options = {
            object: this.telemetryObject,
            context: {
                channel: this.channel || '',
                pdata: this.pdata,
                env: 'contentplayer',
                sid: this.sid,
                uid: this.uid,
                cdata: (this.context.cdata || []).concat([{ id: this.contentSessionId, type: 'ContentSession' },
                    { id: this.playSessionId, type: 'PlaySession' },
                    { id: '2.0', type: 'PlayerVersion' }]),
                rollup: this.rollup || {}
            }
        };
        if (this.isSectionsAvailable) {
            options.context.cdata.push({ id: this.config.metadata.identifier, type: 'SectionId' });
        }
        return options;
    };
    QumlLibraryService.decorators = [
        { type: Injectable, args: [{
                    providedIn: 'root'
                },] }
    ];
    /** @nocollapse */
    QumlLibraryService.ctorParameters = function () { return [
        { type: UtilService }
    ]; };
    /** @nocollapse */ QumlLibraryService.ɵprov = i0.ɵɵdefineInjectable({ factory: function QumlLibraryService_Factory() { return new QumlLibraryService(i0.ɵɵinject(i1.UtilService)); }, token: QumlLibraryService, providedIn: "root" });
    return QumlLibraryService;
}());
export { QumlLibraryService };
if (false) {
    /** @type {?} */
    QumlLibraryService.prototype.duration;
    /** @type {?} */
    QumlLibraryService.prototype.channel;
    /** @type {?} */
    QumlLibraryService.prototype.config;
    /** @type {?} */
    QumlLibraryService.prototype.isSectionsAvailable;
    /** @type {?} */
    QumlLibraryService.prototype.telemetryEvent;
    /**
     * @type {?}
     * @private
     */
    QumlLibraryService.prototype.context;
    /**
     * @type {?}
     * @private
     */
    QumlLibraryService.prototype.telemetryObject;
    /**
     * @type {?}
     * @private
     */
    QumlLibraryService.prototype.contentSessionId;
    /**
     * @type {?}
     * @private
     */
    QumlLibraryService.prototype.playSessionId;
    /**
     * @type {?}
     * @private
     */
    QumlLibraryService.prototype.pdata;
    /**
     * @type {?}
     * @private
     */
    QumlLibraryService.prototype.sid;
    /**
     * @type {?}
     * @private
     */
    QumlLibraryService.prototype.uid;
    /**
     * @type {?}
     * @private
     */
    QumlLibraryService.prototype.rollup;
    /** @type {?} */
    QumlLibraryService.prototype.utilService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVtbC1saWJyYXJ5LnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AcHJvamVjdC1zdW5iaXJkL3N1bmJpcmQtcXVtbC1wbGF5ZXItdjkvIiwic291cmNlcyI6WyJsaWIvcXVtbC1saWJyYXJ5LnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6RCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSw0Q0FBNEMsQ0FBQztBQUUvRSxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7OztBQUU3QztJQWtCRSw0QkFBbUIsV0FBd0I7UUFBeEIsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFYM0Msd0JBQW1CLEdBQUcsS0FBSyxDQUFDO1FBQzVCLG1CQUFjLEdBQUcsSUFBSSxZQUFZLEVBQU8sQ0FBQztJQVVNLENBQUM7Ozs7OztJQUVoRCxnREFBbUI7Ozs7O0lBQW5CLFVBQW9CLE1BQXdCLEVBQUUsWUFBMkI7O1FBQ3ZFLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNyQyxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUM7UUFDOUIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDcEQsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ2pELElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDO1FBQzFDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7UUFDaEMsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcs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QUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsZUFBZSxFQUFFLENBQUMsQ0FBQztnQkFDdEMsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLElBQUksRUFBRTthQUMxQjtTQUNGO1FBQ0QsSUFBSSxJQUFJLENBQUMsbUJBQW1CLEVBQUU7WUFDNUIsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLENBQUMsQ0FBQztTQUN4RjtRQUVELE9BQU8sT0FBTyxDQUFDO0lBQ2pCLENBQUM7O2dCQWhNRixVQUFVLFNBQUM7b0JBQ1YsVUFBVSxFQUFFLE1BQU07aUJBQ25COzs7O2dCQUpRLFdBQVc7Ozs2QkFIcEI7Q0FzTUMsQUFqTUQsSUFpTUM7U0E5TFksa0JBQWtCOzs7SUFDN0Isc0NBQWlCOztJQUNqQixxQ0FBZ0I7O0lBQ2hCLG9DQUF5Qjs7SUFDekIsaURBQTRCOztJQUM1Qiw0Q0FBeUM7Ozs7O0lBQ3pDLHFDQUF5Qjs7Ozs7SUFDekIsNkNBQTZCOzs7OztJQUM3Qiw4Q0FBaUM7Ozs7O0lBQ2pDLDJDQUE4Qjs7Ozs7SUFDOUIsbUNBQW1COzs7OztJQUNuQixpQ0FBb0I7Ozs7O0lBQ3BCLGlDQUFvQjs7Ozs7SUFDcEIsb0NBQW9COztJQUVSLHlDQUErQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEV2ZW50RW1pdHRlciwgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ3NUZWxlbWV0cnlNb2R1bGUgfSBmcm9tICdAcHJvamVjdC1zdW5iaXJkL2NsaWVudC1zZXJ2aWNlcy90ZWxlbWV0cnknO1xuaW1wb3J0IHsgQ29udGV4dCwgSVBhcmVudENvbmZpZywgUXVtbFBsYXllckNvbmZpZyB9IGZyb20gJy4vcXVtbC1saWJyYXJ5LWludGVyZmFjZSc7XG5pbXBvcnQgeyBVdGlsU2VydmljZSB9IGZyb20gJy4vdXRpbC1zZXJ2aWNlJztcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgUXVtbExpYnJhcnlTZXJ2aWNlIHtcbiAgZHVyYXRpb246IG51bWJlcjtcbiAgY2hhbm5lbDogc3RyaW5nO1xuICBjb25maWc6IFF1bWxQbGF5ZXJDb25maWc7XG4gIGlzU2VjdGlvbnNBdmFpbGFibGUgPSBmYWxzZTtcbiAgdGVsZW1ldHJ5RXZlbnQgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgcHJpdmF0ZSBjb250ZXh0OiBDb250ZXh0O1xuICBwcml2YXRlIHRlbGVtZXRyeU9iamVjdDogYW55O1xuICBwcml2YXRlIGNvbnRlbnRTZXNzaW9uSWQ6IHN0cmluZztcbiAgcHJpdmF0ZSBwbGF5U2Vzc2lvbklkOiBzdHJpbmc7XG4gIHByaXZhdGUgcGRhdGE6IGFueTtcbiAgcHJpdmF0ZSBzaWQ6IHN0cmluZztcbiAgcHJpdmF0ZSB1aWQ6IHN0cmluZztcbiAgcHJpdmF0ZSByb2xsdXA6IGFueTtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgdXRpbFNlcnZpY2U6IFV0aWxTZXJ2aWNlKSB7IH1cblxuICBpbml0aWFsaXplVGVsZW1ldHJ5KGNvbmZpZzogUXVtbFBsYXllckNvbmZpZywgcGFyZW50Q29uZmlnOiBJUGFyZW50Q29uZmlnKSB7XG4gICAgdGhpcy5kdXJhdGlvbiA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgIHRoaXMuY29udGV4dCA9IGNvbmZpZy5jb250ZXh0O1xuICAgIHRoaXMuY29udGVudFNlc3Npb25JZCA9IHRoaXMudXRpbFNlcnZpY2UudW5pcXVlSWQoKTtcbiAgICB0aGlzLnBsYXlTZXNzaW9uSWQgPSB0aGlzLnV0aWxTZXJ2aWNlLnVuaXF1ZUlkKCk7XG4gICAgdGhpcy5jaGFubmVsID0gdGhpcy5jb250ZXh0LmNoYW5uZWwgfHwgJyc7XG4gICAgdGhpcy5wZGF0YSA9IHRoaXMuY29udGV4dC5wZGF0YTtcbiAgICB0aGlzLnNpZCA9IHRoaXMuY29udGV4dC5zaWQ7XG4gICAgdGhpcy51aWQgPSB0aGlzLmNvbnRleHQudWlkO1xuICAgIHRoaXMucm9sbHVwID0gdGhpcy5jb250ZXh0LmNvbnRleHRSb2xsdXA7XG4gICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgdGhpcy5pc1NlY3Rpb25zQXZhaWxhYmxlID0gcGFyZW50Q29uZmlnPy5pc1NlY3Rpb25zQXZhaWxhYmxlO1xuXG4gICAgaWYgKCFDc1RlbGVtZXRyeU1vZHVsZS5pbnN0YW5jZS5pc0luaXRpYWxpc2VkKSB7XG4gICAgICBjb25zdCB0ZWxlbWV0cnlDb25maWcgPSB7XG4gICAgICAgIHBkYXRhOiB0aGlzLmNvbnRleHQucGRhdGEsXG4gICAgICAgIGVudjogJ2NvbnRlbnRwbGF5ZXInLFxuICAgICAgICBjaGFubmVsOiB0aGlzLmNvbnRleHQuY2hhbm5lbCxcbiAgICAgICAgZGlkOiB0aGlzLmNvbnRleHQuZGlkLFxuICAgICAgICBhdXRodG9rZW46IHRoaXMuY29udGV4dC5hdXRoVG9rZW4gfHwgJycsXG4gICAgICAgIHVpZDogdGhpcy5jb250ZXh0LnVpZCB8fCAnJyxcbiAgICAgICAgc2lkOiB0aGlzLmNvbnRleHQuc2lkLFxuICAgICAgICBiYXRjaHNpemU6IDIwLFxuICAgICAgICBtb2RlOiB0aGlzLmNvbnRleHQubW9kZSxcbiAgICAgICAgaG9zdDogdGhpcy5jb250ZXh0Lmhvc3QgfHwgJycsXG4gICAgICAgIGVuZHBvaW50OiB0aGlzLmNvbnRleHQuZW5kcG9pbnQgfHwgJy9kYXRhL3YzL3RlbGVtZXRyeScsXG4gICAgICAgIHRhZ3M6IHRoaXMuY29udGV4dC50YWdzLFxuICAgICAgICBjZGF0YTogKHRoaXMuY29udGV4dC5jZGF0YSB8fCBbXSkuY29uY2F0KFtcbiAgICAgICAgICB7IGlkOiB0aGlzLmNvbnRlbnRTZXNzaW9uSWQsIHR5cGU6ICdDb250ZW50U2Vzc2lvbicgfSxcbiAgICAgICAgICB7IGlkOiB0aGlzLnBsYXlTZXNzaW9uSWQsIHR5cGU6ICdQbGF5U2Vzc2lvbicgfSxcbiAgICAgICAgICB7IGlkOiAnMi4wJywgdHlwZTogJ1BsYXllclZlcnNpb24nIH1cbiAgICAgICAgXSlcbiAgICAgIH07XG4gICAgICBDc1RlbGVtZXRyeU1vZHVsZS5pbnN0YW5jZS5pbml0KHt9KTtcbiAgICAgIENzVGVsZW1ldHJ5TW9kdWxlLmluc3RhbmNlLnRlbGVtZXRyeVNlcnZpY2UuaW5pdFRlbGVtZXRyeShcbiAgICAgICAge1xuICAgICAgICAgIGNvbmZpZzogdGVsZW1ldHJ5Q29uZmlnLFxuICAgICAgICAgIHVzZXJPcmdEZXRhaWxzOiB7fVxuICAgICAgICB9XG4gICAgICApO1xuICAgIH1cblxuICAgIHRoaXMudGVsZW1ldHJ5T2JqZWN0ID0ge1xuICAgICAgaWQ6IHBhcmVudENvbmZpZy5pZGVudGlmaWVyLFxuICAgICAgdHlwZTogJ0NvbnRlbnQnLFxuICAgICAgdmVyOiBjb25maWcubWV0YWRhdGEucGtnVmVyc2lvbiA/IGNvbmZpZy5tZXRhZGF0YS5wa2dWZXJzaW9uLnRvU3RyaW5nKCkgOiAnJyxcbiAgICAgIHJvbGx1cDogdGhpcy5jb250ZXh0Lm9iamVjdFJvbGx1cCB8fCB7fVxuICAgIH07XG4gIH1cblxuICBwdWJsaWMgc3RhcnRBc3Nlc0V2ZW50KGFzc2VzRXZlbnQpIHtcbiAgICBDc1RlbGVtZXRyeU1vZHVsZS5pbnN0YW5jZS50ZWxlbWV0cnlTZXJ2aWNlLnJhaXNlQXNzZXNUZWxlbWV0cnkoXG4gICAgICBhc3Nlc0V2ZW50LFxuICAgICAgdGhpcy5nZXRFdmVudE9wdGlvbnMoKVxuICAgICk7XG4gIH1cblxuICBwdWJsaWMgc3RhcnQoZHVyYXRpb24pIHtcbiAgICBDc1RlbGVtZXRyeU1vZHVsZS5pbnN0YW5jZS50ZWxlbWV0cnlTZXJ2aWNlLnJhaXNlU3RhcnRUZWxlbWV0cnkoXG4gICAgICB7XG4gICAgICAgIG9wdGlvbnM6IHRoaXMuZ2V0RXZlbnRPcHRpb25zKCksXG4gICAgICAgIGVkYXRhOiB7IHR5cGU6ICdjb250ZW50JywgbW9kZTogJ3BsYXknLCBwYWdlaWQ6ICcnLCBkdXJhdGlvbjogTnVtYmVyKChkdXJhdGlvbiAvIDFlMykudG9GaXhlZCgyKSkgfVxuICAgICAgfVxuICAgICk7XG4gIH1cblxuICBwdWJsaWMgcmVzcG9uc2UoaWRlbnRpZmllciwgdmVyc2lvbiwgdHlwZSwgb3B0aW9uKSB7XG4gICAgY29uc3QgcmVzcG9uc2VFdmVudCA9IHtcbiAgICAgIHRhcmdldDoge1xuICAgICAgICBpZDogaWRlbnRpZmllcixcbiAgICAgICAgdmVyOiB2ZXJzaW9uLFxuICAgICAgICB0eXBlOiB0eXBlXG4gICAgICB9LFxuICAgICAgdHlwZTogJ0NIT09TRScsXG4gICAgICB2YWx1ZXM6IFt7XG4gICAgICAgIG9wdGlvblxuICAgICAgfV1cbiAgICB9O1xuICAgIENzVGVsZW1ldHJ5TW9kdWxlLmluc3RhbmNlLnRlbGVtZXRyeVNlcnZpY2UucmFpc2VSZXNwb25zZVRlbGVtZXRyeShcbiAgICAgIHJlc3BvbnNlRXZlbnQsXG4gICAgICB0aGlzLmdldEV2ZW50T3B0aW9ucygpXG4gICAgKTtcbiAgfVxuXG4gIHB1YmxpYyBzdW1tYXJ5KGVEYXRhKSB7XG4gICAgQ3NUZWxlbWV0cnlNb2R1bGUuaW5zdGFuY2UudGVsZW1ldHJ5U2VydmljZS5yYWlzZVN1bW1hcnlUZWxlbWV0cnkoXG4gICAgICBlRGF0YSxcbiAgICAgIHRoaXMuZ2V0RXZlbnRPcHRpb25zKClcbiAgICApO1xuICB9XG5cbiAgcHVibGljIGVuZChkdXJhdGlvbiwgY3VycmVudFF1ZXN0aW9uSW5kZXgsIHRvdGFsTm9vZlF1ZXN0aW9ucywgdmlzaXRlZFF1ZXN0aW9ucywgZW5kcGFnZXNlZW4sIHNjb3JlKSB7XG4gICAgY29uc3QgZHVyYXRpb25TZWMgPSBOdW1iZXIoKGR1cmF0aW9uIC8gMWUzKS50b0ZpeGVkKDIpKTtcbiAgICBDc1RlbGVtZXRyeU1vZHVsZS5pbnN0YW5jZS50ZWxlbWV0cnlTZXJ2aWNlLnJhaXNlRW5kVGVsZW1ldHJ5KHtcbiAgICAgIGVkYXRhOiB7XG4gICAgICAgIHR5cGU6ICdjb250ZW50JyxcbiAgICAgICAgbW9kZTogJ3BsYXknLFxuICAgICAgICBwYWdlaWQ6ICdzdW5iaXJkLXBsYXllci1FbmRwYWdlJyxcbiAgICAgICAgc3VtbWFyeTogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHByb2dyZXNzOiBOdW1iZXIoKChjdXJyZW50UXVlc3Rpb25JbmRleCAvIHRvdGFsTm9vZlF1ZXN0aW9ucykgKiAxMDApLnRvRml4ZWQoMCkpXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b3RhbE5vb2ZRdWVzdGlvbnM6IHRvdGFsTm9vZlF1ZXN0aW9uc1xuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgdmlzaXRlZFF1ZXN0aW9uczogdmlzaXRlZFF1ZXN0aW9ucyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGVuZHBhZ2VzZWVuXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzY29yZVxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGR1cmF0aW9uOiBkdXJhdGlvblNlY1xuICAgICAgfSxcbiAgICAgIG9wdGlvbnM6IHRoaXMuZ2V0RXZlbnRPcHRpb25zKClcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBpbnRlcmFjdChpZCwgY3VycmVudFBhZ2UsIGN1cnJlbnRRdWVzdGlvbkRldGFpbHM/KSB7XG4gICAgQ3NUZWxlbWV0cnlNb2R1bGUuaW5zdGFuY2UudGVsZW1ldHJ5U2VydmljZS5yYWlzZUludGVyYWN0VGVsZW1ldHJ5KHtcbiAgICAgIG9wdGlvbnM6IHRoaXMuZ2V0RXZlbnRPcHRpb25zKCksXG4gICAgICBlZGF0YTogeyB0eXBlOiAnVE9VQ0gnLCBzdWJ0eXBlOiAnJywgaWQsIHBhZ2VpZDogY3VycmVudFBhZ2UgKyAnJyB9XG4gICAgfSk7XG4gIH1cblxuXG5cbiAgcHVibGljIGhlYXJ0QmVhdChkYXRhKSB7XG4gICAgQ3NUZWxlbWV0cnlNb2R1bGUuaW5zdGFuY2UucGxheWVyVGVsZW1ldHJ5U2VydmljZS5vbkhlYXJ0QmVhdEV2ZW50KGRhdGEsIHt9KTtcbiAgfVxuXG4gIHB1YmxpYyBpbXByZXNzaW9uKGN1cnJlbnRQYWdlKSB7XG4gICAgQ3NUZWxlbWV0cnlNb2R1bGUuaW5zdGFuY2UudGVsZW1ldHJ5U2VydmljZS5yYWlzZUltcHJlc3Npb25UZWxlbWV0cnkoe1xuICAgICAgb3B0aW9uczogdGhpcy5nZXRFdmVudE9wdGlvbnMoKSxcbiAgICAgIGVkYXRhOiB7IHR5cGU6ICd3b3JrZmxvdycsIHN1YnR5cGU6ICcnLCBwYWdlaWQ6IGN1cnJlbnRQYWdlICsgJycsIHVyaTogJycgfVxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIGVycm9yKGVycm9yOiBFcnJvciwgZWRhdGE/OiB7IGVycjogc3RyaW5nLCBlcnJ0eXBlOiBzdHJpbmcgfSkge1xuICAgIENzVGVsZW1ldHJ5TW9kdWxlLmluc3RhbmNlLnRlbGVtZXRyeVNlcnZpY2UucmFpc2VFcnJvclRlbGVtZXRyeSh7XG4gICAgICBvcHRpb25zOiB0aGlzLmdldEV2ZW50T3B0aW9ucygpLFxuICAgICAgZWRhdGE6IHtcbiAgICAgICAgZXJyOiAnTE9BRCcsXG4gICAgICAgIGVycnR5cGU6ICdjb250ZW50JyxcbiAgICAgICAgc3RhY2t0cmFjZTogKGVycm9yICYmIGVycm9yLnRvU3RyaW5nKCkpIHx8ICcnXG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgZ2V0RXZlbnRPcHRpb25zKCkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICBvYmplY3Q6IHRoaXMudGVsZW1ldHJ5T2JqZWN0LFxuICAgICAgY29udGV4dDoge1xuICAgICAgICBjaGFubmVsOiB0aGlzLmNoYW5uZWwgfHwgJycsXG4gICAgICAgIHBkYXRhOiB0aGlzLnBkYXRhLFxuICAgICAgICBlbnY6ICdjb250ZW50cGxheWVyJyxcbiAgICAgICAgc2lkOiB0aGlzLnNpZCxcbiAgICAgICAgdWlkOiB0aGlzLnVpZCxcbiAgICAgICAgY2RhdGE6ICh0aGlzLmNvbnRleHQuY2RhdGEgfHwgW10pLmNvbmNhdChbeyBpZDogdGhpcy5jb250ZW50U2Vzc2lvbklkLCB0eXBlOiAnQ29udGVudFNlc3Npb24nIH0sXG4gICAgICAgIHsgaWQ6IHRoaXMucGxheVNlc3Npb25JZCwgdHlwZTogJ1BsYXlTZXNzaW9uJyB9LFxuICAgICAgICB7IGlkOiAnMi4wJywgdHlwZTogJ1BsYXllclZlcnNpb24nIH1dKSxcbiAgICAgICAgcm9sbHVwOiB0aGlzLnJvbGx1cCB8fCB7fVxuICAgICAgfVxuICAgIH07XG4gICAgaWYgKHRoaXMuaXNTZWN0aW9uc0F2YWlsYWJsZSkge1xuICAgICAgb3B0aW9ucy5jb250ZXh0LmNkYXRhLnB1c2goeyBpZDogdGhpcy5jb25maWcubWV0YWRhdGEuaWRlbnRpZmllciwgdHlwZTogJ1NlY3Rpb25JZCcgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG9wdGlvbnM7XG4gIH1cbn1cbiJdfQ==