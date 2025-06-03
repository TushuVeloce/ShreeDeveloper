import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { ValidationMessages, ValidationPatterns } from 'src/app/classes/domain/constants';
import { DomainEnums } from 'src/app/classes/domain/domainenums/domainenums';
import { UserProfile } from 'src/app/classes/domain/entities/website/profile/userprofile';
import { FileTransferObject } from 'src/app/classes/infrastructure/filetransferobject';

@Component({
  selector: 'app-your-profile',
  standalone: false,
  templateUrl: './your-profile.component.html',
  styleUrls: ['./your-profile.component.scss'],
})
export class YourProfileComponent  implements OnInit {
 Entity: UserProfile = UserProfile.CreateNewInstance();
  file: File | null = null;
  imageUrl: string | null = null;  // Add imageUrl to bind to src
  errors = { profile_image: '' };
  allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];

  INDPhoneNo: string = ValidationPatterns.INDPhoneNo

  INDPhoneNoMsg: string = ValidationMessages.INDPhoneNoMsg
  RequiredFieldMsg: string = ValidationMessages.RequiredFieldMsg

  @ViewChild('PhoneNosCtrl') phoneNosInputControl!: NgModel;


  constructor(private cdr: ChangeDetectorRef) { }

  // CountryCodeList = DomainEnums.CountryCodeList(true, '--Select Status--');

  // Handle file selection
  handleFileChange = (event: any) => {
    const fileInput = event.target.files[0];

    // Check if a file was selected
    if (fileInput) {
      // Validate file type
      if (this.allowedImageTypes.includes(fileInput.type)) {
        this.file = fileInput;
        this.errors.profile_image = '';  // Clear error if valid file

        // Create a URL for the image only if the file is not null
        if (this.file) {
          this.imageUrl = this.createObjectURL(this.file);  // No more error here
        }

        // Manually trigger change detection to avoid ExpressionChangedAfterItHasBeenCheckedError
        this.cdr.detectChanges();
      } else {
        // If file type is not an image, show an error message
        this.errors.profile_image = 'Only image files (JPG, PNG, GIF) are allowed';
        this.file = null;  // Reset file if it's invalid
        this.imageUrl = null;  // Clear the image URL
      }
    }
  }

  // Utility function to create object URL
  createObjectURL(file: File): string {
    return URL.createObjectURL(file);
  }

  selectAllValue(event: MouseEvent): void {
    const input = event.target as HTMLInputElement;
    input.select();
  }

  ngOnInit() {
    let a = 0
  }

  SaveProfile = async () => {

    if (this.file) {
      let lstFTO: FileTransferObject[] = [FileTransferObject.FromFileWithoutId(this.file, this.Entity.p.Name)];
      console.log(lstFTO);
    }

    // this.isSaveDisabled = true;
    // let entityToSave = this.Entity.GetEditableVersion();
    // let entitiesToSave: any;
    // await this.Entity.EnsurePrimaryKeysWithValidValues()
    // let tr = await this.utils.SavePersistableEntities(entitiesToSave, lstFTO);

    // if (!tr.Successful) {
    //   this.isSaveDisabled = false;
    //   this.uiUtils.showErrorMessage('Error', tr.Message);
    // }
    // else {
    //   this.isSaveDisabled = false;
    //   await this.uiUtils.showInformationalMessage('Save Space', 'Space saved successfully!');
    // this.Entity = UserProfile.CreateNewInstance();
    // if (this.IsNewEntity) {
    //   this.Entity = UserProfile.CreateNewInstance();
    // }
    // }
  }
}

