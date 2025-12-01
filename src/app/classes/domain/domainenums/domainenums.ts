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

export enum BookingRemarks {
  None = 0,
  Plot_Of_Owner = 10,
  Plot_Of_Shree = 20,
  Owner_Booked = 30,
  Shree_Booked = 40,
  Owner_Saledeed = 50,
  Shree_Saledeed = 60,
  Booked = 70,
}

export enum MarketingModes {
  None = 0,
  Digital = 10,
  Electronics = 20,
  Outdoor = 30,
  PrintingMedia = 40,
  AgentBoker = 50,
  Self = 60,
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
  SubmitToTahsildar = 900,
  SubmitToUpadhaykshaAndBhumiAdhilekh = 1000,
}

export enum ApplicationFeatures {
  None = 0,

  // ---------- MASTERS ----------
  CompanyMaster = 100,
  OwnerMaster = 110,
  DepartmentMaster = 120,
  DesignationMaster = 130,
  UserRoleRightMaster = 140,
  EmployeeMaster = 150,
  BankAccountMaster = 160,
  OpeningBalanceMaster = 170,
  FinancialYearMaster = 180,
  MainLedgerMaster = 190,
  SubLedgerMaster = 200,
  StageMaster = 210,
  UnitMaster = 220,
  MaterialMaster = 230,
  VendorServicesMaster = 240,
  VendorMaster = 250,
  RecipientMaster = 260,
  PayerMaster = 270,

  // ---------- TRANSACTIONS ----------
  NewSite = 300,
  PlotDetails = 310,

  MaterialRequisition = 320,
  StockOrder = 330,
  StockInward = 340,
  StockConsume = 350,
  StockTransfer = 360,
  StockSummary = 370,

  GovProgressReport = 380,
  DocumentList = 390,

  CustomerEnquiry = 400,
  CustomerFollowUp = 410,
  PendingFollowUp = 420,
  RegisteredCustomer = 430,
  CustomerSummary = 440,
  CustomerInfo = 450,
  CustomerVisitReport = 460,
  DealCancelledCustomer = 470,
  PaymentHistoryReport = 480,

  RegistrarOffice = 490,

  EmployeeAttendance = 500,
  EmployeeLeaveRequest = 510,
  EmployeeSalarySlipRequest = 520,

  OfficeDutyTime = 530,
  HRAttendance = 540,
  SalaryGeneration = 550,
  LeaveApproval = 560,
  SalarySlipApproval = 570,
  EmployeeOvertime = 580,
  CompanyHolidays = 590,

