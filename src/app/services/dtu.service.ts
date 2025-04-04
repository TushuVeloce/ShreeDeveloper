import { Injectable } from '@angular/core';
import { Utils } from './utils.service';
import { ServiceInjector } from '../classes/infrastructure/injector';

@Injectable({
  providedIn: "root",
})
export class DTU {
  constructor(private utils: Utils) { }

  public static GetInstance(): DTU {
    return ServiceInjector.AppInjector.get(DTU)
  }

  private padZero = this.utils.PadZero;

  private timeZoneSeparator = "TZ";
  private dateTimePartsSeparator = "-";

  public DateOnlyFromString(value: string): Date {
    let parts = value.split(this.timeZoneSeparator);

    let vDateTime = parts[0];

    let dateTimeParts = vDateTime.split(this.dateTimePartsSeparator);

    let year = +dateTimeParts[0];
    let month = +dateTimeParts[1];
    let day = +dateTimeParts[2];

    return new Date(year, month - 1, day, 0, 0, 0, 0);
  }

  public DateOnlyStringFromString(value: string): string {
    let dt = this.DateOnlyFromString(value);
    return this.ConvertToString(dt);
  }

  public DateStartStringFromString(value: string): string {
    return this.DateOnlyStringFromString(value);
  }

  public DateStartStringFromDateValue(value: Date): string {
    let dtSOD = new Date(value.getFullYear(), value.getMonth(), value.getDate(), 0, 0, 0, 0);
    return this.ConvertToString(dtSOD);
  }

