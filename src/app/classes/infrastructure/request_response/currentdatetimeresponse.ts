import { TransactionResult } from "../transactionresult";

export class CurrentDateTimeResponse
{
    DateTimeValue: string = '';

    public static FromTransactionResult(tr: TransactionResult)
    {
        let result = new CurrentDateTimeResponse();
        result.DateTimeValue = '';

        if (tr.Successful)
        {
            result = JSON.parse(tr.Tag) as CurrentDateTimeResponse;
        }

        return result;
    }
}