  Billing = 600,
  Expense = 610,
  Income = 620,
  OfficeReport = 630,
  BillPayableReport = 640,
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

export enum AccountingReports {
  None = 0,
  All = 100,
  CurrentFinancialYear = 200,
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

export enum TypeOfEmployeePayments {
  None = 0,
  Advance = 100,
  Salary = 200,
  Other = 300,
}

export enum OpeningBalanceModeOfPayments {
  None = 0,
  Cash = 100,
  Cheque = 200,
}

export enum ExpenseTypes {
  None = 0,
  MachinaryExpense = 105,
  LabourExpense = 110,
  OtherExpense = 115,
  StockExpense = 120,
  MultipleExpense = 125,
}

export enum LabourTypes {
  None = 0,
  SkillLabour = 510,
  UnskillLabour = 515,
  WomenLabour = 520,
}

export enum RecipientTypes {
  None = 0,
  Recipient = 100,
  Vendor = 200,
  DealCancelledCustomer = 300,
  Employee = 400,
  Sites = 500,
  Owner = 600,
}

export enum PayerTypes {
  None = 0,
  Payers = 100,
  Vendor = 200,
  DealDoneCustomer = 300,
  Employee = 400,
  Sites = 500,
  Owner = 600,
}

export enum CustomerProgress {
  None = 0,
  OnGoingCustomer = 100,
  DealCancelCustomer = 200,
  DealDoneCustomer = 300,
  LeadClosedCustomer = 400,
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
      case MarketingModes.Self:
        return 'Self';
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
      {
        Ref: MarketingModes.Self,
        Name: DomainEnums.MarketingModeName(MarketingModes.Self),
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

  public static BookingRemarksName(itemType: BookingRemarks) {
    switch (itemType) {
      case BookingRemarks.Plot_Of_Owner:
        return 'Plot of Owner';
      case BookingRemarks.Plot_Of_Shree:
        return 'Plot of Shree';
      case BookingRemarks.Owner_Booked:
        return 'Owner Booked';
      case BookingRemarks.Shree_Booked:
        return 'Shree Booked';
      case BookingRemarks.Owner_Saledeed:
        return 'Owner Saledeed';
      case BookingRemarks.Shree_Saledeed:
        return 'Shree Saledeed';
      case BookingRemarks.Booked:
        return 'Booked';
      default:
        return '';
    }
  }

  public static BookingRemarksList(
    withAllOption: boolean = false,
    allOptionName: string = '<All>'
  ) {
    let result = [
      {
        Ref: BookingRemarks.Plot_Of_Owner,
        Name: DomainEnums.BookingRemarksName(BookingRemarks.Plot_Of_Owner),
      },
      {
        Ref: BookingRemarks.Plot_Of_Shree,
        Name: DomainEnums.BookingRemarksName(BookingRemarks.Plot_Of_Shree),
      },
      {
        Ref: BookingRemarks.Owner_Booked,
        Name: DomainEnums.BookingRemarksName(BookingRemarks.Owner_Booked),
      },
      {
        Ref: BookingRemarks.Shree_Booked,
        Name: DomainEnums.BookingRemarksName(BookingRemarks.Shree_Booked),
      },
      {
        Ref: BookingRemarks.Owner_Saledeed,
        Name: DomainEnums.BookingRemarksName(BookingRemarks.Owner_Saledeed),
      },
      {
        Ref: BookingRemarks.Shree_Saledeed,
        Name: DomainEnums.BookingRemarksName(BookingRemarks.Shree_Saledeed),
      },
      {
        Ref: BookingRemarks.Booked,
        Name: DomainEnums.BookingRemarksName(BookingRemarks.Booked),
      },
    ];
    if (withAllOption) {
      let allEntry = {
        Ref: BookingRemarks.None,
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
        return 'Inward Date';
      case SiteWorkApplicableTypes.InwardNo:
        return 'Inward No';
      case SiteWorkApplicableTypes.ScrutinyFees:
        return 'Scrutiny Fees';
      case SiteWorkApplicableTypes.YesNo:
        return 'Yes No';
      case SiteWorkApplicableTypes.OutwardDate:
        return 'Outward Date';
      case SiteWorkApplicableTypes.OutwardNo:
        return 'Outward No';
      case SiteWorkApplicableTypes.Received:
        return 'Received ';
      case SiteWorkApplicableTypes.SubmitToTahsildar:
        return 'Submit to तहसीलदार';
      case SiteWorkApplicableTypes.SubmitToUpadhaykshaAndBhumiAdhilekh:
        return 'Submit to उपाधीक्षक & भूमी अधिलेख ';
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
      {
        Ref: SiteWorkApplicableTypes.SubmitToTahsildar,
        Name: DomainEnums.ApplicableTypesForSiteName(
          SiteWorkApplicableTypes.SubmitToTahsildar
        ),
      },
      {
        Ref: SiteWorkApplicableTypes.SubmitToUpadhaykshaAndBhumiAdhilekh,
        Name: DomainEnums.ApplicableTypesForSiteName(
          SiteWorkApplicableTypes.SubmitToUpadhaykshaAndBhumiAdhilekh
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
  public static ApplicationFeatureName(feature: ApplicationFeatures) {
    switch (feature) {
      // -------- Masters ----------
      case ApplicationFeatures.CompanyMaster:
        return 'Company Master';
      case ApplicationFeatures.OwnerMaster:
        return 'Owner Master';
      case ApplicationFeatures.DepartmentMaster:
        return 'Department Master';
      case ApplicationFeatures.DesignationMaster:
        return 'Designation Master';
      case ApplicationFeatures.UserRoleRightMaster:
        return 'User Role Right Master';
      case ApplicationFeatures.EmployeeMaster:
        return 'Employee Master';
      case ApplicationFeatures.BankAccountMaster:
        return 'Bank Account Master';
      case ApplicationFeatures.OpeningBalanceMaster:
        return 'Opening Balance Master';
      case ApplicationFeatures.FinancialYearMaster:
        return 'Financial Year Master';
      case ApplicationFeatures.MainLedgerMaster:
        return 'Main Ledger Master';
      case ApplicationFeatures.SubLedgerMaster:
        return 'Sub Ledger Master';
      case ApplicationFeatures.StageMaster:
        return 'Stage Master';
      case ApplicationFeatures.UnitMaster:
        return 'Unit Master';
      case ApplicationFeatures.MaterialMaster:
        return 'Material Master';
      case ApplicationFeatures.VendorServicesMaster:
        return 'Vendor Services Master';
      case ApplicationFeatures.VendorMaster:
        return 'Vendor Master';
      case ApplicationFeatures.RecipientMaster:
        return 'Recipient Master';
      case ApplicationFeatures.PayerMaster:
        return 'Payer Master';

      // -------- Transactions ----------
      case ApplicationFeatures.NewSite:
        return 'New Site';
      case ApplicationFeatures.PlotDetails:
        return 'Plot Details';

      case ApplicationFeatures.MaterialRequisition:
        return 'Material Requisition';
      case ApplicationFeatures.StockOrder:
        return 'Stock Order';
      case ApplicationFeatures.StockInward:
        return 'Stock Inward';
      case ApplicationFeatures.StockConsume:
        return 'Stock Consume';
      case ApplicationFeatures.StockTransfer:
        return 'Stock Transfer';
      case ApplicationFeatures.StockSummary:
        return 'Stock Summary';

      case ApplicationFeatures.GovProgressReport:
        return 'Gov Progress Report';
      case ApplicationFeatures.DocumentList:
        return 'Document List';

      case ApplicationFeatures.CustomerEnquiry:
        return 'Customer Enquiry';
      case ApplicationFeatures.CustomerFollowUp:
        return 'Customer Follow Up';
      case ApplicationFeatures.PendingFollowUp:
        return 'Pending Follow Up';
      case ApplicationFeatures.RegisteredCustomer:
        return 'Registered Customer';
      case ApplicationFeatures.CustomerSummary:
        return 'Customer Summary';
      case ApplicationFeatures.CustomerInfo:
        return 'Customer Info';
      case ApplicationFeatures.CustomerVisitReport:
        return 'Customer Visit Report';
      case ApplicationFeatures.DealCancelledCustomer:
        return 'Deal Cancelled Customer';
      case ApplicationFeatures.PaymentHistoryReport:
        return 'Payment History Report';

      case ApplicationFeatures.RegistrarOffice:
        return 'Registrar Office';

      case ApplicationFeatures.EmployeeAttendance:
        return 'Employee Attendance';
      case ApplicationFeatures.EmployeeLeaveRequest:
        return 'Employee Leave Request';
      case ApplicationFeatures.EmployeeSalarySlipRequest:
        return 'Salary Slip Request';

      case ApplicationFeatures.OfficeDutyTime:
        return 'Office Duty & Time';
      case ApplicationFeatures.HRAttendance:
        return 'HR Attendance';
      case ApplicationFeatures.SalaryGeneration:
        return 'Salary Generation';
      case ApplicationFeatures.LeaveApproval:
        return 'Leave Approval';
      case ApplicationFeatures.SalarySlipApproval:
        return 'Salary Slip Approval';
      case ApplicationFeatures.EmployeeOvertime:
        return 'Employee Overtime';
      case ApplicationFeatures.CompanyHolidays:
        return 'Company Holidays';

      case ApplicationFeatures.Billing:
        return 'Billing';
      case ApplicationFeatures.Expense:
        return 'Expense';
      case ApplicationFeatures.Income:
        return 'Income';
      case ApplicationFeatures.OfficeReport:
        return 'Office Report';
      case ApplicationFeatures.BillPayableReport:
        return 'Bill Payable Report';

      default:
        return '';
    }
  }

  public static ApplicationFeatureList(
    withAllOption: boolean = false,
    allOptionName: string = '<All>'
  ) {
    let result = [
      // Masters
      {
        Ref: ApplicationFeatures.CompanyMaster,
        Name: this.ApplicationFeatureName(ApplicationFeatures.CompanyMaster),
      },
      {
        Ref: ApplicationFeatures.OwnerMaster,
        Name: this.ApplicationFeatureName(ApplicationFeatures.OwnerMaster),
      },
      {
        Ref: ApplicationFeatures.DepartmentMaster,
        Name: this.ApplicationFeatureName(ApplicationFeatures.DepartmentMaster),
      },
      {
        Ref: ApplicationFeatures.DesignationMaster,
        Name: this.ApplicationFeatureName(
          ApplicationFeatures.DesignationMaster
        ),
      },
      {
        Ref: ApplicationFeatures.UserRoleRightMaster,
        Name: this.ApplicationFeatureName(
          ApplicationFeatures.UserRoleRightMaster
        ),
      },
      {
        Ref: ApplicationFeatures.EmployeeMaster,
        Name: this.ApplicationFeatureName(ApplicationFeatures.EmployeeMaster),
      },
      {
        Ref: ApplicationFeatures.BankAccountMaster,
        Name: this.ApplicationFeatureName(
          ApplicationFeatures.BankAccountMaster
        ),
      },
      {
        Ref: ApplicationFeatures.OpeningBalanceMaster,
        Name: this.ApplicationFeatureName(
          ApplicationFeatures.OpeningBalanceMaster
        ),
      },
      {
        Ref: ApplicationFeatures.FinancialYearMaster,
        Name: this.ApplicationFeatureName(
          ApplicationFeatures.FinancialYearMaster
        ),
      },
      {
        Ref: ApplicationFeatures.MainLedgerMaster,
        Name: this.ApplicationFeatureName(ApplicationFeatures.MainLedgerMaster),
      },
      {
        Ref: ApplicationFeatures.SubLedgerMaster,
        Name: this.ApplicationFeatureName(ApplicationFeatures.SubLedgerMaster),
      },
      {
        Ref: ApplicationFeatures.StageMaster,
        Name: this.ApplicationFeatureName(ApplicationFeatures.StageMaster),
      },
      {
        Ref: ApplicationFeatures.UnitMaster,
        Name: this.ApplicationFeatureName(ApplicationFeatures.UnitMaster),
      },
      {
        Ref: ApplicationFeatures.MaterialMaster,
        Name: this.ApplicationFeatureName(ApplicationFeatures.MaterialMaster),
      },
      {
        Ref: ApplicationFeatures.VendorServicesMaster,
        Name: this.ApplicationFeatureName(
          ApplicationFeatures.VendorServicesMaster
        ),
      },
      {
        Ref: ApplicationFeatures.VendorMaster,
        Name: this.ApplicationFeatureName(ApplicationFeatures.VendorMaster),
      },
      {
        Ref: ApplicationFeatures.RecipientMaster,
        Name: this.ApplicationFeatureName(ApplicationFeatures.RecipientMaster),
      },
      {
        Ref: ApplicationFeatures.PayerMaster,
        Name: this.ApplicationFeatureName(ApplicationFeatures.PayerMaster),
      },

      // Transactions
      {
        Ref: ApplicationFeatures.NewSite,
        Name: this.ApplicationFeatureName(ApplicationFeatures.NewSite),
      },
      {
        Ref: ApplicationFeatures.PlotDetails,
        Name: this.ApplicationFeatureName(ApplicationFeatures.PlotDetails),
      },

      // Inventory
      {
        Ref: ApplicationFeatures.MaterialRequisition,
        Name: this.ApplicationFeatureName(
          ApplicationFeatures.MaterialRequisition
        ),
      },
      {
        Ref: ApplicationFeatures.StockOrder,
        Name: this.ApplicationFeatureName(ApplicationFeatures.StockOrder),
      },
      {
        Ref: ApplicationFeatures.StockInward,
        Name: this.ApplicationFeatureName(ApplicationFeatures.StockInward),
      },
      {
        Ref: ApplicationFeatures.StockConsume,
        Name: this.ApplicationFeatureName(ApplicationFeatures.StockConsume),
      },
      {
        Ref: ApplicationFeatures.StockTransfer,
        Name: this.ApplicationFeatureName(ApplicationFeatures.StockTransfer),
      },
      {
        Ref: ApplicationFeatures.StockSummary,
        Name: this.ApplicationFeatureName(ApplicationFeatures.StockSummary),
      },

      // Government
      {
        Ref: ApplicationFeatures.GovProgressReport,
        Name: this.ApplicationFeatureName(
          ApplicationFeatures.GovProgressReport
        ),
      },
      {
        Ref: ApplicationFeatures.DocumentList,
        Name: this.ApplicationFeatureName(ApplicationFeatures.DocumentList),
      },

      // Customer
      {
        Ref: ApplicationFeatures.CustomerEnquiry,
        Name: this.ApplicationFeatureName(ApplicationFeatures.CustomerEnquiry),
      },
      {
        Ref: ApplicationFeatures.CustomerFollowUp,
        Name: this.ApplicationFeatureName(ApplicationFeatures.CustomerFollowUp),
      },
      {
        Ref: ApplicationFeatures.PendingFollowUp,
        Name: this.ApplicationFeatureName(ApplicationFeatures.PendingFollowUp),
      },
      {
        Ref: ApplicationFeatures.RegisteredCustomer,
        Name: this.ApplicationFeatureName(
          ApplicationFeatures.RegisteredCustomer
        ),
      },
      {
        Ref: ApplicationFeatures.CustomerSummary,
        Name: this.ApplicationFeatureName(ApplicationFeatures.CustomerSummary),
      },
      {
        Ref: ApplicationFeatures.CustomerInfo,
        Name: this.ApplicationFeatureName(ApplicationFeatures.CustomerInfo),
      },
      {
        Ref: ApplicationFeatures.CustomerVisitReport,
        Name: this.ApplicationFeatureName(
          ApplicationFeatures.CustomerVisitReport
        ),
      },
      {
        Ref: ApplicationFeatures.DealCancelledCustomer,
        Name: this.ApplicationFeatureName(
          ApplicationFeatures.DealCancelledCustomer
        ),
      },
      {
        Ref: ApplicationFeatures.PaymentHistoryReport,
        Name: this.ApplicationFeatureName(
          ApplicationFeatures.PaymentHistoryReport
        ),
      },

      // Registrar office
      {
        Ref: ApplicationFeatures.RegistrarOffice,
        Name: this.ApplicationFeatureName(ApplicationFeatures.RegistrarOffice),
      },

      // HR
      {
        Ref: ApplicationFeatures.EmployeeAttendance,
        Name: this.ApplicationFeatureName(
          ApplicationFeatures.EmployeeAttendance
        ),
      },
      {
        Ref: ApplicationFeatures.EmployeeLeaveRequest,
        Name: this.ApplicationFeatureName(
          ApplicationFeatures.EmployeeLeaveRequest
        ),
      },
      {
        Ref: ApplicationFeatures.EmployeeSalarySlipRequest,
        Name: this.ApplicationFeatureName(
          ApplicationFeatures.EmployeeSalarySlipRequest
        ),
      },
      {
        Ref: ApplicationFeatures.OfficeDutyTime,
        Name: this.ApplicationFeatureName(ApplicationFeatures.OfficeDutyTime),
      },
      {
        Ref: ApplicationFeatures.HRAttendance,
        Name: this.ApplicationFeatureName(ApplicationFeatures.HRAttendance),
      },
      {
        Ref: ApplicationFeatures.SalaryGeneration,
        Name: this.ApplicationFeatureName(ApplicationFeatures.SalaryGeneration),
      },
      {
        Ref: ApplicationFeatures.LeaveApproval,
        Name: this.ApplicationFeatureName(ApplicationFeatures.LeaveApproval),
      },
      {
        Ref: ApplicationFeatures.SalarySlipApproval,
        Name: this.ApplicationFeatureName(
          ApplicationFeatures.SalarySlipApproval
        ),
      },
      {
        Ref: ApplicationFeatures.EmployeeOvertime,
        Name: this.ApplicationFeatureName(ApplicationFeatures.EmployeeOvertime),
      },
      {
        Ref: ApplicationFeatures.CompanyHolidays,
        Name: this.ApplicationFeatureName(ApplicationFeatures.CompanyHolidays),
      },

      // Billing
      {
        Ref: ApplicationFeatures.Billing,
        Name: this.ApplicationFeatureName(ApplicationFeatures.Billing),
      },
      {
        Ref: ApplicationFeatures.Expense,
        Name: this.ApplicationFeatureName(ApplicationFeatures.Expense),
      },
      {
        Ref: ApplicationFeatures.Income,
        Name: this.ApplicationFeatureName(ApplicationFeatures.Income),
      },
      {
        Ref: ApplicationFeatures.OfficeReport,
        Name: this.ApplicationFeatureName(ApplicationFeatures.OfficeReport),
      },
      {
        Ref: ApplicationFeatures.BillPayableReport,
        Name: this.ApplicationFeatureName(
          ApplicationFeatures.BillPayableReport
        ),
      },
    ];

    if (withAllOption) {
      result.unshift({ Ref: ApplicationFeatures.None, Name: allOptionName });
    }

    return result;
  }

  // creating a map list for Feature Group
  public static FeatureToFeatureGroupMapList(
    withAllOption: boolean = false,
    allOptionName: string = '<All>'
  ) {
    let result = [
      // -------------------- MASTER --------------------
      {
        Ref: ApplicationFeatures.CompanyMaster,
        FeatureGroupRef: ApplicationFeatureGroups.Master,
        Name: this.ApplicationFeatureName(ApplicationFeatures.CompanyMaster),
      },
      {
        Ref: ApplicationFeatures.OwnerMaster,
        FeatureGroupRef: ApplicationFeatureGroups.Master,
        Name: this.ApplicationFeatureName(ApplicationFeatures.OwnerMaster),
      },
      {
        Ref: ApplicationFeatures.DepartmentMaster,
        FeatureGroupRef: ApplicationFeatureGroups.Master,
        Name: this.ApplicationFeatureName(ApplicationFeatures.DepartmentMaster),
      },
      {
        Ref: ApplicationFeatures.DesignationMaster,
        FeatureGroupRef: ApplicationFeatureGroups.Master,
        Name: this.ApplicationFeatureName(
          ApplicationFeatures.DesignationMaster
        ),
      },
      {
        Ref: ApplicationFeatures.UserRoleRightMaster,
        FeatureGroupRef: ApplicationFeatureGroups.Master,
        Name: this.ApplicationFeatureName(
          ApplicationFeatures.UserRoleRightMaster
        ),
      },
      {
        Ref: ApplicationFeatures.EmployeeMaster,
        FeatureGroupRef: ApplicationFeatureGroups.Master,
        Name: this.ApplicationFeatureName(ApplicationFeatures.EmployeeMaster),
      },
      {
        Ref: ApplicationFeatures.BankAccountMaster,
        FeatureGroupRef: ApplicationFeatureGroups.Master,
        Name: this.ApplicationFeatureName(
          ApplicationFeatures.BankAccountMaster
        ),
      },
      {
        Ref: ApplicationFeatures.OpeningBalanceMaster,
        FeatureGroupRef: ApplicationFeatureGroups.Master,
        Name: this.ApplicationFeatureName(
          ApplicationFeatures.OpeningBalanceMaster
        ),
      },
      {
        Ref: ApplicationFeatures.FinancialYearMaster,
        FeatureGroupRef: ApplicationFeatureGroups.Master,
        Name: this.ApplicationFeatureName(
          ApplicationFeatures.FinancialYearMaster
        ),
      },
      {
        Ref: ApplicationFeatures.MainLedgerMaster,
        FeatureGroupRef: ApplicationFeatureGroups.Master,
        Name: this.ApplicationFeatureName(ApplicationFeatures.MainLedgerMaster),
      },
      {
        Ref: ApplicationFeatures.SubLedgerMaster,
        FeatureGroupRef: ApplicationFeatureGroups.Master,
        Name: this.ApplicationFeatureName(ApplicationFeatures.SubLedgerMaster),
      },
      {
        Ref: ApplicationFeatures.StageMaster,
        FeatureGroupRef: ApplicationFeatureGroups.Master,
        Name: this.ApplicationFeatureName(ApplicationFeatures.StageMaster),
      },
      {
        Ref: ApplicationFeatures.UnitMaster,
        FeatureGroupRef: ApplicationFeatureGroups.Master,
        Name: this.ApplicationFeatureName(ApplicationFeatures.UnitMaster),
      },
      {
        Ref: ApplicationFeatures.MaterialMaster,
        FeatureGroupRef: ApplicationFeatureGroups.Master,
        Name: this.ApplicationFeatureName(ApplicationFeatures.MaterialMaster),
      },
      {
        Ref: ApplicationFeatures.VendorServicesMaster,
        FeatureGroupRef: ApplicationFeatureGroups.Master,
        Name: this.ApplicationFeatureName(
          ApplicationFeatures.VendorServicesMaster
        ),
      },
      {
        Ref: ApplicationFeatures.VendorMaster,
        FeatureGroupRef: ApplicationFeatureGroups.Master,
        Name: this.ApplicationFeatureName(ApplicationFeatures.VendorMaster),
      },
      {
        Ref: ApplicationFeatures.RecipientMaster,
        FeatureGroupRef: ApplicationFeatureGroups.Master,
        Name: this.ApplicationFeatureName(ApplicationFeatures.RecipientMaster),
      },
      {
        Ref: ApplicationFeatures.PayerMaster,
        FeatureGroupRef: ApplicationFeatureGroups.Master,
        Name: this.ApplicationFeatureName(ApplicationFeatures.PayerMaster),
      },

      // -------------------- TRANSACTION --------------------
      {
        Ref: ApplicationFeatures.NewSite,
        FeatureGroupRef: ApplicationFeatureGroups.Transaction,
        Name: this.ApplicationFeatureName(ApplicationFeatures.NewSite),
      },
      {
        Ref: ApplicationFeatures.PlotDetails,
        FeatureGroupRef: ApplicationFeatureGroups.Transaction,
        Name: this.ApplicationFeatureName(ApplicationFeatures.PlotDetails),
      },

      // -------------------- INVENTORY --------------------
      {
        Ref: ApplicationFeatures.MaterialRequisition,
        FeatureGroupRef: ApplicationFeatureGroups.Transaction,
        Name: this.ApplicationFeatureName(
          ApplicationFeatures.MaterialRequisition
        ),
      },
      {
        Ref: ApplicationFeatures.StockOrder,
        FeatureGroupRef: ApplicationFeatureGroups.Transaction,
        Name: this.ApplicationFeatureName(ApplicationFeatures.StockOrder),
      },
      {
        Ref: ApplicationFeatures.StockInward,
        FeatureGroupRef: ApplicationFeatureGroups.Transaction,
        Name: this.ApplicationFeatureName(ApplicationFeatures.StockInward),
      },
      {
        Ref: ApplicationFeatures.StockConsume,
        FeatureGroupRef: ApplicationFeatureGroups.Transaction,
        Name: this.ApplicationFeatureName(ApplicationFeatures.StockConsume),
      },
      {
        Ref: ApplicationFeatures.StockTransfer,
        FeatureGroupRef: ApplicationFeatureGroups.Transaction,
        Name: this.ApplicationFeatureName(ApplicationFeatures.StockTransfer),
      },
      {
        Ref: ApplicationFeatures.StockSummary,
        FeatureGroupRef: ApplicationFeatureGroups.Report,
        Name: this.ApplicationFeatureName(ApplicationFeatures.StockSummary),
      },

      // -------------------- GOVERNMENT REPORT --------------------
      {
        Ref: ApplicationFeatures.GovProgressReport,
        FeatureGroupRef: ApplicationFeatureGroups.Transaction,
        Name: this.ApplicationFeatureName(
          ApplicationFeatures.GovProgressReport
        ),
      },
      {
        Ref: ApplicationFeatures.DocumentList,
        FeatureGroupRef: ApplicationFeatureGroups.Transaction,
        Name: this.ApplicationFeatureName(ApplicationFeatures.DocumentList),
      },

      // -------------------- CUSTOMER --------------------
      {
        Ref: ApplicationFeatures.CustomerEnquiry,
        FeatureGroupRef: ApplicationFeatureGroups.Transaction,
        Name: this.ApplicationFeatureName(ApplicationFeatures.CustomerEnquiry),
      },
      {
        Ref: ApplicationFeatures.CustomerFollowUp,
        FeatureGroupRef: ApplicationFeatureGroups.Transaction,
        Name: this.ApplicationFeatureName(ApplicationFeatures.CustomerFollowUp),
      },
      {
        Ref: ApplicationFeatures.PendingFollowUp,
        FeatureGroupRef: ApplicationFeatureGroups.Transaction,
        Name: this.ApplicationFeatureName(ApplicationFeatures.PendingFollowUp),
      },
      {
        Ref: ApplicationFeatures.RegisteredCustomer,
        FeatureGroupRef: ApplicationFeatureGroups.Transaction,
        Name: this.ApplicationFeatureName(
          ApplicationFeatures.RegisteredCustomer
        ),
      },
      {
        Ref: ApplicationFeatures.CustomerSummary,
        FeatureGroupRef: ApplicationFeatureGroups.Report,
        Name: this.ApplicationFeatureName(ApplicationFeatures.CustomerSummary),
      },
      {
        Ref: ApplicationFeatures.CustomerInfo,
        FeatureGroupRef: ApplicationFeatureGroups.Report,
        Name: this.ApplicationFeatureName(ApplicationFeatures.CustomerInfo),
      },
      {
        Ref: ApplicationFeatures.CustomerVisitReport,
        FeatureGroupRef: ApplicationFeatureGroups.Report,
        Name: this.ApplicationFeatureName(
          ApplicationFeatures.CustomerVisitReport
        ),
      },
      {
        Ref: ApplicationFeatures.DealCancelledCustomer,
        FeatureGroupRef: ApplicationFeatureGroups.Report,
        Name: this.ApplicationFeatureName(
          ApplicationFeatures.DealCancelledCustomer
        ),
      },
      {
        Ref: ApplicationFeatures.PaymentHistoryReport,
        FeatureGroupRef: ApplicationFeatureGroups.Report,
        Name: this.ApplicationFeatureName(
          ApplicationFeatures.PaymentHistoryReport
        ),
      },

      // -------------------- REGISTRAR OFFICE --------------------
      {
        Ref: ApplicationFeatures.RegistrarOffice,
        FeatureGroupRef: ApplicationFeatureGroups.Transaction,
        Name: this.ApplicationFeatureName(ApplicationFeatures.RegistrarOffice),
      },

      // -------------------- HR --------------------
      {
        Ref: ApplicationFeatures.EmployeeAttendance,
        FeatureGroupRef: ApplicationFeatureGroups.Transaction,
        Name: this.ApplicationFeatureName(
          ApplicationFeatures.EmployeeAttendance
        ),
      },
      {
        Ref: ApplicationFeatures.EmployeeLeaveRequest,
        FeatureGroupRef: ApplicationFeatureGroups.Transaction,
        Name: this.ApplicationFeatureName(
          ApplicationFeatures.EmployeeLeaveRequest
        ),
      },
      {
        Ref: ApplicationFeatures.EmployeeSalarySlipRequest,
        FeatureGroupRef: ApplicationFeatureGroups.Transaction,
        Name: this.ApplicationFeatureName(
          ApplicationFeatures.EmployeeSalarySlipRequest
        ),
      },
      {
        Ref: ApplicationFeatures.OfficeDutyTime,
        FeatureGroupRef: ApplicationFeatureGroups.Master,
        Name: this.ApplicationFeatureName(ApplicationFeatures.OfficeDutyTime),
      },
      {
        Ref: ApplicationFeatures.HRAttendance,
        FeatureGroupRef: ApplicationFeatureGroups.Transaction,
        Name: this.ApplicationFeatureName(ApplicationFeatures.HRAttendance),
      },
      {
        Ref: ApplicationFeatures.SalaryGeneration,
        FeatureGroupRef: ApplicationFeatureGroups.Transaction,
        Name: this.ApplicationFeatureName(ApplicationFeatures.SalaryGeneration),
      },
      {
        Ref: ApplicationFeatures.LeaveApproval,
        FeatureGroupRef: ApplicationFeatureGroups.Transaction,
        Name: this.ApplicationFeatureName(ApplicationFeatures.LeaveApproval),
      },
      {
        Ref: ApplicationFeatures.SalarySlipApproval,
        FeatureGroupRef: ApplicationFeatureGroups.Transaction,
        Name: this.ApplicationFeatureName(
          ApplicationFeatures.SalarySlipApproval
        ),
      },
      {
        Ref: ApplicationFeatures.EmployeeOvertime,
        FeatureGroupRef: ApplicationFeatureGroups.Transaction,
        Name: this.ApplicationFeatureName(ApplicationFeatures.EmployeeOvertime),
      },
      {
        Ref: ApplicationFeatures.CompanyHolidays,
        FeatureGroupRef: ApplicationFeatureGroups.Transaction,
        Name: this.ApplicationFeatureName(ApplicationFeatures.CompanyHolidays),
      },

      // -------------------- BILLING --------------------
      {
        Ref: ApplicationFeatures.Billing,
        FeatureGroupRef: ApplicationFeatureGroups.Transaction,
        Name: this.ApplicationFeatureName(ApplicationFeatures.Billing),
      },
      {
        Ref: ApplicationFeatures.Expense,
        FeatureGroupRef: ApplicationFeatureGroups.Transaction,
        Name: this.ApplicationFeatureName(ApplicationFeatures.Expense),
      },
      {
        Ref: ApplicationFeatures.Income,
        FeatureGroupRef: ApplicationFeatureGroups.Transaction,
        Name: this.ApplicationFeatureName(ApplicationFeatures.Income),
      },
      {
        Ref: ApplicationFeatures.OfficeReport,
        FeatureGroupRef: ApplicationFeatureGroups.Report,
        Name: this.ApplicationFeatureName(ApplicationFeatures.OfficeReport),
      },
      {
        Ref: ApplicationFeatures.BillPayableReport,
        FeatureGroupRef: ApplicationFeatureGroups.Report,
        Name: this.ApplicationFeatureName(
          ApplicationFeatures.BillPayableReport
        ),
      },
    ];

    if (withAllOption) {
      result.unshift({
        Ref: ApplicationFeatures.None,
        FeatureGroupRef: ApplicationFeatureGroups.None,
        Name: allOptionName,
      });
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

  public static MaterialRequisitionStatusesName(
    itemType: MaterialRequisitionStatuses
  ) {
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
        Name: DomainEnums.MaterialRequisitionStatusesName(
          MaterialRequisitionStatuses.Approved
        ),
      },
      {
        Ref: MaterialRequisitionStatuses.Rejected,
        Name: DomainEnums.MaterialRequisitionStatusesName(
          MaterialRequisitionStatuses.Rejected
        ),
      },
      {
        Ref: MaterialRequisitionStatuses.Pending,
        Name: DomainEnums.MaterialRequisitionStatusesName(
          MaterialRequisitionStatuses.Pending
        ),
      },
      {
        Ref: MaterialRequisitionStatuses.Completed,
        Name: DomainEnums.MaterialRequisitionStatusesName(
          MaterialRequisitionStatuses.Completed
        ),
      },
      {
        Ref: MaterialRequisitionStatuses.Incomplete,
        Name: DomainEnums.MaterialRequisitionStatusesName(
          MaterialRequisitionStatuses.Incomplete
        ),
      },
      {
        Ref: MaterialRequisitionStatuses.Ordered,
        Name: DomainEnums.MaterialRequisitionStatusesName(
          MaterialRequisitionStatuses.Ordered
        ),
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
        return 'Bank';
      case ModeOfPayments.RTGS:
        return 'RTGS';
      case ModeOfPayments.GpayPhonePay:
        return 'Gpay/PhonePay';
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
      },
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

  public static TypeOfEmployeePaymentsName(itemType: TypeOfEmployeePayments) {
    switch (itemType) {
      case TypeOfEmployeePayments.Advance:
        return 'Advance';
      case TypeOfEmployeePayments.Salary:
        return 'Salary';
      case TypeOfEmployeePayments.Other:
        return 'Other';
      default:
        return '';
    }
  }

  public static TypeOfEmployeePaymentsList(
    withAllOption: boolean = false,
    allOptionName: string = '<All>'
  ) {
    let result = [
      {
        Ref: TypeOfEmployeePayments.Advance,
        Name: DomainEnums.TypeOfEmployeePaymentsName(
          TypeOfEmployeePayments.Advance
        ),
      },
      {
        Ref: TypeOfEmployeePayments.Salary,
        Name: DomainEnums.TypeOfEmployeePaymentsName(
          TypeOfEmployeePayments.Salary
        ),
      },
      {
        Ref: TypeOfEmployeePayments.Other,
        Name: DomainEnums.TypeOfEmployeePaymentsName(
          TypeOfEmployeePayments.Other
        ),
      },
    ];
    if (withAllOption) {
      let allEntry = {
        Ref: TypeOfEmployeePayments.None,
        Name: allOptionName,
      };
      result.unshift(allEntry);
    }
    return result;
  }

  public static OpeningBalanceModeOfPaymentsName(
    itemType: OpeningBalanceModeOfPayments
  ) {
    switch (itemType) {
      case OpeningBalanceModeOfPayments.Cash:
        return 'Cash';
      case OpeningBalanceModeOfPayments.Cheque:
        return 'Bank';
      default:
        return '';
    }
  }

  public static OpeningBalanceModeOfPaymentsList(
    withAllOption: boolean = false,
    allOptionName: string = '<All>'
  ) {
    let result = [
      {
        Ref: OpeningBalanceModeOfPayments.Cash,
        Name: DomainEnums.OpeningBalanceModeOfPaymentsName(
          OpeningBalanceModeOfPayments.Cash
        ),
      },
      {
        Ref: OpeningBalanceModeOfPayments.Cheque,
        Name: DomainEnums.OpeningBalanceModeOfPaymentsName(
          OpeningBalanceModeOfPayments.Cheque
        ),
      },
    ];
    if (withAllOption) {
      let allEntry = {
        Ref: OpeningBalanceModeOfPayments.None,
        Name: allOptionName,
      };
      result.unshift(allEntry);
    }
    return result;
  }

  public static AccountingReportName(itemType: AccountingReports) {
    switch (itemType) {
      case AccountingReports.All:
        return 'All';
      case AccountingReports.CurrentFinancialYear:
        return 'Current Financial Year';
      default:
        return '';
    }
  }

  public static AccountingReportList(
    withAllOption: boolean = false,
    allOptionName: string = '<All>'
  ) {
    let result = [
      {
        Ref: AccountingReports.All,
        Name: DomainEnums.AccountingReportName(AccountingReports.All),
      },
      {
        Ref: AccountingReports.CurrentFinancialYear,
        Name: DomainEnums.AccountingReportName(
          AccountingReports.CurrentFinancialYear
        ),
      },
    ];
    if (withAllOption) {
      let allEntry = {
        Ref: AccountingReports.None,
        Name: allOptionName,
      };
      result.unshift(allEntry);
    }
    return result;
  }

  public static ExpenseTypeName(itemType: ExpenseTypes) {
    switch (itemType) {
      case ExpenseTypes.MachinaryExpense:
        return 'Machinary Expense';
      case ExpenseTypes.LabourExpense:
        return 'Labour Expense';
      case ExpenseTypes.StockExpense:
        return 'Stock Expense';
      case ExpenseTypes.OtherExpense:
        return 'Other Expense';
      case ExpenseTypes.MultipleExpense:
        return 'Multiple Expense';
      default:
        return '';
    }
  }

  public static ExpenseTypeList(
    withAllOption: boolean = false,
    allOptionName: string = '<All>'
  ) {
    let result = [
      {
        Ref: ExpenseTypes.MachinaryExpense,
        Name: DomainEnums.ExpenseTypeName(ExpenseTypes.MachinaryExpense),
      },
      {
        Ref: ExpenseTypes.LabourExpense,
        Name: DomainEnums.ExpenseTypeName(ExpenseTypes.LabourExpense),
      },
      {
        Ref: ExpenseTypes.StockExpense,
        Name: DomainEnums.ExpenseTypeName(ExpenseTypes.StockExpense),
      },
      {
        Ref: ExpenseTypes.OtherExpense,
        Name: DomainEnums.ExpenseTypeName(ExpenseTypes.OtherExpense),
      },
      {
        Ref: ExpenseTypes.MultipleExpense,
        Name: DomainEnums.ExpenseTypeName(ExpenseTypes.MultipleExpense),
      },
    ];
    if (withAllOption) {
      let allEntry = {
        Ref: ExpenseTypes.None,
        Name: allOptionName,
      };
      result.unshift(allEntry);
    }
    return result;
  }

  public static LabourTypesName(itemType: LabourTypes) {
    switch (itemType) {
      case LabourTypes.SkillLabour:
        return 'Skilled Labour';
      case LabourTypes.UnskillLabour:
        return 'Unskilled Labour';
      case LabourTypes.WomenLabour:
        return 'Women Labour';
      default:
        return '';
    }
  }

  public static LabourTypesList(
    withAllOption: boolean = false,
    allOptionName: string = '<All>'
  ) {
    let result = [
      {
        Ref: LabourTypes.SkillLabour,
        Name: DomainEnums.LabourTypesName(LabourTypes.SkillLabour),
      },
      {
        Ref: LabourTypes.UnskillLabour,
        Name: DomainEnums.LabourTypesName(LabourTypes.UnskillLabour),
      },
      {
        Ref: LabourTypes.WomenLabour,
        Name: DomainEnums.LabourTypesName(LabourTypes.WomenLabour),
      },
    ];
    if (withAllOption) {
      let allEntry = {
        Ref: LabourTypes.None,
        Name: allOptionName,
      };
      result.unshift(allEntry);
    }
    return result;
  }

  public static RecipientTypesName(itemType: RecipientTypes) {
    switch (itemType) {
      case RecipientTypes.Recipient:
        return 'Recipient';
      case RecipientTypes.Vendor:
        return 'Vendor';
      case RecipientTypes.DealCancelledCustomer:
        return 'Deal Cancelled Customer';
      case RecipientTypes.Employee:
        return 'Employee';
      case RecipientTypes.Sites:
        return 'Sites';
      case RecipientTypes.Owner:
        return 'Owner';
      default:
        return '';
    }
  }

  public static RecipientTypesList(
    withAllOption: boolean = false,
    allOptionName: string = '<All>'
  ) {
    let result = [
      {
        Ref: RecipientTypes.Recipient,
        Name: DomainEnums.RecipientTypesName(RecipientTypes.Recipient),
      },
      {
        Ref: RecipientTypes.Vendor,
        Name: DomainEnums.RecipientTypesName(RecipientTypes.Vendor),
      },
      {
        Ref: RecipientTypes.DealCancelledCustomer,
        Name: DomainEnums.RecipientTypesName(
          RecipientTypes.DealCancelledCustomer
        ),
      },
      {
        Ref: RecipientTypes.Employee,
        Name: DomainEnums.RecipientTypesName(RecipientTypes.Employee),
      },
      {
        Ref: RecipientTypes.Sites,
        Name: DomainEnums.RecipientTypesName(RecipientTypes.Sites),
      },
      {
        Ref: RecipientTypes.Owner,
        Name: DomainEnums.RecipientTypesName(RecipientTypes.Owner),
      },
    ];
    if (withAllOption) {
      let allEntry = {
        Ref: RecipientTypes.None,
        Name: allOptionName,
      };
      result.unshift(allEntry);
    }
    return result;
  }

  public static PayerTypesName(itemType: PayerTypes) {
    switch (itemType) {
      case PayerTypes.Payers:
        return 'Payer';
      case PayerTypes.Vendor:
        return 'Vendor';
      case PayerTypes.DealDoneCustomer:
        return 'Deal Done Customer';
      case PayerTypes.Employee:
        return 'Employee';
      case PayerTypes.Sites:
        return 'Sites';
      case PayerTypes.Owner:
        return 'Owner';
      default:
        return '';
    }
  }

  public static PayerTypesList(
    withAllOption: boolean = false,
    allOptionName: string = '<All>'
  ) {
    let result = [
      {
        Ref: PayerTypes.Payers,
        Name: DomainEnums.PayerTypesName(PayerTypes.Payers),
      },
      {
        Ref: PayerTypes.Vendor,
        Name: DomainEnums.PayerTypesName(PayerTypes.Vendor),
      },
      {
        Ref: PayerTypes.DealDoneCustomer,
        Name: DomainEnums.PayerTypesName(PayerTypes.DealDoneCustomer),
      },
      {
        Ref: PayerTypes.Employee,
        Name: DomainEnums.PayerTypesName(PayerTypes.Employee),
      },
      {
        Ref: PayerTypes.Sites,
        Name: DomainEnums.PayerTypesName(PayerTypes.Sites),
      },
      {
        Ref: PayerTypes.Owner,
        Name: DomainEnums.PayerTypesName(PayerTypes.Owner),
      },
    ];
    if (withAllOption) {
      let allEntry = {
        Ref: PayerTypes.None,
        Name: allOptionName,
      };
      result.unshift(allEntry);
    }
    return result;
  }

  public static CustomerProgressName(itemType: CustomerProgress) {
    switch (itemType) {
      case CustomerProgress.OnGoingCustomer:
        return 'On Going Customer';
      case CustomerProgress.DealCancelCustomer:
        return 'Deal Cancel Customer';
      case CustomerProgress.DealDoneCustomer:
        return 'Deal Done Customer';
      case CustomerProgress.LeadClosedCustomer:
        return 'Lead Closed Customer';
      default:
        return '';
    }
  }

  public static CustomerProgressList(
    withAllOption: boolean = false,
    allOptionName: string = '<All>'
  ) {
    let result = [
      {
        Ref: CustomerProgress.OnGoingCustomer,
        Name: DomainEnums.CustomerProgressName(
          CustomerProgress.OnGoingCustomer
        ),
      },
      {
        Ref: CustomerProgress.DealCancelCustomer,
        Name: DomainEnums.CustomerProgressName(
          CustomerProgress.DealCancelCustomer
        ),
      },
      {
        Ref: CustomerProgress.DealDoneCustomer,
        Name: DomainEnums.CustomerProgressName(
          CustomerProgress.DealDoneCustomer
        ),
      },
      {
        Ref: CustomerProgress.LeadClosedCustomer,
        Name: DomainEnums.CustomerProgressName(
          CustomerProgress.LeadClosedCustomer
        ),
      },
    ];
    if (withAllOption) {
      let allEntry = {
        Ref: CustomerProgress.None,
        Name: allOptionName,
      };
      result.unshift(allEntry);
    }
    return result;
  }
}
