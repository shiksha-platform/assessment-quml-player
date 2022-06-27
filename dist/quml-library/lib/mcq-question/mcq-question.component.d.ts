import { OnInit, EventEmitter } from '@angular/core';
export declare class McqQuestionComponent implements OnInit {
    mcqQuestion: any;
    showPopup: EventEmitter<any>;
    layout: any;
    constructor();
    ngOnInit(): void;
    showQumlPopup(): void;
}
