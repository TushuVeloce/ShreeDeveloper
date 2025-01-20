export enum RequestTypes
{
    Save = "Save",
    Deletion = "Deletion",
    Fetch = "Fetch",
    CustomProcess = "CustomProcess",
    GenerateDocument = "GenerateDocument"
}

export enum StringHorizontalAlignment
{
    Left = 1,
    Center = 2,
    Right = 3,
    Justified = 4
}

export enum EMailSSLConnectionOptions
{
    None = 0,
    Auto = 1,
    SslOnConnect = 2,
    StartTls = 3,
    StartTlsWhenAvailable = 4
}

export enum PlatformTypes
{
    Desktop = 1,
    Mobile = 2
}

export enum DeviceOrientations
{
    Portrait = 1,
    Landscape = 2
}

export class CoreEnums
{
    public static EMailSSLConnectionOptionName(value: EMailSSLConnectionOptions)
    {
        switch(value)
        {
            case EMailSSLConnectionOptions.None: return "None";
            case EMailSSLConnectionOptions.Auto: return "Auto";
            case EMailSSLConnectionOptions.SslOnConnect: return "SSLOnConnect";
            case EMailSSLConnectionOptions.StartTls: return "StartTLS";
            case EMailSSLConnectionOptions.StartTlsWhenAvailable: return "StartTLSWhenAvailable";
            default: return '';
        }
    }

    public static EMailSSLConnectionOptionList(includeAllOption: boolean = false, allOptionString: string = '<All>')
    {
        let result = [
            { Ref: EMailSSLConnectionOptions.None, 
                Name: CoreEnums.EMailSSLConnectionOptionName(EMailSSLConnectionOptions.None) },
            { Ref: EMailSSLConnectionOptions.Auto, 
                Name: CoreEnums.EMailSSLConnectionOptionName(EMailSSLConnectionOptions.Auto) },
            { Ref: EMailSSLConnectionOptions.SslOnConnect, 
                Name: CoreEnums.EMailSSLConnectionOptionName(EMailSSLConnectionOptions.SslOnConnect) },
            { Ref: EMailSSLConnectionOptions.StartTls, 
                Name: CoreEnums.EMailSSLConnectionOptionName(EMailSSLConnectionOptions.StartTls) },
            { Ref: EMailSSLConnectionOptions.StartTlsWhenAvailable, 
                Name: CoreEnums.EMailSSLConnectionOptionName(EMailSSLConnectionOptions.StartTlsWhenAvailable) }
        ]

        if (includeAllOption)
        {
            let allOption = { Ref: 0, Name: allOptionString };
            result.unshift(allOption);
        }

        return result;
    }
}