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

}
