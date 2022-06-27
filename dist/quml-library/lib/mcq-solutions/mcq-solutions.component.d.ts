import { EventEmitter, ElementRef } from '@angular/core';
export declare class McqSolutionsComponent {
    question: any;
    options: any;
    solutions: any;
    close: EventEmitter<any>;
    solutionVideoPlayer: ElementRef;
    showVideoSolution: boolean;
    previousActiveElement: HTMLElement;
    closeSolution(): void;
}
