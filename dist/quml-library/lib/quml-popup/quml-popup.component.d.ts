import { OnInit, EventEmitter, AfterViewInit } from '@angular/core';
export declare class QumlPopupComponent implements OnInit, AfterViewInit {
    image: string;
    htmlTag: any;
    popUpClose: EventEmitter<any>;
    constructor();
    ngOnInit(): void;
    ngAfterViewInit(): void;
    closePopup(): void;
}
