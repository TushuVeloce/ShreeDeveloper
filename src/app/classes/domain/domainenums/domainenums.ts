export enum Gender {
  None = 0,
  Male = 10,
  Female = 20
}

export enum MarketingModes {
  None = 0,
  Digital = 10,
  Electronics = 20,
  Outdoor = 30,
  PrintingMedia = 40,
  AgentBoker = 50
}

export enum Company {
None = 0,
Company1 = 10,
Company2 = 20,
Company3 = 30,
Company4 = 40
}

// export enum LoginStatusModes {
//   None = 0,
//   Enable = 'true',
//   Disable = 'false',
// }


export class DomainEnums {

  public static MarketingModeName(MarketingMode: MarketingModes) {
    switch (MarketingMode) {
      case MarketingModes.Digital: return 'Digital';
      case MarketingModes.Electronics: return 'Electronics';
      case MarketingModes.Outdoor: return 'Outdoor';
      case MarketingModes.PrintingMedia: return 'Printing Media';
      case MarketingModes.AgentBoker: return 'Agent/Boker';
      default: return '';
    }
  }

  public static MarketingModesList(withAllOption: boolean = false, allOptionName: string = '<All>') {
    let result = [
      {
        Ref: MarketingModes.Digital, Name: DomainEnums.MarketingModeName(MarketingModes.Digital)
      },
      {
        Ref: MarketingModes.Electronics, Name: DomainEnums.MarketingModeName(MarketingModes.Electronics)
      },
      {
        Ref: MarketingModes.Outdoor, Name: DomainEnums.MarketingModeName(MarketingModes.Outdoor)
      },
      {
        Ref: MarketingModes.PrintingMedia, Name: DomainEnums.MarketingModeName(MarketingModes.PrintingMedia)
      },
      {
        Ref: MarketingModes.AgentBoker, Name: DomainEnums.MarketingModeName(MarketingModes.AgentBoker)
      },
      

    ]
    if (withAllOption) {
      let allEntry = {
        Ref: MarketingModes.None,
        Name: allOptionName
      }
      result.unshift(allEntry);
    }
    return result;
  }

  public static GenderTypeName(itemType: Gender) {
    switch (itemType) {
      case Gender.Male: return 'Male';
      case Gender.Female: return 'Female';
      default: return '';
    }
  }

  public static GenderTypeList(withAllOption: boolean = false, allOptionName: string = '<All>') {
    let result = [
      {
        Ref: Gender.Male, Name: DomainEnums.GenderTypeName(Gender.Male)
      },
      {
        Ref: Gender.Female, Name: DomainEnums.GenderTypeName(Gender.Female)
      },
    ]
    if (withAllOption) {
      let allEntry = {
        Ref: Gender.None,
        Name: allOptionName
      }
      result.unshift(allEntry);
    }
    return result;

  }


  // public static LoginStatusName(LoginStatus: LoginStatusModes) {
  //   switch (LoginStatus) {
  //     case LoginStatusModes.Enable: return 'Enable';
  //     case LoginStatusModes.Disable: return 'Disable';

  //     default: return '';
  //   }
  // }

  // public static LoginStatusList(withAllOption: boolean = false, allOptionName: string = '<All>') {
  //   let result = [
  //     {
  //       Ref: LoginStatusModes.Enable, Name: DomainEnums.LoginStatusName(LoginStatusModes.Enable)
  //     },
  //     {
  //       Ref: LoginStatusModes.Disable, Name: DomainEnums.LoginStatusName(LoginStatusModes.Disable)
  //     },

  //   ]
  //   if (withAllOption) {
  //     let allEntry = {
  //       Ref: LoginStatusModes.None,
  //       Name: allOptionName
  //     }
  //     result.unshift(allEntry);
  //   }
  //   return result;
  // }

  public static CompanyName(company: Company) {
    switch (company) {
      case Company.Company1: return 'Company1';
      case Company.Company2: return 'Company2';
      case Company.Company3: return 'Company3';
      case Company.Company4: return 'Company4';
      default: return '';
    }
  }

  public static CompanyList(withAllOption: boolean = false, allOptionName: string = '<All>') {
    let result = [
      {
        Ref: Company.Company1, Name: DomainEnums.CompanyName(Company.Company1)
      },
      {
        Ref: Company.Company2, Name: DomainEnums.CompanyName(Company.Company2)
      },
      {
        Ref: Company.Company3, Name: DomainEnums.CompanyName(Company.Company3)
      },
      {
        Ref: Company.Company4, Name: DomainEnums.CompanyName(Company.Company4)
      }
      

    ]
    if (withAllOption) {
      let allEntry = {
        Ref: Company.None,
        Name: allOptionName
      }
      result.unshift(allEntry);
    }
    return result;
  }


}
