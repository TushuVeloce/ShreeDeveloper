import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tp-office-details',
  templateUrl: './tp-office-details.component.html',
  styleUrls: ['./tp-office-details.component.scss'],
  standalone: false,

})
export class TpOfficeDetailsComponent implements OnInit {

  constructor() { }

  ngOnInit() { }

  GovermentList =
    [
      {
        "SiteWorkGroupName": "TP Office",
        "SiteWorkGroupRef": 27294,
        "SiteWorkGroupDisplayOrder": 1,
        "SiteWorks": [{
          "SiteWorkName": "Tentative Layout",
          "SiteWorkRef": 27320,
          "SiteWorkDisplayOrder": 1,
          "ApplicableTypes": [{
            "ApplicableType": 100,
            "SiteWorkApplicableTypeName": "Submit",
            "Value": ""
          }, {
            "ApplicableType": 200,
            "SiteWorkApplicableTypeName": "Inward No",
            "Value": ""
          }, {
            "ApplicableType": 300,
            "SiteWorkApplicableTypeName": "Inward Date",
            "Value": ""
          }
          ]
        }, {
          "SiteWorkName": "Survey Remark",
          "SiteWorkRef": 27321,
          "SiteWorkDisplayOrder": 2,
          "ApplicableTypes": [{
            "ApplicableType": 100,
            "SiteWorkApplicableTypeName": "Submit",
            "Value": ""
          }
          ]
        }, {
          "SiteWorkName": "ATP Site Visit",
          "SiteWorkRef": 27322,
          "SiteWorkDisplayOrder": 3,
          "ApplicableTypes": [{
            "ApplicableType": 100,
            "SiteWorkApplicableTypeName": "Submit",
            "Value": ""
          }
          ]
        }
        ]
      }, {
        "SiteWorkGroupName": "परिशिष्ठ A(NA)",
        "SiteWorkGroupRef": 27312,
        "SiteWorkGroupDisplayOrder": 2,
        "SiteWorks": [{
          "SiteWorkName": " T.P. पत्र",
          "SiteWorkRef": 27323,
          "SiteWorkDisplayOrder": 1,
          "ApplicableTypes": [{
            "ApplicableType": 100,
            "SiteWorkApplicableTypeName": "Submit",
            "Value": ""
          }, {
            "ApplicableType": 200,
            "SiteWorkApplicableTypeName": "Inward No",
            "Value": ""
          }, {
            "ApplicableType": 300,
            "SiteWorkApplicableTypeName": "Inward Date",
            "Value": ""
          }
          ]
        }, {
          "SiteWorkName": "प्राधिकरण Office पत्र",
          "SiteWorkRef": 27324,
          "SiteWorkDisplayOrder": 2,
          "ApplicableTypes": [{
            "ApplicableType": 100,
            "SiteWorkApplicableTypeName": "Submit",
            "Value": ""
          }
          ]
        }, {
          "SiteWorkName": "Tentative Order व नकाशा",
          "SiteWorkRef": 27325,
          "SiteWorkDisplayOrder": 3,
          "ApplicableTypes": [{
            "ApplicableType": 100,
            "SiteWorkApplicableTypeName": "Submit",
            "Value": ""
          }
          ]
        }
        ]
      }
    ]


  getTypeOnApplicableTypeName = (ApplicableTypesName: string): '' | 'checkbox' | 'number' | 'date' | 'radio' | 'text' => {
    switch (ApplicableTypesName) {
      case 'Submit': return 'checkbox';
      case 'Inward No': return 'number';
      case 'Date': return 'date';
      case 'Scrutiny Fees': return 'checkbox';
      default:
        return ''; // Default return value
    }
  }
}