  public DateEndStringFromString(value: string): string {
    let dt = this.DateOnlyFromString(value);
    let dtEOD = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), 23, 59, 59, 999);
    return this.ConvertToString(dtEOD);
  }

  public DateEndStringFromDateValue(value: Date): string {
    let dtEOD = new Date(value.getFullYear(), value.getMonth(), value.getDate(), 23, 59, 59, 999);
    return this.ConvertToString(dtEOD);
  }

  public FromString(value: string): Date {
    let parts = value.split(this.timeZoneSeparator);

    let vDateTime = parts[0];

    let dateTimeParts = vDateTime.split(this.dateTimePartsSeparator);

    if (dateTimeParts.length === 3) {
      let year = +dateTimeParts[0];
      let month = +dateTimeParts[1];
      let day = +dateTimeParts[2];

      return new Date(year, month - 1, day, 0, 0, 0, 0);
    }
    else {
      let year = +dateTimeParts[0];
      let month = +dateTimeParts[1];
      let day = +dateTimeParts[2];
      let hour = +dateTimeParts[3];
      let minute = +dateTimeParts[4];
      let second = +dateTimeParts[5];
      let millisecond = +dateTimeParts[6];

      return new Date(year, month - 1, day, hour, minute, second, millisecond);
    }
  }

  public ConvertToString(value: Date): string {
    let result = `${this.padZero(value.getFullYear(), 4)}${this.dateTimePartsSeparator}`
      + `${this.padZero(value.getMonth() + 1, 2)}${this.dateTimePartsSeparator}`
      + `${this.padZero(value.getDate(), 2)}${this.dateTimePartsSeparator}`
      + `${this.padZero(value.getHours(), 2)}${this.dateTimePartsSeparator}`
      + `${this.padZero(value.getMinutes(), 2)}${this.dateTimePartsSeparator}`
      + `${this.padZero(value.getSeconds(), 2)}${this.dateTimePartsSeparator}`
      + `${this.padZero(value.getMilliseconds(), 3)}`;

    return result;
  }

  public StringToISORepresentation(value: string): string {
    let dt = this.FromString(value);

    let result = `${this.padZero(dt.getFullYear(), 4)}${this.dateTimePartsSeparator}`
      + `${this.padZero(dt.getMonth() + 1, 2)}${this.dateTimePartsSeparator}`
      + `${this.padZero(dt.getDate(), 2)}`; //${this.dateTimePartsSeparator}`;
    // + `T${this.padZero(dt.getHours(), 2)}:`
    // + `${this.padZero(dt.getMinutes(), 2)}:`
    // + `${this.padZero(dt.getSeconds(), 2)}.`
    // + `${this.padZero(dt.getMilliseconds(), 3)}`;

    return result;
  }

  public ISORepresentationForDayStartToString(isoValue: string): string {
    let parts = isoValue.split('T');

    let vDate = parts[0];
    // let vTime = parts[1];

    let dateParts = vDate.split(this.dateTimePartsSeparator);
    // let strTimeParts = vTime.split('Z')[0];
    // let timeParts = vTime.split(':');

    let year = +dateParts[0];
    let month = +dateParts[1];
    let day = +dateParts[2];
    let hour = 0;
    let minute = 0;
    let second = 0;
    let millisecond = 0;

    let dt = new Date(year, month - 1, day, hour, minute, second, millisecond);

    return this.ConvertToString(dt);
  }

  public ISORepresentationForDayEndToString(isoValue: string): string {
    let parts = isoValue.split('T');

    let vDate = parts[0];
    // let vTime = parts[1];

    let dateParts = vDate.split(this.dateTimePartsSeparator);
    // let strTimeParts = vTime.split('Z')[0];
    // let timeParts = vTime.split(':');

    let year = +dateParts[0];
    let month = +dateParts[1];
    let day = +dateParts[2];
    let hour = 23;
    let minute = 59;
    let second = 59;
    let millisecond = 999;

    let dt = new Date(year, month - 1, day, hour, minute, second, millisecond);

    return this.ConvertToString(dt);
  }

  public GetYearValue(value: string): number {
    return this.FromString(value).getFullYear();
  }

  public GetIndianDate(strDate: string, separator: string = this.dateTimePartsSeparator): string {
    if (strDate.trim().length == 0) return '';
    let dt = this.FromString(strDate);
    return `${this.padZero(dt.getDate(), 2)}${separator}${this.padZero(dt.getMonth() + 1, 2)}${separator}${this.padZero(dt.getFullYear(), 4)}`;
  }

  public GetIndianTime(strDate: string, separator: string = ":"): string {
    if (strDate.trim().length == 0) return '';
    let dt = this.FromString(strDate);
    return `${this.padZero(dt.getHours(), 2)}${separator}${this.padZero(dt.getMinutes(), 2)}${separator}${this.padZero(dt.getSeconds(), 2)}`;
  }

  public ValidateDateTimeRange(fromDateTime: string, toDateTime: string): string {
    if (fromDateTime.localeCompare(toDateTime) > 0) return `"""To Date/Time"" cannot be prior to ""From Date/Time"""`;
    return "";
  }

  public AddMilliseconds(dateTimeValue: string, milliSeconds: number): string {
    let newDateValue = this.FromString(dateTimeValue).valueOf() + milliSeconds;
    return this.ConvertToString(new Date(newDateValue));
  }
  public GetStringFormatByJSDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const milliseconds = String(date.getMilliseconds()).padStart(3, '0');

    return `${year} -${month} -${day} -${hours} -${minutes} -${seconds} -${milliseconds}`;
  }
  public ConvertStringDateToFullFormat(dateString: string): string {
    if (dateString != "") {
      // if (dateString.includes('-00-00-00')) {
      //   // Already in the desired format, return it directly
      //   return dateString;
      // }
      if (dateString.length > 10) {
        // Extract the first 10 characters (YYYY-MM-DD)
        dateString =  dateString.slice(0, 10);
      }
      const date = new Date(dateString);
      const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}-00-00-00-000`;

      return `${formattedDate}`;
    }
    return '';
  }
  public ConvertStringDateToShortFormat(dateString: string): string {
    if (dateString != "") {
      const formattedDate = dateString.split('-').slice(0, 3).join('-');
      return `${formattedDate}`;
    }
    return '';
  }
}
