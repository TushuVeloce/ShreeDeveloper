import { Component, OnInit } from '@angular/core';
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
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  constructor() { }

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

}
