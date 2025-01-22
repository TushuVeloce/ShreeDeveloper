import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { CommonModule } from '@angular/common';
import { ThemeService } from 'src/app/services/theme.service';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { ServerCommunicatorService } from 'src/app/services/server-communicator.service';
import { SessionValues } from 'src/app/services/sessionvalues.service';
import { UIUtils } from 'src/app/services/uiutils.service';

interface SubModule {
  Name: string;
  RouterLink: string;
}

interface module {
  Name: string;
  RouterLink: string;
  WhiteLogo: string;
  BlackLogo: string;
  SubModuleList: SubModule[];
}


@Component({
  selector: 'app-sidebarlayout',
  templateUrl: './sidebarlayout.component.html',
  styleUrls: ['./sidebarlayout.component.scss'],
  imports: [CommonModule,
    FormsModule,
    NzLayoutModule,
    NzMenuModule,
    NzIconModule,RouterLink,]
})
export class SidebarlayoutComponent implements OnInit {
  constructor(public router: Router, public themeService: ThemeService, private el: ElementRef, private renderer: Renderer2,
    private appStateManagement: AppStateManageService,
    private sessionValues: SessionValues, private cdr: ChangeDetectorRef,
    private uiUtils: UIUtils) { }

  ModuleList: module[] = [];
  BrowserBack: boolean = false;
  isCollapsed: boolean = false;
  activeSubmodule: string | null = null;
  isShow: boolean = false;
  newModulename: string = '';
  oldModulename: string = '';
  name: string = '';


  async ngOnInit() {

  }
  title = 'my-project';

}