import { ValidationResultEntryCollection } from './validationresultentrycollection';

export class ValidationResultAccumulator {
    constructor(private vrec: ValidationResultEntryCollection) {}

    public add(validationTarget: string, validationMessage: string) {
        this.vrec.Entries.push({ ValidationTarget: validationTarget, 
            ValidationMessage: validationMessage });
    }
}