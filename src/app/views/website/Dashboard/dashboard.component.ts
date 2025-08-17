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

  // Target values
  private shreeTarget: number = 800000;
  private cashTarget: number = 300000;
  private bankTarget: number = 400000;

  private duration: number = 2000; // total duration in ms

  constructor(
    private uiUtils: UIUtils,
    private router: Router,
    private DateconversionService: DateconversionService,
    private appStateManage: AppStateManageService,
    private screenSizeService: ScreenSizeService,
    private companystatemanagement: CompanyStateManagement
  ) { }

  ngAfterViewInit(): void {
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


  ngOnInit() {
    this.animateValue('shreeBalance', this.shreeTarget);
    this.animateValue('cashBalance', this.cashTarget);
    this.animateValue('bankBalance', this.bankTarget);

    new Chart("doughnutChart", {
      type: 'doughnut',
      data: {
        labels: ['Main Ledger 1', 'Main Ledger 2', 'Main Ledger 3', 'JCB', 'Contractor', 'Main Ledger 1', 'Main Ledger 2', 'Main Ledger 3', 'JCB', 'Contractor',],
        datasets: [{
          label: 'Expenses',
          data: [300, 50, 100, 70, 120, 300, 50, 100, 70, 120],
          backgroundColor: [
            'rgb(247, 133, 150)',   // Ledger 1
            'rgb(128, 0, 0)',       // Ledger 2
            'rgb(255, 182, 193)',   // Ledger 3 (light pink)
            'rgb(165, 42, 42)',     // JCB
            'rgb(205, 133, 63)',   // Contractor
            'rgb(247, 133, 150)',   // Ledger 1
            'rgb(128, 0, 0)',       // Ledger 2
            'rgb(255, 182, 193)',   // Ledger 3 (light pink)
            'rgb(165, 42, 42)',     // JCB
            'rgb(205, 133, 63)',   // Contractor
          ],
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

}
