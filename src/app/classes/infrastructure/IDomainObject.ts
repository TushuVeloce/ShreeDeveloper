import { TransportData } from './transportdata';
import { TransactionResult } from './transactionresult';
import { ValidationResultAccumulator } from './validationresultaccumulator';

export interface IDomainObject<T> {
    readonly allowEdit: boolean;
    readonly EntityType: string;

    SaveValidator(td: TransportData, 
        vra: ValidationResultAccumulator): void;

    CheckSaveValidity(td: TransportData, vra: ValidationResultAccumulator): TransactionResult

    MergeIntoTransportData(td: TransportData): void;

    CheckDeletionValidity(): TransactionResult;

    EnsurePrimaryKeysWithValidValues(): void;
}