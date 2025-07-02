export enum Gender {
  None = 0,
  Male = 10,
  Female = 20,
  Transgender = 30,
}

export enum MaritalStatuses {
  None = 0,
  UnMarried = 10,
  Married = 20,
  Divorced = 30,
}

export enum GoodsAndServicesTax {
  None = 0,
  Five = 5,
  Nine = 9,
  Eighteen = 18,
}

export enum BookingRemark {
  None = 0,
  Owner_Booked = 10,
  Shree_Booked = 20,
  Owner_Saledeed = 30,
  Shree_Saledeed = 40,
  Booked = 50,
}

export enum MarketingModes {
  None = 0,
  Digital = 10,
  Electronics = 20,
  Outdoor = 30,
  PrintingMedia = 40,
  AgentBoker = 50,
}

export enum Company {
  None = 0,
  Company1 = 10,
  Company2 = 20,
  Company3 = 30,
  Company4 = 40,
  FetchEntireList,
}

export enum CompanyType {
  None = 0,
  Proprietorship = 10,
  Partnership = 20,
  Pvt_ltd = 30,
  Public_Ltd = 40,
  Cooperative = 50,
}

export enum ModuleTypes {
  None = 0,
  Master = 100,
  Transaction = 200,
  Report = 300,
}

export enum ApplicationFeatureGroups {
  None = 0,
  Master = 10,
  Transaction = 20,
  Report = 30,
}

export enum SiteWorkApplicableTypes {
  None = 0,
  Submit = 100,
  InwardNo = 200,
  InwardDate = 300,
  ScrutinyFees = 400,
  YesNo = 500,
  OutwardNo = 600,
  OutwardDate = 700,
  Received = 800,
}

export enum ApplicationFeatures {
  None = 0,
  UnitMaster = 100,
  MaterialMaster = 200,
  StageMaster = 300,
  MarketingTypeMaster = 400,
  VendorServicesMaster = 500,
  VendorMaster = 600,
  BankAccountMaster = 700,
  CountryMaster = 800,
  StateMaster = 900,
  CityMaster = 1000,
  DepartmentMaster = 1100,
  DesignationMaster = 1200,
  UserRoleMaster = 1300,
  UserRoleRight = 1400,
  ExternalUserMaster = 1500,
  CompanyMaster = 1600,
  FinancialYearMaster = 1700,
  EmployeeMaster = 1800,

  AccountingTransaction = 1900,
  VendorReport = 2000,
  MaterialReport = 2100,
  EmployeeReport = 2200,
  MaterialTransaction = 2300,
}
// export enum LoginStatusModes {
//   None = 0,
//   Enable = 'true',
//   Disable = 'false',
// }

export enum ContactMode {
  None = 0,
  CustomerCalled = 10,
  ShreeCalled = 20,
  CustomerSiteVisit = 30,
  CustomerOfficeVisit = 40,
  ShreeCustomerVisit = 50,
}

export enum CustomerStatus {
  None = 0,
  Interested = 10,
  LeadInprocess = 20,
  LeadClosed = 30,
  ConvertToDeal = 40,
  // DealClosed = 50,
}

export enum Month {
  None = 0,
  January = 1,
  February = 2,
  March = 3,
  April = 4,
  May = 5,
  June = 6,
  July = 7,
  August = 8,
  September = 9,
  October = 10,
  November = 11,
  December = 12,
}

export enum LeaveRequestType {
  None = 0,
  PersonalLeave = 100,
  SickLeave = 200,
  HalfDay = 300,
}

export enum AttendanceLocationType {
  None = 0,
  Office = 100,
  Site = 200,
}

export enum AttendanceLogType {
  None = 0,
  TodaysAttendanceLog = 100,
  WeeklyAttendanceLog = 200,
  MonthlyAttendanceLog = 300,
}

export enum StageType {
  None = 0,
  Road = 100,
  HalfRoundGutterNale = 200,
  SidePattiChira = 300,
  SolarStreetLight = 400,
  OfficialExpenditure = 500,
}

export enum Unit {
  None = 0,
  RMT = 100,
  MTR = 200,
}

export enum MaterialRequisitionStatuses {
  None = 0,
  Approved = 100,
  Rejected = 200,
  Pending = 300,
  Completed = 400,
  Incomplete = 500,
  Ordered = 600,
}

export enum ModeOfPayments {
  None = 0,
  Bill = 100,
  Cash = 200,
  Cheque = 300,
  RTGS = 400,
  GpayPhonePay = 500,
}

export class DomainEnums {
  public static MarketingModeName(MarketingMode: MarketingModes) {
    switch (MarketingMode) {
      case MarketingModes.Digital:
        return 'Digital';
      case MarketingModes.Electronics:
        return 'Electronics';
      case MarketingModes.Outdoor:
        return 'Outdoor';
      case MarketingModes.PrintingMedia:
        return 'Printing Media';
      case MarketingModes.AgentBoker:
        return 'Agent/Broker';
      default:
        return '';
    }
  }

  public static MarketingModesList(
    withAllOption: boolean = false,
    allOptionName: string = '<All>'
  ) {
    let result = [
      {
        Ref: MarketingModes.Digital,
        Name: DomainEnums.MarketingModeName(MarketingModes.Digital),
      },
      {
        Ref: MarketingModes.Electronics,
        Name: DomainEnums.MarketingModeName(MarketingModes.Electronics),
      },
      {
        Ref: MarketingModes.Outdoor,
        Name: DomainEnums.MarketingModeName(MarketingModes.Outdoor),
      },
      {
        Ref: MarketingModes.PrintingMedia,
        Name: DomainEnums.MarketingModeName(MarketingModes.PrintingMedia),
      },
      {
        Ref: MarketingModes.AgentBoker,
        Name: DomainEnums.MarketingModeName(MarketingModes.AgentBoker),
      },
    ];
    if (withAllOption) {
      let allEntry = {
        Ref: MarketingModes.None,
        Name: allOptionName,
      };
      result.unshift(allEntry);
    }
    return result;
  }

