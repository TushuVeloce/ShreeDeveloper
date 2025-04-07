export class ValidationPatterns {
  // public static readonly Unit: string = "^[A-Za-z0-9./]+$";
  public static readonly Unit: string = "^[A-Za-z0-9./⁰¹²³⁴⁵⁶⁷⁸⁹₀₁₂₃₄₅₆₇₈₉]+$";
  public static readonly NameWithoutNos: string = "^[a-zA-Z\\s]+$";
  public static readonly NameWithNos: string = "^[a-zA-Z0-9]+$";
  public static readonly NameWithoutNoswith_: string = "^[a-zA-Z\\s_]+$";
  public static readonly Email: string = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$";
  public static readonly INDPhoneNo: string = "^[6789][0-9]{9}$";
  public static readonly Address: string = "^[a-zA-Z0-9 ,./#-]{5,100}$";


  public static readonly NameWithNosAndSpace: string = "^[a-zA-Z0-9\\s]+$";
  public static readonly NameWithNosAndSpaceAnd_: string = "^[a-zA-Z0-9\\s_]+$";

  public static readonly CurrencyRegex: string = "^[A-Za-z\\s$€£¥₹₩₽₦₪฿₫₴₲₵₣₱₲]+$";
  public static readonly CurrencySymbolRegex: string = "^[\\$€£¥₹₩₽₦₪฿₫₴₲₵₣₱؋]+|^[A-Za-z]{1,10}$";
  public static readonly CurrencyNameRegex: string = "^[A-Za-z\\s-]{1,30}$";
  public static readonly InputNumber: string = "^[0-9]{1,3}$"
  public static readonly PinCode: string = "^[0-9]{6}$";
  public static readonly Website: string = "https?://.+";
  public static readonly IFSC: string = "[A-Z]{4}0[A-Z0-9]{6}";
  public static readonly PAN: string = "[A-Z]{5}[0-9]{4}[A-Z]";
  public static readonly GSTIN: string = "[0-3][0-9][A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]";
  public static readonly demo: string = "demo";


}

export class ValidationMessages {
  public static readonly RequiredFieldMsg: string = "This field is required!";
  public static readonly UnitMsg: string = "Special char, _ , space not Allowed";
  public static readonly NameWithoutNosMsg: string = "Special char, _ ,Number not Allowed";
  public static readonly NameWithNosMsg: string = "Special char, _ and space not allowed";
  public static readonly NameWithoutNoswith_Msg: string = "Special char,Number not Allowed";
  public static readonly NameWithNosAndSpaceMsg: string = "Special char & _ not Allowed";
  public static readonly NameWithNosAndSpaceAnd_Msg: string = "Special char not Allowed";

  public static readonly EmailMsg: string = "Please enter a valid email address.";
  public static readonly INDPhoneNoMsg: string = "Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.";
  public static readonly InputNumberMsg: string = "Please enter a number between 0 and 999."
  public static readonly IPAddressMsg: string = "Please enter a valid IPv4 address (e.g., 192.168.1.1)."
  public static readonly ONVIFPortMsg: string = "Please enter a valid port number between 0 and 65535."

  public static readonly PinCodeMsg: string = "Please enter a valid 6-digit PIN code (starting with a number between 1 and 9).";

  public static readonly WebsiteMsg: string = "Please enter a valid URL starting with 'http://' or 'https://'.";

  public static readonly CurrencyRegexMsg: string = "Please enter a valid currency name or symbol. Only letters, spaces, and currency symbols are allowed.";
  public static readonly CurrencySymbolRegexMsg: string = "Please enter a valid currency symbol or currency code (up to 10 letters)";
  public static readonly CurrencyNameRegexMsg: string = "Please enter a valid name (letters, spaces, and hyphens only, up to 30 characters)";

  public static readonly UrlMsg: string = "Please enter a valid URL starting with 'http' or 'https'.";
  public static readonly GoogleLocationMsg: string = "Please enter a valid URL starting with 'http://', 'https://', or exactly 'www.google'.";
  public static readonly AddressMsg: string = "Please enter a valid address (letters, numbers, spaces, and common symbols such as comma, period, hyphen, slash, and hash).";

  public static readonly IFSCMsg: string = "Invalid IFSC Code!";
  public static readonly PANMsg: string = "Invalid PAN!";
  public static readonly GSTINMsg: string = "Invalid GSTIN!";
}

export class CountryStateCityRefs {
  public static readonly IndiaRef = 800051;
  public static readonly MaharashtraRef = 800051;
  public static readonly KolhapurRef = 800051;
}

export class AddressStateRefs {
  public static readonly HimachalPradesh: number = 800053;
  public static readonly JammuKashmir: number = 800052;
  public static readonly Punjab: number = 800054;
  public static readonly Chandigarh: number = 800055;
  public static readonly Uttarakhand: number = 800056;
  public static readonly Haryana: number = 800057;
  public static readonly Delhi: number = 800058;
  public static readonly Rajastan: number = 800059;
  public static readonly UttarPradesh: number = 800060;
  public static readonly Bihar: number = 800061;
  public static readonly Sikkim: number = 800062;
  public static readonly ArunachalPradesh: number = 800063;
  public static readonly Nagaland: number = 800064;
  public static readonly Manipur: number = 800065;
  public static readonly Mizoram: number = 800066;
  public static readonly Tripura: number = 800067;
  public static readonly Meghalaya: number = 800068;
  public static readonly Assam: number = 800069;
  public static readonly WestBengal: number = 800070;
  public static readonly Jharkhand: number = 800071;
  public static readonly Orrisa: number = 800072;
  public static readonly Chhattisgarh: number = 800073;
  public static readonly MadhyaPradesh: number = 800074;
  public static readonly Gujarat: number = 800075;
  public static readonly DamanAndDiu: number = 800076;
  public static readonly DadarAndNagarHaveli: number = 800077;
  public static readonly Maharashtra: number = 800078;
  public static readonly Karnataka: number = 800079;
  public static readonly Goa: number = 800080;
  public static readonly Lakshdweep: number = 800081;
  public static readonly Kerala: number = 800082;
  public static readonly TamilNadu: number = 800083;
  public static readonly Puducherry: number = 800084;
  public static readonly AndmanAndNicobar: number = 800085;
  public static readonly Telangana: number = 800086;
  public static readonly AndhraPradesh: number = 800087;
  public static readonly OtherTerritory: number = 800088;
  public static readonly OtherCountry: number = 800089;
}
