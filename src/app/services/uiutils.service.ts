import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ServiceInjector } from '../classes/infrastructure/injector';
import Swal, { SweetAlertOptions, SweetAlertResult } from 'sweetalert2';
import { isNullOrUndefined } from 'src/tools';
import { ThemeService } from './theme.service';
import { Router } from '@angular/router';
import { AppStateManageService } from './app-state-manage.service';

class SwalResult {
  isConfirmed: boolean = false;
  isDenied: boolean = false;
  isDismissed: boolean = false;
}

@Injectable({
  providedIn: 'root'
})
export class UIUtils {
  public static GetInstance(): UIUtils {
    return ServiceInjector.AppInjector.get(UIUtils)
  }

  constructor(private alertController: AlertController, private themeService: ThemeService, private router: Router, private appStateManage: AppStateManageService,) { }

  public GlobalUIErrorHandler = async (errMsg: string) => {
    await this.showErrorMessage('Error', errMsg);
  }

  public async showErrorMessage(title: string, msg: string,
    okHandler: () => Promise<void> = null as any) {
    let result: SweetAlertResult = await Swal.fire({
      title: title,
      // text: msg,
      html: msg.replace(/\n/g, '<br>'), // <- REPLACE '\n' with <br> for line breaks
      icon: 'error',
      confirmButtonText: 'OK',
      allowOutsideClick: false,
      backdrop: false, // Removes full-screen overlay
      position: 'center',
      customClass: {
        popup: 'custom-popup',
      },
    });
    if (result.isConfirmed) {
      if (!isNullOrUndefined(okHandler)) {
        await okHandler();
      }
      if (msg.toLowerCase().includes('invalid login token')) {
        this.appStateManage.StorageKey.clear()
        await this.router.navigate(['']);
        return
      }
    }
  }

  public async showInformationalMessage(title: string, msg: string,
    okHandler?: () => Promise<void>) {
    let result = await Swal.fire(title, msg, 'info') as SwalResult;
    if (result.isConfirmed) {
      if (!isNullOrUndefined(okHandler)) {
        await okHandler!();
      }
      if (msg.toLowerCase().includes('invalid login token')) {
        this.appStateManage.StorageKey.clear()
        await this.router.navigate(['']);
        return
      }
    }

    // alert(msg);
    // if (!isNullOrUndefined(okHandler))
    // {
    //   await okHandler!();
    // }
    // const alert = await this.alertController.create({
    //   header: title,
    //   message: msg,
    //   buttons: [{
    //     text: 'OK',
    //     handler: okHandler
    //   }],
    //   backdropDismiss: false
    // });

    // await alert.present();
  }

  toastMixin = Swal.mixin({
    toast: true,
    icon: 'success',
    title: 'General Title',
    animation: false,
    position: 'top-right',
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  });

  public async showSuccessToster(title: string) {
    // Get the current theme from ThemeService
    const currentTheme = this.themeService.getCurrentTheme();

    // Determine background and text color based on the current theme
    // const backgroundColor = currentTheme === 'dark' ? 'white' : 'black'; // White background if dark theme, black otherwise
    // const textColor = currentTheme === 'dark' ? 'black' : 'white'; // Black text if dark theme, white otherwise

    // Use the toast mixin to show the toast
    this.toastMixin.fire({
      title: title,
      icon: 'success',
      //  background: backgroundColor, // Set background color based on theme
      //  color: textColor // Set text color based on theme
    });
  }

  private isAlertOpen = false;
  public async showConfirmationMessage(
    title: string,
    msg: string,
    confirmHandler: () => Promise<void> = null as any
  ) {
    // Prevent multiple popups from opening at the same time
    if (this.isAlertOpen) {
      return;
    }

    this.isAlertOpen = true; // Mark the alert as open

    try {
      let result: SweetAlertResult = await Swal.fire({
        title: title,
        html: msg,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        allowOutsideClick: false,
        backdrop: false,
        position: 'center',
        customClass: {
          popup: 'custom-popup',
        },
      });

      if (result.isConfirmed && confirmHandler) {
        await confirmHandler(); // Execute the confirmation action
      }
    } catch (error) {
      console.error("Error handling SweetAlert:", error);
    } finally {
      this.isAlertOpen = false; // Reset flag when alert is closed
    }
  }

