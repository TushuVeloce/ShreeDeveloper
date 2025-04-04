import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GovernmentTransaction } from 'src/app/classes/domain/entities/website/government_office/government_transaction/governmenttransaction';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';

@Component({
  selector: 'app-respected-child-component',
  templateUrl: './respected-child-component.component.html',
  styleUrls: ['./respected-child-component.component.scss'],
  standalone: false,

})
export class RespectedChildComponentComponent implements OnInit {
  SectionName: string = '';
  SelectedTransactionType: string = '';

  Entity: GovernmentTransaction = GovernmentTransaction.CreateNewInstance();

  constructor(private router: Router, private route: ActivatedRoute, private appStateManage: AppStateManageService,) {
    let str = this.route.snapshot.params['queryParams'];
    // console.log('str :', str);
    this.SectionName = str;
    this.SelectedTransactionType = this.SectionName.split(',')[0];
    console.log(this.SelectedTransactionType);
  }

  ngOnInit() {
  }

}
