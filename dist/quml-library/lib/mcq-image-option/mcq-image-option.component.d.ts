import { OnInit, EventEmitter } from '@angular/core';
export declare class McqImageOptionComponent implements OnInit {
    showQumlPopup: boolean;
    qumlPopupImage: any;
    mcqQuestion: any;
    solutions: any;
    mcqOption: any;
    imgOptionSelected: EventEmitter<any>;
    constructor();
    ngOnInit(): void;
    showPopup(image: any): void;
    optionClicked(mcqOption: any): void;
    onEnter(event: KeyboardEvent, mcqOption: any): void;
    openPopup(optionHtml: any): void;
    closePopUp(): void;
}
