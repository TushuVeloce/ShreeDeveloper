// import { Injectable } from '@angular/core';
// import { ChangeDetectorRef, HostBinding, OnInit } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class ThemeService {
//   theme: 'dark' | 'light' = 'light'; // Default theme
//   IsDarkMode: boolean = false;

//   constructor() {
//     this.detectAndLogSystemTheme(); // Detect and log the system theme when component initializes
//     this.listenForThemeChanges(); // Listen for subsequent theme changes
//   }

//   detectAndLogSystemTheme(): void {
//     const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
//     this.theme = prefersDark ? 'dark' : 'light';
//     console.log('Detected theme:', this.theme); // Log the detected theme value
//     this.toggleTheme(this.theme);
//   }

//   listenForThemeChanges(): void {
//     window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
//       const newTheme = e.matches ? 'dark' : 'light';
//       if (newTheme !== this.theme) {
//         this.theme = newTheme;
//         console.log('Detected theme:', this.theme); // Log the detected theme value
//       }
//     });
//   }

//   toggleTheme(theme: string) {
//     if (theme == 'light') {
//       this.IsDarkMode = false;
//     }
//     else if (theme == 'dark') {
//       this.IsDarkMode = true;
//     }
//     // this.appStateManage.StorageKey.setItem('themePreference', this.isDarkTheme ? 'dark' : 'light');
//   }
// }


// theme.service.ts
import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AppStateManageService } from './app-state-manage.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  public theme: 'dark' | 'light' = 'dark'; // Default theme
  // IsDarkMode: boolean = false;
  // private themeSubject = new BehaviorSubject<'dark' | 'light'>(this.theme);
  // themeChanges$ = this.themeSubject.asObservable();
  public IsDarkModeSignal = signal(this.theme === 'dark')

  constructor(private appStateManage: AppStateManageService) {
    // ============= on toggle theme =================
    this.theme = appStateManage.getTheme() == 'dark' ? 'dark' : 'light'

    // ============= for system theme =================
    //this.detectAndLogSystemTheme(); // Detect and log the system theme when service initializes
    // this.listenForThemeChanges(); // Listen for subsequent theme changes
  }

  detectAndLogSystemTheme(): void {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.theme = prefersDark ? 'dark' : 'light';
    //console.log('Detected theme:', this.theme); // Log the detected theme value
    this.toggleTheme(this.theme);
  }

  listenForThemeChanges(): void {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      const newTheme = e.matches ? 'dark' : 'light';
      if (newTheme !== this.theme) {
        this.theme = newTheme;
        // console.log('Detected theme:', this.theme); // Log the detected theme value
        this.toggleTheme(this.theme); // Update the theme state
      }
    });
  }

  toggleTheme(theme: 'dark' | 'light') {
    // this.IsDarkMode = theme === 'dark';
    // this.themeSubject.next(theme); // Notify all subscribers about the theme change
    this.IsDarkModeSignal.set(theme === 'dark');

    // this.appStateManage.StorageKey.setItem('themePreference', this.IsDarkMode ? 'dark' : 'light');
  }
  getCurrentTheme(): 'dark' | 'light' {
    return this.theme; // Provide a method to get the current theme
  }

}
