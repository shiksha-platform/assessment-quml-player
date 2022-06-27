import { AfterViewInit, EventEmitter, OnChanges, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
export declare class SaComponent implements OnInit, OnChanges, AfterViewInit {
    domSanitizer: DomSanitizer;
    questions?: any;
    replayed?: boolean;
    baseUrl: string;
    componentLoaded: EventEmitter<any>;
    showAnswerClicked: EventEmitter<any>;
    showAnswer: boolean;
    solutions: any;
    question: any;
    answer: any;
    constructor(domSanitizer: DomSanitizer);
    ngOnChanges(): void;
    showAnswerToUser(): void;
    onEnter(event: any): void;
    handleKeyboardAccessibility(): void;
    ngOnInit(): void;
    ngAfterViewInit(): void;
}
