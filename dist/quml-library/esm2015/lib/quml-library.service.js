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
export class QumlLibraryService {
    /**
     * @param {?} utilService
     */
    constructor(utilService) {
        this.utilService = utilService;
        this.isSectionsAvailable = false;
        this.telemetryEvent = new EventEmitter();
    }
    /**
     * @param {?} config
     * @param {?} parentConfig
     * @return {?}
     */
    initializeTelemetry(config, parentConfig) {
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
            const telemetryConfig = {
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
    }
    /**
     * @param {?} assesEvent
     * @return {?}
     */
    startAssesEvent(assesEvent) {
        CsTelemetryModule.instance.telemetryService.raiseAssesTelemetry(assesEvent, this.getEventOptions());
    }
    /**
     * @param {?} duration
     * @return {?}
     */
    start(duration) {
        CsTelemetryModule.instance.telemetryService.raiseStartTelemetry({
            options: this.getEventOptions(),
            edata: { type: 'content', mode: 'play', pageid: '', duration: Number((duration / 1e3).toFixed(2)) }
        });
    }
    /**
     * @param {?} identifier
     * @param {?} version
     * @param {?} type
     * @param {?} option
     * @return {?}
     */
    response(identifier, version, type, option) {
        /** @type {?} */
        const responseEvent = {
            target: {
                id: identifier,
                ver: version,
                type: type
            },
            type: 'CHOOSE',
            values: [{
                    option
                }]
        };
        CsTelemetryModule.instance.telemetryService.raiseResponseTelemetry(responseEvent, this.getEventOptions());
    }
    /**
     * @param {?} eData
     * @return {?}
     */
    summary(eData) {
        CsTelemetryModule.instance.telemetryService.raiseSummaryTelemetry(eData, this.getEventOptions());
    }
    /**
     * @param {?} duration
     * @param {?} currentQuestionIndex
     * @param {?} totalNoofQuestions
     * @param {?} visitedQuestions
     * @param {?} endpageseen
     * @param {?} score
     * @return {?}
     */
    end(duration, currentQuestionIndex, totalNoofQuestions, visitedQuestions, endpageseen, score) {
        /** @type {?} */
        const durationSec = Number((duration / 1e3).toFixed(2));
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
                        endpageseen
                    },
                    {
                        score
                    },
                ],
                duration: durationSec
            },
            options: this.getEventOptions()
        });
    }
    /**
     * @param {?} id
     * @param {?} currentPage
     * @param {?=} currentQuestionDetails
     * @return {?}
     */
    interact(id, currentPage, currentQuestionDetails) {
        CsTelemetryModule.instance.telemetryService.raiseInteractTelemetry({
            options: this.getEventOptions(),
            edata: { type: 'TOUCH', subtype: '', id, pageid: currentPage + '' }
        });
    }
    /**
     * @param {?} data
     * @return {?}
     */
    heartBeat(data) {
        CsTelemetryModule.instance.playerTelemetryService.onHeartBeatEvent(data, {});
    }
    /**
     * @param {?} currentPage
     * @return {?}
     */
    impression(currentPage) {
        CsTelemetryModule.instance.telemetryService.raiseImpressionTelemetry({
            options: this.getEventOptions(),
            edata: { type: 'workflow', subtype: '', pageid: currentPage + '', uri: '' }
        });
    }
    /**
     * @param {?} error
     * @param {?=} edata
     * @return {?}
     */
    error(error, edata) {
        CsTelemetryModule.instance.telemetryService.raiseErrorTelemetry({
            options: this.getEventOptions(),
            edata: {
                err: 'LOAD',
                errtype: 'content',
                stacktrace: (error && error.toString()) || ''
            }
        });
    }
    /**
     * @return {?}
     */
    getEventOptions() {
        /** @type {?} */
        const options = {
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
    }
}
QumlLibraryService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
/** @nocollapse */
QumlLibraryService.ctorParameters = () => [
    { type: UtilService }
];
/** @nocollapse */ QumlLibraryService.ɵprov = i0.ɵɵdefineInjectable({ factory: function QumlLibraryService_Factory() { return new QumlLibraryService(i0.ɵɵinject(i1.UtilService)); }, token: QumlLibraryService, providedIn: "root" });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVtbC1saWJyYXJ5LnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AcHJvamVjdC1zdW5iaXJkL3N1bmJpcmQtcXVtbC1wbGF5ZXItdjkvIiwic291cmNlcyI6WyJsaWIvcXVtbC1saWJyYXJ5LnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6RCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSw0Q0FBNEMsQ0FBQztBQUUvRSxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7OztBQUs3QyxNQUFNLE9BQU8sa0JBQWtCOzs7O0lBZTdCLFlBQW1CLFdBQXdCO1FBQXhCLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBWDNDLHdCQUFtQixHQUFHLEtBQUssQ0FBQztRQUM1QixtQkFBYyxHQUFHLElBQUksWUFBWSxFQUFPLENBQUM7SUFVTSxDQUFDOzs7Ozs7SUFFaEQsbUJBQW1CLENBQUMsTUFBd0IsRUFBRSxZQUEyQjs7UUFDdkUsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ3JDLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQztRQUM5QixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNwRCxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDakQsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUM7UUFDMUMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztRQUNoQyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENB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bUIsRUFBRTtZQUM1QixPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsQ0FBQyxDQUFDO1NBQ3hGO1FBRUQsT0FBTyxPQUFPLENBQUM7SUFDakIsQ0FBQzs7O1lBaE1GLFVBQVUsU0FBQztnQkFDVixVQUFVLEVBQUUsTUFBTTthQUNuQjs7OztZQUpRLFdBQVc7Ozs7O0lBTWxCLHNDQUFpQjs7SUFDakIscUNBQWdCOztJQUNoQixvQ0FBeUI7O0lBQ3pCLGlEQUE0Qjs7SUFDNUIsNENBQXlDOzs7OztJQUN6QyxxQ0FBeUI7Ozs7O0lBQ3pCLDZDQUE2Qjs7Ozs7SUFDN0IsOENBQWlDOzs7OztJQUNqQywyQ0FBOEI7Ozs7O0lBQzlCLG1DQUFtQjs7Ozs7SUFDbkIsaUNBQW9COzs7OztJQUNwQixpQ0FBb0I7Ozs7O0lBQ3BCLG9DQUFvQjs7SUFFUix5Q0FBK0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFdmVudEVtaXR0ZXIsIEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENzVGVsZW1ldHJ5TW9kdWxlIH0gZnJvbSAnQHByb2plY3Qtc3VuYmlyZC9jbGllbnQtc2VydmljZXMvdGVsZW1ldHJ5JztcbmltcG9ydCB7IENvbnRleHQsIElQYXJlbnRDb25maWcsIFF1bWxQbGF5ZXJDb25maWcgfSBmcm9tICcuL3F1bWwtbGlicmFyeS1pbnRlcmZhY2UnO1xuaW1wb3J0IHsgVXRpbFNlcnZpY2UgfSBmcm9tICcuL3V0aWwtc2VydmljZSc7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIFF1bWxMaWJyYXJ5U2VydmljZSB7XG4gIGR1cmF0aW9uOiBudW1iZXI7XG4gIGNoYW5uZWw6IHN0cmluZztcbiAgY29uZmlnOiBRdW1sUGxheWVyQ29uZmlnO1xuICBpc1NlY3Rpb25zQXZhaWxhYmxlID0gZmFsc2U7XG4gIHRlbGVtZXRyeUV2ZW50ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIHByaXZhdGUgY29udGV4dDogQ29udGV4dDtcbiAgcHJpdmF0ZSB0ZWxlbWV0cnlPYmplY3Q6IGFueTtcbiAgcHJpdmF0ZSBjb250ZW50U2Vzc2lvbklkOiBzdHJpbmc7XG4gIHByaXZhdGUgcGxheVNlc3Npb25JZDogc3RyaW5nO1xuICBwcml2YXRlIHBkYXRhOiBhbnk7XG4gIHByaXZhdGUgc2lkOiBzdHJpbmc7XG4gIHByaXZhdGUgdWlkOiBzdHJpbmc7XG4gIHByaXZhdGUgcm9sbHVwOiBhbnk7XG5cbiAgY29uc3RydWN0b3IocHVibGljIHV0aWxTZXJ2aWNlOiBVdGlsU2VydmljZSkgeyB9XG5cbiAgaW5pdGlhbGl6ZVRlbGVtZXRyeShjb25maWc6IFF1bWxQbGF5ZXJDb25maWcsIHBhcmVudENvbmZpZzogSVBhcmVudENvbmZpZykge1xuICAgIHRoaXMuZHVyYXRpb24gPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICB0aGlzLmNvbnRleHQgPSBjb25maWcuY29udGV4dDtcbiAgICB0aGlzLmNvbnRlbnRTZXNzaW9uSWQgPSB0aGlzLnV0aWxTZXJ2aWNlLnVuaXF1ZUlkKCk7XG4gICAgdGhpcy5wbGF5U2Vzc2lvbklkID0gdGhpcy51dGlsU2VydmljZS51bmlxdWVJZCgpO1xuICAgIHRoaXMuY2hhbm5lbCA9IHRoaXMuY29udGV4dC5jaGFubmVsIHx8ICcnO1xuICAgIHRoaXMucGRhdGEgPSB0aGlzLmNvbnRleHQucGRhdGE7XG4gICAgdGhpcy5zaWQgPSB0aGlzLmNvbnRleHQuc2lkO1xuICAgIHRoaXMudWlkID0gdGhpcy5jb250ZXh0LnVpZDtcbiAgICB0aGlzLnJvbGx1cCA9IHRoaXMuY29udGV4dC5jb250ZXh0Um9sbHVwO1xuICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgIHRoaXMuaXNTZWN0aW9uc0F2YWlsYWJsZSA9IHBhcmVudENvbmZpZz8uaXNTZWN0aW9uc0F2YWlsYWJsZTtcblxuICAgIGlmICghQ3NUZWxlbWV0cnlNb2R1bGUuaW5zdGFuY2UuaXNJbml0aWFsaXNlZCkge1xuICAgICAgY29uc3QgdGVsZW1ldHJ5Q29uZmlnID0ge1xuICAgICAgICBwZGF0YTogdGhpcy5jb250ZXh0LnBkYXRhLFxuICAgICAgICBlbnY6ICdjb250ZW50cGxheWVyJyxcbiAgICAgICAgY2hhbm5lbDogdGhpcy5jb250ZXh0LmNoYW5uZWwsXG4gICAgICAgIGRpZDogdGhpcy5jb250ZXh0LmRpZCxcbiAgICAgICAgYXV0aHRva2VuOiB0aGlzLmNvbnRleHQuYXV0aFRva2VuIHx8ICcnLFxuICAgICAgICB1aWQ6IHRoaXMuY29udGV4dC51aWQgfHwgJycsXG4gICAgICAgIHNpZDogdGhpcy5jb250ZXh0LnNpZCxcbiAgICAgICAgYmF0Y2hzaXplOiAyMCxcbiAgICAgICAgbW9kZTogdGhpcy5jb250ZXh0Lm1vZGUsXG4gICAgICAgIGhvc3Q6IHRoaXMuY29udGV4dC5ob3N0IHx8ICcnLFxuICAgICAgICBlbmRwb2ludDogdGhpcy5jb250ZXh0LmVuZHBvaW50IHx8ICcvZGF0YS92My90ZWxlbWV0cnknLFxuICAgICAgICB0YWdzOiB0aGlzLmNvbnRleHQudGFncyxcbiAgICAgICAgY2RhdGE6ICh0aGlzLmNvbnRleHQuY2RhdGEgfHwgW10pLmNvbmNhdChbXG4gICAgICAgICAgeyBpZDogdGhpcy5jb250ZW50U2Vzc2lvbklkLCB0eXBlOiAnQ29udGVudFNlc3Npb24nIH0sXG4gICAgICAgICAgeyBpZDogdGhpcy5wbGF5U2Vzc2lvbklkLCB0eXBlOiAnUGxheVNlc3Npb24nIH0sXG4gICAgICAgICAgeyBpZDogJzIuMCcsIHR5cGU6ICdQbGF5ZXJWZXJzaW9uJyB9XG4gICAgICAgIF0pXG4gICAgICB9O1xuICAgICAgQ3NUZWxlbWV0cnlNb2R1bGUuaW5zdGFuY2UuaW5pdCh7fSk7XG4gICAgICBDc1RlbGVtZXRyeU1vZHVsZS5pbnN0YW5jZS50ZWxlbWV0cnlTZXJ2aWNlLmluaXRUZWxlbWV0cnkoXG4gICAgICAgIHtcbiAgICAgICAgICBjb25maWc6IHRlbGVtZXRyeUNvbmZpZyxcbiAgICAgICAgICB1c2VyT3JnRGV0YWlsczoge31cbiAgICAgICAgfVxuICAgICAgKTtcbiAgICB9XG5cbiAgICB0aGlzLnRlbGVtZXRyeU9iamVjdCA9IHtcbiAgICAgIGlkOiBwYXJlbnRDb25maWcuaWRlbnRpZmllcixcbiAgICAgIHR5cGU6ICdDb250ZW50JyxcbiAgICAgIHZlcjogY29uZmlnLm1ldGFkYXRhLnBrZ1ZlcnNpb24gPyBjb25maWcubWV0YWRhdGEucGtnVmVyc2lvbi50b1N0cmluZygpIDogJycsXG4gICAgICByb2xsdXA6IHRoaXMuY29udGV4dC5vYmplY3RSb2xsdXAgfHwge31cbiAgICB9O1xuICB9XG5cbiAgcHVibGljIHN0YXJ0QXNzZXNFdmVudChhc3Nlc0V2ZW50KSB7XG4gICAgQ3NUZWxlbWV0cnlNb2R1bGUuaW5zdGFuY2UudGVsZW1ldHJ5U2VydmljZS5yYWlzZUFzc2VzVGVsZW1ldHJ5KFxuICAgICAgYXNzZXNFdmVudCxcbiAgICAgIHRoaXMuZ2V0RXZlbnRPcHRpb25zKClcbiAgICApO1xuICB9XG5cbiAgcHVibGljIHN0YXJ0KGR1cmF0aW9uKSB7XG4gICAgQ3NUZWxlbWV0cnlNb2R1bGUuaW5zdGFuY2UudGVsZW1ldHJ5U2VydmljZS5yYWlzZVN0YXJ0VGVsZW1ldHJ5KFxuICAgICAge1xuICAgICAgICBvcHRpb25zOiB0aGlzLmdldEV2ZW50T3B0aW9ucygpLFxuICAgICAgICBlZGF0YTogeyB0eXBlOiAnY29udGVudCcsIG1vZGU6ICdwbGF5JywgcGFnZWlkOiAnJywgZHVyYXRpb246IE51bWJlcigoZHVyYXRpb24gLyAxZTMpLnRvRml4ZWQoMikpIH1cbiAgICAgIH1cbiAgICApO1xuICB9XG5cbiAgcHVibGljIHJlc3BvbnNlKGlkZW50aWZpZXIsIHZlcnNpb24sIHR5cGUsIG9wdGlvbikge1xuICAgIGNvbnN0IHJlc3BvbnNlRXZlbnQgPSB7XG4gICAgICB0YXJnZXQ6IHtcbiAgICAgICAgaWQ6IGlkZW50aWZpZXIsXG4gICAgICAgIHZlcjogdmVyc2lvbixcbiAgICAgICAgdHlwZTogdHlwZVxuICAgICAgfSxcbiAgICAgIHR5cGU6ICdDSE9PU0UnLFxuICAgICAgdmFsdWVzOiBbe1xuICAgICAgICBvcHRpb25cbiAgICAgIH1dXG4gICAgfTtcbiAgICBDc1RlbGVtZXRyeU1vZHVsZS5pbnN0YW5jZS50ZWxlbWV0cnlTZXJ2aWNlLnJhaXNlUmVzcG9uc2VUZWxlbWV0cnkoXG4gICAgICByZXNwb25zZUV2ZW50LFxuICAgICAgdGhpcy5nZXRFdmVudE9wdGlvbnMoKVxuICAgICk7XG4gIH1cblxuICBwdWJsaWMgc3VtbWFyeShlRGF0YSkge1xuICAgIENzVGVsZW1ldHJ5TW9kdWxlLmluc3RhbmNlLnRlbGVtZXRyeVNlcnZpY2UucmFpc2VTdW1tYXJ5VGVsZW1ldHJ5KFxuICAgICAgZURhdGEsXG4gICAgICB0aGlzLmdldEV2ZW50T3B0aW9ucygpXG4gICAgKTtcbiAgfVxuXG4gIHB1YmxpYyBlbmQoZHVyYXRpb24sIGN1cnJlbnRRdWVzdGlvbkluZGV4LCB0b3RhbE5vb2ZRdWVzdGlvbnMsIHZpc2l0ZWRRdWVzdGlvbnMsIGVuZHBhZ2VzZWVuLCBzY29yZSkge1xuICAgIGNvbnN0IGR1cmF0aW9uU2VjID0gTnVtYmVyKChkdXJhdGlvbiAvIDFlMykudG9GaXhlZCgyKSk7XG4gICAgQ3NUZWxlbWV0cnlNb2R1bGUuaW5zdGFuY2UudGVsZW1ldHJ5U2VydmljZS5yYWlzZUVuZFRlbGVtZXRyeSh7XG4gICAgICBlZGF0YToge1xuICAgICAgICB0eXBlOiAnY29udGVudCcsXG4gICAgICAgIG1vZGU6ICdwbGF5JyxcbiAgICAgICAgcGFnZWlkOiAnc3VuYmlyZC1wbGF5ZXItRW5kcGFnZScsXG4gICAgICAgIHN1bW1hcnk6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBwcm9ncmVzczogTnVtYmVyKCgoY3VycmVudFF1ZXN0aW9uSW5kZXggLyB0b3RhbE5vb2ZRdWVzdGlvbnMpICogMTAwKS50b0ZpeGVkKDApKVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG90YWxOb29mUXVlc3Rpb25zOiB0b3RhbE5vb2ZRdWVzdGlvbnNcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHZpc2l0ZWRRdWVzdGlvbnM6IHZpc2l0ZWRRdWVzdGlvbnMsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBlbmRwYWdlc2VlblxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc2NvcmVcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBkdXJhdGlvbjogZHVyYXRpb25TZWNcbiAgICAgIH0sXG4gICAgICBvcHRpb25zOiB0aGlzLmdldEV2ZW50T3B0aW9ucygpXG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgaW50ZXJhY3QoaWQsIGN1cnJlbnRQYWdlLCBjdXJyZW50UXVlc3Rpb25EZXRhaWxzPykge1xuICAgIENzVGVsZW1ldHJ5TW9kdWxlLmluc3RhbmNlLnRlbGVtZXRyeVNlcnZpY2UucmFpc2VJbnRlcmFjdFRlbGVtZXRyeSh7XG4gICAgICBvcHRpb25zOiB0aGlzLmdldEV2ZW50T3B0aW9ucygpLFxuICAgICAgZWRhdGE6IHsgdHlwZTogJ1RPVUNIJywgc3VidHlwZTogJycsIGlkLCBwYWdlaWQ6IGN1cnJlbnRQYWdlICsgJycgfVxuICAgIH0pO1xuICB9XG5cblxuXG4gIHB1YmxpYyBoZWFydEJlYXQoZGF0YSkge1xuICAgIENzVGVsZW1ldHJ5TW9kdWxlLmluc3RhbmNlLnBsYXllclRlbGVtZXRyeVNlcnZpY2Uub25IZWFydEJlYXRFdmVudChkYXRhLCB7fSk7XG4gIH1cblxuICBwdWJsaWMgaW1wcmVzc2lvbihjdXJyZW50UGFnZSkge1xuICAgIENzVGVsZW1ldHJ5TW9kdWxlLmluc3RhbmNlLnRlbGVtZXRyeVNlcnZpY2UucmFpc2VJbXByZXNzaW9uVGVsZW1ldHJ5KHtcbiAgICAgIG9wdGlvbnM6IHRoaXMuZ2V0RXZlbnRPcHRpb25zKCksXG4gICAgICBlZGF0YTogeyB0eXBlOiAnd29ya2Zsb3cnLCBzdWJ0eXBlOiAnJywgcGFnZWlkOiBjdXJyZW50UGFnZSArICcnLCB1cmk6ICcnIH1cbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBlcnJvcihlcnJvcjogRXJyb3IsIGVkYXRhPzogeyBlcnI6IHN0cmluZywgZXJydHlwZTogc3RyaW5nIH0pIHtcbiAgICBDc1RlbGVtZXRyeU1vZHVsZS5pbnN0YW5jZS50ZWxlbWV0cnlTZXJ2aWNlLnJhaXNlRXJyb3JUZWxlbWV0cnkoe1xuICAgICAgb3B0aW9uczogdGhpcy5nZXRFdmVudE9wdGlvbnMoKSxcbiAgICAgIGVkYXRhOiB7XG4gICAgICAgIGVycjogJ0xPQUQnLFxuICAgICAgICBlcnJ0eXBlOiAnY29udGVudCcsXG4gICAgICAgIHN0YWNrdHJhY2U6IChlcnJvciAmJiBlcnJvci50b1N0cmluZygpKSB8fCAnJ1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIGdldEV2ZW50T3B0aW9ucygpIHtcbiAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgb2JqZWN0OiB0aGlzLnRlbGVtZXRyeU9iamVjdCxcbiAgICAgIGNvbnRleHQ6IHtcbiAgICAgICAgY2hhbm5lbDogdGhpcy5jaGFubmVsIHx8ICcnLFxuICAgICAgICBwZGF0YTogdGhpcy5wZGF0YSxcbiAgICAgICAgZW52OiAnY29udGVudHBsYXllcicsXG4gICAgICAgIHNpZDogdGhpcy5zaWQsXG4gICAgICAgIHVpZDogdGhpcy51aWQsXG4gICAgICAgIGNkYXRhOiAodGhpcy5jb250ZXh0LmNkYXRhIHx8IFtdKS5jb25jYXQoW3sgaWQ6IHRoaXMuY29udGVudFNlc3Npb25JZCwgdHlwZTogJ0NvbnRlbnRTZXNzaW9uJyB9LFxuICAgICAgICB7IGlkOiB0aGlzLnBsYXlTZXNzaW9uSWQsIHR5cGU6ICdQbGF5U2Vzc2lvbicgfSxcbiAgICAgICAgeyBpZDogJzIuMCcsIHR5cGU6ICdQbGF5ZXJWZXJzaW9uJyB9XSksXG4gICAgICAgIHJvbGx1cDogdGhpcy5yb2xsdXAgfHwge31cbiAgICAgIH1cbiAgICB9O1xuICAgIGlmICh0aGlzLmlzU2VjdGlvbnNBdmFpbGFibGUpIHtcbiAgICAgIG9wdGlvbnMuY29udGV4dC5jZGF0YS5wdXNoKHsgaWQ6IHRoaXMuY29uZmlnLm1ldGFkYXRhLmlkZW50aWZpZXIsIHR5cGU6ICdTZWN0aW9uSWQnIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBvcHRpb25zO1xuICB9XG59XG4iXX0=