  public static GenderTypeName(itemType: Gender) {
    switch (itemType) {
      case Gender.Male:
        return 'Male';
      case Gender.Female:
        return 'Female';
      case Gender.Transgender:
        return 'Transgender ';
      default:
        return '';
    }
  }

  public static GenderTypeList(
    withAllOption: boolean = false,
    allOptionName: string = '<All>'
  ) {
    let result = [
      {
        Ref: Gender.Male,
        Name: DomainEnums.GenderTypeName(Gender.Male),
      },
      {
        Ref: Gender.Female,
        Name: DomainEnums.GenderTypeName(Gender.Female),
      },
      {
        Ref: Gender.Transgender,
        Name: DomainEnums.GenderTypeName(Gender.Transgender),
      },
    ];
    if (withAllOption) {
      let allEntry = {
        Ref: Gender.None,
        Name: allOptionName,
      };
      result.unshift(allEntry);
    }
    return result;
  }

  public static MaritalStatusesName(itemType: MaritalStatuses) {
    switch (itemType) {
      case MaritalStatuses.UnMarried:
        return 'UnMarried ';
      case MaritalStatuses.Married:
        return 'Married';
      case MaritalStatuses.Divorced:
        return 'Divorced ';
      default:
        return '';
    }
  }

  public static GoodsAndServicesTaxName(itemType: GoodsAndServicesTax) {
    switch (itemType) {
      case GoodsAndServicesTax.None:
        return 'None';
      case GoodsAndServicesTax.Five:
        return '5%';
      case GoodsAndServicesTax.Nine:
        return '9%';
      case GoodsAndServicesTax.Eighteen:
        return '18%';
      default:
        return '';
    }
  }

  public static MaritalStatusesList(
    withAllOption: boolean = false,
    allOptionName: string = '<All>'
  ) {
    let result = [
      {
        Ref: MaritalStatuses.UnMarried,
        Name: DomainEnums.MaritalStatusesName(MaritalStatuses.UnMarried),
      },
      {
        Ref: MaritalStatuses.Married,
        Name: DomainEnums.MaritalStatusesName(MaritalStatuses.Married),
      },
      {
        Ref: MaritalStatuses.Divorced,
        Name: DomainEnums.MaritalStatusesName(MaritalStatuses.Divorced),
      },
    ];
    if (withAllOption) {
      let allEntry = {
        Ref: MaritalStatuses.None,
        Name: allOptionName,
      };
      result.unshift(allEntry);
    }
    return result;
  }

  public static GoodsAndServicesTaxList(
    withAllOption: boolean = false,
    allOptionName: string = '<All>'
  ) {
    let result = [
      {
        Ref: GoodsAndServicesTax.None,
        Name: DomainEnums.GoodsAndServicesTaxName(GoodsAndServicesTax.None),
      },
      {
        Ref: GoodsAndServicesTax.Five,
        Name: DomainEnums.GoodsAndServicesTaxName(GoodsAndServicesTax.Five),
      },
      {
        Ref: GoodsAndServicesTax.Nine,
        Name: DomainEnums.GoodsAndServicesTaxName(GoodsAndServicesTax.Nine),
      },
      {
        Ref: GoodsAndServicesTax.Eighteen,
        Name: DomainEnums.GoodsAndServicesTaxName(GoodsAndServicesTax.Eighteen),
      },
    ];
    if (withAllOption) {
      let allEntry = {
        Ref: GoodsAndServicesTax.None,
        Name: allOptionName,
      };
      result.unshift(allEntry);
    }
    return result;
  }

  public static BookingRemarkName(itemType: BookingRemark) {
    switch (itemType) {
      case BookingRemark.Owner_Booked:
        return 'Owner Booked ';
      case BookingRemark.Shree_Booked:
        return 'Shree Booked';
      case BookingRemark.Owner_Saledeed:
        return 'Owner Saledeed ';
      case BookingRemark.Shree_Saledeed:
        return 'Shree Saledeed ';
      case BookingRemark.Booked:
        return 'Booked ';
      default:
        return '';
    }
  }

  public static BookingRemarkList(
    withAllOption: boolean = false,
    allOptionName: string = '<All>'
  ) {
    let result = [
      {
        Ref: BookingRemark.Owner_Booked,
        Name: DomainEnums.BookingRemarkName(BookingRemark.Owner_Booked),
      },
      {
        Ref: BookingRemark.Shree_Booked,
        Name: DomainEnums.BookingRemarkName(BookingRemark.Shree_Booked),
      },
      {
        Ref: BookingRemark.Owner_Saledeed,
        Name: DomainEnums.BookingRemarkName(BookingRemark.Owner_Saledeed),
      },
      {
        Ref: BookingRemark.Shree_Saledeed,
        Name: DomainEnums.BookingRemarkName(BookingRemark.Shree_Saledeed),
      },
      {
        Ref: BookingRemark.Booked,
        Name: DomainEnums.BookingRemarkName(BookingRemark.Booked),
      },
    ];
    if (withAllOption) {
      let allEntry = {
        Ref: BookingRemark.None,
        Name: allOptionName,
      };
      result.unshift(allEntry);
    }
    return result;
  }

  public static CompanyTypeName(itemType: CompanyType) {
    switch (itemType) {
      case CompanyType.Proprietorship:
        return 'Proprietorship';
      case CompanyType.Partnership:
        return 'Partnership';
      case CompanyType.Pvt_ltd:
        return 'Pvt.ltd';
      case CompanyType.Public_Ltd:
        return 'Public Ltd';
      case CompanyType.Cooperative:
        return 'Cooperative';
      default:
        return '';
    }
  }

