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

export enum CompanyType {
  None = 0,
  Proprietorship = 10,
  Partnership = 20,
  Pvt_ltd = 30,
  Public_Ltd = 40,
  Cooperative = 50
}

export enum ModuleType {
  None = 0,
  Masters = 100,
  Transactions  = 200,
  Reports = 300
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



  public static CompanyTypeName(itemType: CompanyType) {
    switch (itemType) {
      case CompanyType.Proprietorship: return 'Proprietorship';
      case CompanyType.Partnership: return 'Partnership';
      case CompanyType.Pvt_ltd: return 'Pvt.ltd';
      case CompanyType.Public_Ltd: return 'Public Ltd';
      case CompanyType.Cooperative: return 'Cooperative';
      default: return '';
    }
  }

  public static CompanyTypeList(withAllOption: boolean = false, allOptionName: string = '<All>') {
    let result = [
      {
        Ref: CompanyType.Proprietorship, Name: DomainEnums.CompanyTypeName(CompanyType.Proprietorship)
      },
      {
        Ref: CompanyType.Partnership, Name: DomainEnums.CompanyTypeName(CompanyType.Partnership)
      },
      {
        Ref: CompanyType.Pvt_ltd, Name: DomainEnums.CompanyTypeName(CompanyType.Pvt_ltd)
      },
      {
        Ref: CompanyType.Public_Ltd, Name: DomainEnums.CompanyTypeName(CompanyType.Public_Ltd)
      },
      {
        Ref: CompanyType.Cooperative, Name: DomainEnums.CompanyTypeName(CompanyType.Cooperative)
      },
    ]
    if (withAllOption) {
      let allEntry = {
        Ref: CompanyType.None,
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

  // User Role Rights
  public static ModuleName(company: ModuleType) {
    switch (company) {
      case ModuleType.Masters: return 'Masters';
      case ModuleType.Transactions: return 'Transactions';
      case ModuleType.Reports: return 'Reports';
      default: return '';
    }
  }

  public static ModuleList(withAllOption: boolean = false, allOptionName: string = '<All>') {
    let result = [
      {
        Ref: ModuleType.Masters, Name: DomainEnums.ModuleName(ModuleType.Masters)
      },
      {
        Ref: ModuleType.Transactions, Name: DomainEnums.ModuleName(ModuleType.Transactions)
      },
      {
        Ref: ModuleType.Reports, Name: DomainEnums.ModuleName(ModuleType.Reports)
      }
      
    ]
    if (withAllOption) {
      let allEntry = {
        Ref: ModuleType.None,
        Name: allOptionName
      }
      result.unshift(allEntry);
    }
    return result;
  }


}
