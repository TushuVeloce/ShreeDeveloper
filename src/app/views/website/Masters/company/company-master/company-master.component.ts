import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Company } from 'src/app/classes/domain/entities/website/masters/company/company';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { UIUtils } from 'src/app/services/uiutils.service';
import { Filesystem, Directory } from '@capacitor/filesystem';

import { Device } from '@capacitor/device';
import { ServerCommunicatorService } from 'src/app/services/server-communicator.service';
import { Utils } from 'src/app/services/utils.service';
import { BaseUrlService } from 'src/app/services/baseurl.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';



@Component({
  selector: 'app-company-master',
  standalone: false,
  templateUrl: './company-master.component.html',
  styleUrls: ['./company-master.component.scss'],
})
export class CompanyMasterComponent implements OnInit {

  Entity: Company = Company.CreateNewInstance();
  MasterList: Company[] = [];
  DisplayMasterList: Company[] = [];
  SearchString: string = '';
  SelectedCompany: Company = Company.CreateNewInstance();
  pageSize = 10; // Items per page
  currentPage = 1; // Initialize current page
  total = 0;
  imagePreviewUrl: string | null = null;
  ImageBaseUrl: string = "";
  TimeStamp = Date.now()
  LoginToken = '';
  headers: string[] = ['Sr.No.', 'Logo', 'Name', 'Owner Names', 'Contacts', ' GST No', ' Pan No', 'Action'];

  constructor(
    private uiUtils: UIUtils,
    private router: Router,
    private appStateManage: AppStateManageService,
    private serverCommunicatorService: ServerCommunicatorService,
    private baseUrl: BaseUrlService,
    public appStateManagement: AppStateManageService,
    private companystatemanagement: CompanyStateManagement,

  ) { }

  ngOnInit() {
    this.appStateManage.setDropdownDisabled(true);
    this.FormulateCompanyMasterList();
    this.loadPaginationData();
    this.ImageBaseUrl = this.baseUrl.GenerateImageBaseUrl();

    this.LoginToken = this.appStateManage.getLoginToken();
  }

  private FormulateCompanyMasterList = async () => {
    let lst = await Company.FetchEntireList(async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.MasterList = lst;
    this.DisplayMasterList = this.MasterList;
    this.loadPaginationData();
  }

  onEditClicked = async (item: Company) => {
    this.SelectedCompany = item.GetEditableVersion();
    Company.SetCurrentInstance(this.SelectedCompany);
    this.appStateManage.StorageKey.setItem('Editable', 'Edit');
    await this.router.navigate(['/homepage/Website/Company_Master_Details']);
  }

  onDeleteClicked = async (Company: Company) => {
    await this.uiUtils.showConfirmationMessage('Delete',
      `This process is <strong>IRREVERSIBLE!</strong> <br/>
      Are you sure that you want to DELETE this Company?`,
      async () => {
        await Company.DeleteInstance(async () => {
          await this.uiUtils.showSuccessToster(`Company ${Company.p.Name} has been deleted!`);
          this.SearchString = '';
          this.loadPaginationData();
          this.FormulateCompanyMasterList();
          setTimeout(() => {
            window.location.reload();
          }, 100);
        });
      });
  }

  OnDownloadDocument = async (company: Company) => {
    await this.uiUtils.showConfirmationMessage('Download',
      `Are you sure that you want to Download?`,
      async () => {
        await this.downloadDocument(company)
      });
  }

  loadImageFromBackend = (imageUrl: string) => {
    if (imageUrl) {
      return `${this.ImageBaseUrl}${imageUrl}/${this.LoginToken}?${this.TimeStamp}`;
    } else {
      return null;
    }
  }

  downloadDocument = async (SelectItem: Company) => {
    // code for download image
    try {

      let blobResponse = await this.serverCommunicatorService.DownloadDocument(SelectItem.p.LogoPath, this.appStateManage.getLoginToken())
      if (blobResponse == null || undefined) {
        alert("Error to get file")
        return
      }

      const platformInfo = await Device.getInfo();
      let ext2 = Utils.GetInstance().getMimeTypeFromFileName(blobResponse.type);
      let fileName = SelectItem.p.LogoPath || 'downloaded-file' + '.' + ext2;
      if (platformInfo.platform === 'web') {
        this.downloadInBrowser(blobResponse, fileName);
      } else {
        const base64Data = await this.convertBlobToBase64(blobResponse);
        const customPath = `Credai/${fileName}`;

        await Filesystem.writeFile({
          path: customPath,
          data: base64Data,
          directory: Directory.Documents,
          recursive: true
        });
        alert(`File saved to Documents folder: ${fileName}`);
      }

    } catch (error) {
      console.error('Download error:', error);

    }
  }

  private downloadInBrowser = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  private convertBlobToBase64 = (blob: Blob): Promise<string> => {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onerror = () => reject('File reading failed');
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.readAsDataURL(blob);
    });
  }

  // For Pagination  start ----
  loadPaginationData = () => {
    this.total = this.DisplayMasterList.length; // Update total based on loaded data
  }

  paginatedList = () => {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.DisplayMasterList.slice(start, start + this.pageSize);
  }

  onPageChange = (pageIndex: number): void => {
    this.currentPage = pageIndex; // Update the current page
  }

  AddCompany = () => {
    this.router.navigate(['/homepage/Website/Company_Master_Details']);
  }

  filterTable = () => {
    if (this.SearchString != '') {
      this.DisplayMasterList = this.MasterList.filter((data: any) => {
        return data.p.Name.toLowerCase().indexOf(this.SearchString.toLowerCase()) > -1
      })
    }
    else {
      this.DisplayMasterList = this.MasterList
    }
  }

}
