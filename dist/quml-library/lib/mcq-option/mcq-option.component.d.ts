import { EventEmitter, OnChanges } from '@angular/core';
import { UtilService } from '../util-service';
export declare class McqOptionComponent implements OnChanges {
    utilService: UtilService;
    mcqOptions: any;
    solutions: any;
    layout: any;
    cardinality: string;
    showPopup: EventEmitter<any>;
    optionSelected: EventEmitter<any>;
    selectedOption: any[];
    replayed: boolean;
    tryAgain?: boolean;
    constructor(utilService: UtilService);
    ngOnChanges(): void;
    unselectOption(): void;
    onOptionSelect(event: any, mcqOption: any): void;
    onImageOptionSelected(event: any): void;
    showQumlPopup(): void;
    onEnter(event: KeyboardEvent, mcqOption: any): void;
}
