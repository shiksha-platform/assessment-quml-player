export declare class UtilService {
    constructor();
    uniqueId(length?: number): string;
    getTimeSpentText(pdfPlayerStartTime: any): string;
    getKeyValue(keys: any): any;
    getMultiselectScore(options: any, responseDeclaration: any): any;
    hasDuplicates(selectedOptions: any, option: any): any;
    getQuestionType(questions: any, currentIndex: any): any;
    canGo(progressBarClass: any): boolean;
    sumObjectsByKey(...objects: any[]): any;
}
