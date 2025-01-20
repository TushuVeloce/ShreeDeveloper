import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { TemplateRef, ViewChild } from '@angular/core';
import { NzDrawerRef, NzDrawerService } from 'ng-zorro-antd/drawer';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InputValidationsService {
  constructor(public http: HttpClient) { }
  // preventInvalidInput(event: KeyboardEvent) {
  //   const inputChar = String.fromCharCode(event.charCode);
  //   const regex = /^[a-zA-Z\s\-_"'’/]+$/;
  //   // Only allow letters (a-z, A-Z), and prevent input if character is invalid
  //   if (!regex.test(inputChar)) {
  //     event.preventDefault();
  //   }
  // }

  PlainTextInput(event: any, entity: any): void {
    const input = event.target.value;
    let namePattern: RegExp = /^[a-zA-Z\s\-']+$/;
    // Check if the last entered character is valid based on the regex
    const lastChar = input.charAt(input.length - 1);

    // If the last character doesn't match the pattern, prevent input
    if (!namePattern.test(lastChar)) {
      // Remove the invalid character from the input
      event.target.value = input.slice(0, -1);

      // Manually update the model (Entity.p.Name) to the valid input
      return entity = input.slice(0, -1);
    } else {
      // If valid, update the model as usual
      return entity = input;
    }
  }
  PlainTextWithNumberInput(event: any, entity: any): void {
    const input = event.target.value;
    let namePattern: RegExp = /^[a-zA-Z\s\-']+$/;
    // Check if the last entered character is valid based on the regex
    const lastChar = input.charAt(input.length - 1);

    // If the last character doesn't match the pattern, prevent input
    if (!namePattern.test(lastChar)) {
      // Remove the invalid character from the input
      event.target.value = input.slice(0, -1);

      // Manually update the model (Entity.p.Name) to the valid input
      return entity = input.slice(0, -1);
    } else {
      // If valid, update the model as usual
      return entity = input;
    }
  }
  EmailInput(event: any, entity: any): void {
    const input = event.target.value;
    let namePattern: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    // Check if the last entered character is valid based on the regex
    const lastChar = input.charAt(input.length - 1);

    // If the last character doesn't match the pattern, prevent input
    if (namePattern.test(lastChar)) {
      // Remove the invalid character from the input
      event.target.value = input.slice(0, -1);

      // Manually update the model (Entity.p.Name) to the valid input
      return entity = input.slice(0, -1);
    } else {
      // If valid, update the model as usual
      return entity = input;
    }
  }
  PasswordInput(event: any, entity: any): void {
    const input = event.target.value;
    let namePattern: RegExp = /^(?=.[a-z])(?=.[A-Z])(?=.\d)(?=.[!@#$%^&()_+{}\[\]:;<>,.?~\-=])[A-Za-z\d!@#$%^&()_+{}\[\]:;<>,.?~\-=]{8,64}$/;
    // Check if the last entered character is valid based on the regex
    const lastChar = input.charAt(input.length - 1);

    // If the last character doesn't match the pattern, prevent input
    if (!namePattern.test(lastChar)) {
      // Remove the invalid character from the input
      event.target.value = input.slice(0, -1);

      // Manually update the model (Entity.p.Name) to the valid input
      return entity = input.slice(0, -1);
    } else {
      // If valid, update the model as usual
      return entity = input;
    }
  }
  PhoneNumberInput(event: any, entity: any): void {
    const input = event.target.value;
    let namePattern: RegExp = /^\d+$/;
    // Check if the last entered character is valid based on the regex
    const lastChar = input.charAt(input.length - 1);

    // If the last character doesn't match the pattern, prevent input
    if (!namePattern.test(lastChar)) {
      // Remove the invalid character from the input
      event.target.value = input.slice(0, -1);

      // Manually update the model (Entity.p.Name) to the valid input
      return entity = input.slice(0, -1);
    } else {
      // If valid, update the model as usual
      return entity = input;
    }
  }
}
