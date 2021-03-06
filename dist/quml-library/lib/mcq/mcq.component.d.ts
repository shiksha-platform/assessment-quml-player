import { OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { UtilService } from '../util-service';
export declare class McqComponent implements OnInit, AfterViewInit {
    domSanitizer: DomSanitizer;
    utilService: UtilService;
    question?: any;
    identifier: any;
    layout?: string;
    replayed: boolean;
    tryAgain?: boolean;
    componentLoaded: EventEmitter<any>;
    answerChanged: EventEmitter<any>;
    optionSelected: EventEmitter<number>;
    mcqQuestion: any;
    options: any;
    mcqOptions: any[];
    selectedOptionTarget: any;
    showQumlPopup: boolean;
    solutions: Array<[]>;
    cardinality: string;
    constructor(domSanitizer: DomSanitizer, utilService: UtilService);
    ngOnInit(): Promise<void>;
    ngAfterViewInit(): void;
    initOptions(): void;
    renderLatex(): void;
    replaceLatexText(): void;
    onOptionSelect(event: any): void;
    optionSelectedInImage(event: any): void;
    getSelectedOptionAndResult(optionObj: any): void;
    showPopup(): void;
    closePopUp(): void;
}
