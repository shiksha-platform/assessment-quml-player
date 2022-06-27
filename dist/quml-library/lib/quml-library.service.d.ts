import { EventEmitter } from '@angular/core';
import { IParentConfig, QumlPlayerConfig } from './quml-library-interface';
import { UtilService } from './util-service';
export declare class QumlLibraryService {
    utilService: UtilService;
    duration: number;
    channel: string;
    config: QumlPlayerConfig;
    isSectionsAvailable: boolean;
    telemetryEvent: EventEmitter<any>;
    private context;
    private telemetryObject;
    private contentSessionId;
    private playSessionId;
    private pdata;
    private sid;
    private uid;
    private rollup;
    constructor(utilService: UtilService);
    initializeTelemetry(config: QumlPlayerConfig, parentConfig: IParentConfig): void;
    startAssesEvent(assesEvent: any): void;
    start(duration: any): void;
    response(identifier: any, version: any, type: any, option: any): void;
    summary(eData: any): void;
    end(duration: any, currentQuestionIndex: any, totalNoofQuestions: any, visitedQuestions: any, endpageseen: any, score: any): void;
    interact(id: any, currentPage: any, currentQuestionDetails?: any): void;
    heartBeat(data: any): void;
    impression(currentPage: any): void;
    error(error: Error, edata?: {
        err: string;
        errtype: string;
    }): void;
    getEventOptions(): {
        object: any;
        context: {
            channel: string;
            pdata: any;
            env: string;
            sid: string;
            uid: string;
            cdata: import("./quml-library-interface").Cdata[];
            rollup: any;
        };
    };
}
