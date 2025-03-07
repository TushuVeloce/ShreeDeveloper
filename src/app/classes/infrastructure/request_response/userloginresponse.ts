export class UserLoginResponse
{
    public Successful: boolean = false;
    public Message: string = '';
    public LoginToken: string = '';
    public EMailId: string = '';
    public PhoneNos: string = '';
    public UserDisplayName: string = '';
    public ValidMenuItemIds: string[] = [];
    public LastSelectedCompanyRef: number = 0;
    public LastSelectedCompanyName: string = '';
}
