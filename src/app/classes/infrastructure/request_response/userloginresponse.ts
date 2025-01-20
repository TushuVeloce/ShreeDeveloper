import { GladianceUserRoles } from "../../domain/domainenums/domainenums";

export class UserLoginResponse
{
    public Successful: boolean = false;
    public Message: string = '';
    public LoginToken: string = '';
    public EMailId: string = '';
    public PhoneNos: string = '';
    public UserDisplayName: string = '';
    public Role: GladianceUserRoles = GladianceUserRoles.None;
    public ValidMenuItemIds: string[] = [];
}
