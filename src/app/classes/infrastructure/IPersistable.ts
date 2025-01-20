import { TransportData } from '../infrastructure/transportdata';
import { ValidationResultAccumulator } from '../infrastructure/validationresultaccumulator';

export interface IPersistable<T> {
    CheckSaveValidity(td: TransportData, vra: ValidationResultAccumulator): void;
    MergeIntoTransportData(td: TransportData): void;
    GetEditableVersion(): T;
    EnsurePrimaryKeysWithValidValues: () => Promise<void>;
}