  public static CompanyTypeList(
    withAllOption: boolean = false,
    allOptionName: string = '<All>'
  ) {
    let result = [
      {
        Ref: CompanyType.Proprietorship,
        Name: DomainEnums.CompanyTypeName(CompanyType.Proprietorship),
      },
      {
        Ref: CompanyType.Partnership,
        Name: DomainEnums.CompanyTypeName(CompanyType.Partnership),
      },
      {
        Ref: CompanyType.Pvt_ltd,
        Name: DomainEnums.CompanyTypeName(CompanyType.Pvt_ltd),
      },
      {
        Ref: CompanyType.Public_Ltd,
        Name: DomainEnums.CompanyTypeName(CompanyType.Public_Ltd),
      },
      {
        Ref: CompanyType.Cooperative,
        Name: DomainEnums.CompanyTypeName(CompanyType.Cooperative),
      },
    ];
    if (withAllOption) {
      let allEntry = {
        Ref: CompanyType.None,
        Name: allOptionName,
      };
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
      case Company.Company1:
        return 'Company1';
      case Company.Company2:
        return 'Company2';
      case Company.Company3:
        return 'Company3';
      case Company.Company4:
        return 'Company4';
      default:
        return '';
    }
  }

  public static CompanyList(
    withAllOption: boolean = false,
    allOptionName: string = '<All>'
  ) {
    let result = [
      {
        Ref: Company.Company1,
        Name: DomainEnums.CompanyName(Company.Company1),
      },
      {
        Ref: Company.Company2,
        Name: DomainEnums.CompanyName(Company.Company2),
      },
      {
        Ref: Company.Company3,
        Name: DomainEnums.CompanyName(Company.Company3),
      },
      {
        Ref: Company.Company4,
        Name: DomainEnums.CompanyName(Company.Company4),
      },
    ];
    if (withAllOption) {
      let allEntry = {
        Ref: Company.None,
        Name: allOptionName,
      };
      result.unshift(allEntry);
    }
    return result;
  }

  // User Role Rights
  public static ModuleName(company: ModuleTypes) {
    switch (company) {
      case ModuleTypes.Master:
        return 'Masters';
      case ModuleTypes.Transaction:
        return 'Transactions';
      case ModuleTypes.Report:
        return 'Reports';
      default:
        return '';
    }
  }

  public static ModuleList(
    withAllOption: boolean = false,
    allOptionName: string = '<All>'
  ) {
    let result = [
      {
        Ref: ModuleTypes.Master,
        Name: DomainEnums.ModuleName(ModuleTypes.Master),
      },
      {
        Ref: ModuleTypes.Transaction,
        Name: DomainEnums.ModuleName(ModuleTypes.Transaction),
      },
      {
        Ref: ModuleTypes.Report,
        Name: DomainEnums.ModuleName(ModuleTypes.Report),
      },
    ];
    if (withAllOption) {
      let allEntry = {
        Ref: ModuleTypes.None,
        Name: allOptionName,
      };
      result.unshift(allEntry);
    }
    return result;
  }

  // For Feature Group

  public static ApplicationFeatureGroupName(
    ApplicationFeature: ApplicationFeatureGroups
  ) {
    switch (ApplicationFeature) {
      case ApplicationFeatureGroups.Master:
        return 'Masters';
      case ApplicationFeatureGroups.Transaction:
        return 'Transactions';
      case ApplicationFeatureGroups.Report:
        return 'Reports';
      default:
        return '';
    }
  }

  public static ApplicationFeatureGroupList(
    withAllOption: boolean = false,
    allOptionName: string = '<All>'
  ) {
    let result = [
      {
        Ref: ApplicationFeatureGroups.Master,
        Name: DomainEnums.ApplicationFeatureGroupName(
          ApplicationFeatureGroups.Master
        ),
      },
      {
        Ref: ApplicationFeatureGroups.Transaction,
        Name: DomainEnums.ApplicationFeatureGroupName(
          ApplicationFeatureGroups.Transaction
        ),
      },
      {
        Ref: ApplicationFeatureGroups.Report,
        Name: DomainEnums.ApplicationFeatureGroupName(
          ApplicationFeatureGroups.Report
        ),
      },
    ];
    if (withAllOption) {
      let allEntry = {
        Ref: ApplicationFeatureGroups.None,
        Name: allOptionName,
      };
      result.unshift(allEntry);
    }
    return result;
  }

  public static ApplicableTypesForSiteName(
    ApplicableTypesForSite: SiteWorkApplicableTypes
  ) {
    switch (ApplicableTypesForSite) {
      case SiteWorkApplicableTypes.Submit:
        return 'Submit';
      case SiteWorkApplicableTypes.InwardDate:
        return 'InwardDate';
      case SiteWorkApplicableTypes.InwardNo:
        return 'InwardNo';
      case SiteWorkApplicableTypes.ScrutinyFees:
        return 'ScrutinyFees';
      case SiteWorkApplicableTypes.YesNo:
        return 'YesNo';
      case SiteWorkApplicableTypes.OutwardDate:
        return 'OutwardDate';
      case SiteWorkApplicableTypes.OutwardNo:
        return 'OutwardNo';
      case SiteWorkApplicableTypes.Received:
        return 'Received ';
      default:
        return '';
    }
  }

