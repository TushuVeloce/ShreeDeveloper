import { ValidationResultEntry } from './validationresultentry';

export class ValidationResultEntryCollection
{
    Entries: ValidationResultEntry[] = []

    public static FormulateMessageFromList(vrec: ValidationResultEntryCollection): string
    // Important: DO NOT CALL Utils::combineListIntoString
    // otherwise there will be circular references
    {
        let result: string = '';

        vrec.Entries.forEach((entry) => {
            if (result.length > 0) result += '\n';
            result += entry.ValidationMessage;
        })

        return result;
    }
}
