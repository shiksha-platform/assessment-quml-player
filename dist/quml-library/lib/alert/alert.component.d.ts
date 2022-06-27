import { EventEmitter, AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
export declare class AlertComponent implements OnInit, AfterViewInit, OnDestroy {
    alertType: any;
    isHintAvailable: boolean;
    showSolutionButton: boolean;
    closeAlert: EventEmitter<any>;
    showSolution: EventEmitter<any>;
    showHint: EventEmitter<any>;
    subscription: Subscription;
    isFocusSet: boolean;
    onKeydownHandler(event: KeyboardEvent): void;
    previousActiveElement: HTMLElement;
    ngOnInit(): void;
    ngAfterViewInit(): void;
    viewHint(): void;
    viewSolution(): void;
    close(type: any): void;
    ngOnDestroy(): void;
}
