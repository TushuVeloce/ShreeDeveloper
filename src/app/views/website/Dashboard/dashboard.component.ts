import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppStateManageService } from 'src/app/services/app-state-manage.service';
import { CompanyStateManagement } from 'src/app/services/companystatemanagement';
import { DateconversionService } from 'src/app/services/dateconversion.service';
import { ScreenSizeService } from 'src/app/services/screensize.service';
import { UIUtils } from 'src/app/services/uiutils.service';

import {
  Chart,
  ChartConfiguration,
  ChartData,
  ChartEvent,
  ChartType,
  registerables
} from 'chart.js';
import { Expense } from 'src/app/classes/domain/entities/website/accounting/expense/expense';
import { OpeningBalance } from 'src/app/classes/domain/entities/website/masters/openingbalance/openingbalance';
import { BankAccount } from 'src/app/classes/domain/entities/website/masters/bankaccount/banckaccount';
import { Ledger } from 'src/app/classes/domain/entities/website/masters/ledgermaster/ledger';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  // Animated values
  shreeBalance: number = 0;
  cashBalance: number = 0;
  bankBalance: number = 0;
  companyRef = this.companystatemanagement.SelectedCompanyRef;
  BankList: OpeningBalance[] = [];
  IncomeBankList: BankAccount[] = [];
  LedgerList: any = [];
  LedgerColorShadesList: any = [];
  BalanceList: Expense[] = [];


  // Target values
  private shreeTarget: number = 0;
  private cashTarget: number = 0;
  private bankTarget: number = 0;

  BankAccountRef: number = 0;

  private duration: number = 2000; // total duration in ms

  constructor(
    private uiUtils: UIUtils,
    private router: Router,
    private DateconversionService: DateconversionService,
    private appStateManage: AppStateManageService,
    private screenSizeService: ScreenSizeService,
    private companystatemanagement: CompanyStateManagement
  ) { }

  ngOnInit() {
    this.getCurrentBalanceByCompanyRef();
    this.getLedgerListByCompanyRef();
    this.setIncomeExpenseChart();
    this.FormulateBankList();
  }

  setIncomeExpenseChart = () => {
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'Jul', 'Aug', 'Spet', 'Oct', 'Nov', 'Dec'];

    const data: ChartData<'bar'> = {
      labels: labels,
      datasets: [
        {
          label: 'Income :- ₹ 15,000',
          data: [7000, 6000, 5500, 8000, 12000, 9000, 11000, 7000, 6000, 5500, 8000, 12000],
          backgroundColor: 'rgba(122, 30, 30, 0.8)',
          borderRadius: 6
        },
        {
          label: 'Expense :- ₹ 10,000',
          data: [5000, 8000, 5500, 6500, 4000, 9000, 7000, 5000, 8000, 5500, 6500, 4000],
          backgroundColor: 'rgba(122, 30, 30, 0.2)',
          borderColor: 'rgba(122, 30, 30, 1)',
          borderWidth: 1,
          borderRadius: 6
        }
      ]
    };

    const config: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#7a1e1e',
              // font: { weight: '600' }
            }
          }
        },
        scales: {
          x: {
            ticks: { color: '#7a1e1e' },
            grid: { drawTicks: false }
          },
          y: {
            ticks: { color: '#7a1e1e' },
            beginAtZero: true
          }
        }
      }
    };

    new Chart('barChart', config);
  }


  generateShades = (count: number): string[] => {
    const colors: string[] = [];
    const hueStep = 360 / count; // spread evenly on color wheel

    for (let i = 0; i < count; i++) {
      const hue = Math.round(i * hueStep);
      colors.push(`hsl(${hue}, 70%, 50%)`);
    }

    return colors;
  }


  private animateValue(property: keyof DashboardComponent, target: number) {
    const startTime = performance.now();
    const startValue = 0;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / this.duration, 1);

      // Ease-out cubic
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      (this as any)[property] = Math.floor(startValue + (target - startValue) * easedProgress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  getCurrentBalanceByCompanyRef = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Expense.FetchCurrentBalanceByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.BalanceList = lst;
    if (lst.length > 0) {
      this.shreeTarget = lst[0].p.ShreesBalance;
    }

    let cash = lst.find((data) => data.p.ModeOfPayment == 'Cash');
    if (cash) {
      this.cashTarget = cash.p.NetBalance
    }

    // let bankTarget = lst.filter(item => item.p.ModeOfPayment.trim() === 'Bank').reduce((sum, item) => sum + (item.p.NetBalance || 0), 0);
    // if (bankTarget) {
    //   this.bankTarget = bankTarget
    // }
    this.getBankCurrentBalance();

    this.animateValue('shreeBalance', this.shreeTarget);
    this.animateValue('cashBalance', this.cashTarget);
    // this.animateValue('bankBalance', this.bankTarget);
  }

  getBankCurrentBalance = () => {
    if (this.BankAccountRef != 0) {
      let bankTarget = this.BalanceList.find((data) => data.p.BankAccountRef == this.BankAccountRef);
      if (bankTarget) {
        this.bankTarget = bankTarget.p.NetBalance;
      }
    } else {
      let allbankTarget = this.BalanceList.filter(item => item.p.ModeOfPayment.trim() === 'Bank').reduce((sum, item) => sum + (item.p.NetBalance || 0), 0);
      if (allbankTarget) {
        this.bankTarget = allbankTarget
      }
    }
    this.animateValue('bankBalance', this.bankTarget);
  }

  setDoughnutChart = () => {
    new Chart("doughnutChart", {
      type: 'doughnut',
      data: {
        labels: this.LedgerList,
        datasets: [{
          label: 'Expenses',
          data: [300, 50, 100, 70, 120, 300, 50, 100, 70, 120],
          backgroundColor: this.LedgerColorShadesList,
          hoverOffset: 4
        }]
      },

      options: {
        responsive: true,
        maintainAspectRatio: true,   // keeps it circular
        aspectRatio: 1,              // force square shape
        plugins: {
          legend: {
            position: 'right',       // as in your screenshot
            labels: {
              boxWidth: 15,
              padding: 10
            }
          }
        }
      }
    });
  }

  getLedgerListByCompanyRef = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await Ledger.FetchEntireListByCompanyRef(this.companyRef(), async errMsg => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.LedgerList = lst.map(item => item.p.Name);
    this.LedgerColorShadesList = this.generateShades(this.LedgerList.length);
    if (this.LedgerList.length > 0) {
      this.setDoughnutChart();
    }
  }

  public FormulateBankList = async () => {
    if (this.companyRef() <= 0) {
      await this.uiUtils.showErrorToster('Company not Selected');
      return;
    }
    let lst = await OpeningBalance.FetchEntireListByCompanyRef(this.companyRef(), async (errMsg) => await this.uiUtils.showErrorMessage('Error', errMsg));
    this.BankList = lst.filter((item) => item.p.BankAccountRef > 0 && (item.p.OpeningBalanceAmount > 0 || item.p.InitialBalance > 0));
  };

}
