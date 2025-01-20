export class LoggedInUserInformation
{
    public static FromCustomData(data: any)
    {
        let info = data as LoggedInUserInformation;
        return info;
    }
}