  public static ApplicableTypesForSiteList(
    withAllOption: boolean = false,
    allOptionName: string = '<All>'
  ) {
    let result = [
      {
        Ref: SiteWorkApplicableTypes.Submit,
        Name: DomainEnums.ApplicableTypesForSiteName(
          SiteWorkApplicableTypes.Submit
        ),
      },
      {
        Ref: SiteWorkApplicableTypes.InwardNo,
        Name: DomainEnums.ApplicableTypesForSiteName(
          SiteWorkApplicableTypes.InwardNo
        ),
      },
      {
        Ref: SiteWorkApplicableTypes.InwardDate,
        Name: DomainEnums.ApplicableTypesForSiteName(
          SiteWorkApplicableTypes.InwardDate
        ),
      },
      {
        Ref: SiteWorkApplicableTypes.ScrutinyFees,
        Name: DomainEnums.ApplicableTypesForSiteName(
          SiteWorkApplicableTypes.ScrutinyFees
        ),
      },
      {
        Ref: SiteWorkApplicableTypes.YesNo,
        Name: DomainEnums.ApplicableTypesForSiteName(
          SiteWorkApplicableTypes.YesNo
        ),
      },
      {
        Ref: SiteWorkApplicableTypes.OutwardNo,
        Name: DomainEnums.ApplicableTypesForSiteName(
          SiteWorkApplicableTypes.OutwardNo
        ),
      },
      {
        Ref: SiteWorkApplicableTypes.OutwardDate,
        Name: DomainEnums.ApplicableTypesForSiteName(
          SiteWorkApplicableTypes.OutwardDate
        ),
      },
      {
        Ref: SiteWorkApplicableTypes.Received,
        Name: DomainEnums.ApplicableTypesForSiteName(
          SiteWorkApplicableTypes.Received
        ),
      },
    ];
    if (withAllOption) {
      let allEntry = {
        Ref: SiteWorkApplicableTypes.None,
        Name: allOptionName,
      };
      result.unshift(allEntry);
    }
    return result;
  }

  // For Feature

  public static ApplicationFeatureName(
    ApplicationFeature: ApplicationFeatures
  ) {
    switch (ApplicationFeature) {
      case ApplicationFeatures.UnitMaster:
        return 'Unit Master';
      case ApplicationFeatures.MaterialMaster:
        return 'Material Master';
      case ApplicationFeatures.StageMaster:
        return 'Stage Master';
      case ApplicationFeatures.MarketingTypeMaster:
        return 'Marketing Type Master';
      case ApplicationFeatures.VendorServicesMaster:
        return 'Vendor Services Master';
      case ApplicationFeatures.VendorMaster:
        return 'Vendor Master';
      case ApplicationFeatures.BankAccountMaster:
        return 'Bank Account Master';
      case ApplicationFeatures.CountryMaster:
        return 'Country Master';
      case ApplicationFeatures.StateMaster:
        return 'State Master';
      case ApplicationFeatures.CityMaster:
        return 'City Master';
      case ApplicationFeatures.DepartmentMaster:
        return 'Department Master';
      case ApplicationFeatures.DesignationMaster:
        return 'Designation Master';
      case ApplicationFeatures.UserRoleMaster:
        return 'User Role Master';
      case ApplicationFeatures.UserRoleRight:
        return 'User Role Right Master';
      case ApplicationFeatures.ExternalUserMaster:
        return 'External User Master';
      case ApplicationFeatures.CompanyMaster:
        return 'Company Master';
      case ApplicationFeatures.FinancialYearMaster:
        return 'Financial Year Master';
      case ApplicationFeatures.EmployeeMaster:
        return 'Employee Master';

      case ApplicationFeatures.AccountingTransaction:
        return 'Accounting Transaction';
      case ApplicationFeatures.MaterialTransaction:
        return 'Material Transaction';

      case ApplicationFeatures.VendorReport:
        return 'Vendor Report';
      case ApplicationFeatures.EmployeeReport:
        return 'Employee Report';
      default:
        return '';
    }
  }

  public static ApplicationFeatureList(
    withAllOption: boolean = false,
    allOptionName: string = '<All>'
  ) {
    let result = [
      {
        Ref: ApplicationFeatures.UnitMaster,
        Name: DomainEnums.ApplicationFeatureName(
          ApplicationFeatures.UnitMaster
        ),
      },
      {
        Ref: ApplicationFeatures.MaterialMaster,
        Name: DomainEnums.ApplicationFeatureName(
          ApplicationFeatures.MaterialMaster
        ),
      },

      // New Start

      {
        Ref: ApplicationFeatures.StageMaster,
        Name: DomainEnums.ApplicationFeatureName(
          ApplicationFeatures.StageMaster
        ),
      },
      {
        Ref: ApplicationFeatures.MarketingTypeMaster,
        Name: DomainEnums.ApplicationFeatureName(
          ApplicationFeatures.MarketingTypeMaster
        ),
      },
      {
        Ref: ApplicationFeatures.VendorServicesMaster,
        Name: DomainEnums.ApplicationFeatureName(
          ApplicationFeatures.VendorServicesMaster
        ),
      },
      {
        Ref: ApplicationFeatures.VendorMaster,
        Name: DomainEnums.ApplicationFeatureName(
          ApplicationFeatures.VendorMaster
        ),
      },
      {
        Ref: ApplicationFeatures.DepartmentMaster,
        Name: DomainEnums.ApplicationFeatureName(
          ApplicationFeatures.DepartmentMaster
        ),
      },
      {
        Ref: ApplicationFeatures.DesignationMaster,
        Name: DomainEnums.ApplicationFeatureName(
          ApplicationFeatures.DesignationMaster
        ),
      },
      {
        Ref: ApplicationFeatures.UserRoleMaster,
        Name: DomainEnums.ApplicationFeatureName(
          ApplicationFeatures.UserRoleMaster
        ),
      },
      {
        Ref: ApplicationFeatures.UserRoleRight,
        Name: DomainEnums.ApplicationFeatureName(
          ApplicationFeatures.UserRoleRight
        ),
      },

      {
        Ref: ApplicationFeatures.ExternalUserMaster,
        Name: DomainEnums.ApplicationFeatureName(
          ApplicationFeatures.ExternalUserMaster
        ),
      },
      {
        Ref: ApplicationFeatures.CompanyMaster,
        Name: DomainEnums.ApplicationFeatureName(
          ApplicationFeatures.CompanyMaster
        ),
      },
      {
        Ref: ApplicationFeatures.FinancialYearMaster,
        Name: DomainEnums.ApplicationFeatureName(
          ApplicationFeatures.FinancialYearMaster
        ),
      },
      {
        Ref: ApplicationFeatures.EmployeeMaster,
        Name: DomainEnums.ApplicationFeatureName(
          ApplicationFeatures.EmployeeMaster
        ),
      },

      // New End

      // for transaction
      {
        Ref: ApplicationFeatures.AccountingTransaction,
        Name: DomainEnums.ApplicationFeatureName(
          ApplicationFeatures.AccountingTransaction
        ),
      },
      {
        Ref: ApplicationFeatures.MaterialTransaction,
        Name: DomainEnums.ApplicationFeatureName(
          ApplicationFeatures.MaterialTransaction
        ),
      },
      // For Report
      {
        Ref: ApplicationFeatures.EmployeeReport,
        Name: DomainEnums.ApplicationFeatureName(
          ApplicationFeatures.EmployeeReport
        ),
      },
      {
        Ref: ApplicationFeatures.VendorReport,
        Name: DomainEnums.ApplicationFeatureName(
          ApplicationFeatures.VendorReport
        ),
      },
    ];
    if (withAllOption) {
      let allEntry = {
        Ref: ApplicationFeatures.None,
        Name: allOptionName,
      };
      result.unshift(allEntry);
    }
    return result;
  }
  // creating a map list for Feature Group

