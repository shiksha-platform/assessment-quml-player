import { EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
export declare class ScoreboardComponent implements OnInit, OnDestroy {
    scores: any;
    totalNoOfQuestions: number;
    contentName: string;
    showFeedBack: boolean;
    isSections: boolean;
    isDurationExpired: boolean;
    submitClicked: EventEmitter<any>;
    emitQuestionNo: EventEmitter<any>;
    scoreBoardLoaded: EventEmitter<any>;
    subscription: Subscription;
    constructor();
    ngOnInit(): void;
    goToQuestion(index: number, identifier?: string): void;
    ngOnDestroy(): void;
}
