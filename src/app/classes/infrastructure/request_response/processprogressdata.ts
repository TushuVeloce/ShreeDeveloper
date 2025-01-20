import { TransactionResult } from "../transactionresult";

export class ProcessProgressData
{
    public ProcessToken: string = '';
    public ProgressPercentage: number = 0.0;
    public ProgressDescriptionString: string = '';
    public ProgressDescriptionHTML: string = '';
    public ProcessCompleted: boolean = false;
    public ProcessResult: TransactionResult = null as any;
}