  public static FeatureToFeatureGroupMapList(
    withAllOption: boolean = false,
    allOptionName: string = '<All>'
  ) {
    let result = [
      {
        Ref: ApplicationFeatures.UnitMaster,
        FeatureGroupRef: ApplicationFeatureGroups.Master,
        Name: DomainEnums.ApplicationFeatureName(
          ApplicationFeatures.UnitMaster
        ),
      },
      {
        Ref: ApplicationFeatures.MaterialMaster,
        FeatureGroupRef: ApplicationFeatureGroups.Master,
        Name: DomainEnums.ApplicationFeatureName(
          ApplicationFeatures.MaterialMaster
        ),
      },

      // New start
      {
        Ref: ApplicationFeatures.StageMaster,
        FeatureGroupRef: ApplicationFeatureGroups.Master,
        Name: DomainEnums.ApplicationFeatureName(
          ApplicationFeatures.StageMaster
        ),
      },
      {
        Ref: ApplicationFeatures.MarketingTypeMaster,
        FeatureGroupRef: ApplicationFeatureGroups.Master,
        Name: DomainEnums.ApplicationFeatureName(
          ApplicationFeatures.MarketingTypeMaster
        ),
      },
      {
        Ref: ApplicationFeatures.VendorServicesMaster,
        FeatureGroupRef: ApplicationFeatureGroups.Master,
        Name: DomainEnums.ApplicationFeatureName(
          ApplicationFeatures.VendorServicesMaster
        ),
      },
      {
        Ref: ApplicationFeatures.VendorMaster,
        FeatureGroupRef: ApplicationFeatureGroups.Master,
        Name: DomainEnums.ApplicationFeatureName(
          ApplicationFeatures.VendorMaster
        ),
      },
      {
        Ref: ApplicationFeatures.DepartmentMaster,
        FeatureGroupRef: ApplicationFeatureGroups.Master,
        Name: DomainEnums.ApplicationFeatureName(
          ApplicationFeatures.DepartmentMaster
        ),
      },
      {
        Ref: ApplicationFeatures.DesignationMaster,
        FeatureGroupRef: ApplicationFeatureGroups.Master,
        Name: DomainEnums.ApplicationFeatureName(
          ApplicationFeatures.DesignationMaster
        ),
      },
      {
        Ref: ApplicationFeatures.UserRoleMaster,
        FeatureGroupRef: ApplicationFeatureGroups.Master,
        Name: DomainEnums.ApplicationFeatureName(
          ApplicationFeatures.UserRoleMaster
        ),
      },
      {
        Ref: ApplicationFeatures.UserRoleRight,
        FeatureGroupRef: ApplicationFeatureGroups.Master,
        Name: DomainEnums.ApplicationFeatureName(
          ApplicationFeatures.UserRoleRight
        ),
      },

      {
        Ref: ApplicationFeatures.ExternalUserMaster,
        FeatureGroupRef: ApplicationFeatureGroups.Master,
        Name: DomainEnums.ApplicationFeatureName(
          ApplicationFeatures.ExternalUserMaster
        ),
      },
      {
        Ref: ApplicationFeatures.CompanyMaster,
        FeatureGroupRef: ApplicationFeatureGroups.Master,
        Name: DomainEnums.ApplicationFeatureName(
          ApplicationFeatures.CompanyMaster
        ),
      },
      {
        Ref: ApplicationFeatures.FinancialYearMaster,
        FeatureGroupRef: ApplicationFeatureGroups.Master,
        Name: DomainEnums.ApplicationFeatureName(
          ApplicationFeatures.FinancialYearMaster
        ),
      },
      {
        Ref: ApplicationFeatures.EmployeeMaster,
        FeatureGroupRef: ApplicationFeatureGroups.Master,
        Name: DomainEnums.ApplicationFeatureName(
          ApplicationFeatures.EmployeeMaster
        ),
      },

      // New End

      {
        Ref: ApplicationFeatures.AccountingTransaction,
        FeatureGroupRef: ApplicationFeatureGroups.Transaction,
        Name: DomainEnums.ApplicationFeatureName(
          ApplicationFeatures.AccountingTransaction
        ),
      },
      {
        Ref: ApplicationFeatures.MaterialTransaction,
        FeatureGroupRef: ApplicationFeatureGroups.Transaction,
        Name: DomainEnums.ApplicationFeatureName(
          ApplicationFeatures.MaterialTransaction
        ),
      },
      {
        Ref: ApplicationFeatures.EmployeeReport,
        FeatureGroupRef: ApplicationFeatureGroups.Report,
        Name: DomainEnums.ApplicationFeatureName(
          ApplicationFeatures.EmployeeReport
        ),
      },
      {
        Ref: ApplicationFeatures.VendorReport,
        FeatureGroupRef: ApplicationFeatureGroups.Report,
        Name: DomainEnums.ApplicationFeatureName(
          ApplicationFeatures.VendorReport
        ),
      },
    ];
    if (withAllOption) {
      let allEntry = {
        Ref: ApplicationFeatures.None,
        FeatureGroupRef: ApplicationFeatureGroups.None,
        Name: allOptionName,
      };
      result.unshift(allEntry);
    }
    return result;
  }