  // status confirmation message
  public async showStatusConfirmationMessage(
    title: string,
    msg: string,
    statusOptions: string[], // Example: ['Pending', 'Approved', 'Cancel']
    handler: (selectedStatus: string) => Promise<void>
  ) {
    if (this.isAlertOpen) return;
    this.isAlertOpen = true;

    try {
      const inputOptions: any = {};
      statusOptions.forEach((status) => {
        inputOptions[status] = status;
      });

      const result = await Swal.fire({
        title: title,
        html: msg,
        icon: 'question',
        showCancelButton: true,
        showDenyButton: statusOptions.length >= 2,
        confirmButtonText: statusOptions[0],
        denyButtonText: statusOptions[1] || '',
        cancelButtonText: statusOptions[2] || 'Cancel',
        allowOutsideClick: false,
        backdrop: false,
        position: 'center',
        customClass: {
          popup: 'custom-popup',
        },
      });

      if (result.isConfirmed) {
        await handler(statusOptions[0]);
      } else if (result.isDenied && statusOptions[1]) {
        await handler(statusOptions[1]);
      } else if (result.dismiss === Swal.DismissReason.cancel && statusOptions[2]) {
        await handler(statusOptions[2]);
      }

    } catch (error) {
      console.error("Error handling SweetAlert:", error);
    } finally {
      this.isAlertOpen = false;
    }
  }




  public async showErrorToster(title: string) {
    this.toastMixin.fire({
      title: title,
      icon: 'error'
    });

    setTimeout(async () => {
      if (title.toLowerCase().includes('invalid login token')) {
        this.appStateManage.StorageKey.clear()
        await this.router.navigate(['']);
        return
      }
    }, 3000);
  }

  public async showWarningToster(title: string) {
    this.toastMixin.fire({
      title: title,
      icon: 'warning'
    });

    setTimeout(async () => {
      if (title.toLowerCase().includes('invalid login token')) {
        this.appStateManage.StorageKey.clear()
        await this.router.navigate(['']);
        return
      }
    }, 3000);
  }

  // public async askForConfirmation(title: string, msg: string,
  //   yesHandler?: () => void, noHandler?: () => void) {
  //   const alert = await this.alertController.create({
  //     header: title,
  //     message: msg,
  //     backdropDismiss: false,
  //     buttons: [
  //       {
  //         text: 'Yes',
  //         handler: yesHandler
  //       },
  //       {
  //         text: 'No',
  //         handler: noHandler
  //       }
  //     ]
  //   });

  //   await alert.present();
  // }

  public async askForConfirmation(title: string, msg: string,
    yesHandler: () => Promise<void> = null as any,
    noHandler: () => Promise<void> = null as any) {
    let result = await Swal.fire(<SweetAlertOptions>{
      title: title,
      html: msg,
      showConfirmButton: true,
      showDenyButton: true,
      confirmButtonText: 'Yes'
    }) as SwalResult;

    if (result.isConfirmed) {
      if (!isNullOrUndefined(yesHandler)) {
        await yesHandler();
      }
    }
    else if (result.isDenied) {
      if (!isNullOrUndefined(noHandler)) {
        await noHandler();
      }
    }

    // const alert = await this.alertController.create({
    //   header: title,
    //   message: msg,
    //   backdropDismiss: false,
    //   buttons: [
    //     {
    //       text: 'No',
    //       handler: noHandler
    //     },
    //     {
    //       text: 'Yes',
    //       handler: yesHandler
    //     }
    //   ]
    // });

    // await alert.present();
  }
  public async askForModalConfirmation(title: string, msg: string,
    yesHandler: () => Promise<void> = null as any,
    noHandler: () => Promise<void> = null as any) {
    let result = await Swal.fire(<SweetAlertOptions>{
      title: title,
      html: msg,
      confirmButtonText: 'Yes',
      showDenyButton: true
    }) as SwalResult;

    if (result.isConfirmed) {
      if (!isNullOrUndefined(yesHandler)) {
        await yesHandler();
      }
    }
    else if (result.isDenied) {
      if (!isNullOrUndefined(noHandler)) {
        await noHandler();
      }
    }

    // const alert = await this.alertController.create({
    //   header: title,
    //   message: msg,
    //   backdropDismiss: false,
    //   buttons: [
    //     {
    //       text: 'No',
    //       handler: noHandler
    //     },
    //     {
    //       text: 'Yes',
    //       handler: yesHandler
    //     }
    //   ]
    // });

    // await alert.present();
  }
}
