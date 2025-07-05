export class UserLoginResponse {
  public Successful: boolean = false;
  public Message: string = '';
  public LoginToken: string = '';
  public EMailId: string = '';
  public PhoneNos: string = '';
  public UserDisplayName: string = '';
  public ValidMenuItemIds: string[] = [];
  public ValidMenuItems: any[] = [];
  public LastSelectedCompanyRef: number = 0;
  public CompanyName: string = '';
  public LoginEmployeeRef: number = 0;
  public LoginEmployeeName: string = '';
  public LoginForFirstTime: number = 0;
  public IsDefault: number = 0;
}