  public static ContactModeName(itemType: ContactMode) {
    switch (itemType) {
      case ContactMode.CustomerCalled:
        return 'Customer Called';
      case ContactMode.ShreeCalled:
        return 'Shree Called';
      case ContactMode.CustomerSiteVisit:
        return 'Customer Site Visit';
      case ContactMode.CustomerOfficeVisit:
        return 'Customer Office Visit';
      case ContactMode.ShreeCustomerVisit:
        return 'Shree Customer Visit';
      default:
        return '';
    }
  }

  public static ContactModeList(
    withAllOption: boolean = false,
    allOptionName: string = '<All>'
  ) {
    let result = [
      {
        Ref: ContactMode.CustomerCalled,
        Name: DomainEnums.ContactModeName(ContactMode.CustomerCalled),
      },
      {
        Ref: ContactMode.ShreeCalled,
        Name: DomainEnums.ContactModeName(ContactMode.ShreeCalled),
      },
      {
        Ref: ContactMode.CustomerSiteVisit,
        Name: DomainEnums.ContactModeName(ContactMode.CustomerSiteVisit),
      },
      {
        Ref: ContactMode.CustomerOfficeVisit,
        Name: DomainEnums.ContactModeName(ContactMode.CustomerOfficeVisit),
      },
      {
        Ref: ContactMode.ShreeCustomerVisit,
        Name: DomainEnums.ContactModeName(ContactMode.ShreeCustomerVisit),
      },
    ];
    if (withAllOption) {
      let allEntry = {
        Ref: ContactMode.None,
        Name: allOptionName,
      };
      result.unshift(allEntry);
    }
    return result;
  }

  public static CustomerStatusName(itemType: CustomerStatus) {
    switch (itemType) {
      case CustomerStatus.Interested:
        return 'Interested';
      case CustomerStatus.LeadInprocess:
        return 'Lead Inprocess';
      case CustomerStatus.LeadClosed:
        return 'Lead Closed';
      case CustomerStatus.ConvertToDeal:
        return 'Convert To Deal';
      // case CustomerStatus.DealClosed: return 'Deal Closed';
      default:
        return '';
    }
  }

  public static CustomerStatusList(
    withAllOption: boolean = false,
    allOptionName: string = '<All>'
  ) {
    let result = [
      {
        Ref: CustomerStatus.Interested,
        Name: DomainEnums.CustomerStatusName(CustomerStatus.Interested),
      },
      {
        Ref: CustomerStatus.LeadInprocess,
        Name: DomainEnums.CustomerStatusName(CustomerStatus.LeadInprocess),
      },
      {
        Ref: CustomerStatus.LeadClosed,
        Name: DomainEnums.CustomerStatusName(CustomerStatus.LeadClosed),
      },
      {
        Ref: CustomerStatus.ConvertToDeal,
        Name: DomainEnums.CustomerStatusName(CustomerStatus.ConvertToDeal),
      },
      // {
      //   Ref: CustomerStatus.DealClosed, Name: DomainEnums.CustomerStatusName(CustomerStatus.DealClosed)
      // }
    ];
    if (withAllOption) {
      let allEntry = {
        Ref: CustomerStatus.None,
        Name: allOptionName,
      };
      result.unshift(allEntry);
    }
    return result;
  }

  public static MonthName(itemType: Month) {
    switch (itemType) {
      case Month.January:
        return 'January';
      case Month.February:
        return 'February';
      case Month.March:
        return 'March';
      case Month.April:
        return 'April';
      case Month.May:
        return 'May';
      case Month.June:
        return 'June';
      case Month.July:
        return 'July';
      case Month.August:
        return 'August';
      case Month.September:
        return 'September';
      case Month.October:
        return 'October';
      case Month.November:
        return 'November';
      case Month.December:
        return 'December';
      default:
        return '';
    }
  }

  // public static MonthList(withAllOption: boolean = false, allOptionName: string = '<All>') {
  //   let result = [
  //     {
  //       Ref: Month.January, Name: DomainEnums.MonthName(Month.January)
  //     },
  //     {
  //       Ref: Month.February, Name: DomainEnums.MonthName(Month.February)
  //     },
  //     {
  //       Ref: Month.March, Name: DomainEnums.MonthName(Month.March)
  //     },
  //     {
  //       Ref: Month.April, Name: DomainEnums.MonthName(Month.April)
  //     },
  //     {
  //       Ref: Month.May, Name: DomainEnums.MonthName(Month.May)
  //     },
  //     {
  //       Ref: Month.June, Name: DomainEnums.MonthName(Month.June)
  //     },
  //     {
  //       Ref: Month.July, Name: DomainEnums.MonthName(Month.July)
  //     },
  //     {
  //       Ref: Month.August, Name: DomainEnums.MonthName(Month.August)
  //     },
  //     {
  //       Ref: Month.September, Name: DomainEnums.MonthName(Month.September)
  //     },
  //     {
  //       Ref: Month.October, Name: DomainEnums.MonthName(Month.October)
  //     },
  //     {
  //       Ref: Month.November, Name: DomainEnums.MonthName(Month.November)
  //     },
  //     {
  //       Ref: Month.December, Name: DomainEnums.MonthName(Month.December)
  //     }

  //   ]
  //   if (withAllOption) {
  //     let allEntry = {
  //       Ref: Month.None,
  //       Name: allOptionName
  //     }
  //     result.unshift(allEntry);
  //   }
  //   return result;
  // }

