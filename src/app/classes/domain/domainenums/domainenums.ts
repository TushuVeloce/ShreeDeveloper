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

export enum ModuleTypes {
  None = 0,
  Master = 100,
  Transaction  = 200,
  Report = 300
}

export enum ApplicationFeatureGroups {
  None = 0,
  Master = 10,
  Transaction  = 20,
  Report = 30
}

export enum ApplicationFeatures {
  None = 0,
  DepartmentMaster = 100,
  AccountingTransaction  = 200,
  VendorReport = 300
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
  public static ModuleName(company: ModuleTypes) {
    switch (company) {
      case ModuleTypes.Master: return 'Masters';
      case ModuleTypes.Transaction: return 'Transactions';
      case ModuleTypes.Report: return 'Reports';
      default: return '';
    }
  }

  public static ModuleList(withAllOption: boolean = false, allOptionName: string = '<All>') {
    let result = [
      {
        Ref: ModuleTypes.Master, Name: DomainEnums.ModuleName(ModuleTypes.Master)
      },
      {
        Ref: ModuleTypes.Transaction, Name: DomainEnums.ModuleName(ModuleTypes.Transaction)
      },
      {
        Ref: ModuleTypes.Report, Name: DomainEnums.ModuleName(ModuleTypes.Report)
      }
      
    ]
    if (withAllOption) {
      let allEntry = {
        Ref: ModuleTypes.None,
        Name: allOptionName
      }
      result.unshift(allEntry);
    }
    return result;
  }

  // For Feature Group 

  public static ApplicationFeatureGroupName(company: ApplicationFeatureGroups) {
    switch (company) {
      case ApplicationFeatureGroups.Master: return 'Masters';
      case ApplicationFeatureGroups.Transaction: return 'Transactions';
      case ApplicationFeatureGroups.Report: return 'Reports';
      default: return '';
    }
  }

  public static ApplicationFeatureGroupList(withAllOption: boolean = false, allOptionName: string = '<All>') {
    let result = [
      {
        Ref: ApplicationFeatureGroups.Master, Name: DomainEnums.ApplicationFeatureGroupName(ApplicationFeatureGroups.Master)
      },
      {
        Ref: ApplicationFeatureGroups.Transaction, Name: DomainEnums.ApplicationFeatureGroupName(ApplicationFeatureGroups.Transaction)
      },
      {
        Ref: ApplicationFeatureGroups.Report, Name: DomainEnums.ApplicationFeatureGroupName(ApplicationFeatureGroups.Report)
      }
      
    ]
    if (withAllOption) {
      let allEntry = {
        Ref: ApplicationFeatureGroups.None,
        Name: allOptionName
      }
      result.unshift(allEntry);
    }
    return result;
  }

  // For Feature
  
  public static ApplicationFeatureName(company: ApplicationFeatures) {
    switch (company) {
      case ApplicationFeatures.DepartmentMaster: return 'Department Master';
      case ApplicationFeatures.AccountingTransaction: return 'Accounting Transaction';
      case ApplicationFeatures.VendorReport: return 'Vendor Report';
      default: return '';
    }
  }

  public static ApplicationFeatureList(withAllOption: boolean = false, allOptionName: string = '<All>') {
    let result = [
      {
        Ref: ApplicationFeatures.DepartmentMaster, Name: DomainEnums.ApplicationFeatureName(ApplicationFeatures.DepartmentMaster)
      },
      {
        Ref: ApplicationFeatures.AccountingTransaction, Name: DomainEnums.ApplicationFeatureName(ApplicationFeatures.AccountingTransaction)
      },
      {
        Ref: ApplicationFeatures.VendorReport, Name: DomainEnums.ApplicationFeatureName(ApplicationFeatures.VendorReport)
      }
      
    ]
    if (withAllOption) {
      let allEntry = {
        Ref: ApplicationFeatures.None,
        Name: allOptionName
      }
      result.unshift(allEntry);
    }
    return result;
  }
  // creating a map list for Feature Group

  public static FeatureToFeatureGroupMapList(withAllOption: boolean = false, allOptionName: string = '<All>') {
    let result = [
      {
        Ref: ApplicationFeatures.DepartmentMaster,FeatureGroupRef :ApplicationFeatureGroups.Master, Name: DomainEnums.ApplicationFeatureName(ApplicationFeatures.DepartmentMaster)
      },
      {
        Ref: ApplicationFeatures.AccountingTransaction,FeatureGroupRef :ApplicationFeatureGroups.Transaction, Name: DomainEnums.ApplicationFeatureName(ApplicationFeatures.AccountingTransaction)
      },
      {
        Ref: ApplicationFeatures.VendorReport,FeatureGroupRef :ApplicationFeatureGroups.Report, Name: DomainEnums.ApplicationFeatureName(ApplicationFeatures.VendorReport)
      }
      
    ]
    if (withAllOption) {
      let allEntry = {
        Ref: ApplicationFeatures.None,
        FeatureGroupRef: ApplicationFeatureGroups.None,
        Name: allOptionName
      }
      result.unshift(allEntry);
    }
    return result;
  }


}
