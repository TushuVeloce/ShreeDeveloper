export enum Gender {
  None = 0,
  Male = 10,
  Female = 20
}

export enum RoundOffTypes {
  None = 0,
  RoundDown = 10,
  RoundUp = 20,
  RoundAuto = 30
}


export class DomainEnums {

  public static RoundOffTypeName(RoundOffType: RoundOffTypes) {
    switch (RoundOffType) {
      case RoundOffTypes.RoundAuto: return 'Round Auto';
      case RoundOffTypes.RoundDown: return 'Round Down';
      case RoundOffTypes.RoundUp: return 'Round Up';
      default: return '';
    }
  }

  public static RoundOffTypeList(withAllOption: boolean = false, allOptionName: string = '<All>') {
    let result = [
      {
        Ref: RoundOffTypes.RoundAuto, Name: DomainEnums.RoundOffTypeName(RoundOffTypes.RoundAuto)
      },
      {
        Ref: RoundOffTypes.RoundDown, Name: DomainEnums.RoundOffTypeName(RoundOffTypes.RoundDown)
      },
      {
        Ref: RoundOffTypes.RoundUp, Name: DomainEnums.RoundOffTypeName(RoundOffTypes.RoundUp)
      }
    ]
    if (withAllOption) {
      let allEntry = {
        Ref: RoundOffTypes.None,
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