  public static MonthList(
    withAllOption: boolean = false,
    allOptionName: string = '<All>',
    year: number = new Date().getFullYear()
  ) {
    const getDaysInMonth = (month: Month, year: number): number => {
      if (month === Month.None) return 0;
      return new Date(year, month, 0).getDate(); // Date(year, monthIndex + 1, 0) returns last day of the month
    };

    let result = Object.values(Month)
      .filter((value) => typeof value === 'number' && value !== Month.None)
      .map((month: Month) => ({
        Ref: month,
        Name: DomainEnums.MonthName(month),
        Days: getDaysInMonth(month, year),
      }));

    if (withAllOption) {
      let allEntry = {
        Ref: Month.None,
        Name: allOptionName,
        Days: 0,
      };
      result.unshift(allEntry);
    }

    return result;
  }

  public static LeaveRequestTypeName(itemType: LeaveRequestType) {
    switch (itemType) {
      case LeaveRequestType.PersonalLeave:
        return 'Personal Leave';
      case LeaveRequestType.SickLeave:
        return 'Sick Leave';
      case LeaveRequestType.HalfDay:
        return 'Half Day';
      default:
        return '';
    }
  }

  public static LeaveRequestTypeList(
    withAllOption: boolean = false,
    allOptionName: string = '<All>'
  ) {
    let result = [
      {
        Ref: LeaveRequestType.PersonalLeave,
        Name: DomainEnums.LeaveRequestTypeName(LeaveRequestType.PersonalLeave),
      },
      {
        Ref: LeaveRequestType.SickLeave,
        Name: DomainEnums.LeaveRequestTypeName(LeaveRequestType.SickLeave),
      },
      {
        Ref: LeaveRequestType.HalfDay,
        Name: DomainEnums.LeaveRequestTypeName(LeaveRequestType.HalfDay),
      },
    ];
    if (withAllOption) {
      let allEntry = {
        Ref: LeaveRequestType.None,
        Name: allOptionName,
      };
      result.unshift(allEntry);
    }
    return result;
  }

  public static AttendanceLocationTypeName(itemType: AttendanceLocationType) {
    switch (itemType) {
      case AttendanceLocationType.Office:
        return 'Office';
      case AttendanceLocationType.Site:
        return 'Site';
      default:
        return '';
    }
  }

  public static AttendanceLocationTypeList(
    withAllOption: boolean = false,
    allOptionName: string = '<All>'
  ) {
    let result = [
      {
        Ref: AttendanceLocationType.Office,
        Name: DomainEnums.AttendanceLocationTypeName(
          AttendanceLocationType.Office
        ),
      },
      {
        Ref: AttendanceLocationType.Site,
        Name: DomainEnums.AttendanceLocationTypeName(
          AttendanceLocationType.Site
        ),
      },
    ];
    if (withAllOption) {
      let allEntry = {
        Ref: AttendanceLocationType.None,
        Name: allOptionName,
      };
      result.unshift(allEntry);
    }
    return result;
  }

  // Attendance log type
  public static AttendanceLogName(itemType: AttendanceLogType) {
    switch (itemType) {
      case AttendanceLogType.TodaysAttendanceLog:
        return 'Todays Attendance Log';
      case AttendanceLogType.WeeklyAttendanceLog:
        return 'Weekly Attendance Log';
      case AttendanceLogType.MonthlyAttendanceLog:
        return 'Monthly Attendance Log';
      default:
        return '';
    }
  }
  // Attendance log type
  public static AttendanceLogNameMobileApp(itemType: AttendanceLogType) {
    switch (itemType) {
      case AttendanceLogType.TodaysAttendanceLog:
        return 'Todays';
      case AttendanceLogType.WeeklyAttendanceLog:
        return 'This Week';
      case AttendanceLogType.MonthlyAttendanceLog:
        return 'This Month';
      default:
        return '';
    }
  }

  public static AttendanceLogTypeList(
    withAllOption: boolean = false,
    allOptionName: string = '<All>'
  ) {
    let result = [
      {
        Ref: AttendanceLogType.TodaysAttendanceLog,
        Name: DomainEnums.AttendanceLogName(
          AttendanceLogType.TodaysAttendanceLog
        ),
      },
      {
        Ref: AttendanceLogType.WeeklyAttendanceLog,
        Name: DomainEnums.AttendanceLogName(
          AttendanceLogType.WeeklyAttendanceLog
        ),
      },
      {
        Ref: AttendanceLogType.MonthlyAttendanceLog,
        Name: DomainEnums.AttendanceLogName(
          AttendanceLogType.MonthlyAttendanceLog
        ),
      },
    ];
    if (withAllOption) {
      let allEntry = {
        Ref: AttendanceLogType.None,
        Name: allOptionName,
      };
      result.unshift(allEntry);
    }
    return result;
  }
  public static AttendanceLogTypeMobileAppList(
    withAllOption: boolean = false,
    allOptionName: string = '<All>'
  ) {
    let result = [
      {
        Ref: AttendanceLogType.TodaysAttendanceLog,
        Name: DomainEnums.AttendanceLogNameMobileApp(
          AttendanceLogType.TodaysAttendanceLog
        ),
      },
      {
        Ref: AttendanceLogType.WeeklyAttendanceLog,
        Name: DomainEnums.AttendanceLogNameMobileApp(
          AttendanceLogType.WeeklyAttendanceLog
        ),
      },
      {
        Ref: AttendanceLogType.MonthlyAttendanceLog,
        Name: DomainEnums.AttendanceLogNameMobileApp(
          AttendanceLogType.MonthlyAttendanceLog
        ),
      },
    ];
    if (withAllOption) {
      let allEntry = {
        Ref: AttendanceLogType.None,
        Name: allOptionName,
      };
      result.unshift(allEntry);
    }
    return result;
  }

