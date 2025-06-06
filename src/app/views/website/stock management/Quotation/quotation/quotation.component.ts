import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UnitRefs } from 'src/app/classes/domain/constants';
import { DeleteUnitCustomRequest } from 'src/app/classes/domain/entities/website/masters/unit/DeleteUnitCustomRequest';
import { Unit } from 'src/app/classes/domain/entities/website/masters/unit/unit';
import { PayloadPacketFacade } from 'src/app/classes/infrastructure/payloadpacket/payloadpacketfacade';
import { TransportData } from 'src/app/classes/infrastructure/transportdata';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { ServerCommunicatorService } from 'src/app/services/server-communicator.service';
import { UIUtils } from 'src/app/services/uiutils.service';

@Component({
  selector: 'app-quotation',
  standalone: false,
  templateUrl: './quotation.component.html',
  styleUrls: ['./quotation.component.scss'],
})
export class QuotationComponent implements OnInit {

  constructor(private uiUtils: UIUtils, private router: Router, private appStateManage: AppStateManageService, private screenSizeService: ScreenSizeService, private payloadPacketFacade: PayloadPacketFacade,
    private serverCommunicator: ServerCommunicatorService) { }
  ngOnInit() { }

  AddQuotation = () => {
    this.router.navigate(['/homepage/Website/Quotation_Details']);
  }

}
