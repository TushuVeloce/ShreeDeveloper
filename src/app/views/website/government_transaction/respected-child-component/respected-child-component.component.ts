import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-respected-child-component',
  templateUrl: './respected-child-component.component.html',
  styleUrls: ['./respected-child-component.component.scss'],
  standalone: false,

})
export class RespectedChildComponentComponent implements OnInit {
  SectionName: string = '';
  SectionName1: string = '';
  constructor(private router: Router, private route: ActivatedRoute) {
    let str = this.route.snapshot.params['queryParams'];
    console.log('str :', str);
    this.SectionName = str;
    this.SectionName1 = str;
  }

  ngOnInit() { }

}