  public static StageTypeName(itemType: StageType) {
    switch (itemType) {
      case StageType.Road:
        return 'Road';
      case StageType.HalfRoundGutterNale:
        return 'Half Round Gutter Nale';
      case StageType.SidePattiChira:
        return 'Side Patti Chira';
      case StageType.SolarStreetLight:
        return 'Solar Street Light';
      case StageType.OfficialExpenditure:
        return 'Official Expenditure';
      default:
        return '';
    }
  }

  public static StageTypeList(
    withAllOption: boolean = false,
    allOptionName: string = '<All>'
  ) {
    let result = [
      {
        Ref: StageType.Road,
        Name: DomainEnums.StageTypeName(StageType.Road),
      },
      {
        Ref: StageType.HalfRoundGutterNale,
        Name: DomainEnums.StageTypeName(StageType.HalfRoundGutterNale),
      },
      {
        Ref: StageType.SidePattiChira,
        Name: DomainEnums.StageTypeName(StageType.SidePattiChira),
      },
      {
        Ref: StageType.SolarStreetLight,
        Name: DomainEnums.StageTypeName(StageType.SolarStreetLight),
      },
      {
        Ref: StageType.OfficialExpenditure,
        Name: DomainEnums.StageTypeName(StageType.OfficialExpenditure),
      },
    ];
    if (withAllOption) {
      let allEntry = {
        Ref: StageType.None,
        Name: allOptionName,
      };
      result.unshift(allEntry);
    }
    return result;
  }

  public static UnitName(itemType: Unit) {
    switch (itemType) {
      case Unit.RMT:
        return 'RMT';
      case Unit.MTR:
        return 'MTR';
      default:
        return '';
    }
  }

  public static UnitList(
    withAllOption: boolean = false,
    allOptionName: string = '<All>'
  ) {
    let result = [
      {
        Ref: Unit.RMT,
        Name: DomainEnums.UnitName(Unit.RMT),
      },
      {
        Ref: Unit.MTR,
        Name: DomainEnums.UnitName(Unit.MTR),
      },
    ];
    if (withAllOption) {
      let allEntry = {
        Ref: Unit.None,
        Name: allOptionName,
      };
      result.unshift(allEntry);
    }
    return result;
  }

  public static MaterialRequisitionStatusesName(itemType: MaterialRequisitionStatuses) {
    switch (itemType) {
      case MaterialRequisitionStatuses.Approved:
        return 'Approved';
      case MaterialRequisitionStatuses.Rejected:
        return 'Rejected';
      case MaterialRequisitionStatuses.Pending:
        return 'Pending';
      case MaterialRequisitionStatuses.Completed:
        return 'Completed';
      case MaterialRequisitionStatuses.Incomplete:
        return 'Incomplete';
      case MaterialRequisitionStatuses.Ordered:
        return 'Ordered';
      default:
        return '';
    }
  }

  public static MaterialRequisitionStatusesList(
    withAllOption: boolean = false,
    allOptionName: string = '<All>'
  ) {
    let result = [
      {
        Ref: MaterialRequisitionStatuses.Approved,
        Name: DomainEnums.MaterialRequisitionStatusesName(MaterialRequisitionStatuses.Approved),
      },
      {
        Ref: MaterialRequisitionStatuses.Rejected,
        Name: DomainEnums.MaterialRequisitionStatusesName(MaterialRequisitionStatuses.Rejected),
      },
      {
        Ref: MaterialRequisitionStatuses.Pending,
        Name: DomainEnums.MaterialRequisitionStatusesName(MaterialRequisitionStatuses.Pending),
      },
      {
        Ref: MaterialRequisitionStatuses.Completed,
        Name: DomainEnums.MaterialRequisitionStatusesName(MaterialRequisitionStatuses.Completed),
      },
      {
        Ref: MaterialRequisitionStatuses.Incomplete,
        Name: DomainEnums.MaterialRequisitionStatusesName(MaterialRequisitionStatuses.Incomplete),
      },
      {
        Ref: MaterialRequisitionStatuses.Ordered,
        Name: DomainEnums.MaterialRequisitionStatusesName(MaterialRequisitionStatuses.Ordered),
      },
    ];
    if (withAllOption) {
      let allEntry = {
        Ref: MaterialRequisitionStatuses.None,
        Name: allOptionName,
      };
      result.unshift(allEntry);
    }
    return result;
  }

  public static ModeOfPaymentsName(itemType: ModeOfPayments) {
    switch (itemType) {
      case ModeOfPayments.Bill:
        return 'Bill';
      case ModeOfPayments.Cash:
        return 'Cash';
      case ModeOfPayments.Cheque:
        return 'Cheque';
      case ModeOfPayments.RTGS:
        return 'RTGS';
      case ModeOfPayments.GpayPhonePay:
        return 'GpayPhonePay';
      default:
        return '';
    }
  }

  public static ModeOfPaymentsList(
    withAllOption: boolean = false,
    allOptionName: string = '<All>'
  ) {
    let result = [
      {
        Ref: ModeOfPayments.Bill,
        Name: DomainEnums.ModeOfPaymentsName(ModeOfPayments.Bill),
      },
      {
        Ref: ModeOfPayments.Cash,
        Name: DomainEnums.ModeOfPaymentsName(ModeOfPayments.Cash),
      },
      {
        Ref: ModeOfPayments.Cheque,
        Name: DomainEnums.ModeOfPaymentsName(ModeOfPayments.Cheque),
      },
      {
        Ref: ModeOfPayments.RTGS,
        Name: DomainEnums.ModeOfPaymentsName(ModeOfPayments.RTGS),
      },
      {
        Ref: ModeOfPayments.GpayPhonePay,
        Name: DomainEnums.ModeOfPaymentsName(ModeOfPayments.GpayPhonePay),
      }
    ];
    if (withAllOption) {
      let allEntry = {
        Ref: ModeOfPayments.None,
        Name: allOptionName,
      };
      result.unshift(allEntry);
    }
    return result;
  }
}
